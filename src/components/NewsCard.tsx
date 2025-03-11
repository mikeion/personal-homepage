import React from 'react';
import { format } from 'date-fns';
import { FaNewspaper, FaTrophy, FaMicrophoneAlt, FaFlask } from 'react-icons/fa';

type NewsItem = {
  date: string;
  title: string;
  description: string;
  category: 'publication' | 'award' | 'speaking' | 'research' | string;
  link: string | null;
};

interface NewsCardProps {
  item: NewsItem;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'publication':
      return <FaNewspaper className="text-blue-500" />;
    case 'award':
      return <FaTrophy className="text-yellow-500" />;
    case 'speaking':
      return <FaMicrophoneAlt className="text-green-500" />;
    case 'research':
      return <FaFlask className="text-purple-500" />;
    default:
      return <FaNewspaper className="text-gray-500" />;
  }
};

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  const formattedDate = format(new Date(item.date), 'MMMM d, yyyy');

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <span>{formattedDate}</span>
        <span>•</span>
        <div className="flex items-center space-x-1">
          {getCategoryIcon(item.category)}
          <span className="capitalize">{item.category}</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {item.link ? (
            <a 
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.title}
            </a>
          ) : (
            item.title
          )}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
      </div>
    </div>
  );
};

export default NewsCard; 