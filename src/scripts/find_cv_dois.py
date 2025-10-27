import requests
import re
import time
import json
import os
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional, Set, Union

@dataclass
class Publication:
    """Class for holding publication data from LaTeX CV"""
    original_text: str
    title: str
    authors: str = ""
    year: Optional[str] = None
    journal: Optional[str] = None
    doi: Optional[str] = None
    confidence: float = 0.0
    source: Optional[str] = None

def parse_cv_publications(text: str) -> List[Publication]:
    """Parse the LaTeX-formatted publication list into structured data"""
    publications = []
    
    # Find the publications section up to the next major section
    pubs_pattern = r'\\section\*\{Publications\}(.*?)(?=\\section\*\{|$)'
    pubs_match = re.search(pubs_pattern, text, re.DOTALL)
    
    if not pubs_match:
        print("Error: Publications section not found in CV")
        return publications
    
    pubs_content = pubs_match.group(1)
    
    # Find all subsections within publications
    subsections = re.split(r'\\subsection\*\{([^}]*)\}', pubs_content)
    
    # Process each subsection
    for i in range(1, len(subsections), 2):
        # Skip if we don't have both subsection name and content
        if i + 1 >= len(subsections):
            continue
            
        subsection_name = subsections[i]
        subsection_content = subsections[i + 1]
        
        # Extract individual publication entries
        # Look for patterns like \item or \yearsitem{year}
        entries = re.split(r'\\yearsitem\{[^}]*\}|\s*\\item\s+', subsection_content)
        
        # Skip the first empty entry (before the first \item or \yearsitem)
        for entry in entries[1:]:
            entry = entry.strip()
            if not entry:
                continue
                
            # Check if DOI already exists
            has_doi = 'doi:' in entry.lower() or 'doi.org' in entry.lower()
            
            # Extract year
            year_match = re.search(r'\((\d{4})\)', entry)
            year = year_match.group(1) if year_match else None
            
            # Extract venue/journal
            journal_match = re.search(r'\\emph{([^}]+)}', entry)
            journal = journal_match.group(1) if journal_match else None
            
            # We have specific knowledge about your CV structure:
            # Author list followed by title, then venue
            
            # Extract the title - usually after author list and before venue
            title = ""
            # Try to find the title - typically between first period and \emph
            if '.' in entry and '\\emph{' in entry:
                # Get text between first period and first \emph
                before_emph = entry.split('\\emph{', 1)[0]
                if '.' in before_emph:
                    title_part = before_emph.split('.', 1)[1].strip()
                    title = title_part
            
            # If no title found yet, try another approach
            if not title and '.' in entry:
                # Get the second segment (after author list)
                parts = entry.split('.', 2)
                if len(parts) > 1:
                    title = parts[1].strip()
            
            # Extract authors (usually at the beginning)
            authors = ""
            if '.' in entry:
                authors = entry.split('.', 1)[0].strip()
            
            # Clean up LaTeX commands and formatting
            pattern = r'\\(?:textbf|emph|href)\{[^}]*\}\{([^}]*)\}'
            authors = re.sub(pattern, r'\1', authors)  # Replace \command{...}{text} with text
            title = re.sub(pattern, r'\1', title)
            
            # More cleaning - simpler patterns
            authors = re.sub(r'\\textbf\{([^}]*)\}', r'\1', authors) 
            authors = re.sub(r'\\emph\{([^}]*)\}', r'\1', authors)
            title = re.sub(r'\\textbf\{([^}]*)\}', r'\1', title)
            title = re.sub(r'\\emph\{([^}]*)\}', r'\1', title)
            
            # Clean up remaining LaTeX artifacts
            authors = authors.replace('{', '').replace('}', '')
            title = title.replace('{', '').replace('}', '')
            
            # Skip if title is too short or empty
            if not title or len(title) < 5:
                continue
            
            # For debugging
            print(f"Found publication: {title[:50]}...")
            
            publications.append(Publication(
                original_text=entry,
                title=title,
                authors=authors,
                year=year,
                journal=journal,
                doi=None if not has_doi else "already_has_doi"
            ))
    
    return publications

