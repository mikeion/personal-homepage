'use client'
import { useState, useEffect } from 'react'
import { FaArrowUp } from 'react-icons/fa'
import { publications } from '@/data/publications'
import { PublicationEntry } from '@/components/publications/PublicationEntry'
import { researchAreas, getResearchAreas } from '@/data/researchAreas'
import type { Publication } from '@/types/publications'
import Link from 'next/link'

function cleanLatexFormatting(text: string): string {
  if (!text) return ''
  return text
    .replace(/\\textbf{([^}]+)}/g, '$1')
    .replace(/\\textbf/g, '')
    .replace(/\\textit{([^}]+)}/g, '$1')
    .replace(/\\textit/g, '')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanAuthorNames(authors: string[]): string {
  return authors
    .map(author => {
      let cleaned = cleanLatexFormatting(author)
      cleaned = cleaned
        .replace(/\s*,\s*/g, ', ')
        .replace(/\s*\.\s*/g, '. ')
      return cleaned
    })
    .join(', ')
}

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'in_preparation': 'In Preparation',
    'in_review': 'Under Review',
    'in_progress': 'In Progress',
    'published': 'Published'
  }
  return statusMap[status] || status
}

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return isVisible ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      aria-label="Scroll to top"
    >
      <FaArrowUp />
    </button>
  ) : null
}

const getPublicationCountByArea = (area: string) => {
  const allPubs = [
    ...publications.journal_publications,
    ...(publications.book_chapters || []),
    ...(publications.conference_proceedings || []),
    ...(publications.invited_talks || []),
    ...(publications.workshop_presentations || [])
  ];
  return allPubs.filter(pub => {
    const areas = pub.keywords ? getResearchAreas(pub.keywords) : [];
    return areas.includes(area);
  }).length;
};

type Keyword = {
  id: string;
  name: string;
};

type ResearchArea = {
  id: string;
  name: string;
};

type FilterOptions = {
  years: number[];
  types: string[];
  areas: ResearchArea[];
  keywords: Keyword[];
};

