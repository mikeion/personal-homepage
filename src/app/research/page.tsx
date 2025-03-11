import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getProjects } from '@/utils/projectLoader';
import PublicationsAndGrants from '@/components/research/PublicationsAndGrants';
import CompactResearchAreas from '@/components/research/CompactResearchAreas';

export const metadata: Metadata = {
  title: 'Research | Michael Ion',
  description: 'Research areas, publications, and ongoing projects by Michael Ion.',
};

export default function ResearchPage() {
  const projects = getProjects();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-slate-700">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 dark:bg-indigo-900/30 rounded-full filter blur-3xl opacity-30"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-800 dark:text-white mb-4">Research</h1>
            <div className="h-1 w-20 bg-blue-500 rounded-full mb-6"></div>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              My research explores education, data science, and learning technologies. I combine methods from learning sciences, education research, and computational approaches to address complex problems in teaching and learning.
            </p>
          </div>
        </div>
      </div>

      {/* Research Areas */}
      <CompactResearchAreas />

      {/* Featured Research Projects */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50 dark:bg-slate-800/50">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Featured Research Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {project.image && (
                <div className="relative h-52 w-full overflow-hidden">
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
                <div className="flex items-center mb-3">
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    {project.status}
                  </span>
                  {project.category && (
                    <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                      {project.category}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{project.title}</h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{project.shortDescription}</p>
                
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span 
                        key={tag}
                        className="inline-block px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Link href={`/research/${project.slug}`} className="block">
                    <span className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300">
                      View project details →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publications and Grants (Client Component) */}
      <PublicationsAndGrants />
    </div>
  );
} 