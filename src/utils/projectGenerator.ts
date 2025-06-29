import { ResumeData, ProjectSuggestion, ScholarProfile } from '../types';
import { generateAISuggestions } from './aiService';

// Define comprehensive skill categories and their related projects
const SKILL_CATEGORIES: Record<string, string[]> = {
  'AI_ML': ['Machine Learning', 'AI', 'Artificial Intelligence', 'Deep Learning', 'Neural Networks', 'TensorFlow', 'PyTorch', 'Keras', 'Computer Vision', 'NLP', 'Natural Language Processing', 'Scikit-learn', 'OpenCV'],
  'DATA_SCIENCE': ['Data Science', 'Python', 'R', 'Statistics', 'Analytics', 'Big Data', 'Data Mining', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'Jupyter', 'Tableau', 'Power BI'],
  'WEB_DEVELOPMENT': ['JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Next.js', 'HTML', 'CSS', 'Frontend', 'Backend', 'Full Stack', 'Express', 'Django', 'Flask'],
  'MOBILE_DEVELOPMENT': ['iOS', 'Android', 'React Native', 'Flutter', 'Swift', 'Kotlin', 'Mobile Development', 'App Development', 'Xamarin'],
  'DATABASE': ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Database', 'NoSQL', 'Redis', 'Elasticsearch', 'Oracle', 'SQLite'],
  'CLOUD_DEVOPS': ['AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'DevOps', 'CI/CD', 'Jenkins', 'Terraform', 'Ansible'],
  'BLOCKCHAIN': ['Blockchain', 'Web3', 'Smart Contracts', 'Solidity', 'Ethereum', 'DeFi', 'Cryptocurrency', 'Bitcoin', 'NFT'],
  'CYBERSECURITY': ['Security', 'Cybersecurity', 'Penetration Testing', 'Cryptography', 'Network Security', 'Information Security', 'Ethical Hacking'],
  'RESEARCH': ['Research', 'Academic', 'Publication', 'Analysis', 'Study', 'Investigation', 'Methodology', 'Literature Review'],
  'BUSINESS': ['Business', 'Management', 'Strategy', 'Analytics', 'Consulting', 'Finance', 'Marketing', 'Operations'],
  'DESIGN': ['UI/UX', 'Design', 'Figma', 'Adobe', 'Photoshop', 'Illustrator', 'User Experience', 'User Interface', 'Graphic Design'],
  'GAME_DEVELOPMENT': ['Unity', 'Unreal Engine', 'Game Development', 'C#', 'C++', 'Gaming', 'Game Design'],
  'IOT_HARDWARE': ['IoT', 'Internet of Things', 'Arduino', 'Raspberry Pi', 'Hardware', 'Embedded Systems', 'Sensors'],
  'ROBOTICS': ['Robotics', 'Automation', 'ROS', 'Robot Operating System', 'Computer Vision', 'Sensor Fusion'],
  'BIOINFORMATICS': ['Bioinformatics', 'Computational Biology', 'Genomics', 'Proteomics', 'BLAST', 'Bioconductor'],
  'MATHEMATICS': ['Mathematics', 'Statistics', 'Linear Algebra', 'Calculus', 'Probability', 'Mathematical Modeling'],
  'PHYSICS': ['Physics', 'Quantum', 'Computational Physics', 'Simulation', 'Modeling'],
  'CHEMISTRY': ['Chemistry', 'Computational Chemistry', 'Molecular Modeling', 'ChemML'],
  'SOCIAL_SCIENCE': ['Psychology', 'Sociology', 'Anthropology', 'Political Science', 'Social Research', 'Survey Research'],
  'EDUCATION': ['Education', 'E-learning', 'Educational Technology', 'Pedagogy', 'Online Learning', 'MOOC']
};

// Project template interface
interface ProjectTemplate {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  categories: string[];
}

// Enhanced project templates with more diverse suggestions
const PROJECT_TEMPLATES: Record<string, ProjectTemplate[]> = {
  'AI_ML': [
    {
      title: 'Advanced Neural Network Architecture Research',
      description: 'Develop novel neural network architectures for improved performance in computer vision tasks. This project involves designing and implementing new attention mechanisms and exploring transformer variants.',
      difficulty: 'Advanced',
      duration: '6-12 months',
      categories: ['Machine Learning', 'Research', 'Computer Vision']
    },
    {
      title: 'AI-Powered Research Assistant',
      description: 'Create an intelligent research assistant that can analyze academic papers, summarize findings, and suggest research directions using advanced NLP and knowledge graphs.',
      difficulty: 'Advanced',
      duration: '10-18 months',
      categories: ['NLP', 'Knowledge Management', 'Academic Tools']
    },
    {
      title: 'Federated Learning for Privacy-Preserving AI',
      description: 'Research and implement federated learning systems that enable collaborative machine learning without centralizing sensitive data, focusing on healthcare and financial applications.',
      difficulty: 'Advanced',
      duration: '8-15 months',
      categories: ['Machine Learning', 'Privacy', 'Distributed Systems']
    },
    {
      title: 'Explainable AI for Scientific Discovery',
      description: 'Develop interpretable machine learning models that can explain their decision-making process in scientific research contexts, enhancing trust and understanding.',
      difficulty: 'Advanced',
      duration: '12-20 months',
      categories: ['Explainable AI', 'Scientific Computing', 'Model Interpretation']
    }
  ],
  'DATA_SCIENCE': [
    {
      title: 'Academic Publication Impact Analysis',
      description: 'Analyze large datasets of academic publications to identify trends, predict citation patterns, and discover emerging research areas using advanced statistical methods.',
      difficulty: 'Intermediate',
      duration: '3-6 months',
      categories: ['Data Science', 'Academic Research', 'Analytics']
    },
    {
      title: 'Real-time Research Trend Detection',
      description: 'Develop a system that monitors academic databases and social media to detect emerging research trends and hot topics in real-time.',
      difficulty: 'Advanced',
      duration: '6-12 months',
      categories: ['Trend Analysis', 'Real-time Systems', 'Text Mining']
    },
    {
      title: 'Research Collaboration Network Analysis',
      description: 'Study patterns in academic collaborations using network analysis, identifying key influencers and predicting future collaboration opportunities.',
      difficulty: 'Intermediate',
      duration: '4-8 months',
      categories: ['Network Analysis', 'Social Science', 'Graph Theory']
    },
    {
      title: 'Scientific Data Visualization Platform',
      description: 'Create an advanced platform for visualizing complex scientific datasets with interactive dashboards and custom visualization tools.',
      difficulty: 'Intermediate',
      duration: '5-10 months',
      categories: ['Data Visualization', 'Scientific Computing', 'Interactive Design']
    }
  ],
  'WEB_DEVELOPMENT': [
    {
      title: 'Real-time Collaborative Research Platform',
      description: 'Build a modern web platform for researchers to collaborate in real-time, share findings, and manage research projects with advanced features.',
      difficulty: 'Intermediate',
      duration: '4-8 months',
      categories: ['Web Development', 'Collaboration Tools', 'Real-time Systems']
    },
    {
      title: 'Open Science Knowledge Repository',
      description: 'Create a next-generation repository for open science that supports multiple data formats, version control, and collaborative annotation.',
      difficulty: 'Advanced',
      duration: '8-15 months',
      categories: ['Open Science', 'Knowledge Management', 'Version Control']
    },
    {
      title: 'Academic Conference Management System',
      description: 'Develop a comprehensive system for managing academic conferences, including paper submissions, peer review, and virtual presentation capabilities.',
      difficulty: 'Intermediate',
      duration: '6-12 months',
      categories: ['Event Management', 'Academic Tools', 'Web Applications']
    },
    {
      title: 'Interactive Academic Portfolio Builder',
      description: 'Build a platform where researchers can create interactive portfolios showcasing their work with embedded visualizations and live demos.',
      difficulty: 'Intermediate',
      duration: '4-9 months',
      categories: ['Portfolio Management', 'Interactive Design', 'Academic Branding']
    }
  ],
  'RESEARCH': [
    {
      title: 'Meta-Analysis Automation Tool',
      description: 'Develop automated tools for conducting systematic reviews and meta-analyses, reducing time and improving consistency in research synthesis.',
      difficulty: 'Advanced',
      duration: '6-12 months',
      categories: ['Research Methodology', 'Automation', 'Evidence Synthesis']
    },
    {
      title: 'Cross-Disciplinary Research Mapper',
      description: 'Create a platform that identifies potential collaborations across different research disciplines by analyzing publication patterns and methodologies.',
      difficulty: 'Advanced',
      duration: '8-15 months',
      categories: ['Interdisciplinary Research', 'Collaboration Discovery', 'Academic Analytics']
    },
    {
      title: 'Research Reproducibility Framework',
      description: 'Design a comprehensive framework for ensuring research reproducibility, including automated experiment logging and result verification.',
      difficulty: 'Advanced',
      duration: '10-18 months',
      categories: ['Research Methodology', 'Reproducibility', 'Quality Assurance']
    }
  ],
  'MOBILE_DEVELOPMENT': [
    {
      title: 'Mobile Research Data Collection App',
      description: 'Create a mobile application for field researchers to collect, annotate, and synchronize data across multiple devices with offline capabilities.',
      difficulty: 'Intermediate',
      duration: '5-10 months',
      categories: ['Mobile Apps', 'Data Collection', 'Field Research']
    },
    {
      title: 'AR-Enhanced Laboratory Assistant',
      description: 'Develop an augmented reality mobile app that assists researchers in laboratory settings with equipment guidance and safety protocols.',
      difficulty: 'Advanced',
      duration: '8-14 months',
      categories: ['Augmented Reality', 'Laboratory Technology', 'Safety Systems']
    }
  ]
};

export const generateProjectSuggestions = async (
  resume: ResumeData,
  scholarProfile?: ScholarProfile
): Promise<ProjectSuggestion[]> => {
  console.log('Generating suggestions for resume:', {
    skills: resume.skills,
    researchInterests: resume.researchInterests,
    hasScholarProfile: !!scholarProfile
  });

  // Primary: AI-generated suggestions
  try {
    console.log('Attempting to generate AI suggestions...');
    const aiSuggestions = await generateAISuggestions(resume, scholarProfile, 12);
    
    if (aiSuggestions.length >= 6) {
      console.log(`Generated ${aiSuggestions.length} AI suggestions - using AI-only approach`);
      return aiSuggestions
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 12);
    } else if (aiSuggestions.length > 0) {
      console.log(`Generated ${aiSuggestions.length} AI suggestions - supplementing with minimal template fallback`);
      // Only add 2-3 high-quality template suggestions if AI provided some but not enough
      const templateSuggestions = generateMinimalTemplateSuggestions(resume, scholarProfile, 3);
      const allSuggestions = [...aiSuggestions, ...templateSuggestions];
      
      return allSuggestions
        .sort((a: ProjectSuggestion, b: ProjectSuggestion) => b.relevanceScore - a.relevanceScore)
        .slice(0, 10);
    } else {
      console.log('No AI suggestions generated - AI service unavailable');
    }
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    console.log('AI service failed - providing minimal fallback');
  }

  // Fallback: Minimal template-based suggestions only when AI is completely unavailable
  console.log('Using template-based fallback (AI unavailable)');
  const fallbackSuggestions = generateMinimalTemplateSuggestions(resume, scholarProfile, 8);
  
  return fallbackSuggestions
    .sort((a: ProjectSuggestion, b: ProjectSuggestion) => b.relevanceScore - a.relevanceScore)
    .slice(0, 8);
};

