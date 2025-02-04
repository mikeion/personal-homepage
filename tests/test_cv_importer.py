import pytest
from pathlib import Path
import sys
import os

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts.cv_importer import CVImporter
from scripts.cv_schema import Publication

@pytest.fixture
def importer():
    return CVImporter(Path("test_cv.tex"))

@pytest.fixture
def sample_publication_text():
    return (
        "\\textbf{Ion, M.}, Herbst, P. (2023). "
        "Test Publication Title. "
        "\\textit{Journal of Testing}. "
        "\\url{https://doi.org/10.1234/test}"
    )

def test_clean_authors(importer):
    text = "\\textbf{Ion, M.}, Herbst, P., Other, A."
    result = importer.clean_authors(text)
    assert result == ["Ion, M.", "Herbst, P.", "Other, A."]

def test_parse_publication_entry(importer, sample_publication_text):
    result = importer._parse_publication_entry(sample_publication_text, "journal")
    assert result is not None
    assert result["authors"] == ["Ion, M.", "Herbst, P."]
    assert result["year"] == "2023"
    assert result["title"] == "Test Publication Title"
    assert result["venue"] == "Journal of Testing"
    assert result["type"] == "journal"
    assert result["status"] == "published"

def test_validate_publication(importer):
    valid_pub = Publication(
        authors=["Ion, M."],
        title="Test Title",
        year="2023",
        venue="Test Venue",
        type="journal",
        status="published",
        doi=None,
        url=None,
        citation_count=0,
        abstract=None,
        keywords=[],
        pdf_url=None,
        presentation_url=None,
        impact_factor=None
    )
    
    errors = importer.validate_publication(valid_pub)
    assert not errors
    
    invalid_pub = Publication(
        authors=[],
        title="",
        year="invalid",
        venue="Test Venue",
        type="invalid_type",
        status="invalid_status",
        doi=None,
        url=None,
        citation_count=0,
        abstract=None,
        keywords=[],
        pdf_url=None,
        presentation_url=None,
        impact_factor=None
    )
    
    errors = importer.validate_publication(invalid_pub)
    assert len(errors) == 5

def test_extract_date(importer):
    assert importer.extract_date("Oct. 2023") == "2023-10"
    assert importer.extract_date("October 2023") == "2023-10"
    assert importer.extract_date("Invalid date") == "" 