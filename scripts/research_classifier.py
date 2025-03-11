import argparse
import logging
import json
import os
from typing import Dict, List, Literal, Optional, Union
from pathlib import Path
import re
from dataclasses import dataclass

import pandas as pd
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from tqdm import tqdm
from config import setup_llm_creds, get_llm

class ResearchArea(BaseModel):
    """Classification of a research work into primary and secondary areas"""
    primary_area: Literal[
        "AI in Education",
        "Mathematics Education",
        "Educational Assessment",
        "STEM Education",
        "Learning Analytics",
        "Educational Technology"
    ]
    secondary_areas: List[str]
    keywords: List[str]
    collaborators: List[str]

class Publication(BaseModel):
    """Structure for a research publication"""
    title: str
    authors: List[str]
    venue: str
    year: int
    doi: Optional[str]
    classification: ResearchArea
    status: Literal["published", "in_review", "in_progress"]
    awards: Optional[List[str]]

class Grant(BaseModel):
    """Structure for a research grant"""
    title: str
    amount: str
    year: int
    role: str
    pi: str
    collaborators: Optional[List[str]] = None
    classification: ResearchArea

@dataclass
class LatexEntry:
    """Represents a parsed LaTeX entry (publication or grant)"""
    raw_text: str
    title: str
    authors: List[str]
    year: int
    venue: Optional[str] = None
    doi: Optional[str] = None
    amount: Optional[str] = None
    role: Optional[str] = None
    pi: Optional[str] = None

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def parse_latex_section(content: str, section_name: str) -> str:
    """Extract content from a LaTeX section"""
    logger.info(f"Searching for section: {section_name}")
    # Updated pattern to handle \sc and other LaTeX formatting in section names
    pattern = rf"\\section{{\\sc {section_name}}}(.*?)(?=\\section|\Z)"
    match = re.search(pattern, content, re.DOTALL)
    
    # If not found, try without \sc
    if not match:
        pattern = rf"\\section{{{section_name}}}(.*?)(?=\\section|\Z)"
        match = re.search(pattern, content, re.DOTALL)
    
    if not match:
        logger.warning(f"Section {section_name} not found in content")
        return ""
        
    section_content = match.group(1).strip()
    logger.info(f"Found section {section_name} with {len(section_content)} characters")
    return section_content

def parse_bibtex_entry(entry: str) -> LatexEntry:
    """Parse a BibTeX entry into structured data"""
    # Extract title
    title_match = re.search(r'title\s*=\s*[{"](.+?)[}"]', entry, re.DOTALL)
    title = title_match.group(1) if title_match else ""
    
    # Extract authors
    author_match = re.search(r'author\s*=\s*[{"](.+?)[}"]', entry, re.DOTALL)
    authors = []
    if author_match:
        # Split authors by 'and' or ',' and clean up
        authors = [a.strip() for a in re.split(r'\s+and\s+|\s*,\s*', author_match.group(1))]
    
    # Extract year
    year_match = re.search(r'year\s*=\s*[{"]?(\d{4})[}"]?', entry)
    year = int(year_match.group(1)) if year_match else 0
    
    # Extract venue/journal
    venue_match = re.search(r'journal\s*=\s*[{"](.+?)[}"]', entry, re.DOTALL)
    if not venue_match:
        venue_match = re.search(r'booktitle\s*=\s*[{"](.+?)[}"]', entry, re.DOTALL)
    venue = venue_match.group(1) if venue_match else ""
    
    # Extract DOI
    doi_match = re.search(r'doi\s*=\s*[{"](.+?)[}"]', entry)
    doi = doi_match.group(1) if doi_match else None
    
    return LatexEntry(
        raw_text=entry,
        title=title,
        authors=authors,
        year=year,
        venue=venue,
        doi=doi
    )

