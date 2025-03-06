'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Temporary mock session until we install next-auth
const useSession = () => {
  return {
    data: { user: { email: 'admin@example.com' } },
    status: 'authenticated'
  };
};

type ResearchArea = {
  id: string;
  name: string;
};

type Keyword = {
  id: string;
  name: string;
};

type Publication = {
  id?: string;
  title: string;
  authors: string[];
  year: number;
  type: string;
  venue?: string;
  url?: string;
  abstract?: string;
  description?: string;
  status?: string;
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
  const isEdit = params.action !== 'new';
  const publicationId = isEdit ? params.action.replace('edit/', '') : null;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);
  
  // Form state
  const [publication, setPublication] = useState<Publication>({
    title: '',
    authors: [''],
    year: new Date().getFullYear(),
    type: 'journal',
    venue: '',
    url: '',
    abstract: '',
    description: '',
    status: 'published',
    keywords: [],
    researchAreas: []
  });
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  // Fetch publication data if editing
  useEffect(() => {
    if (status === 'authenticated') {
      // Fetch keywords and research areas
      Promise.all([
        fetch('/api/admin/keywords').then(res => res.json()),
        fetch('/api/admin/research-areas').then(res => res.json())
      ])
      .then(([keywordsData, areasData]) => {
        setKeywords(keywordsData);
        setResearchAreas(areasData);
        
        // If editing, fetch the publication
        if (isEdit && publicationId) {
          return fetch(`/api/admin/publications?id=${publicationId}`)
            .then(res => {
              if (!res.ok) throw new Error('Failed to fetch publication');
              return res.json();
            })
            .then(data => {
              setPublication(data);
            });
        }
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [status, isEdit, publicationId]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPublication(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle author changes
  const handleAuthorChange = (index: number, value: string) => {
    const newAuthors = [...publication.authors];
    newAuthors[index] = value;
    setPublication(prev => ({ ...prev, authors: newAuthors }));
  };
  
  const addAuthor = () => {
    setPublication(prev => ({ 
      ...prev, 
      authors: [...prev.authors, ''] 
    }));
  };
  
  const removeAuthor = (index: number) => {
    if (publication.authors.length <= 1) return;
    const newAuthors = [...publication.authors];
    newAuthors.splice(index, 1);
    setPublication(prev => ({ ...prev, authors: newAuthors }));
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
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // Prepare data for API
      const formData = {
        ...publication,
        year: Number(publication.year),
        keywords: publication.keywords?.map(k => k.id),
        researchAreas: publication.researchAreas?.map(a => a.id)
      };
      
      // Send to API
      const response = await fetch('/api/admin/publications', {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
          
          <form onSubmit={handleSubmit} className="bg-white shadow overflow-hidden rounded-md p-6">
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
              
              {/* Authors */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Authors *
                </label>
                <div className="mt-1 space-y-2">
                  {publication.authors.map((author, index) => (
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
                        disabled={publication.authors.length <= 1}
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
                    <option value="preprint">Preprint</option>
                    <option value="book">Book</option>
                    <option value="book_chapter">Book Chapter</option>
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
              
              {/* URL */}
              <div className="sm:col-span-6">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                  URL
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="url"
                    id="url"
                    value={publication.url || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="https://example.com/paper"
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