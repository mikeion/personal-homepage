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
    description: "Designing learning experiences that prioritize conceptual understanding over procedure, using collaborative problem-solving approaches and inclusive learning spaces to make quantitative reasoning accessible for students from diverse backgrounds."
  },
  {
    title: "Data Science & AI",
    description: "Integrating computational methods with statistical modeling through practical applications that connect theoretical foundations to real-world contexts, emphasizing both technical skills and ethical considerations in data-driven decision making."
  },
  {
    title: "Computing Education",
    description: "Developing innovative computational tools and pedagogical strategies that support adaptive learning, facilitate meaningful feedback, and promote learner agency in computer science and programming environments."
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
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                As an educator specializing in mathematics, statistics, and data science, my teaching emphasizes active engagement, inclusive practices, and skills that students can readily apply in real-world settings. My approach has developed through diverse teaching experiences, ranging from classrooms in rural Botswana to leading courses with Johns Hopkins University's Center for Talented Youth, Stanford University's Education Program for Gifted Youth, Cal Poly, and through online instruction reaching students globally.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Areas of Expertise */}
        <div className={`transition-all duration-700 delay-100 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center mb-6">
            <FaChalkboardTeacher className="text-blue-500 mr-3 text-xl" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Areas of Expertise</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {teachingAreas.map((area, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{area.title}</h3>
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