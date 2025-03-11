import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Define the route as dynamic to avoid static generation errors
export const dynamic = 'force-dynamic';

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
      // Keep original authors array for reference
      const originalAuthors = Array.isArray(pub.authors) ? pub.authors : [pub.authors];
      
      // Create a Set to track unique authors
      const uniqueAuthors = new Set<string>();
      
      // Process each author string to handle combined authors
      const processedAuthors = originalAuthors.flatMap((authorString: string) => {
        // Split by commas and clean up
        return authorString.split(/,\s*(?:and\s+)?|\s+and\s+/)
          .map(a => a.trim())
          .filter(author => {
            // Only include author if not already seen and not empty
            if (author && !uniqueAuthors.has(author)) {
              uniqueAuthors.add(author);
              return true;
            }
            return false;
          });
      });

      // Remove the location field if it matches an author name
      const { location, ...pubWithoutLocation } = pub;

      return {
        ...pubWithoutLocation,
        // Keep original authors array for reference
        originalAuthors,
        // Update authors array to use deduplicated list
        authors: processedAuthors,
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