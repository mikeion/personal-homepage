import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cvPath = path.join(process.cwd(), 'public/cv_v1.pdf');
    const cvFile = await fs.readFile(cvPath);

    return new NextResponse(cvFile, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="MikeIon_CV.pdf"'
      }
    });
  } catch (error) {
    console.error('Error loading CV file:', error);
    return NextResponse.json(
      { error: 'Failed to load CV file' },
      { status: 500 }
    );
  }
} 