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

type Keyword = {
  id: string;
  name: string;
};

export default function KeywordsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // State for keywords list
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for form
  const [isEditing, setIsEditing] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState<Keyword | null>(null);
  const [formName, setFormName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  // Fetch keywords
  useEffect(() => {
    if (status === 'authenticated') {
      fetchKeywords();
    }
  }, [status]);
  
  const fetchKeywords = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/keywords');
      if (!response.ok) throw new Error('Failed to fetch keywords');
      
      const data = await response.json();
      setKeywords(data);
    } catch (error) {
      console.error('Error fetching keywords:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSaving(true);
    
    if (!formName.trim()) {
      setFormError('Name is required');
      setSaving(false);
      return;
    }
    
    try {
      const url = '/api/admin/keywords';
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing 
        ? JSON.stringify({ id: currentKeyword?.id, name: formName })
        : JSON.stringify({ name: formName });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save keyword');
      }
      
      // Reset form and refresh list
      setFormSuccess(isEditing ? 'Keyword updated successfully' : 'Keyword created successfully');
      resetForm();
      fetchKeywords();
      
    } catch (error) {
      console.error('Error saving keyword:', error);
      setFormError((error as Error).message || 'Failed to save keyword');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this keyword?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/keywords?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Special case for keywords used by publications
        if (errorData.publicationCount) {
          alert(`Cannot delete this keyword because it is used by ${errorData.publicationCount} publication(s).`);
          return;
        }
        
        throw new Error(errorData.error || 'Failed to delete keyword');
      }
      
      // Refresh list
      fetchKeywords();
      
    } catch (error) {
      console.error('Error deleting keyword:', error);
      alert('Failed to delete keyword. Please try again.');
    }
  };
  
  // Edit keyword
  const handleEdit = (keyword: Keyword) => {
    setIsEditing(true);
    setCurrentKeyword(keyword);
    setFormName(keyword.name);
    setFormError(null);
    setFormSuccess(null);
  };
  
  // Reset form
  const resetForm = () => {
    setIsEditing(false);
    setCurrentKeyword(null);
    setFormName('');
    setFormError(null);
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
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
                  className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
            <h2 className="text-2xl font-bold">Manage Keywords</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow overflow-hidden rounded-md p-6">
                <h3 className="text-lg font-medium mb-4">
                  {isEditing ? 'Edit Keyword' : 'Add New Keyword'}
                </h3>
                
                {formError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                    {formError}
                  </div>
                )}
                
                {formSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm">
                    {formSuccess}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., Deep Learning"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                    >
                      {saving ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* List */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow overflow-hidden rounded-md">
                <ul className="divide-y divide-gray-200">
                  {keywords.length === 0 ? (
                    <li className="px-6 py-4 text-center text-gray-500">
                      No keywords found. Add a new one to get started.
                    </li>
                  ) : (
                    keywords.map((keyword) => (
                      <li key={keyword.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-md font-medium text-gray-900">{keyword.name}</h4>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(keyword)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(keyword.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 