import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Ensure only admin can access this endpoint
async function checkAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    return false;
  }
  
  return true;
}

// POST /api/admin/ai-assist
// Generate descriptions and keywords for publications
export async function POST(request: Request) {
  const isAuthenticated = await checkAuth();
  
  if (!isAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const { title, authors, venue, publicationType } = await request.json();
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    // Prepare the prompt for the LLM
    const prompt = `
      Please help me write a short, professional description (2-3 sentences) for my ${publicationType || 'research publication'} and suggest 3-5 relevant keywords.
      
      Title: ${title}
      Authors: ${authors?.join(', ') || ''}
      Venue: ${venue || ''}
      
      The description should be concise, written in third person, and highlight the key contribution of the work.
      
      Format your response as JSON with:
      - "description": The suggested description
      - "keywords": An array of suggested keywords
    `;
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful academic writing assistant for a researcher in AI and education.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' }
    });
    
    // Parse the result
    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return NextResponse.json({
      description: result.description || '',
      keywords: result.keywords || []
    });
    
  } catch (error) {
    console.error('Error generating AI content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
} 