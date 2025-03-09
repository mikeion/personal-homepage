/**
 * CV Import Script
 * 
 * This script:
 * 1. Parses publication entries from the CV text
 * 2. Checks if they already exist in the database
 * 3. Reports missing publications
 * 4. Optionally adds missing publications to the database
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// CV data (in-memory for this example)
// In a real implementation, you could read this from a text file
const CV_TEXT = `
Peer-Reviewed Journal Articles
❑Ion, M., Herbst, P. (In review). Measuring Tacit Mathematics
Teaching Knowledge: A Natural Language Processing Approach.
Journal of the Learning Sciences.
❑Paulsen, A., Godfrey, J., Ion, M., (In review). Writing Across the
Curriculum: a Text as Data Approach. Educational Effectiveness
and Policy Analysis.
❑Short, C., Ion, M. (In progress). Generative Artificial Intelligence
for Theory Building. Academy of Management Review.
❑Herbst, P., Brown, A.M., Ion, M., Margolis, C. (2023). Teaching
Geometry for Secondary Teachers: What are the Tensions Instruc-
tors Need to Manage? International Journal of Research in Un-
dergraduate Mathematics Education. (2023). https://doi-org.
proxy.lib.umich.edu/10.1007/s40753-023-00216-0
❑Gere, A., Godfrey, J., Griffin, M., Ion, M., Limlamai, N., Moos,
A., Van Zanen, K. (2023). Alumni Perspectives on General Ed-
ucation: How Writing Can Increase What We Know. Journal
of General Education, 70 (1-2), 149-175. https://doi.org/10.
5325/jgeneeduc.70.1-2.0149

Peer-Reviewed Conference Proceedings
❑Ion, M., Herbst, P., Ko, I., Hetrick, C. (Oct. 2023). Surveying
Instructors of Geometry for Teachers Courses: An Illustration of
Balanced Incomplete Block Design. Psychology of Mathematics
Education, North America Annual Conference. Reno, NV.
❑Brown, A., Herbst, P., Ion, M. (Oct. 2023). How Instructors of
Undergraduate Mathematics Courses Manage Tensions Related to
Teaching Courses for Teachers. Psychology of Mathematics Edu-
cation, North America Annual Conference. Reno, NV.
❑Boyce, S., An, T., Pyzdrowski, L., Oppong-Wadie, K., Ion, M.,
St. Goar, J. (Feb. 2023). Learning from Lesson Study in the Col-
lege Geometry Classroom. 25th Annual Conference on Research
in Undergraduate Mathematics Education. Omaha, NE.
❑Hetrick, C., Herbst, P., Ion, M., Brown, A. (Feb. 2023). Build-
ing Instructional Capacity Across Difference: Analyzing Trans-
disciplinary Discourse in a Faculty Learning Community focused
on Geometry for Teachers Courses. 25th Annual Conference on
Research in Undergraduate Mathematics Education. Omaha, NE.
❑Ion, M. (Jul. 2022). Studying Conceptions of the Derivative
at Scale: A Machine Learning Approach. 45th Conference of the
International Group for the Psychology of Mathematics Education.
Alicante, Spain.
❑Ion, M., Herbst, P. (Feb. 2022). Conceptions of the Derivative:
A Natural Language Processing Approach. Research in Under-
graduate Mathematics Education Conference. Boston, MA.
❑Margolis, C., Ion, M., Herbst, P., Milewski, A., Shultz, M. (Nov.
2020). Understanding instructional capacity for high school geom-
etry as a systemic problem through stakeholder interviews. Psy-
chology of Mathematics Education, North America. Mexico.
❑Bardelli, E., Ion, M., Ko, I., Herbst, P. (Apr. 2020). Who Ben-
efits from Mathematics Courses for Teachers? An Analysis of
MKT-G Growth During Geometry for Teachers Courses. Ameri-
can Education Research Association. San Francisco, CA.
❑Ion, M., Herbst, P., Margolis, C., Milewski, A., Ko, I. (Nov.
2019). Developing Practical Measures To Support the Improve-
ment of Geometry for Teachers Courses. Psychology of Mathe-
matics Education, North America Annual Conference. St. Louis,
MO.
❑Milewski, A., Ion, M., Herbst, P., Shultz, M., Ko, I., Bleecker, H.
(Apr. 2019). Tensions in Teaching Mathematics to Future Teach-
ers: Understanding the Practice of Undergraduate Mathematics
Instructors. American Education Research Association Confer-
ence. Toronto, Canada.
❑Herbst, P., Milewski, A., Ion, M., Bleecker, H. (Oct. 2018).
What Influences Do Instructors of the Geometry for Teachers
Course Need to Contend With? Psychology of Mathematics Edu-
cation, North America. Greenville, SC.

Non-peer-reviewed articles and blog posts
❑Ion, M., Herbst, P. (Nov. 2021). A Contribution to Stewarding
the SLOs: Developing SLO Assessment Items and Examining Item
Responses. GeT: The News!, 3 (1).
❑Herbst, P., Ion, M. (Nov. 2021). A Deeper Dive into an SLO
Item: Examining Students' Ways of Reasoning about Relation-
ships between Euclidean and Non-Euclidean Geometries. GeT:
The News!, 3 (1).
❑Boyce, S., Ion, M., Lai, Y., McLeod, K., Pyzdrowski, L., Sears,
R., St. Goar, J. (May 2021). Best-Laid Co-Plans for a Lesson on
Creating a Mathematical Definition. AMS Blogs: On Teaching
and Learning Mathematics.

Presentations Conference Talks
❑Paulsen, A., Godfrey, J., Ion, M.. (Mar. 2023). Writing Across
the Curriculum: a Case Study in Text as Data Methods for Post-
secondary Education Policy Research. Denver, CO.
❑Godfrey, J., Paulson, A., Ion, M. (2023). What Are the Common
Contexts for College Writing? Conference on College Composition
and Communication Annual Convention. Chicago, IL.
❑Paulsen, A., Ion, M., Godfrey, J. (Dec. 2022). Writing Across
the Curriculum: a Text as Data Approach. Causal Inference in
Education Research Seminar (CIERS). Ann Arbor, MI.
❑Paulson, A., Bardelli, E., Godfrey, J., Ion, M., Frisby, M. (Apr.
2022). Who Follows Placement Recommendations? Differential
Effects of Non-binding Placement Recommendations on Students'
Course-taking Decisions. American Education Research Associa-
tion. San Diego, CA.
❑Herbst, P., Stevens, I., Milewski, A., Ion, M., Ko, I. (Jan. 2020).
State of Undergraduate Geometry Courses for Secondary Teach-
ers: Curriculum, Instructional Practices, and Student Achieve-
ment. Joint Mathematics Meeting. Denver, CO.
❑Milewski, A., Herbst, P., Ion, M., Bleecker, H. (Feb. 2019).
Preparing Teachers for Secondary Geometry: Understanding the
Tensions in Teaching Undergraduate Mathematics Courses for Fu-
ture Teachers. Association of Mathematics Teacher Educators An-
nual Conference. Orlando, FL.
❑Milewski, A., Herbst, P., Margolis, C., Ion, M., Ko, I., Akbuga,
E. (Jan. 2019). What do we know about courses in Geometry
for Secondary Teachers? Joint Mathematics Meetings. Baltimore,
Maryland.

Roundtable Discussions
❑Berzina Pitcher, I., Ion, M., An, T., Brown, A., Buchbinder, O.,
Herbst, P., Hetrick, C., Miller, N., Prasad, P., Pyzdrowski, L., St.
Goar, J., Sears, R., Szydlik, S., Oshkosh, Vestal, S. (Apr. 2022).
Learning and Participating in Scholarship of Teaching and Learn-
ing through a Faculty Online Learning Community. American
Education Research Association. San Diego, CA.
❑Ion, M., Margolis, C. (Mar. 2019). Sources of Justification for
College Geometry Instructional Actions. Graduate Student Com-
munity Organization Graduate Student Conference. Ann Arbor,
MI.
❑Ion, M. (Mar. 2018). Characterizing University Geometry Courses:
An Interview-Based Approach. Graduate Student Community Or-
ganization Graduate Student Conference. Ann Arbor, MI.

Posters
❑Boyce, B., Ion, M. (Oct. 2023). Geometry Students' Ways of
Thinking About Adinkra Symbols. Psychology of Mathematics
Education, North America Annual Conference. Reno, NV.
❑Danai, A., Quimper Osores, A., Ion, M., Herbst, P. (Apr. 2023).
Analysis of Citation Networks of Submitted Manuscripts in Math-
ematics Education. Undergraduate Research Opportunity Program
(UROP) Symposium. Ann Arbor, MI. 'Blue Ribbon Outstanding
Presenter Award'
❑Beckemeyer, R., Brown, A., Ion, M., Spiteri, A., Herbst, P.
(Apr. 2022). How Experience and Knowledge Affect the Breach-
ing Patterns of Secondary Mathematics Teachers. Undergraduate
Research Opportunity Program (UROP) Symposium. Ann Arbor,
MI. 'Blue Ribbon Outstanding Presenter Award'.
❑Ion, M., Bardelli, E., Herbst, P. (Oct. 2018). Learning About
the Norms of Teaching Practice: How Can Machine Learning Help
Analyze Teachers' Reactions to Scenarios? Michigan Institute for
Data Science Annual Symposium. Ann Arbor, MI. Awarded 'Most
Likely Scientific Impact'.
`;

// Parse a CV entry into structured data
function parseEntry(entry) {
  try {
    // Trim and clean up the entry
    entry = entry.trim();
    if (!entry.startsWith('❑')) return null;
    
    entry = entry.substring(1).trim(); // Remove the bullet
    
    // Extract authors, which are at the beginning until the parenthesis with year/status
    const authorsPart = entry.split(/\(.*?\)/)[0].trim();
    const authors = authorsPart.split(',').map(author => author.trim()).filter(a => a);
    
    // Extract year or status (in parentheses)
    const yearMatch = entry.match(/\((.*?)\)/);
    const yearOrStatus = yearMatch ? yearMatch[1].trim() : '';
    
    // Determine year and status
    let year, status;
    if (yearOrStatus.toLowerCase().includes('in review')) {
      year = new Date().getFullYear(); // Current year as default
      status = 'in_review';
    } else if (yearOrStatus.toLowerCase().includes('in progress')) {
      year = new Date().getFullYear(); // Current year as default
      status = 'in_progress';
    } else {
      // Try to extract a 4-digit year
      const yearDigits = yearOrStatus.match(/\b(19|20)\d{2}\b/);
      year = yearDigits ? parseInt(yearDigits[0]) : new Date().getFullYear();
      status = 'published';
    }
    
    // Extract title, which is after the date parenthesis
    let titlePart = '';
    if (yearMatch) {
      titlePart = entry.substring(entry.indexOf(yearMatch[0]) + yearMatch[0].length).trim();
      if (titlePart.startsWith('.')) {
        titlePart = titlePart.substring(1).trim();
      }
    }
    
    // Extract venue, which is usually after the last period before any URL
    const parts = titlePart.split('.');
    let title = '';
    let venue = '';
    
    if (parts.length >= 2) {
      // Last part is likely the venue
      venue = parts[parts.length - 1].trim();
      
      // Everything before is the title
      title = parts.slice(0, parts.length - 1).join('.').trim();
    } else {
      title = titlePart;
    }
    
    // Clean up venue - remove URLs and DOIs
    venue = venue.replace(/https?:\/\/[^\s]+/g, '').trim();
    venue = venue.replace(/DOI:[^\s]+/g, '').trim();
    venue = venue.replace(/doi\.org[^\s]+/g, '').trim();
    
    // Extract DOI if present
    const doiMatch = entry.match(/https?:\/\/doi\.org\/([^\s]+)/);
    const doi = doiMatch ? doiMatch[1].trim() : '';
    
    // Extract URL if present
    const urlMatch = entry.match(/https?:\/\/[^\s]+/);
    const url = urlMatch ? urlMatch[0].trim() : '';
    
    // Clean up title - remove venue details if they were mistakenly included
    if (title.includes(venue) && venue.length > 0) {
      title = title.replace(venue, '').trim();
      if (title.endsWith('.')) {
        title = title.substring(0, title.length - 1).trim();
      }
    }
    
    return {
      title,
      authors,
      year,
      venue,
      status,
      doi,
      pdfLink: url
    };
  } catch (error) {
    console.error('Error parsing entry:', entry);
    console.error(error);
    return null;
  }
}

// Determine publication type from section heading
function getPublicationType(section) {
  section = section.toLowerCase();
  
  if (section.includes('journal')) {
    return 'journal';
  } else if (section.includes('conference proceedings')) {
    return 'conference';
  } else if (section.includes('non-peer') || section.includes('blog')) {
    return 'article';
  } else if (section.includes('presentations') || section.includes('talks')) {
    return 'talk';
  } else if (section.includes('roundtable')) {
    return 'workshop';
  } else if (section.includes('posters')) {
    return 'poster';
  }
  
  return 'other';
}

// Main function to parse CV and check against database
async function processCv() {
  console.log('Starting CV import process...');
  
  try {
    // Fetch existing publications from the database
    const existingPublications = await prisma.publication.findMany({
      include: {
        publicationAuthors: {
          include: {
            author: true
          }
        }
      }
    });
    
    console.log(`Found ${existingPublications.length} existing publications in the database`);
    
    // Parse CV text into sections and entries
    const sections = CV_TEXT.split(/\n\n(?=[A-Z])/);
    
    let currentSection = '';
    const parsedEntries = [];
    
    for (let section of sections) {
      section = section.trim();
      if (!section) continue;
      
      // Check if this is a section heading
      const lines = section.split('\n');
      if (lines[0] && !lines[0].startsWith('❑')) {
        currentSection = lines[0].trim();
        lines.shift(); // Remove the heading
        section = lines.join('\n');
      }
      
      const type = getPublicationType(currentSection);
      
      // Split into individual entries
      const entries = section.split('❑').filter(e => e.trim());
      for (let entry of entries) {
        entry = '❑' + entry; // Re-add the bullet
        const parsed = parseEntry(entry);
        if (parsed) {
          parsed.type = type;
          parsedEntries.push(parsed);
        }
      }
    }
    
    console.log(`Parsed ${parsedEntries.length} entries from the CV`);
    
    // Find matches and mismatches
    const matches = [];
    const mismatches = [];
    
    for (const cvEntry of parsedEntries) {
      // Try to match by title similarity
      let bestMatch = null;
      let bestScore = 0;
      
      for (const dbPub of existingPublications) {
        // Calculate similarity between titles
        const cvTitle = cvEntry.title.toLowerCase();
        const dbTitle = dbPub.title.toLowerCase();
        
        // Simple Jaccard similarity for titles
        const cvWords = new Set(cvTitle.split(/\s+/).filter(w => w.length > 3));
        const dbWords = new Set(dbTitle.split(/\s+/).filter(w => w.length > 3));
        
        const intersection = new Set([...cvWords].filter(x => dbWords.has(x)));
        const union = new Set([...cvWords, ...dbWords]);
        
        const similarity = intersection.size / union.size;
        
        if (similarity > 0.5 && similarity > bestScore) {
          bestMatch = dbPub;
          bestScore = similarity;
        }
      }
      
      if (bestMatch) {
        matches.push({ cv: cvEntry, db: bestMatch, score: bestScore });
      } else {
        mismatches.push(cvEntry);
      }
    }
    
    console.log(`\n=== RESULTS ===`);
    console.log(`Found ${matches.length} matching publications in the database`);
    console.log(`Found ${mismatches.length} publications from CV not in the database`);
    
    // Display missing publications
    if (mismatches.length > 0) {
      console.log('\n=== MISSING PUBLICATIONS ===');
      mismatches.forEach((pub, index) => {
        console.log(`\n${index + 1}. "${pub.title}"`);
        console.log(`   Authors: ${pub.authors.join(', ')}`);
        console.log(`   Year: ${pub.year}, Status: ${pub.status}, Type: ${pub.type}`);
        console.log(`   Venue: ${pub.venue}`);
      });
      
      // Ask if user wants to add missing publications
      const answer = await askQuestion('\nWould you like to add these missing publications to the database? (yes/no): ');
      
      if (answer.toLowerCase() === 'yes') {
        console.log('\nAdding missing publications...');
        
        // Get all existing authors
        const authors = await prisma.author.findMany();
        
        // Create a map of author names to IDs
        const authorMap = new Map();
        authors.forEach(author => {
          // Map various forms of the same name
          const fullName = `${author.firstName} ${author.middleName || ''} ${author.lastName}`.trim().toLowerCase();
          authorMap.set(fullName, author);
          
          // Map just first initial + last name
          const firstInitial = author.firstName ? author.firstName.charAt(0) : '';
          if (firstInitial) {
            const shortName = `${firstInitial}. ${author.lastName}`.trim().toLowerCase();
            authorMap.set(shortName, author);
          }
          
          // Map last name + first initial
          if (firstInitial) {
            const reverseName = `${author.lastName}, ${firstInitial}.`.trim().toLowerCase();
            authorMap.set(reverseName, author);
          }
        });
        
        // Function to find or create an author
        async function findOrCreateAuthor(name) {
          name = name.trim();
          
          // Check for known formats
          let firstName = '', lastName = '', middleName = null;
          
          // Clean up extra spaces
          name = name.replace(/\s+/g, ' ').trim();
          
          // Check if it's in "Last, First" format
          if (name.includes(',')) {
            const parts = name.split(',').map(p => p.trim());
            lastName = parts[0];
            if (parts.length > 1) {
              // Check if it has a middle initial/name
              const nameParts = parts[1].split(' ').filter(Boolean);
              firstName = nameParts[0];
              if (nameParts.length > 1) {
                middleName = nameParts.slice(1).join(' ');
              }
            }
          } else {
            // Assume "First [Middle] Last" format
            const parts = name.split(' ').filter(Boolean);
            
            // Special case for single-word names (assume it's a last name)
            if (parts.length === 1) {
              lastName = parts[0];
              firstName = '?'; // Mark unknown first names with a ? for easy identification
            } 
            // Case for two-word names (First Last)
            else if (parts.length === 2) {
              firstName = parts[0];
              lastName = parts[1];
            } 
            // Case for multi-word names
            else {
              firstName = parts[0];
              
              // Check if the last part might be a suffix like "Jr." or "III"
              const lastPart = parts[parts.length - 1];
              if (lastPart.match(/^(Jr|Sr|I{1,3}|IV|V|VI)\.?$/i)) {
                lastName = parts[parts.length - 2] + ' ' + lastPart;
                middleName = parts.slice(1, parts.length - 2).join(' ');
              } else {
                lastName = parts[parts.length - 1];
                middleName = parts.slice(1, parts.length - 1).join(' ');
              }
            }
          }
          
          // Clean up any periods in initials
          if (firstName && firstName.length <= 2 && firstName.endsWith('.')) {
            firstName = firstName.replace('.', '');
          }
          
          if (middleName && middleName.length <= 2 && middleName.endsWith('.')) {
            middleName = middleName.replace('.', '');
          }
          
          // Special case for initial-only first names - don't create these as separate authors
          // if they might match an existing author
          if (firstName && firstName.length === 1) {
            // Look for existing authors with this initial
            const potentialMatches = authors.filter(author => 
              author.firstName.charAt(0).toLowerCase() === firstName.toLowerCase() &&
              author.lastName.toLowerCase() === lastName.toLowerCase()
            );
            
            if (potentialMatches.length > 0) {
              console.log(`Found existing author with initial ${firstName} ${lastName}, using full name match`);
              return potentialMatches[0];
            }
          }
          
          // Handle cases where the name is just an initial + last name
          // This might mean we have a full name elsewhere in our author database
          if (firstName && firstName.length === 1) {
            // Look for a better match by last name only
            for (const author of authors) {
              if (author.lastName.toLowerCase() === lastName.toLowerCase() &&
                  author.firstName.length > 1 && 
                  author.firstName.charAt(0).toLowerCase() === firstName.toLowerCase()) {
                console.log(`Found full name match for initial ${firstName}. ${lastName} -> ${author.firstName} ${author.lastName}`);
                return author;
              }
            }
          }
          
          // Normalize the name for lookup
          const normalizedName = `${firstName} ${middleName || ''} ${lastName}`.trim().toLowerCase();
          const shortName = `${firstName.charAt(0)}. ${lastName}`.trim().toLowerCase();
          const reverseName = `${lastName}, ${firstName.charAt(0)}.`.trim().toLowerCase();
          
          // Try to find the author in our map
          let author = authorMap.get(normalizedName) || authorMap.get(shortName) || authorMap.get(reverseName);
          
          if (!author) {
            // Create new author
            try {
              const isYou = name.toLowerCase().includes('ion') && name.toLowerCase().includes('m');
              
              // Skip creating authors with just initials if we can't find a match
              if (firstName === '?') {
                console.log(`Skipping author with unknown first name: ${lastName}`);
                return null;
              }
              
              author = await prisma.author.create({
                data: {
                  firstName,
                  lastName,
                  middleName,
                  isYou
                }
              });
              
              console.log(`Created author: ${firstName} ${middleName || ''} ${lastName}`);
              
              // Add to our map for future lookups
              authorMap.set(normalizedName, author);
              if (firstName.length > 0) {
                authorMap.set(shortName, author);
                authorMap.set(reverseName, author);
              }
            } catch (error) {
              console.error(`Error creating author ${name}:`, error);
              return null;
            }
          }
          
          return author;
        }
        
        // Add each missing publication
        for (const pub of mismatches) {
          try {
            // Create publication
            const publicationData = {
              title: pub.title,
              authors: pub.authors, // Keep the original strings for reference
              year: pub.year,
              type: pub.type,
              venue: pub.venue,
              status: pub.status,
              doi: pub.doi || null,
              pdfLink: pub.pdfLink || null,
              description: `Imported from CV: ${pub.authors.join(', ')} (${pub.year}). ${pub.title}. ${pub.venue}`
            };
            
            console.log(`Creating publication: "${pub.title}"`);
            
            // Create publication first
            const publication = await prisma.publication.create({
              data: publicationData
            });
            
            // Process the authors
            console.log(`Processing ${pub.authors.length} authors...`);
            const authorConnections = [];
            
            for (let i = 0; i < pub.authors.length; i++) {
              const authorName = pub.authors[i];
              const author = await findOrCreateAuthor(authorName);
              
              if (author) {
                authorConnections.push({
                  authorId: author.id,
                  position: i + 1,
                  isCorresponding: i === 0, // Assume first author is corresponding
                  equalContribution: false
                });
              }
            }
            
            // Connect authors to publication
            if (authorConnections.length > 0) {
              await prisma.publication.update({
                where: { id: publication.id },
                data: {
                  publicationAuthors: {
                    create: authorConnections
                  }
                }
              });
              
              console.log(`Added ${authorConnections.length} authors to publication`);
            }
            
            console.log(`Publication created successfully: ${publication.id}`);
          } catch (error) {
            console.error(`Error creating publication "${pub.title}":`, error);
          }
        }
        
        console.log('\nImport completed successfully!');
      } else {
        console.log('No publications were added.');
      }
    } else {
      console.log('\nAll publications from your CV are already in the database!');
    }
    
  } catch (error) {
    console.error('Error processing CV:', error);
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

// Run the main function
processCv(); 