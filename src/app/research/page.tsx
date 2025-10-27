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
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-800 dark:text-white mb-4">Research</h1>
            <div className="h-1 w-20 bg-blue-500 rounded-full mb-6"></div>

            {/* Problem-Solution-Impact Structure */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">The Challenge</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  We know some teaching approaches lead to better student learning outcomes than others, but measuring what makes instruction more effective is challenging. Traditional approaches rely on small samples or overly simplistic metrics.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">My Approach</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  I develop <span className="font-semibold text-blue-600 dark:text-blue-400">statistical classification and simulation methods</span> for analyzing conversational data in educational settings. My work captures patterns of effective instruction from large-scale data: types of questions teachers ask, how they scaffold student thinking, and when students have breakthrough moments.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">The Innovation</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  By combining measurement with validated simulation, I can test hypotheses about what instructional strategies support learning at scales that would be difficult to achieve with human participants alone. This enables evidence-based recommendations faster and more cost-effectively than traditional randomized trials.
                </p>
              </div>
            </div>
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

      {/* Research Infrastructure */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white dark:bg-slate-900">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Research Infrastructure</h2>
        <div className="h-1 w-20 bg-blue-500 rounded-full mb-8"></div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* MathMentorDB */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-start mb-4">
              <div className="bg-blue-600 dark:bg-blue-500 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">MathMentorDB</h3>
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded-full">
                  Submitted to LREC 2026
                </span>
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              <span className="font-semibold">200,332 mathematics tutoring conversations</span> from the Discord Mathematics community, with validated question-type classifications and breakthrough moment annotations. Built from 5.5 million raw messages with conversation disentanglement methods.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">5.5M</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Messages</div>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">200K+</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Conversations</div>
              </div>
            </div>
          </div>

          {/* Cross-Domain Validation */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800/30">
            <div className="flex items-start mb-4">
              <div className="bg-purple-600 dark:bg-purple-500 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Cross-Domain Validation</h3>
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Methods validated across multiple educational contexts to ensure generalizability:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-white">NCTE Transcripts:</span>
                  <span className="text-slate-600 dark:text-slate-400"> 1,660 elementary math classroom lessons</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-white">TalkMoves Dataset:</span>
                  <span className="text-slate-600 dark:text-slate-400"> 567 K-12 math transcripts</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-white">Discord Tutoring:</span>
                  <span className="text-slate-600 dark:text-slate-400"> Online peer-to-peer mathematics help</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Statistical Methods */}
        <div className="mt-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Statistical Methods</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Text Classification</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Using LLMs as feature extractors within statistical frameworks to classify question types, scaffolding moves, and breakthrough moments with validated inter-rater reliability.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Temporal Modeling</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Bayesian hierarchical Hawkes processes capture <em>when</em> and <em>how rapidly</em> students and tutors interact, revealing engagement patterns invisible to content analysis alone.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Validated Simulation</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Simulation-based calibration distinguishes fidelity (realistic behavior) from effectiveness (genuine learning), treating LLMs as components in statistical models, not black boxes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Publications and Grants (Client Component) */}
      <PublicationsAndGrants />
    </div>
  );
} 