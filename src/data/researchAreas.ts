export interface ResearchArea {
  id: string
  name: string
  description: string
  keywords: string[]
}

export const researchAreas: ResearchArea[] = [
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

export function getResearchAreas(keywords: string[]): string[] {
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