'use client'

import { CVData } from '@/types/cv'

interface Props {
  data: CVData
}

export function CVPreview({ data }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Preview</h2>
      <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
} 