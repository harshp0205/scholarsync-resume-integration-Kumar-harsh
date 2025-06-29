import { ResumeData, ScholarProfile, ProjectSuggestion } from '../types';

// Dynamic import for better error handling
let GoogleGenerativeAI: any = null;

// Initialize the Gemini AI client with error handling
const initializeAI = async () => {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn('Google Gemini API key not found. AI suggestions will be disabled.');
    return null;
  }
  
  if (apiKey === 'your_gemini_api_key_here' || apiKey === 'AIzaSyCMockKey_GetYourRealKeyFromGoogleAIStudio') {
    console.warn('Google Gemini API key is not configured properly. Please set a valid API key in .env.local');
    console.warn('Get your free API key from: https://aistudio.google.com/app/apikey');
    return null;
  }
  
  try {
    // Dynamic import to handle missing package gracefully
    if (!GoogleGenerativeAI) {
      const module = await import('@google/generative-ai');
      GoogleGenerativeAI = module.GoogleGenerativeAI;
    }
    
    return new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error('Failed to initialize Google Gemini AI:', error);
    console.log('Falling back to template-based suggestions');
    return null;
  }
};

export interface AIGeneratedSuggestion {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  categories: string[];
  relevanceReasoning: string;
}

export const generateAISuggestions = async (
  resume: ResumeData,
  scholarProfile?: ScholarProfile,
  maxSuggestions: number = 8
): Promise<ProjectSuggestion[]> => {
  const genAI = await initializeAI();
  
  if (!genAI || process.env.AI_ENABLED !== 'true') {
    console.log('AI suggestions disabled or unavailable, falling back to template-based suggestions');
    return [];
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create a comprehensive prompt for project suggestions
    const prompt = createProjectSuggestionsPrompt(resume, maxSuggestions, scholarProfile);
    
    console.log('Requesting AI-generated project suggestions...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('AI Response received:', text.substring(0, 200) + '...');
    
    // Parse the AI response into structured suggestions
    const aiSuggestions = parseAIResponse(text);
    
    // Convert AI suggestions to ProjectSuggestion format
    return aiSuggestions.map((suggestion, index) => ({
      id: `ai-generated-${index + 1}`,
      title: suggestion.title,
      description: suggestion.description,
      relevanceScore: calculateAIRelevanceScore(suggestion, resume, scholarProfile),
      matchingSkills: extractMatchingSkills(suggestion, resume),
      suggestedCollaborators: [],
      relatedPublications: scholarProfile?.publications?.slice(0, 2) || [],
      estimatedDuration: suggestion.duration,
      difficulty: suggestion.difficulty,
      categories: suggestion.categories,
      source: 'ai' as const // Mark as AI-generated
    }));
    
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return [];
  }
};

function createProjectSuggestionsPrompt(
  resume: ResumeData,
  maxSuggestions: number,
  scholarProfile?: ScholarProfile
): string {
  const skills = resume.skills.join(', ');
  const researchInterests = resume.researchInterests.join(', ');
  const experience = resume.experience.map(exp => `${exp.title} at ${exp.company}`).join(', ');
  const education = resume.education.map(edu => `${edu.degree} in ${edu.field} from ${edu.institution}`).join(', ');
  
  const scholarInfo = scholarProfile ? `
Scholar Profile:
- Research Interests: ${scholarProfile.researchInterests.join(', ')}
- Publications: ${scholarProfile.publications.length} publications
- Citation Count: ${scholarProfile.citationCount}
- H-Index: ${scholarProfile.hIndex}
` : '';

  return `You are an AI research assistant that generates innovative project suggestions for academic researchers and professionals. Based on the following profile, generate ${maxSuggestions} unique, relevant, and innovative project suggestions.

Profile Information:
- Skills: ${skills}
- Research Interests: ${researchInterests}
- Experience: ${experience}
- Education: ${education}
${scholarInfo}

Please generate project suggestions that are:
1. Innovative and forward-thinking
2. Relevant to the person's skills and interests
3. Feasible and realistic in scope
4. Diverse across different domains and applications
5. Include both technical and research-oriented projects
6. Range from intermediate to advanced difficulty levels

For each project suggestion, provide:
- Title: A compelling, specific project title
- Description: A detailed description (2-3 sentences) explaining the project's objectives, approach, and potential impact
- Difficulty: Beginner, Intermediate, or Advanced
- Duration: Estimated project duration (e.g., "3-6 months", "6-12 months")
- Categories: 2-3 relevant categories/tags
- Relevance: Brief explanation of why this project matches the profile

Format your response as a JSON array of objects with these fields:
[
  {
    "title": "Project Title",
    "description": "Detailed project description...",
    "difficulty": "Intermediate",
    "duration": "6-12 months",
    "categories": ["Category1", "Category2", "Category3"],
    "relevanceReasoning": "Why this project is relevant..."
  }
]

Focus on cutting-edge technologies, interdisciplinary approaches, and real-world applications. Consider emerging trends in AI, data science, sustainability, digital health, and other relevant fields.`;
}

function parseAIResponse(response: string): AIGeneratedSuggestion[] {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }
    
    const jsonString = jsonMatch[0];
    const parsed = JSON.parse(jsonString);
    
    if (!Array.isArray(parsed)) {
      throw new Error('Response is not an array');
    }
    
    // Validate and clean the parsed suggestions
    return parsed.filter(suggestion => 
      suggestion.title && 
      suggestion.description && 
      suggestion.difficulty && 
      suggestion.duration &&
      suggestion.categories &&
      Array.isArray(suggestion.categories)
    ).map(suggestion => ({
      title: suggestion.title.trim(),
      description: suggestion.description.trim(),
      difficulty: validateDifficulty(suggestion.difficulty),
      duration: suggestion.duration.trim(),
      categories: suggestion.categories.slice(0, 3), // Limit to 3 categories
      relevanceReasoning: suggestion.relevanceReasoning || ''
    }));
    
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    console.log('Raw response:', response);
    return [];
  }
}

