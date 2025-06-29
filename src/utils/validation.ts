import DOMPurify from 'dompurify';

// Server-side sanitization
const sanitizeServerSide = (input: string): string => {
  // Basic sanitization for server-side
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

// Client-side sanitization
const sanitizeClientSide = (input: string): string => {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }
  return sanitizeServerSide(input);
};

export const sanitizeInput = (input: string): string => {
  return typeof window !== 'undefined' ? sanitizeClientSide(input) : sanitizeServerSide(input);
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isValidScholarUrl = (url: string): boolean => {
  if (!isValidUrl(url)) return false;
  return url.includes('scholar.google.com');
};

export const extractScholarId = (url: string): string | null => {
  const match = url.match(/user=([^&]+)/);
  return match ? match[1] : null;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const calculateRelevanceScore = (
  skills: string[],
  interests: string[],
  publications: string[]
): number => {
  // Simple scoring algorithm - can be enhanced
  const skillWeight = 0.4;
  const interestWeight = 0.4;
  const publicationWeight = 0.2;
  
  const skillScore = skills.length > 0 ? Math.min(skills.length / 10, 1) : 0;
  const interestScore = interests.length > 0 ? Math.min(interests.length / 5, 1) : 0;
  const publicationScore = publications.length > 0 ? Math.min(publications.length / 10, 1) : 0;
  
  return Math.round(
    (skillScore * skillWeight + interestScore * interestWeight + publicationScore * publicationWeight) * 100
  );
};

export const extractSkillsFromText = (text: string): string[] => {
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
    'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
    'Machine Learning', 'AI', 'Data Science', 'Deep Learning', 'Neural Networks', 'NLP',
    'Computer Vision', 'Big Data', 'Analytics', 'Statistics', 'Research', 'Algorithm',
    'Database', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'DevOps', 'CI/CD', 'Git', 'Jenkins',
    'Testing', 'TDD', 'Unit Testing', 'Integration Testing', 'API', 'REST', 'GraphQL',
    'Blockchain', 'Cryptocurrency', 'Web3', 'Smart Contracts', 'Solidity'
  ];
  
  const foundSkills = skillKeywords.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
  
  return [...new Set(foundSkills)]; // Remove duplicates
};

export const extractEducationFromText = (text: string) => {
  const educationPattern = /(bachelor|master|phd|doctorate|degree|university|college|institute)/gi;
  const matches = text.match(educationPattern);
  
  if (!matches) return [];
  
  // Simple education extraction - can be enhanced with more sophisticated parsing
  const lines = text.split('\n').filter(line => 
    educationPattern.test(line) && line.trim().length > 10
  );
  
  return lines.slice(0, 5); // Return first 5 education-related lines
};