def search_crossref(pub: Publication) -> Optional[str]:
    """Search for DOI using Crossref API with retry logic"""
    base_url = "https://api.crossref.org/works"
    
    # Skip if title is empty
    if not pub.title:
        return None
    
    # Build query parameters
    params = {
        'query': pub.title,
        'rows': 5
    }
    
    if pub.year:
        params['filter'] = f'from-pub-date:{pub.year},until-pub-date:{pub.year}'
    
    headers = {
        'User-Agent': 'DOIFinder/1.0 (mailto:your-email@example.com)'
    }
    
    # Retry parameters
    max_retries = 3
    retry_delay = 2  # seconds
    
    for attempt in range(max_retries):
        try:
            response = requests.get(base_url, params=params, headers=headers, timeout=10)
            
            # If we get rate limited, wait and retry
            if response.status_code == 429:
                retry_after = int(response.headers.get('Retry-After', retry_delay * (2 ** attempt)))
                print(f"Rate limited by Crossref API. Waiting {retry_after} seconds before retry {attempt+1}/{max_retries}")
                time.sleep(retry_after)
                continue
            
            # Handle other error codes
            if response.status_code != 200:
                print(f"Crossref API error: {response.status_code}, retry {attempt+1}/{max_retries}")
                time.sleep(retry_delay * (2 ** attempt))
                continue
            
            data = response.json()
            
            if data['message']['total-results'] > 0:
                best_match = data['message']['items'][0]
                
                # Calculate confidence based on title similarity
                api_title = best_match.get('title', [''])[0].lower()
                query_title = pub.title.lower()
                
                # Very basic similarity metric
                similarity = len(set(api_title.split()) & set(query_title.split())) / max(len(set(api_title.split())), len(set(query_title.split())))
                
                # If year is provided, check that it matches
                year_match = True
                if pub.year and 'published' in best_match:
                    api_year = str(best_match['published']['date-parts'][0][0])
                    year_match = api_year == pub.year
                
                # Only return DOI if confidence is high enough
                if similarity > 0.5 and year_match:
                    pub.confidence = similarity
                    pub.source = "Crossref"
                    return best_match['DOI']
            
            # Always add a small delay between requests to be nice to the API
            time.sleep(1)
            
        except requests.exceptions.Timeout:
            print(f"Crossref API timeout, retry {attempt+1}/{max_retries}")
            time.sleep(retry_delay * (2 ** attempt))
        except Exception as e:
            print(f"Error querying Crossref: {e}, retry {attempt+1}/{max_retries}")
            time.sleep(retry_delay * (2 ** attempt))
    
    print(f"Max retries reached for Crossref API or no DOI found")
    return None

def search_semantic_scholar(pub: Publication) -> Optional[str]:
    """Search for DOI using Semantic Scholar API with retry logic"""
    base_url = "https://api.semanticscholar.org/graph/v1/paper/search"
    
    # Skip if title is empty
    if not pub.title:
        return None
    
    params = {
        'query': pub.title,
        'limit': 5,
        'fields': 'title,year,externalIds'
    }
    
    # Retry parameters
    max_retries = 3
    retry_delay = 2  # seconds
    
    for attempt in range(max_retries):
        try:
            response = requests.get(base_url, params=params, timeout=10)
            
            # If we get rate limited, wait and retry
            if response.status_code == 429:
                retry_after = int(response.headers.get('Retry-After', retry_delay * (2 ** attempt)))
                print(f"Rate limited by Semantic Scholar API. Waiting {retry_after} seconds before retry {attempt+1}/{max_retries}")
                time.sleep(retry_after)
                continue
            
            # Handle other error codes
            if response.status_code != 200:
                print(f"Semantic Scholar API error: {response.status_code}, retry {attempt+1}/{max_retries}")
                time.sleep(retry_delay * (2 ** attempt))
                continue
            
            data = response.json()
            
            if data.get('total', 0) > 0:
                for paper in data.get('data', []):
                    # Check if year matches (if available)
                    if pub.year and 'year' in paper and str(paper['year']) != pub.year:
                        continue
                    
                    # Check if DOI exists
                    if 'externalIds' in paper and 'DOI' in paper['externalIds']:
                        pub.confidence = 0.8  # Arbitrary confidence
                        pub.source = "Semantic Scholar"
                        return paper['externalIds']['DOI']
            
            # Always add a small delay between requests to be nice to the API
            time.sleep(1)
            
        except requests.exceptions.Timeout:
            print(f"Semantic Scholar API timeout, retry {attempt+1}/{max_retries}")
            time.sleep(retry_delay * (2 ** attempt))
        except Exception as e:
            print(f"Error querying Semantic Scholar: {e}, retry {attempt+1}/{max_retries}")
            time.sleep(retry_delay * (2 ** attempt))
    
    print(f"Max retries reached for Semantic Scholar API or no DOI found")
    return None

