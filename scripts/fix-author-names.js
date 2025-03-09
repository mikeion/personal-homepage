/**
 * Fix Author Names
 * 
 * This script helps resolve common author name fragmentation issues:
 * 1. Identifies author fragments like initials and single-word names
 * 2. Maps them to their full name counterparts
 * 3. Merges fragmented author records, preserving publication connections
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

// Common fragment patterns we should search for
const FRAGMENT_PATTERNS = [
  // First initials
  { type: 'initial', regex: /^[A-Z]\.?$/ },
  // Middle initials
  { type: 'initial', regex: /^[A-Z]\.?[A-Z]\.?$/ },
  // Empty first name (just last name)
  { type: 'lastName', regex: /^.+$/ },
];

// Author fragment mapping - common fragments to full author identifiers
// You'll need to customize this based on your specific authors
const AUTHOR_MAPPING = {
  // Example mapping: initial -> full name author ID
  'A.': {
    context: ['Brown'], // When appears with these last names
    targetId: '', // You'll need to set the correct target author ID
    fullName: 'A.M. Brown'
  },
  'M.': {
    context: ['Ion'],
    targetId: '', // Set this to your own author ID
    fullName: 'Michael Ion'
  },
  'P.': {
    context: ['Herbst'],
    targetId: '',
    fullName: 'Pat Herbst'
  },
  'C.': {
    context: ['Margolis', 'Hetrick'],
    targetId: '',
    fullName: '' // Set this to the correct full name
  },
  // Add more mappings as needed
};

// Find authors with likely fragmentation issues
async function findFragmentedAuthors() {
  console.log('\n=== Finding Potentially Fragmented Authors ===');
  
  const authors = await prisma.author.findMany({
    include: {
      publications: {
        include: {
          publication: true
        }
      }
    }
  });
  
  const fragmented = authors.filter(author => {
    // Check if author matches any fragment pattern
    const isFragment = FRAGMENT_PATTERNS.some(pattern => {
      if (pattern.type === 'initial' && pattern.regex.test(author.firstName || author.lastName)) {
        return true;
      }
      if (pattern.type === 'lastName' && !author.firstName && author.lastName) {
        return true;
      }
      return false;
    });
    
    return isFragment;
  });
  
  console.log(`Found ${fragmented.length} potentially fragmented authors`);
  
  // Group by last name to identify related fragments
  const groupedByLastName = {};
  fragmented.forEach(author => {
    const key = author.lastName.toLowerCase();
    if (!groupedByLastName[key]) {
      groupedByLastName[key] = [];
    }
    groupedByLastName[key].push(author);
  });
  
  // Display groups of related fragments
  const groups = Object.keys(groupedByLastName).sort();
  groups.forEach((lastName, index) => {
    const authors = groupedByLastName[lastName];
    if (authors.length > 0) {
      console.log(`\nGroup ${index + 1}: "${lastName}" (${authors.length} fragments)`);
      authors.forEach(author => {
        console.log(`  ID: ${author.id}, Name: "${author.firstName || '(empty)'} ${author.middleName || ''} ${author.lastName}", Publications: ${author.publications.length}`);
      });
    }
  });
  
  return { fragmented, groupedByLastName };
}

// Attempt to find the full name version of a fragmented author
async function findFullNameAuthor(fragmentedAuthor) {
  // Is this an initial?
  const isInitial = /^[A-Z]\.?$/.test(fragmentedAuthor.firstName || fragmentedAuthor.lastName);
  
  if (isInitial) {
    const initial = (fragmentedAuthor.firstName || fragmentedAuthor.lastName).replace('.', '');
    
    // Find authors with matching initial
    const potentialMatches = await prisma.author.findMany({
      where: {
        OR: [
          { firstName: { startsWith: initial } },
          { middleName: { startsWith: initial } }
        ]
      },
      include: {
        publications: true
      }
    });
    
    if (potentialMatches.length > 0) {
      console.log(`\nPotential full name matches for "${fragmentedAuthor.firstName || ''} ${fragmentedAuthor.lastName || ''}" (ID: ${fragmentedAuthor.id}):`);
      potentialMatches.forEach((author, index) => {
        console.log(`  ${index + 1}. "${author.firstName || ''} ${author.middleName || ''} ${author.lastName || ''}" (ID: ${author.id}), Publications: ${author.publications.length}`);
      });
      
      return potentialMatches;
    }
  }
  
  // Is this just a last name (missing first name)?
  if (!fragmentedAuthor.firstName && fragmentedAuthor.lastName) {
    // Find authors with matching last name
    const potentialMatches = await prisma.author.findMany({
      where: {
        lastName: fragmentedAuthor.lastName,
        firstName: { not: null }
      },
      include: {
        publications: true
      }
    });
    
    if (potentialMatches.length > 0) {
      console.log(`\nPotential full name matches for "${fragmentedAuthor.lastName}" (ID: ${fragmentedAuthor.id}):`);
      potentialMatches.forEach((author, index) => {
        console.log(`  ${index + 1}. "${author.firstName || ''} ${author.middleName || ''} ${author.lastName || ''}" (ID: ${author.id}), Publications: ${author.publications.length}`);
      });
      
      return potentialMatches;
    }
  }
  
  return [];
}

// Suggest merges for fragmented authors
async function suggestAuthorMerges() {
  const { fragmented } = await findFragmentedAuthors();
  
  for (const author of fragmented) {
    const fullNameAuthors = await findFullNameAuthor(author);
    
    if (fullNameAuthors.length > 0) {
      const merge = await askQuestion(`\nMerge "${author.firstName || ''} ${author.lastName}" (ID: ${author.id}) with a full name author? (yes/no): `);
      
      if (merge.toLowerCase() === 'yes') {
        const targetIndex = await askQuestion(`Enter the number of the author to merge with (1-${fullNameAuthors.length}): `);
        const targetAuthor = fullNameAuthors[parseInt(targetIndex) - 1];
        
        if (targetAuthor) {
          await mergeAuthors(targetAuthor.id, author.id);
        }
      }
    } else {
      console.log(`\nNo full name matches found for "${author.firstName || ''} ${author.lastName}" (ID: ${author.id})`);
      
      const fixName = await askQuestion(`Would you like to update this author's information? (yes/no): `);
      
      if (fixName.toLowerCase() === 'yes') {
        await updateAuthor(author.id);
      }
    }
  }
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
    console.log(`First Name: ${author.firstName || '(empty)'}`);
    console.log(`Middle Name: ${author.middleName || '(empty)'}`);
    console.log(`Last Name: ${author.lastName || '(empty)'}`);
    console.log(`Is You: ${author.isYou}`);
    
    console.log('\nEnter new information (leave blank to keep current value):');
    
    const newFirstName = await askQuestion(`First Name [${author.firstName || '(empty)'}]: `);
    const newMiddleName = await askQuestion(`Middle Name [${author.middleName || '(empty)'}]: `);
    const newLastName = await askQuestion(`Last Name [${author.lastName || '(empty)'}]: `);
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
    console.log(`First Name: ${updatedAuthor.firstName || '(empty)'}`);
    console.log(`Middle Name: ${updatedAuthor.middleName || '(empty)'}`);
    console.log(`Last Name: ${updatedAuthor.lastName || '(empty)'}`);
    console.log(`Is You: ${updatedAuthor.isYou}`);
    
    return true;
  } catch (error) {
    console.error('Error updating author:', error);
    return false;
  }
}

// Merge two authors (from -> to)
async function mergeAuthors(primaryId, secondaryId) {
  try {
    const primaryAuthor = await prisma.author.findUnique({
      where: { id: primaryId },
      include: { 
        publications: true 
      }
    });
    
    const secondaryAuthor = await prisma.author.findUnique({
      where: { id: secondaryId },
      include: { 
        publications: true
      }
    });
    
    if (!primaryAuthor || !secondaryAuthor) {
      console.log('One or both authors not found.');
      return false;
    }
    
    console.log('\n=== Authors to Merge ===');
    console.log('Primary (will be kept):');
    console.log(`ID: ${primaryAuthor.id}`);
    console.log(`Name: ${primaryAuthor.firstName || '(empty)'} ${primaryAuthor.middleName || ''} ${primaryAuthor.lastName || '(empty)'}`);
    console.log(`Publications: ${primaryAuthor.publications.length}`);
    
    console.log('\nSecondary (will be deleted):');
    console.log(`ID: ${secondaryAuthor.id}`);
    console.log(`Name: ${secondaryAuthor.firstName || '(empty)'} ${secondaryAuthor.middleName || ''} ${secondaryAuthor.lastName || '(empty)'}`);
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
  console.log('\n=== Fix Author Names Tool ===');
  console.log('1. Find fragmented authors');
  console.log('2. Suggest author merges');
  console.log('3. Merge specific authors');
  console.log('4. Update author information');
  console.log('5. Exit');
  
  const choice = await askQuestion('\nEnter your choice (1-5): ');
  
  switch (choice) {
    case '1':
      await findFragmentedAuthors();
      break;
    case '2':
      await suggestAuthorMerges();
      break;
    case '3':
      const primaryId = await askQuestion('Enter ID of primary author (to keep): ');
      const secondaryId = await askQuestion('Enter ID of secondary author (to remove): ');
      await mergeAuthors(primaryId, secondaryId);
      break;
    case '4':
      const authorId = await askQuestion('Enter author ID to update: ');
      await updateAuthor(authorId);
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
  console.log('Fix Author Names Tool');
  console.log('--------------------');
  
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