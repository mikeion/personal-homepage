'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaGraduationCap, FaLaptopCode, FaChalkboardTeacher, FaFileAlt, FaArrowRight } from 'react-icons/fa';

export default function Home() {
  // Areas of expertise
  const areas = [
    {
      title: 'Academic Research',
      icon: <FaGraduationCap size={40} className="text-blue-600" />,
      description: 'Investigating how AI and computational methods can enhance education, with a focus on mathematics teaching and learning.',
      link: '/academics',
      color: 'border-blue-500'
    },
    {
      title: 'Software Development',
      icon: <FaLaptopCode size={40} className="text-teal-600" />,
      description: 'Creating educational software and tools that leverage data science and machine learning to solve real-world problems.',
      link: '/programming',
      color: 'border-teal-500'
    },
    {
      title: 'Teaching & Mentorship',
      icon: <FaChalkboardTeacher size={40} className="text-indigo-600" />,
      description: 'Sharing knowledge through university courses, workshops, and mentoring students in education and technology.',
      link: '/teaching',
      color: 'border-indigo-500'
    },
    {
      title: 'Consulting & Writing',
      icon: <FaFileAlt size={40} className="text-amber-600" />,
      description: 'Helping organizations apply research-based approaches to educational challenges and communicating insights through writing.',
      link: '/practice',
      color: 'border-amber-500'
    }
  ];

  // Recent highlights
  const highlights = [
    {
      title: 'Recent Publication',
      content: 'Text-as-Data in Mathematics Education: Harnessing LLMs to Analyze Student Conversations at Scale',
      link: '/publications',
      category: 'Research'
    },
    {
      title: 'Latest Project',
      content: 'Developing AI tools to assist mathematics instructors in understanding student misconceptions',
      link: '/programming',
      category: 'Development'
    },
    {
      title: 'Upcoming Talk',
      content: 'Joint Mathematics Meeting (2025) in Seattle on Generative AI in Mathematics Education',
      link: '/talks',
      category: 'Speaking'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with clean gradient background */}
      <div className="bg-gradient-to-tr from-blue-50 via-slate-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">        
        <Container className="py-16 md:py-24">
          <Row className="align-items-center">
            <Col lg={7} className="mb-10 lg:mb-0">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-800 dark:text-white">
                Bridging Research & Practice
              </h1>
              <h2 className="text-2xl md:text-3xl text-slate-600 dark:text-slate-300 mb-8 font-light">
                Educator · Researcher · Developer · Consultant
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-2xl leading-relaxed">
                I bridge academic research with practical applications, using computational 
                methods and AI to enhance teaching and learning while developing
                tools that make education more effective and accessible.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/academics" passHref>
                  <Button className="bg-blue-600 hover:bg-blue-700 border-0 px-8 py-3 text-white font-medium rounded-lg transition-colors">
                    Academic Work
                  </Button>
                </Link>
                <Link href="/practice" passHref>
                  <Button variant="outline-primary" className="px-8 py-3 font-medium rounded-lg border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    Professional Services
                  </Button>
                </Link>
              </div>
            </Col>
            <Col lg={5} className="text-center">
              <div className="relative mx-auto overflow-hidden rounded-full border-4 border-white dark:border-slate-700 shadow-lg" style={{ width: '360px', height: '360px' }}>
                {/* Use a fallback div with gradient if image fails to load */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500"></div>
                <Image 
                  src="/images/headshot_optimized.jpg" 
                  alt="Mike Ion" 
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  className="z-10"
                  onError={(e) => {
                    // If image fails to load, fallback is already present
                    console.log("Image failed to load");
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Professional Areas Section */}
      <div className="bg-white dark:bg-slate-900">
        <Container className="py-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-white">
              Professional Focus Areas
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              My work spans multiple disciplines, combining research and application to create meaningful impact.
            </p>
          </div>
          
          <Row>
            {areas.map((area, index) => (
              <Col key={index} md={6} lg={3} className="mb-8">
                <div className={`group h-full bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-t-4 ${area.color}`}>
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-center items-center w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-lg mb-5 group-hover:scale-110 transition-transform duration-300">
                      {area.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white">{area.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-5 flex-grow">
                      {area.description}
                    </p>
                    <Link href={area.link} className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                      Learn more <FaArrowRight className="ml-2 text-sm group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Recent Highlights Section */}
      <div className="bg-slate-50 dark:bg-slate-800">
        <Container className="py-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-white">
              Recent Highlights
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Selected examples of my latest work, publications, and speaking engagements.
            </p>
          </div>
          
          <Row>
            {highlights.map((item, index) => (
              <Col key={index} md={4} className="mb-8">
                <div className="h-full">
                  <div className="h-full bg-white dark:bg-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6">
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
                        ${item.category === 'Research' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100' : 
                        item.category === 'Development' ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-100' :
                        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-100'}`}>
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      {item.content}
                    </p>
                    <Link href={item.link} className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mt-auto">
                      View details <FaArrowRight className="ml-2 text-sm group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Connect Section */}
      <div className="bg-white dark:bg-slate-900">
        <Container className="py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-white">
              Let's Connect
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-10">
              I'm always interested in collaborating on research, educational initiatives, consulting opportunities, 
              or just discussing ideas at the intersection of education and technology.
            </p>
            <Link href="/about" passHref>
              <Button className="bg-blue-600 hover:bg-blue-700 border-0 px-8 py-3 text-white font-medium rounded-lg transition-colors">
                Get in Touch
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}
