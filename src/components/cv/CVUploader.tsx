'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { CVData } from '@/types/cv'

interface Props {
  onUpload: (data: CVData) => void
}

export function CVUploader({ onUpload }: Props) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      try {
        const text = await file.text()
        // Here we'll need to implement the actual CV parsing logic
        // For now, we'll just create a minimal CVData object
        const data: CVData = {
          contact: {
            name: '',
            title: '',
            institution: '',
            department: '',
            address: '',
            email: '',
            website: '',
            github: '',
            orcid: '',
          },
          education: [],
          publications: [],
          presentations: [],
          grants: [],
          teaching: [],
          service: [],
          awards: []
        }
        onUpload(data)
      } catch (error) {
        console.error('Error parsing CV:', error)
      }
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/x-tex': ['.tex'],
      'application/x-tex': ['.tex']
    },
    multiple: false
  })

  return (
    <div 
      {...getRootProps()} 
      className={`
        p-10 border-2 border-dashed rounded-lg text-center cursor-pointer
        transition-colors duration-200
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-300 dark:border-gray-700'
        }
      `}
    >
      <input {...getInputProps()} />
      <p className="text-gray-600 dark:text-gray-400">
        {isDragActive
          ? 'Drop your LaTeX CV here...'
          : 'Drop your LaTeX CV here, or click to select'}
      </p>
    </div>
  )
} 