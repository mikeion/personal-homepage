'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { FaBars, FaTimes, FaChevronDown, FaExternalLinkAlt } from 'react-icons/fa'

// Define the route type
interface Route {
  path: string;
  label: string;
  external?: boolean;
}

// Simplified routes structure
const routes: Route[] = [
  { path: '/', label: 'Home' },
  { path: '/teaching', label: 'Teaching' },
  { path: '/research', label: 'Research' },
  { path: '/software-development', label: 'Software Development' },
  { path: '/cv', label: 'CV' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  
  // Render a link based on whether it's external or internal
  const renderLink = (path: string, label: string, className: string, isExternal?: boolean, onClick?: () => void) => {
    if (isExternal) {
      return (
        <a 
          href={path}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
        >
          {label} <FaExternalLinkAlt size={10} className="ml-1 inline-block" />
        </a>
      );
    }
    return (
      <Link 
        href={path}
        className={className}
        onClick={onClick}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="flex justify-between items-center w-full">
      {/* Site Logo/Title */}
      <Link href="/" className="px-4 py-2 text-xl font-bold text-slate-800 dark:text-white bg-white/80 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow transition-shadow">
        Mike Ion
      </Link>

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
              <div key={route.path}>
                {renderLink(
                  route.path,
                  route.label,
                  clsx(
                    'block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700',
                    pathname === route.path || pathname?.startsWith(`${route.path}/`)
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300'
                  ),
                  route.external,
                  () => setIsOpen(false)
                )}
              </div>
            ))}
          </div>
        )}

        {/* Desktop menu */}
        <nav className="hidden md:flex gap-6">
          {routes.map((route) => (
            <div key={route.path} className="relative">
              {renderLink(
                route.path,
                route.label,
                clsx(
                  'transition-colors hover:text-gray-900 dark:hover:text-gray-100 py-2',
                  pathname === route.path || pathname?.startsWith(`${route.path}/`)
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400'
                ),
                route.external
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}