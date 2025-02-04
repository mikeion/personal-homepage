import Image from 'next/legacy/image'
import Link from 'next/link'
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowRight } from 'react-icons/fa'

const ResearchHighlight = ({ emoji, title, description }: { 
  emoji: string
  title: string
  description: string 
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
    <div className="text-3xl mb-3">{emoji}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
)

const LatestPublication = ({ title, venue, date }: {
  title: string
  venue: string
  date: string
}) => (
  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{date}</p>
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 text-sm">{venue}</p>
  </div>
)

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Bridging AI and Human Learning
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Investigating how we can use large language models to understand the complexities of teaching and learning, 
                while ensuring AI-enhanced education remains authentic and effective.
              </p>
              <div className="flex gap-4">
                <Link 
                  href="/research" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  View Research <FaArrowRight />
                </Link>
                <Link 
                  href="/about"
                  className="border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  About Me
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <img
                  src="/images/headshot.jpg"
                  alt="Mike Ion"
                  className="absolute inset-0 w-full h-full rounded-2xl object-cover shadow-2xl"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Highlights */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Research Focus Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ResearchHighlight
              emoji="🔄"
              title="AI Learning Design"
              description="Balancing simulation fidelity with learning effectiveness in AI-based educational environments"
            />
            <ResearchHighlight
              emoji="🎯"
              title="Learning Effectiveness"
              description="Measuring how different teaching strategies affect learning progress in AI-enhanced environments"
            />
            <ResearchHighlight
              emoji="🧠"
              title="Teaching Practice"
              description="Understanding the specialized knowledge needed for effective instruction in the age of AI"
            />
            <ResearchHighlight
              emoji="🔍"
              title="Educational AI"
              description="Developing frameworks to evaluate and improve AI-based educational interactions"
            />
          </div>
        </div>
      </section>

      {/* Latest Publications */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Latest Work</h2>
            <Link 
              href="/research" 
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
            >
              View All <FaArrowRight className="text-sm" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LatestPublication
              title="Teaching and Learning in the Age of Generative AI"
              venue="For the Learning of Mathematics"
              date="2024"
            />
            <LatestPublication
              title="Text-as-Data in Mathematics Education"
              venue="AMS Special Session on SoTL"
              date="Jan 2025"
            />
            <LatestPublication
              title="Teaching Geometry for Secondary Teachers"
              venue="International Journal of Research in Undergraduate Mathematics Education"
              date="2023"
            />
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Let's Connect</h2>
          <div className="flex justify-center gap-8">
            <a 
              href="https://github.com/mikeion"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FaGithub className="text-2xl" />
              <span>GitHub</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/mikeion"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FaLinkedin className="text-2xl" />
              <span>LinkedIn</span>
            </a>
            <a 
              href="mailto:mikeion@umich.edu"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FaEnvelope className="text-2xl" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
