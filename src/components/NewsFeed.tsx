import React from 'react';
import NewsCard from './NewsCard';

type NewsItem = {
  date: string;
  title: string;
  description: string;
  category: 'publication' | 'award' | 'speaking' | 'research' | string;
  link: string | null;
};

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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Recent News</h2>
      <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
        {displayItems.map((item, index) => (
          <div key={`${item.date}-${index}`} className={index > 0 ? 'pt-4' : ''}>
            <NewsCard item={item} />
          </div>
        ))}
      </div>
      {limit && items.length > limit && (
        <div className="mt-4 text-center">
          <a 
            href="/news" 
            className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            View all news
          </a>
        </div>
      )}
    </div>
  );
};

export default NewsFeed; 