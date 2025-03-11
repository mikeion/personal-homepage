'use client';

import React from 'react';
import Link from 'next/link';
import { getProjects } from '@/utils/projectLoader';
import ProjectPreview from './ProjectPreview';

export default function FeaturedProjects() {
  const allProjects = getProjects();
  const featuredProjects = allProjects.slice(0, 2); // Just show the first two projects
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Research</h2>
        <Link href="/research">
          <span className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300">
            View all projects →
          </span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuredProjects.map((project) => (
          <ProjectPreview key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
} 