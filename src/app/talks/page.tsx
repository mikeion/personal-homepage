'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaCalendar, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

// Define the Talk interface
interface Talk {
  id: number;
  title: string;
  event: string;
  date: string;
  location: string;
  description: string;
}

export default function Talks() {
  // Sample talks data - you can replace with real data later
  const upcomingTalks: Talk[] = [
    {
      id: 1,
      title: "Text-as-Data in Mathematics Education: Harnessing LLMs to Analyze Student Conversations at Scale",
      event: "AMS Special Session on SoTL",
      date: "January 10, 2025",
      location: "Seattle, WA",
      description: "This talk explores how large language models can be used to analyze student mathematical discourse at scale, providing insights that were previously difficult to obtain through manual analysis."
    }
  ];

  const pastTalks: Talk[] = [
    {
      id: 2,
      title: "Beyond the Classroom: Exploring Mathematics Engagement in Online Communities",
      event: "Mathematics Education Research Seminar",
      date: "November 15, 2024",
      location: "University of Michigan",
      description: "Presented findings from my dissertation research on how Natural Language Processing techniques can help us understand mathematics learning in online communities."
    },
    {
      id: 3,
      title: "AI-Ready Testbeds for Higher Education",
      event: "Learning Analytics Workshop",
      date: "October 5, 2024",
      location: "Virtual",
      description: "Discussed approaches for creating and evaluating AI systems in higher education, with a focus on ethical considerations and empirical validation."
    }
  ];

  const renderTalkCard = (talk: Talk) => (
    <Card key={talk.id} className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title className="text-xl font-bold">{talk.title}</Card.Title>
        <div className="my-2 text-blue-600 dark:text-blue-400 font-medium">
          <div className="flex items-center mb-1">
            <FaCalendar className="mr-2" /> {talk.date}
          </div>
          <div className="flex items-center mb-1">
            <FaUsers className="mr-2" /> {talk.event}
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2" /> {talk.location}
          </div>
        </div>
        <Card.Text className="mt-2">
          {talk.description}
        </Card.Text>
      </Card.Body>
    </Card>
  );

  return (
    <Container className="py-5">
      <h1 className="mb-5">Recent & Upcoming Talks</h1>
      
      <section className="mb-5">
        <h2 className="mb-4 text-2xl font-bold">Upcoming Talks</h2>
        {upcomingTalks.length > 0 ? (
          upcomingTalks.map(renderTalkCard)
        ) : (
          <p className="text-gray-500">No upcoming talks scheduled at this time.</p>
        )}
      </section>
      
      <section>
        <h2 className="mb-4 text-2xl font-bold">Past Talks</h2>
        {pastTalks.map(renderTalkCard)}
      </section>
    </Container>
  );
} 