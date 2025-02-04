import re
import json
import click
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime

@dataclass
class Publication:
    authors: List[str]
    title: str
    year: str
    venue: str
    type: str
    status: str
    doi: Optional[str] = None
    url: Optional[str] = None
    citation_count: int = 0
    abstract: Optional[str] = None
    keywords: List[str] = None
    pdf_url: Optional[str] = None
    presentation_url: Optional[str] = None
    impact_factor: Optional[float] = None

class CVImporter:
    def __init__(self, input_file: Path):
        self.input_file = input_file
        self.output_dir = Path("src/data/cv")
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def import_cv(self) -> Dict:
        """Import and parse CV content"""
        if not self.input_file.exists():
            raise FileNotFoundError(f"CV file not found: {self.input_file}")
            
        with open(self.input_file) as f:
            content = f.read()
            
        return {
            "contact": self.parse_contact(content),
            "education": self.parse_education(content),
            "publications_and_presentations": self.parse_publications_and_presentations(content)
        }

    def parse_contact(self, content: str) -> Dict:
        """Parse contact information section"""
        contact_section = re.search(
            r'\\section{\\sc Contact Information}(.*?)\\section',
            content,
            re.DOTALL
        )
        
        if not contact_section:
            return {}
            
        contact_text = contact_section.group(1)
        
        # Extract from your specific tabular format
        email_match = re.search(r'Email: (.*?)}', contact_text)
        github_match = re.search(r'GitHub: (.*?)}', contact_text)
        webpage_match = re.search(r'Webpage: (.*?)}', contact_text)
        
        # Extract institution info from first column
        institution_match = re.search(r'Marsal School of Education.*?Ann Arbor, MI \d{5}', 
                                    contact_text, 
                                    re.DOTALL)
        
        return {
            "email": email_match.group(1) if email_match else "",
            "github": github_match.group(1) if github_match else "",
            "webpage": webpage_match.group(1) if webpage_match else "",
            "institution": "Marsal School of Education",
            "department": "University of Michigan",
            "location": "Ann Arbor, MI 48104"
        }

    def parse_education(self, content: str) -> List[Dict]:
        """Parse education section based on CV_ion.tex format"""
        education = []
        education_section = re.search(
            r'\\section{\\sc Education}(.*?)\\section',
            content,
            re.DOTALL
        )
        
        if education_section:
            # Find all institutions (marked with \bf)
            institutions = re.findall(r'{\\bf (.*?)}(.*?)(?=\\bf|\\section)', 
                                    education_section.group(1),
                                    re.DOTALL)
            
            for institution, details in institutions:
                # Find all degrees in list3 environment
                degrees = re.findall(r'\\item\[\] (.*?)(?=\\item|\n|$)', 
                                   details,
                                   re.DOTALL)
                
                for degree in degrees:
                    # Extract advisor and committee if present
                    advisor_match = re.search(r'Advisor: (.*?),', degree)
                    committee_match = re.search(r'Commitee: (.*?)$', degree)
                    
                    # Extract degree details
                    degree_match = re.search(r'(.*?) in (.*?),\s*(.*?)(?=Advisor|$)', degree)
                    
                    if degree_match:
                        edu_entry = {
                            "institution": institution.strip(),
                            "degree": degree_match.group(1).strip(),
                            "field": degree_match.group(2).strip(),
                            "date": degree_match.group(3).strip()
                        }
                        
                        if advisor_match:
                            edu_entry["advisor"] = advisor_match.group(1).strip()
                        if committee_match:
                            committee = committee_match.group(1).strip()
                            edu_entry["committee"] = [
                                member.strip() 
                                for member in committee.split(',')
                            ]
                        
                        education.append(edu_entry)
        
        return education

    def parse_publications_and_presentations(self, content: str) -> Dict[str, List[Dict]]:
        """Parse all publications and presentations from CV_ion.tex"""
        output = {
            "peer_reviewed_journals": [],
            "conference_proceedings": [],
            "non_peer_reviewed": [],
            "presentations": {
                "conference_talks": [],
                "roundtable_discussions": [],
                "posters": []
            }
        }
        
        # Parse peer-reviewed journal articles
        journal_section = re.search(
            r'\\subsection{\\sc Peer-Reviewed Journal Articles}(.*?)\\subsection',
            content,
            re.DOTALL
        )
        if journal_section:
            items = re.findall(r'\\item (.*?)(?=\\item|\n|$)', 
                             journal_section.group(1),
                             re.DOTALL)
            for item in items:
                authors = re.findall(r'\\textbf{([^}]+)}|([^,]+?(?=,|\())', item)
                authors = [a[0] or a[1].strip() for a in authors if a[0] or a[1].strip()]
                
                year_match = re.search(r'\((.*?)\)', item)
                title_match = re.search(r'\)\.\s+(.*?)\.\s+\\textit', item)
                journal_match = re.search(r'\\textit{([^}]+)}', item)
                doi_match = re.search(r'\\url{([^}]+)}', item)
                volume_match = re.search(r'}, (\d+)', item)
                
                output["peer_reviewed_journals"].append({
                    "authors": authors,
                    "year": year_match.group(1) if year_match else "",
                    "title": title_match.group(1) if title_match else "",
                    "journal": journal_match.group(1) if journal_match else "",
                    "volume": volume_match.group(1) if volume_match else "",
                    "doi": doi_match.group(1) if doi_match else "",
                    "status": "in_review" if "In review" in item else 
                             "in_progress" if "In progress" in item else "published"
                })
        
        # Parse conference proceedings
        conf_section = re.search(
            r'\\subsection{\\sc Peer-Reviewed Conference Proceedings}(.*?)\\subsection',
            content,
            re.DOTALL
        )
        if conf_section:
            items = re.findall(r'\\item (.*?)(?=\\item|\n|$)', 
                             conf_section.group(1),
                             re.DOTALL)
            for item in items:
                authors = re.findall(r'\\textbf{([^}]+)}|([^,]+?(?=,|\())', item)
                authors = [a[0] or a[1].strip() for a in authors if a[0] or a[1].strip()]
                
                date_match = re.search(r'\((.*?)\)', item)
                title_match = re.search(r'\)\.\s+(.*?)\.\s+\\textit', item)
                venue_match = re.search(r'\\textit{([^}]+)}', item)
                location_match = re.search(r'}\.([^\.]+)$', item)
                
                output["conference_proceedings"].append({
                    "authors": authors,
                    "date": date_match.group(1) if date_match else "",
                    "title": title_match.group(1) if title_match else "",
                    "venue": venue_match.group(1) if venue_match else "",
                    "location": location_match.group(1).strip() if location_match else ""
                })
        
        # Parse non-peer-reviewed articles
        nonpeer_section = re.search(
            r'\\subsection{\\sc Non-peer-reviewed articles and blog posts}(.*?)\\newpage',
            content,
            re.DOTALL
        )
        if nonpeer_section:
            items = re.findall(r'\\item (.*?)(?=\\item|\n|$)', 
                             nonpeer_section.group(1),
                             re.DOTALL)
            for item in items:
                authors = re.findall(r'\\textbf{([^}]+)}|([^,]+?(?=,|\())', item)
                authors = [a[0] or a[1].strip() for a in authors if a[0] or a[1].strip()]
                
                date_match = re.search(r'\((.*?)\)', item)
                title_match = re.search(r'\)\.\s+(.*?)\.\s+\\textit', item)
                venue_match = re.search(r'\\textit{([^}]+)}', item)
                
                output["non_peer_reviewed"].append({
                    "authors": authors,
                    "date": date_match.group(1) if date_match else "",
                    "title": title_match.group(1) if title_match else "",
                    "venue": venue_match.group(1) if venue_match else ""
                })
        
        # Parse presentations
        for ptype, section_name in [
            ("conference_talks", "Conference Talks"),
            ("roundtable_discussions", "Roundtable Discussions"),
            ("posters", "Posters")
        ]:
            section = re.search(
                f'\\\\subsection{{\\\\sc {section_name}}}(.*?)(?=\\\\subsection|\\\\section)',
                content,
                re.DOTALL
            )
            if section:
                items = re.findall(r'\\item (.*?)(?=\\item|\n|$)', 
                                 section.group(1),
                                 re.DOTALL)
                for item in items:
                    authors = re.findall(r'\\textbf{([^}]+)}|([^,]+?(?=,|\())', item)
                    authors = [a[0] or a[1].strip() for a in authors if a[0] or a[1].strip()]
                    
                    date_match = re.search(r'\((.*?)\)', item)
                    title_match = re.search(r'\)\.\s+(.*?)\.\s*(?:\\textit|$)', item)
                    venue_match = re.search(r'\\textit{([^}]+)}', item)
                    location_match = re.search(r'}\.([^\.]+)$', item)
                    award_match = re.search(r"'([^']+)'", item)
                    
                    presentation = {
                        "authors": authors,
                        "date": date_match.group(1) if date_match else "",
                        "title": title_match.group(1) if title_match else "",
                        "venue": venue_match.group(1) if venue_match else "",
                        "location": location_match.group(1).strip() if location_match else ""
                    }
                    
                    if award_match:
                        presentation["award"] = award_match.group(1)
                        
                    output["presentations"][ptype].append(presentation)
        
        return output

    def parse_publications(self, content: str) -> List[Publication]:
        """Parse all publication types"""
        publications = []
        
        # Sections to parse with their types
        sections = {
            'Peer-Reviewed Journal Articles': 'journal',
            'Peer-Reviewed Conference Proceedings': 'conference',
            'Non-peer-reviewed articles': 'non_peer_reviewed'
        }
        
        for section_title, pub_type in sections.items():
            section = re.search(
                f'\\\\subsection{{\\\\sc {section_title}}}(.*?)(?=\\\\subsection|\\\\section)',
                content,
                re.DOTALL
            )
            if section:
                items = re.findall(r'\\item (.*?)(?=\\item|\n|$)', 
                                 section.group(1),
                                 re.DOTALL)
                for item in items:
                    pub = self._parse_publication_entry(item, pub_type)
                    if pub:
                        publications.append(pub)
        
        return publications

    def _parse_publication_entry(self, item: str, pub_type: str) -> Optional[Publication]:
        """Parse single publication entry"""
        try:
            authors_match = re.match(r'^(.*?)\.\s+', item)
            if not authors_match:
                return None
                
            authors = self.clean_authors(authors_match.group(1))
            remaining = item[authors_match.end():]
            
            # Extract year and status
            year_match = re.search(r'\((\d{4}|In review|In progress)\)', item)
            status = "published"
            if "In review" in item:
                status = "in_review"
            elif "In progress" in item:
                status = "in_preparation"
            
            # Extract title and venue
            title_match = re.search(r'\)\.\s+(.*?)\.\s+\\textit', remaining)
            venue_match = re.search(r'\\textit{([^}]+)}', remaining)
            doi_match = re.search(r'\\url{([^}]+)}', remaining)
            
            return Publication(
                authors=authors,
                title=self.clean_text(title_match.group(1)) if title_match else "",
                year=year_match.group(1) if year_match else "",
                venue=venue_match.group(1) if venue_match else "",
                type=pub_type,
                status=status,
                doi=doi_match.group(1) if doi_match else None,
                url=None,
                citation_count=0,
                abstract=None,
                keywords=[],
                pdf_url=None,
                presentation_url=None,
                impact_factor=None
            )
        except Exception as e:
            print(f"Error parsing publication: {e}")
            return None

    def validate_publication(self, pub: Publication) -> List[str]:
        """Validate publication entry"""
        errors = []
        
        if not pub["authors"]:
            errors.append("Publication must have at least one author")
        
        if not pub["title"]:
            errors.append("Publication must have a title")
            
        if pub["year"] and not (
            pub["year"].isdigit() or 
            pub["year"] in ["In review", "In progress"]
        ):
            errors.append("Invalid year format")
            
        if pub["type"] not in ["journal", "conference", "chapter", "preprint", "non_peer_reviewed"]:
            errors.append("Invalid publication type")
            
        if pub["status"] not in ["published", "in_review", "in_preparation"]:
            errors.append("Invalid publication status")
            
        return errors

    def save_data(self, data: Dict):
        """Save parsed CV data to JSON files"""
        for section, content in data.items():
            output_file = self.output_dir / f"{section}.json"
            with open(output_file, 'w') as f:
                json.dump(content, f, indent=2)
            print(f"Saved {section} data to {output_file}")

@click.command()
@click.option('--input-file', 
              type=click.Path(exists=True, path_type=Path),
              prompt='Please enter the path to your CV file',
              help='Path to your LaTeX CV file')
@click.option('--preview',
              is_flag=True,
              help='Preview parsed data before saving')
def main(input_file: Path, preview: bool):
    """Import CV data from LaTeX file"""
    try:
        importer = CVImporter(input_file)
        data = importer.import_cv()
        
        if preview:
            print("\nParsed Data Preview:")
            for section, content in data.items():
                print(f"\n{section.upper()}:")
                print(json.dumps(content, indent=2))
            
            if click.confirm("Save this data?"):
                importer.save_data(data)
        else:
            importer.save_data(data)
            
        # Print summary
        print("\nImport Summary:")
        for section, content in data.items():
            if isinstance(content, dict):
                total = len(content)
            elif isinstance(content, list):
                total = len(content)
            else:
                total = 1
            print(f"- {section.title()}: {total} entries")
            
    except Exception as e:
        click.echo(f"Error importing CV: {e}", err=True)
        raise click.Abort()

if __name__ == "__main__":
    main() 