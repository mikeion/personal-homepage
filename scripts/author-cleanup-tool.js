/**
 * Author Cleanup Tool
 * 
 * This script helps clean up author data issues:
 * 1. Identifies authors with missing or placeholder first names
 * 2. Finds potential duplicate authors
 * 3. Allows updating author information
 * 4. Provides options to merge duplicate authors
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function for prompts
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Calculate similarity between two strings
function similarity(s1, s2) {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) {
    return 1.0;
  }
  
  // Calculate Levenshtein distance
  const editDistance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  return (longer.length - editDistance) / longer.length;
}

// Calculate Levenshtein distance
function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  
  // Create matrix
  const d = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  // Initialize first row and column
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  
  // Fill the matrix
  for (let j = 1; j <= n; j++) {
    for (let i = 1; i <= m; i++) {
      if (s1[i - 1] === s2[j - 1]) {
        d[i][j] = d[i - 1][j - 1];
      } else {
        d[i][j] = Math.min(
          d[i - 1][j] + 1,    // deletion
          d[i][j - 1] + 1,    // insertion
          d[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }
  
  return d[m][n];
}

// Find authors with missing or incomplete information
async function findProblematicAuthors() {
  console.log('\n=== Authors with Missing or Incomplete Information ===');
  
  const authors = await prisma.author.findMany({
    orderBy: { lastName: 'asc' }
  });
  
  const problematic = authors.filter(author => 
    author.firstName === '?' ||
    author.firstName.length === 1 ||
    author.firstName.trim() === '' ||
    author.lastName.trim() === ''
  );
  
  if (problematic.length === 0) {
    console.log('No problematic authors found!');
    return problematic;
  }
  
  console.log('The following authors have missing or incomplete information:');
  problematic.forEach((author, index) => {
    console.log(`${index + 1}. ID: ${author.id} - ${author.firstName} ${author.middleName || ''} ${author.lastName}`);
  });
  
  return problematic;
}

// Find potential duplicate authors
async function findPotentialDuplicates() {
  console.log('\n=== Potential Duplicate Authors ===');
  
  const authors = await prisma.author.findMany({
    orderBy: { lastName: 'asc' }
  });
  
  const potentialDuplicates = [];
  
  // Compare each author with every other author
  for (let i = 0; i < authors.length; i++) {
    for (let j = i + 1; j < authors.length; j++) {
      const author1 = authors[i];
      const author2 = authors[j];
      
      // Check if last names are similar
      const lastNameSimilarity = similarity(author1.lastName, author2.lastName);
      
      // Calculate full name similarity
      const name1 = `${author1.firstName} ${author1.middleName || ''} ${author1.lastName}`.trim();
      const name2 = `${author2.firstName} ${author2.middleName || ''} ${author2.lastName}`.trim();
      const fullNameSimilarity = similarity(name1, name2);
      
      // Check for potential duplicates
      if (lastNameSimilarity > 0.8 || fullNameSimilarity > 0.7) {
        potentialDuplicates.push({
          author1,
          author2,
          lastNameSimilarity,
          fullNameSimilarity
        });
      }
    }
  }
  
  if (potentialDuplicates.length === 0) {
    console.log('No potential duplicates found!');
    return potentialDuplicates;
  }
  
  console.log('Found the following potential duplicate authors:');
  potentialDuplicates.forEach((pair, index) => {
    const { author1, author2, lastNameSimilarity, fullNameSimilarity } = pair;
    console.log(`${index + 1}. ${author1.firstName} ${author1.middleName || ''} ${author1.lastName} (ID: ${author1.id})`);
    console.log(`   ${author2.firstName} ${author2.middleName || ''} ${author2.lastName} (ID: ${author2.id})`);
    console.log(`   Last name similarity: ${lastNameSimilarity.toFixed(2)}, Full name similarity: ${fullNameSimilarity.toFixed(2)}`);
  });
  
  return potentialDuplicates;
}

// Update author information
async function updateAuthor(authorId) {
  try {
    const author = await prisma.author.findUnique({
      where: { id: authorId }
    });
    
    if (!author) {
      console.log(`Author with ID ${authorId} not found.`);
      return false;
    }
    
    console.log('\n=== Current Author Information ===');
    console.log(`ID: ${author.id}`);
    console.log(`First Name: ${author.firstName}`);
    console.log(`Middle Name: ${author.middleName || ''}`);
    console.log(`Last Name: ${author.lastName}`);
    console.log(`Is You: ${author.isYou}`);
    
    console.log('\nEnter new information (leave blank to keep current value):');
    
    const newFirstName = await askQuestion(`First Name [${author.firstName}]: `);
    const newMiddleName = await askQuestion(`Middle Name [${author.middleName || ''}]: `);
    const newLastName = await askQuestion(`Last Name [${author.lastName}]: `);
    const newIsYou = await askQuestion(`Is You (yes/no) [${author.isYou ? 'yes' : 'no'}]: `);
    
    const updateData = {};
    if (newFirstName.trim()) updateData.firstName = newFirstName;
    if (newMiddleName.trim() || newMiddleName === '') updateData.middleName = newMiddleName || null;
    if (newLastName.trim()) updateData.lastName = newLastName;
    if (newIsYou.trim()) updateData.isYou = newIsYou.toLowerCase() === 'yes';
    
    if (Object.keys(updateData).length === 0) {
      console.log('No changes made.');
      return false;
    }
    
    const updatedAuthor = await prisma.author.update({
      where: { id: authorId },
      data: updateData
    });
    
    console.log('\n=== Author Updated Successfully ===');
    console.log(`ID: ${updatedAuthor.id}`);
    console.log(`First Name: ${updatedAuthor.firstName}`);
    console.log(`Middle Name: ${updatedAuthor.middleName || ''}`);
    console.log(`Last Name: ${updatedAuthor.lastName}`);
    console.log(`Is You: ${updatedAuthor.isYou}`);
    
    return true;
  } catch (error) {
    console.error('Error updating author:', error);
    return false;
  }
}

// Merge two authors
async function mergeAuthors(primaryId, secondaryId) {
  try {
    const primaryAuthor = await prisma.author.findUnique({
      where: { id: primaryId },
      include: { publications: true }
    });
    
    const secondaryAuthor = await prisma.author.findUnique({
      where: { id: secondaryId },
      include: { publications: true }
    });
    
    if (!primaryAuthor || !secondaryAuthor) {
      console.log('One or both authors not found.');
      return false;
    }
    
    console.log('\n=== Authors to Merge ===');
    console.log('Primary (will be kept):');
    console.log(`ID: ${primaryAuthor.id}`);
    console.log(`Name: ${primaryAuthor.firstName} ${primaryAuthor.middleName || ''} ${primaryAuthor.lastName}`);
    console.log(`Publications: ${primaryAuthor.publications.length}`);
    
    console.log('\nSecondary (will be deleted):');
    console.log(`ID: ${secondaryAuthor.id}`);
    console.log(`Name: ${secondaryAuthor.firstName} ${secondaryAuthor.middleName || ''} ${secondaryAuthor.lastName}`);
    console.log(`Publications: ${secondaryAuthor.publications.length}`);
    
    const confirm = await askQuestion('\nAre you sure you want to merge these authors? (yes/no): ');
    
    if (confirm.toLowerCase() !== 'yes') {
      console.log('Merge cancelled.');
      return false;
    }
    
    // Get publication-author relationships for the secondary author
    const secondaryPublicationAuthors = await prisma.publicationAuthor.findMany({
      where: { authorId: secondaryId }
    });
    
    console.log(`Found ${secondaryPublicationAuthors.length} publications linked to the secondary author.`);
    
    // Transfer publication relationships from secondary to primary
    for (const pubAuthor of secondaryPublicationAuthors) {
      // Check if primary author already has this publication
      const existingRelation = await prisma.publicationAuthor.findFirst({
        where: {
          publicationId: pubAuthor.publicationId,
          authorId: primaryId
        }
      });
      
      if (existingRelation) {
        console.log(`Publication ${pubAuthor.publicationId} is already linked to primary author. Skipping.`);
        continue;
      }
      
      // Create new relationship with primary author
      await prisma.publicationAuthor.create({
        data: {
          publicationId: pubAuthor.publicationId,
          authorId: primaryId,
          position: pubAuthor.position,
          isCorresponding: pubAuthor.isCorresponding,
          equalContribution: pubAuthor.equalContribution
        }
      });
      
      console.log(`Transferred publication ${pubAuthor.publicationId} to primary author.`);
    }
    
    // Delete the secondary author's publication relationships
    await prisma.publicationAuthor.deleteMany({
      where: { authorId: secondaryId }
    });
    
    // Delete the secondary author
    await prisma.author.delete({
      where: { id: secondaryId }
    });
    
    console.log(`\nMerge completed successfully. Author ${secondaryId} has been deleted.`);
    
    return true;
  } catch (error) {
    console.error('Error merging authors:', error);
    return false;
  }
}

// Main menu
async function showMenu() {
  console.log('\n=== Author Cleanup Tool ===');
  console.log('1. Find authors with missing or incomplete information');
  console.log('2. Find potential duplicate authors');
  console.log('3. Update author information');
  console.log('4. Merge authors');
  console.log('5. Exit');
  
  const choice = await askQuestion('\nEnter your choice (1-5): ');
  
  switch (choice) {
    case '1':
      await findProblematicAuthors();
      break;
    case '2':
      await findPotentialDuplicates();
      break;
    case '3':
      const authorId = await askQuestion('Enter author ID to update: ');
      await updateAuthor(authorId);
      break;
    case '4':
      const primaryId = await askQuestion('Enter ID of primary author (to keep): ');
      const secondaryId = await askQuestion('Enter ID of secondary author (to remove): ');
      await mergeAuthors(primaryId, secondaryId);
      break;
    case '5':
      console.log('Exiting...');
      await prisma.$disconnect();
      rl.close();
      return false;
    default:
      console.log('Invalid choice. Please try again.');
  }
  
  return true;
}

// Main function
async function main() {
  console.log('Author Cleanup Tool');
  console.log('------------------');
  
  let continueRunning = true;
  while (continueRunning) {
    continueRunning = await showMenu();
  }
}

// Run the main function
main().catch(e => {
  console.error(e);
  process.exit(1);
}); 