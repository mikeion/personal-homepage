'use client'

import { useState } from 'react'
import { CVData } from '@/types/cv'

interface Props {
  data: CVData
  onChange: (data: CVData) => void
}

export function CVEditor({ data, onChange }: Props) {
  const [activeSection, setActiveSection] = useState<keyof CVData>('contact')

  const sections: Array<{key: keyof CVData; label: string}> = [
    { key: 'contact', label: 'Contact Information' },
    { key: 'education', label: 'Education' },
    { key: 'publications', label: 'Publications' },
    { key: 'presentations', label: 'Presentations' },
    { key: 'grants', label: 'Grants' },
    { key: 'teaching', label: 'Teaching' },
    { key: 'service', label: 'Service' },
    { key: 'awards', label: 'Awards' }
  ]

  const handleUpdate = (section: keyof CVData, value: any) => {
    onChange({
      ...data,
      [section]: value
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {sections.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeSection === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6">
        {/* Add section-specific editors here */}
        {activeSection === 'contact' && (
          <ContactEditor
            data={data.contact}
            onChange={(value) => handleUpdate('contact', value)}
          />
        )}
        {/* Add other section editors */}
      </div>
    </div>
  )
}

interface ContactEditorProps {
  data: CVData['contact']
  onChange: (value: CVData['contact']) => void
}

function ContactEditor({ data, onChange }: ContactEditorProps) {
  const handleChange = (field: keyof CVData['contact'], value: string) => {
    onChange({
      ...data,
      [field]: value
    })
  }

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([field, value]) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(field as keyof CVData['contact'], e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      ))}
    </div>
  )
} 