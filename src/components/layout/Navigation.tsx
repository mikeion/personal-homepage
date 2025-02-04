'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const routes = [
  { path: '/', label: 'Home' },
  { path: '/research', label: 'Research' },
  { path: '/programming', label: 'Programming' },
  { path: '/teaching', label: 'Teaching' },
  { path: '/consulting', label: 'Consulting' },
  { path: '/about', label: 'About' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex gap-6">
      {routes.map((route) => (
        <Link
          key={route.path}
          href={route.path}
          className={clsx(
            'transition-colors hover:text-gray-900 dark:hover:text-gray-100',
            pathname === route.path
              ? 'text-gray-900 dark:text-gray-100'
              : 'text-gray-600 dark:text-gray-400'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
} 