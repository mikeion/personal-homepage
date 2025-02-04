'use client'

import { useState } from 'react'
import { CVData } from '@/types/cv'

interface Props {
  data: CVData
  onSuggest: (data: CVData) => void
}

export function AIAssistant({ data, onSuggest }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const analyzeCVWithAI = async () => {
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const response = await fetch('/api/analyze-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to analyze CV')
      }

      const result = await response.json()
      setSuggestions(result.suggestions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">AI Assistant</h2>
        <button
          onClick={analyzeCVWithAI}
          disabled={isAnalyzing}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium
            transition-colors duration-200
            ${isAnalyzing
              ? 'bg-gray-300 cursor-not-allowed dark:bg-gray-700'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze CV'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 