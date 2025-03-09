'use client';

import Link from 'next/link';
import { Container, Row, Col, Card, Button, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { publications as tsPublications } from '@/data/publications';

// Define the structure of a publication
interface Publication {
  title: string;
  authors: string[] | string;
  year?: number | string;
  venue?: string;
  type?: string;
  journal?: string;
  conference?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  location?: string;
  doi?: string;
  url?: string;
  status?: string;
  date?: string;
  id?: string;
  keywords?: string[] | any[];
}

// Research areas with descriptions
const researchAreas = [
  {
    id: 'math-education',
    title: 'Mathematics Education',
    description: 'Studying how people learn mathematics and develop mathematical knowledge, with a focus on undergraduate mathematics education and teacher preparation.',
  },
  {
    id: 'ai-education',
    title: 'AI in Education',
    description: 'Exploring applications of artificial intelligence, machine learning, and natural language processing to enhance teaching and learning.',
  },
  {
    id: 'writing-research',
    title: 'Writing Research',
    description: 'Investigating writing practices across disciplines and how writing contributes to learning and knowledge development.',
  },
];

// Current Projects
const currentProjects = [
  {
    title: "Simulated Teaching and Learning at Scale",
    description: "Developing frameworks to evaluate AI-generated educational dialogues along two critical dimensions: simulation fidelity (how realistically LLMs mimic student behavior) and interaction effectiveness (whether these exchanges produce meaningful learning). This research helps distinguish between LLMs that merely \"sound like\" students versus those that facilitate genuine educational progress."
  },
  {
    title: "AI-Enhanced Technical Interview Preparation",
    description: "Creating scalable, personalized technical interview practice for data science students by combining expert human interviews with AI simulation. This project identifies effective interviewing patterns through real student interactions, then develops an adaptive AI platform that helps students articulate technical concepts, improve communication skills, and prepare for industry positions at their own pace."
  },
  {
    title: "Teaching and Learning in the Age of Generative AI",
    description: "Investigating the essential human dimensions of teaching that AI cannot replace. This research examines how effective teaching requires maintaining \"productive uncertainty\" to foster deep conceptual understanding, particularly in mathematics education. By analyzing classroom interactions across educational levels, we're developing frameworks to guide AI integration in ways that enhance rather than undermine the crucial relational and judgment-based aspects of teaching practice."
  },
  {
    title: "AI-Ready Test Beds for Higher Education",
    description: "Planning and developing infrastructure for evaluating AI technologies in higher education. This project designs frameworks to assess both effectiveness and risks of AI-powered educational tools across various higher education contexts. By creating test bed environments that combine simulated student interactions with real-world deployment opportunities, we aim to establish evidence-based standards for the safe, effective, and equitable implementation of AI in teaching and learning."
  }
];

// Format authors list from array to string
function formatAuthors(authors: string[]): string {
  return authors.join(', ');
}

export default function Research() {
  const [jsonPublications, setJsonPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Categorize publications
  const [categorizedPublications, setCategorizedPublications] = useState({
    journal: [] as Publication[],
    conference: [] as Publication[],
    book_chapter: [] as Publication[],
    talks: [] as Publication[],
    workshops: [] as Publication[],
    preprints: [] as Publication[],
    other: [] as Publication[]
  });
  
  // Fetch publications from JSON file
  useEffect(() => {
    async function fetchPublications() {
      try {
        const response = await fetch('/api/publications');
        if (!response.ok) {
          throw new Error('Failed to fetch publications');
        }
        const data = await response.json();
        
        // Combine with TS publications
        setJsonPublications(data.publications || []);
        
        // Categorize all publications
        const combined = [...(data.publications || [])];
        
        // Categorize
        const categorized = {
          journal: combined.filter(pub => pub.type === 'journal' || pub.journal),
          conference: combined.filter(pub => pub.type === 'conference' || pub.conference),
          book_chapter: combined.filter(pub => pub.type === 'chapter' || pub.type === 'book_chapter'),
          talks: tsPublications.invited_talks || [],
          workshops: tsPublications.workshop_presentations || [],
          preprints: combined.filter(pub => pub.type === 'preprint' || pub.status === 'preprint'),
          other: combined.filter(pub => !pub.type && !pub.journal && !pub.conference && pub.type !== 'chapter' && pub.type !== 'book_chapter' && pub.type !== 'preprint')
        };
        
        setCategorizedPublications(categorized);
      } catch (error) {
        console.error('Error fetching publications:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPublications();
  }, []);

  return (
    <Container className="py-5">
      <h1 className="mb-4">Research</h1>
      
      <p className="lead mb-5">
        My research explores mathematics education, teacher preparation, and the application of artificial intelligence to educational contexts. I combine methods from learning sciences, education research, and computational approaches to address complex problems in teaching and learning.
      </p>
      
      <h2 className="mb-4">Research Areas</h2>
      <Row className="mb-5">
        {researchAreas.map((area) => (
          <Col key={area.id} md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <h3 className="h4 mb-3">{area.title}</h3>
                <p>{area.description}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <h2 className="mb-4">Current Projects</h2>
      <Row className="mb-5">
        {currentProjects.map((project, index) => (
          <Col key={index} md={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <h3 className="h4 mb-3">{project.title}</h3>
                <p>{project.description}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <h2 className="mb-5">Publications</h2>
      
      {loading ? (
        <p>Loading publications...</p>
      ) : (
        <Accordion defaultActiveKey="0" className="mb-5">
          {/* Journal Publications */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h3 className="h5 mb-0">Journal Publications</h3>
            </Accordion.Header>
            <Accordion.Body>
              <ul className="list-unstyled">
                {categorizedPublications.journal.map((pub, index) => (
                  <li key={index} className="mb-3">
                    <strong>{Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors}</strong> {pub.year && `(${pub.year})`}. {pub.title}. <em>{pub.venue || pub.journal}</em>{pub.volume && `, ${pub.volume}`}{pub.issue && `(${pub.issue})`}{pub.pages && `, ${pub.pages}`}.
                    {pub.doi && (
                      <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="ms-2 text-decoration-none">
                        [DOI]
                      </a>
                    )}
                    {pub.url && (
                      <a href={pub.url} target="_blank" rel="noopener noreferrer" className="ms-2 text-decoration-none">
                        [Link]
                      </a>
                    )}
                  </li>
                ))}
                {tsPublications.journal_publications && tsPublications.journal_publications.map((pub, index) => (
                  <li key={`ts-${index}`} className="mb-3">
                    <strong>{Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors}</strong> {pub.year && `(${pub.year})`}. {pub.title}. <em>{pub.venue}</em>.
                    {pub.id && (
                      <Link href={`#${pub.id}`} className="ms-2 text-decoration-none">
                        [Details]
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          
          {/* Conference Proceedings */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h3 className="h5 mb-0">Conference Proceedings</h3>
            </Accordion.Header>
            <Accordion.Body>
              <ul className="list-unstyled">
                {categorizedPublications.conference.map((pub, index) => (
                  <li key={index} className="mb-3">
                    <strong>{Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors}</strong> {pub.year && `(${pub.year})`}. {pub.title}. <em>{pub.venue || pub.conference}</em>. {pub.location && `${pub.location}.`} {pub.pages && `pp. ${pub.pages}.`}
                    {pub.doi && (
                      <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="ms-2 text-decoration-none">
                        [DOI]
                      </a>
                    )}
                    {pub.url && (
                      <a href={pub.url} target="_blank" rel="noopener noreferrer" className="ms-2 text-decoration-none">
                        [Link]
                      </a>
                    )}
                  </li>
                ))}
                {tsPublications.conference_proceedings && tsPublications.conference_proceedings.map((pub, index) => (
                  <li key={`ts-${index}`} className="mb-3">
                    <strong>{Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors}</strong> {pub.year && `(${pub.year})`}. {pub.title}. <em>{pub.venue}</em>. {pub.location}.
                    {pub.id && (
                      <Link href={`#${pub.id}`} className="ms-2 text-decoration-none">
                        [Details]
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          
          {/* Book Chapters */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <h3 className="h5 mb-0">Book Chapters</h3>
            </Accordion.Header>
            <Accordion.Body>
              <ul className="list-unstyled">
                {categorizedPublications.book_chapter.map((pub, index) => (
                  <li key={index} className="mb-3">
                    <strong>{Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors}</strong> {pub.year && `(${pub.year})`}. {pub.title}. <em>{pub.venue}</em>. {pub.publisher && `${pub.publisher}.`} {pub.pages && `pp. ${pub.pages}.`}
                    {pub.doi && (
                      <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="ms-2 text-decoration-none">
                        [DOI]
                      </a>
                    )}
                    {pub.url && (
                      <a href={pub.url} target="_blank" rel="noopener noreferrer" className="ms-2 text-decoration-none">
                        [Link]
                      </a>
                    )}
                  </li>
                ))}
                {tsPublications.book_chapters && tsPublications.book_chapters.map((pub, index) => (
                  <li key={`ts-${index}`} className="mb-3">
                    <strong>{Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors}</strong> {pub.year && `(${pub.year})`}. {pub.title}. <em>{pub.venue}</em>. {pub.publisher}.
                    {pub.id && (
                      <Link href={`#${pub.id}`} className="ms-2 text-decoration-none">
                        [Details]
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          
          {/* Invited Talks */}
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              <h3 className="h5 mb-0">Invited Talks</h3>
            </Accordion.Header>
            <Accordion.Body>
              <ul className="list-unstyled">
                {tsPublications.invited_talks && tsPublications.invited_talks.map((talk, index) => (
                  <li key={index} className="mb-3">
                    <strong>{Array.isArray(talk.authors) ? talk.authors.join(', ') : talk.authors}</strong>. {talk.title}. <em>{talk.venue}</em>. {talk.location}. {talk.date}.
                  </li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          
          {/* Workshop Presentations */}
          <Accordion.Item eventKey="4">
            <Accordion.Header>
              <h3 className="h5 mb-0">Workshop Presentations</h3>
            </Accordion.Header>
            <Accordion.Body>
              <ul className="list-unstyled">
                {tsPublications.workshop_presentations && tsPublications.workshop_presentations.map((presentation, index) => (
                  <li key={index} className="mb-3">
                    <strong>{Array.isArray(presentation.authors) ? presentation.authors.join(', ') : presentation.authors}</strong> {presentation.year && `(${presentation.year})`}. {presentation.title}. <em>{presentation.venue}</em>. {presentation.location}.
                  </li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          
          {/* Preprints & Working Papers */}
          {categorizedPublications.preprints.length > 0 && (
            <Accordion.Item eventKey="5">
              <Accordion.Header>
                <h3 className="h5 mb-0">Preprints & Working Papers</h3>
              </Accordion.Header>
              <Accordion.Body>
                <ul className="list-unstyled">
                  {categorizedPublications.preprints.map((pub, index) => (
                    <li key={index} className="mb-3">
                      <strong>{Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors}</strong> {pub.year && `(${pub.year})`}. {pub.title}. {pub.status === "in_progress" ? "In progress" : pub.venue ? <em>{pub.venue}</em> : "Preprint"}.
                      {pub.url && (
                        <a href={pub.url} target="_blank" rel="noopener noreferrer" className="ms-2 text-decoration-none">
                          [Link]
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          )}
        </Accordion>
      )}
    </Container>
  );
} 