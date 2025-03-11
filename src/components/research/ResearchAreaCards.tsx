'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaChartBar, FaChartLine, FaBook, FaLaptopCode, FaGraduationCap, FaComments } from 'react-icons/fa';
import { getResearchAreas, ResearchArea } from '@/utils/researchLoader';

// Icon mapping for research areas
const IconMap = {
  'ai': <FaChartBar className="text-3xl mb-4" />,
  'data': <FaChartLine className="text-3xl mb-4" />,
  'teaching': <FaBook className="text-3xl mb-4" />,
  'technical': <FaLaptopCode className="text-3xl mb-4" />,
  'liberal-arts': <FaGraduationCap className="text-3xl mb-4" />
};

// Color mapping for research areas
const colorMap: Record<string, string> = {
  'blue': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-100',
  'purple': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-100',
  'green': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-100',
  'orange': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-100',
  'red': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-100'
};

// Background color mapping for cards
const bgColorMap: Record<string, string> = {
  'blue': 'border-blue-200 dark:border-blue-800',
  'purple': 'border-purple-200 dark:border-purple-800',
  'green': 'border-green-200 dark:border-green-800',
  'orange': 'border-orange-200 dark:border-orange-800',
  'red': 'border-red-200 dark:border-red-800'
};

export default function ResearchAreaCards() {
  const researchAreas = getResearchAreas();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Research Areas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {researchAreas.map((area, index) => (
          <ResearchAreaCard 
            key={area.id} 
            area={area} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
}

interface ResearchAreaCardProps {
  area: ResearchArea;
  index: number;
}

function ResearchAreaCard({ area, index }: ResearchAreaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border ${bgColorMap[area.color]} hover:shadow-md transition-all p-6`}
    >
      <div className={`${colorMap[area.color]}`}>
        {IconMap[area.icon as keyof typeof IconMap]}
      </div>
      
      <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">{area.title}</h3>
      <p className="text-slate-600 dark:text-slate-300 mb-4">{area.description}</p>
      
      {/* Core questions */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">Core Questions</h4>
        <ul className="space-y-2 text-sm">
          {area.coreQuestions.map((question, idx) => (
            <li key={idx} className="text-slate-600 dark:text-slate-400">
              • {question}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Tags */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">Topics</h4>
        <div className="flex flex-wrap gap-2">
          {area.tags.map(tag => (
            <span 
              key={tag} 
              className={`inline-block px-2 py-1 text-xs rounded-full ${colorMap[area.color]} opacity-90`}
            >
              {tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </span>
          ))}
        </div>
      </div>
      
      {/* Featured publication */}
      {area.publications.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">Featured Publication</h4>
          <p className="text-sm italic text-slate-600 dark:text-slate-400">
            "{area.publications[0]}"
          </p>
        </div>
      )}
    </motion.div>
  );
} 