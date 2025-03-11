'use client';

import React, { useEffect, useState } from 'react';
import { useNews } from '@/providers/NewsProvider';
import NewsCard from '@/components/home/NewsCard';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

const NewsPage = () => {
  const { newsItems, loading, error } = useNews();
  const [mounted, setMounted] = useState(false);
  
  // Mount animation effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sort items by date (newest first)
  const sortedItems = [...(newsItems || [])].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-700 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-4 transition-colors"
            >
              <FaArrowLeft className="mr-2" size={14} /> Back to home
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">News & Updates</h1>
            <div className="h-1 w-20 bg-blue-500 rounded-full mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">
              Recent announcements, publications, and updates about my research and academic activities.
            </p>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow animate-pulse">
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
                  <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-red-700 dark:text-red-300">
              <h3 className="text-lg font-medium">Error loading news</h3>
              <p>Unable to load news items. Please try again later.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedItems.map((item, index) => (
                <div 
                  key={`${item.date}-${index}`}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-slate-100 dark:border-slate-700"
                >
                  <NewsCard item={item} />
                </div>
              ))}
              
              {sortedItems.length === 0 && (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <p>No news items available at this time.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsPage; 