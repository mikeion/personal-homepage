/**
 * Author Delete Utility
 * 
 * Safely deletes an author record after confirming it's not linked to any publications.
 * Usage: node scripts/delete-author.js <authorId>
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function deleteAuthor(authorId) {
  console.log(`Checking author ${authorId}...`);
  
  try {
    // Validate author exists
    const author = await prisma.author.findUnique({ 
      where: { id: authorId },
      include: {
        publications: true
      }
    });
    
    if (!author) {
      throw new Error(`Author with ID ${authorId} not found`);
    }
    
    const fullName = `${author.firstName} ${author.middleName || ''} ${author.lastName}`.trim();
    console.log(`Found author: "${fullName}"`);
    
    // Check if author has publications
    if (author.publications.length > 0) {
      console.log(`WARNING: This author is linked to ${author.publications.length} publications.`);
      console.log('These links will be deleted along with the author.');
      
      // List the publications
      console.log('\nLinked publications:');
      for (let i = 0; i < author.publications.length; i++) {
        const pa = author.publications[i];
        const pub = await prisma.publication.findUnique({
          where: { id: pa.publicationId }
        });
        console.log(`${i + 1}. ${pub.title}`);
      }
      
      // Confirm deletion
      const answer = await askQuestion('\nAre you sure you want to delete this author and all publication links? (yes/no): ');
      
      if (answer.toLowerCase() !== 'yes') {
        console.log('Operation cancelled.');
        return;
      }
    }
    
    // Delete all publication links first
    const deletedLinks = await prisma.publicationAuthor.deleteMany({
      where: { authorId }
    });
    
    // Delete the author
    await prisma.author.delete({
      where: { id: authorId }
    });
    
    console.log(`\nAuthor "${fullName}" has been deleted successfully.`);
    console.log(`Removed ${deletedLinks.count} publication links.`);
    
  } catch (error) {
    console.error('Delete operation failed:', error);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

// Helper function for prompts
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length !== 1) {
  console.log('Usage: node scripts/delete-author.js <authorId>');
  process.exit(1);
}

// Execute the delete operation
deleteAuthor(args[0]); 