import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Define the route as dynamic to avoid static generation errors
export const dynamic = 'force-dynamic';

// GET /api/publications
// Public route to get all publications
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract filter parameters
    const type = searchParams.get('type');
    const area = searchParams.get('area');
    const keyword = searchParams.get('keyword');
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : null;
    
    // Build filter object
    const filter: any = {
      status: 'published', // Only show published publications
      where: {}
    };
    
    // Add filters if provided
    if (type) {
      filter.where.type = type;
    }
    
    if (year) {
      filter.where.year = year;
    }
    
    if (area) {
      filter.where.researchAreas = {
        some: {
          id: area
        }
      };
    }
    
    if (keyword) {
      filter.where.keywords = {
        some: {
          id: keyword
        }
      };
    }
    
    // Fetch publications with related data
    const publications = await prisma.publication.findMany({
      where: filter.where,
      include: {
        keywords: true,
        researchAreas: true
      },
      orderBy: {
        year: 'desc'
      }
    });
    
    return NextResponse.json(publications);
  } catch (error) {
    console.error('Error fetching publications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch publications' },
      { status: 500 }
    );
  }
} 