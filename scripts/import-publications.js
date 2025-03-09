// Script to import publications from JSON file to the database
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Get file path
const publicationsFilePath = path.join(__dirname, '../src/data/cv/publications_and_presentations.json');

// Function to clean LaTeX formatting from author names
function cleanLatexFormatting(author) {
  return author.replace(/\\textbf{/g, '')
              .replace(/}/g, '')
              .replace(/\s+/g, ' ')
              .trim();
}

// Function to create or find a keyword
async function getOrCreateKeyword(name) {
  // Clean up keyword name
  const cleanName = name.trim();
  
  // Try to find existing keyword
  let keyword = await prisma.keyword.findFirst({
    where: {
      name: {
        equals: cleanName,
        mode: 'insensitive'
      }
    }
  });
  
  // Create keyword if it doesn't exist
  if (!keyword) {
    keyword = await prisma.keyword.create({
      data: {
        name: cleanName
      }
    });
    console.log(`Created new keyword: ${cleanName}`);
  }
  
  return keyword;
}

// Function to create a research area based on keywords
async function createResearchArea(keywords, name, description = '') {
  // Try to find existing research area
  let area = await prisma.researchArea.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive'
      }
    }
  });
  
  // Create area if it doesn't exist
  if (!area) {
    area = await prisma.researchArea.create({
      data: {
        name,
        description,
        keywords: {
          connect: keywords.map(k => ({ id: k.id }))
        }
      }
    });
    console.log(`Created new research area: ${name}`);
  }
  
  return area;
}

// Function to import a publication
async function importPublication(pub, type) {
  try {
    // Clean up author names from LaTeX formatting
    const cleanAuthors = [];
    for (let i = 0; i < pub.authors.length; i++) {
      const author = cleanLatexFormatting(pub.authors[i]);
      if (author.length > 0) {
        cleanAuthors.push(author);
      }
    }
    
    // Format authors as a readable list
    const formattedAuthors = cleanAuthors;
    
    // Set default description
    const description = pub.abstract || `${pub.title} by ${formattedAuthors.join(', ')}`;
    
    // Create keywords for the publication
    const keywordObjects = [];
    if (pub.keywords && pub.keywords.length > 0) {
      for (const keywordName of pub.keywords) {
        const keyword = await getOrCreateKeyword(keywordName);
        keywordObjects.push(keyword);
      }
    }
    
    // Try to determine research areas from keywords
    // Group similar keywords into research areas
    const keywordGroups = {
      'Education': ['Education', 'Teaching', 'Learning', 'Pedagogy', 'Curriculum'],
      'Machine Learning': ['Machine Learning', 'Artificial Intelligence', 'AI', 'Natural Language Processing', 'NLP'],
      'Mathematics': ['Mathematics', 'Geometry', 'Calculus', 'Algebra'],
      'Technology': ['Technology', 'Software', 'Computing', 'Digital']
    };
    
    // Find matching areas
    const matchingAreas = new Set();
    for (const keyword of pub.keywords || []) {
      for (const [area, relatedTerms] of Object.entries(keywordGroups)) {
        if (relatedTerms.some(term => keyword.toLowerCase().includes(term.toLowerCase()))) {
          matchingAreas.add(area);
        }
      }
    }
    
    // Create research areas
    const researchAreaObjects = [];
    for (const areaName of matchingAreas) {
      const area = await createResearchArea(
        keywordObjects, 
        areaName, 
        `Research in the field of ${areaName}`
      );
      researchAreaObjects.push(area);
    }
    
    // Check if the publication already exists
    const existingPub = await prisma.publication.findFirst({
      where: {
        title: pub.title,
        authors: {
          equals: formattedAuthors
        }
      }
    });
    
    if (existingPub) {
      console.log(`Publication "${pub.title}" already exists, skipping.`);
      return null;
    }
    
    // Create publication
    const newPublication = await prisma.publication.create({
      data: {
        title: pub.title,
        authors: formattedAuthors,
        year: parseInt(pub.year) || new Date().getFullYear(),
        venue: pub.journal || pub.venue || '',
        type: type,
        status: pub.status || 'published',
        description: description,
        doi: pub.doi || null,
        pdfLink: pub.pdfLink || null,
        projectLink: pub.url || pub.doi || null,
        location: pub.location || null,
        keywords: {
          connect: keywordObjects.map(k => ({ id: k.id }))
        },
        researchAreas: {
          connect: researchAreaObjects.map(a => ({ id: a.id }))
        }
      }
    });
    
    console.log(`Imported: ${pub.title}`);
    return newPublication;
  } catch (error) {
    console.error(`Error importing publication: ${pub.title}`);
    console.error(error);
    return null;
  }
}

// Main function to import all publications
async function importPublications() {
  try {
    // Read publications file
    const publicationsData = JSON.parse(fs.readFileSync(publicationsFilePath, 'utf8'));
    
    let totalImported = 0;
    
    // Import journal publications
    if (publicationsData.peer_reviewed_journals) {
      console.log('\n--- Importing Journal Publications ---');
      for (const pub of publicationsData.peer_reviewed_journals) {
        const imported = await importPublication(pub, 'journal');
        if (imported) totalImported++;
      }
    }
    
    // Import conference proceedings
    if (publicationsData.conference_proceedings) {
      console.log('\n--- Importing Conference Proceedings ---');
      for (const pub of publicationsData.conference_proceedings) {
        const imported = await importPublication(pub, 'conference');
        if (imported) totalImported++;
      }
    }
    
    // Import work in progress
    if (publicationsData.work_in_progress) {
      console.log('\n--- Importing Work in Progress ---');
      for (const pub of publicationsData.work_in_progress) {
        const imported = await importPublication(pub, 'preprint');
        if (imported) totalImported++;
      }
    }
    
    // Add other sections if they exist in the JSON
    
    console.log(`\nTotal publications imported: ${totalImported}`);
    
  } catch (error) {
    console.error('Error importing publications:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importPublications(); 