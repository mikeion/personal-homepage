'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { FaGraduationCap, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';

// Define interfaces for teaching data types
interface TeachingPosition {
  institution: string;
  role: string;
  courses: Course[];
  description?: string;
  responsibilities?: string[];
}

interface Course {
  name: string;
  code?: string;
  date: string;
  url?: string;
  description?: string;
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
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mb-4 p-5">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{position.institution}</h3>
      <h4 className="text-lg text-slate-600 dark:text-slate-300 mb-4">{position.role}</h4>
      
      {/* Courses */}
      <div className="space-y-3 mb-4">
        {position.courses.map((course, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex justify-between items-start">
              <div>
                {course.url ? (
                  <a 
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {course.name}
                  </a>
                ) : (
                  <span className="font-medium">{course.name}</span>
                )}
                {course.code && (
                  <span className="text-slate-500 dark:text-slate-400 ml-2">
                    ({course.code})
                  </span>
                )}
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {course.date}
              </span>
            </div>
            {course.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {course.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Description and Responsibilities */}
      {position.description && (
        <p className="text-slate-600 dark:text-slate-400 mb-3">
          {position.description}
        </p>
      )}
      {position.responsibilities && (
        <div>
          <h5 className="text-md font-medium text-slate-700 dark:text-slate-300 mb-2">Responsibilities:</h5>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
            {position.responsibilities.map((resp, index) => (
              <li key={index}>{resp}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MentorshipSection({ groups }: { groups: MenteeGroup[] }) {
  return (
    <div className="mt-10">
      <div className="flex items-center mb-6">
        <FaUsers className="text-blue-500 mr-3 text-xl" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Mentorship</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {groups.map((group, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{group.type} Students</h3>
            <div className="space-y-2">
              {group.students.map((student, idx) => (
                <div 
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700"
                >
                  <span className="text-slate-700 dark:text-slate-300">{student.name}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {student.period}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
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
        {/* Expertise Areas */}
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

        {/* Teaching Philosophy */}
        <div className={`transition-all duration-700 delay-200 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center mb-6">
            <FaGraduationCap className="text-blue-500 mr-3 text-xl" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Philosophy</h2>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-12">
            <div className="space-y-5">
              {philosophyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mr-3">
                    <span className="text-blue-500 text-lg">•</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{point}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700">
              <a 
                href="/Teaching_Philosophy_Statement.pdf" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Full Teaching Philosophy Statement (PDF)
              </a>
            </div>
          </div>
        </div>

        {/* Teaching Experience */}
        <div className={`transition-all duration-700 delay-300 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center mb-6">
            <FaGraduationCap className="text-blue-500 mr-3 text-xl" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Experience</h2>
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
            <>
              <div className="space-y-6">
                {teachingData.positions.map((position, index) => (
                  <TeachingPosition key={index} position={position} />
                ))}
              </div>
              
              {/* Mentorship */}
              {teachingData.mentorship && teachingData.mentorship.length > 0 && (
                <MentorshipSection groups={teachingData.mentorship} />
              )}
            </>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-600 dark:text-blue-400">No teaching data available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}