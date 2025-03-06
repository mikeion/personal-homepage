'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// We'll need to install these packages
// import { useSession } from 'next-auth/react';

// Temporary mock session until we install next-auth
const useSession = () => {
  return {
    data: { user: { email: 'admin@example.com' } },
    status: 'authenticated'
  };
};

type Publication = {
  id: string;
  title: string;
  authors: string[];
  year: number;
  type: string;
  venue?: string;
  status?: string;
};

export default function PublicationsManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  // Fetch publications
  useEffect(() => {
    if (status === 'authenticated') {
      fetchPublications();
    }
  }, [status]);
  
  const fetchPublications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/publications');
      if (!response.ok) throw new Error('Failed to fetch publications');
      
      const data = await response.json();
      setPublications(data);
      
      // Extract unique years and types for filters with proper type assertions
      const yearsArray = data.map((pub: Publication) => String(pub.year));
      const uniqueYears = [...new Set(yearsArray)] as string[];
      uniqueYears.sort((a, b) => b.localeCompare(a));
      
      const typesArray = data.map((pub: Publication) => pub.type);
      const uniqueTypes = [...new Set(typesArray)] as string[];
      
      setYearOptions(uniqueYears);
      setTypeOptions(uniqueTypes);
      
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/publications?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete publication');
      
      // Remove from state
      setPublications(publications.filter(pub => pub.id !== id));
      
    } catch (error) {
      console.error('Error deleting publication:', error);
      alert('Failed to delete publication. Please try again.');
    }
  };
  
  // Filter publications
  const filteredPublications = publications.filter(pub => {
    const searchMatch = 
      filter === '' || 
      pub.title.toLowerCase().includes(filter.toLowerCase()) ||
      pub.authors.some(author => author.toLowerCase().includes(filter.toLowerCase())) ||
      (pub.venue && pub.venue.toLowerCase().includes(filter.toLowerCase()));
    
    const typeMatch = typeFilter === '' || pub.type === typeFilter;
    const yearMatch = yearFilter === '' || String(pub.year) === yearFilter;
    
    return searchMatch && typeMatch && yearMatch;
  });
  
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
            <h2 className="text-2xl font-bold">Manage Publications</h2>
            <Link
              href="/admin/publications/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Add New Publication
            </Link>
          </div>
          
          {/* Filters */}
          <div className="bg-white p-4 mb-6 rounded-lg shadow">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by title, author, or venue"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  id="type-filter"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Types</option>
                  {typeOptions.map(type => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  id="year-filter"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Years</option>
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Publications List */}
          <div className="bg-white shadow overflow-hidden rounded-md">
            {filteredPublications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {publications.length === 0 
                  ? "No publications found. Add a new publication to get started."
                  : "No publications match your search criteria."}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredPublications.map(publication => (
                  <li key={publication.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-md font-medium truncate">
                          {publication.title}
                        </h3>
                        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            {publication.authors.join(', ')}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            {publication.venue}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            {publication.year}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 capitalize">
                            {publication.type.replace('_', ' ')}
                          </div>
                          {publication.status && (
                            <div className="mt-2 flex items-center text-sm text-gray-500 capitalize">
                              {publication.status.replace('_', ' ')}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/publications/edit/${publication.id}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(publication.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 