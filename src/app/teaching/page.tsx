'use client';

import React, { useEffect, useState } from 'react';
import { FaGraduationCap, FaUsers, FaAward, FaChartLine } from 'react-icons/fa';

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
  currentPosition?: string;
}

interface Award {
  year: number;
  title: string;
  institution: string;
}

interface TeachingData {
  positions: TeachingPosition[];
  mentorship: MenteeGroup[];
  awards?: Award[];
}

export default function Teaching() {
  const [teachingData, setTeachingData] = useState<TeachingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchTeachingData() {
      try {
        const response = await fetch('/api/teaching');
        if (!response.ok) throw new Error('Failed to fetch teaching data');
        const data = await response.json();
        setTeachingData(data);
      } catch (err) {
        console.error('Error loading teaching data:', err);
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
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className={`transition-all duration-700 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-800 dark:text-white mb-4">Teaching</h1>
            <div className="h-1 w-20 bg-blue-500 rounded-full mb-8"></div>

            <div className="max-w-3xl">
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                My teaching philosophy is simple: <span className="font-semibold text-slate-800 dark:text-white">with appropriate guidance, every student can excel</span>. My research on learning analytics directly informs my teaching practice, helping me understand what actually works.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">14+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Years Teaching</div>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">10</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Students Mentored</div>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">20+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Courses Taught</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teaching Approach */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">My Teaching Approach</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Research-Informed Practice */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-start mb-4">
              <div className="bg-blue-600 dark:bg-blue-500 rounded-lg p-3 mr-4">
                <FaChartLine className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Research-Informed Practice</h3>
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              My research on conversational learning analytics directly informs my teaching. I understand what patterns predict learning outcomes (effective scaffolding, conceptual questions, and engagement dynamics) and apply these insights in my classrooms.
            </p>
          </div>

          {/* Active & Collaborative Learning */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800/30">
            <div className="flex items-start mb-4">
              <div className="bg-purple-600 dark:bg-purple-500 rounded-lg p-3 mr-4">
                <FaUsers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Active & Collaborative</h3>
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              I design courses around collaborative problem-solving with real datasets. Students work in groups and have agency to explore questions they care about.
            </p>
          </div>

          {/* Inclusive & Adaptive */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800/30">
            <div className="flex items-start mb-4">
              <div className="bg-green-600 dark:bg-green-500 rounded-lg p-3 mr-4">
                <FaGraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Inclusive & Adaptive</h3>
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              Teaching in Botswana (where many students spoke English as a third or fourth language) and working with neurodivergent students shaped how I design accessible learning environments.
            </p>
          </div>

          {/* Real-World Connections */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-100 dark:border-amber-800/30">
            <div className="flex items-start mb-4">
              <div className="bg-amber-600 dark:bg-amber-500 rounded-lg p-3 mr-4">
                <FaAward className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Real-World Impact</h3>
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              Students work with meaningful datasets and tackle real problems, connecting statistical theory to practice.
            </p>
          </div>
        </div>
      </div>

      {/* Current Teaching */}
      <div className="bg-white dark:bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Current Teaching</h2>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 mr-4">
                <div className="bg-blue-600 dark:bg-blue-500 rounded-lg px-4 py-2">
                  <div className="text-white font-bold">Fall 2025</div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">STAT 251: Statistical Inference for Management I</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-1">California Polytechnic State University, San Luis Obispo</p>
                <p className="text-slate-700 dark:text-slate-300 mt-4">
                  Teaching introductory statistics with a focus on helping students understand statistical reasoning beyond formulas. Emphasizing simulation-based inference, real datasets, and connecting statistical concepts to business and management contexts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Past Teaching Experience */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Teaching Experience</h2>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Loading...</p>
          </div>
        ) : teachingData ? (
          <div className="grid md:grid-cols-2 gap-6">
            {teachingData.positions.map((position, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
                <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">{position.institution}</h3>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">{position.years}</div>

                {position.roles.map((role, roleIdx) => (
                  <div key={roleIdx} className="mb-4 last:mb-0">
                    <div className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{role.title}</div>
                    <ul className="space-y-1">
                      {role.courses.map((course, courseIdx) => (
                        <li key={courseIdx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>{typeof course === 'string' ? course : course.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Student Mentorship */}
      <div className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Student Mentorship</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-3xl">
            I've mentored 10 students (2 graduate, 8 undergraduate) through Michigan's UROP program and independent research projects. Several have presented at conferences, with multiple winning Outstanding Presenter Awards. Students have gone on to graduate programs at Brown, positions at Microsoft Research and Amazon, and roles at organizations including the Federal Reserve Bank and Quantum Signal AI.
          </p>
        </div>
      </div>

      {/* Teaching Awards */}
      {teachingData?.awards && teachingData.awards.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Teaching Awards</h2>
          <div className="space-y-4">
            {teachingData.awards.map((award, idx) => (
              <div key={idx} className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-amber-100 dark:border-amber-800/30">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-amber-600 dark:bg-amber-500 rounded-lg px-4 py-2">
                      <div className="text-white font-bold">{award.year}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{award.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{award.institution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
