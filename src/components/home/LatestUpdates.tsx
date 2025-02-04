interface Update {
  date: string
  title: string
  description: string
  type: 'research' | 'teaching' | 'programming' | 'writing'
}

const updates: Update[] = [
  {
    date: '2024-03-01',
    title: 'Latest Research Publication',
    description: 'Brief description of your latest research work or publication.',
    type: 'research'
  },
  {
    date: '2024-02-15',
    title: 'New Programming Project',
    description: 'Description of your latest programming project or contribution.',
    type: 'programming'
  },
  // Add more updates as needed
]

export default function LatestUpdates() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Latest Updates</h2>
        <div className="space-y-6">
          {updates.map((update, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(update.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <h3 className="text-xl font-semibold mt-1">{update.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {update.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 