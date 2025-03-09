import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const teachingPath = path.join(process.cwd(), 'src/data/cv/teaching.json');
    const teachingJson = await fs.readFile(teachingPath, 'utf8');
    const teachingData = JSON.parse(teachingJson);

    return NextResponse.json(teachingData);
  } catch (error) {
    console.error('Error loading teaching data:', error);
    return NextResponse.json(
      { error: 'Failed to load teaching data' }, 
      { status: 500 }
    );
  }
} 