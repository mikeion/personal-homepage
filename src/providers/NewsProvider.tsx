'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { NewsItem } from '@/components/home/NewsCard';

type NewsContextType = {
  newsItems: NewsItem[];
  loading: boolean;
  error: string | null;
};

const NewsContext = createContext<NewsContextType>({
  newsItems: [],
  loading: false,
  error: null,
});

export const useNews = () => useContext(NewsContext);

export function NewsProvider({ children }: { children: React.ReactNode }) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const response = await fetch('/api/news');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`);
        }
        
        const data = await response.json();
        setNewsItems(data.news || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  return (
    <NewsContext.Provider value={{ newsItems, loading, error }}>
      {children}
    </NewsContext.Provider>
  );
}

export default NewsProvider; 