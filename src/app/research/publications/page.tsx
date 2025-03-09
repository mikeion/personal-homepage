'use client';

import { useState } from 'react';
import { Container, Row, Col, Card, Badge, Form, Button } from 'react-bootstrap';
import publicationsData from '@/data/publications.json';
import 'bootstrap/dist/css/bootstrap.min.css';

type Publication = {
  title: string;
  authors: string[];
  year: number;
  venue: string;
  type: string;
  status?: string;
  doi?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  location?: string;
  month?: string;
  award?: string;
};

export default function Publications() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Initialize the publications from JSON data
  const allPublications = [...publicationsData.publications];
  
  // Apply filtering and sorting
  let filteredPublications = allPublications;
  
  // Filter by type if not "all"
  if (filter !== 'all') {
    filteredPublications = filteredPublications.filter(pub => pub.type === filter);
  }
  
  // Filter by search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredPublications = filteredPublications.filter(pub => 
      pub.title.toLowerCase().includes(term) || 
      pub.authors.some(author => author.toLowerCase().includes(term)) ||
      (pub.venue && pub.venue.toLowerCase().includes(term))
    );
  }
  
  // Sort by year (most recent first)
  filteredPublications.sort((a, b) => b.year - a.year);
  
  // Count publications by type
  const counts = {
    all: allPublications.length,
    journal: allPublications.filter(pub => pub.type === 'journal').length,
    conference: allPublications.filter(pub => pub.type === 'conference').length,
    article: allPublications.filter(pub => pub.type === 'article').length,
    talk: allPublications.filter(pub => pub.type === 'talk').length,
    workshop: allPublications.filter(pub => pub.type === 'workshop').length,
    poster: allPublications.filter(pub => pub.type === 'poster').length,
  };
  
  // Helper function to format authors list
  const formatAuthors = (authors: string[]) => {
    return authors.join(', ');
  };
  
  // Group publications by year
  const publicationsByYear = filteredPublications.reduce((acc, pub) => {
    const year = pub.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(pub);
    return acc;
  }, {} as Record<number, Publication[]>);
  
  // Get sorted years
  const years = Object.keys(publicationsByYear).map(Number).sort((a, b) => b - a);
  
  return (
    <Container className="py-5">
      <h1 className="mb-4">Publications</h1>
      
      <Row className="mb-4">
        <Col md={8}>
          <div className="d-flex flex-wrap mb-3">
            <Button 
              variant={filter === 'all' ? 'primary' : 'outline-primary'} 
              className="me-2 mb-2" 
              onClick={() => setFilter('all')}
            >
              All ({counts.all})
            </Button>
            <Button 
              variant={filter === 'journal' ? 'primary' : 'outline-primary'} 
              className="me-2 mb-2" 
              onClick={() => setFilter('journal')}
            >
              Journal Articles ({counts.journal})
            </Button>
            <Button 
              variant={filter === 'conference' ? 'primary' : 'outline-primary'} 
              className="me-2 mb-2" 
              onClick={() => setFilter('conference')}
            >
              Conference Proceedings ({counts.conference})
            </Button>
            <Button 
              variant={filter === 'article' ? 'primary' : 'outline-primary'} 
              className="me-2 mb-2" 
              onClick={() => setFilter('article')}
            >
              Articles ({counts.article})
            </Button>
            <Button 
              variant={filter === 'talk' ? 'primary' : 'outline-primary'} 
              className="me-2 mb-2" 
              onClick={() => setFilter('talk')}
            >
              Talks ({counts.talk})
            </Button>
            <Button 
              variant={filter === 'workshop' ? 'primary' : 'outline-primary'} 
              className="me-2 mb-2" 
              onClick={() => setFilter('workshop')}
            >
              Workshops ({counts.workshop})
            </Button>
            <Button 
              variant={filter === 'poster' ? 'primary' : 'outline-primary'} 
              className="me-2 mb-2" 
              onClick={() => setFilter('poster')}
            >
              Posters ({counts.poster})
            </Button>
          </div>
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search publications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>
      
      {/* Display count of filtered publications */}
      <p className="text-muted mb-4">
        Showing {filteredPublications.length} of {allPublications.length} publications
      </p>
      
      {/* Publications by year */}
      {years.map(year => (
        <div key={year} className="mb-5">
          <h2 className="border-bottom pb-2 mb-3">{year}</h2>
          
          {publicationsByYear[year].map((pub, index) => (
            <Card key={index} className="mb-4 shadow-sm">
              <Card.Body>
                <Row>
                  <Col>
                    <h4 className="mb-2">{pub.title}</h4>
                    <p className="text-muted mb-2 fs-5">
                      {formatAuthors(pub.authors)}
                    </p>
                    <p className="mb-1 fs-5">
                      <strong>{pub.venue}</strong>
                      {pub.volume && <>, {pub.volume}</>}
                      {pub.issue && <> ({pub.issue})</>}
                      {pub.pages && <>, {pub.pages}</>}
                    </p>
                    {pub.location && (
                      <p className="mb-1">
                        {pub.month && <>{pub.month}, </>}{pub.location}
                      </p>
                    )}
                    <div className="mt-3 d-flex flex-wrap align-items-center">
                      <Badge 
                        bg={
                          pub.type === 'journal' ? 'primary' :
                          pub.type === 'conference' ? 'success' :
                          pub.type === 'article' ? 'info' :
                          pub.type === 'talk' ? 'secondary' :
                          pub.type === 'workshop' ? 'dark' :
                          'danger'
                        }
                        className="me-2 mb-2"
                      >
                        {pub.type.charAt(0).toUpperCase() + pub.type.slice(1)}
                      </Badge>
                      
                      {pub.status && pub.status !== 'published' && (
                        <Badge bg="warning" text="dark" className="me-2 mb-2">
                          {pub.status.charAt(0).toUpperCase() + pub.status.slice(1).replace('_', ' ')}
                        </Badge>
                      )}
                      
                      {pub.award && (
                        <Badge bg="warning" text="dark" className="me-2 mb-2">
                          Award: {pub.award}
                        </Badge>
                      )}
                      
                      {pub.doi && (
                        <a 
                          href={`https://doi.org/${pub.doi}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="me-2 mb-2 btn btn-sm btn-outline-primary"
                        >
                          View Publication
                        </a>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      ))}
      
      {filteredPublications.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted fs-4">No publications found matching your criteria.</p>
        </div>
      )}
    </Container>
  );
} 