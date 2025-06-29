# AI Setup Guide for ScholarSync

## Overview

ScholarSync uses Google's Gemini AI to generate personalized, intelligent project suggestions based on your resume and Google Scholar profile. This guide will help you set up AI functionality to get the most out of the application.

## Why AI-Generated Suggestions?

- **Personalized**: Tailored specifically to your skills, experience, and research interests
- **Innovative**: Suggests cutting-edge projects you might not have considered
- **Diverse**: Covers multiple domains and interdisciplinary approaches
- **Relevant**: Considers your background to suggest appropriate difficulty levels
- **Current**: Incorporates latest trends and technologies

## Setup Steps

### 1. Get Your Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API key"
4. Copy the generated API key

### 2. Configure Your Environment

1. Open the `.env.local` file in the project root
2. Replace the placeholder API key:
   ```bash
   # Replace this line:
   GOOGLE_GEMINI_API_KEY=AIzaSyCMockKey_GetYourRealKeyFromGoogleAIStudio
   
   # With your actual API key:
   GOOGLE_GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE
   ```
3. Ensure AI is enabled:
   ```bash
   AI_ENABLED=true
   ```

### 3. Restart the Application

After updating the environment variables:
```bash
npm run dev
```

## Verification

### Check AI Status
When you upload a resume and generate suggestions, look for:

1. **Loading message**: "Generating AI-powered project suggestions tailored to your profile..."
2. **Suggestion count**: Shows "(X AI-generated)" next to the total count
3. **AI badges**: Individual suggestions marked with "✨ AI-Generated"
4. **No warning banner**: If AI is working, you won't see the blue setup notification

### Troubleshooting

#### Issue: Still seeing template-based suggestions
- **Check**: API key is set correctly in `.env.local`
- **Check**: API key is not the placeholder value
- **Check**: Server has been restarted after changing environment variables
- **Check**: Console logs for detailed error messages

#### Issue: "AI suggestions disabled" in console
- **Check**: `AI_ENABLED=true` in `.env.local`
- **Check**: Google Gemini API key is valid
- **Try**: Generate a new API key from Google AI Studio

#### Issue: API quota exceeded
- **Note**: Free tier has usage limits
- **Solution**: Monitor usage in Google AI Studio console
- **Option**: Upgrade to paid plan for higher limits

## API Usage and Limits

### Free Tier
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per month

### Best Practices
- The app is configured to request 8-12 suggestions per session
- Each request uses approximately 1,000-2,000 tokens
- Cache suggestions when possible to minimize API calls

## How It Works

### AI Prompt Engineering
The system creates detailed prompts that include:
- Your skills and experience
- Research interests
- Education background
- Google Scholar profile data (if available)
- Request for innovative, relevant project ideas

### Fallback System
1. **Primary**: AI-generated suggestions (requires API key)
2. **Secondary**: Minimal template-based suggestions (when AI unavailable)
3. **Fallback**: Generic high-quality suggestions (last resort)

### Quality Assurance
- AI responses are parsed and validated
- Relevance scores are calculated based on profile matching
- Invalid or incomplete suggestions are filtered out
- Results are ranked by relevance and diversity

## Privacy and Security

- API key is stored locally in your environment
- Resume data is processed locally and sent to Google AI only for suggestion generation
- No personal data is permanently stored by the AI service
- All communication with AI services is encrypted

## Advanced Configuration

### Adjust Suggestion Count
In `.env.local`:
```bash
AI_MAX_SUGGESTIONS=12  # Increase/decrease as needed
```

### Rate Limiting
Adjust API call frequency:
```bash
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
```

## Support

### Common Issues
1. **Invalid API key**: Double-check the key from Google AI Studio
2. **Quota exceeded**: Monitor usage in Google console
3. **Network errors**: Check internet connection and firewall settings

### Getting Help
- Check console logs for detailed error messages
- Verify environment variable setup
- Ensure latest version of the application

### Development Mode
Set `NODE_ENV=development` for verbose logging and debugging information.

---

*Note: This setup enables the full AI-powered experience of ScholarSync. Without proper AI configuration, the application will fall back to template-based suggestions, which are less personalized but still functional.*
