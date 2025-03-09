'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Publication = {
  id: string;
  title: string;
  authors: string[];
  year: number;
  type: string;
  venue?: string;
  status?: string;
  doi?: string;
  pdfLink?: string;
  projectLink?: string;
};

type ContactInfo = {
  name: string;
  title: string;
  institution: string;
  email: string;
  phone?: string;
  website: string;
  address?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
};

type Education = {
  degree: string;
  institution: string;
  location: string;
  date: string;
  description?: string;
};

export default function CurriculumVitae() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: 'Mike Ion',
    title: 'Postdoctoral Fellow',
    institution: 'University of Michigan School of Information',
    email: 'mikeion@umich.edu',
    website: 'https://mikeion.com',
    address: 'Ann Arbor, MI'
  });
  const [education, setEducation] = useState<Education[]>([]);
  
  // Fetch publications and other data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch publications
        const pubResponse = await fetch('/api/publications');
        const publications = await pubResponse.json();
        setPublications(publications);
        
        // Fetch contact info (in production, you'd have an API for this)
        try {
          const contactResponse = await fetch('/api/cv/contact');
          const contactData = await contactResponse.json();
          setContactInfo(contactData);
        } catch (error) {
          console.log('Using default contact info');
          // Keep using the default contact info
        }
        
        // Fetch education info (in production, you'd have an API for this)
        try {
          const educationResponse = await fetch('/api/cv/education');
          const educationData = await educationResponse.json();
          setEducation(educationData);
        } catch (error) {
          console.log('Using default education info');
          // Set some default education data
          setEducation([
            {
              degree: 'Ph.D. in Education',
              institution: 'University of Michigan',
              location: 'Ann Arbor, MI',
              date: 'May 2024'
            },
            {
              degree: 'M.S. in Mathematics',
              institution: 'University of Michigan',
              location: 'Ann Arbor, MI',
              date: '2016'
            }
          ]);
        }
        
      } catch (error) {
        console.error('Error fetching CV data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Group publications by type
  const journalArticles = publications.filter(pub => pub.type === 'journal');
  const conferenceProceedings = publications.filter(pub => pub.type === 'conference');
  const preprints = publications.filter(pub => pub.type === 'preprint');
  const bookChapters = publications.filter(pub => pub.type === 'book_chapter');
  
  // Format author names correctly
  const formatAuthors = (authors: string[]) => {
    return authors.join(', ');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Curriculum Vitae
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 text-center border-b border-gray-200">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {contactInfo.name}
            </h1>
            <p className="mt-1 max-w-2xl text-xl text-gray-500">
              {contactInfo.title} · {contactInfo.institution}
            </p>
            <div className="mt-2 text-sm text-gray-500">
              <div>{contactInfo.email} · {contactInfo.address}</div>
              <div className="mt-1">
                <a href={contactInfo.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {contactInfo.website}
                </a>
              </div>
            </div>
            
            <div className="mt-4 flex justify-center space-x-4">
              <Link 
                href="/research" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Research
              </Link>
              <a
                href="/cv.pdf"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                target="_blank"
                rel="noopener noreferrer"
                download="Mike_Ion_CV.pdf"
              >
                Download PDF
              </a>
            </div>
          </div>
          
          {/* Education */}
          <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <h3 className="text-md font-medium">{edu.degree}</h3>
                    <p className="text-sm text-gray-500">{edu.institution}, {edu.location}</p>
                  </div>
                  <div className="text-sm text-gray-500 md:text-right">
                    {edu.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Publications */}
          <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Publications</h2>
            
            {/* Journal Articles */}
            {journalArticles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Journal Articles</h3>
                <ul className="space-y-3">
                  {journalArticles.map(pub => (
                    <li key={pub.id} className="text-sm">
                      <p>
                        <span className="font-medium">{formatAuthors(pub.authors)}. </span>
                        ({pub.year}). {pub.title}. <span className="italic">{pub.venue}</span>.
                        {pub.doi && (
                          <span>
                            {' '}
                            <a 
                              href={pub.doi.startsWith('http') ? pub.doi : `https://doi.org/${pub.doi}`} 
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              DOI
                            </a>
                          </span>
                        )}
                        {pub.pdfLink && (
                          <span>
                            {' '}
                            <a 
                              href={pub.pdfLink} 
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              [PDF]
                            </a>
                          </span>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Conference Proceedings */}
            {conferenceProceedings.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Conference Proceedings</h3>
                <ul className="space-y-3">
                  {conferenceProceedings.map(pub => (
                    <li key={pub.id} className="text-sm">
                      <p>
                        <span className="font-medium">{formatAuthors(pub.authors)}. </span>
                        ({pub.year}). {pub.title}. <span className="italic">{pub.venue}</span>.
                        {pub.projectLink && (
                          <span>
                            {' '}
                            <a 
                              href={pub.projectLink} 
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              [Link]
                            </a>
                          </span>
                        )}
                        {pub.pdfLink && (
                          <span>
                            {' '}
                            <a 
                              href={pub.pdfLink} 
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              [PDF]
                            </a>
                          </span>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Book Chapters */}
            {bookChapters.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Book Chapters</h3>
                <ul className="space-y-3">
                  {bookChapters.map(pub => (
                    <li key={pub.id} className="text-sm">
                      <p>
                        <span className="font-medium">{formatAuthors(pub.authors)}. </span>
                        ({pub.year}). {pub.title}. <span className="italic">{pub.venue}</span>.
                        {pub.projectLink && (
                          <span>
                            {' '}
                            <a 
                              href={pub.projectLink} 
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              [Link]
                            </a>
                          </span>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Preprints/Working Papers */}
            {preprints.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Working Papers & Preprints</h3>
                <ul className="space-y-3">
                  {preprints.map(pub => (
                    <li key={pub.id} className="text-sm">
                      <p>
                        <span className="font-medium">{formatAuthors(pub.authors)}. </span>
                        ({pub.year}). {pub.title}. <span className="italic">{pub.status === 'in_preparation' ? 'In preparation' : pub.venue}</span>.
                        {pub.projectLink && (
                          <span>
                            {' '}
                            <a 
                              href={pub.projectLink} 
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              [Link]
                            </a>
                          </span>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Professional Experience */}
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Experience</h2>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between">
                <div>
                  <h3 className="text-md font-medium">Postdoctoral Fellow</h3>
                  <p className="text-sm text-gray-500">University of Michigan School of Information</p>
                </div>
                <div className="text-sm text-gray-500 md:text-right">
                  2023 - Present
                </div>
              </div>
              
              {/* Add more experiences as needed */}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
} 