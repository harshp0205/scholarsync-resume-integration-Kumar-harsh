import { NextRequest, NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { 
  validateFileType, 
  validateFileSize, 
  extractSkillsFromText,
  extractEducationFromText 
} from '../../../utils/validation';
import { ParseResumeResponse, ExperienceEntry, EducationEntry } from '../../../types';

// Server-side DOMPurify setup
const window = new JSDOM('').window;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const purify = DOMPurify(window as any);

const sanitizeInput = (input: string): string => {
  return purify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Create a new FormData from the request
    const formData = await request.formData();
    const file = formData.get('resume') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Validate file
    if (!validateFileType(file)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only PDF and DOCX files are allowed.' },
        { status: 400 }
      );
    }
    
    if (!validateFileSize(file, 10)) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = '';
    
    // Parse based on file type
    if (file.type === 'application/pdf') {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    }
    
    // Sanitize extracted text
    extractedText = sanitizeInput(extractedText);
    
    // Extract information from text
    const skills = extractSkillsFromText(extractedText);
    const educationLines = extractEducationFromText(extractedText);
    
    // Parse experience (simplified - can be enhanced)
    const experience: ExperienceEntry[] = extractExperience(extractedText);
    
    // Parse education (simplified - can be enhanced)
    const education: EducationEntry[] = parseEducation(educationLines);
    
    // Extract research interests
    const researchInterests = extractResearchInterests(extractedText);
    
    const response: ParseResumeResponse = {
      extractedText,
      skills,
      experience,
      education,
      researchInterests,
    };
    
    return NextResponse.json({
      success: true,
      data: response,
    });
    
  } catch (error) {
    console.error('Resume parsing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to parse resume' 
      },
      { status: 500 }
    );
  }
}

function extractExperience(text: string): ExperienceEntry[] {
  const lines = text.split('\n');
  const experience: ExperienceEntry[] = [];
  
  // Simple pattern matching for experience
  const experienceKeywords = ['experience', 'work', 'employment', 'position', 'role'];
  let inExperienceSection = false;
  let currentEntry: Partial<ExperienceEntry> = {};
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim();
    
    if (experienceKeywords.some(keyword => lowerLine.includes(keyword))) {
      inExperienceSection = true;
      continue;
    }
    
    if (inExperienceSection && line.trim()) {
      // Try to parse job entries (simplified)
      if (line.includes('•') || line.includes('-')) {
        if (currentEntry.title) {
          currentEntry.description = (currentEntry.description || '') + line.trim() + ' ';
        }
      } else if (line.trim().length > 10) {
        if (currentEntry.title) {
          experience.push(currentEntry as ExperienceEntry);
        }
        currentEntry = {
          title: line.trim(),
          company: '',
          duration: '',
          description: '',
        };
      }
    }
  }
  
  if (currentEntry.title) {
    experience.push(currentEntry as ExperienceEntry);
  }
  
  return experience.slice(0, 5); // Return first 5 entries
}

function parseEducation(educationLines: string[]): EducationEntry[] {
  return educationLines.map((line, index) => ({
    degree: line.includes('PhD') || line.includes('Doctorate') ? 'PhD' : 
            line.includes('Master') ? 'Masters' : 
            line.includes('Bachelor') ? 'Bachelors' : 'Degree',
    institution: extractInstitution(line),
    year: extractYear(line),
    field: extractField(line),
  })).slice(0, 3);
}

function extractInstitution(text: string): string {
  const institutionWords = ['university', 'college', 'institute', 'school'];
  const words = text.split(' ');
  
  for (let i = 0; i < words.length; i++) {
    if (institutionWords.some(inst => words[i].toLowerCase().includes(inst))) {
      return words.slice(Math.max(0, i-2), i+3).join(' ');
    }
  }
  
  return text.slice(0, 50);
}

function extractYear(text: string): string {
  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? yearMatch[0] : '';
}

function extractField(text: string): string {
  const fields = [
    'Computer Science', 'Engineering', 'Mathematics', 'Physics', 'Chemistry',
    'Biology', 'Psychology', 'Business', 'Economics', 'Medicine', 'Law'
  ];
  
  for (const field of fields) {
    if (text.toLowerCase().includes(field.toLowerCase())) {
      return field;
    }
  }
  
  return 'General';
}

function extractResearchInterests(text: string): string[] {
  const researchKeywords = [
    'Machine Learning', 'Artificial Intelligence', 'Data Science', 'Computer Vision',
    'Natural Language Processing', 'Robotics', 'Cybersecurity', 'Blockchain',
    'Software Engineering', 'Human-Computer Interaction', 'Networks', 'Algorithms'
  ];
  
  return researchKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
}
