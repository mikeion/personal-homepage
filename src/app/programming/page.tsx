import Link from 'next/link'
import Image from 'next/image'

interface Project {
  title: string
  description: string
  techStack: string[]
  link?: string
  githubLink?: string
  image?: string
  featured?: boolean
  status: 'In Development' | 'Live' | 'Research'
}

const projects: Project[] = [
  {
    title: "MotionMerchant",
    description: "A web application that transforms static product photos into engaging videos using AI. Built with a modern tech stack focusing on performance and scalability.",
    techStack: [
      "Next.js",
      "TypeScript",
      "TailwindCSS",
      "Python",
      "FastAPI",
      "AWS Lambda",
      "OpenAI API"
    ],
    link: "https://motionmerchant.com",
    status: "In Development",
    featured: true
  },
  {
    title: "Simulated Teaching & Learning at Scale",
    description: "Research framework for analyzing LLM-based student simulations in mathematics tutoring, focusing on simulation fidelity and teaching effectiveness.",
    techStack: [
      "Python",
      "PyTorch",
      "Streamlit",
      "Large Language Models",
      "Natural Language Processing"
    ],
    githubLink: "https://github.com/mikeion/simulated-teaching-learning-at-scale",
    status: "Research",
    featured: true
  },
  {
    title: "AI Podcast Insights Dashboard",
    description: "Application that generates personalized podcast summaries using AI, helping users discover and digest podcast content efficiently.",
    techStack: [
      "Python",
      "Streamlit",
      "OpenAI API",
      "Modal",
      "Speech-to-Text",
      "Natural Language Processing"
    ],
    link: "https://ai-podcast-insights.streamlit.app/",
    githubLink: "https://github.com/mikeion/AI-podcast-insights-application",
    status: "Live"
  },
  {
    title: "Minesweeper Game",
    description: "Classic Minesweeper implementation with multiple difficulty levels and modern UI.",
    techStack: [
      "JavaScript",
      "HTML5",
      "CSS3",
      "DOM Manipulation"
    ],
    link: "https://minesweeper.michaelion.repl.co/",
    githubLink: "https://github.com/mikeion/Minesweeper",
    status: "Live"
  }
]

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden
                    ${project.featured ? 'md:col-span-2' : ''}`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold">{project.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${project.status === 'Live' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              project.status === 'In Development' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
            {project.status}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {project.description}
        </p>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Tech Stack
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 
                         text-gray-700 dark:text-gray-300 rounded text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          {project.link && (
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Project →
            </Link>
          )}
          {project.githubLink && (
            <Link
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:underline"
            >
              GitHub Repository →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Programming() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Programming Projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>

      <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Technical Skills Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Languages</h3>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li>Python</li>
              <li>TypeScript/JavaScript</li>
              <li>HTML/CSS</li>
              <li>SQL</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Frameworks & Libraries</h3>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li>React/Next.js</li>
              <li>FastAPI</li>
              <li>PyTorch</li>
              <li>TailwindCSS</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Tools & Platforms</h3>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li>AWS</li>
              <li>Git</li>
              <li>Docker</li>
              <li>OpenAI API</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
} 