import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Define the route as dynamic to avoid static generation errors
export const dynamic = 'force-dynamic';

// GET /api/publications
// Public route to get all publications
export async function GET() {
  try {
    const publicationsPath = path.join(process.cwd(), 'src/data/publications.json');
    const publicationsJson = await fs.readFile(publicationsPath, 'utf8');
    const publicationsData = JSON.parse(publicationsJson);

    return NextResponse.json(publicationsData);
  } catch (error) {
    console.error('Error loading publications data:', error);
    return NextResponse.json(
      { error: 'Failed to load publications data' }, 
      { status: 500 }
    );
  }
} 