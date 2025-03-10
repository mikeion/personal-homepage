import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export function LatestProjectCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 h-full">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-100">
          Development
        </span>
      </div>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Latest Project</h3>
      <div className="mb-4">
        <h4 className="text-xl text-slate-700 dark:text-slate-200 mb-2">Learning Through Technical Interviews: AI-Powered Practice</h4>
        <p className="text-slate-600 dark:text-slate-300">
          Academic Innovation Fund award to develop AI-based simulations allowing students in the Master of Applied Data Science program to receive personalized interview practice.
        </p>
      </div>
      <Link 
        href="https://ai.umich.edu/blog-posts/generative-ai-projects-teaching-learning/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
      >
        View details <FaArrowRight className="ml-2" size={14} />
      </Link>
    </div>
  );
}

export function UpcomingTalkCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 h-full">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-100">
          Speaking
        </span>
      </div>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Featured Award</h3>
      <div className="mb-4">
        <h4 className="text-xl text-slate-700 dark:text-slate-200 mb-2">Academic Innovation Fund (AIF)</h4>
        <p className="text-slate-600 dark:text-slate-300">
          Awarded $12,435 in funding from U-M's Center for Academic Innovation to support research on AI-powered technical interview practice tools and methodology.
        </p>
      </div>
      <Link 
        href="/research"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
      >
        View research <FaArrowRight className="ml-2" size={14} />
      </Link>
    </div>
  );
} 