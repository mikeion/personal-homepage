import re
import json
from pathlib import Path
import argparse
import sys

def clean_latex(text):
    """Clean LaTeX special characters and commands."""
    if not text:
        return ""
    
    # Remove specific LaTeX commands
    text = re.sub(r'\\textbf{([^}]*)}', r'\1', text)
    text = re.sub(r'\\emph{([^}]*)}', r'\1', text)
    text = re.sub(r'\\href{[^}]*}{([^}]*)}', r'\1', text)
    text = re.sub(r'\\yearsitem{[^}]*}', '', text)
    text = re.sub(r'\\item', '', text)
    text = re.sub(r'\\end{[^}]*}', '', text)
    text = re.sub(r'\\begin{[^}]*}', '', text)
    
    # Remove common LaTeX special chars
    text = text.replace('\\&', '&')
    
    # Clean up whitespace
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()

def extract_authors(pub_text):
    """Extract full author names from a publication entry."""
    clean_text = clean_latex(pub_text)

    # Find the end of the author list (usually ends with a year in parentheses or a period)
    author_end = -1
    year_pos = clean_text.find('(')
    period_pos = clean_text.find('.')

    if year_pos > 0:
        author_end = year_pos
    elif period_pos > 0:
        author_end = period_pos

    if author_end > 0:
        author_section = clean_text[:author_end].strip()
        author_section = author_section.replace(' and ', ', ')
        authors = [author.strip() for author in author_section.split(',') if author.strip()]
    else:
        authors = ["Ion, M."]

    # Remove duplicates while preserving order
    seen = set()
    authors = [x for x in authors if not (x in seen or seen.add(x))]

    return authors

def determine_publication_type(subsection_name):
    """Determine the publication type based on the subsection name."""
    subsection_lower = subsection_name.lower()
    
    if 'journal' in subsection_lower:
        return 'journal'
    elif 'conference' in subsection_lower or 'proceedings' in subsection_lower:
        return 'conference'
    elif 'book' in subsection_lower:
        return 'book_chapter'
    elif 'article' in subsection_lower or 'non-peer' in subsection_lower:
        return 'article'
    elif 'poster' in subsection_lower:
        return 'poster'
    elif 'talk' in subsection_lower or 'lecture' in subsection_lower:
        return 'talk'
    else:
        # Default to generic publication
        return 'publication'

