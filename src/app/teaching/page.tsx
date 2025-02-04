import { promises as fs } from 'fs'
import path from 'path'

interface TeachingPosition {
  institution: string
  role: string
  courses: Course[]
  description?: string
  responsibilities?: string[]
}

interface Course {
  name: string
  code?: string
  date: string
  url?: string
  description?: string
}

interface MenteeGroup {
  type: 'Graduate' | 'Undergraduate'
  students: Mentee[]
}

interface Mentee {
  name: string
  period: string
}

interface TeachingData {
  positions: TeachingPosition[]
  mentorship: MenteeGroup[]
}

function TeachingPosition({ position }: { position: TeachingPosition }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">{position.institution}</h3>
      <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">{position.role}</h4>
      
      {/* Courses */}
      <div className="space-y-4 mb-4">
        {position.courses.map((course, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex justify-between items-start">
              <div>
                {course.url ? (
                  <a 
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {course.name}
                  </a>
                ) : (
                  <span className="font-medium">{course.name}</span>
                )}
                {course.code && (
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    ({course.code})
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {course.date}
              </span>
            </div>
            {course.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {course.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Description and Responsibilities */}
      {position.description && (
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {position.description}
        </p>
      )}
      {position.responsibilities && (
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
          {position.responsibilities.map((resp, index) => (
            <li key={index}>{resp}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

function MentorshipSection({ groups }: { groups: MenteeGroup[] }) {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6">Mentorship</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {groups.map((group, index) => (
          <div key={index}>
            <h3 className="text-xl font-semibold mb-4">{group.type} Students</h3>
            <div className="space-y-2">
              {group.students.map((student, idx) => (
                <div 
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700"
                >
                  <span>{student.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {student.period}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default async function Teaching() {
  const teachingPath = path.join(process.cwd(), 'src/data/cv/teaching.json')
  
  try {
    const teachingJson = await fs.readFile(teachingPath, 'utf8')
    const teachingData: TeachingData = JSON.parse(teachingJson)

    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Teaching</h1>
        
        {/* Teaching Experience */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Teaching Experience</h2>
          {teachingData.positions.map((position, index) => (
            <TeachingPosition key={index} position={position} />
          ))}
        </section>

        {/* Mentorship */}
        <MentorshipSection groups={teachingData.mentorship} />
      </div>
    )
  } catch (error) {
    console.error('Error loading teaching data:', error)
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Teaching</h1>
        <p className="text-red-600">Error loading teaching data. Please try again later.</p>
      </div>
    )
  }
} 