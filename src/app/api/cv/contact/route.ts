import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const contactFilePath = path.join(process.cwd(), 'src/data/cv/contact.json');
    
    // Check if file exists
    if (fs.existsSync(contactFilePath)) {
      const fileContent = fs.readFileSync(contactFilePath, 'utf8');
      const contactData = JSON.parse(fileContent);
      
      return NextResponse.json(contactData);
    } else {
      // Return default contact info if file doesn't exist
      return NextResponse.json({
        name: 'Mike Ion',
        title: 'Postdoctoral Fellow',
        institution: 'University of Michigan School of Information',
        email: 'mikeion@umich.edu',
        website: 'https://mikeion.com',
        address: 'Ann Arbor, MI'
      });
    }
  } catch (error) {
    console.error('Error reading contact information:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact information' },
      { status: 500 }
    );
  }
} 