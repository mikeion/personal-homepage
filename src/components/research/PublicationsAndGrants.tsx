'use client';

import React, { useEffect, useState } from 'react';
import { FaFlask, FaChartLine, FaBook } from 'react-icons/fa';
import authorsData from '@/data/authors.json';

// Define the structure of an author
interface Author {
  firstName: string;
  lastName: string;
  fullName: string;
  website?: string;
}

// Define the structure of a publication
interface Publication {
  title: string;
  authors: string[] | string;
  authorDetails?: { [key: string]: Author };
  year?: number | string;
  venue?: string;
  type?: string;
  journal?: string;
  conference?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  location?: string;
  doi?: string;
  url?: string;
  status?: string;
  date?: string;
  id?: string;
  keywords?: string[] | any[];
  description?: string;
  award?: string;
  subcategory?: string;
}

interface Grant {
  title: string;
  role: string;
  year?: string;
  years?: string;
  funder: string;
  amount: string;
  status: string;
  collaborators?: string[];
}

// Format authors list from array to string
function formatAuthors(authors: string[]): string {
  return authors.join(', ');
}

export function ResearchAreas() {
  const [mounted, setMounted] = useState(false);
  
  // Mount animation effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Research areas with descriptions
  const researchAreas = [
    {
      id: 'math-education',
      title: 'Mathematics Education',
      description: 'Studying how people learn mathematics and develop mathematical knowledge, with a focus on undergraduate mathematics education and teacher preparation.',
      icon: <FaBook className="text-blue-500 text-3xl mb-4" />
    },
    {
      id: 'ai-education',
      title: 'AI in Education',
      description: 'Exploring applications of artificial intelligence, machine learning, and natural language processing to enhance teaching and learning.',
      icon: <FaChartLine className="text-blue-500 text-3xl mb-4" />
    },
    {
      id: 'writing-research',
      title: 'Writing Research',
      description: 'Investigating writing practices across disciplines and how writing contributes to learning and knowledge development.',
      icon: <FaFlask className="text-blue-500 text-3xl mb-4" />
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className={`transition-all duration-700 delay-100 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Research Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {researchAreas.map((area) => (
            <div key={area.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all hover:shadow-md">
              {area.icon}
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">{area.title}</h3>
              <p className="text-slate-600 dark:text-slate-300">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PublicationsAndGrants() {
  const [jsonPublications, setJsonPublications] = useState<Publication[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Mount animation effect
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Categorize publications
  const [categorizedPublications, setCategorizedPublications] = useState({
    journal: [] as Publication[],
    conference: [] as Publication[],
    book_chapter: [] as Publication[],
    talks: [] as Publication[],
    workshops: [] as Publication[],
    preprints: [] as Publication[],
    articles: [] as Publication[],
    posters: [] as Publication[]
  });
  
  // Fetch publications and grants from JSON file
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/publications');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        
        setJsonPublications(data.publications || []);
        setGrants(data.grants || []);
        
        // Create a map to track which publications have been categorized
        const categorizedTitles = new Set<string>();
        
        // Categorize publications based on type, subcategory, and venue
        const combined = [...(data.publications || [])].map(pub => {
          return {
            ...pub,
            // If title is empty but description contains a title-like string, use that
            title: pub.title || pub.description?.split('.')[0] || ''
          };
        });
        
        // Create empty categories
        const categorized = {
          journal: [] as Publication[],
          conference: [] as Publication[],
          book_chapter: [] as Publication[],
          talks: [] as Publication[],
          workshops: [] as Publication[],
          preprints: [] as Publication[],
          articles: [] as Publication[],
          posters: [] as Publication[]
        };
        
        // First, categorize posters
        combined.forEach(pub => {
          if ((pub.type === 'poster' || pub.subcategory?.toLowerCase().includes('poster')) && !categorizedTitles.has(pub.title)) {
            categorized.posters.push(pub);
            categorizedTitles.add(pub.title);
          }
        });
        
        // Then book chapters
        combined.forEach(pub => {
          if (!categorizedTitles.has(pub.title) && 
              (pub.type === 'book_chapter' || pub.subcategory?.toLowerCase().includes('book'))) {
            categorized.book_chapter.push(pub);
            categorizedTitles.add(pub.title);
          }
        });
        
        // Then articles
        combined.forEach(pub => {
          if (!categorizedTitles.has(pub.title) && 
              (pub.type === 'article' || pub.subcategory?.toLowerCase().includes('non-peer-reviewed'))) {
            categorized.articles.push(pub);
            categorizedTitles.add(pub.title);
          }
        });
        
        // First check for conferences
        combined.forEach(pub => {
          if (!categorizedTitles.has(pub.title)) {
            const venue = (pub.venue || '').toLowerCase();
            const description = (pub.description || '').toLowerCase();
            
            if (
              pub.type === 'conference' || 
              venue.includes('conference') || 
              venue.includes('annual') ||
              venue.includes('proceedings') || 
              venue.includes('meeting') ||
              venue.includes('symposium') ||
              venue.includes('psychology of mathematics education') ||
              venue.includes('american education research association') ||
              venue.includes('research in undergraduate mathematics education') ||
              description.includes('conference') ||
              description.includes('annual meeting') ||
              description.includes('proceedings')
            ) {
              categorized.conference.push(pub);
              categorizedTitles.add(pub.title);
            }
          }
        });
        
        // Then journals
        combined.forEach(pub => {
          if (!categorizedTitles.has(pub.title)) {
            const venue = (pub.venue || '').toLowerCase();
            
            if (
              venue.includes('journal') ||
              (pub.type === 'journal' && !venue.includes('conference') && !venue.includes('meeting'))
            ) {
              categorized.journal.push(pub);
              categorizedTitles.add(pub.title);
            }
          }
        });
        
        // Then the rest
        combined.forEach(pub => {
          if (!categorizedTitles.has(pub.title)) {
            if (pub.type === 'talk' || data.talks?.includes(pub)) {
              categorized.talks.push(pub);
              categorizedTitles.add(pub.title);
            } else if (pub.type === 'workshop') {
              categorized.workshops.push(pub);
              categorizedTitles.add(pub.title);
            } else if (pub.type === 'preprint' || pub.status === 'preprint') {
              categorized.preprints.push(pub);
              categorizedTitles.add(pub.title);
            }
          }
        });
        
        setCategorizedPublications(categorized);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Format currency for grants
  const formatCurrency = (amount: string) => {
    if (!amount) return '$0';
    
    // Convert to number
    const numAmount = parseFloat(amount.replace(/,/g, ''));
    
    // Format with commas and dollar sign
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(numAmount);
  };

  // Sort publications by status, year, and title
  const sortPublications = (a: Publication, b: Publication) => {
    // First sort by status (in_preparation and under_review at the top)
    const statusOrder = {
      'in_preparation': 0,
      'under_review': 1,
      'in_press': 2,
      'published': 3
    };
    
    const statusA = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
    const statusB = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
    
    if (statusA !== statusB) {
      return statusA - statusB;
    }
    
    // Then sort by year (descending)
    const yearA = Number(a.year) || 0;
    const yearB = Number(b.year) || 0;
    if (yearB !== yearA) return yearB - yearA;
    
    // If same year, sort by title
    return (a.title || '').localeCompare(b.title || '');
  };

  const renderPublication = (pub: Publication) => {
    // Format authors for display with your name bolded and linked where possible
    let formattedAuthors = '';
    if (Array.isArray(pub.authors)) {
      // One more layer of deduplication to ensure no duplicates
      const uniqueAuthors = Array.from(new Set(pub.authors));
      
      // Format each unique author
      formattedAuthors = uniqueAuthors.map(author => {
        // Find matching author in authorDetails
        const authorKey = Object.keys(pub.authorDetails || {}).find(key => {
          const normalizedKey = key.toLowerCase().replace(/\./g, '').replace(/\s+/g, '');
          const normalizedAuthor = author.toLowerCase().replace(/\./g, '').replace(/\s+/g, '');
          
          // Check if either contains the other
          return normalizedKey.includes(normalizedAuthor) || normalizedAuthor.includes(normalizedKey);
        });
        
        const authorInfo = authorKey ? pub.authorDetails?.[authorKey] : null;

        if (authorInfo) {
          // Check if this is Michael Ion (you)
          const isIon = authorInfo.lastName.toLowerCase().includes('ion');
          
          if (isIon) {
            // Special styling for you (no link since we're on your website)
            return `<span class="self-author">${authorInfo.fullName}</span>`;
          }
          
          // Format other authors with links if available
          return authorInfo.website
            ? `<a href="${authorInfo.website}" target="_blank" rel="noopener noreferrer">${authorInfo.fullName}</a>`
            : authorInfo.fullName;
        }
        
        // Fallback for authors without details
        if (author.toLowerCase().includes('ion')) {
          return `<span class="self-author">${author}</span>`;
        }
        return author;
      }).join(', ');
    } else {
      formattedAuthors = pub.authors || '';
    }
    
    return (
      <div className="mb-8 last:mb-0">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{pub.title}</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-2" 
           dangerouslySetInnerHTML={{ 
             __html: formattedAuthors
               .replace(/<span class="self-author">(.*?)<\/span>/g, '<span class="font-semibold text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-0.5">$1</span>')
               .replace(/<a /g, '<a class="text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 hover:underline" ')
           }}>
        </p>
        <div className="flex flex-wrap items-center gap-2 mb-3 text-sm">
          <span className="text-slate-500 dark:text-slate-400 italic">{pub.venue}</span>
          {pub.year && <span className="font-medium text-slate-600 dark:text-slate-300">({pub.year})</span>}
          {pub.status && pub.status !== 'published' && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
              {pub.status === 'in_review' ? 'In review' : 
               pub.status === 'in_preparation' ? 'In preparation' : 
               pub.status.replace('_', ' ').charAt(0).toUpperCase() + pub.status.slice(1)}
            </span>
          )}
          {pub.award && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              {pub.award}
            </span>
          )}
        </div>
        {/* Temporarily removing descriptions until they can be reviewed
        {pub.description && (
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">{pub.description}</p>
        )}
        */}
        <div className="flex gap-3">
          {pub.doi && (
            <a
              href={`https://doi.org/${pub.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
            >
              PDF
            </a>
          )}
          {pub.url && (
            <a
              href={pub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
            >
              Link
            </a>
          )}
        </div>
      </div>
    );
  };

  // Format collaborators with full names from authors.json
  const formatCollaborators = (collaborators: string[] | undefined) => {
    if (!collaborators || collaborators.length === 0) return 'None';
    
    return collaborators.map(collaborator => {
      // Extract name part and role
      const parts = collaborator.split(/\s*\(([^)]+)\)\s*$/);
      const namePart = parts[0].trim();
      
      // For Michael Ion, apply special styling
      if (namePart.includes('Michael Ion')) {
        return `<span class="font-semibold text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-0.5">${namePart}</span>`;
      }
      
      // Special cases for specific authors
      const specialCases: {[key: string]: string} = {
        'Pat Herbst': 'https://marsal.umich.edu/directory/faculty-staff/patricio-g-herbst',
        'Amanda Brown': 'https://marsal.umich.edu/directory/faculty-staff/amanda-brown'
      };
      
      // First check if we have a special case for this name
      if (specialCases[namePart]) {
        return `<a href="${specialCases[namePart]}" target="_blank" rel="noopener noreferrer" class="text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 hover:underline">${namePart}</a>`;
      }
      
      // Check if this name has a website in authors.json
      let foundWebsite = '';
      
      // Look through authors.json to find a matching website
      Object.entries(authorsData.authors).forEach(([key, author]) => {
        if (
          author.fullName === namePart || 
          `${author.firstName} ${author.lastName}` === namePart
        ) {
          if (author.website) {
            foundWebsite = author.website;
          }
        }
      });
      
      // If we found a website, link to it
      if (foundWebsite) {
        return `<a href="${foundWebsite}" target="_blank" rel="noopener noreferrer" class="text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 hover:underline">${namePart}</a>`;
      }
      
      // Otherwise just return the name
      return namePart;
    }).join(', ');
  };

  const renderGrant = (grant: Grant, index: number) => {
    // Get formatted collaborators
    const formattedCollaborators = formatCollaborators(grant.collaborators);
    
    // Fix role text - replace "\&" with "and"
    const formattedRole = grant.role.replace('\\&', 'and');
    
    return (
      <div key={index} className="mb-6 border-b border-slate-200 dark:border-slate-700 pb-6 last:border-0">
        <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{grant.title}</h3>
        
        {/* Authors/Collaborators first */}
        <p className="text-slate-600 dark:text-slate-300 mb-2" 
           dangerouslySetInnerHTML={{ 
             __html: formattedCollaborators
           }}>
        </p>
        
        {/* Role */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-300">Role: {formattedRole}</span>
          
          {/* Funder and status */}
          <span className="text-slate-500 dark:text-slate-400">{grant.funder}</span>
          
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            grant.status === 'in_review' 
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100' 
              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
          }`}>
            {grant.status === 'in_review' ? 'In Review' : 'Awarded'}
          </span>
          
          {/* Amount */}
          <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(grant.amount)}</span>
          
          {/* Year/Years */}
          {grant.years && (
            <span className="text-slate-600 dark:text-slate-300">Years: {grant.years}</span>
          )}
          {grant.year && !grant.years && (
            <span className="text-slate-600 dark:text-slate-300">Year: {grant.year}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Research Grants */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50 dark:bg-slate-800/50">
        <div className={`transition-all duration-700 delay-300 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Research Grants</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div>
              {grants.filter(grant => grant.status === 'in_review').length > 0 && (
                <div className="mb-10">
                  <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 pb-2 border-b border-slate-200 dark:border-slate-700 uppercase">In Review</h4>
                  {grants
                    .filter(grant => grant.status === 'in_review')
                    .map((grant, index) => renderGrant(grant, index))}
                </div>
              )}

              {grants.filter(grant => grant.status === 'awarded').length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 pb-2 border-b border-slate-200 dark:border-slate-700 uppercase">Awarded</h4>
                  {grants
                    .filter(grant => grant.status === 'awarded')
                    .map((grant, index) => renderGrant(grant, index))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Publications */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`transition-all duration-700 delay-400 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Publications</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div>
              {(categorizedPublications.journal.length > 0 || categorizedPublications.conference.length > 0) && (
                <div className="mb-10">
                  <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 pb-2 border-b border-slate-200 dark:border-slate-700 uppercase">
                    Journal Articles and Peer Reviewed Conference Proceedings
                  </h4>
                  {[...categorizedPublications.journal, ...categorizedPublications.conference]
                    .sort(sortPublications)
                    .map((pub, index) => renderPublication(pub))}
                </div>
              )}
              
              {categorizedPublications.book_chapter.length > 0 && (
                <div className="mb-10">
                  <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 pb-2 border-b border-slate-200 dark:border-slate-700 uppercase">Book Chapters</h4>
                  {categorizedPublications.book_chapter
                    .sort(sortPublications)
                    .map((pub, index) => renderPublication(pub))}
                </div>
              )}
              
              {categorizedPublications.articles.length > 0 && (
                <div className="mb-10">
                  <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 pb-2 border-b border-slate-200 dark:border-slate-700 uppercase">Non-peer-reviewed Articles</h4>
                  {categorizedPublications.articles
                    .sort(sortPublications)
                    .map((pub, index) => renderPublication(pub))}
                </div>
              )}
              
              {categorizedPublications.posters.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 pb-2 border-b border-slate-200 dark:border-slate-700 uppercase">Posters</h4>
                  {categorizedPublications.posters
                    .sort(sortPublications)
                    .map((pub, index) => renderPublication(pub))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 