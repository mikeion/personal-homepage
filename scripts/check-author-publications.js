/**
 * Check Author Publications
 * 
 * This script checks if an author is linked to any publications
 * and displays those publications for review.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get author ID from command line
const authorId = process.argv[2];

if (!authorId) {
  console.error('Please provide an author ID as a command line argument');
  console.error('Usage: node check-author-publications.js AUTHOR_ID');
  process.exit(1);
}

async function checkAuthor() {
  try {
    // Fetch the author
    const author = await prisma.author.findUnique({
      where: { id: authorId }
    });

    if (!author) {
      console.error(`Author with ID ${authorId} not found`);
      process.exit(1);
    }

    console.log(`=== Author Information ===`);
    console.log(`ID: ${author.id}`);
    console.log(`Name: ${author.firstName || '(empty)'} ${author.middleName || ''} ${author.lastName || '(empty)'}`);
    console.log(`Is You: ${author.isYou}`);
    console.log();

    // Find publications linked to this author
    const publicationAuthors = await prisma.publicationAuthor.findMany({
      where: { authorId: author.id },
      include: {
        publication: true
      }
    });

    if (publicationAuthors.length === 0) {
      console.log(`This author is not linked to any publications.`);
      console.log(`It's safe to delete this author if it's erroneous.`);
    } else {
      console.log(`=== Linked Publications (${publicationAuthors.length}) ===`);
      
      for (const pa of publicationAuthors) {
        const pub = pa.publication;
        console.log(`\nPublication ID: ${pub.id}`);
        console.log(`Title: ${pub.title}`);
        console.log(`Year: ${pub.year}`);
        console.log(`Type: ${pub.type}`);
        console.log(`Author position: ${pa.position}`);
        console.log(`Is corresponding: ${pa.isCorresponding}`);
        console.log(`Equal contribution: ${pa.equalContribution}`);
        
        // Get other authors for this publication
        const otherAuthors = await prisma.publicationAuthor.findMany({
          where: { 
            publicationId: pub.id,
            authorId: { not: author.id }
          },
          include: {
            author: true
          },
          orderBy: { position: 'asc' }
        });
        
        if (otherAuthors.length > 0) {
          console.log(`\nOther authors on this publication:`);
          otherAuthors.forEach(oa => {
            console.log(`- ${oa.author.firstName || '(empty)'} ${oa.author.middleName || ''} ${oa.author.lastName || '(empty)'} (ID: ${oa.author.id})`);
          });
        }
      }
      
      console.log(`\nThis author is linked to ${publicationAuthors.length} publication(s).`);
      console.log(`You should update the author information rather than deleting it.`);
      console.log(`Alternatively, you can merge this author with another author using the author-cleanup-tool.`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAuthor(); 