// Minimal template-based suggestion generation (used only as last resort)
function generateMinimalTemplateSuggestions(
  resume: ResumeData,
  scholarProfile?: ScholarProfile,
  maxSuggestions: number = 8
): ProjectSuggestion[] {
  const suggestions: ProjectSuggestion[] = [];
  let suggestionId = 1;

  // Create only high-quality, generic suggestions based on user profile
  const baseScore = 65; // Lower base score to indicate these are fallback suggestions
  
  // Add scholar profile-based suggestions if available
  if (scholarProfile?.researchInterests?.length) {
    const interest = scholarProfile.researchInterests[0]; // Use primary interest
    suggestions.push({
      id: `fallback-scholar-${suggestionId++}`,
      title: `Advanced ${interest} Research Initiative`,
      description: `Explore cutting-edge developments in ${interest} with focus on practical applications and theoretical advancements. This project leverages your existing research background to push the boundaries of knowledge in this field.`,
      relevanceScore: baseScore + Math.random() * 10,
      matchingSkills: resume.skills.slice(0, 3),
      suggestedCollaborators: [],
      relatedPublications: scholarProfile.publications.slice(0, 2),
      estimatedDuration: '8-15 months',
      difficulty: 'Advanced',
      categories: ['Research', interest, 'Academic'],
      source: 'template' // Add source indicator
    });
  }

  // Add generic high-quality research suggestions
  const genericSuggestions = [
    {
      title: 'Cross-Disciplinary Research Platform',
      description: 'Develop a platform that bridges different research domains, enabling collaboration between diverse academic fields and promoting interdisciplinary innovation with advanced analytics.',
      difficulty: 'Intermediate' as const,
      duration: '6-10 months',
      categories: ['Research', 'Platform Development', 'Collaboration']
    },
    {
      title: 'AI-Powered Research Analysis Tool',
      description: 'Create an intelligent tool for analyzing research trends, identifying gaps, and suggesting new research directions using machine learning and natural language processing.',
      difficulty: 'Advanced' as const,
      duration: '8-12 months',
      categories: ['AI/ML', 'Research Tools', 'Data Analysis']
    },
    {
      title: 'Open Science Communication Platform',
      description: 'Build a platform dedicated to improving science communication, making research more accessible through interactive visualizations and plain language summaries.',
      difficulty: 'Intermediate' as const,
      duration: '5-10 months',
      categories: ['Science Communication', 'Public Engagement', 'Open Science']
    },
    {
      title: 'Digital Research Methodology Framework',
      description: 'Develop a comprehensive framework for digital research methodologies, incorporating modern tools and best practices for data collection and analysis.',
      difficulty: 'Advanced' as const,
      duration: '6-12 months',
      categories: ['Research Methodology', 'Digital Tools', 'Framework Development']
    },
    {
      title: 'Research Impact Analysis System',
      description: 'Build an advanced system for analyzing and visualizing the impact of academic research across different domains with predictive analytics capabilities.',
      difficulty: 'Advanced' as const,
      duration: '5-9 months',
      categories: ['Analytics', 'Research Tools', 'Data Science']
    }
  ];

  // Add generic suggestions up to maxSuggestions limit
  let added = 0;
  for (const template of genericSuggestions) {
    if (suggestions.length >= maxSuggestions) break;
    
    suggestions.push({
      id: `fallback-generic-${suggestionId++}`,
      title: template.title,
      description: template.description,
      relevanceScore: baseScore + Math.random() * 8,
      matchingSkills: resume.skills.slice(0, 3),
      suggestedCollaborators: [],
      relatedPublications: [],
      estimatedDuration: template.duration,
      difficulty: template.difficulty,
      categories: template.categories,
      source: 'template' // Add source indicator
    });
    added++;
  }

  return suggestions.slice(0, maxSuggestions);
}

