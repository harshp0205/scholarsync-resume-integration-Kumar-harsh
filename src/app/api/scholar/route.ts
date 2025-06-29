import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { isValidScholarUrl, extractScholarId } from '../../../utils/validation';
import { ScholarProfile, Publication } from '../../../types';

// Server-side DOMPurify setup
const window = new JSDOM('').window;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const purify = DOMPurify(window as any);

const sanitizeInput = (input: string): string => {
  return purify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

// Rate limiting map
const requestCounts = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(ip);
  
  if (!userRequests || now - userRequests.lastReset > RATE_LIMIT_WINDOW) {
    requestCounts.set(ip, { count: 1, lastReset: now });
    return true;
  }
  
  if (userRequests.count >= RATE_LIMIT) {
    return false;
  }
  
  userRequests.count++;
  return true;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const profileUrl = searchParams.get('url');
    const query = searchParams.get('query');
    
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    if (profileUrl) {
      return await getScholarProfile(profileUrl);
    } else if (query) {
      return await searchScholar(query);
    } else {
      return NextResponse.json(
        { success: false, error: 'Please provide either a profile URL or search query' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Google Scholar API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch Google Scholar data' 
      },
      { status: 500 }
    );
  }
}

async function getScholarProfile(url: string): Promise<NextResponse> {
  const sanitizedUrl = sanitizeInput(url);
  
  if (!isValidScholarUrl(sanitizedUrl)) {
    return NextResponse.json(
      { success: false, error: 'Invalid Google Scholar URL' },
      { status: 400 }
    );
  }
  
  try {
    const response = await fetch(sanitizedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract profile information
    const name = $('#gsc_prf_in').text().trim();
    const affiliation = $('.gsc_prf_il:first').text().trim();
    const email = $('.gsc_prf_il').filter((i, el) => $(el).text().includes('@')).text().trim();
    
    // Extract research interests
    const researchInterests: string[] = [];
    $('.gsc_prf_int a').each((i, el) => {
      researchInterests.push($(el).text().trim());
    });
    
    // Extract citation metrics
    const citationCount = parseInt($('.gsc_rsb_std').first().text().replace(/,/g, '')) || 0;
    const hIndex = parseInt($('.gsc_rsb_std').eq(2).text()) || 0;
    
    // Extract publications
    const publications: Publication[] = [];
    $('.gsc_a_tr').each((i, el) => {
      if (i < 20) { // Limit to first 20 publications
        const title = $(el).find('.gsc_a_at').text().trim();
        const authors = $(el).find('.gsc_a_at').next().text().trim();
        const venue = $(el).find('.gsc_a_at').next().next().text().trim();
        const year = parseInt($(el).find('.gsc_a_y').text()) || 0;
        const citations = parseInt($(el).find('.gsc_a_c').text()) || 0;
        const url = 'https://scholar.google.com' + $(el).find('.gsc_a_at').attr('href');
        
        if (title) {
          publications.push({
            title,
            authors: authors.split(',').map(a => a.trim()),
            year,
            venue,
            citations,
            url
          });
        }
      }
    });
    
    const profile: ScholarProfile = {
      name,
      affiliation,
      email: email || undefined,
      researchInterests,
      publications,
      citationCount,
      hIndex
    };
    
    return NextResponse.json({
      success: true,
      data: profile
    });
    
  } catch (error) {
    console.error('Error scraping Google Scholar profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Google Scholar profile' },
      { status: 500 }
    );
  }
}

async function searchScholar(query: string): Promise<NextResponse> {
  const sanitizedQuery = sanitizeInput(query);
  
  if (!sanitizedQuery || sanitizedQuery.length < 3) {
    return NextResponse.json(
      { success: false, error: 'Search query must be at least 3 characters long' },
      { status: 400 }
    );
  }
  
  try {
    const searchUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(sanitizedQuery)}&hl=en`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const publications: Publication[] = [];
    
    $('.gs_r.gs_or.gs_scl').each((i, el) => {
      if (i < 10) { // Limit to first 10 results
        const $el = $(el);
        const title = $el.find('.gs_rt a').text().trim();
        const authorsAndVenue = $el.find('.gs_a').text().trim();
        const snippet = $el.find('.gs_rs').text().trim();
        const citationText = $el.find('.gs_fl a').filter((i, link) => $(link).text().includes('Cited by')).text();
        const citations = citationText ? parseInt(citationText.match(/\d+/)?.[0] || '0') : 0;
        const url = $el.find('.gs_rt a').attr('href');
        
        if (title) {
          // Parse authors and venue (simplified)
          const parts = authorsAndVenue.split(' - ');
          const authors = parts[0] ? parts[0].split(',').map(a => a.trim()) : [];
          const venue = parts[1] || '';
          
          // Extract year
          const yearMatch = authorsAndVenue.match(/\b(19|20)\d{2}\b/);
          const year = yearMatch ? parseInt(yearMatch[0]) : 0;
          
          publications.push({
            title,
            authors,
            year,
            venue,
            citations,
            url: url || undefined,
            abstract: snippet || undefined
          });
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: publications
    });
    
  } catch (error) {
    console.error('Error searching Google Scholar:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search Google Scholar' },
      { status: 500 }
    );
  }
}
