'use client';

import Link from 'next/link';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaGraduationCap, FaBook, FaChalkboardTeacher, FaFileAlt, FaComment } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

// Academic areas with descriptions
const academicAreas = [
  {
    id: 'research',
    title: 'Research',
    description: 'My research explores mathematics education, teacher preparation, and the application of artificial intelligence to educational contexts.',
    icon: <FaGraduationCap size={40} className="text-blue-600 mb-3" />,
    link: '/research'
  },
  {
    id: 'publications',
    title: 'Publications',
    description: 'View my peer-reviewed journal articles, conference proceedings, book chapters, and other scholarly publications.',
    icon: <FaBook size={40} className="text-blue-600 mb-3" />,
    link: '/publications'
  },
  {
    id: 'teaching',
    title: 'Teaching',
    description: 'Explore my teaching philosophy, courses taught, and resources for students and educators.',
    icon: <FaChalkboardTeacher size={40} className="text-blue-600 mb-3" />,
    link: '/teaching'
  },
  {
    id: 'cv',
    title: 'Curriculum Vitae',
    description: 'Review my academic background, positions, grants, and scholarly contributions.',
    icon: <FaFileAlt size={40} className="text-blue-600 mb-3" />,
    link: '/cv'
  },
  {
    id: 'talks',
    title: 'Talks & Presentations',
    description: 'Information about my recent and upcoming talks, workshops, and presentations at conferences and events.',
    icon: <FaComment size={40} className="text-blue-600 mb-3" />,
    link: '/talks'
  }
];

export default function Academics() {
  return (
    <Container className="py-5">
      <h1 className="text-4xl font-bold mb-6 text-slate-800 dark:text-white">Academic Work</h1>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8">
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-0">
          As a researcher and educator at the intersection of mathematics education and artificial intelligence, 
          my academic work spans multiple disciplines. This page provides access to my research, publications, 
          teaching materials, curriculum vitae, and information about my talks and presentations.
        </p>
      </div>
      
      <div className="mb-12">
        {academicAreas.map((area) => (
          <div key={area.id} className="mb-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg">
                  {area.icon}
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">{area.title}</h2>
                  <p className="text-slate-600 dark:text-slate-300">{area.description}</p>
                </div>
                <div className="flex-shrink-0 mt-4 md:mt-0">
                  <Link href={area.link} passHref>
                    <Button className="bg-blue-600 hover:bg-blue-700 border-0 text-white font-medium rounded-lg px-5 py-2.5 transition-colors">
                      View {area.title}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Featured Publication or Research */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">Featured Work</h2>
        <Row>
          <Col md={6} className="mb-6">
            <Card className="border-0 shadow-sm h-100 dark:bg-slate-800">
              <Card.Body className="p-5">
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100 mb-3">
                  Latest Publication
                </span>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white">Text-as-Data in Mathematics Education</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Harnessing LLMs to analyze student conversations at scale, exploring how computational methods can provide insights into mathematics learning.
                </p>
                <Link href="/publications" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center">
                  Read more <span className="ml-1">→</span>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-6">
            <Card className="border-0 shadow-sm h-100 dark:bg-slate-800">
              <Card.Body className="p-5">
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-100 mb-3">
                  Current Project
                </span>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white">Measuring Tacit Mathematics Teaching Knowledge</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Using natural language processing to identify and assess the tacit knowledge mathematics teachers develop through practice.
                </p>
                <Link href="/research" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center">
                  Read more <span className="ml-1">→</span>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
} 