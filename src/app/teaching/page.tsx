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
    description: "At Cal Poly, I embraced the ethos of \"productive struggle\" and \"learn by doing\" while teaching Precalculus, Calculus for Life Sciences, and Business Calculus. Rather than presenting mathematics as a collection of procedures to memorize, I design learning experiences that foster conceptual understanding through collaborative problem-solving. For example, in my Calculus courses, I developed guided note packets that students completed during active learning sessions, significantly increasing engagement and confidence even among students who previously struggled with mathematics."
  },
  {
    title: "Data Science & AI",
    description: "Through my work with Uplimit (formerly CoRise) and at the University of Michigan, I've developed approaches for making complex computational concepts accessible to diverse learners. I integrate statistical modeling with real-world applications, emphasizing the ethical implications of data-driven decisions. My students work with authentic datasets on projects they find personally meaningful—from creating AI-generated podcasts to analyzing social patterns in educational data—building both technical proficiency and critical awareness of how these tools impact society."
  },
  {
    title: "Computing Education",
    description: "My experiences mentoring undergraduate researchers at Michigan have shaped my approach to computing education. Working with students like Amirali and Andre on projects involving citation mapping and machine learning, I've developed scaffolded learning experiences that build technical skills while nurturing research capabilities. I focus on creating environments where students can develop agency in programming, providing structured support that gradually transfers responsibility as learners gain confidence with computational tools and methodologies."
  },
  {
    title: "Inclusive Teaching Practices",
    description: "Teaching in Botswana's Kalahari region, where many students spoke English as a third or fourth language and faced significant resource limitations, profoundly influenced my commitment to educational equity. Later, at Cal Poly, I facilitated difficult conversations about campus climate issues affecting minoritized students and worked closely with neurodivergent learners to develop supportive accommodations. These experiences inform my ongoing efforts to create learning environments where all students feel valued and capable, regardless of their background or starting point."
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
  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-10">
    <p className="text-slate-700 dark:text-slate-300 mb-4">
      My teaching journey spans diverse contexts—from classrooms in rural Botswana to prestigious U.S. universities to online platforms reaching global audiences. Each experience has shaped my belief that with appropriate guidance, every student can excel.
    </p>
    
    <p className="text-slate-700 dark:text-slate-300 mb-4">
      As an educator, I am committed to creating inclusive learning environments where students from all backgrounds can thrive. I recognize the historical barriers that have made subjects like mathematics, statistics, and data science less accessible to many—particularly students from underrepresented groups. This awareness guides my approach to teaching, where I emphasize:
    </p>
    
    <ul className="list-disc pl-6 mb-4 text-slate-700 dark:text-slate-300 space-y-2">
      <li><span className="font-medium">Active learning</span> over passive note-taking. In my Calculus courses, I've distributed guided note packets that students fill in during lectures and group exercises, leading to higher engagement and confidence.</li>
      <li><span className="font-medium">Real-world applications</span> that connect theoretical concepts to practical contexts. In teaching statistics and machine learning, I underscore the importance of projects with intriguing datasets, allowing students to choose directions meaningful to them.</li>
      <li><span className="font-medium">Clear communication</span> of expectations while building a sense of community. I invest time in learning about my students' backgrounds and creating an environment where everyone feels they belong.</li>
      <li><span className="font-medium">Adaptable methods</span> that respond to diverse student needs, whether working with neurodivergent students at Cal Poly, English-language learners in Botswana, or online learners from varied cultural backgrounds at Uplimit.</li>
    </ul>
    
    <p className="text-slate-700 dark:text-slate-300">
      My teaching philosophy is deeply intertwined with my research interests in mathematics education, learning technologies, and equity. I strive to bridge theory and practice, using evidence-based approaches while remaining attuned to the unique contexts and needs of my students.
    </p>
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
        {/* Teaching Areas */}
        <div className={`transition-all duration-700 delay-100 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} mb-12`}>
          <div className="flex items-center mb-6">
            <FaChalkboardTeacher className="text-blue-500 mr-3 text-xl" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Areas of Expertise</h2>
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