import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Define the route as dynamic to avoid static generation errors
export const dynamic = 'force-dynamic';

// Helper function to normalize author names for comparison
function normalizeAuthorName(name: string): string {
  return name.toLowerCase()
    .replace(/\./g, '') // Remove periods
    .replace(/\s+/g, '') // Remove spaces
    .trim();
}

// GET /api/publications
// Public route to get all publications with author details
export async function GET() {
  try {
    // Read both publications and authors data
    const publicationsPath = path.join(process.cwd(), 'src/data/publications.json');
    const authorsPath = path.join(process.cwd(), 'src/data/authors.json');
    
    const [publicationsJson, authorsJson] = await Promise.all([
      fs.readFile(publicationsPath, 'utf8'),
      fs.readFile(authorsPath, 'utf8')
    ]);
    
    const { publications, grants } = JSON.parse(publicationsJson);
    const { authors } = JSON.parse(authorsJson);

    // Add author details to each publication
    const publicationsWithAuthors = publications.map((pub: any) => {
      // Ensure authors is always an array
      const rawAuthors = Array.isArray(pub.authors) ? pub.authors : [pub.authors];
      
      // Create a set of normalized author names to track uniqueness
      const uniqueNormalizedNames = new Set<string>();
      const uniqueAuthors: string[] = [];
      
      // Process each author
      rawAuthors.forEach((author: string) => {
        if (!author || author.trim() === '') return;
        
        // Normalize the name for comparison
        const normalizedName = normalizeAuthorName(author);
        
        // Only add if we haven't seen this normalized name before
        if (!uniqueNormalizedNames.has(normalizedName)) {
          uniqueNormalizedNames.add(normalizedName);
          uniqueAuthors.push(author.trim());
        }
      });

      // Remove the location field if it matches an author name
      const { location, ...pubWithoutLocation } = pub;

      return {
        ...pubWithoutLocation,
        // Use the deduplicated author list
        authors: uniqueAuthors,
        // Add author details mapping
        authorDetails: authors
      };
    });

    return NextResponse.json({
      publications: publicationsWithAuthors,
      grants
    });
  } catch (error) {
    console.error('Error loading publications data:', error);
    return NextResponse.json(
      { error: 'Failed to load publications data' }, 
      { status: 500 }
    );
  }
} 