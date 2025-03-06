import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper function to check if user is authenticated
async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return false;
  }
  return true;
}

// GET - Fetch all research areas
export async function GET() {
  try {
    // Check authentication
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all research areas
    const researchAreas = await prisma.researchArea.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(researchAreas);
  } catch (error) {
    console.error('Error fetching research areas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch research areas' },
      { status: 500 }
    );
  }
}

// POST - Create a new research area
export async function POST(request: Request) {
  try {
    // Check authentication
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { error: 'Research area name is required' },
        { status: 400 }
      );
    }

    // Check if research area already exists
    const existingArea = await prisma.researchArea.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive', // Case insensitive search
        },
      },
    });

    if (existingArea) {
      return NextResponse.json(
        { error: 'Research area already exists' },
        { status: 400 }
      );
    }

    // Create new research area
    const researchArea = await prisma.researchArea.create({
      data: {
        name: data.name,
        description: data.description || '',
      },
    });

    return NextResponse.json(researchArea, { status: 201 });
  } catch (error) {
    console.error('Error creating research area:', error);
    return NextResponse.json(
      { error: 'Failed to create research area' },
      { status: 500 }
    );
  }
}

// PUT - Update a research area
export async function PUT(request: Request) {
  try {
    // Check authentication
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.id || !data.name) {
      return NextResponse.json(
        { error: 'Research area ID and name are required' },
        { status: 400 }
      );
    }

    // Check if research area exists
    const existingArea = await prisma.researchArea.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!existingArea) {
      return NextResponse.json(
        { error: 'Research area not found' },
        { status: 404 }
      );
    }

    // Check if name is already taken by another research area
    const duplicateArea = await prisma.researchArea.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive',
        },
        id: {
          not: data.id,
        },
      },
    });

    if (duplicateArea) {
      return NextResponse.json(
        { error: 'Another research area with this name already exists' },
        { status: 400 }
      );
    }

    // Update research area
    const researchArea = await prisma.researchArea.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        description: data.description || existingArea.description,
      },
    });

    return NextResponse.json(researchArea);
  } catch (error) {
    console.error('Error updating research area:', error);
    return NextResponse.json(
      { error: 'Failed to update research area' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a research area
export async function DELETE(request: Request) {
  try {
    // Check authentication
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get research area ID from query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Research area ID is required' },
        { status: 400 }
      );
    }

    // Check if research area exists
    const existingArea = await prisma.researchArea.findUnique({
      where: {
        id,
      },
      include: {
        publications: true,
      },
    });

    if (!existingArea) {
      return NextResponse.json(
        { error: 'Research area not found' },
        { status: 404 }
      );
    }

    // Check if research area is used by any publications
    if (existingArea.publications.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete research area that is used by publications',
          publicationCount: existingArea.publications.length
        },
        { status: 400 }
      );
    }

    // Delete research area
    await prisma.researchArea.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting research area:', error);
    return NextResponse.json(
      { error: 'Failed to delete research area' },
      { status: 500 }
    );
  }
} 