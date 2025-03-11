import React from 'react';
import NewsCard, { NewsItem } from './NewsCard';
import Link from 'next/link';

type NewsFeedProps = {
  items: NewsItem[];
  limit?: number;
};

const NewsFeed: React.FC<NewsFeedProps> = ({ items, limit }) => {
  // Sort items by date (newest first)
  const sortedItems = [...items].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Limit the number of items if specified
  const displayItems = limit ? sortedItems.slice(0, limit) : sortedItems;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-slate-100 dark:border-slate-700 h-full">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100">
          Latest Updates
        </span>
      </div>
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Recent News</h2>
      
      <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
        {displayItems.map((item, index) => (
          <div key={`${item.date}-${index}`} className={index > 0 ? 'pt-4' : ''}>
            <NewsCard item={item} />
          </div>
        ))}
      </div>
      
      {limit && items.length > limit && (
        <div className="mt-6 text-center">
          <Link 
            href="/news" 
            className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            View all news
          </Link>
        </div>
      )}
    </div>
  );
};

export default NewsFeed; 