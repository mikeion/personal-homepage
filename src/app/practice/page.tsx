'use client';

import Link from 'next/link';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaLaptopCode, FaHandshake, FaExternalLinkAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

// Professional areas with descriptions
const practiceAreas = [
  {
    id: 'programming',
    title: 'Programming',
    description: 'Explore software projects, tools, and applications I\'ve developed to support research and learning in educational contexts.',
    icon: <FaLaptopCode size={40} className="text-teal-600 mb-3" />,
    link: '/programming',
    color: 'border-teal-500'
  },
  {
    id: 'consulting',
    title: 'Consulting',
    description: 'Learn about the consulting services I offer to educational institutions, edtech companies, and research organizations.',
    icon: <FaHandshake size={40} className="text-amber-600 mb-3" />,
    link: '/consulting',
    color: 'border-amber-500'
  }
];

export default function ProfessionalPractice() {
  return (
    <Container className="py-5">
      <h1 className="text-4xl font-bold mb-6 text-slate-800 dark:text-white">Professional Practice</h1>
      
      <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg mb-8">
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-0">
          My professional work extends beyond academic research to include software development 
          and consulting services. This page highlights the various professional 
          contributions I provide in the fields of education and technology.
        </p>
      </div>
      
      <Row className="mb-12">
        {practiceAreas.map((area) => (
          <Col key={area.id} md={6} className="mb-6">
            <Link href={area.link} className="block h-full no-underline">
              <div className={`group h-full bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-t-4 ${area.color} overflow-hidden`}>
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className="flex justify-center items-center w-14 h-14 bg-slate-50 dark:bg-slate-700 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                      {area.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{area.title}</h2>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-300 mb-4 flex-grow">
                    {area.description}
                  </p>
                  
                  <div className="text-teal-600 dark:text-teal-400 font-medium flex items-center mt-auto">
                    Explore {area.title} <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>

      {/* Writing Section with External Link */}
      <div className="mb-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0 md:mr-6">
            <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">Writing & Notes</h2>
            <p className="text-slate-700 dark:text-slate-300">
              I maintain a separate site for my writing, blog posts, and notes on various topics related to 
              education, technology, and AI. This collection includes technical tutorials, reflections on 
              teaching and learning, and explorations of current trends.
            </p>
          </div>
          <a 
            href="https://mikeion.github.io/Notes/" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-5 py-2.5 transition-colors whitespace-nowrap"
          >
            Visit Writing Site <FaExternalLinkAlt size={14} className="ml-2" />
          </a>
        </div>
      </div>
      
      {/* Featured Professional Work */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">Recent Professional Work</h2>
        <Row>
          <Col md={12} className="mb-6">
            <Card className="border-0 shadow-sm h-100 dark:bg-slate-800">
              <Card.Body className="p-5">
                <Row>
                  <Col md={8}>
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-100 mb-3">
                      Recent Project
                    </span>
                    <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white">Educational Data Analysis Tools</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      I've recently developed a suite of open-source tools for analyzing educational data, 
                      with a focus on making complex analysis techniques accessible to education researchers 
                      who may not have extensive programming experience.
                    </p>
                    <Link href="/programming" className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center">
                      View Project <span className="ml-1">→</span>
                    </Link>
                  </Col>
                  <Col md={4} className="d-flex align-items-center justify-content-center">
                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                      <FaLaptopCode size={36} />
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      
      {/* Contact for Professional Services */}
      <div className="mt-10 bg-gradient-to-r from-slate-50 to-teal-50 dark:from-slate-800 dark:to-teal-900/20 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Need Professional Services?</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          I provide consulting services in educational technology, data analysis, and AI implementation for learning environments.
          Feel free to reach out to discuss how I can help with your project or organization.
        </p>
        <Link href="/about" className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg px-5 py-2.5 transition-colors">
          Contact Me
        </Link>
      </div>
    </Container>
  );
} 