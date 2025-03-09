import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';

// Helper to check admin authentication
async function checkAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || session.user.role !== 'ADMIN') {
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
    // Check if ID parameter is provided to fetch a single publication
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // Fetch a single publication by ID
      const publication = await prisma.publication.findUnique({
        where: { id },
        include: {
          keywords: true,
          researchAreas: true,
          publicationAuthors: {
            include: {
              author: true
            },
            orderBy: {
              position: 'asc'
            }
          }
        }
      });
      
      if (!publication) {
        return NextResponse.json(
          { error: 'Publication not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(publication);
    }
    
    // If no ID is provided, fetch all publications
    const publications = await prisma.publication.findMany({
      include: {
        keywords: true,
        researchAreas: true
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
    // Parse the multipart form data
    const formData = await request.formData();
    
    // Get the file if it exists
    const pdfFile = formData.get('pdfFile') as File | null;
    
    // Get the publication data
    const publicationDataStr = formData.get('publicationData') as string;
    const data = JSON.parse(publicationDataStr);
    
    // Extract relationships to handle properly
    const { keywords, researchAreas, publicationAuthors, ...publicationData } = data;
    
    // Handle file upload if a file was provided
    let pdfFilePath = publicationData.pdfFile;
    
    if (pdfFile && pdfFile.name) {
      // In a real app, you would upload the file to a storage service like AWS S3
      // and store the returned URL. For this example, we'll just simulate storing the file name.
      // Replace this with your actual file upload logic.
      pdfFilePath = `/uploads/publications/${Date.now()}-${pdfFile.name}`;
      
      // Simulating file upload - in a real app, you'd implement actual file storage:
      // await uploadFileToStorage(pdfFile, pdfFilePath);
      
      console.log(`File would be uploaded to: ${pdfFilePath}`);
    }
    
    // Create the publication with all relationships
    const publication = await prisma.publication.create({
      data: {
        ...publicationData,
        pdfFile: pdfFilePath,
        // Add keywords
        keywords: {
          connect: keywords?.map((id: string) => ({ id })) || []
        },
        // Add research areas
        researchAreas: {
          connect: researchAreas?.map((id: string) => ({ id })) || []
        },
        // Add structured authors
        publicationAuthors: {
          create: publicationAuthors?.map((pa: any) => ({
            authorId: pa.authorId,
            position: pa.position,
            isCorresponding: pa.isCorresponding,
            equalContribution: pa.equalContribution
          })) || []
        }
      },
      include: {
        keywords: true,
        researchAreas: true,
        publicationAuthors: {
          include: {
            author: true
          }
        }
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

// PUT /api/admin/publications
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
    // Parse the multipart form data
    const formData = await request.formData();
    
    // Get the file if it exists
    const pdfFile = formData.get('pdfFile') as File | null;
    
    // Get the publication data
    const publicationDataStr = formData.get('publicationData') as string;
    const data = JSON.parse(publicationDataStr);
    
    const { id, keywords, researchAreas, publicationAuthors, ...publicationData } = data;
    
    // Handle file upload if a file was provided
    let pdfFilePath = publicationData.pdfFile;
    
    if (pdfFile && pdfFile.name) {
      // In a real app, you would upload the file to a storage service like AWS S3
      // and store the returned URL. For this example, we'll just simulate storing the file name.
      // Replace this with your actual file upload logic.
      pdfFilePath = `/uploads/publications/${Date.now()}-${pdfFile.name}`;
      
      // Simulating file upload - in a real app, you'd implement actual file storage:
      // await uploadFileToStorage(pdfFile, pdfFilePath);
      
      console.log(`File would be uploaded to: ${pdfFilePath}`);
    }
    
    // First disconnect all existing relationships
    await prisma.publication.update({
      where: { id },
      data: {
        keywords: {
          set: []
        },
        researchAreas: {
          set: []
        },
        publicationAuthors: {
          deleteMany: {} // Delete all existing publication-author relationships
        }
      }
    });
    
    // Then update with the new data and reconnect relationships
    const publication = await prisma.publication.update({
      where: { id },
      data: {
        ...publicationData,
        pdfFile: pdfFilePath,
        keywords: {
          connect: keywords?.map((id: string) => ({ id })) || []
        },
        researchAreas: {
          connect: researchAreas?.map((id: string) => ({ id })) || []
        },
        // Create new publication-author relationships
        publicationAuthors: {
          create: publicationAuthors?.map((pa: any) => ({
            authorId: pa.authorId,
            position: pa.position,
            isCorresponding: pa.isCorresponding,
            equalContribution: pa.equalContribution
          })) || []
        }
      },
      include: {
        keywords: true,
        researchAreas: true,
        publicationAuthors: {
          include: {
            author: true
          }
        }
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