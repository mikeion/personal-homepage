/**
 * Author Merge Utility
 * 
 * Merges two author records, preserving all publication connections.
 * Usage: node scripts/merge-authors.js <primaryId> <secondaryId>
 * 
 * This will:
 * 1. Move all publication connections from secondaryId to primaryId
 * 2. Delete the secondaryId author record
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function mergeAuthors(primaryId, secondaryId) {
  console.log(`Starting merge of author ${secondaryId} into ${primaryId}...`);
  
  try {
    // Validate both authors exist
    const [primaryAuthor, secondaryAuthor] = await Promise.all([
      prisma.author.findUnique({ where: { id: primaryId } }),
      prisma.author.findUnique({ where: { id: secondaryId } })
    ]);
    
    if (!primaryAuthor) {
      throw new Error(`Primary author with ID ${primaryId} not found`);
    }
    
    if (!secondaryAuthor) {
      throw new Error(`Secondary author with ID ${secondaryId} not found`);
    }
    
    console.log(`Merging: "${secondaryAuthor.firstName} ${secondaryAuthor.middleName || ''} ${secondaryAuthor.lastName}"`);
    console.log(`Into: "${primaryAuthor.firstName} ${primaryAuthor.middleName || ''} ${primaryAuthor.lastName}"`);
    
    // Get all publications linked to the secondary author
    const publicationAuthors = await prisma.publicationAuthor.findMany({
      where: { authorId: secondaryId },
      include: { publication: true }
    });
    
    console.log(`Found ${publicationAuthors.length} publication connections to transfer`);
    
    // Check for any potential conflicts (same publication already linked to primary)
    const conflicts = [];
    for (const pa of publicationAuthors) {
      const existing = await prisma.publicationAuthor.findFirst({
        where: {
          publicationId: pa.publicationId,
          authorId: primaryId
        }
      });
      
      if (existing) {
        conflicts.push({
          publicationId: pa.publicationId,
          publication: pa.publication
        });
      }
    }
    
    if (conflicts.length > 0) {
      console.log(`\nWARNING: Found ${conflicts.length} publications already connected to both authors:`);
      conflicts.forEach((conflict, i) => {
        console.log(`${i + 1}. ${conflict.publication.title} (ID: ${conflict.publicationId})`);
      });
      
      console.log('\nThese connections will be kept with the primary author only.');
    }
    
    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get the publications that need new connections
      const nonConflictConnections = publicationAuthors.filter(pa => 
        !conflicts.some(c => c.publicationId === pa.publicationId)
      );
      
      console.log(`Creating ${nonConflictConnections.length} new connections...`);
      
      // Create new connections to primary author
      for (const pa of nonConflictConnections) {
        await tx.publicationAuthor.create({
          data: {
            authorId: primaryId,
            publicationId: pa.publicationId,
            position: pa.position,
            isCorresponding: pa.isCorresponding,
            equalContribution: pa.equalContribution
          }
        });
      }
      
      // Delete all connections to secondary author
      await tx.publicationAuthor.deleteMany({
        where: { authorId: secondaryId }
      });
      
      // Delete the secondary author
      await tx.author.delete({
        where: { id: secondaryId }
      });
      
      return { 
        transferred: nonConflictConnections.length, 
        conflicts: conflicts.length 
      };
    });
    
    console.log('\nMerge completed successfully!');
    console.log(`- Transferred ${result.transferred} publication connections`);
    console.log(`- Handled ${result.conflicts} conflicting connections`);
    console.log(`- Deleted author ID ${secondaryId}`);
    
  } catch (error) {
    console.error('Merge failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Usage: node scripts/merge-authors.js <primaryId> <secondaryId>');
  process.exit(1);
}

// Execute the merge
mergeAuthors(args[0], args[1]); 