def parse_publication(pub_text, current_section):
    """Parse a publication entry."""
    publication = {}
    
    # Clean the text
    pub_text = clean_latex(pub_text)
    
    # Extract authors
    authors = extract_authors(pub_text)
    publication["authors"] = authors
    
    # Extract year
    year_match = re.search(r'\((\d{4})[a-z]?\)', pub_text)
    if year_match:
        publication["year"] = int(year_match.group(1))
    
    # Extract DOI if present
    doi_match = re.search(r'doi:([^\s,]+)', pub_text, re.IGNORECASE)
    if doi_match:
        publication["doi"] = doi_match.group(1)
    
    # Extract URL if present
    url_match = re.search(r'\\url{([^}]+)}|\\href{([^}]+)}{[^}]+}', pub_text)
    if url_match:
        url = url_match.group(1) or url_match.group(2)
        if url and not url.startswith('doi:'):
            publication["url"] = url
    
    # Extract location if present
    location_match = re.search(r'([A-Za-z]+, [A-Za-z]+)', pub_text)
    if location_match:
        publication["location"] = location_match.group(1)
    
    # Extract award if present
    award_match = re.search(r'(Best Paper Award|Outstanding Paper Award|Honorable Mention|Blue Ribbon Outstanding Presenter Award)', pub_text, re.IGNORECASE)
    if award_match:
        publication["award"] = award_match.group(1)
    
    # Determine publication type based on section and content
    publication_type = determine_publication_type(current_section)
    publication["type"] = publication_type
    
    # Add subcategory based on the section
    publication["subcategory"] = current_section
    
    # Extract title based on known patterns in the CV
    title = ""
    
    # Map of known titles and descriptions
    known_publications = {
        "Bayesian Hierarchical Modeling": {
            "title": "Bayesian Hierarchical Modeling of Large-Scale Math Tutoring Dialogues",
            "description": "A statistical approach to analyzing mathematical tutoring conversations at scale, using Bayesian methods to understand patterns in student-tutor interactions."
        },
        "Simulated Teaching and Learning at Scale": {
            "title": "Simulated Teaching and Learning at Scale: Balancing Fidelity and Effectiveness in Tutoring Interactions",
            "description": "Investigation of how AI-generated educational dialogues can balance realistic student behavior simulation with effective learning outcomes."
        },
        "Teaching and Learning in the Age of Generative AI": {
            "title": "Teaching and Learning in the Age of Generative AI: Understanding the Human Work of Instruction",
            "description": "Analysis of the essential human elements of teaching that persist in an era of AI-assisted education."
        },
        "Teaching Geometry for Secondary Teachers": {
            "title": "Teaching Geometry for Secondary Teachers: What are the Tensions Instructors Need to Manage?",
            "description": "Study of the challenges and decisions instructors face when teaching geometry to future teachers."
        },
        "Alumni Perspectives on General Education": {
            "title": "Alumni Perspectives on General Education: How Writing Can Increase What We Know",
            "description": "Research on how writing assignments in general education courses contribute to long-term learning outcomes."
        },
        "Surveying Instructors of Geometry for Teachers Courses": {
            "title": "Surveying Instructors of Geometry for Teachers Courses: An Illustration of Balanced Incomplete Block Design",
            "description": "Application of survey methodology to understand instructor practices in geometry education courses."
        },
        "How Instructors of Undergraduate Mathematics Courses Manage Tensions": {
            "title": "How Instructors of Undergraduate Mathematics Courses Manage Tensions Related to Teaching Courses for Teachers",
            "description": "Investigation of teaching practices and decision-making in undergraduate mathematics courses designed for future teachers."
        },
        "Learning from Lesson Study": {
            "title": "Learning from Lesson Study in the College Geometry Classroom",
            "description": "Analysis of the lesson study approach applied to college-level geometry instruction."
        },
        "Building Instructional Capacity Across Difference": {
            "title": "Building Instructional Capacity Across Difference: Analyzing Transdisciplinary Discourse in a Faculty Learning Community focused on Geometry for Teachers Courses",
            "description": "Study of how faculty from different disciplines collaborate to improve geometry instruction for future teachers."
        },
        "Conceptions of the Derivative": {
            "title": "Conceptions of the Derivative: A Natural Language Processing Approach",
            "description": "Application of NLP techniques to analyze student understanding of calculus concepts."
        }
    }
    
    # Check if any known publication is in the text
    for key, pub_info in known_publications.items():
        if key in pub_text:
            title = pub_info["title"]
            publication["description"] = pub_info["description"]
            break
    
    # If no known title was found, try to extract it from the text
    if not title:
        # Try to extract title after author and year
        if authors and year_match:
            # Find the text after the year parenthesis
            after_year = pub_text[year_match.end():]
            
            # Look for the first period that's not part of an abbreviation
            period_match = re.search(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s', after_year)
            if period_match:
                title = after_year[:period_match.start()+1].strip()
                # Try to use the next sentence as description if it exists
                next_sentence = after_year[period_match.start()+1:].strip()
                if next_sentence and len(next_sentence) > 20:  # Only use if it's a substantial description
                    publication["description"] = clean_latex(next_sentence)
            else:
                # If no clear period, take everything until the first "In" or end
                in_match = re.search(r'\sIn\s', after_year)
                if in_match:
                    title = after_year[:in_match.start()].strip()
                else:
                    title = after_year.strip()
    
    # Clean up the title
    if title:
        # Remove leading punctuation
        title = re.sub(r'^[.,:\s]+', '', title)
        # Remove trailing punctuation except for question marks and exclamation points
        title = re.sub(r'[.,:\s]+$', '', title)
    
    publication["title"] = title
    
    # Extract venue
    venue = ""
    
    # Map of known venues from the CV
    known_venues = {
        "Joint Statistical Meetings": "Joint Statistical Meetings",
        "Learning @ Scale": "Learning @ Scale",
        "For the Learning of Mathematics": "For the Learning of Mathematics",
        "International Journal of Research in Undergraduate Mathematics Education": "International Journal of Research in Undergraduate Mathematics Education",
        "Journal of General Education": "Journal of General Education",
        "Psychology of Mathematics Education, North America Annual Conference": "Psychology of Mathematics Education, North America Annual Conference",
        "Annual Conference on Research in Undergraduate Mathematics Education": "Annual Conference on Research in Undergraduate Mathematics Education",
        "American Educational Research Association": "American Educational Research Association",
        "Research in Undergraduate Mathematics Education Conference": "Research in Undergraduate Mathematics Education Conference",
        "Psychology of Mathematics Education, North America": "Psychology of Mathematics Education, North America",
        "American Education Research Association": "American Education Research Association",
        "AMTE Handbook of Mathematics Teacher Education": "AMTE Handbook of Mathematics Teacher Education",
        "GeT: The News!": "GeT: The News!",
        "AMS Blogs: On Teaching and Learning Mathematics": "AMS Blogs: On Teaching and Learning Mathematics",
        "iRAISE Workshop at AAAI Conference": "iRAISE Workshop at AAAI Conference",
        "Undergraduate Research Opportunity Program (UROP) Symposium": "Undergraduate Research Opportunity Program (UROP) Symposium",
        "Conference of the International Group for the Psychology of Mathematics Education": "Conference of the International Group for the Psychology of Mathematics Education",
        "National Council of Teachers of Mathematics": "National Council of Teachers of Mathematics",
        "Joint Mathematics Meeting": "Joint Mathematics Meeting",
        "Association of Mathematics Teacher Educators Annual Conference": "Association of Mathematics Teacher Educators Annual Conference",
        "Michigan Institute for Data Science Annual Symposium": "Michigan Institute for Data Science Annual Symposium"
    }
    
    # Check if any known venue is in the text
    for key, full_venue in known_venues.items():
        if key in pub_text:
            venue = full_venue
            break
    
    # If no known venue was found, try to extract it from the text
    if not venue:
        # Look for text in italics (emph) which is often the venue
        if "In " in pub_text:
            venue_match = re.search(r'In (.*?)(?:,|\.|$)', pub_text)
            if venue_match:
                venue = venue_match.group(1).strip()
        elif "Presented at " in pub_text:
            venue_match = re.search(r'Presented at (.*?)(?:,|\.|$)', pub_text)
            if venue_match:
                venue = venue_match.group(1).strip()
        elif "emph{" in pub_text:
            venue_match = re.search(r'\\emph{([^}]*)}', pub_text)
            if venue_match:
                venue = venue_match.group(1).strip()
    
    if venue:
        publication["venue"] = venue
    
    # Determine status (published, in press, etc.)
    if "in press" in pub_text.lower():
        publication["status"] = "in_press"
    elif "under review" in pub_text.lower() or "in review" in pub_text.lower():
        publication["status"] = "under_review"
    elif "in preparation" in pub_text.lower() or "in prep" in pub_text.lower():
        publication["status"] = "in_preparation"
    else:
        publication["status"] = "published"
    
    return publication

def parse_grant(grant_text, current_section):
    """Parse a single grant entry using a direct approach tailored to the CV format."""
    if not grant_text.strip():
        return None
    
    # Clean text for processing
    clean_text = clean_latex(grant_text)
    
    # Skip entries that are just itemize environments or very short
    if len(clean_text.strip()) < 10:
        return None
    
    # Initialize grant data
    grant = {
        'status': 'in_review' if 'In Review' in current_section else 'awarded',
        'collaborators': []
    }
    
    # Extract year
    year_match = re.search(r'\\yearsitem{([^}]*)}', grant_text)
    if year_match:
        grant['year'] = year_match.group(1)
    else:
        # Try year in format yyyy-yyyy or yyyy
        year_pattern = re.search(r'(\d{4}(?:-\d{4})?)', grant_text)
        if year_pattern:
            grant['years'] = year_pattern.group(1)
    
    # Extract role
    role_match = re.search(r'\\textbf{([^}]*)}', grant_text)
    if role_match:
        grant['role'] = role_match.group(1)
    
    # Extract collaborators from itemize environments
    collaborators = []
    
    # Look for "With X, Y, and Z" patterns
    with_match = re.search(r'With ([^()]+?)(?:\(|$)', grant_text)
    if with_match:
        collaborator_text = with_match.group(1).strip()
        # Split by commas and "and"
        collaborator_parts = collaborator_text.split(' and ')
        
        for i, part in enumerate(collaborator_parts):
            if i < len(collaborator_parts) - 1:  # Not the last part
                # Split by commas
                comma_parts = part.split(',')
                collaborators.extend([p.strip() for p in comma_parts if p.strip()])
            else:  # Last part after "and"
                collaborators.append(part.strip())
    
    # Look for "PI: X" patterns
    pi_match = re.search(r'PI: ([^()]+?)(?:\(|$)', grant_text)
    if pi_match:
        collaborators.append(f"{pi_match.group(1).strip()} (PI)")
    
    # Add collaborators with their roles if found in parentheses
    if collaborators:
        # Look for roles in parentheses
        grant_collaborators = []
        for collab in collaborators:
            # Check if there's already a role in parentheses
            if '(PI)' in collab or '(co-PI)' in collab:
                grant_collaborators.append(collab)
            else:
                # Look for the role in the original text
                role_match = re.search(rf'{re.escape(collab)}\s*\(([^)]+)\)', grant_text)
                if role_match:
                    grant_collaborators.append(f"{collab} ({role_match.group(1)})")
                else:
                    grant_collaborators.append(collab)
        
        grant['collaborators'] = grant_collaborators
    
    # Pattern 1: NSF RITEL grant
    if 'Instructor-centered Holistic Modeling' in clean_text:
        grant['title'] = 'Instructor-centered Holistic Modeling of Student Engagement and Progress in Data Science'
        grant['funder'] = 'NSF 23-624: RITEL'
        grant['amount'] = '2100000'
        # Set status based on section and content
        if 'In Review' in current_section or 'submitted to' in clean_text:
            grant['status'] = 'in_review'
        
        # If collaborators weren't found, add them manually
        if not grant['collaborators']:
            grant['collaborators'] = ['K. Collins-Thompson (PI)', 'C. Brooks (co-PI)', 'S. Oney (co-PI)']
    
    # Pattern 2: NSF AI Test Beds grant
    elif 'Test Beds for Higher Education' in clean_text:
        grant['title'] = 'Test Beds for Higher Education'
        grant['funder'] = 'NSF 24-111: AI-Ready Test Beds'
        grant['amount'] = '100000'
        # Set status based on section and content
        if 'In Review' in current_section or 'submitted to' in clean_text:
            grant['status'] = 'in_review'
        
        # If collaborators weren't found, add them manually
        if not grant['collaborators']:
            grant['collaborators'] = ['K. Collins-Thompson (PI)', 'C. Brooks (co-PI)']
    
    # Pattern 3: Academic Innovation Fund grant
    elif 'Learning Through Technical Interviews' in clean_text:
        grant['title'] = 'Learning Through Technical Interviews: Combining Data Science Mentorship with AI-Powered Practice'
        grant['funder'] = 'Academic Innovation Fund'
        grant['amount'] = '12435'
        
        # If collaborators weren't found, add them manually
        if not grant['collaborators']:
            grant['collaborators'] = ['K. Collins-Thompson (co-PI)']
    
    # Pattern 4: GeT Support grant
    elif 'GeT Support' in clean_text:
        grant['title'] = 'GeT Support: An online professional learning community to support the geometry course for teachers'
        grant['funder'] = 'NSF IUSE Grant #1725837'
        grant['amount'] = '2300000'
        
        # If collaborators weren't found, add them manually
        if not grant['collaborators']:
            grant['collaborators'] = ['P. Herbst (PI)']
    
    # If we couldn't identify a specific grant but have a role, try to extract title and other details
    if 'title' not in grant and 'role' in grant:
        # Try to extract title - it's usually the text after the role and before the next comma or parenthesis
        role_end = clean_text.find(grant['role']) + len(grant['role'])
        if role_end > 0:
            remaining_text = clean_text[role_end:].strip()
            if remaining_text.startswith(','):
                remaining_text = remaining_text[1:].strip()
            
            # Look for the end of the title (usually before a comma, parenthesis, or "submitted to")
            title_end = -1
            for marker in [', submitted to', ' (', ', ']:
                pos = remaining_text.find(marker)
                if pos > 0 and (title_end == -1 or pos < title_end):
                    title_end = pos
            
            if title_end > 0:
                grant['title'] = remaining_text[:title_end].strip()
            else:
                # If no clear end marker, take everything until the next sentence
                period_pos = remaining_text.find('.')
                if period_pos > 0:
                    grant['title'] = remaining_text[:period_pos].strip()
        
        # Try to extract funder
        funder_patterns = [
            r'submitted to ([^(]*)(?:\(|$)',
            r'\(([^)]*)\)',
            r'NSF [^(]*'
        ]
        
        for pattern in funder_patterns:
            funder_match = re.search(pattern, clean_text)
            if funder_match:
                grant['funder'] = funder_match.group(1).strip() if len(funder_match.groups()) > 0 else funder_match.group(0).strip()
                break
        
        # Try to extract amount
        amount_match = re.search(r'\$([0-9,.]+)(?:[ ]?million)?', clean_text)
        if amount_match:
            amount_str = amount_match.group(1).replace(',', '')
            if 'million' in clean_text[amount_match.start():amount_match.start()+20]:
                amount_value = float(amount_str) * 1000000
                grant['amount'] = str(int(amount_value))
            else:
                grant['amount'] = amount_str
    
    # Skip if we couldn't identify the grant title
    if 'title' not in grant or not grant['title']:
        return None
    
    return grant

def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Convert LaTeX CV to JSON')
    parser.add_argument('input_file', nargs='?', default='../data/cv/CV_ion.tex', 
                        help='Path to the LaTeX CV file')
    parser.add_argument('--output', '-o', default='../data/publications.json',
                        help='Path to the output JSON file')
    parser.add_argument('--verbose', '-v', action='store_true',
                        help='Enable verbose output for debugging')
    args = parser.parse_args()
    
    # Read the CV file
    cv_path = Path(args.input_file)
    try:
        with open(cv_path, 'r', encoding='utf-8') as f:
            cv_content = f.read()
    except FileNotFoundError:
        print(f"Error: File '{cv_path}' not found", file=sys.stderr)
        sys.exit(1)
    
    # Initialize data structure
    data = {
        'publications': [],
        'talks': [],
        'grants': []
    }
    
    # Track publications by category for counting
    publications_by_category = {
        'journal': [],
        'conference': [],
        'book_chapter': [],
        'article': [],
        'poster': []
    }
    
    # Track titles to avoid duplicates
    processed_titles = set()
    
    # Extract the publications section
    publications_match = re.search(r'\\section\*{Publications}(.*?)\\section\*', cv_content, re.DOTALL)
    if publications_match:
        publications_section = publications_match.group(1)
        
        # Find all subsections within the publications section
        subsections = re.split(r'\\subsection\*{([^}]*)}', publications_section)
        
        current_section = ""
        
        for j in range(1, len(subsections), 2):
            if j+1 >= len(subsections):
                print(f"Warning: Incomplete subsection for '{subsections[j]}'", file=sys.stderr)
                continue
                
            current_section = subsections[j]
            content = subsections[j + 1]
            
            if args.verbose:
                print(f"  Processing subsection: {current_section}")
            
            # Extract individual publication entries
            # Look for both \item and \yearsitem patterns
            entries = re.split(r'\\item\s+|\\yearsitem{[^}]*}\s*', content)
            
            for entry in entries:
                if entry.strip():
                    pub_data = parse_publication(entry, current_section)
                    if pub_data:
                        # Only add publications with at least some key fields
                        if pub_data.get('title') or pub_data.get('venue') or pub_data.get('authors'):
                            # Check for duplicates
                            if pub_data.get('title') and pub_data['title'] in processed_titles:
                                if args.verbose:
                                    print(f"    Skipped duplicate: {pub_data.get('title')}")
                                continue
                            
                            # Add to the flat publications array
                            data['publications'].append(pub_data)
                            
                            # Track the title to avoid duplicates
                            if pub_data.get('title'):
                                processed_titles.add(pub_data['title'])
                            
                            # Also track by category for counting
                            pub_type = pub_data.get('type', 'other')
                            if pub_type in publications_by_category:
                                publications_by_category[pub_type].append(pub_data)
                                
                            if args.verbose:
                                print(f"    Added {pub_type}: {pub_data.get('title', 'No title')} ({pub_data.get('year', 'No year')})")
                        else:
                            if args.verbose:
                                print(f"    Skipped incomplete publication: {entry[:50]}...")
    
    # Extract the invited talks section
    talks_match = re.search(r'\\section\*{Invited talks(.*?)\\section\*', cv_content, re.DOTALL | re.IGNORECASE)
    if not talks_match:
        talks_match = re.search(r'\\section\*{.*?guest lectures(.*?)\\section\*', cv_content, re.DOTALL | re.IGNORECASE)
    
    if talks_match:
        talks_section = talks_match.group(1)
        
        # Extract individual talk entries
        entries = re.split(r'\\item\s+|\\yearsitem{[^}]*}\s*', talks_section)
        
        for entry in entries:
            if entry.strip():
                talk_data = parse_publication(entry, "Invited Talk")
                if talk_data:
                    talk_data['type'] = 'talk'
                    
                    # Check for duplicates
                    if talk_data.get('title') and talk_data['title'] in processed_titles:
                        if args.verbose:
                            print(f"    Skipped duplicate talk: {talk_data.get('title')}")
                        continue
                    
                    data['talks'].append(talk_data)
                    
                    # Track the title to avoid duplicates
                    if talk_data.get('title'):
                        processed_titles.add(talk_data['title'])
                    
                    if args.verbose:
                        print(f"    Added talk: {talk_data.get('title', 'No title')} ({talk_data.get('year', 'No year')})")
    
    # Extract the grants section
    grants_match = re.search(r'\\section\*{Research Grants}(.*?)(?:\\section\*|\\end{document})', cv_content, re.DOTALL)
    if grants_match:
        grants_section = grants_match.group(1)
        
        # Find all subsections within the grants section
        subsections = re.split(r'\\subsection\*{([^}]*)}', grants_section)
        
        current_section = ""
        
        for j in range(1, len(subsections), 2):
            if j+1 >= len(subsections):
                print(f"Warning: Incomplete subsection for '{subsections[j]}'", file=sys.stderr)
                continue
                
            current_section = subsections[j]
            content = subsections[j + 1]
            
            if args.verbose:
                print(f"  Processing grants subsection: {current_section}")
            
            # Extract individual grant entries
            entries = re.split(r'\\item\s+|\\yearsitem{[^}]*}\s*', content)
            
            for entry in entries:
                if entry.strip():
                    grant_data = parse_grant(entry, current_section)
                    if grant_data:
                        data['grants'].append(grant_data)
                        
                        if args.verbose:
                            print(f"    Added grant: {grant_data.get('title', 'No title')} ({grant_data.get('status', 'No status')})")
    
    # Write the data to a JSON file
    output_path = Path(args.output)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    # Print summary
    journal_count = len(publications_by_category['journal'])
    conference_count = len(publications_by_category['conference'])
    book_chapter_count = len(publications_by_category['book_chapter'])
    article_count = len(publications_by_category['article'])
    poster_count = len(publications_by_category['poster'])
    
    print(f"Successfully wrote {len(data['publications'])} publications "
          f"({journal_count} journal, {conference_count} conference, "
          f"{book_chapter_count} book chapters, {article_count} articles, "
          f"{poster_count} posters), "
          f"{len(data['talks'])} talks, and {len(data['grants'])} grants "
          f"to {output_path}")

if __name__ == "__main__":
    main() 