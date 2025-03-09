'use client';

import { Container, Row, Col } from 'react-bootstrap';
import { FaGraduationCap, FaChalkboardTeacher, FaGlobe, FaLaptopCode, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import Image from 'next/image';

export default function About() {
  // Timeline entries for professional journey
  const journeyTimeline = [
    {
      year: "Present",
      role: "Postdoctoral Fellow in AI and Education",
      institution: "School of Information, University of Michigan",
      description: "Researching the intersection of artificial intelligence and education, with a focus on using computational methods to enhance learning experiences.",
      icon: <FaLaptopCode />,
    },
    {
      year: "2024",
      role: "Ph.D. in Mathematics Education",
      institution: "University of Michigan",
      description: "Dissertation: \"Beyond the Classroom: Exploring Mathematics Engagement in Online Communities with Natural Language Processing\"",
      icon: <FaGraduationCap />,
    },
    {
      year: "2011-2024",
      role: "Mathematics Instructor",
      institution: "Various Settings",
      description: "Taught mathematics and statistics in various capacities including workshop leader, lecturer, TA, and instructor.",
      icon: <FaChalkboardTeacher />,
    },
    {
      year: "2011-2013",
      role: "Peace Corps Volunteer",
      institution: "Botswana",
      description: "Taught middle and high school mathematics while immersing in the local culture and community.",
      icon: <FaGlobe />,
    },
    {
      year: "2015",
      role: "M.S. in Mathematics",
      institution: "California Polytechnic State University",
      description: "Focused on applied mathematics and teaching methodologies.",
      icon: <FaGraduationCap />,
    },
    {
      year: "2023", 
      role: "B.S. in Mathematics",
      institution: "California Polytechnic State University", // Assuming same institution as MS, update if different
      description: "Undergraduate studies in mathematics with a focus on pure mathematics.",
      icon: <FaGraduationCap />,
    },
  ];

  return (
    <Container className="py-16">
      {/* Personal Introduction */}
      <Row className="mb-16">
        <Col lg={4} className="mb-8 lg:mb-0">
          <div className="relative w-full max-w-xs mx-auto lg:mx-0">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
              <Image 
                src="/images/bio_pic.jpeg" 
                alt="Mike Ion" 
                fill
                style={{ objectFit: 'cover' }}
                className="transform transition-transform hover:scale-105 duration-500"
              />
            </div>
          </div>
        </Col>
        <Col lg={8}>
          <h1 className="text-4xl font-bold mb-6 text-slate-800 dark:text-white">Hi, I'm Mike Ion</h1>
          <div className="mb-6 text-slate-600 dark:text-slate-300 text-lg space-y-4">
            <p>
              I'm a researcher, educator, and technologist with a passion for using computational methods to understand and enhance how people learn—especially in mathematics.
            </p>
            <p>
              My work sits at the intersection of education research, artificial intelligence, and natural language processing. I'm particularly interested in how we can analyze and support learning conversations at scale, whether they happen in classrooms or online communities.
            </p>
            <p>
              What drives me is the belief that technology, when thoughtfully applied, can make learning more accessible, personalized, and effective for all students.
            </p>
          </div>
          <div className="flex gap-4">
            <a 
              href="https://github.com/mikeion" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-300 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub size={22} />
            </a>
            <a 
              href="https://www.linkedin.com/in/mikeion" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-300 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={22} />
            </a>
            <a 
              href="mailto:mikeion@umich.edu" 
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-300 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
              aria-label="Email"
            >
              <FaEnvelope size={22} />
            </a>
          </div>
        </Col>
      </Row>

      {/* My Approach/Philosophy */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-slate-800 dark:text-white">My Approach</h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8">
          <Row>
            <Col md={4} className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Interdisciplinary Mindset</h3>
              <p className="text-slate-600 dark:text-slate-300">
                I believe the most interesting solutions emerge at the boundaries between disciplines. My work combines methods from education research, computer science, and data science to tackle complex learning challenges.
              </p>
            </Col>
            <Col md={4} className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Human-Centered Technology</h3>
              <p className="text-slate-600 dark:text-slate-300">
                While I'm excited about AI's potential in education, I always center the human experience. Technology should enhance human capabilities and connections, not replace them. This philosophy shapes how I design and evaluate educational tools.
              </p>
            </Col>
            <Col md={4}>
              <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Research to Practice</h3>
              <p className="text-slate-600 dark:text-slate-300">
                I'm committed to ensuring research findings make their way into practical applications. Whether through developing tools, consulting with organizations, or teaching, I work to bridge the gap between academic insights and real-world impact.
              </p>
            </Col>
          </Row>
        </div>
      </div>

      {/* Professional Journey */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-slate-800 dark:text-white">Professional Journey</h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-blue-200 dark:bg-blue-900/50"></div>
          
          {/* Timeline entries */}
          <div className="space-y-8">
            {journeyTimeline.map((entry, index) => (
              <div key={index} className="relative flex gap-6">
                <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-4 border-white dark:border-slate-900 z-10">
                  {entry.icon}
                </div>
                <div className="flex-grow pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full">
                      {entry.year}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{entry.role}</h3>
                  </div>
                  <p className="text-blue-700 dark:text-blue-400 font-medium mb-2">{entry.institution}</p>
                  <p className="text-slate-600 dark:text-slate-300">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personal Section */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-slate-800 dark:text-white">Beyond Work</h2>
        <Row>
          <Col md={6} className="mb-6 md:mb-0">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 h-full">
              <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">What I'm Reading</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                I'm currently exploring books on AI ethics, computational social science, and learning theory. Some recent favorites include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                <li>Atlas of AI by Kate Crawford</li>
                <li>Bit by Bit: Social Research in the Digital Age by Matthew Salganik</li>
                <li>How Learning Happens by Paul Kirschner and Carl Hendrick</li>
              </ul>
            </div>
          </Col>
          <Col md={6}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 h-full">
              <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Beyond Academia</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                When I'm not researching or teaching, you might find me:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                <li>Hiking and exploring the outdoors</li>
                <li>Experimenting with new programming languages</li>
                <li>Supporting initiatives that broaden participation in STEM</li>
                <li>Enjoying coffee and conversations with friends and colleagues</li>
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
} 