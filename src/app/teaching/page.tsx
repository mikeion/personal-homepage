'use client';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

// Define interfaces for teaching data types
interface TeachingPosition {
  institution: string;
  role: string;
  courses: Course[];
  description?: string;
  responsibilities?: string[];
}

interface Course {
  name: string;
  code?: string;
  date: string;
  url?: string;
  description?: string;
}

interface MenteeGroup {
  type: 'Graduate' | 'Undergraduate';
  students: Mentee[];
}

interface Mentee {
  name: string;
  period: string;
}

interface TeachingData {
  positions: TeachingPosition[];
  mentorship: MenteeGroup[];
}

// Teaching areas
const teachingAreas = [
  {
    title: "Mathematics",
    description: "Prioritizing conceptual understanding, collaborative problem-solving, and the creation of inclusive learning spaces to make mathematics accessible and engaging for all students."
  },
  {
    title: "Data Science \& Programming",
    description: "Introducing students to computational thinking and data science fundamentals through practical and relevant real-world applications aligned closely with theoretical insights."
  },
  {
    title: "Teacher Education",
    description: "Equipping future educators with pedagogical content knowledge, research-informed practices, and strategies to build equitable classroom environments."
  }
];

// Teaching Philosophy points
const philosophyPoints = [
  "Promoting active, student-centered learning through structured, collaborative explorations rather than passive information transmission.",
  "Creating inclusive educational environments that honor diverse perspectives, learning styles, and cultural backgrounds, drawing on my extensive international and cross-cultural teaching experiences.",
  "Emphasizing metacognitive skills and reflective practices, equipping students to become independent, reflective, and autonomous learners.",
  "Integrating technology thoughtfully to enrich educational experiences without diminishing interpersonal teaching interactions.",
  "Using assessment as an ongoing opportunity for feedback-focused developmental learning rather than solely for summative evaluation."
];

function TeachingPosition({ position }: { position: TeachingPosition }) {
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <h3 className="h4 mb-2">{position.institution}</h3>
        <h4 className="h5 text-muted mb-3">{position.role}</h4>
        
        {/* Courses */}
        <div className="mb-3">
          {position.courses.map((course, index) => (
            <div key={index} className="border-start border-primary ps-3 py-2 mb-2">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  {course.url ? (
                    <a 
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fw-medium text-decoration-none"
                    >
                      {course.name}
                    </a>
                  ) : (
                    <span className="fw-medium">{course.name}</span>
                  )}
                  {course.code && (
                    <span className="text-muted ms-2">
                      ({course.code})
                    </span>
                  )}
                </div>
                <span className="text-muted small">
                  {course.date}
                </span>
              </div>
              {course.description && (
                <p className="text-muted small mt-1">
                  {course.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Description and Responsibilities */}
        {position.description && (
          <p className="text-muted mb-3">
            {position.description}
          </p>
        )}
        {position.responsibilities && (
          <ul className="text-muted">
            {position.responsibilities.map((resp, index) => (
              <li key={index}>{resp}</li>
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  );
}

function MentorshipSection({ groups }: { groups: MenteeGroup[] }) {
  return (
    <div className="mb-5">
      <h2 className="mb-4">Mentorship</h2>
      <Row>
        {groups.map((group, index) => (
          <Col key={index} md={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <h3 className="h4 mb-3">{group.type} Students</h3>
                <div>
                  {group.students.map((student, idx) => (
                    <div 
                      key={idx}
                      className="d-flex justify-content-between align-items-center py-2 border-bottom"
                    >
                      <span>{student.name}</span>
                      <span className="text-muted small">
                        {student.period}
                      </span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default function Teaching() {
  const [teachingData, setTeachingData] = useState<TeachingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch teaching data from API
  useEffect(() => {
    async function fetchTeachingData() {
      try {
        const response = await fetch('/api/teaching');
        if (!response.ok) {
          throw new Error('Failed to fetch teaching data');
        }
        const data = await response.json();
        setTeachingData(data);
      } catch (err) {
        console.error('Error loading teaching data:', err);
        setError('Error loading teaching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchTeachingData();
  }, []);

  return (
    <Container className="py-5">
      <h1 className="mb-3">Teaching</h1>
      
      <p className="mb-5">
        As an educator in mathematics, statistics, and data science, my teaching combines active learning, inclusive classroom practices, and real-world applicable knowledge. Built upon diverse experiences—from classrooms in rural Botswana to programs such as Johns Hopkins University's Center for Talented Youth, Stanford University's Education Program for Gifted Youth, Cal Poly, and global online instruction—I aim each day to support students in developing autonomy, critical thinking skills, and confidence in their own intellectual capacities.
      </p>

      {/* Teaching Areas Section */}
      <h2 className="mb-4">Teaching Areas</h2>
      <Row className="mb-5">
        {teachingAreas.map((area, idx) => (
          <Col md={4} key={idx} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <h3 className="h5">{area.title}</h3>
                <p>{area.description}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Teaching Philosophy */}
      <h2 className="mb-4">Teaching Philosophy</h2>
      <Card className="shadow-sm mb-5">
        <Card.Body>
          <ul className="mb-0">
            {philosophyPoints.map((point, idx) => (
              <li key={idx} className="mb-2">{point}</li>
            ))}
          </ul>
          <div className="mt-3">
            <a 
              href="/Teaching_Philosophy_Statement.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read my full Teaching Philosophy (PDF)
            </a>
          </div>
        </Card.Body>
      </Card>

      {/* Teaching Experience */}
      <h2 className="mb-4">Teaching Experience</h2>
      <p className="mb-4">
        My full teaching experience—including details on previous teaching positions, courses taught, and student mentorship—is available below. Please explore my detailed track record, illustrating a diverse set of experiences across different locations, institutions, and teaching roles.
      </p>

      {/* Display teaching positions and mentorship data */}
      {loading ? (
        <div className="text-center py-4">
          <p>Loading teaching data...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : teachingData ? (
        <>
          {/* Teaching Positions */}
          <div className="mb-5">
            {teachingData.positions.map((position, index) => (
              <TeachingPosition key={index} position={position} />
            ))}
          </div>
          
          {/* Mentorship */}
          {teachingData.mentorship && teachingData.mentorship.length > 0 && (
            <MentorshipSection groups={teachingData.mentorship} />
          )}
        </>
      ) : (
        <div className="alert alert-info">No teaching data available.</div>
      )}
    </Container>
  );
}