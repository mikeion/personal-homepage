interface WorkItem {
  title: string
  description: string
  link: string
  category: 'research' | 'programming' | 'teaching'
}

const featuredWork: WorkItem[] = [
  {
    title: "Your Latest Research Paper",
    description: "Brief description of your latest academic work",
    link: "/research/paper-name",
    category: "research"
  },
  // Add more featured items
]

export default function FeaturedWork() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredWork.map((work, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <span className="text-sm text-blue-600 dark:text-blue-400 uppercase">
                {work.category}
              </span>
              <h3 className="text-xl font-semibold mt-2">{work.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{work.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 