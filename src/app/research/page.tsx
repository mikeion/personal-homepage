'use client'
import { useState, useEffect } from 'react'
import { FaArrowUp } from 'react-icons/fa'
import { publications } from '@/data/publications'
import { PublicationEntry } from '@/components/publications/PublicationEntry'
import { researchAreas, getResearchAreas } from '@/data/researchAreas'
import type { Publication } from '@/types/publications'

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
    ...(publications.book_chapters || [])
  ];
  return allPubs.filter(pub => {
    const areas = pub.keywords ? getResearchAreas(pub.keywords) : [];
    return areas.includes(area);
  }).length;
};

export default function Research() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const filteredPublications = (pubs: Publication[]) => {
    if (!selectedArea) return pubs;
    return pubs.filter(pub => {
      const areas = pub.keywords ? getResearchAreas(pub.keywords) : [];
      return areas.includes(selectedArea);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Research</h1>

      {/* Research Overview Section */}
      <section className="mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
            {/* Personal Research Narrative */}
            <div className="mb-12">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                As a researcher at the intersection of artificial intelligence and education, 
                I'm fascinated by how we can use advanced data science techniques to understand 
                the complexities of teaching and learning. My work focuses on decoding educational 
                interactions at scale—whether that's analyzing thousands of online tutoring 
                conversations or developing AI models that can simulate authentic learning experiences.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                What drives me is the potential to bridge the gap between qualitative educational 
                insights and quantitative data analysis. By leveraging tools like large language 
                models and machine learning, we can understand teaching and learning patterns that 
                would be impossible to detect through traditional methods alone.
              </p>
            </div>

            <h2 className="text-3xl font-bold mb-6">Research Focus</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              My research explores the intersection of artificial intelligence and education, 
              focusing on how we can use advanced data science techniques to understand and 
              improve teaching and learning at scale.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Current Projects</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                  <li>Developing teaching models for conversational AI</li>
                  <li>Creating AI-based simulated student models</li>
                  <li>Analyzing learning interaction data</li>
                  <li>Building educational benchmarks and datasets</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Research Goals</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                  <li>Improve understanding of teaching and learning processes</li>
                  <li>Develop AI tools that enhance education</li>
                  <li>Create methods for analyzing educational data at scale</li>
                  <li>Bridge qualitative and quantitative approaches in education</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Current Position</h3>
              <p className="text-gray-600 dark:text-gray-300">
                As a Postdoctoral Fellow at the University of Michigan School of Information, 
                I work in <a href="https://www.si.umich.edu/people/kevyn-collins-thompson" 
                className="text-blue-600 dark:text-blue-400 hover:underline">Dr. Kevyn Collins-Thompson's</a> research 
                lab, where we develop creative, high-impact research at the intersection of AI and education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Research Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {researchAreas.map((area) => (
            <button 
              key={area.id}
              onClick={() => setSelectedArea(area.name === selectedArea ? null : area.name)}
              className={`text-left bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg 
                         hover:shadow-xl transition-all border-2 ${
                           selectedArea === area.name 
                             ? 'border-blue-500' 
                             : 'border-transparent'
                         }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold">{area.name}</h3>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 
                               px-3 py-1 rounded-full text-sm font-medium">
                  {getPublicationCountByArea(area.name)} publications
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {area.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {area.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 
                             text-gray-600 dark:text-gray-300"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Update the filter buttons to show counts */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setSelectedArea(null)}
          className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 ${
            !selectedArea 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
          }`}
        >
          <span>All</span>
          <span className="bg-opacity-20 bg-white px-2 py-0.5 rounded-full">
            {publications.journal_publications.length + (publications.book_chapters?.length || 0)}
          </span>
        </button>
        {researchAreas.map(area => (
          <button
            key={area.id}
            onClick={() => setSelectedArea(area.name)}
            className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 ${
              selectedArea === area.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            <span>{area.name}</span>
            <span className={`${
              selectedArea === area.name 
                ? 'bg-white bg-opacity-20' 
                : 'bg-gray-200 dark:bg-gray-700'
              } px-2 py-0.5 rounded-full`}
            >
              {getPublicationCountByArea(area.name)}
            </span>
          </button>
        ))}
      </div>

      {/* Publications with section headers */}
      <section className="space-y-16">
        <h2 className="text-3xl font-bold mb-8">Selected Publications</h2>

        {/* Journal Publications */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Journal Articles</h3>
          <div className="space-y-6">
            {filteredPublications(publications.journal_publications).map((pub) => (
              <div key={pub.id} id={pub.id} className="scroll-mt-16">
                <PublicationEntry publication={pub} type="journal" />
              </div>
            ))}
          </div>
        </div>

        {/* Book Chapters */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Book Chapters</h3>
          <div className="space-y-6">
            {filteredPublications(publications.book_chapters || []).map((pub) => (
              <div key={pub.id} id={pub.id} className="scroll-mt-16">
                <PublicationEntry publication={pub} type="book_chapter" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ScrollToTop />
    </div>
  )
} 