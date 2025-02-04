'use client'
import { useState } from 'react'
import { CVUploader } from '@/components/cv/CVUploader'
import { CVEditor } from '@/components/cv/CVEditor'
import { CVPreview } from '@/components/cv/CVPreview'
// Removed the import for AIAssistant due to the error
import { CVData } from '@/types/cv'

export default function CVTools() {
  const [cvData, setCVData] = useState<CVData | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Academic CV Tools
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <CVUploader onUpload={setCVData} />
          
          {cvData && (
            <div className="mt-8 space-y-8">
              <CVEditor 
                data={cvData} 
                onChange={setCVData} 
              />
              <CVPreview data={cvData} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 