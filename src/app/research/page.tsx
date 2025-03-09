'use client';

import Link from 'next/link';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Research areas with descriptions
const researchAreas = [
  {
    id: 'math-education',
    title: 'Mathematics Education',
    description: 'Studying how people learn mathematics and develop mathematical knowledge, with a focus on undergraduate mathematics education and teacher preparation.',
    image: '/images/research/math-education.jpg',
  },
  {
    id: 'ai-education',
    title: 'AI in Education',
    description: 'Exploring applications of artificial intelligence, machine learning, and natural language processing to enhance teaching and learning.',
    image: '/images/research/ai-education.jpg',
  },
  {
    id: 'writing-research',
    title: 'Writing Research',
    description: 'Investigating writing practices across disciplines and how writing contributes to learning and knowledge development.',
    image: '/images/research/writing-research.jpg',
  },
];

export default function Research() {
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
      
      <h2 className="mb-4">Publications</h2>
      <p className="mb-4">
        View my complete list of peer-reviewed journal articles, conference proceedings, talks, and other academic publications.
      </p>
      <Link href="/publications" passHref>
        <Button variant="primary" size="lg" className="mb-5">
          Browse Publications
        </Button>
      </Link>
      
      <h2 className="mb-4">Current Projects</h2>
      <Row className="mb-5">
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h3 className="h4 mb-3">Simulated Teaching and Learning at Scale</h3>
              <p>Developing frameworks to evaluate AI-generated educational dialogues along two critical dimensions: simulation fidelity (how realistically LLMs mimic student behavior) and interaction effectiveness (whether these exchanges produce meaningful learning). This research helps distinguish between LLMs that merely "sound like" students versus those that facilitate genuine educational progress.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h3 className="h4 mb-3">AI-Enhanced Technical Interview Preparation</h3>
              <p>Creating scalable, personalized technical interview practice for data science students by combining expert human interviews with AI simulation. This project identifies effective interviewing patterns through real student interactions, then develops an adaptive AI platform that helps students articulate technical concepts, improve communication skills, and prepare for industry positions at their own pace.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h3 className="h4 mb-3">Teaching and Learning in the Age of Generative AI</h3>
              <p>Investigating the essential human dimensions of teaching that AI cannot replace. This research examines how effective teaching requires maintaining "productive uncertainty" to foster deep conceptual understanding, particularly in mathematics education. By analyzing classroom interactions across educational levels, we're developing frameworks to guide AI integration in ways that enhance rather than undermine the crucial relational and judgment-based aspects of teaching practice.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h3 className="h4 mb-3">AI-Ready Test Beds for Higher Education</h3>
              <p>Planning and developing infrastructure for evaluating AI technologies in higher education. This project designs frameworks to assess both effectiveness and risks of AI-powered educational tools across various higher education contexts. By creating test bed environments that combine simulated student interactions with real-world deployment opportunities, we aim to establish evidence-based standards for the safe, effective, and equitable implementation of AI in teaching and learning.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
} 