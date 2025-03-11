import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/utils/date';

export type NewsItem = {
  date: string;
  title: string;
  description: string;
  category: 'publication' | 'award' | 'speaking' | 'research' | string;
  link: string | null;
};

type NewsCardProps = {
  item: NewsItem;
};

const getCategoryBadge = (category: string) => {
  const baseClasses = "text-xs font-medium mr-2 px-2.5 py-0.5 rounded";
  
  switch (category) {
    case 'publication':
      return <span className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300`}>Publication</span>;
    case 'award':
      return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`}>Award</span>;
    case 'speaking':
      return <span className={`${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300`}>Speaking</span>;
    case 'research':
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300`}>Research</span>;
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300`}>{category}</span>;
  }
};

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  return (
    <div className="mb-2 border-l-4 border-blue-500 pl-4 py-1.5 group">
      <div className="flex items-center">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {formatDate(item.date)}
        </span>
        <div className="ml-2">
          {getCategoryBadge(item.category)}
        </div>
      </div>
      <h3 className="text-base font-semibold mt-1 text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h3>
      <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm">{item.description}</p>
      {item.link && (
        <div className="mt-2">
          <Link 
            href={item.link}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Learn more →
          </Link>
        </div>
      )}
    </div>
  );
};

export default NewsCard; 