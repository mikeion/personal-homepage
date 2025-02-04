import type { LayoutProps } from '@/types'
import Header from './Header'
import Footer from './Footer'

export default function MainLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
} 