def parse_grant_entry(entry: str) -> LatexEntry:
    """Parse a grant entry from LaTeX"""
    # Extract title (assuming it's the first line or in \textbf{})
    title_match = re.search(r'\\textbf{(.+?)}', entry)
    if not title_match:
        title_match = re.search(r'^(.+?)[\n$]', entry)
    title = title_match.group(1) if title_match else ""
    
    # Extract amount (looking for dollar amounts or numbers)
    amount_match = re.search(r'\$[\d,]+(?:\.\d{2})?|\d+(?:,\d{3})*(?:\.\d{2})?', entry)
    amount = amount_match.group(0) if amount_match else None
    
    # Extract year
    year_match = re.search(r'(?:19|20)\d{2}', entry)
    year = int(year_match.group(0)) if year_match else 0
    
    # Extract role (PI, Co-PI, etc.)
    role_match = re.search(r'(?:PI|Co-PI|Senior Personnel|Investigator)', entry)
    role = role_match.group(0) if role_match else None
    
    # Extract PI name
    pi_match = re.search(r'PI:\s*(.+?)(?:\n|$)', entry)
    pi = pi_match.group(1) if pi_match else None
    
    # Extract collaborators
    collaborators = []
    collab_match = re.search(r'(?:Collaborators|with):\s*(.+?)(?:\n|$)', entry)
    if collab_match:
        collaborators = [c.strip() for c in collab_match.group(1).split(',')]
    
    return LatexEntry(
        raw_text=entry,
        title=title,
        authors=collaborators,
        year=year,
        amount=amount,
        role=role,
        pi=pi
    )

def classify_research_work(llm, content: str) -> ResearchArea:
    """Classify a piece of research work into research areas"""
    prompt = f"""
    Classify this academic work into research areas and extract relevant information.
    The work should be classified into one primary area and optional secondary areas.
    Also extract relevant keywords and collaborators.

    Academic work: {content}

    Please format your response as JSON with the following structure:
    {{
        "primary_area": "area name",
        "secondary_areas": ["area1", "area2"],
        "keywords": ["keyword1", "keyword2"],
        "collaborators": ["name1", "name2"]
    }}
    """

    response = llm.Complete.create(
        model="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        max_tokens=2048,
        top_p=0.7,
        top_k=50,
        repetition_penalty=1
    )

    try:
        result = json.loads(response['output']['choices'][0]['text'])
        return ResearchArea(
            primary_area=result["primary_area"],
            secondary_areas=result["secondary_areas"],
            keywords=result["keywords"],
            collaborators=result["collaborators"]
        )
    except Exception as e:
        logging.error(f"Error parsing LLM response: {e}")
        return ResearchArea(
            primary_area="Uncategorized",
            secondary_areas=[],
            keywords=[],
            collaborators=[]
        )

def parse_publications(content: str, llm) -> List[Publication]:
    """Parse publications from LaTeX content"""
    publications = []
    
    # Extract publications section
    publications_content = parse_latex_section(content, "Publications")
    
    # Split into individual entries
    pub_entries = re.split(r'\n\s*\n', publications_content)
    
    for pub_text in tqdm(pub_entries, desc="Processing publications"):
        if not pub_text.strip():
            continue
            
        try:
            # Extract basic publication info
            title_match = re.search(r'\\textbf{([^}]+)}', pub_text)
            title = title_match.group(1) if title_match else ""
            
            # Extract authors
            authors = []
            author_text = pub_text.split(title)[0] if title else pub_text
            author_matches = re.findall(r'\\textbf{([^}]+)}', author_text)
            if author_matches:
                authors = [author.strip() for author in author_matches]
            
            # Extract venue
            venue = ""  # Add venue extraction logic
            
            # Extract year
            year_match = re.search(r'\b(20\d{2})\b', pub_text)
            year = int(year_match.group(1)) if year_match else 0
            
            # Extract DOI if present
            doi_match = re.search(r"https://doi\.org/(.*?)(?:\s|\}|$)", pub_text)
            doi = doi_match.group(1) if doi_match else None
            
            pub = Publication(
                title=title,
                authors=authors,
                venue=venue,
                year=year,
                doi=doi,
                classification=classify_research_work(llm, pub_text),
                status="published" if "In review" not in pub_text else "in_review"
            )
            publications.append(pub)
            
        except Exception as e:
            logger.error(f"Error parsing publication: {e}\nText: {pub_text}")
            continue
    
    return publications

