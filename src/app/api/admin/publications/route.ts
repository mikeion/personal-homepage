import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';

// Helper to check admin authentication
async function checkAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    return false;
  }
  
  return true;
}

// GET /api/admin/publications
// Get all publications (admin view with more details)
export async function GET(request: Request) {
  const isAuthenticated = await checkAuth();
  
  if (!isAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const publications = await prisma.publication.findMany({
      include: {
        keywords: true,
        areas: true
      },
      orderBy: {
        updatedAt: 'desc'
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

// POST /api/admin/publications
// Create a new publication
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
    
    // Extract keywords and areas to handle the relationships
    const { keywords, areas, ...publicationData } = data;
    
    // Create the publication with connected keywords and areas
    const publication = await prisma.publication.create({
      data: {
        ...publicationData,
        keywords: {
          connectOrCreate: keywords.map((keyword: string) => ({
            where: { name: keyword },
            create: { name: keyword }
          }))
        },
        areas: {
          connectOrCreate: areas.map((area: { name: string, description: string }) => ({
            where: { name: area.name },
            create: { 
              name: area.name,
              description: area.description || '' 
            }
          }))
        }
      },
      include: {
        keywords: true,
        areas: true
      }
    });
    
    return NextResponse.json(publication);
  } catch (error) {
    console.error('Error creating publication:', error);
    return NextResponse.json(
      { error: 'Failed to create publication' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/publications/:id
// Update an existing publication
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
    const { id, keywords, areas, ...publicationData } = data;
    
    // First disconnect all existing relationships
    await prisma.publication.update({
      where: { id },
      data: {
        keywords: {
          set: []
        },
        areas: {
          set: []
        }
      }
    });
    
    // Then update with new data and relationships
    const publication = await prisma.publication.update({
      where: { id },
      data: {
        ...publicationData,
        keywords: {
          connectOrCreate: keywords.map((keyword: string) => ({
            where: { name: keyword },
            create: { name: keyword }
          }))
        },
        areas: {
          connectOrCreate: areas.map((area: { name: string, description: string }) => ({
            where: { name: area.name },
            create: { 
              name: area.name,
              description: area.description || '' 
            }
          }))
        }
      },
      include: {
        keywords: true,
        areas: true
      }
    });
    
    return NextResponse.json(publication);
  } catch (error) {
    console.error('Error updating publication:', error);
    return NextResponse.json(
      { error: 'Failed to update publication' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/publications/:id
// Delete a publication
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
        { error: 'Publication ID is required' },
        { status: 400 }
      );
    }
    
    // Delete publication
    await prisma.publication.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting publication:', error);
    return NextResponse.json(
      { error: 'Failed to delete publication' },
      { status: 500 }
    );
  }
} 