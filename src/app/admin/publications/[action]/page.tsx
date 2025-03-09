'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { Publication, Keyword, ResearchArea } from '@/types/publications';

type Author = {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  email?: string | null;
  affiliation?: string | null;
  isYou: boolean;
};

type StructuredAuthor = {
  author: Author;
  position: number;
  isCorresponding: boolean;
  equalContribution: boolean;
};

type PublicationForm = {
  id?: string;
  title: string;
  authors: string[]; // Legacy authors array
  structuredAuthors: StructuredAuthor[]; // New structured authors
  year: number;
  type: string;
  venue?: string;
  pdfLink?: string;
  pdfFile?: string;
  projectLink?: string;
  abstract?: string;
  description?: string;
  status?: string;
  doi?: string;
  publisher?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  isbn?: string;
  acceptanceRate?: string;
  seriesTitle?: string;
  edition?: string;
  location?: string;
  award?: string;
  keywords?: Keyword[];
  researchAreas?: ResearchArea[];
};

export default function PublicationFormPage({ 
  params 
}: { 
  params: { action: string } 
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Check if the action starts with "edit-" to determine if we're editing
  const isEdit = params.action.startsWith('edit-');
  // Extract the ID part after "edit-" if editing
  const publicationId = isEdit ? params.action.replace('edit-', '') : null;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [showLegacyAuthors, setShowLegacyAuthors] = useState(true);
  
  // Form state
  const [publication, setPublication] = useState<PublicationForm>({
    title: '',
    authors: [''],
    year: new Date().getFullYear(),
    type: 'journal',
    venue: '',
    pdfLink: '',
    pdfFile: '',
    abstract: '',
    description: '',
    status: 'published',
    keywords: [],
    researchAreas: [],
    structuredAuthors: [],
  });
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }
    
    if (status === 'authenticated') {
      // Fetch form data
      const fetchData = async () => {
        setLoading(true);
        
        try {
          // Fetch keywords and research areas for select dropdowns
          const [keywordsRes, areasRes, authorsRes] = await Promise.all([
            fetch('/api/admin/keywords'),
            fetch('/api/admin/research-areas'),
            fetch('/api/admin/authors')
          ]);
          
          if (!keywordsRes.ok || !areasRes.ok || !authorsRes.ok) {
            throw new Error('Failed to fetch dropdown data');
          }
          
          const [keywordsData, areasData, authorsData] = await Promise.all([
            keywordsRes.json(),
            areasRes.json(),
            authorsRes.json()
          ]);
          
          setKeywords(keywordsData);
          setResearchAreas(areasData);
          setAuthors(authorsData);
          
          // If editing, fetch the publication
          if (isEdit && publicationId) {
            const response = await fetch(`/api/admin/publications?id=${publicationId}`);
            if (!response.ok) throw new Error('Failed to fetch publication');
            
            const data = await response.json();
            
            // Parse data
            setPublication({
              ...data,
              keywords: data.keywords || [],
              researchAreas: data.researchAreas || [],
              authors: data.authors || [''], // Ensure authors array is initialized
              structuredAuthors: data.publicationAuthors?.map((pa: any) => ({
                author: pa.author,
                position: pa.position,
                isCorresponding: pa.isCorresponding,
                equalContribution: pa.equalContribution
              })) || []
            });
            
            // If we have structured authors, hide legacy authors
            if (data.publicationAuthors?.length > 0) {
              setShowLegacyAuthors(false);
            }
          }
          
        } catch (error) {
          console.error('Error loading form data:', error);
          setError('Failed to load form data. Please try again.');
        }
        
        setLoading(false);
      };
      
      fetchData();
    }
  }, [status, router, isEdit, publicationId]);
  
  // Handle input changes for form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPublication(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle author changes for legacy array
  const handleAuthorChange = (index: number, value: string) => {
    const updatedAuthors = [...(publication.authors || [''])];
    updatedAuthors[index] = value;
    setPublication(prev => ({ ...prev, authors: updatedAuthors }));
  };
  
  // Add a new author to legacy array
  const addAuthor = () => {
    setPublication(prev => ({ 
      ...prev, 
      authors: [...(prev.authors || []), ''] 
    }));
  };
  
  // Remove an author from legacy array
  const removeAuthor = (index: number) => {
    const updatedAuthors = [...(publication.authors || [])];
    updatedAuthors.splice(index, 1);
    setPublication(prev => ({ 
      ...prev, 
      authors: updatedAuthors.length ? updatedAuthors : [''] 
    }));
  };
  
  // ========== Structured Authors Functions ==========
  // Add a new structured author
  const addStructuredAuthor = () => {
    if (authors.length === 0) return;
    
    // Find the first author that's not already added
    const availableAuthors = authors.filter(a => 
      !publication.structuredAuthors.some(sa => sa.author.id === a.id)
    );
    
    if (availableAuthors.length === 0) return;
    
    // Get the next position number
    const nextPosition = publication.structuredAuthors.length + 1;
    
    setPublication(prev => ({
      ...prev,
      structuredAuthors: [
        ...prev.structuredAuthors,
        {
          author: availableAuthors[0],
          position: nextPosition,
          isCorresponding: false,
          equalContribution: false
        }
      ]
    }));
  };
  
  // Remove a structured author
  const removeStructuredAuthor = (index: number) => {
    setPublication(prev => ({
      ...prev,
      structuredAuthors: prev.structuredAuthors.filter((_, i) => i !== index)
        .map((author, i) => ({ ...author, position: i + 1 }))
    }));
  };
  
  // Handle changes to a structured author
  const handleStructuredAuthorChange = (index: number, field: string, value: any) => {
    setPublication(prev => {
      const updatedAuthors = [...prev.structuredAuthors];
      
      if (field === 'author') {
        // Find the author by ID
        const newAuthor = authors.find(a => a.id === value);
        if (newAuthor) {
          updatedAuthors[index] = { 
            ...updatedAuthors[index],
            author: newAuthor
          };
        }
      } else {
        // For boolean fields like isCorresponding and equalContribution
        updatedAuthors[index] = { 
          ...updatedAuthors[index],
          [field]: value
        };
      }
      
      return {
        ...prev,
        structuredAuthors: updatedAuthors
      };
    });
  };
  
  // Change the position of a structured author
  const moveStructuredAuthor = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === publication.structuredAuthors.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    setPublication(prev => {
      const updatedAuthors = [...prev.structuredAuthors];
      
      // Swap the authors
      [updatedAuthors[index], updatedAuthors[newIndex]] = 
      [updatedAuthors[newIndex], updatedAuthors[index]];
      
      // Update positions
      return {
        ...prev,
        structuredAuthors: updatedAuthors.map((author, i) => ({
          ...author,
          position: i + 1
        }))
      };
    });
  };
  
  // Handle keyword selection
  const handleKeywordChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedKeywords = selectedOptions.map(option => {
      const keywordId = option.value;
      const keyword = keywords.find(k => k.id === keywordId);
      return keyword;
    }).filter(Boolean) as Keyword[];
    
    setPublication(prev => ({ ...prev, keywords: selectedKeywords }));
  };
  
  // Handle research area selection
  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedAreas = selectedOptions.map(option => {
      const areaId = option.value;
      const area = researchAreas.find(a => a.id === areaId);
      return area;
    }).filter(Boolean) as ResearchArea[];
    
    setPublication(prev => ({ ...prev, researchAreas: selectedAreas }));
  };
  
  // Add a specific structured author
  const addSpecificStructuredAuthor = (author: Author) => {
    // Skip if this author is already added
    if (publication.structuredAuthors.some(sa => sa.author.id === author.id)) {
      return;
    }
    
    // Get the next position number
    const nextPosition = publication.structuredAuthors.length + 1;
    
    setPublication(prev => ({
      ...prev,
      structuredAuthors: [
        ...prev.structuredAuthors,
        {
          author,
          position: nextPosition,
          isCorresponding: false,
          equalContribution: false
        }
      ]
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // Create a FormData object for file upload
      const formData = new FormData();
      
      // Add the file if selected
      const fileInput = document.getElementById('pdfFile') as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        formData.append('pdfFile', fileInput.files[0]);
      }
      
      // Add other publication data
      const publicationData = {
        ...publication,
        year: Number(publication.year),
        keywords: publication.keywords?.map(k => k.id),
        researchAreas: publication.researchAreas?.map(a => a.id),
        // Include structured authors data if not using legacy mode
        publicationAuthors: !showLegacyAuthors ? publication.structuredAuthors.map(sa => ({
          authorId: sa.author.id,
          position: sa.position,
          isCorresponding: sa.isCorresponding,
          equalContribution: sa.equalContribution
        })) : []
      };
      
      // Add all publication data to the FormData
      formData.append('publicationData', JSON.stringify(publicationData));
      
      // Send to API
      const response = await fetch('/api/admin/publications', {
        method: isEdit ? 'PUT' : 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save publication');
      }
      
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/publications');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving publication:', error);
      setError((error as Error).message || 'Failed to save publication. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Generate description and keywords using AI
  const generateAIContent = async () => {
    if (!publication.title || publication.authors.length === 0) {
      setError('Please provide a title and at least one author to generate content');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('/api/admin/ai-assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: publication.title,
          authors: publication.authors,
          venue: publication.venue,
          type: publication.type
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate content');
      }
      
      const data = await response.json();
      
      // Update the publication with AI-generated content
      setPublication(prev => ({
        ...prev,
        description: data.description
      }));
      
      // Handle suggested keywords
      // This is a simplified approach - in a real app, you might want to
      // match these against existing keywords or create new ones
      
    } catch (error) {
      console.error('Error generating content:', error);
      setError('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Show loading state
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">Loading...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Publications Admin</h1>
              </div>
              <div className="ml-6 flex space-x-8">
                <Link
                  href="/admin/dashboard"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/publications"
                  className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Manage Publications
                </Link>
                <Link
                  href="/admin/research-areas"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Research Areas
                </Link>
                <Link
                  href="/admin/keywords"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Keywords
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">
                {session?.user?.email}
              </span>
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {isEdit ? 'Edit Publication' : 'Add New Publication'}
            </h2>
            <Link
              href="/admin/publications"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Publications
            </Link>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-600">
              Publication saved successfully! Redirecting...
            </div>
          )}
          
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8 divide-y divide-gray-200">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Title */}
              <div className="sm:col-span-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={publication.title}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              {/* Authors Section */}
              <div className="sm:col-span-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Authors *
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowLegacyAuthors(!showLegacyAuthors)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {showLegacyAuthors 
                        ? "Switch to Structured Authors" 
                        : "Switch to Simple Authors"}
                    </button>
                  </div>
                </div>
                
                {showLegacyAuthors ? (
                  /* Legacy Authors UI */
                  <div className="mt-1 space-y-2">
                    {(publication.authors || []).map((author, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          required
                          value={author}
                          onChange={(e) => handleAuthorChange(index, e.target.value)}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Author name"
                        />
                        <button
                          type="button"
                          onClick={() => removeAuthor(index)}
                          disabled={(publication.authors || []).length <= 1}
                          className="ml-2 p-1 text-red-600 hover:text-red-800 disabled:text-gray-400"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addAuthor}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      Add Author
                    </button>
                  </div>
                ) : (
                  /* Structured Authors UI */
                  <div className="mt-1 space-y-4 border rounded-md p-4">
                    <p className="text-sm text-gray-500 mb-2">
                      Structured author information for academic citations. Authors will appear in the order shown below.
                    </p>
                    
                    {publication.structuredAuthors.length === 0 ? (
                      <p className="text-sm text-gray-500">No authors added yet. Add your first author.</p>
                    ) : (
                      <div className="space-y-4">
                        {publication.structuredAuthors.map((structuredAuthor, index) => (
                          <div key={index} className="flex flex-col space-y-2 p-3 border border-gray-200 rounded-md">
                            <div className="flex justify-between">
                              <span className="font-medium">Author #{index + 1}</span>
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => moveStructuredAuthor(index, 'up')}
                                  disabled={index === 0}
                                  className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveStructuredAuthor(index, 'down')}
                                  disabled={index === publication.structuredAuthors.length - 1}
                                  className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeStructuredAuthor(index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-500">
                                  Select Author
                                </label>
                                <select
                                  value={structuredAuthor.author.id}
                                  onChange={(e) => handleStructuredAuthorChange(index, 'author', e.target.value)}
                                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                  {authors.map(author => (
                                    <option 
                                      key={author.id} 
                                      value={author.id}
                                      disabled={publication.structuredAuthors.some(
                                        sa => sa.author.id === author.id && sa.author.id !== structuredAuthor.author.id
                                      )}
                                    >
                                      {author.firstName} {author.middleName} {author.lastName} 
                                      {author.isYou ? " (You)" : ""}
                                      {author.affiliation ? ` - ${author.affiliation}` : ""}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div className="flex space-x-4 items-center">
                                <div className="flex items-center h-5">
                                  <input
                                    id={`corresponding-${index}`}
                                    type="checkbox"
                                    checked={structuredAuthor.isCorresponding}
                                    onChange={(e) => handleStructuredAuthorChange(index, 'isCorresponding', e.target.checked)}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                  />
                                  <label htmlFor={`corresponding-${index}`} className="ml-2 text-xs text-gray-700">
                                    Corresponding
                                  </label>
                                </div>
                                
                                <div className="flex items-center h-5">
                                  <input
                                    id={`equal-${index}`}
                                    type="checkbox"
                                    checked={structuredAuthor.equalContribution}
                                    onChange={(e) => handleStructuredAuthorChange(index, 'equalContribution', e.target.checked)}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                  />
                                  <label htmlFor={`equal-${index}`} className="ml-2 text-xs text-gray-700">
                                    Equal Contribution
                                  </label>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-600">
                              Full name: {structuredAuthor.author.firstName} {structuredAuthor.author.middleName} {structuredAuthor.author.lastName}
                              {structuredAuthor.author.affiliation && ` • ${structuredAuthor.author.affiliation}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-4">
                      {/* Author Search */}
                      <div className="w-full">
                        <label htmlFor="authorSearch" className="block text-sm font-medium text-gray-700 mb-1">
                          Search or Add Author
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="authorSearch"
                            placeholder="Search by name..."
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md pr-12"
                            onChange={(e) => {
                              const searchQuery = e.target.value.toLowerCase();
                              const searchResults = authors.filter(author => {
                                const fullName = `${author.firstName} ${author.middleName || ''} ${author.lastName}`.toLowerCase();
                                return fullName.includes(searchQuery);
                              }).slice(0, 5); // Limit to 5 results
                              
                              // Show results below the input
                              const resultsContainer = document.getElementById('authorSearchResults');
                              if (resultsContainer) {
                                resultsContainer.innerHTML = '';
                                
                                if (searchQuery.length > 1) {
                                  resultsContainer.style.display = 'block';
                                  
                                  if (searchResults.length > 0) {
                                    searchResults.forEach(author => {
                                      // Skip authors that are already selected
                                      if (publication.structuredAuthors.some(sa => sa.author.id === author.id)) {
                                        return;
                                      }
                                      
                                      const resultItem = document.createElement('div');
                                      resultItem.className = 'p-2 hover:bg-gray-100 cursor-pointer';
                                      resultItem.textContent = `${author.firstName} ${author.middleName || ''} ${author.lastName}`;
                                      
                                      resultItem.onclick = () => {
                                        // Add this author
                                        addSpecificStructuredAuthor(author);
                                        
                                        // Clear search
                                        e.target.value = '';
                                        resultsContainer.style.display = 'none';
                                      };
                                      
                                      resultsContainer.appendChild(resultItem);
                                    });
                                  } else {
                                    const noResults = document.createElement('div');
                                    noResults.className = 'p-2 text-gray-500';
                                    noResults.textContent = 'No matching authors found';
                                    resultsContainer.appendChild(noResults);
                                  }
                                } else {
                                  resultsContainer.style.display = 'none';
                                }
                              }
                            }}
                          />
                          <div 
                            id="authorSearchResults" 
                            className="absolute z-10 bg-white shadow-lg rounded-md mt-1 border border-gray-200 w-full max-h-60 overflow-y-auto hidden"
                          ></div>
                          <button
                            type="button"
                            onClick={addStructuredAuthor}
                            disabled={authors.length === 0 || authors.length === publication.structuredAuthors.length}
                            className="absolute inset-y-0 right-0 px-3 flex items-center bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-r-md"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-2">
                      <div className="text-sm text-gray-500">
                        {authors.length - publication.structuredAuthors.length} authors available
                      </div>
                      <Link
                        href="/admin/authors"
                        target="_blank"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Manage Authors
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Year and Type */}
              <div className="sm:col-span-3">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  Year *
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="year"
                    id="year"
                    required
                    min="1900"
                    max="2100"
                    value={publication.year}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type *
                </label>
                <div className="mt-1">
                  <select
                    id="type"
                    name="type"
                    required
                    value={publication.type}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="journal">Journal</option>
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="talk">Talk/Presentation</option>
                    <option value="poster">Poster</option>
                    <option value="preprint">Preprint</option>
                    <option value="working_paper">Working Paper</option>
                    <option value="book">Book</option>
                    <option value="book_chapter">Book Chapter</option>
                    <option value="magazine">Magazine/Article</option>
                    <option value="thesis">Thesis</option>
                    <option value="patent">Patent</option>
                    <option value="technical_report">Technical Report</option>
                  </select>
                </div>
              </div>
              
              {/* Venue */}
              <div className="sm:col-span-6">
                <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
                  Venue
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="venue"
                    id="venue"
                    value={publication.venue || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Journal/Conference name"
                  />
                </div>
              </div>
              
              {/* PDF Link */}
              <div className="sm:col-span-3">
                <label htmlFor="pdfLink" className="block text-sm font-medium text-gray-700">
                  PDF Link
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="pdfLink"
                    id="pdfLink"
                    value={publication.pdfLink || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="https://example.com/paper.pdf"
                  />
                </div>
              </div>
              
              {/* PDF File Upload (to be implemented) */}
              <div className="sm:col-span-3">
                <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700">
                  PDF File Upload
                </label>
                <div className="mt-1">
                  <p className="text-sm text-gray-500 mb-2">
                    {publication.pdfFile ? `Current file: ${publication.pdfFile.split('/').pop()}` : 'No file uploaded yet'}
                  </p>
                  <input
                    type="file"
                    name="pdfFile"
                    id="pdfFile"
                    accept=".pdf"
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">PDF files only, max 10MB</p>
                </div>
              </div>
              
              {/* DOI */}
              <div className="sm:col-span-3">
                <label htmlFor="doi" className="block text-sm font-medium text-gray-700">
                  DOI
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="doi"
                    id="doi"
                    value={publication.doi || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="10.xxxx/xxxxx"
                  />
                </div>
              </div>
              
              {/* Publisher */}
              <div className="sm:col-span-3">
                <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">
                  Publisher
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="publisher"
                    id="publisher"
                    value={publication.publisher || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Elsevier, Springer, etc."
                  />
                </div>
              </div>
              
              {/* Volume & Issue (for journals) */}
              <div className="sm:col-span-3">
                <label htmlFor="volume" className="block text-sm font-medium text-gray-700">
                  Volume
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="volume"
                    id="volume"
                    value={publication.volume || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="issue" className="block text-sm font-medium text-gray-700">
                  Issue
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="issue"
                    id="issue"
                    value={publication.issue || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              {/* Pages */}
              <div className="sm:col-span-3">
                <label htmlFor="pages" className="block text-sm font-medium text-gray-700">
                  Pages
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="pages"
                    id="pages"
                    value={publication.pages || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="123-145"
                  />
                </div>
              </div>
              
              {/* ISBN/ISSN */}
              <div className="sm:col-span-3">
                <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
                  ISBN/ISSN
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="isbn"
                    id="isbn"
                    value={publication.isbn || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              {/* Abstract */}
              <div className="sm:col-span-6">
                <label htmlFor="abstract" className="block text-sm font-medium text-gray-700">
                  Abstract
                </label>
                <div className="mt-1">
                  <textarea
                    id="abstract"
                    name="abstract"
                    rows={4}
                    value={publication.abstract || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              {/* Description */}
              <div className="sm:col-span-6">
                <div className="flex justify-between items-center">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <button
                    type="button"
                    onClick={generateAIContent}
                    disabled={!publication.title || publication.authors.length === 0}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    Generate with AI
                  </button>
                </div>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={publication.description || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="A short description for the website"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  A brief description that will be displayed on the website. You can use the AI to generate this.
                </p>
              </div>
              
              {/* Status */}
              <div className="sm:col-span-3">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <select
                    id="status"
                    name="status"
                    value={publication.status || 'published'}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="published">Published</option>
                    <option value="in_press">In Press</option>
                    <option value="under_review">Under Review</option>
                    <option value="in_preparation">In Preparation</option>
                  </select>
                </div>
              </div>
              
              {/* Keywords */}
              <div className="sm:col-span-3">
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                  Keywords
                </label>
                <div className="mt-1">
                  <select
                    id="keywords"
                    name="keywords"
                    multiple
                    value={publication.keywords?.map(k => k.id) || []}
                    onChange={handleKeywordChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md h-32"
                  >
                    {keywords.map(keyword => (
                      <option key={keyword.id} value={keyword.id}>
                        {keyword.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Hold Ctrl/Cmd to select multiple keywords
                </p>
              </div>
              
              {/* Research Areas */}
              <div className="sm:col-span-3">
                <label htmlFor="researchAreas" className="block text-sm font-medium text-gray-700">
                  Research Areas
                </label>
                <div className="mt-1">
                  <select
                    id="researchAreas"
                    name="researchAreas"
                    multiple
                    value={publication.researchAreas?.map(a => a.id) || []}
                    onChange={handleAreaChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md h-32"
                  >
                    {researchAreas.map(area => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Hold Ctrl/Cmd to select multiple areas
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Link
                href="/admin/publications"
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {saving ? 'Saving...' : (isEdit ? 'Update Publication' : 'Create Publication')}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 