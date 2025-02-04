interface QuickLink {
  title: string
  description: string
  href: string
  icon?: string
}

const links: QuickLink[] = [
  {
    title: 'Research',
    description: 'View my academic publications and research interests',
    href: '/research'
  },
  {
    title: 'Teaching',
    description: 'Explore my teaching philosophy and courses',
    href: '/teaching'
  },
  {
    title: 'Programming',
    description: 'Check out my programming projects and contributions',
    href: '/programming'
  },
  {
    title: 'Writing',
    description: 'Read my latest articles and blog posts',
    href: '/writing'
  }
]

export default function QuickLinks() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{link.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {link.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
} 