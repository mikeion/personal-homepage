'use client';

import React from 'react';
import { FaChartBar, FaChartLine, FaBook, FaLaptopCode, FaGraduationCap } from 'react-icons/fa';
import { getResearchAreas } from '@/utils/researchLoader';

// Icon mapping for research areas
const IconMap: Record<string, JSX.Element> = {
  'ai': <FaChartBar className="text-3xl text-blue-500 mb-4" />,
  'data': <FaChartLine className="text-3xl text-purple-500 mb-4" />,
  'teaching': <FaBook className="text-3xl text-green-500 mb-4" />,
  'technical': <FaLaptopCode className="text-3xl text-orange-500 mb-4" />,
  'liberal-arts': <FaGraduationCap className="text-3xl text-red-500 mb-4" />
};

export default function CompactResearchAreas() {
  const researchAreas = getResearchAreas();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">
        Research Areas
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {researchAreas.map((area) => (
          <div 
            key={area.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all p-6"
          >
            <div className="mb-4">
              {IconMap[area.icon]}
            </div>
            
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
              {area.title}
            </h3>
            
            <p className="text-slate-600 dark:text-slate-300">
              {area.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 