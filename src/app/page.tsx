'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaGraduationCap, FaLaptopCode, FaChalkboardTeacher, FaEnvelope, FaGithub, FaLinkedin, FaArrowRight } from 'react-icons/fa';
import { SiBluesky } from 'react-icons/si';

export default function Home() {
  // Education details
  const education = [
    {
      degree: "Ph.D. in Mathematics Education",
      institution: "University of Michigan",
      year: "2024"
    },
    {
      degree: "M.S. in Mathematics",
      institution: "Cal Poly",
      year: "2015"
    },
    {
      degree: "B.S. in Mathematics",
      institution: "Cal Poly",
      year: "2013"
    },
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
      link: '/software-development',
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
        <Container className="py-10 md:py-16">
          <Row className="align-items-center">
            <Col lg={7} className="mb-6 lg:mb-0 pr-lg-5">
              <div className="mb-5">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-slate-800 dark:text-white">
                  Mike Ion
                </h1>
                <h2 className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-3 font-light">
                  Educator · Researcher · Developer
                </h2>
                <div className="h-1 w-32 bg-blue-500 mb-4 rounded-full"></div>
              </div>
              
              <p className="text-base text-slate-600 dark:text-slate-300 mb-5 max-w-2xl leading-relaxed">
                I'm an educator, researcher, and developer working at the intersection of mathematics, statistics, data science, and AI. My work integrates computational methods and statistical modeling with insights from educational research, exploring how teachers and learners strategically interact to build effective learning environments. I am particularly committed to developing innovative tools and strategies that account for learners' diverse backgrounds, support adaptive teaching methods, and promote meaningful feedback and learner agency.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-5">
                {/* Education Section */}
                <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-200 flex items-center">
                    <FaGraduationCap className="mr-2 text-blue-500" /> Education
                  </h3>
                  {education.map((edu, index) => (
                    <div key={index} className="mb-2">
                      <div className="font-medium text-sm">{edu.degree}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-sm">{edu.institution}, {edu.year}</div>
                    </div>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-200 flex items-center">
                    <FaEnvelope className="mr-2 text-blue-500" /> Contact
                  </h3>
                  <div className="flex flex-col gap-2">
                    <a href="mailto:mikeion@umich.edu" className="flex items-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                      <FaEnvelope className="mr-2 text-blue-500" /> mikeion@umich.edu
                    </a>
                    <div className="flex gap-3 flex-wrap">
                      <a href="https://github.com/mikeion" className="flex items-center px-2 py-1 bg-white dark:bg-slate-700 rounded-md shadow-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                        <FaGithub className="mr-1" /> GitHub
                      </a>
                      <a href="https://linkedin.com/in/mikeion" className="flex items-center px-2 py-1 bg-white dark:bg-slate-700 rounded-md shadow-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                        <FaLinkedin className="mr-1" /> LinkedIn
                      </a>
                      <a href="https://bsky.app/profile/mike-ion.bsky.social" className="flex items-center px-2 py-1 bg-white dark:bg-slate-700 rounded-md shadow-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                        <SiBluesky className="mr-1" /> Bluesky
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={5} className="text-center">
              <div className="relative mx-auto overflow-hidden rounded-full border-4 border-white dark:border-slate-700 shadow-xl" style={{ width: '320px', height: '320px' }}>
                {/* Decorative element */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl z-0"></div>
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-indigo-500/20 rounded-full blur-xl z-0"></div>
                
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

      {/* Contact Section */}
      <div className="bg-white dark:bg-slate-900">
        <Container className="py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-white">
              Contact Me
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
              I offer a complimentary 15-minute consultation to discuss potential collaborations in research, 
              educational initiatives, or development projects. Whether you're interested in AI applications in 
              education, mathematics teaching and learning, or technical development, I'd be happy to connect.
            </p>
            <a href="https://calendly.com/mikeion/15min" target="_blank" rel="noopener noreferrer">
              <Button className="bg-blue-600 hover:bg-blue-700 border-0 px-8 py-3 text-white font-medium rounded-lg transition-colors">
                Schedule a Free 15-Minute Consultation
              </Button>
            </a>
          </div>
        </Container>
      </div>
    </div>
  );
}
