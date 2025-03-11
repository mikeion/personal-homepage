'use client';

import React from 'react';
import { useNews } from '@/providers/NewsProvider';
import NewsFeed from './NewsFeed';

const HomePageNewsFeed: React.FC = () => {
  const { newsItems, loading, error } = useNews();

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 h-full">
        <div className="mb-4">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-6"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-2">
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 h-full">
        <div className="text-red-500 dark:text-red-400">
          <p>Unable to load news. Please try again later.</p>
        </div>
      </div>
    );
  }

  return <NewsFeed items={newsItems} limit={3} />;
};

export default HomePageNewsFeed; 