def process_publications(llm, latex_content: str) -> List[Publication]:
    """Process and classify publications from CV"""
    publications = []
    
    # Extract publications section
    pubs_content = parse_latex_section(latex_content, "Publications")
    
    # Split into individual entries (assuming they're separated by blank lines)
    pub_entries = re.split(r'\n\s*\n', pubs_content)
    
    for entry in tqdm(pub_entries, desc="Processing publications"):
        if not entry.strip():
            continue
            
        try:
            # Parse the publication entry
            pub_data = parse_bibtex_entry(entry)
            
            # Classify the publication
            classification = classify_research_work(llm, entry)
            
            # Create Publication object
            pub = Publication(
                title=pub_data.title,
                authors=pub_data.authors,
                venue=pub_data.venue or "",
                year=pub_data.year,
                doi=pub_data.doi,
                classification=classification,
                status="published",  # You might want to extract this from the entry
                awards=[]  # You might want to extract this from the entry
            )
            publications.append(pub)
            
        except Exception as e:
            logging.error(f"Error processing publication entry: {e}\nEntry: {entry}")
            continue
    
    return publications

def process_grants(llm, latex_content: str) -> List[Grant]:
    """Process and classify grants from CV"""
    grants = []
    
    # Extract grants section
    grants_content = parse_latex_section(latex_content, "Grants")
    
    # Split into individual entries
    grant_entries = re.split(r'\n\s*\n', grants_content)
    
    for entry in tqdm(grant_entries, desc="Processing grants"):
        if not entry.strip():
            continue
            
        try:
            # Parse the grant entry
            grant_data = parse_grant_entry(entry)
            
            # Classify the grant
            classification = classify_research_work(llm, entry)
            
            # Create Grant object
            grant = Grant(
                title=grant_data.title,
                amount=grant_data.amount or "Unknown",
                year=grant_data.year,
                role=grant_data.role or "Unknown",
                pi=grant_data.pi or "",
                collaborators=grant_data.authors,
                classification=classification
            )
            grants.append(grant)
            
        except Exception as e:
            logging.error(f"Error processing grant entry: {e}\nEntry: {entry}")
            continue
    
    return grants

def generate_research_areas_json(publications: List[Publication], 
                               grants: List[Grant]) -> Dict:
    """Generate structured JSON for the website"""
    research_areas = {}
    
    # Aggregate by research area
    for pub in publications:
        area = pub.classification.primary_area
        if area not in research_areas:
            research_areas[area] = {
                "publications": [],
                "grants": [],
                "collaborators": set(),
                "keywords": set()
            }
        research_areas[area]["publications"].append(pub)
        research_areas[area]["collaborators"].update(pub.authors)
        research_areas[area]["keywords"].update(pub.classification.keywords)
    
    # Add grants to research areas
    for grant in grants:
        area = grant.classification.primary_area
        if area in research_areas:
            research_areas[area]["grants"].append(grant)
            if hasattr(grant, 'collaborators') and grant.collaborators:
                research_areas[area]["collaborators"].update(grant.collaborators)
    
    return research_areas

def main():
    parser = argparse.ArgumentParser(description="Research CV classifier")
    parser.add_argument("--input", type=str, required=True, 
                       help="Input LaTeX CV file")
    parser.add_argument("--output", type=str, required=True,
                       help="Output directory for JSON files")
    
    args = parser.parse_args()
    
    # Setup LLM
    logger.info("Setting up LLM...")
    setup_llm_creds()
    llm = get_llm()
    
    # Read LaTeX content
    logger.info(f"Reading LaTeX file: {args.input}")
    try:
        with open(args.input, 'r') as f:
            latex_content = f.read()
        logger.info(f"Successfully read {len(latex_content)} characters from LaTeX file")
    except Exception as e:
        logger.error(f"Error reading LaTeX file: {e}")
        return
    
    # Process publications and grants
    logger.info("Processing publications...")
    publications = process_publications(llm, latex_content)
    logger.info(f"Found {len(publications)} publications")
    
    logger.info("Processing grants...")
    grants = process_grants(llm, latex_content)
    logger.info(f"Found {len(grants)} grants")
    
    # Generate structured data
    logger.info("Generating research areas JSON...")
    research_areas = generate_research_areas_json(publications, grants)
    logger.info(f"Generated {len(research_areas)} research areas")
    
    # Save output files
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_file = output_dir / 'research_areas.json'
    logger.info(f"Saving to {output_file}")
    with open(output_file, 'w') as f:
        json.dump(research_areas, f, indent=2)
    logger.info("Done!")

if __name__ == "__main__":
    main() 