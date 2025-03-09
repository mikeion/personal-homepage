import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';

// Helper function to check authentication
async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return false;
  }
  return true;
}

// GET /api/admin/authors
// Get all authors
export async function GET(request: Request) {
  const isAuthenticated = await checkAuth();
  
  if (!isAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const authors = await prisma.author.findMany({
      orderBy: [
        { isYou: 'desc' },
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    });
    
    return NextResponse.json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    );
  }
}

// POST /api/admin/authors
// Create a new author
export async function POST(request: Request) {
  const isAuthenticated = await checkAuth();
  
  if (!isAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const data = await request.json();
    
    const author = await prisma.author.create({
      data
    });
    
    return NextResponse.json(author);
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json(
      { error: 'Failed to create author' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/authors
// Update an existing author
export async function PUT(request: Request) {
  const isAuthenticated = await checkAuth();
  
  if (!isAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const data = await request.json();
    const { id, ...authorData } = data;
    
    const author = await prisma.author.update({
      where: { id },
      data: authorData
    });
    
    return NextResponse.json(author);
  } catch (error) {
    console.error('Error updating author:', error);
    return NextResponse.json(
      { error: 'Failed to update author' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/authors
// Delete an author
export async function DELETE(request: Request) {
  const isAuthenticated = await checkAuth();
  
  if (!isAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Author ID is required' },
        { status: 400 }
      );
    }
    
    // First check if the author is used in any publications
    const authorPublications = await prisma.publicationAuthor.findMany({
      where: { authorId: id }
    });
    
    // If used, return an error
    if (authorPublications.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete author that is used in publications' },
        { status: 400 }
      );
    }
    
    await prisma.author.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting author:', error);
    return NextResponse.json(
      { error: 'Failed to delete author' },
      { status: 500 }
    );
  }
} 