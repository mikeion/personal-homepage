import json
import click
from pathlib import Path
import datetime
from typing import Dict, List

DATA_DIR = Path("src/data/research")

WORK_TYPES = {
    "publication": {
        "subtypes": ["journal", "conference_paper", "preprint", "book_chapter"],
        "required_fields": ["title", "authors", "venue", "year"],
        "optional_fields": ["doi", "pdf_url", "abstract", "citation_count"]
    },
    "presentation": {
        "subtypes": ["conference_talk", "poster", "invited_talk", "workshop", "roundtable"],
        "required_fields": ["title", "authors", "venue", "location", "date"],
        "optional_fields": ["slides_url", "video_url", "abstract"]
    },
    "grant": {
        "subtypes": ["research", "fellowship", "training"],
        "required_fields": ["title", "amount", "year_start", "role"],
        "optional_fields": ["year_end", "pi", "co_pi", "grant_number", "status"]
    },
    "blog": {
        "subtypes": ["technical", "research", "educational", "opinion"],
        "required_fields": ["title", "date", "url"],
        "optional_fields": ["platform", "tags", "collaborators"]
    },
    "project": {
        "subtypes": ["software", "dataset", "curriculum", "research_tool"],
        "required_fields": ["title", "description", "year_start"],
        "optional_fields": [
            "year_end", 
            "code_url", 
            "demo_url", 
            "documentation_url",
            "collaborators",
            "related_publications",
            "status"
        ]
    }
}

def load_json(filename: str) -> Dict:
    """Load a JSON file from the data directory"""
    filepath = DATA_DIR / filename
    if not filepath.exists():
        return {}
    with open(filepath) as f:
        return json.load(f)

def save_json(data: Dict, filename: str):
    """Save data to a JSON file in the data directory"""
    filepath = DATA_DIR / filename
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)

def prompt_areas() -> List[str]:
    """Prompt user to select research areas"""
    areas = load_json("areas.json")
    area_choices = {area["id"]: name for name, area in areas.items()}
    selected_areas = []
    
    click.echo("\nAvailable research areas:")
    while True:
        for id, name in area_choices.items():
            click.echo(f"{id}: {name}")
        area = click.prompt(
            "Add area (enter to finish)",
            type=click.Choice(list(area_choices.keys()) + [""]),
            default=""
        )
        if not area:
            break
        selected_areas.append(area)
    return selected_areas

@click.group()
def cli():
    """Research management CLI"""
    pass

@click.command()
@click.option('--type', type=click.Choice(['publication', 'project', 'grant']), required=True)
@click.option('--area', type=click.Choice(['AI in Education', 'Educational Assessment', 'STEM Education']), required=True)
def add(type, area):
    """Add a new research item"""
    data = {}
    
    # Common fields
    data['title'] = click.prompt('Title')
    data['description'] = click.prompt('Description')
    data['year'] = click.prompt('Year', type=int)
    data['collaborators'] = click.prompt('Collaborators (comma-separated)').split(',')
    
    # Type-specific fields
    if type == 'publication':
        data['venue'] = click.prompt('Venue')
        data['status'] = click.prompt('Status', type=click.Choice(['published', 'in_review', 'in_progress']))
        data['url'] = click.prompt('URL', default='')
        
    elif type == 'project':
        data['status'] = click.prompt('Status', type=click.Choice(['active', 'completed']))
        data['code_url'] = click.prompt('Code URL', default='')
        
    elif type == 'grant':
        data['amount'] = click.prompt('Amount')
        data['funder'] = click.prompt('Funder')
    
    # Load existing data
    research_file = DATA_DIR / "areas.json"
    with open(research_file) as f:
        research_data = json.load(f)
    
    # Add new item
    if type + 's' not in research_data[area]:
        research_data[area][type + 's'] = []
    research_data[area][type + 's'].append(data)
    
    # Save updated data
    with open(research_file, 'w') as f:
        json.dump(research_data, f, indent=2)
    
    click.echo(f"Added {type}: {data['title']}")

@cli.command()
def list_work():
    """List all academic work"""
    for work_type in WORK_TYPES:
        data = load_json(f"{work_type}s.json")
        if data:
            click.echo(f"\n{work_type.upper()}:")
            for subtype, items in data.items():
                click.echo(f"\n  {subtype}:")
                for item in items:
                    click.echo(f"    - {item.get('title', '')} ({item.get('year', item.get('date', ''))})")

@cli.command()
def add_area():
    """Add a new research area"""
    areas = load_json("areas.json")
    
    name = click.prompt("Area name")
    id = click.prompt("Area ID (e.g., ai-education)")
    description = click.prompt("Description")
    keywords = click.prompt("Keywords (comma-separated)").split(",")
    keywords = [k.strip() for k in keywords]
    
    areas[name] = {
        "id": id,
        "description": description,
        "keywords": keywords
    }
    
    save_json(areas, "areas.json")
    click.echo(f"\nAdded research area: {name}")

cli.add_command(add)

if __name__ == "__main__":
    cli() 