// Template-based suggestion generation (legacy fallback method)
function generateTemplateSuggestions(
  resume: ResumeData,
  scholarProfile?: ScholarProfile
): ProjectSuggestion[] {
  const suggestions: ProjectSuggestion[] = [];
  
  // Find matching skill categories with relevance scores
  const categoryMatches: Array<{ category: string; score: number; matchingSkills: string[] }> = [];
  const userSkills = [...resume.skills, ...resume.researchInterests];
  
  for (const [category, categorySkills] of Object.entries(SKILL_CATEGORIES)) {
    const matchingSkills = userSkills.filter(skill => 
      categorySkills.some(catSkill => {
        const skillLower = skill.toLowerCase();
        const catSkillLower = catSkill.toLowerCase();
        return skillLower.includes(catSkillLower) || 
               catSkillLower.includes(skillLower) ||
               // Add fuzzy matching for common variations
               (skillLower.includes('ml') && catSkillLower.includes('machine learning')) ||
               (skillLower.includes('ai') && catSkillLower.includes('artificial intelligence'));
      })
    );
    
    if (matchingSkills.length > 0) {
      const score = calculateCategoryRelevance(matchingSkills, categorySkills);
      categoryMatches.push({ category, score, matchingSkills });
    }
  }

  // Sort categories by relevance
  categoryMatches.sort((a, b) => b.score - a.score);
  
  // Generate suggestions for top matching categories
  let suggestionId = 1;
  
  categoryMatches.slice(0, 6).forEach(({ category, matchingSkills }) => {
    const templates = PROJECT_TEMPLATES[category] || [];
    
    // Select diverse templates from this category
    const selectedTemplates = diversifyTemplates(templates, 3); // Max 3 per category
    
    selectedTemplates.forEach((template) => {
      const relevanceScore = calculateRelevanceScore(matchingSkills, resume, scholarProfile, template);
      
      suggestions.push({
        id: `${category.toLowerCase()}-${suggestionId++}`,
        title: template.title,
        description: template.description,
        relevanceScore,
        matchingSkills: matchingSkills.slice(0, 5),
        suggestedCollaborators: [],
        relatedPublications: scholarProfile?.publications?.slice(0, 2) || [],
        estimatedDuration: template.duration,
        difficulty: template.difficulty,
        categories: template.categories
      });
    });
  });

  // Add scholar profile-based suggestions
  if (scholarProfile?.researchInterests?.length) {
    scholarProfile.researchInterests.slice(0, 3).forEach((interest: string, index: number) => {
      suggestions.push({
        id: `scholar-research-${suggestionId++}`,
        title: `Advanced ${interest} Research Initiative`,
        description: `Explore cutting-edge developments in ${interest} with focus on practical applications and theoretical advancements. This project leverages your existing research background and publications to push the boundaries of knowledge in this field.`,
        relevanceScore: 85 + Math.random() * 10,
        matchingSkills: resume.skills.slice(0, 3),
        suggestedCollaborators: [],
        relatedPublications: scholarProfile.publications.slice(0, 3),
        estimatedDuration: '8-15 months',
        difficulty: 'Advanced',
        categories: ['Research', interest, 'Academic']
      });

      // Add interdisciplinary projects
      suggestions.push({
        id: `interdisciplinary-${suggestionId++}`,
        title: `Interdisciplinary ${interest} Applications`,
        description: `Develop innovative applications of ${interest} across multiple disciplines, creating bridges between traditional academic boundaries and fostering collaborative innovation. This project emphasizes cross-field collaboration and novel methodologies.`,
        relevanceScore: 80 + Math.random() * 10,
        matchingSkills: resume.skills.slice(0, 4),
        suggestedCollaborators: [],
        relatedPublications: [],
        estimatedDuration: '6-12 months',
        difficulty: 'Intermediate',
        categories: ['Interdisciplinary', interest, 'Innovation']
      });
    });
  }

  // Add experience-based suggestions for industry relevance
  if (resume.experience?.length) {
    resume.experience.slice(0, 2).forEach((exp, index) => {
      suggestions.push({
        id: `experience-based-${suggestionId++}`,
        title: `${exp.title} Innovation Project`,
        description: `Leverage your experience in ${exp.title} at ${exp.company} to develop innovative solutions that bridge industry practices with academic research. This project focuses on practical applications of theoretical knowledge and real-world impact.`,
        relevanceScore: 75 + Math.random() * 15,
        matchingSkills: resume.skills.slice(0, 3),
        suggestedCollaborators: [],
        relatedPublications: [],
        estimatedDuration: '4-8 months',
        difficulty: 'Intermediate',
        categories: ['Industry Collaboration', 'Applied Research', 'Innovation']
      });
    });
  }

  // Ensure minimum suggestions with fallbacks
  if (suggestions.length < 5) {
    const fallbackSuggestions: ProjectSuggestion[] = [
      {
        id: `fallback-1`,
        title: 'Cross-Disciplinary Research Platform',
        description: 'Develop a platform that bridges different research domains, enabling collaboration between diverse academic fields and promoting interdisciplinary innovation with advanced analytics and visualization.',
        relevanceScore: 75,
        matchingSkills: resume.skills.slice(0, 3),
        suggestedCollaborators: [],
        relatedPublications: [],
        estimatedDuration: '6-10 months',
        difficulty: 'Intermediate',
        categories: ['Research', 'Platform Development', 'Collaboration']
      },
      {
        id: `fallback-2`,
        title: 'Academic Portfolio Management System',
        description: 'Create a comprehensive system for managing academic portfolios, publications, and research projects with advanced analytics, automated reporting, and collaboration features.',
        relevanceScore: 70,
        matchingSkills: resume.skills.slice(0, 3),
        suggestedCollaborators: [],
        relatedPublications: [],
        estimatedDuration: '4-8 months',
        difficulty: 'Intermediate',
        categories: ['Academic Tools', 'Data Management', 'Visualization']
      },
      {
        id: `fallback-3`,
        title: 'Research Impact Analysis Tool',
        description: 'Build an advanced tool for analyzing and visualizing the impact of academic research across different domains, time periods, and citation networks with predictive analytics.',
        relevanceScore: 68,
        matchingSkills: resume.skills.slice(0, 3),
        suggestedCollaborators: [],
        relatedPublications: [],
        estimatedDuration: '5-9 months',
        difficulty: 'Intermediate',
        categories: ['Analytics', 'Research Tools', 'Data Science']
      },
      {
        id: `fallback-4`,
        title: 'Digital Research Methodology Framework',
        description: 'Develop a comprehensive framework for digital research methodologies, incorporating modern tools, techniques, and best practices for data collection, analysis, and validation.',
        relevanceScore: 65,
        matchingSkills: resume.skills.slice(0, 3),
        suggestedCollaborators: [],
        relatedPublications: [],
        estimatedDuration: '6-12 months',
        difficulty: 'Advanced',
        categories: ['Research Methodology', 'Digital Tools', 'Framework Development']
      },
      {
        id: `fallback-5`,
        title: 'Open Science Communication Platform',
        description: 'Create a platform dedicated to improving science communication, making research more accessible to the general public through interactive visualizations, plain language summaries, and multimedia content.',
        relevanceScore: 63,
        matchingSkills: resume.skills.slice(0, 3),
        suggestedCollaborators: [],
        relatedPublications: [],
        estimatedDuration: '5-10 months',
        difficulty: 'Intermediate',
        categories: ['Science Communication', 'Public Engagement', 'Open Science']
      }
    ];
    
    suggestions.push(...fallbackSuggestions.slice(0, 5 - suggestions.length));
  }
  
  return suggestions;
}

