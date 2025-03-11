export interface CVData {
  contact: ContactInfo
  education: Education[]
  publications: Publication[]
  presentations: Presentation[]
  grants: Grant[]
  teaching: TeachingExperience[]
  service: ServiceActivity[]
  awards: Award[]
}

export interface ContactInfo {
  name: string
  title: string
  institution: string
  department: string
  address: string
  email: string
  website: string
  github: string
  orcid: string
  phone?: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  date: string
  location: string
  advisor?: string
  committee?: string[]
  thesis_title?: string
  gpa?: number
}

export interface Publication {
  authors: string[]
  title: string
  year: string
  venue: string
  type: 'journal' | 'conference' | 'chapter' | 'preprint' | 'non_peer_reviewed'
  status: 'published' | 'in_review' | 'in_preparation'
  doi?: string
  url?: string
  citation_count: number
  abstract?: string
  keywords: string[]
  pdf_url?: string
  presentation_url?: string
  impact_factor?: number
}

export interface Presentation {
  authors: string[]
  title: string
  date: string
  venue: string
  location: string
  presentation_type: 'talk' | 'poster' | 'keynote' | 'roundtable'
  abstract?: string
  slides_url?: string
  award?: string
}

export interface Grant {
  title: string
  funder: string
  amount: number
  role: string
  status: 'awarded' | 'submitted' | 'in_preparation'
  start_date: string
  end_date: string
  collaborators?: string[]
  grant_number?: string
}

export interface TeachingExperience {
  institution: string
  course_code: string
  course_title: string
  role: string
  semester: string
  year: string
  enrollment?: number
  evaluation_score?: number
  syllabus_url?: string
}

export interface ServiceActivity {
  type: 'reviewer' | 'committee' | 'mentoring' | 'other'
  organization: string
  role: string
  start_date: string
  end_date?: string
  description?: string
}

export interface Award {
  title: string
  organization: string
  date: string
  amount?: number
  description?: string
}

// ... rest of the types from our schema ... 