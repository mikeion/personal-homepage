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

type DashboardStats = {
  totalPublications: number;
  publicationsByType: Record<string, number>;
  publicationsByYear: Record<string, number>;
  totalKeywords: number;
  totalResearchAreas: number;
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalPublications: 0,
    publicationsByType: {},
    publicationsByYear: {},
    totalKeywords: 0,
    totalResearchAreas: 0
  });
  const [loading, setLoading] = useState(true);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  // Fetch dashboard stats
  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);
  
  const fetchStats = async () => {
    setLoading(true);
    try {
      // In a real app, you would have an API endpoint for stats
      // For now, we'll fetch publications and calculate stats
      const [publicationsRes, keywordsRes, areasRes] = await Promise.all([
        fetch('/api/admin/publications'),
        fetch('/api/admin/keywords'),
        fetch('/api/admin/research-areas')
      ]);
      
      if (!publicationsRes.ok || !keywordsRes.ok || !areasRes.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const [publications, keywords, areas] = await Promise.all([
        publicationsRes.json(),
        keywordsRes.json(),
        areasRes.json()
      ]);
      
      // Calculate stats
      const publicationsByType: Record<string, number> = {};
      const publicationsByYear: Record<string, number> = {};
      
      publications.forEach((pub: any) => {
        // Count by type
        publicationsByType[pub.type] = (publicationsByType[pub.type] || 0) + 1;
        
        // Count by year
        const year = String(pub.year);
        publicationsByYear[year] = (publicationsByYear[year] || 0) + 1;
      });
      
      setStats({
        totalPublications: publications.length,
        publicationsByType,
        publicationsByYear,
        totalKeywords: keywords.length,
        totalResearchAreas: areas.length
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
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
                  className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Total Publications */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Publications
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stats.totalPublications}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link href="/admin/publications" className="font-medium text-blue-600 hover:text-blue-500">
                      View all publications
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Research Areas */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Research Areas
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stats.totalResearchAreas}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link href="/admin/research-areas" className="font-medium text-blue-600 hover:text-blue-500">
                      Manage research areas
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Keywords */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Keywords
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stats.totalKeywords}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link href="/admin/keywords" className="font-medium text-blue-600 hover:text-blue-500">
                      Manage keywords
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/admin/publications/new"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Add New Publication
              </Link>
              <Link
                href="/admin/research-areas"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Manage Research Areas
              </Link>
              <Link
                href="/admin/keywords"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
              >
                Manage Keywords
              </Link>
              <Link
                href="/research"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                target="_blank"
              >
                View Public Research Page
              </Link>
            </div>
          </div>
          
          {/* Publications by Type */}
          {Object.keys(stats.publicationsByType).length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Publications by Type</h3>
              <div className="bg-white shadow overflow-hidden rounded-md">
                <ul className="divide-y divide-gray-200">
                  {Object.entries(stats.publicationsByType).map(([type, count]) => (
                    <li key={type} className="px-6 py-4 flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900 capitalize">
                        {type.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-gray-500">{count}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Publications by Year */}
          {Object.keys(stats.publicationsByYear).length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Publications by Year</h3>
              <div className="bg-white shadow overflow-hidden rounded-md">
                <ul className="divide-y divide-gray-200">
                  {Object.entries(stats.publicationsByYear)
                    .sort((a, b) => Number(b[0]) - Number(a[0])) // Sort by year descending
                    .map(([year, count]) => (
                      <li key={year} className="px-6 py-4 flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">{year}</div>
                        <div className="text-sm text-gray-500">{count}</div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 