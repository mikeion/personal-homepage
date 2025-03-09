'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../layout';
import { Button, Card, Container, Row, Col, Form, Alert, Spinner, Badge } from 'react-bootstrap';

// Type definitions
type ParsedPublication = {
  id?: string;
  title: string;
  authors: string[];
  year: number;
  type: string;
  venue?: string;
  status?: string;
  doi?: string;
  pdfLink?: string;
  description?: string;
};

type Author = {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  email?: string | null;
  affiliation?: string | null;
  isYou: boolean;
};

type StructuredAuthor = {
  author: Author;
  position: number;
  isCorresponding: boolean;
  equalContribution: boolean;
};

export default function CVImportPage() {
  const router = useRouter();
  const [cvText, setCvText] = useState('');
  const [parsedPublications, setParsedPublications] = useState<ParsedPublication[]>([]);
  const [existingPublications, setExistingPublications] = useState<any[]>([]);
  const [missingPublications, setMissingPublications] = useState<ParsedPublication[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [authors, setAuthors] = useState<Author[]>([]);
  const [currentPublication, setCurrentPublication] = useState<ParsedPublication | null>(null);
  const [structuredAuthors, setStructuredAuthors] = useState<StructuredAuthor[]>([]);
  
  // Fetch existing publications and authors on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch publications
        const pubResponse = await fetch('/api/admin/publications');
        if (!pubResponse.ok) throw new Error('Failed to fetch publications');
        const pubData = await pubResponse.json();
        setExistingPublications(pubData.publications || []);
        
        // Fetch authors
        const authorResponse = await fetch('/api/admin/authors');
        if (!authorResponse.ok) throw new Error('Failed to fetch authors');
        const authorData = await authorResponse.json();
        setAuthors(authorData.authors || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage({ type: 'danger', text: 'Failed to load data. Please try again.' });
      }
    };
    
    fetchData();
  }, []);
  
  // Parse the CV text
  const parseCV = () => {
    if (!cvText.trim()) {
      setMessage({ type: 'warning', text: 'Please enter your CV text.' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Split the CV text into sections and publications
      const sections = cvText.split(/\n\n(?=[A-Z])/);
      let currentSection = '';
      const parsed: ParsedPublication[] = [];
      
      sections.forEach(section => {
        section = section.trim();
        if (!section) return;
        
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
        entries.forEach(entry => {
          entry = '❑' + entry; // Re-add the bullet
          const parsed_entry = parseEntry(entry, type);
          if (parsed_entry) {
            parsed.push(parsed_entry);
          }
        });
      });
      
      setParsedPublications(parsed);
      
      // Compare with existing publications
      const missing = parsed.filter(pub => {
        return !existingPublications.some(existingPub => {
          return calculateSimilarity(pub.title, existingPub.title) > 0.5;
        });
      });
      
      setMissingPublications(missing);
      
      if (missing.length > 0) {
        setMessage({ 
          type: 'success', 
          text: `Found ${parsed.length} publications in your CV, with ${missing.length} not in your database.` 
        });
      } else {
        setMessage({ 
          type: 'info', 
          text: 'All publications from your CV appear to be in the database already!' 
        });
      }
    } catch (error) {
      console.error('Error parsing CV:', error);
      setMessage({ type: 'danger', text: 'Error parsing CV. Please check the format.' });
    } finally {
      setLoading(false);
    }
  };
  
  // Parse an individual CV entry
  const parseEntry = (entry: string, pubType: string): ParsedPublication | null => {
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
        type: pubType,
        venue,
        status,
        doi,
        pdfLink: url,
        description: `${authors.join(', ')} (${year}). ${title}. ${venue}`
      };
    } catch (error) {
      console.error('Error parsing entry:', entry);
      console.error(error);
      return null;
    }
  };
  
  // Determine publication type from section heading
  const getPublicationType = (section: string): string => {
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
  };
  
  // Calculate similarity between two strings
  const calculateSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    // Simple Jaccard similarity for strings
    const words1 = new Set(s1.split(/\s+/).filter(w => w.length > 3));
    const words2 = new Set(s2.split(/\s+/).filter(w => w.length > 3));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  };
  
  // Format publication for display
  const formatPublication = (pub: ParsedPublication): string => {
    return `${pub.authors.join(', ')} (${pub.year}). ${pub.title}. ${pub.venue || ''}`;
  };
  
  // Open the publication form to add a new publication
  const openPublicationForm = (pub: ParsedPublication) => {
    setCurrentPublication(pub);
    
    // Prepare structured authors based on the author names
    const newStructuredAuthors: StructuredAuthor[] = [];
    
    pub.authors.forEach((authorName, index) => {
      // Try to find existing author
      let matchingAuthor: Author | undefined;
      
      for (const existingAuthor of authors) {
        const fullName = `${existingAuthor.firstName} ${existingAuthor.middleName || ''} ${existingAuthor.lastName}`.trim().toLowerCase();
        const lastName = existingAuthor.lastName.toLowerCase();
        
        if (authorName.toLowerCase().includes(lastName) && 
            (authorName.toLowerCase().includes(existingAuthor.firstName.toLowerCase().charAt(0)) || 
             authorName.toLowerCase().includes(existingAuthor.firstName.toLowerCase()))) {
          matchingAuthor = existingAuthor;
          break;
        }
      }
      
      if (matchingAuthor) {
        newStructuredAuthors.push({
          author: matchingAuthor,
          position: index + 1,
          isCorresponding: index === 0, // First author is corresponding
          equalContribution: false
        });
      }
    });
    
    setStructuredAuthors(newStructuredAuthors);
  };
  
  // Add a structured author
  const addStructuredAuthor = (authorId: string) => {
    const author = authors.find(a => a.id === authorId);
    if (!author) return;
    
    // Check if already added
    if (structuredAuthors.some(sa => sa.author.id === authorId)) {
      return;
    }
    
    // Determine next position number
    const nextPosition = structuredAuthors.length > 0 
      ? Math.max(...structuredAuthors.map(a => a.position)) + 1 
      : 1;
    
    setStructuredAuthors([
      ...structuredAuthors,
      {
        author,
        position: nextPosition,
        isCorresponding: nextPosition === 1, // First author is corresponding by default
        equalContribution: false
      }
    ]);
  };
  
  // Remove a structured author
  const removeStructuredAuthor = (index: number) => {
    const newAuthors = [...structuredAuthors];
    newAuthors.splice(index, 1);
    setStructuredAuthors(newAuthors);
  };
  
  // Handle structured author change
  const handleStructuredAuthorChange = (index: number, field: string, value: any) => {
    const newAuthors = [...structuredAuthors];
    newAuthors[index] = {
      ...newAuthors[index],
      [field]: value
    };
    setStructuredAuthors(newAuthors);
  };
  
  // Find author by name
  const findAuthorByName = (name: string): Author | undefined => {
    const nameLower = name.toLowerCase();
    
    return authors.find(author => {
      const fullName = `${author.firstName} ${author.middleName || ''} ${author.lastName}`.trim().toLowerCase();
      const lastFirst = `${author.lastName}, ${author.firstName}`.trim().toLowerCase();
      const firstInitialLast = `${author.firstName.charAt(0)}. ${author.lastName}`.trim().toLowerCase();
      
      return nameLower.includes(fullName) || 
             nameLower.includes(lastFirst) || 
             nameLower.includes(firstInitialLast) ||
             nameLower.includes(author.lastName.toLowerCase());
    });
  };
  
  // Save the publication to the database
  const savePublication = async () => {
    if (!currentPublication) return;
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Prepare data for the API
      const publicationData = {
        ...currentPublication,
        structuredAuthors: structuredAuthors.map(sa => ({
          authorId: sa.author.id,
          position: sa.position,
          isCorresponding: sa.isCorresponding,
          equalContribution: sa.equalContribution
        }))
      };
      
      // Create the publication
      const response = await fetch('/api/admin/publications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publicationData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create publication');
      }
      
      const result = await response.json();
      
      // Remove this publication from the missing list
      setMissingPublications(prev => prev.filter(p => p.title !== currentPublication.title));
      setCurrentPublication(null);
      
      setMessage({ 
        type: 'success',
        text: `Publication "${currentPublication.title}" added successfully!`
      });
      
      // Update existing publications
      setExistingPublications(prev => [...prev, { ...currentPublication, id: result.id }]);
      
    } catch (error) {
      console.error('Error saving publication:', error);
      setMessage({ 
        type: 'danger',
        text: 'Error saving publication. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Cancel editing
  const cancelEdit = () => {
    setCurrentPublication(null);
    setStructuredAuthors([]);
  };
  
  return (
    <AdminLayout>
      <Container className="py-4">
        <h1>CV Publication Import</h1>
        <p className="text-muted">
          Add your publications from your CV to the database.
        </p>
        
        {message.text && (
          <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
            {message.text}
          </Alert>
        )}
        
        {currentPublication ? (
          <Card className="mb-4">
            <Card.Header as="h5">Add Publication</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={currentPublication.title}
                    onChange={(e) => setCurrentPublication({
                      ...currentPublication,
                      title: e.target.value
                    })}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Year</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={currentPublication.year}
                    onChange={(e) => setCurrentPublication({
                      ...currentPublication,
                      year: parseInt(e.target.value)
                    })}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select 
                    value={currentPublication.type}
                    onChange={(e) => setCurrentPublication({
                      ...currentPublication,
                      type: e.target.value
                    })}
                  >
                    <option value="journal">Journal</option>
                    <option value="conference">Conference</option>
                    <option value="article">Article</option>
                    <option value="book">Book</option>
                    <option value="book_chapter">Book Chapter</option>
                    <option value="talk">Talk</option>
                    <option value="poster">Poster</option>
                    <option value="workshop">Workshop</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    value={currentPublication.status}
                    onChange={(e) => setCurrentPublication({
                      ...currentPublication,
                      status: e.target.value
                    })}
                  >
                    <option value="published">Published</option>
                    <option value="in_review">In Review</option>
                    <option value="in_progress">In Progress</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Venue</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={currentPublication.venue || ''}
                    onChange={(e) => setCurrentPublication({
                      ...currentPublication,
                      venue: e.target.value
                    })}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>DOI</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={currentPublication.doi || ''}
                    onChange={(e) => setCurrentPublication({
                      ...currentPublication,
                      doi: e.target.value
                    })}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>PDF Link</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={currentPublication.pdfLink || ''}
                    onChange={(e) => setCurrentPublication({
                      ...currentPublication,
                      pdfLink: e.target.value
                    })}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3}
                    value={currentPublication.description || ''}
                    onChange={(e) => setCurrentPublication({
                      ...currentPublication,
                      description: e.target.value
                    })}
                  />
                </Form.Group>
                
                <hr />
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5>Authors</h5>
                    <div>
                      <Form.Select 
                        className="d-inline-block me-2" 
                        style={{ width: 'auto' }}
                        onChange={(e) => addStructuredAuthor(e.target.value)}
                        value=""
                      >
                        <option value="">Add Author...</option>
                        {authors.map(author => (
                          <option key={author.id} value={author.id}>
                            {`${author.firstName} ${author.middleName || ''} ${author.lastName}`}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                  </div>
                  
                  {structuredAuthors.length === 0 && (
                    <Alert variant="warning">
                      <b>Original authors:</b> {currentPublication.authors.join(', ')}
                      <hr />
                      <p>No structured authors added yet. Please add authors from the dropdown above.</p>
                    </Alert>
                  )}
                  
                  {structuredAuthors.map((structuredAuthor, index) => (
                    <Card key={index} className="mb-2">
                      <Card.Body className="py-2">
                        <Row className="align-items-center">
                          <Col xs={6} md={3}>
                            <span className="fw-bold">
                              {structuredAuthor.author.firstName} {structuredAuthor.author.middleName} {structuredAuthor.author.lastName}
                            </span>
                            {structuredAuthor.author.isYou && (
                              <Badge bg="primary" className="ms-2">You</Badge>
                            )}
                          </Col>
                          <Col xs={6} md={2}>
                            <Form.Group>
                              <Form.Label className="mb-0 small">Position</Form.Label>
                              <Form.Control 
                                type="number" 
                                value={structuredAuthor.position}
                                onChange={(e) => handleStructuredAuthorChange(index, 'position', parseInt(e.target.value))}
                                size="sm"
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={6} md={3}>
                            <Form.Check 
                              type="checkbox"
                              label="Corresponding Author"
                              checked={structuredAuthor.isCorresponding}
                              onChange={(e) => handleStructuredAuthorChange(index, 'isCorresponding', e.target.checked)}
                            />
                          </Col>
                          <Col xs={6} md={3}>
                            <Form.Check 
                              type="checkbox"
                              label="Equal Contribution"
                              checked={structuredAuthor.equalContribution}
                              onChange={(e) => handleStructuredAuthorChange(index, 'equalContribution', e.target.checked)}
                            />
                          </Col>
                          <Col xs={12} md={1} className="text-end">
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => removeStructuredAuthor(index)}
                            >
                              Remove
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                  
                  {currentPublication.authors.length > 0 && (
                    <div className="mt-3">
                      <h6>Suggested Author Matches:</h6>
                      <Row>
                        {currentPublication.authors.map((authorName, index) => {
                          const match = findAuthorByName(authorName);
                          return (
                            <Col key={index} md={4} className="mb-2">
                              <Card>
                                <Card.Body className="py-2">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <small className="text-muted">From CV:</small>
                                      <div>{authorName}</div>
                                    </div>
                                    {match && (
                                      <Button 
                                        size="sm" 
                                        variant="outline-primary"
                                        onClick={() => addStructuredAuthor(match.id)}
                                        disabled={structuredAuthors.some(sa => sa.author.id === match.id)}
                                      >
                                        Add
                                      </Button>
                                    )}
                                  </div>
                                  {match ? (
                                    <div className="mt-1">
                                      <small className="text-muted">Matched to:</small>
                                      <div className="text-success">
                                        {match.firstName} {match.middleName} {match.lastName}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="mt-1 text-danger">No match found</div>
                                  )}
                                </Card.Body>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    </div>
                  )}
                </div>
                
                <div className="d-flex justify-content-end mt-4">
                  <Button variant="secondary" onClick={cancelEdit} className="me-2">
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={savePublication}
                    disabled={loading || structuredAuthors.length === 0}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ms-2">Saving...</span>
                      </>
                    ) : (
                      'Save Publication'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        ) : (
          <>
            <Card className="mb-4">
              <Card.Header as="h5">Import from CV</Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Paste Your CV Text</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={10} 
                      value={cvText}
                      onChange={(e) => setCvText(e.target.value)}
                      placeholder="Paste the publications section from your CV here..."
                    />
                    <Form.Text className="text-muted">
                      Make sure to include the section headings (e.g., "Peer-Reviewed Journal Articles").
                    </Form.Text>
                  </Form.Group>
                  
                  <Button 
                    variant="primary" 
                    onClick={parseCV}
                    disabled={loading || !cvText.trim()}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ms-2">Processing...</span>
                      </>
                    ) : (
                      'Parse CV'
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            
            {missingPublications.length > 0 && (
              <Card>
                <Card.Header as="h5">
                  Missing Publications ({missingPublications.length})
                </Card.Header>
                <Card.Body>
                  <p>The following publications from your CV are not in your database:</p>
                  
                  <div className="list-group">
                    {missingPublications.map((pub, index) => (
                      <div key={index} className="list-group-item list-group-item-action">
                        <div className="d-flex w-100 justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{pub.title}</h6>
                            <p className="mb-1">{pub.authors.join(', ')}</p>
                            <small className="text-muted">
                              {pub.year} • {pub.type} • {pub.status}
                              {pub.venue && ` • ${pub.venue}`}
                            </small>
                          </div>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => openPublicationForm(pub)}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}
          </>
        )}
      </Container>
    </AdminLayout>
  );
} 