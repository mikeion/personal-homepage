import Link from 'next/link'

export default function Consulting() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Consulting Services</h1>

      {/* Overview Section */}
      <section className="mb-16">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          I provide expert consulting services at the intersection of education, artificial intelligence, and data science. 
          With extensive experience in both academic and industry settings, I help organizations leverage AI and data-driven approaches 
          to enhance educational outcomes.
        </p>
      </section>

      {/* Areas of Expertise */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Areas of Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3">AI in Education</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Large Language Model Implementation</li>
              <li>• AI-Powered Learning Tools Development</li>
              <li>• Educational Chatbot Design</li>
              <li>• Automated Assessment Systems</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3">Data Science & Analytics</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Educational Data Analysis</li>
              <li>• Statistical Modeling</li>
              <li>• Survey Design and Analysis</li>
              <li>• Learning Analytics Implementation</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3">Educational Assessment</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Assessment Design</li>
              <li>• Psychometric Analysis</li>
              <li>• Program Evaluation</li>
              <li>• Learning Outcome Measurement</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3">Technology Integration</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• EdTech Implementation Strategy</li>
              <li>• AI Tool Integration</li>
              <li>• Learning Management Systems</li>
              <li>• Educational Software Development</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Services</h2>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3">Strategic Consulting</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Expert guidance on implementing AI and data-driven solutions in educational contexts, 
              from initial planning to full deployment.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3">Technical Implementation</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Hands-on assistance with implementing AI tools, data analysis systems, 
              and educational technology solutions.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3">Training & Development</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Custom workshops and training sessions for teams on AI tools, data analysis, 
              and educational technology.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-blue-50 dark:bg-gray-800 p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Get Started</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Ready to enhance your educational offerings with AI and data-driven solutions? 
          Schedule a consultation to discuss your needs.
        </p>
        <Link 
          href="https://calendly.com/mikeion/15min"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg 
                     hover:bg-blue-700 transition duration-200"
        >
          Schedule a Consultation
        </Link>
      </section>
    </div>
  )
} 