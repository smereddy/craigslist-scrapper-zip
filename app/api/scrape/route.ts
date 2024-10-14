import { NextResponse } from 'next/server';
import { parse } from 'node-html-parser';

export async function POST(req: Request) {
  try {
    const { searchTerm, zipCode } = await req.json();

    if (!searchTerm || !zipCode) {
      return NextResponse.json({ error: 'Missing searchTerm or zipCode' }, { status: 400 });
    }

    const url = `https://${zipCode}.craigslist.org/search/sss?query=${encodeURIComponent(searchTerm)}&search_distance=100&sort=date`;
    
    console.log('Fetching URL:', url);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const root = parse(html);

    const listings = root.querySelectorAll('.result-info').map((el) => {
      const titleEl = el.querySelector('.result-title');
      const priceEl = el.querySelector('.result-price');
      const dateEl = el.querySelector('.result-date');

      return {
        title: titleEl?.text || 'No title',
        link: titleEl?.getAttribute('href') || '#',
        price: priceEl?.text || 'Price not listed',
        date: dateEl?.getAttribute('datetime') || 'Date not available',
      };
    });

    console.log('Listings found:', listings.length);

    return NextResponse.json(listings);
  } catch (error) {
    console.error('Error scraping Craigslist:', error);
    return NextResponse.json({ error: 'Failed to scrape Craigslist' }, { status: 500 });
  }
}

export async function OPTIONS(req: Request) {
  return NextResponse.json({}, { headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }});
}