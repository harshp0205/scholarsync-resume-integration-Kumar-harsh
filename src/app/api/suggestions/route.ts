import { NextRequest, NextResponse } from 'next/server';
import { generateProjectSuggestions } from '../../../utils/projectGenerator';
import { ResumeData, ScholarProfile } from '../../../types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { resume, scholarProfile } = body;
    
    console.log('Suggestions API called with:', {
      hasResume: !!resume,
      resumeSkills: resume?.skills,
      hasScholarProfile: !!scholarProfile
    });
    
    if (!resume) {
      return NextResponse.json(
        { success: false, error: 'Resume data is required' },
        { status: 400 }
      );
    }
    
    // Generate project suggestions based on resume and optional scholar profile
    const suggestions = await generateProjectSuggestions(
      resume as ResumeData,
      scholarProfile as ScholarProfile | undefined
    );
    
    console.log('Generated suggestions count:', suggestions.length);
    
    return NextResponse.json({
      success: true,
      data: suggestions
    });
    
  } catch (error) {
    console.error('Project suggestions error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate project suggestions' 
      },
      { status: 500 }
    );
  }
}
