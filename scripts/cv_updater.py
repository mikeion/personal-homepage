import click
import yaml
from pathlib import Path
from typing import Dict, List
import json
from datetime import datetime

@click.group()
def cli():
    """CV Update CLI"""
    pass

@cli.command()
@click.option('--type', type=click.Choice(['publication', 'presentation', 'grant', 'service']))
def add(type):
    """Add new item to CV"""
    data = {}
    
    # Common fields
    data['title'] = click.prompt('Title')
    data['date'] = click.prompt('Date (YYYY-MM-DD)')
    
    if type == 'publication':
        data['authors'] = click.prompt('Authors (comma-separated)').split(',')
        data['venue'] = click.prompt('Venue')
        data['type'] = click.prompt('Type', 
                                  type=click.Choice(['journal', 'conference', 'chapter', 'preprint']))
        data['status'] = click.prompt('Status', 
                                    type=click.Choice(['published', 'in_review', 'in_preparation']))
        data['doi'] = click.prompt('DOI (optional)', default='')
        
    elif type == 'presentation':
        data['venue'] = click.prompt('Venue')
        data['location'] = click.prompt('Location')
        data['type'] = click.prompt('Type', 
                                  type=click.Choice(['invited', 'conference', 'poster']))
        
    elif type == 'grant':
        data['amount'] = click.prompt('Amount')
        data['funder'] = click.prompt('Funder')
        data['role'] = click.prompt('Role')
        data['status'] = click.prompt('Status', 
                                    type=click.Choice(['awarded', 'submitted', 'in_preparation']))
        
    elif type == 'service':
        data['organization'] = click.prompt('Organization')
        data['role'] = click.prompt('Role')
        data['type'] = click.prompt('Type', 
                                  type=click.Choice(['reviewer', 'committee', 'mentoring', 'other']))
    
    # Save to appropriate file
    save_item(type, data)
    click.echo(f"Added {type}: {data['title']}")

def save_item(type: str, data: Dict):
    """Save item to appropriate JSON file"""
    file_path = Path(f"src/data/cv/{type}s.json")
    
    # Load existing data
    if file_path.exists():
        with open(file_path) as f:
            items = json.load(f)
    else:
        items = []
    
    # Add new item
    items.append(data)
    
    # Sort by date
    items.sort(key=lambda x: x['date'], reverse=True)
    
    # Save updated data
    with open(file_path, 'w') as f:
        json.dump(items, f, indent=2)

if __name__ == '__main__':
    cli() 