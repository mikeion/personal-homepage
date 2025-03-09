import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const educationFilePath = path.join(process.cwd(), 'src/data/cv/education.json');
    
    // Check if file exists
    if (fs.existsSync(educationFilePath)) {
      const fileContent = fs.readFileSync(educationFilePath, 'utf8');
      const educationData = JSON.parse(fileContent);
      
      return NextResponse.json(educationData);
    } else {
      // Return default education info if file doesn't exist
      return NextResponse.json([
        {
          degree: 'Ph.D. in Education',
          institution: 'University of Michigan',
          location: 'Ann Arbor, MI',
          date: '2020'
        },
        {
          degree: 'M.S. in Mathematics',
          institution: 'University of Michigan',
          location: 'Ann Arbor, MI',
          date: '2016'
        }
      ]);
    }
  } catch (error) {
    console.error('Error reading education information:', error);
    return NextResponse.json(
      { error: 'Failed to fetch education information' },
      { status: 500 }
    );
  }
} 