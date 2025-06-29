export interface ResumeData {
  id: string;
  fileName: string;
  uploadedAt: string;
  extractedText: string;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  researchInterests: string[];
}

export interface ExperienceEntry {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
  field: string;
}

export interface ScholarProfile {
  name: string;
  affiliation: string;
  email?: string;
  researchInterests: string[];
  publications: Publication[];
  citationCount: number;
  hIndex: number;
}

export interface Publication {
  title: string;
  authors: string[];
  year: number;
  venue: string;
  citations: number;
  url?: string;
  abstract?: string;
}

export interface ProjectSuggestion {
  id: string;
  title: string;
  description: string;
  relevanceScore: number;
  matchingSkills: string[];
  suggestedCollaborators: ScholarProfile[];
  relatedPublications: Publication[];
  estimatedDuration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  categories: string[];
  source?: 'ai' | 'template'; // Indicates whether suggestion is AI-generated or template-based
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export interface SearchState {
  isSearching: boolean;
  query: string;
  results: ProjectSuggestion[];
  error: string | null;
}

export interface AppState {
  resume: ResumeData | null;
  upload: UploadState;
  search: SearchState;
  suggestions: ProjectSuggestion[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ParseResumeResponse {
  extractedText: string;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  researchInterests: string[];
}

export interface GoogleScholarSearchParams {
  query: string;
  maxResults?: number;
  year?: number;
  author?: string;
}
