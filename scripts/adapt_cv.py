import json
import click
from pathlib import Path
import together
from typing import Dict, List, Union
import logging
from dotenv import load_dotenv
import os
import yaml
from datetime import datetime
import pypandoc
import jinja2

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
together.api_key = os.getenv("TOGETHER_API_KEY")

# Load configuration
with open("config/cv_config.yaml", "r") as f:
    CONFIG = yaml.safe_load(f)

class CVAdapter:
    def __init__(self):
        self.data_dir = Path("src/data/research")
        self.template_dir = Path("templates/cv")
        self.output_dir = Path("output/cv")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize Jinja2 environment for templates
        self.jinja_env = jinja2.Environment(
            loader=jinja2.FileSystemLoader(str(self.template_dir)),
            trim_blocks=True,
            lstrip_blocks=True
        )

    def load_cv_data(self) -> Dict:
        """Load all CV data from json files"""
        cv_data = {}
        for file in self.data_dir.glob("*.json"):
            cv_data[file.stem] = json.load(open(file))
        return cv_data

    def analyze_reference_cvs(self, reference_cvs: List[Path]) -> Dict:
        """Analyze multiple reference CVs for patterns and insights"""
        analyses = []
        
        for cv_path in reference_cvs:
            with open(cv_path, 'r') as f:
                content = f.read()
            
            prompt = f"""Analyze this reference CV and extract:
1. Key sections and their organization
2. Notable presentation styles or formats
3. Effective phrases or descriptions
4. Unique elements that make this CV stand out
5. Field-specific conventions or expectations

Reference CV from {cv_path.name}:
{content}

Format your response as JSON with sections for each category of analysis.
"""
            
            response = together.Complete.create(
                prompt=prompt,
                model=CONFIG['llm']['model'],
                max_tokens=CONFIG['llm']['max_tokens'],
                temperature=CONFIG['llm']['temperature']
            )
            
            try:
                analysis = json.loads(response.output.text)
                analysis['source'] = cv_path.name
                analyses.append(analysis)
            except json.JSONDecodeError as e:
                logger.error(f"Error parsing LLM response for {cv_path}: {e}")
        
        # Synthesize insights from multiple CVs
        synthesis_prompt = f"""Synthesize insights from these CV analyses:
{json.dumps(analyses, indent=2)}

Identify:
1. Common patterns across CVs
2. Field-specific differences
3. Best practices
4. Innovative approaches

Format response as JSON.
"""
        
        synthesis_response = together.Complete.create(
            prompt=synthesis_prompt,
            model=CONFIG['llm']['model'],
            max_tokens=CONFIG['llm']['max_tokens']
        )
        
        try:
            synthesis = json.loads(synthesis_response.output.text)
            synthesis['individual_analyses'] = analyses
            return synthesis
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing synthesis response: {e}")
            return {'individual_analyses': analyses}

    def adapt_cv(self, context: str, purpose: str, reference_analysis: Dict = None) -> Dict:
        """Adapt CV using current data and optional reference analysis"""
        cv_data = self.load_cv_data()
        
        prompt = f"""Given the following CV data, context, and reference analysis,
provide detailed suggestions for adapting this CV.

Context: {context}
Purpose: {purpose}

Current CV data:
{json.dumps(cv_data, indent=2)}

Reference Analysis (if available):
{json.dumps(reference_analysis, indent=2) if reference_analysis else "None"}

Provide:
1. Recommended sections and their order
2. Items to highlight or emphasize
3. Items to remove or de-emphasize
4. Rewording suggestions
5. Missing elements to add
6. Format and style recommendations

Format response as JSON.
"""
        
        response = together.Complete.create(
            prompt=prompt,
            model=CONFIG['llm']['model'],
            max_tokens=CONFIG['llm']['max_tokens']
        )
        
        try:
            return json.loads(response.output.text)
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing adaptation response: {e}")
            return None

    def export_cv(self, adapted_data: Dict, format: str) -> Path:
        """Export adapted CV to specified format"""
        # Load appropriate template
        template = self.jinja_env.get_template(f"{format}_template.{format}")
        
        # Render template with adapted data
        rendered = template.render(**adapted_data)
        
        # Generate output filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = self.output_dir / f"cv_{timestamp}.{format}"
        
        # Export based on format
        if format == "tex":
            with open(output_file, 'w') as f:
                f.write(rendered)
        elif format in ["docx", "pdf"]:
            # Use pandoc for conversion
            pypandoc.convert_text(
                rendered,
                format,
                format='latex',
                outputfile=str(output_file),
                extra_args=['--template', str(self.template_dir / f"custom.{format}")]
            )
        
        return output_file

@click.group()
def cli():
    """Enhanced CV adaptation CLI"""
    pass

@cli.command()
@click.option('--context', type=click.Choice(CONFIG['contexts']), prompt=True)
@click.option('--purpose', prompt="What is the purpose of this CV adaptation?")
@click.option('--reference-cvs', multiple=True, type=click.Path(exists=True),
              help="Path to reference CVs")
@click.option('--format', type=click.Choice(['tex', 'docx', 'pdf']), default='tex',
              help="Output format")
def adapt(context: str, purpose: str, reference_cvs: List[str], format: str):
    """Adapt CV for specific context with optional reference CVs"""
    adapter = CVAdapter()
    
    # Analyze reference CVs if provided
    reference_analysis = None
    if reference_cvs:
        logger.info(f"Analyzing {len(reference_cvs)} reference CVs...")
        reference_analysis = adapter.analyze_reference_cvs([Path(cv) for cv in reference_cvs])
    
    # Get adaptation suggestions
    logger.info(f"Adapting CV for {context} context...")
    suggestions = adapter.adapt_cv(context, purpose, reference_analysis)
    
    if suggestions:
        # Save suggestions
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        suggestions_file = adapter.output_dir / f"suggestions_{timestamp}.json"
        with open(suggestions_file, 'w') as f:
            json.dump(suggestions, f, indent=2)
        
        # Export adapted CV
        output_file = adapter.export_cv(suggestions, format)
        
        logger.info(f"Saved suggestions to {suggestions_file}")
        logger.info(f"Exported adapted CV to {output_file}")
        
        # Print key suggestions
        click.echo("\nKey suggestions:")
        for suggestion in suggestions.get("general_suggestions", []):
            click.echo(f"- {suggestion}")

@cli.command()
@click.argument('reference_cvs', nargs=-1, type=click.Path(exists=True))
@click.option('--output', default="cv_analysis.json", help="Output file name")
def analyze(reference_cvs: List[str], output: str):
    """Analyze multiple reference CVs"""
    adapter = CVAdapter()
    analysis = adapter.analyze_reference_cvs([Path(cv) for cv in reference_cvs])
    
    with open(output, 'w') as f:
        json.dump(analysis, f, indent=2)
    logger.info(f"Saved CV analysis to {output}")

if __name__ == "__main__":
    cli() 