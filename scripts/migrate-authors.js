/**
 * Script to migrate legacy authors to structured authors
 * 
 * This script:
 * 1. Extracts unique author names from publications
 * 2. Creates author records for each unique name
 * 3. Updates publication records to link to the new author records
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateAuthors() {
  console.log('Starting author migration...');
  
  try {
    // Step 1: Get all publications with legacy authors
    const publications = await prisma.publication.findMany({
      select: {
        id: true,
        authors: true,
        publicationAuthors: {
          select: {
            authorId: true
          }
        }
      }
    });
    
    console.log(`Found ${publications.length} publications to process`);
    
    // Step 2: Extract unique author names
    const uniqueAuthorNames = new Set();
    
    publications.forEach(pub => {
      if (pub.authors && pub.authors.length > 0) {
        pub.authors.forEach(authorName => {
          if (authorName) {
            uniqueAuthorNames.add(authorName.trim());
          }
        });
      }
    });
    
    console.log(`Found ${uniqueAuthorNames.size} unique author names`);
    
    // Step 3: Query existing authors to avoid duplicates
    const existingAuthors = await prisma.author.findMany();
    console.log(`Found ${existingAuthors.length} existing authors in the database`);
    
    // Create a map of existing author full names for quick lookups
    const existingAuthorMap = new Map();
    existingAuthors.forEach(author => {
      const fullName = `${author.firstName} ${author.middleName || ''} ${author.lastName}`.trim().replace(/\s+/g, ' ');
      existingAuthorMap.set(fullName, author);
    });
    
    // Step 4: Create authors for each unique name
    const authorNameToIdMap = new Map();
    let newAuthorsCount = 0;
    
    for (const authorName of uniqueAuthorNames) {
      // Check if we already have this author by exact name match
      if (existingAuthorMap.has(authorName)) {
        authorNameToIdMap.set(authorName, existingAuthorMap.get(authorName).id);
        continue;
      }
      
      // Parse name - simple logic assuming "Last, First" or "First Last" format
      let firstName = '', lastName = '', middleName = '';
      
      if (authorName.includes(',')) {
        // Format: "Last, First"
        const parts = authorName.split(',').map(p => p.trim());
        lastName = parts[0];
        
        if (parts.length > 1) {
          const nameParts = parts[1].split(' ').filter(Boolean);
          firstName = nameParts[0] || '';
          middleName = nameParts.slice(1).join(' ') || null;
        }
      } else {
        // Format: "First Last" or "First Middle Last"
        const parts = authorName.split(' ').filter(Boolean);
        
        if (parts.length === 1) {
          // Just a single name
          lastName = parts[0];
        } else {
          firstName = parts[0];
          
          if (parts.length === 2) {
            lastName = parts[1];
          } else {
            // If more than 2 parts, assume the last one is the last name
            // and everything in the middle is middle name
            lastName = parts[parts.length - 1];
            middleName = parts.slice(1, parts.length - 1).join(' ') || null;
          }
        }
      }
      
      // Create the author
      try {
        const newAuthor = await prisma.author.create({
          data: {
            firstName,
            lastName,
            middleName,
            // Detect if this is you based on a pattern in your name
            isYou: authorName.toLowerCase().includes('ion') || authorName.toLowerCase().includes('mike')
          }
        });
        
        authorNameToIdMap.set(authorName, newAuthor.id);
        newAuthorsCount++;
        console.log(`Created author: ${firstName} ${middleName || ''} ${lastName}`);
      } catch (err) {
        console.error(`Error creating author for ${authorName}:`, err);
      }
    }
    
    console.log(`Created ${newAuthorsCount} new authors`);
    
    // Step 5: Update publications with structured authors
    let updatedPublicationsCount = 0;
    
    for (const pub of publications) {
      // Skip if this publication already has structured authors
      if (pub.publicationAuthors && pub.publicationAuthors.length > 0) {
        continue;
      }
      
      // Create structured authors for this publication
      if (pub.authors && pub.authors.length > 0) {
        const authorConnections = [];
        
        for (let i = 0; i < pub.authors.length; i++) {
          const authorName = pub.authors[i].trim();
          const authorId = authorNameToIdMap.get(authorName);
          
          if (authorId) {
            authorConnections.push({
              authorId,
              position: i + 1,
              isCorresponding: i === 0, // Assume first author is corresponding
              equalContribution: false
            });
          }
        }
        
        if (authorConnections.length > 0) {
          try {
            await prisma.publication.update({
              where: { id: pub.id },
              data: {
                publicationAuthors: {
                  create: authorConnections
                }
              }
            });
            
            updatedPublicationsCount++;
          } catch (err) {
            console.error(`Error updating publication ${pub.id}:`, err);
          }
        }
      }
    }
    
    console.log(`Updated ${updatedPublicationsCount} publications with structured authors`);
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateAuthors(); 