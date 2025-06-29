# ScholarSync - AI-Powered Resume & Research Integration

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)](https://tailwindcss.com/)

Intelligently connect your resume with Google Scholar data to discover personalized research projects using AI-powered suggestions.

## ✨ Key Features

- **🤖 AI-Powered Suggestions**: Google Gemini AI generates personalized project recommendations
- **📄 Smart Resume Parsing**: Extract skills and experience from PDF/DOCX files
- **🎓 Google Scholar Integration**: Analyze academic profiles and publications
- **⚡ Real-time Processing**: Live feedback with Redux state management
- **🔒 Secure & Validated**: Input validation, rate limiting, and error handling
- **📱 Responsive Design**: Modern UI with Tailwind CSS

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/harshp0205/scholarsync-resume-integration-Kumar-harsh.git
cd scholarsync-resume-integration-Kumar-harsh

# Install dependencies
npm install

# Configure AI (optional but recommended)
cp .env.example .env.local
# Add your Google Gemini API key to .env.local

# Start development server
npm run dev
# Open http://localhost:3000
```

## 🤖 AI vs Template Suggestions

**AI-Powered (Primary)**: Personalized, innovative project ideas using Google Gemini AI
- ✨ AI-Generated badge on suggestions
- Tailored to your background and interests
- 8-12 unique suggestions per session

**Template-Based (Fallback)**: High-quality curated suggestions when AI is unavailable
- Always reliable
- Covers 20+ domains and technologies

**Setup AI**: Get free API key from [Google AI Studio](https://aistudio.google.com/app/apikey) → Add to `.env.local`

## ️ Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + Redux Toolkit
- **Backend**: Next.js API Routes + pdf-parse + Cheerio
- **AI**: Google Gemini API for intelligent suggestions
- **Testing**: Jest + React Testing Library + Cypress
- **Deployment**: Vercel-ready with CI/CD pipeline

## 🧪 Testing & Development

```bash
npm test              # Run unit tests
npm run e2e:open      # E2E tests with Cypress
npm run build         # Production build
npm run type-check    # TypeScript validation
```

## � API Endpoints

### Resume Parsing
```
POST /api/parse-resume
# Upload PDF/DOCX → Extract skills, experience, education
```

### Project Suggestions  
```
POST /api/suggestions
# Resume + Scholar Profile → AI/Template-based project recommendations
```

### Google Scholar
```
GET /api/scholar?url={profile_url}
# Fetch publications, citations, h-index
```

## 🚀 Deployment

**Vercel (Recommended)**:
1. Connect GitHub repository to Vercel
2. Add environment variables (Google Gemini API key)
3. Deploy automatically on push

**Environment Variables**:
```env
GOOGLE_GEMINI_API_KEY=your_api_key_here
AI_ENABLED=true
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

##  Contact

- **Email**: hello@researchcommons.ai
- **GitHub**: [Project Repository](https://github.com/harshp0205/scholarsync-resume-integration-Kumar-harsh)

---

**Built with ❤️ using Next.js, TypeScript, and AI-powered innovation.**