export default function Research() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    years: [],
    types: [],
    areas: [],
    keywords: []
  });
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | ''>('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch publications
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('/api/publications');
        if (!response.ok) {
          throw new Error('Failed to fetch publications');
        }
        
        const data = await response.json();
        setPublications(data);
        setFilteredPublications(data);
        
        // Extract filter options
        const years = [...new Set(data.map((pub: Publication) => pub.year))].sort((a: number, b: number) => b - a);
        const types = [...new Set(data.map((pub: Publication) => pub.type))];
        
        // Extract unique research areas
        const allAreas: ResearchArea[] = [];
        data.forEach((pub: Publication) => {
          pub.researchAreas.forEach(area => {
            if (!allAreas.some(a => a.id === area.id)) {
              allAreas.push(area);
            }
          });
        });
        
        // Extract unique keywords
        const allKeywords: Keyword[] = [];
        data.forEach((pub: Publication) => {
          pub.keywords.forEach(keyword => {
            if (!allKeywords.some(k => k.id === keyword.id)) {
              allKeywords.push(keyword);
            }
          });
        });
        
        setFilterOptions({
          years,
          types,
          areas: allAreas.sort((a, b) => a.name.localeCompare(b.name)),
          keywords: allKeywords.sort((a, b) => a.name.localeCompare(b.name))
        });
        
      } catch (error) {
        console.error('Error fetching publications:', error);
        setError('Failed to load publications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublications();
  }, []);
  
  // Apply filters
  useEffect(() => {
    let filtered = [...publications];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pub => 
        pub.title.toLowerCase().includes(query) ||
        pub.authors.some(author => author.toLowerCase().includes(query)) ||
        (pub.venue && pub.venue.toLowerCase().includes(query)) ||
        (pub.description && pub.description.toLowerCase().includes(query)) ||
        pub.keywords.some(k => k.name.toLowerCase().includes(query)) ||
        pub.researchAreas.some(a => a.name.toLowerCase().includes(query))
      );
    }
    
    // Apply year filter
    if (selectedYear !== '') {
      filtered = filtered.filter(pub => pub.year === selectedYear);
    }
    
    // Apply type filter
    if (selectedType) {
      filtered = filtered.filter(pub => pub.type === selectedType);
    }
    
    // Apply area filter
    if (selectedArea) {
      filtered = filtered.filter(pub => 
        pub.researchAreas.some(area => area.id === selectedArea)
      );
    }
    
    // Apply keyword filter
    if (selectedKeyword) {
      filtered = filtered.filter(pub => 
        pub.keywords.some(keyword => keyword.id === selectedKeyword)
      );
    }
    
    setFilteredPublications(filtered);
  }, [publications, searchQuery, selectedYear, selectedType, selectedArea, selectedKeyword]);
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedYear('');
    setSelectedType('');
    setSelectedArea('');
    setSelectedKeyword('');
  };
  
  // Format publication type for display
  const formatType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Research
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Loading publications...
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Research
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Research
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Browse our publications, papers, and research projects
          </p>
        </div>
        
        {/* Filters */}
        <div className="mt-12 bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {/* Search */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search publications..."
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              {/* Year */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : '')}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">All Years</option>
                  {filterOptions.years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  id="type"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">All Types</option>
                  {filterOptions.types.map(type => (
                    <option key={type} value={type}>{formatType(type)}</option>
                  ))}
                </select>
              </div>
              
              {/* Research Area */}
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                  Research Area
                </label>
                <select
                  id="area"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">All Areas</option>
                  {filterOptions.areas.map(area => (
                    <option key={area.id} value={area.id}>{area.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Keyword */}
              <div>
                <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                  Keyword
                </label>
                <select
                  id="keyword"
                  value={selectedKeyword}
                  onChange={(e) => setSelectedKeyword(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">All Keywords</option>
                  {filterOptions.keywords.map(keyword => (
                    <option key={keyword.id} value={keyword.id}>{keyword.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Reset Filters */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Publications List */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {filteredPublications.length} {filteredPublications.length === 1 ? 'Publication' : 'Publications'}
          </h2>
          
          {filteredPublications.length === 0 ? (
            <div className="bg-white shadow overflow-hidden rounded-lg p-6 text-center text-gray-500">
              No publications found matching your filters. Try adjusting your search criteria.
            </div>
          ) : (
            <div className="space-y-8">
              {filteredPublications.map(publication => (
                <div key={publication.id} className="bg-white shadow overflow-hidden rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {publication.url ? (
                            <a 
                              href={publication.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-blue-600"
                            >
                              {publication.title}
                            </a>
                          ) : (
                            publication.title
                          )}
                        </h3>
                        
                        <div className="mt-2 text-sm text-gray-500">
                          {publication.authors.join(', ')}
                        </div>
                        
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                            {formatType(publication.type)}
                          </span>
                          
                          {publication.venue && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                              {publication.venue}
                            </span>
                          )}
                          
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                            {publication.year}
                          </span>
                        </div>
                        
                        {publication.description && (
                          <div className="mt-3 text-sm text-gray-600">
                            {publication.description}
                          </div>
                        )}
                        
                        {/* Keywords and Research Areas */}
                        <div className="mt-4">
                          {publication.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {publication.keywords.map(keyword => (
                                <button
                                  key={keyword.id}
                                  onClick={() => setSelectedKeyword(keyword.id)}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200"
                                >
                                  {keyword.name}
                                </button>
                              ))}
                            </div>
                          )}
                          
                          {publication.researchAreas.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {publication.researchAreas.map(area => (
                                <button
                                  key={area.id}
                                  onClick={() => setSelectedArea(area.id)}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                >
                                  {area.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      {publication.url && (
                        <div className="mt-4 md:mt-0 md:ml-6">
                          <a
                            href={publication.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View Publication
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 