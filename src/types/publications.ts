export interface Publication {
  id: string
  title: string
  authors: string[]
  description?: string
  abstract?: string
  venue?: string
  year: number | string
  date?: string
  status?: string
  type: string
  doi?: string
  pdfLink?: string
  projectLink?: string
  location?: string
  award?: string
  volume?: string
  pages?: string
  publisher?: string
  
  // Relationships
  keywords?: Keyword[]
  researchAreas?: ResearchArea[]
  
  createdAt?: Date
  updatedAt?: Date
}

export interface Keyword {
  id: string
  name: string
}

export interface ResearchArea {
  id: string
  name: string
  description?: string
} 