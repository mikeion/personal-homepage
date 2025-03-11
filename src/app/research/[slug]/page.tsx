import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getProjects } from '@/utils/projectLoader';
import { getPublications, Publication } from '@/utils/dataLoader';

// Generate static paths for all projects
export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Generate metadata for each project page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Research | Michael Ion`,
    description: project.shortDescription,
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  // Get related publications
  const allPublications = getPublications();
  const relatedPublications = project.relatedPublications
    ? allPublications.filter((pub: Publication) => project.relatedPublications.includes(pub.id))
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back link */}
      <div className="mb-6">
        <Link href="/research">
          <span className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
            ← Back to Research
          </span>
        </Link>
      </div>

      {/* Project header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">{project.title}</h1>
          <div className="flex space-x-2">
            <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {project.status}
            </span>
            {project.category && (
              <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                {project.category}
              </span>
            )}
          </div>
        </div>
        
        <p className="text-lg text-gray-600 dark:text-gray-300">{project.shortDescription}</p>
      </div>

      {/* Project content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="md:col-span-2">
          {/* Project image */}
          {project.image && (
            <div className="relative h-72 md:h-96 w-full mb-8 overflow-hidden rounded-lg shadow-md">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
                unoptimized={project.image.startsWith('http')}
              />
            </div>
          )}

          {/* Project description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
            <div className="prose prose-blue dark:prose-invert max-w-none">
              {project.fullDescription.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Related publications */}
          {relatedPublications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Related Publications</h2>
              <ul className="space-y-4">
                {relatedPublications.map((pub: Publication) => (
                  <li key={pub.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white">{pub.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {pub.authors.join(', ')} ({pub.year})
                    </p>
                    <p className="text-sm italic text-gray-500 dark:text-gray-400 mt-1">{pub.venue}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          {/* Project details */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Project Details</h3>
            
            <div className="space-y-4">
              {/* Start date */}
              <div>
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">Started</h4>
                <p className="text-gray-900 dark:text-white">{project.startDate}</p>
              </div>
              
              {/* Status */}
              <div>
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">Status</h4>
                <p className="text-gray-900 dark:text-white">{project.status}</p>
              </div>
              
              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">Topics</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Grants */}
              {project.grants && project.grants.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">Funding</h4>
                  <ul className="list-disc pl-5 text-gray-900 dark:text-white">
                    {project.grants.map((grant, index) => (
                      <li key={index}>{grant}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Team members */}
          {project.team && project.team.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Research Team</h3>
              <ul className="space-y-4">
                {project.team.map((member, index) => (
                  <li key={index} className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">{member.name}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{member.role}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">{member.affiliation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 