function validateDifficulty(difficulty: string): 'Beginner' | 'Intermediate' | 'Advanced' {
  const normalizedDifficulty = difficulty.toLowerCase();
  if (normalizedDifficulty.includes('beginner') || normalizedDifficulty.includes('basic')) {
    return 'Beginner';
  } else if (normalizedDifficulty.includes('advanced') || normalizedDifficulty.includes('expert')) {
    return 'Advanced';
  }
  return 'Intermediate';
}

function calculateAIRelevanceScore(
  suggestion: AIGeneratedSuggestion,
  resume: ResumeData,
  scholarProfile?: ScholarProfile
): number {
  let score = 70; // Base score for AI-generated suggestions
  
  // Check skill relevance
  const userSkills = [...resume.skills, ...resume.researchInterests].map(s => s.toLowerCase());
  const suggestionText = (suggestion.title + ' ' + suggestion.description + ' ' + suggestion.categories.join(' ')).toLowerCase();
  
  const skillMatches = userSkills.filter(skill => 
    suggestionText.includes(skill.toLowerCase())
  ).length;
  
  score += skillMatches * 3;
  
  // Add points for scholar profile alignment
  if (scholarProfile) {
    score += 10;
    const interestMatches = scholarProfile.researchInterests.filter(interest =>
      suggestionText.includes(interest.toLowerCase())
    ).length;
    score += interestMatches * 5;
  }
  
  // Add points based on experience level
  const hasAdvancedBackground = resume.experience.length > 2 || 
    resume.education.some(edu => edu.degree.includes('PhD') || edu.degree.includes('Master'));
  
  if (suggestion.difficulty === 'Advanced' && hasAdvancedBackground) {
    score += 10;
  } else if (suggestion.difficulty === 'Intermediate') {
    score += 5;
  }
  
  // Add some randomness for variety
  score += Math.random() * 5;
  
  return Math.min(Math.max(score, 60), 100);
}

function extractMatchingSkills(suggestion: AIGeneratedSuggestion, resume: ResumeData): string[] {
  const userSkills = [...resume.skills, ...resume.researchInterests];
  const suggestionText = (suggestion.title + ' ' + suggestion.description + ' ' + suggestion.categories.join(' ')).toLowerCase();
  
  return userSkills.filter(skill => 
    suggestionText.includes(skill.toLowerCase())
  ).slice(0, 5); // Limit to top 5 matching skills
}

// Helper function to test AI connectivity
export const testAIConnection = async (): Promise<boolean> => {
  const genAI = await initializeAI();
  
  if (!genAI) {
    return false;
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Hello, can you respond with just "OK"?');
    const response = await result.response;
    const text = response.text();
    return text.toLowerCase().includes('ok');
  } catch (error) {
    console.error('AI connection test failed:', error);
    return false;
  }
};
