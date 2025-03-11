import fs from 'fs';
import path from 'path';

// Define types
export type NewsItem = {
  date: string;
  title: string;
  description: string;
  category: 'publication' | 'award' | 'speaking' | 'research' | string;
  link: string | null;
};

type NewsData = {
  news: NewsItem[];
};

// Define Publication type
export type Publication = {
  id: string;
  title: string;
  year: number;
  authors: string[];
  location: string;
  type: string;
  subcategory: string;
  description: string;
  venue: string;
  status: string;
};

type PublicationData = {
  publications: Publication[];
};

/**
 * Load news items from the news.json file
 * @returns Array of news items
 */
export function getNewsItems(): NewsItem[] {
  try {
    const dataDirectory = path.join(process.cwd(), 'src', 'data');
    const filePath = path.join(dataDirectory, 'news.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data: NewsData = JSON.parse(fileContents);
    return data.news;
  } catch (error) {
    console.error('Error loading news data:', error);
    return [];
  }
}

/**
 * Load publications from the publications.json file
 * @returns Array of publication items
 */
export function getPublications(): Publication[] {
  try {
    const dataDirectory = path.join(process.cwd(), 'src', 'data');
    const filePath = path.join(dataDirectory, 'publications.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data: PublicationData = JSON.parse(fileContents);
    return data.publications;
  } catch (error) {
    console.error('Error loading publications data:', error);
    return [];
  }
} 