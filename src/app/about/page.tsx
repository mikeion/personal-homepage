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
      year: "2015-2016",
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
      year: "2013", 
      role: "B.S. in Mathematics",
      institution: "California Polytechnic State University",
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
                src="/images/bio_pic_optimized.jpg" 
                alt="Mike Ion" 
                fill
                priority
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
              I'm a researcher, educator, and technologist who develops <span className="font-semibold text-slate-800 dark:text-white">statistical methods to measure and simulate effective teaching at scale</span>. My work combines natural language processing, Bayesian modeling, and validated simulation to understand what makes instruction work.
            </p>
            <p>
              Working with <span className="font-semibold">5.5 million tutoring messages</span> and validated annotation frameworks, I build classifiers that detect patterns predicting learning outcomes—breakthrough moments, scaffolding moves, and engagement dynamics. Then I use these measurements in simulation frameworks to test hypotheses about what instructional strategies support learning.
            </p>
            <p>
              What drives me is the belief that rigorous statistical methods, when thoughtfully applied, can help us understand teaching and learning in ways that inform practice and policy.
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
              <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Measurement at Scale</h3>
              <p className="text-slate-600 dark:text-slate-300">
                I build statistical classifiers that capture subtle patterns in teaching and learning from massive conversational datasets (200K+ conversations). Using LLMs as feature extractors within statistical frameworks, I detect breakthrough moments, scaffolding moves, and engagement dynamics with validated reliability.
              </p>
            </Col>
            <Col md={4} className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Validated Simulation</h3>
              <p className="text-slate-600 dark:text-slate-300">
                I use simulation-based calibration to test what teaching strategies actually work. By treating AI models as components within statistical frameworks (not black boxes), I can run hypothesis tests at scales impossible with human participants alone—distinguishing genuine learning from surface-level behavior.
              </p>
            </Col>
            <Col md={4}>
              <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Cross-Domain Validation</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Methods matter when they generalize. I validate classification and temporal models across contexts: Discord tutoring, elementary classrooms (NCTE), and K-12 instruction (TalkMoves). This ensures findings transfer beyond the specific settings where they were developed.
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
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-slate-800 dark:text-white">Beyond Work</h2>
        
        {/* What I'm Reading Section */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-blue-900/30 rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">What I'm Reading</h3>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-3xl">
              Some books I've been enjoying lately that explore different perspectives:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800/70 rounded-lg p-5 shadow-sm hover:shadow-md transition-all">
                <h4 className="font-bold text-slate-800 dark:text-white">Invisible Women</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">by Caroline Criado Pérez</p>
                <details className="text-slate-600 dark:text-slate-300 cursor-pointer">
                  <summary className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1 hover:text-blue-700">About this book</summary>
                  <div className="pl-4 pt-2 text-sm">
                    <p>An eye-opening look at how data bias in design creates a world that ignores women's needs. Fascinating examples of how seemingly neutral systems often default to male perspectives.</p>
                  </div>
                </details>
              </div>
              <div className="bg-white dark:bg-slate-800/70 rounded-lg p-5 shadow-sm hover:shadow-md transition-all">
                <h4 className="font-bold text-slate-800 dark:text-white">Reading Lolita in Tehran</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">by Azar Nafisi</p>
                <details className="text-slate-600 dark:text-slate-300 cursor-pointer">
                  <summary className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1 hover:text-blue-700">About this book</summary>
                  <div className="pl-4 pt-2 text-sm">
                    <p>A memoir about teaching forbidden Western literature in Iran. Shows how books create spaces for personal freedom even in restrictive societies.</p>
                  </div>
                </details>
              </div>
              <div className="bg-white dark:bg-slate-800/70 rounded-lg p-5 shadow-sm hover:shadow-md transition-all">
                <h4 className="font-bold text-slate-800 dark:text-white">Poverty, by America</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">by Matthew Desmond</p>
                <details className="text-slate-600 dark:text-slate-300 cursor-pointer">
                  <summary className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1 hover:text-blue-700">About this book</summary>
                  <div className="pl-4 pt-2 text-sm">
                    <p>A thought-provoking look at how economic inequality persists despite abundance. Makes you think about systemic issues rather than individual ones.</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
        
        {/* Beyond Academia Section */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-full p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Outside of Work</h3>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-3xl">
              A few things I enjoy in my free time:
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Hobbies Section */}
              <div className="space-y-6">
                {/* Hiking */}
                <div className="bg-white dark:bg-slate-800/70 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 9l7 7 7-7" />
                    </svg>
                    <h4 className="font-bold text-slate-800 dark:text-white">Hiking</h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 pl-7 text-sm">
                    I love exploring trails and spending time outdoors whenever I can.
                  </p>
                </div>
                
                {/* Programming */}
                <div className="bg-white dark:bg-slate-800/70 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 dark:text-teal-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <h4 className="font-bold text-slate-800 dark:text-white">Coding Projects</h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 pl-7 text-sm">
                    I enjoy tinkering with new programming languages and tools on personal projects.
                  </p>
                </div>
              </div>
              
              {/* Music and Gaming Section */}
              <div className="space-y-6">
                {/* Music */}
                <div className="bg-white dark:bg-slate-800/70 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <h4 className="font-bold text-slate-800 dark:text-white">Making Music</h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 pl-7 text-sm mb-3">
                    I play guitar and ukulele, and occasionally dabble with digital music production.
                  </p>
                  <div className="mt-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">A small track I made:</p>
                    <audio controls className="w-full">
                      <source src="/sounds/stormy_waves.mp3" type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
                
                {/* Gaming */}
                <div className="bg-white dark:bg-slate-800/70 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                    <h4 className="font-bold text-slate-800 dark:text-white">Smash Bros</h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 pl-7 text-sm mb-3">
                    I play Super Smash Bros Melee in local tournaments. Currently #4 in SLO's PR.
                    <a href="https://smashers.app/melee/player/mathandsurf?id=S898035" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline ml-1">
                      View profile
                    </a>
                  </p>
                  <div className="mt-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                    <Image 
                      src="/images/slo_pr.jpg" 
                      alt="San Luis Obispo Power Ranking" 
                      width={500} 
                      height={300} 
                      className="rounded-md shadow-sm w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
} 