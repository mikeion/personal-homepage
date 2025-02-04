import { promises as fs } from 'fs'
import path from 'path'

interface Publication {
  title: string
  authors: string[]
  journal?: string
  venue?: string
  year?: string | number
  date?: string
  status?: string
  type?: string
  doi?: string
  location?: string
  award?: string
  description?: string
  volume?: string
  keywords?: string[]
}

interface ResearchArea {
  id: string
  name: string
  description: string
  keywords: string[]
}

const researchAreas: ResearchArea[] = [
  {
    id: 'ai-ed',
    name: 'AI in Education',
    description: 'Applications of artificial intelligence and machine learning in educational contexts',
    keywords: [
      'Artificial Intelligence',
      'Machine Learning',
      'LLMs',
      'Natural Language Processing',
      'Educational Data Mining',
      'Text Analysis'
    ]
  },
  {
    id: 'math-ed',
    name: 'Mathematics Education',
    description: 'Research on teaching and learning mathematics',
    keywords: [
      'Mathematics Education',
      'Geometry Education',
      'Calculus Education',
      'Teacher Education',
      'Student Understanding',
      'Pedagogical Content Knowledge'
    ]
  },
  {
    id: 'assessment',
    name: 'Educational Assessment',
    description: 'Methods and tools for evaluating learning and teaching',
    keywords: [
      'Assessment Development',
      'Educational Measurement',
      'Learning Assessment',
      'Student Learning Outcomes',
      'Course Assessment'
    ]
  },
  {
    id: 'teaching-practice',
    name: 'Teaching Practice',
    description: 'Research on instructional methods and teacher development',
    keywords: [
      'Teaching Practice',
      'Professional Development',
      'Pedagogical Tensions',
      'Course Design',
      'Faculty Development',
      'Instructional Decision Making'
    ]
  }
]

function getResearchAreas(keywords: string[]): string[] {
  const areas = new Set<string>()
  
  keywords?.forEach(keyword => {
    researchAreas.forEach(area => {
      if (area.keywords.includes(keyword)) {
        areas.add(area.name)
      }
    })
  })
  
  return Array.from(areas)
}

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

function PublicationEntry({ publication, type }: { publication: Publication, type: string }) {
  const borderColors = {
    journal: 'border-blue-500',
    conference: 'border-green-500',
    talk: 'border-yellow-500',
    poster: 'border-pink-500'
  }

  const areas = publication.keywords ? getResearchAreas(publication.keywords) : []
  
  return (
    <div className={`border-l-4 ${borderColors[type as keyof typeof borderColors]} pl-4 py-2`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium mb-1">{cleanLatexFormatting(publication.title)}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {cleanAuthorNames(publication.authors)}
          </p>
          
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {publication.journal && (
              <span className="italic">{cleanLatexFormatting(publication.journal)}</span>
            )}
            {publication.venue && (
              <span className="italic">{cleanLatexFormatting(publication.venue)}</span>
            )}
            {publication.volume && (
              <span>, {publication.volume}</span>
            )}
            {publication.location && (
              <span>, {publication.location}</span>
            )}
          </div>
          
          {publication.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {publication.description}
            </p>
          )}
          
          {publication.doi && (
            <a 
              href={publication.doi}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-1 inline-block"
            >
              DOI
            </a>
          )}
        </div>
        <div className="text-right ml-4">
          <p className="text-sm text-gray-500">
            {publication.date || publication.year}
          </p>
          {publication.status && (
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
              {formatStatus(publication.status)}
            </span>
          )}
        </div>
      </div>
      
      {publication.award && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
          🏆 {publication.award}
        </p>
      )}

      {/* Research Areas */}
      {areas.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {areas.map((area, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 
                       text-blue-800 dark:text-blue-200"
            >
              {area}
            </span>
          ))}
        </div>
      )}
      
      {/* Keywords */}
      {publication.keywords && publication.keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {publication.keywords.map((keyword, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 
                       text-gray-600 dark:text-gray-300"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default async function Research() {
  try {
    const dataPath = path.join(process.cwd(), 'src/data/cv/publications_and_presentations.json')
    const data = await fs.readFile(dataPath, 'utf8')
    const publications = JSON.parse(data)

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Research</h1>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Journal Publications</h2>
          <div className="space-y-6">
            {publications.peer_reviewed_journals.map((pub: Publication, index: number) => (
              <PublicationEntry 
                key={index}
                publication={pub}
                type="journal"
              />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Conference Proceedings</h2>
          <div className="space-y-6">
            {publications.conference_proceedings.map((pub: Publication, index: number) => (
              <PublicationEntry 
                key={index}
                publication={pub}
                type="conference"
              />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Conference Presentations</h2>
          <div className="space-y-6">
            {publications.presentations.conference_talks.map((talk: Publication, index: number) => (
              <PublicationEntry 
                key={index}
                publication={talk}
                type="talk"
              />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Posters</h2>
          <div className="space-y-6">
            {publications.presentations.posters.map((poster: Publication, index: number) => (
              <PublicationEntry 
                key={index}
                publication={poster}
                type="poster"
              />
            ))}
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error('Error loading research data:', error)
    return (
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Research</h1>
        <p className="text-red-600">Error loading research data. Please try again later.</p>
      </div>
    )
  }
} 