'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { FaBars, FaTimes, FaChevronDown, FaExternalLinkAlt } from 'react-icons/fa'

// Reorganized routes with categorized dropdowns
const routes = [
  { path: '/', label: 'Home' },
  { 
    path: '/academics', 
    label: 'Academics',
    dropdown: [
      { path: '/research', label: 'Research' },
      { path: '/publications', label: 'Publications' },
      { path: '/teaching', label: 'Teaching' },
      { path: '/cv.pdf', label: 'CV', external: true },
      { path: '/talks', label: 'Recent Talks' }
    ] 
  },
  { 
    path: '/practice', 
    label: 'Professional Practice',
    dropdown: [
      { path: '/programming', label: 'Programming' },
      { path: 'https://mikeion.github.io/Notes/', label: 'Writing & Notes', external: true },
      { path: '/consulting', label: 'Consulting' }
    ] 
  },
  { path: '/about', label: 'About' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const toggleMobileDropdown = (path: string) => {
    if (openDropdown === path) {
      setOpenDropdown(null)
    } else {
      setOpenDropdown(path)
    }
  }

  const handleMouseEnter = (path: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setActiveDropdown(path)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 300) // 300ms delay before hiding the dropdown
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const isActiveRoute = (routePath: string) => {
    // Check if current path is in a dropdown of this route
    const route = routes.find(r => r.path === routePath);
    if (route?.dropdown) {
      return route.dropdown.some(item => !item.external && (pathname === item.path || pathname?.startsWith(`${item.path}/`)));
    }
    return pathname === routePath || pathname?.startsWith(`${routePath}/`);
  }

  // Check if any item in a dropdown matches the current path
  const isActiveDropdownItem = (dropdownItems: {path: string, label: string, external?: boolean}[]) => {
    return dropdownItems.some(item => !item.external && (pathname === item.path || pathname?.startsWith(`${item.path}/`)));
  }

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
      <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
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
                {route.dropdown ? (
                  <>
                    <Link
                      href={route.path}
                      className={clsx(
                        'block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700',
                        (isActiveRoute(route.path) || isActiveDropdownItem(route.dropdown))
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-300'
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {route.label}
                    </Link>
                    <button
                      className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                      onClick={() => toggleMobileDropdown(route.path)}
                    >
                      <span className="ml-2">Submenu</span>
                      <FaChevronDown 
                        size={12} 
                        className={`transition-transform ${openDropdown === route.path ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    {openDropdown === route.path && (
                      <div className="ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
                        {route.dropdown.map((item) => (
                          <div key={item.path}>
                            {renderLink(
                              item.path,
                              item.label,
                              clsx(
                                'block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700',
                                !item.external && (pathname === item.path || pathname?.startsWith(`${item.path}/`))
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-gray-600 dark:text-gray-300'
                              ),
                              item.external,
                              () => setIsOpen(false)
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
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
                )}
              </div>
            ))}
          </div>
        )}

        {/* Desktop menu */}
        <nav className="hidden md:flex gap-6">
          {routes.map((route) => (
            <div key={route.path} className="relative">
              {route.dropdown ? (
                <div 
                  className="relative" 
                  onMouseEnter={() => handleMouseEnter(route.path)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center">
                    <Link
                      href={route.path}
                      className={clsx(
                        'transition-colors hover:text-gray-900 dark:hover:text-gray-100 py-2 pr-2',
                        (isActiveRoute(route.path) || isActiveDropdownItem(route.dropdown))
                          ? 'text-gray-900 dark:text-gray-100'
                          : 'text-gray-600 dark:text-gray-400'
                      )}
                    >
                      {route.label}
                    </Link>
                    <button
                      className="p-1 focus:outline-none"
                      onClick={() => setActiveDropdown(activeDropdown === route.path ? null : route.path)}
                      aria-label="Toggle dropdown"
                    >
                      <FaChevronDown size={12} className={`transition-transform ${activeDropdown === route.path ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  {/* Dropdown wrapper with added padding for better hover area */}
                  <div className={`absolute top-full left-0 pt-2 w-48 z-50 ${activeDropdown === route.path ? 'block' : 'hidden'}`}>
                    {/* Actual dropdown content */}
                    <div 
                      className="bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                      onMouseEnter={() => handleMouseEnter(route.path)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {route.dropdown.map((item) => (
                        <div key={item.path}>
                          {renderLink(
                            item.path,
                            item.label,
                            clsx(
                              'block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700',
                              !item.external && (pathname === item.path || pathname?.startsWith(`${item.path}/`))
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-300'
                            ),
                            item.external
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href={route.path}
                  className={clsx(
                    'transition-colors hover:text-gray-900 dark:hover:text-gray-100 py-2 block',
                    pathname === route.path
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  {route.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}