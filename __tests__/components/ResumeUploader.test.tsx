import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ResumeUploader from '../../src/components/ResumeUploader';
import resumeReducer from '../../src/store/resumeSlice';
import searchReducer from '../../src/store/searchSlice';

// Mock fetch
global.fetch = jest.fn();

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      resume: resumeReducer,
      search: searchReducer,
    },
    preloadedState: initialState,
  });
};

const renderWithProvider = (component: React.ReactElement, initialState = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('ResumeUploader', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders upload area correctly', () => {
    renderWithProvider(<ResumeUploader />);
    
    expect(screen.getByText('Upload Resume')).toBeInTheDocument();
    expect(screen.getByText('Drop your resume here, or click to browse')).toBeInTheDocument();
    expect(screen.getByText('Supports PDF and DOCX files up to 10MB')).toBeInTheDocument();
  });

  it('shows error for invalid file type', async () => {
    renderWithProvider(<ResumeUploader />);
    
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
    const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    
    // Debug: log the file input to ensure it exists
    expect(fileInput).toBeInTheDocument();
    
    await userEvent.upload(fileInput, invalidFile);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid file type. Only PDF and DOCX files are allowed.')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows error for oversized file', async () => {
    renderWithProvider(<ResumeUploader />);
    
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
    // Create a large file (>10MB)
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', { 
      type: 'application/pdf' 
    });
    
    await userEvent.upload(fileInput, largeFile);
    
    await waitFor(() => {
      expect(screen.getByText('File too large. Maximum size is 10MB.')).toBeInTheDocument();
    });
  });

  it('handles successful file upload', async () => {
    const mockResponse = {
      success: true,
      data: {
        extractedText: 'Mock extracted text',
        skills: ['JavaScript', 'React'],
        experience: [],
        education: [],
        researchInterests: ['Web Development'],
      },
    };
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    renderWithProvider(<ResumeUploader />);
    
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
    const validFile = new File(['mock content'], 'resume.pdf', { 
      type: 'application/pdf' 
    });
    
    await userEvent.upload(fileInput, validFile);
    
    await waitFor(() => {
      expect(screen.getByText('Resume Parsed Successfully')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
    });
  });

  it('handles API error during upload', async () => {
    const mockErrorResponse = {
      success: false,
      error: 'Failed to parse resume',
    };
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockErrorResponse,
    });

    renderWithProvider(<ResumeUploader />);
    
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
    const validFile = new File(['mock content'], 'resume.pdf', { 
      type: 'application/pdf' 
    });
    
    await userEvent.upload(fileInput, validFile);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to parse resume')).toBeInTheDocument();
    });
  });

  it('handles drag and drop', async () => {
    renderWithProvider(<ResumeUploader />);
    
    const dropZone = screen.getByText('Drop your resume here, or click to browse').closest('div');
    const validFile = new File(['mock content'], 'resume.pdf', { 
      type: 'application/pdf' 
    });
    
    // Mock successful API response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          extractedText: 'Mock text',
          skills: ['Test Skill'],
          experience: [],
          education: [],
          researchInterests: [],
        },
      }),
    });
    
    fireEvent.dragEnter(dropZone!);
    fireEvent.dragOver(dropZone!);
    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [validFile],
      },
    });
    
    await waitFor(() => {
      expect(screen.getByText('Resume Parsed Successfully')).toBeInTheDocument();
    });
  });
});
