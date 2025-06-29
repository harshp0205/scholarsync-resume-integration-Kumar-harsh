import { 
  validateFileType, 
  validateFileSize, 
  isValidUrl, 
  isValidScholarUrl, 
  extractScholarId,
  extractSkillsFromText,
  calculateRelevanceScore
} from '../../src/utils/validation';

describe('Validation Utils', () => {
  describe('validateFileType', () => {
    it('should accept PDF files', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      expect(validateFileType(file)).toBe(true);
    });

    it('should accept DOCX files', () => {
      const file = new File(['content'], 'test.docx', { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      expect(validateFileType(file)).toBe(true);
    });

    it('should reject text files', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      expect(validateFileType(file)).toBe(false);
    });

    it('should reject image files', () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      expect(validateFileType(file)).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    it('should accept files under size limit', () => {
      const smallFile = new File(['x'.repeat(1024)], 'small.pdf', { type: 'application/pdf' });
      expect(validateFileSize(smallFile, 1)).toBe(true);
    });

    it('should reject files over size limit', () => {
      const largeFile = new File(['x'.repeat(2 * 1024 * 1024)], 'large.pdf', { 
        type: 'application/pdf' 
      });
      expect(validateFileSize(largeFile, 1)).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://test.org')).toBe(true);
      expect(isValidUrl('https://subdomain.example.com/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('isValidScholarUrl', () => {
    it('should validate Google Scholar URLs', () => {
      expect(isValidScholarUrl('https://scholar.google.com/citations?user=abc123')).toBe(true);
      expect(isValidScholarUrl('https://scholar.google.com/citations?user=test&hl=en')).toBe(true);
    });

    it('should reject non-Scholar URLs', () => {
      expect(isValidScholarUrl('https://google.com')).toBe(false);
      expect(isValidScholarUrl('https://example.com')).toBe(false);
      expect(isValidScholarUrl('not-a-url')).toBe(false);
    });
  });

  describe('extractScholarId', () => {
    it('should extract user ID from Scholar URLs', () => {
      expect(extractScholarId('https://scholar.google.com/citations?user=abc123')).toBe('abc123');
      expect(extractScholarId('https://scholar.google.com/citations?user=test123&hl=en')).toBe('test123');
    });

    it('should return null for URLs without user parameter', () => {
      expect(extractScholarId('https://scholar.google.com')).toBe(null);
      expect(extractScholarId('https://example.com')).toBe(null);
    });
  });

  describe('extractSkillsFromText', () => {
    it('should extract programming skills', () => {
      const text = 'I have experience with JavaScript, Python, and React development.';
      const skills = extractSkillsFromText(text);
      expect(skills).toContain('JavaScript');
      expect(skills).toContain('Python');
      expect(skills).toContain('React');
    });

    it('should extract case-insensitive skills', () => {
      const text = 'I work with JAVASCRIPT and python programming.';
      const skills = extractSkillsFromText(text);
      expect(skills).toContain('JavaScript');
      expect(skills).toContain('Python');
    });

    it('should remove duplicates', () => {
      const text = 'JavaScript and javascript are the same. Python and PYTHON too.';
      const skills = extractSkillsFromText(text);
      const jsCount = skills.filter(skill => skill.toLowerCase() === 'javascript').length;
      const pyCount = skills.filter(skill => skill.toLowerCase() === 'python').length;
      expect(jsCount).toBe(1);
      expect(pyCount).toBe(1);
    });

    it('should return empty array for text without skills', () => {
      const text = 'This is just regular text without any technical skills.';
      const skills = extractSkillsFromText(text);
      expect(skills).toEqual([]);
    });
  });

  describe('calculateRelevanceScore', () => {
    it('should calculate score based on skills, interests, and publications', () => {
      const skills = ['JavaScript', 'React', 'Node.js'];
      const interests = ['Web Development', 'AI'];
      const publications = ['Paper 1', 'Paper 2'];
      
      const score = calculateRelevanceScore(skills, interests, publications);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should return 0 for empty inputs', () => {
      const score = calculateRelevanceScore([], [], []);
      expect(score).toBe(0);
    });

    it('should handle single category inputs', () => {
      const skillsOnly = calculateRelevanceScore(['JavaScript'], [], []);
      const interestsOnly = calculateRelevanceScore([], ['AI'], []);
      const publicationsOnly = calculateRelevanceScore([], [], ['Paper 1']);
      
      expect(skillsOnly).toBeGreaterThan(0);
      expect(interestsOnly).toBeGreaterThan(0);
      expect(publicationsOnly).toBeGreaterThan(0);
    });
  });
});
