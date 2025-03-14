import requests
import re
import time
import json
import os
from pathlib import Path
from dataclasses import dataclass, asdict, field
from typing import List, Dict, Optional, Set, Union, Any

@dataclass
class Publication:
    """Class for holding publication data from your website's format"""
    title: str
    authors: List[str] 
    year: Optional[Union[int, str]] = None
    venue: Optional[str] = None
    type: Optional[str] = None
    subcategory: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    location: Optional[str] = None
    doi: Optional[str] = None
    url: Optional[str] = None
    id: Optional[str] = None
    
    # For tracking the search results
    confidence: float = 0.0
    source: Optional[str] = None

def extract_title_from_description(description: str) -> str:
    """Extract the title from a description field if it doesn't already have a title"""
    if not description:
        return ""
    
    # If the description includes a period, assume the first part is the title
    parts = description.split('. ', 1)
    if len(parts) > 1:
        return parts[0]
    
    return description

def load_publications_from_json(json_path: str) -> List[Publication]:
    """Load publications from the website's JSON file"""
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    publications = []
    for pub in data.get('publications', []):
        # If the title is empty, try to extract it from the description
        title = pub.get('title', '')
        if not title and pub.get('description'):
            title = extract_title_from_description(pub.get('description', ''))
        
        # Create a Publication object
        publications.append(Publication(
            title=title,
            authors=pub.get('authors', []),
            year=pub.get('year'),
            venue=pub.get('venue'),
            type=pub.get('type'),
            subcategory=pub.get('subcategory'),
            description=pub.get('description'),
            status=pub.get('status'),
            location=pub.get('location'),
            doi=pub.get('doi'),
            url=pub.get('url'),
            id=pub.get('id')
        ))
    
    return publications

def search_crossref(pub: Publication) -> Optional[str]:
    """Search for DOI using Crossref API with retry logic"""
    base_url = "https://api.crossref.org/works"
    
    # Skip if the title is empty
    if not pub.title:
        return None
    
    # Build query parameters
    params = {
        'query': pub.title,
        'rows': 5
    }
    
    if pub.year:
        pub_year = str(pub.year)
        params['filter'] = f'from-pub-date:{pub_year},until-pub-date:{pub_year}'
    
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
                
                # Basic similarity metric
                similarity = len(set(api_title.split()) & set(query_title.split())) / max(len(set(api_title.split())), len(set(query_title.split())))
                
                # If year is provided, check that it matches
                year_match = True
                if pub.year and 'published' in best_match:
                    api_year = str(best_match['published']['date-parts'][0][0])
                    year_match = api_year == str(pub.year)
                
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
    
    # Skip if the title is empty
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
                    if pub.year and 'year' in paper and str(paper['year']) != str(pub.year):
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

def update_publications_json(json_path: str, publications: List[Publication]):
    """Update the publications.json file with the DOIs found"""
    # First read the original file to preserve structure
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    dois_found = 0
    urls_found = 0
    
    # Update the DOIs in the original data
    for pub_obj in publications:
        if not pub_obj.doi:
            continue
            
        # Find the matching publication in the original data
        for pub in data.get('publications', []):
            pub_title = pub.get('title', '')
            
            # If the title is empty, try to extract it from the description
            if not pub_title and pub.get('description'):
                pub_title = extract_title_from_description(pub.get('description', ''))
            
            # Check if this is the same publication
            if (pub_title.lower() == pub_obj.title.lower() and 
                pub.get('year') == pub_obj.year):
                
                # Update the DOI
                if not pub.get('doi') and pub_obj.doi:
                    pub['doi'] = pub_obj.doi
                    dois_found += 1
                
                # Add URL if DOI exists and URL doesn't
                if not pub.get('url') and pub_obj.doi:
                    pub['url'] = f"https://doi.org/{pub_obj.doi}"
                    urls_found += 1
                
                break
    
    # Write back to the file
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    return dois_found, urls_found

def main():
    # Determine the project root directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, '../..'))
    
    # Path to the publications.json file
    json_path = os.path.join(project_root, 'src', 'data', 'publications.json')
    
    # Load publications from JSON
    publications = load_publications_from_json(json_path)
    print(f"Found {len(publications)} publications in JSON file")
    
    # Count publications without DOIs
    needs_doi = [p for p in publications if not p.doi and p.title]
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
        time.sleep(2)
    
    # Count how many DOIs were found
    found_count = sum(1 for p in needs_doi if p.doi)
    print(f"\nFound DOIs for {found_count} out of {len(needs_doi)} publications")
    
    # Update the publications.json file
    dois_found, urls_found = update_publications_json(json_path, needs_doi)
    print(f"Updated {dois_found} DOIs and {urls_found} URLs in {json_path}")
    
    # Print results
    print("\nPublications with DOIs found:")
    for pub in needs_doi:
        if pub.doi:
            print(f"\nTitle: {pub.title}")
            if pub.authors:
                print(f"Authors: {', '.join(pub.authors)}")
            print(f"Year: {pub.year}")
            print(f"DOI: {pub.doi}")
            print(f"Confidence: {pub.confidence:.2f}")
            print(f"Source: {pub.source}")
            print(f"URL: https://doi.org/{pub.doi}")

if __name__ == "__main__":
    main() 