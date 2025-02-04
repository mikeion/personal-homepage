'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { FaBars, FaTimes } from 'react-icons/fa'

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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl md:hidden z-50">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={clsx(
                'block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700',
                pathname === route.path
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300'
              )}
              onClick={() => setIsOpen(false)}
            >
              {route.label}
            </Link>
          ))}
        </div>
      )}

      {/* Desktop menu */}
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
    </div>
  )
} 