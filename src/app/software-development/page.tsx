'use client';

import Link from 'next/link';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Project {
  title: string;
  description: string;
  techStack: string[];
  link?: string;
  githubLink?: string;
  image?: string;
  featured?: boolean;
  status: 'In Development' | 'Live' | 'Research';
}

// Projects with descriptions
const projects: Project[] = [
  {
    title: "MotionMerchant",
    description: "A web application that transforms static product photos into engaging videos using AI. Built with a modern tech stack focusing on performance and scalability.",
    techStack: [
      "Next.js",
      "TypeScript",
      "TailwindCSS",
      "Python",
      "FastAPI",
      "AWS Lambda",
      "OpenAI API"
    ],
    link: "https://motionmerchant.com",
    status: "In Development",
    featured: true
  },
  {
    title: "Simulated Teaching & Learning at Scale",
    description: "Research framework for analyzing LLM-based student simulations in mathematics tutoring, focusing on simulation fidelity and teaching effectiveness.",
    techStack: [
      "Python",
      "PyTorch",
      "Streamlit",
      "Large Language Models",
      "Natural Language Processing"
    ],
    githubLink: "https://github.com/mikeion/simulated-teaching-learning-at-scale",
    status: "Research",
    featured: true
  },
  {
    title: "AI Podcast Insights Dashboard",
    description: "Application that generates personalized podcast summaries using AI, helping users discover and digest podcast content efficiently.",
    techStack: [
      "Python",
      "Streamlit",
      "OpenAI API",
      "Modal",
      "Speech-to-Text",
      "Natural Language Processing"
    ],
    link: "https://ai-podcast-insights.streamlit.app/",
    githubLink: "https://github.com/mikeion/AI-podcast-insights-application",
    status: "Live"
  },
  {
    title: "Minesweeper Game",
    description: "Classic Minesweeper implementation with multiple difficulty levels and modern UI.",
    techStack: [
      "JavaScript",
      "HTML5",
      "CSS3",
      "DOM Manipulation"
    ],
    link: "https://minesweeper.michaelion.repl.co/",
    githubLink: "https://github.com/mikeion/Minesweeper",
    status: "Live"
  }
];

// Development focus areas
const focusAreas = [
  {
    id: 'educational-tech',
    title: 'Educational Technology',
    description: 'Developing tools that enhance teaching and learning experiences, with a focus on making complex concepts more accessible.',
  },
  {
    id: 'ai-applications',
    title: 'AI Applications',
    description: 'Creating applications that leverage artificial intelligence, machine learning, and natural language processing to solve real-world problems.',
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Building responsive, accessible, and user-friendly web applications using modern frameworks and best practices.',
  },
];

export default function SoftwareDevelopment() {
  return (
    <Container className="py-5">
      <h1 className="mb-4">Software Development</h1>
      
      <p className="lead mb-5">
        My software development work focuses on creating educational tools, research frameworks, and applications that leverage 
        AI and computational methods. I combine modern development practices with research insights to build software 
        that addresses real-world educational and analytical challenges.
      </p>
      
      <h2 className="mb-4">Development Focus Areas</h2>
      <Row className="mb-5">
        {focusAreas.map((area) => (
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
      
      <h2 className="mb-4">Featured Projects</h2>
      <Row className="mb-5">
        {projects.map((project, index) => (
          <Col key={index} md={project.featured ? 12 : 6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h3 className="h4">{project.title}</h3>
                  <span className={`badge ${
                    project.status === 'Live' ? 'bg-success' : 
                    project.status === 'In Development' ? 'bg-warning text-dark' : 
                    'bg-primary'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="mb-3">{project.description}</p>
                
                <div className="mb-3">
                  <h4 className="h6 text-muted">Tech Stack</h4>
                  <div className="d-flex flex-wrap gap-2">
                    {project.techStack.map((tech, techIndex) => (
                      <span key={techIndex} className="badge bg-light text-dark">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="d-flex gap-3">
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-primary">
                      View Project →
                    </a>
                  )}
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-secondary">
                      GitHub Repository →
                    </a>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <h2 className="mb-4">Technical Skills</h2>
      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h3 className="h4 mb-3">Languages</h3>
              <ul className="list-unstyled">
                <li className="mb-2">Python</li>
                <li className="mb-2">TypeScript/JavaScript</li>
                <li className="mb-2">HTML/CSS</li>
                <li className="mb-2">SQL</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h3 className="h4 mb-3">Frameworks & Libraries</h3>
              <ul className="list-unstyled">
                <li className="mb-2">React/Next.js</li>
                <li className="mb-2">FastAPI</li>
                <li className="mb-2">PyTorch</li>
                <li className="mb-2">TailwindCSS</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h3 className="h4 mb-3">Tools & Platforms</h3>
              <ul className="list-unstyled">
                <li className="mb-2">AWS</li>
                <li className="mb-2">Git</li>
                <li className="mb-2">Docker</li>
                <li className="mb-2">OpenAI API</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
} 