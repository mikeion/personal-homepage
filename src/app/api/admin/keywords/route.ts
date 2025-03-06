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

// GET - Fetch all keywords
export async function GET() {
  try {
    // Check authentication
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all keywords
    const keywords = await prisma.keyword.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(keywords);
  } catch (error) {
    console.error('Error fetching keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}

// POST - Create a new keyword
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
        { error: 'Keyword name is required' },
        { status: 400 }
      );
    }

    // Check if keyword already exists
    const existingKeyword = await prisma.keyword.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive', // Case insensitive search
        },
      },
    });

    if (existingKeyword) {
      return NextResponse.json(
        { error: 'Keyword already exists' },
        { status: 400 }
      );
    }

    // Create new keyword
    const keyword = await prisma.keyword.create({
      data: {
        name: data.name,
      },
    });

    return NextResponse.json(keyword, { status: 201 });
  } catch (error) {
    console.error('Error creating keyword:', error);
    return NextResponse.json(
      { error: 'Failed to create keyword' },
      { status: 500 }
    );
  }
}

// PUT - Update a keyword
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
        { error: 'Keyword ID and name are required' },
        { status: 400 }
      );
    }

    // Check if keyword exists
    const existingKeyword = await prisma.keyword.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!existingKeyword) {
      return NextResponse.json(
        { error: 'Keyword not found' },
        { status: 404 }
      );
    }

    // Check if name is already taken by another keyword
    const duplicateKeyword = await prisma.keyword.findFirst({
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

    if (duplicateKeyword) {
      return NextResponse.json(
        { error: 'Another keyword with this name already exists' },
        { status: 400 }
      );
    }

    // Update keyword
    const keyword = await prisma.keyword.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
      },
    });

    return NextResponse.json(keyword);
  } catch (error) {
    console.error('Error updating keyword:', error);
    return NextResponse.json(
      { error: 'Failed to update keyword' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a keyword
export async function DELETE(request: Request) {
  try {
    // Check authentication
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get keyword ID from query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Keyword ID is required' },
        { status: 400 }
      );
    }

    // Check if keyword exists
    const existingKeyword = await prisma.keyword.findUnique({
      where: {
        id,
      },
      include: {
        publications: true,
      },
    });

    if (!existingKeyword) {
      return NextResponse.json(
        { error: 'Keyword not found' },
        { status: 404 }
      );
    }

    // Check if keyword is used by any publications
    if (existingKeyword.publications.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete keyword that is used by publications',
          publicationCount: existingKeyword.publications.length
        },
        { status: 400 }
      );
    }

    // Delete keyword
    await prisma.keyword.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting keyword:', error);
    return NextResponse.json(
      { error: 'Failed to delete keyword' },
      { status: 500 }
    );
  }
} 