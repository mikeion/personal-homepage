import { getNewsItems } from '@/utils/dataLoader';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const newsItems = getNewsItems();
    return NextResponse.json({ news: newsItems });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news data' },
      { status: 500 }
    );
  }
} 