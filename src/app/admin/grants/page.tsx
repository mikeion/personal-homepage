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

type Grant = {
  id: string;
  title: string;
  funder: string;
  amount: string;
  role: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status: string;
  collaborators: string[];
};

export default function GrantsManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Form state for adding/editing grants
  const [isEditing, setIsEditing] = useState(false);
  const [currentGrant, setCurrentGrant] = useState<Grant | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    funder: '',
    amount: '',
    role: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'active',
    collaborators: ['']
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  // Fetch grants
  useEffect(() => {
    if (status === 'authenticated') {
      fetchGrants();
    }
  }, [status]);
  
  const fetchGrants = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/grants');
      if (!response.ok) throw new Error('Failed to fetch grants');
      
      const data = await response.json();
      setGrants(data);
    } catch (error) {
      console.error('Error fetching grants:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle collaborator changes
  const handleCollaboratorChange = (index: number, value: string) => {
    const newCollaborators = [...formData.collaborators];
    newCollaborators[index] = value;
    setFormData(prev => ({ ...prev, collaborators: newCollaborators }));
  };
  
  const addCollaborator = () => {
    setFormData(prev => ({ 
      ...prev, 
      collaborators: [...prev.collaborators, ''] 
    }));
  };
  
  const removeCollaborator = (index: number) => {
    if (formData.collaborators.length <= 1) return;
    const newCollaborators = [...formData.collaborators];
    newCollaborators.splice(index, 1);
    setFormData(prev => ({ ...prev, collaborators: newCollaborators }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSaving(true);
    
    if (!formData.title || !formData.funder || !formData.amount || !formData.role || !formData.startDate) {
      setFormError('Please fill in all required fields');
      setSaving(false);
      return;
    }
    
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = '/api/admin/grants';
      
      const payload = {
        ...formData,
        id: currentGrant?.id
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save grant');
      }
      
      // Reset form and refresh list
      setFormSuccess(isEditing ? 'Grant updated successfully' : 'Grant created successfully');
      resetForm();
      fetchGrants();
      
    } catch (error) {
      console.error('Error saving grant:', error);
      setFormError((error as Error).message || 'Failed to save grant');
    } finally {
      setSaving(false);
    }
  };
  
  // Edit grant
  const handleEdit = (grant: Grant) => {
    setIsEditing(true);
    setCurrentGrant(grant);
    
    setFormData({
      title: grant.title,
      funder: grant.funder,
      amount: grant.amount,
      role: grant.role,
      description: grant.description || '',
      startDate: new Date(grant.startDate).toISOString().split('T')[0],
      endDate: grant.endDate ? new Date(grant.endDate).toISOString().split('T')[0] : '',
      status: grant.status,
      collaborators: grant.collaborators.length > 0 ? grant.collaborators : ['']
    });
    
    setFormError(null);
    setFormSuccess(null);
  };
  
  // Delete grant
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this grant?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/grants?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete grant');
      }
      
      // Refresh list
      fetchGrants();
      
    } catch (error) {
      console.error('Error deleting grant:', error);
      alert('Failed to delete grant. Please try again.');
    }
  };
  
  // Reset form
  const resetForm = () => {
    setIsEditing(false);
    setCurrentGrant(null);
    setFormData({
      title: '',
      funder: '',
      amount: '',
      role: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'active',
      collaborators: ['']
    });
    setFormError(null);
  };
  
  // Filter grants
  const filteredGrants = grants.filter(grant => {
    const searchMatch = 
      filter === '' || 
      grant.title.toLowerCase().includes(filter.toLowerCase()) ||
      grant.funder.toLowerCase().includes(filter.toLowerCase()) ||
      grant.description?.toLowerCase().includes(filter.toLowerCase());
    
    const statusMatch = statusFilter === '' || grant.status === statusFilter;
    
    return searchMatch && statusMatch;
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
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Publications
                </Link>
                <Link
                  href="/admin/grants"
                  className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Grants
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Manage Grants</h2>
            <p className="mt-1 text-gray-500">Add and manage research grants and funding</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow overflow-hidden rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">
                  {isEditing ? 'Edit Grant' : 'Add New Grant'}
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
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    {/* Funder */}
                    <div>
                      <label htmlFor="funder" className="block text-sm font-medium text-gray-700">
                        Funder/Organization *
                      </label>
                      <input
                        type="text"
                        id="funder"
                        name="funder"
                        value={formData.funder}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    {/* Amount */}
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Amount *
                      </label>
                      <input
                        type="text"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="$10,000"
                        required
                      />
                    </div>
                    
                    {/* Role */}
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Role *
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Select a role</option>
                        <option value="PI">Principal Investigator (PI)</option>
                        <option value="Co-PI">Co-Principal Investigator (Co-PI)</option>
                        <option value="Collaborator">Collaborator</option>
                        <option value="Consultant">Consultant</option>
                        <option value="Research Assistant">Research Assistant</option>
                      </select>
                    </div>
                    
                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status *
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    
                    {/* Collaborators */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Collaborators
                      </label>
                      <div className="mt-1 space-y-2">
                        {formData.collaborators.map((collaborator, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="text"
                              value={collaborator}
                              onChange={(e) => handleCollaboratorChange(index, e.target.value)}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Collaborator name"
                            />
                            <button
                              type="button"
                              onClick={() => removeCollaborator(index)}
                              disabled={formData.collaborators.length <= 1}
                              className="ml-2 p-1 text-red-600 hover:text-red-800 disabled:text-gray-400"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addCollaborator}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          Add Collaborator
                        </button>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Brief description of the grant and project"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      {isEditing && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {saving ? 'Saving...' : (isEditing ? 'Update Grant' : 'Add Grant')}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Grants List */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                        Search
                      </label>
                      <input
                        type="text"
                        id="search"
                        placeholder="Search grants..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {filteredGrants.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    {grants.length === 0 
                      ? "No grants found. Add a new grant to get started."
                      : "No grants match your search criteria."}
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {filteredGrants.map(grant => (
                      <li key={grant.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div className="flex-1">
                            <h3 className="text-md font-medium">{grant.title}</h3>
                            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                {grant.funder}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                {grant.amount}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                Role: {grant.role}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 capitalize">
                                Status: {grant.status}
                              </div>
                            </div>
                            {grant.description && (
                              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{grant.description}</p>
                            )}
                            {grant.collaborators.length > 0 && grant.collaborators[0] !== '' && (
                              <div className="mt-2 text-sm text-gray-500">
                                <span className="font-medium">Collaborators:</span> {grant.collaborators.join(', ')}
                              </div>
                            )}
                          </div>
                          <div className="mt-4 md:mt-0 md:ml-6 flex space-x-2 flex-shrink-0">
                            <button
                              onClick={() => handleEdit(grant)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(grant.id)}
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
          </div>
        </div>
      </main>
    </div>
  );
} 