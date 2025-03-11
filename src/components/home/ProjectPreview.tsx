'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Project } from '@/utils/projectLoader';

interface ProjectPreviewProps {
  project: Project;
}

export default function ProjectPreview({ project }: ProjectPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      {project.image && (
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transform hover:scale-105 transition-transform duration-300"
            unoptimized={project.image.startsWith('http')}
          />
        </div>
      )}

      <div className="flex flex-col p-6 flex-grow">
        <div className="flex items-center mb-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            {project.status}
          </span>
          {project.tags && project.tags.length > 0 && (
            <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
              {project.tags[0]}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          {project.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
          {project.shortDescription}
        </p>
        
        <div className="mt-2">
          <Link href={`/research/${project.slug}`}>
            <span className="inline-block text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300">
              Learn more →
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 