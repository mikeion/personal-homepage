import Image from 'next/image'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

const ResearchInterest = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 hover:scale-105 transition-transform">
    <p className="text-gray-800 dark:text-gray-200">{children}</p>
  </div>
)

const SocialLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </a>
)

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 relative">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3 relative">
            <div className="relative w-64 h-64 mx-auto">
              <img
                src="/images/bio_pic.jpeg"
                alt="Mike Ion"
                className="absolute inset-0 w-full h-full rounded-full object-cover shadow-2xl"
              />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-30"></div>
            </div>
          </div>
          
          <div className="w-full md:w-2/3 text-center md:text-left">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Dr. Mike Ion
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Postdoctoral Fellow in AI and Education
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              University of Michigan
            </p>
          </div>
        </div>
      </section>

      {/* Research Interests Grid */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Research Interests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResearchInterest>
            🤖 AI in Education & Learning Analytics
          </ResearchInterest>
          <ResearchInterest>
            📐 Mathematics Education & Teacher Development
          </ResearchInterest>
          <ResearchInterest>
            🔤 Natural Language Processing & Text Analysis
          </ResearchInterest>
          <ResearchInterest>
            🌐 Learning at Scale & Online Communities
          </ResearchInterest>
        </div>
      </section>

      {/* Background Section with Animation */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Background</h2>
        <div className="prose dark:prose-invert max-w-none space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transform hover:-translate-y-1 transition-transform">
            <p className="text-lg">
              I recently completed my Ph.D. in Mathematics Education at the University of Michigan. 
              My academic journey began with bachelor's and master's degrees in mathematics from 
              California Polytechnic State University, San Luis Obispo.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transform hover:-translate-y-1 transition-transform">
            <p className="text-lg">
              My dissertation, <span className="italic">"Beyond the Classroom: Exploring Mathematics 
              Engagement in Online Communities with Natural Language Processing,"</span> investigates 
              online mathematics learning in chat-based platforms. I created and analyzed MathConverse, 
              a novel dataset of 200,000 structured conversations from tutors and students working 
              together on mathematics problems.
            </p>
          </div>
        </div>
      </section>

      {/* Teaching Experience */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Teaching Experience</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <p className="text-lg mb-6">
            With over 15 years of teaching experience, I've had the privilege of working with 
            students across various contexts and levels:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">University Teaching</h3>
              <p>Mathematics at Cal Poly SLO & Statistics at UMich</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">International</h3>
              <p>Teaching experience in Hong Kong</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Secondary Education</h3>
              <p>Middle and high school in Botswana</p>
            </div>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Connect</h2>
        <div className="flex flex-wrap gap-6">
          <SocialLink 
            href="https://github.com/mikeion"
            icon={FaGithub}
            label="GitHub"
          />
          <SocialLink 
            href="https://www.linkedin.com/in/mikeion"
            icon={FaLinkedin}
            label="LinkedIn"
          />
          <SocialLink 
            href="mailto:mikeion@umich.edu"
            icon={FaEnvelope}
            label="Email"
          />
        </div>
      </section>
    </div>
  )
} 