// Helper functions
function calculateRelevanceScore(
  matchingSkills: string[],
  resume: ResumeData,
  scholarProfile?: ScholarProfile,
  template?: ProjectTemplate
): number {
  let score = 60; // Base score
  
  // Add points for matching skills
  score += matchingSkills.length * 5;
  
  // Add points for experience relevance
  score += resume.experience.length * 2;
  
  // Add points for education relevance
  score += resume.education.length * 3;
  
  // Add points for research interests
  score += resume.researchInterests.length * 4;
  
  // Add points for scholar profile
  if (scholarProfile) {
    score += 10;
    score += Math.min(scholarProfile.publications.length * 2, 20);
    score += Math.min(scholarProfile.citationCount / 100, 15);
  }
  
  // Add points for template difficulty matching user experience
  if (template) {
    const hasAdvancedExperience = resume.experience.length > 2 || 
                                 resume.education.some(edu => edu.degree.includes('PhD') || edu.degree.includes('Master'));
    
    if (template.difficulty === 'Advanced' && hasAdvancedExperience) {
      score += 5;
    } else if (template.difficulty === 'Intermediate') {
      score += 3;
    }
  }
  
  // Add some randomness for variety
  score += Math.random() * 10;
  
  // Ensure score is within bounds
  return Math.min(Math.max(score, 50), 100);
}

