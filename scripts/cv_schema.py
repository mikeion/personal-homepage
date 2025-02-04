from dataclasses import dataclass
from typing import List, Optional

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

@dataclass
class Presentation:
    authors: List[str]
    title: str
    date: str
    venue: str
    location: str
    presentation_type: str
    abstract: Optional[str] = None
    slides_url: Optional[str] = None
    award: Optional[str] = None

# Add other classes as needed... 