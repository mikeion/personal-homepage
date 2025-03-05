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
  id: string
  pages?: string
  publisher?: string
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

export function PublicationEntry({ publication, type }: { publication: Publication, type: string }) {
  const borderColors = {
    journal: 'border-blue-500',
    conference: 'border-green-500',
    talk: 'border-yellow-500',
    poster: 'border-pink-500',
    workshop: 'border-orange-500',
    book_chapter: 'border-purple-500'
  }

  return (
    <div className={`border-l-4 ${borderColors[type as keyof typeof borderColors]} pl-4 py-2`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium mb-1">{cleanLatexFormatting(publication.title)}</h3>
          <p className="text-sm text-gray-600">
            {cleanAuthorNames(publication.authors)}
          </p>
          
          <div className="text-sm text-gray-600 mt-1">
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
            <p className="text-sm text-gray-600 mt-1">
              {publication.description}
            </p>
          )}
          
          {publication.doi && (
            <a 
              href={publication.doi}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm hover:underline mt-1 inline-block"
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
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {formatStatus(publication.status)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
} 