def generate_updated_latex(cv_text: str, publications: List[Publication]) -> str:
    """Generate updated LaTeX with DOIs"""
    updated_text = cv_text
    
    # For each publication that has a found DOI
    for pub in publications:
        if not pub.doi or pub.doi == "already_has_doi":
            continue
        
        # Create a DOI link to add to the original text
        doi_link = f"\\href{{https://doi.org/{pub.doi}}}{{doi: {pub.doi}}}"
        
        # Find the original text
        original = pub.original_text
        
        # We need to find the right place to insert the DOI
        # Usually before the end of the sentence/paragraph
        if re.search(r'\.\s*$', original):
            # If it ends with a period, insert before it
            updated = re.sub(r'\.\s*$', f" {doi_link}.", original)
        else:
            # Otherwise add it at the end
            updated = f"{original} {doi_link}"
        
        # Make sure we're only replacing the exact original text to avoid
        # unintended replacements that might break LaTeX
        # Find the position of the original text in the document
        pos = updated_text.find(original)
        if pos >= 0:
            # Replace just this one occurrence
            updated_text = updated_text[:pos] + updated + updated_text[pos + len(original):]
        else:
            print(f"Warning: Could not locate exact position for inserting DOI for: {pub.title[:50]}...")
    
    return updated_text

def main(cv_path: str):
    """Main function to find DOIs for publications in a CV"""
    # Read CV text from file
    with open(cv_path, 'r', encoding='utf-8') as f:
        cv_text = f.read()
    
    # Parse publications
    publications = parse_cv_publications(cv_text)
    print(f"Found {len(publications)} publications in CV")
    
    # Count publications without DOIs
    needs_doi = [p for p in publications if p.doi != "already_has_doi" and p.title]
    print(f"Searching for DOIs for {len(needs_doi)} publications")
    
    # Search for DOIs using multiple sources
    for i, pub in enumerate(needs_doi):
        print(f"Processing {i+1}/{len(needs_doi)}: {pub.title[:50]}...")
        
        # Try Crossref first
        doi = search_crossref(pub)
        if doi:
            pub.doi = doi
            continue
        
        # Try Semantic Scholar if Crossref didn't find anything
        doi = search_semantic_scholar(pub)
        if doi:
            pub.doi = doi
            continue
        
        # Pause between publications to avoid rate limits (more conservative)
        time.sleep(3)  # Increased from 2 to 3 seconds to be even more conservative with API rate limits
    
    # Count how many DOIs were found
    found_count = sum(1 for p in needs_doi if p.doi)
    print(f"\nFound DOIs for {found_count} out of {len(needs_doi)} publications")
    
    # Generate updated LaTeX
    updated_text = generate_updated_latex(cv_text, needs_doi)
    
    # Write updated CV
    output_path = cv_path.replace('.tex', '_with_dois.tex')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(updated_text)
    
    print(f"\nUpdated CV saved to {output_path}")
    
    # Print results
    print("\nPublications with DOIs found:")
    for pub in needs_doi:
        if pub.doi:
            print(f"\nTitle: {pub.title}")
            print(f"Authors: {pub.authors}")
            print(f"Year: {pub.year}")
            print(f"DOI: {pub.doi}")
            print(f"Confidence: {pub.confidence:.2f}")
            print(f"Source: {pub.source}")
            print(f"URL: https://doi.org/{pub.doi}")

if __name__ == "__main__":
    # Get the path to the CV file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, '../..'))
    
    # Path to the CV file
    cv_path = os.path.join(project_root, 'src', 'data', 'cv', 'CV_ion.tex')
    
    # Check if the file exists
    if not os.path.exists(cv_path):
        print(f"CV file not found at {cv_path}")
        print("Please specify the correct path to your CV file.")
        exit(1)
    
    main(cv_path) 