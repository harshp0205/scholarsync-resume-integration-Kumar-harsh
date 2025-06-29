# ScholarSync - Setup and Run Guide

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The website will be available at: http://localhost:3000

3. **Open in Browser**
   Visit: http://localhost:3001 (if port 3000 is busy)

## 📝 Available Scripts

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server

### Testing
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run cypress:open` - Open Cypress for E2E testing
- `npm run e2e` - Run E2E tests headlessly

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

## 🌐 Access Points

- **Local Development**: http://localhost:3000 or http://localhost:3001
- **Network Access**: http://192.168.1.11:3001 (accessible from other devices on same network)

## 📁 Project Structure

```
scholarsync/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   ├── components/         # React components
│   ├── store/             # Redux store
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript types
├── public/                # Static files
├── __tests__/            # Test files
├── cypress/              # E2E tests
└── docs/                 # Documentation
```

## 🔧 Environment Variables

The following environment variables are configured in `.env.local`:

- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_APP_URL` - Base URL
- `MAX_FILE_SIZE_MB` - Maximum file upload size
- `RATE_LIMIT_MAX` - API rate limiting

## 🚨 Troubleshooting

### Port Issues
If port 3000 is busy, the app will automatically use port 3001.

### File Upload Issues
- Maximum file size: 10MB
- Supported formats: PDF, DOCX, DOC

### API Issues
- Resume parsing works offline (no external API required)
- Google Scholar integration uses web scraping (no API key needed)

## 📊 Features

✅ Resume Upload & Parsing (PDF, DOCX)
✅ Google Scholar Profile Integration
✅ AI-Powered Project Suggestions
✅ Responsive Design
✅ Real-time Validation
✅ Error Handling
✅ Loading States
✅ Redux State Management
✅ TypeScript Support
✅ Comprehensive Testing
