'use client';

import React, { useEffect, useState } from 'react';
import { FaGraduationCap, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';

// Define interfaces for teaching data types
interface Course {
  name: string;
  sections?: string[];
}

interface Role {
  title: string;
  courses: (string | Course)[];
}

interface TeachingPosition {
  institution: string;
  years: string;
  roles: Role[];
}

interface MenteeGroup {
  type: 'Graduate' | 'Undergraduate';
  students: Mentee[];
}

interface Mentee {
  name: string;
  period: string;
}

interface TeachingData {
  positions: TeachingPosition[];
  mentorship: MenteeGroup[];
}

// Teaching areas
const teachingAreas = [
  {
    title: "Mathematics & Statistics",
    description: "In teaching mathematics at Cal Poly, I found that collaborative problem-solving and guided exploration helped students move beyond memorizing procedures. Students in my Precalculus and Calculus courses worked with guided note packets during active learning sessions, which seemed to boost engagement even among those who initially struggled with the material. This experience shaped how I approach quantitative subjects, focusing on conceptual understanding rather than mechanical solutions."
  },
  {
    title: "Data Science & AI",
    description: "Working with students at Uplimit and Michigan has shown me how connecting technical concepts to real-world applications makes complex ideas more accessible. Students respond positively when they can work with meaningful datasets and choose project directions that interest them personally—whether creating AI-generated podcasts or analyzing educational data. I've learned to balance technical instruction with discussions of ethical implications in data-driven work."
  },
  {
    title: "Computing Education",
    description: "Mentoring undergraduate researchers like Amirali and Andre on projects involving citation mapping and machine learning has taught me the value of scaffolded learning experiences. I've found that gradually transferring responsibility as students gain confidence with computational tools helps them develop both technical skills and research capabilities. This approach has informed how I structure learning activities in programming and computational environments."
  },
  {
    title: "Inclusive Teaching",
    description: "My time teaching in Botswana's Kalahari region, where many students spoke English as a third or fourth language, fundamentally shaped my approach to inclusive teaching. Later experiences at Cal Poly, facilitating discussions about campus climate and working with neurodivergent students, reinforced the importance of creating learning environments responsive to diverse needs. These experiences continue to influence how I structure courses and interact with students."
  }
];

// Teaching Philosophy points
const philosophyPoints = [
  "Facilitating active, student-centered learning through structured note frameworks, collaborative group activities, and guided exploratory exercises that develop deeper conceptual understanding rather than rote procedural knowledge.",
  "Creating inclusive educational environments that honor diverse perspectives and learning needs, drawing on experiences from teaching in Botswana's Kalahari region to Johns Hopkins' Center for Talented Youth in Hong Kong and Seattle.",
  "Bridging educational divides by implementing methods such as peer-facilitated study groups in students' local dialects alongside formal instruction, addressing both academic achievement and intellectual self-efficacy.",
  "Fostering metacognitive awareness and self-regulated learning strategies that challenge assumptions linking mathematical talent solely to speed, promoting exploratory inquiry and resilient thought processes.",
  "Integrating technology thoughtfully to enrich rather than replace meaningful educational interactions, as demonstrated through globally accessible online courses with hands-on, contextually relevant projects.",
  "Approaching assessment as an integral component of learning through authentic projects that emphasize methodological rigor and analytical clarity over simple memorization, supporting transferable professional skills."
];

// Opening intro section
const teachingIntro = (
  <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800/30 p-8">
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-200 dark:bg-blue-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light opacity-20 blur-xl"></div>
    <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-indigo-200 dark:bg-indigo-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light opacity-20 blur-xl"></div>
    
    <div className="relative">
      <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-6">Teaching Philosophy</h2>
      
      <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
        My teaching journey spans diverse contexts—from classrooms in rural Botswana to prestigious U.S. universities to online platforms reaching global audiences. Each experience has shaped my belief that with appropriate guidance, every student can excel.
      </p>
      
      <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
        As an educator, I am committed to creating inclusive learning environments where students from all backgrounds can thrive. I recognize the historical barriers that have made subjects like mathematics, statistics, and data science less accessible to many—particularly students from underrepresented groups.
      </p>
      
      <div className="space-y-4 mb-6">
        <div className="flex gap-4">
          <div className="mt-1.5 flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 font-medium">1</span>
          </div>
          <div>
            <h3 className="font-medium text-slate-800 dark:text-white mb-1">Active Learning</h3>
            <p className="text-slate-600 dark:text-slate-400">Engaging students through collaborative activities and guided exploration rather than passive note-taking.</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="mt-1.5 flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 font-medium">2</span>
          </div>
          <div>
            <h3 className="font-medium text-slate-800 dark:text-white mb-1">Real-world Applications</h3>
            <p className="text-slate-600 dark:text-slate-400">Connecting theoretical concepts to practical contexts through projects with meaningful datasets.</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="mt-1.5 flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 font-medium">3</span>
          </div>
          <div>
            <h3 className="font-medium text-slate-800 dark:text-white mb-1">Community Building</h3>
            <p className="text-slate-600 dark:text-slate-400">Creating environments where students feel they belong through clear communication and understanding diverse backgrounds.</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="mt-1.5 flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 font-medium">4</span>
          </div>
          <div>
            <h3 className="font-medium text-slate-800 dark:text-white mb-1">Adaptable Methods</h3>
            <p className="text-slate-600 dark:text-slate-400">Responding to diverse student needs with flexible approaches, whether working with neurodivergent students or language learners.</p>
          </div>
        </div>
      </div>
      
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
        My teaching philosophy is intertwined with my research interests in mathematics education, learning technologies, and equity. I continue to learn from my students as I bridge theory and practice in varied educational contexts.
      </p>
    </div>
  </div>
);

function TeachingPosition({ position }: { position: TeachingPosition }) {
  // Special handling for Cal Poly to combine years
  const isCalPoly = position.institution === "California Polytechnic State University";
  
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
        <a href={position.institution === "University of Michigan" ? "https://umich.edu" : 
            position.institution === "Uplimit (formerly Corise)" ? "https://uplimit.com" : 
            position.institution === "Johns Hopkins University" ? "https://www.jhu.edu" :
            position.institution === "California Polytechnic State University" ? "https://www.calpoly.edu" : "#"} 
           target="_blank" 
           rel="noopener noreferrer"
           className="hover:underline">
          {position.institution}
        </a>
      </h3>
      
      {position.roles.map((role, roleIndex) => {
        // Format years based on role for Cal Poly
        const formattedYears = isCalPoly
          ? role.title === "Workshop Facilitator"
            ? "2011-2013"
            : "2013-2015, 2017"
          : position.years;

        return (
          <div key={roleIndex} className="mt-4 last:mb-0">
            {/* Role and Years */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-slate-700 dark:text-slate-300">{role.title}</span>
              <span className="text-sm px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-600 dark:text-slate-400">
                {formattedYears}
              </span>
            </div>
            
            {/* Courses */}
            <div className="space-y-3 ml-1">
              {role.courses.map((course, courseIndex) => (
                <div key={courseIndex} className="text-slate-600 dark:text-slate-400">
                  {typeof course === 'string' ? (
                    <div className="flex items-start gap-2 py-1">
                      <span className="text-blue-500 mt-1.5">•</span>
                      <span className="text-slate-700 dark:text-slate-300">{course}</span>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1.5">•</span>
                        <span className="text-slate-700 dark:text-slate-300">{course.name}</span>
                      </div>
                      {course.sections && (
                        <div className="ml-6 mt-2">
                          {course.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="text-sm text-slate-500 dark:text-slate-400 py-0.5">
                              {section}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MentorshipSection({ groups }: { groups: MenteeGroup[] }) {
  return (
    <div className="mt-12 bg-slate-50 dark:bg-slate-800/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <FaUsers className="text-blue-500 mr-3 text-xl" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Mentorship</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {groups.map((group, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">{group.type} Students</h3>
              <div className="space-y-2">
                {group.students.map((student, idx) => (
                  <div 
                    key={idx}
                    className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 last:border-0"
                  >
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{student.name}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                      {student.period}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Teaching() {
  const [teachingData, setTeachingData] = useState<TeachingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Mount animation effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch teaching data from API
  useEffect(() => {
    async function fetchTeachingData() {
      try {
        const response = await fetch('/api/teaching');
        if (!response.ok) {
          throw new Error('Failed to fetch teaching data');
        }
        const data = await response.json();
        setTeachingData(data);
      } catch (err) {
        console.error('Error loading teaching data:', err);
        setError('Error loading teaching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchTeachingData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-slate-700">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 dark:bg-indigo-900/30 rounded-full filter blur-3xl opacity-30"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className={`transition-all duration-700 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-800 dark:text-white mb-4">Teaching</h1>
              <div className="h-1 w-20 bg-blue-500 rounded-full mb-6"></div>
              {teachingIntro}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Teaching Approaches */}
        <div className={`transition-all duration-700 delay-100 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} mb-12`}>
          <div className="flex items-center mb-6">
            <FaChalkboardTeacher className="text-blue-500 mr-3 text-xl" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Teaching Approaches</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teachingAreas.map((area, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">{area.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{area.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Teaching Experience */}
        <div className={`transition-all duration-700 delay-300 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center mb-6">
            <FaGraduationCap className="text-blue-500 mr-3 text-xl" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Teaching Experience</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-300">Loading teaching data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : teachingData ? (
            <div className="space-y-8 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm p-6">
              {teachingData.positions.map((position, index) => (
                <TeachingPosition key={index} position={position} />
              ))}
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-600 dark:text-blue-400">No teaching data available.</p>
            </div>
          )}
        </div>

        {/* Mentorship */}
        {teachingData?.mentorship && teachingData.mentorship.length > 0 && (
          <MentorshipSection groups={teachingData.mentorship} />
        )}
      </div>
    </div>
  );
}