'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGraduationCap, FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiBluesky } from 'react-icons/si';
import { useEffect, useState } from 'react';
import { LatestProjectCard, UpcomingTalkCard } from '@/components/home/ProjectAndTalkCards';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  // Mount animation effect
  useEffect(() => {
    setMounted(true);
  }, []);

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
      title: 'AI-Enhanced Technical Interview Preparation',
      content: 'Creating scalable, personalized technical interview practice for data science students by combining expert human interviews with AI simulation.',
      category: 'Research'
    },
    {
      title: 'Teaching and Learning in the Age of Generative AI',
      content: 'Investigating the essential human dimensions of teaching that AI cannot replace in an era of widespread generative AI adoption.',
      category: 'Development'
    },
    {
      title: 'AI-Ready Test Beds for Higher Education',
      content: 'Developing infrastructure for evaluating AI technologies in higher education contexts.',
      category: 'Research'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 dark:bg-indigo-900/30 rounded-full filter blur-3xl opacity-30"></div>
        </div>
        
        {/* Main content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className={`transition-all duration-700 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Text content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-800 dark:text-white">
                    Mike Ion
                  </h1>
                  <h2 className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-light">
                    Educator · Researcher · Developer
                  </h2>
                  <div className="h-1 w-24 bg-blue-500 rounded-full my-4"></div>
                </div>
                
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    I'm an educator, researcher, and developer working at the intersection of mathematics, statistics, data science, and AI. My work integrates computational methods and statistical modeling with insights from educational research, exploring how teachers and learners strategically interact to build effective learning environments. I am particularly committed to developing innovative tools and strategies that account for learners' diverse backgrounds, support adaptive teaching methods, and promote meaningful feedback and learner agency.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Education Section */}
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="text-lg font-medium mb-3 text-slate-700 dark:text-slate-200 flex items-center">
                      <FaGraduationCap className="mr-2 text-blue-500" /> Education
                    </h3>
                    <div className="space-y-3">
                      {education.map((edu, index) => (
                        <div key={index} className="group transition-all">
                          <div className="font-medium text-slate-800 dark:text-slate-200">{edu.degree}</div>
                          <div className="text-slate-500 dark:text-slate-400 text-sm">{edu.institution}, {edu.year}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="text-lg font-medium mb-3 text-slate-700 dark:text-slate-200 flex items-center">
                      <FaEnvelope className="mr-2 text-blue-500" /> Contact
                    </h3>
                    <div className="space-y-3">
                      <a href="mailto:mikeion@umich.edu" className="flex items-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <FaEnvelope className="mr-2 text-blue-500" /> mikeion@umich.edu
                      </a>
                      <div className="flex flex-wrap gap-2">
                        <a href="https://github.com/mikeion" className="flex items-center px-3 py-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:shadow-md">
                          <FaGithub className="mr-2" /> GitHub
                        </a>
                        <a href="https://linkedin.com/in/mikeion" className="flex items-center px-3 py-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:shadow-md">
                          <FaLinkedin className="mr-2" /> LinkedIn
                        </a>
                        <a href="https://bsky.app/profile/mike-ion.bsky.social" className="flex items-center px-3 py-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:shadow-md">
                          <SiBluesky className="mr-2" /> Bluesky
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Profile Image */}
              <div className="lg:col-span-5">
                <div className={`transition-all duration-700 delay-300 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <div className="relative mx-auto max-w-sm">
                    {/* Clean, elegant profile image */}
                    <div className="rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg">
                      <Image 
                        src="/images/headshot_optimized.jpg" 
                        alt="Mike Ion" 
                        width={320}
                        height={320}
                        priority
                        className="w-full h-auto"
                      />
                    </div>
                    {/* Subtle circular accent */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full -z-10 blur-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cards Section */}
      <div className="py-16 bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-700 delay-200 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <LatestProjectCard />
              </div>
              <div>
                <UpcomingTalkCard />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Work Section */}
      <div className="relative py-16 bg-gradient-to-b from-blue-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-700 delay-200 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Current Research</h2>
              <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {highlights.map((item, index) => (
                <div 
                  key={index} 
                  className={`transition-all duration-700 delay-${index * 100} transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                  <div className="h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-slate-100 dark:border-slate-700 flex flex-col group hover:scale-[1.02]">
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
                        ${item.category === 'Research' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100' : 
                        'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-100'}`}>
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4 flex-grow">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Consulting Section */}
      <div className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-700 delay-300 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 md:p-10 shadow-sm border border-blue-100 dark:border-blue-800/30">
              <div className="grid md:grid-cols-5 gap-8 items-center">
                <div className="md:col-span-3">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">Let's Connect</h2>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    I offer a complimentary 15-minute consultation to discuss potential collaborations in research, 
                    educational initiatives, or development projects. Whether you're interested in AI applications in 
                    education, mathematics teaching and learning, or technical development, I'd be happy to connect.
                  </p>
                </div>
                <div className="md:col-span-2 text-center md:text-right">
                  <a 
                    href="https://calendly.com/mikeion/15min" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow transition-all duration-300"
                  >
                    Schedule a Free Consultation
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