function calculateCategoryRelevance(matchingSkills: string[], categorySkills: string[]): number {
  const matchRatio = matchingSkills.length / categorySkills.length;
  const skillQuality = matchingSkills.reduce((sum, skill) => {
    return sum + (skill.length > 10 ? 2 : 1);
  }, 0);
  
  return (matchRatio * 50) + (skillQuality * 5);
}

function diversifyTemplates(templates: ProjectTemplate[], maxSelection: number): ProjectTemplate[] {
  if (templates.length <= maxSelection) {
    return templates;
  }
  
  const sorted = [...templates].sort((a, b) => {
    const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  });
  
  const selected: ProjectTemplate[] = [];
  const difficulties = new Set<string>();
  
  // First, try to get one from each difficulty level
  for (const template of sorted) {
    if (selected.length < maxSelection && !difficulties.has(template.difficulty)) {
      selected.push(template);
      difficulties.add(template.difficulty);
    }
  }
  
  // Fill remaining slots with highest quality templates
  for (const template of sorted) {
    if (selected.length < maxSelection && !selected.includes(template)) {
      selected.push(template);
    }
  }
  
  return selected;
}

export const findCollaborators = (
  projectCategory: string,
  userProfile: ScholarProfile
): ScholarProfile[] => {
  // This would typically query a database or external API
  // For demo purposes, return mock collaborators
  return [
    {
      name: 'Dr. Sarah Chen',
      affiliation: 'MIT Computer Science',
      researchInterests: ['Machine Learning', 'Computer Vision'],
      publications: [],
      citationCount: 2500,
      hIndex: 28
    },
    {
      name: 'Prof. Michael Rodriguez',
      affiliation: 'Stanford AI Lab',
      researchInterests: ['Natural Language Processing', 'Deep Learning'],
      publications: [],
      citationCount: 3200,
      hIndex: 35
    }
  ];
};
