'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

type Author = {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  email?: string | null;
  affiliation?: string | null;
  isYou: boolean;
};

export default function AuthorsManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [email, setEmail] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [isYou, setIsYou] = useState(false);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  // Fetch authors
  useEffect(() => {
    if (status === 'authenticated') {
      fetchAuthors();
    }
  }, [status]);
  
  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/authors');
      if (!response.ok) throw new Error('Failed to fetch authors');
      
      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
      setError('Failed to load authors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setMiddleName('');
    setEmail('');
    setAffiliation('');
    setIsYou(false);
    setEditingAuthor(null);
  };
  
  const openEditForm = (author: Author) => {
    setEditingAuthor(author);
    setFirstName(author.firstName);
    setLastName(author.lastName);
    setMiddleName(author.middleName || '');
    setEmail(author.email || '');
    setAffiliation(author.affiliation || '');
    setIsYou(author.isYou);
    setShowForm(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const authorData = {
        firstName,
        lastName,
        middleName: middleName || null,
        email: email || null,
        affiliation: affiliation || null,
        isYou
      };
      
      const url = '/api/admin/authors';
      const method = editingAuthor ? 'PUT' : 'POST';
      const body = editingAuthor 
        ? JSON.stringify({ id: editingAuthor.id, ...authorData })
        : JSON.stringify(authorData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save author');
      }
      
      // Refresh author list
      await fetchAuthors();
      
      // Close form and reset
      setShowForm(false);
      resetForm();
      
    } catch (error) {
      console.error('Error saving author:', error);
      setError((error as Error).message || 'Failed to save author. Please try again.');
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this author?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/authors?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete author');
      }
      
      // Refresh author list
      await fetchAuthors();
      
    } catch (error) {
      console.error('Error deleting author:', error);
      alert((error as Error).message || 'Failed to delete author. It might be used in publications.');
    }
  };
  
  if (loading && authors.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Authors</h1>
        <p>Loading authors...</p>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Authors</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showForm ? 'Cancel' : 'Add Author'}
          </button>
          <Link
            href="/admin/dashboard"
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {showForm && (
        <div className="bg-white shadow-md rounded p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingAuthor ? 'Edit Author' : 'Add New Author'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Middle Name
                </label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Affiliation
                </label>
                <input
                  type="text"
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="University or Organization"
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    id="isYou"
                    type="checkbox"
                    checked={isYou}
                    onChange={(e) => setIsYou(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isYou" className="ml-2 block text-sm text-gray-700">
                    This is me (will be highlighted in CV)
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                {editingAuthor ? 'Update Author' : 'Add Author'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {authors.length > 0 ? (
        <div className="bg-white shadow-md rounded overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Affiliation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  You
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {authors.map((author) => (
                <tr key={author.id} className={author.isYou ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {author.firstName} {author.middleName} {author.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {author.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {author.affiliation || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {author.isYou ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Yes
                      </span>
                    ) : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditForm(author)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(author.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 shadow-md rounded">
          <p>No authors found. Add your first author using the form above.</p>
        </div>
      )}
    </div>
  );
} 