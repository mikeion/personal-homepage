/**
 * Author Cleanup Utility
 * 
 * This script:
 * 1. Uses fuzzy matching to identify potential duplicate authors
 * 2. Provides a way to merge duplicates
 * 3. Identifies malformed author entries
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Simple similarity score between 0 and 1
function similarity(s1, s2) {
  // Convert to lowercase and remove special characters for comparison
  s1 = s1.toLowerCase().replace(/[^\w\s]/g, '').trim();
  s2 = s2.toLowerCase().replace(/[^\w\s]/g, '').trim();
  
  // If strings are identical after normalization
  if (s1 === s2) return 1;
  
  // If one is empty
  if (!s1 || !s2) return 0;
  
  // Count matching characters
  let matches = 0;
  const maxLength = Math.max(s1.length, s2.length);
  
  // Calculate Levenshtein distance (simplified)
  let distance = 0;
  const matrix = [];
  
  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      if (s1[i-1] === s2[j-1]) {
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i-1][j-1] + 1, // substitution
          matrix[i][j-1] + 1,   // insertion
          matrix[i-1][j] + 1    // deletion
        );
      }
    }
  }
  
  distance = matrix[s1.length][s2.length];
  return 1 - (distance / maxLength);
}

// Compare two authors and return similarity score (0-1)
function compareAuthors(author1, author2) {
  // If same ID, they're the same
  if (author1.id === author2.id) return 1;
  
  // Create full names for comparison
  const name1 = `${author1.firstName} ${author1.middleName || ''} ${author1.lastName}`.trim().replace(/\s+/g, ' ');
  const name2 = `${author2.firstName} ${author2.middleName || ''} ${author2.lastName}`.trim().replace(/\s+/g, ' ');
  
  // If last names match, higher base score
  const lastNameMatch = author1.lastName.toLowerCase() === author2.lastName.toLowerCase();
  let baseScore = lastNameMatch ? 0.5 : 0;
  
  // Calculate full name similarity
  const nameScore = similarity(name1, name2);
  
  // Combine scores with higher weight to last name matches
  return baseScore + (nameScore * 0.5);
}

// Main function to find potential duplicates
async function findPotentialDuplicates() {
  console.log('Starting author analysis...');
  
  try {
    // Get all authors
    const authors = await prisma.author.findMany();
    console.log(`Found ${authors.length} authors to analyze`);
    
    // Compare all authors against each other
    const potentialDuplicates = [];
    const suspiciousAuthors = [];
    
    // Check for suspicious author formats (dates, venues mistaken for authors)
    for (const author of authors) {
      const fullName = `${author.firstName} ${author.middleName || ''} ${author.lastName}`.trim();
      
      // Check for date patterns
      if (
        fullName.match(/^\(\d{4}\)/) || // Starts with year in parentheses
        fullName.match(/^\((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/) || // Starts with month in parentheses
        author.firstName.match(/^\(/) || // First name starts with parenthesis
        author.lastName.match(/\)$/) || // Last name ends with parenthesis
        author.firstName.includes('Conference') ||
        author.lastName.includes('Conference') ||
        author.lastName.includes('America') ||
        author.lastName.includes('Annual')
      ) {
        suspiciousAuthors.push({
          id: author.id,
          name: fullName,
          reason: 'May be a date, venue, or conference name rather than an author'
        });
      }
      
      // Check for missing components
      if (!author.firstName || !author.lastName) {
        suspiciousAuthors.push({
          id: author.id,
          name: fullName,
          reason: 'Missing first or last name'
        });
      }
    }
    
    // Compare each pair of authors
    for (let i = 0; i < authors.length; i++) {
      for (let j = i + 1; j < authors.length; j++) {
        const score = compareAuthors(authors[i], authors[j]);
        
        // If similarity is high but not identical
        if (score > 0.7 && score < 1) {
          potentialDuplicates.push({
            author1: {
              id: authors[i].id,
              name: `${authors[i].firstName} ${authors[i].middleName || ''} ${authors[i].lastName}`.trim()
            },
            author2: {
              id: authors[j].id,
              name: `${authors[j].firstName} ${authors[j].middleName || ''} ${authors[j].lastName}`.trim()
            },
            similarity: score
          });
        }
      }
    }
    
    // Sort by similarity score (highest first)
    potentialDuplicates.sort((a, b) => b.similarity - a.similarity);
    
    console.log('\n=== POTENTIAL DUPLICATE AUTHORS ===');
    if (potentialDuplicates.length === 0) {
      console.log('No potential duplicates found.');
    } else {
      console.log(`Found ${potentialDuplicates.length} potential duplicate pairs:\n`);
      potentialDuplicates.forEach((pair, index) => {
        console.log(`${index + 1}. Similarity: ${Math.round(pair.similarity * 100)}%`);
        console.log(`   - ${pair.author1.name} (ID: ${pair.author1.id})`);
        console.log(`   - ${pair.author2.name} (ID: ${pair.author2.id})`);
      });
    }
    
    console.log('\n=== SUSPICIOUS AUTHOR ENTRIES ===');
    if (suspiciousAuthors.length === 0) {
      console.log('No suspicious entries found.');
    } else {
      console.log(`Found ${suspiciousAuthors.length} suspicious author entries:\n`);
      suspiciousAuthors.forEach((author, index) => {
        console.log(`${index + 1}. ${author.name} (ID: ${author.id})`);
        console.log(`   Reason: ${author.reason}`);
      });
    }
    
    // Offer an interactive prompt for merging authors
    if (potentialDuplicates.length > 0 || suspiciousAuthors.length > 0) {
      console.log('\n=== CLEANUP OPTIONS ===');
      console.log('To merge duplicate authors, run:');
      console.log('node scripts/merge-authors.js <primaryId> <secondaryId>');
      console.log('\nTo delete suspicious entries, run:');
      console.log('node scripts/delete-author.js <authorId>');
    }
    
  } catch (error) {
    console.error('Error analyzing authors:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
findPotentialDuplicates(); 