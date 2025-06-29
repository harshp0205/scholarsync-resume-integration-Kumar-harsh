import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScholarProfileFetcher from '../../src/components/ScholarProfileFetcher';

// Mock fetch
global.fetch = jest.fn();

describe('ScholarProfileFetcher', () => {
  const mockOnProfileFetched = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockOnProfileFetched.mockClear();
    mockOnError.mockClear();
  });

  it('renders correctly', () => {
    render(
      <ScholarProfileFetcher
        onProfileFetched={mockOnProfileFetched}
        onError={mockOnError}
      />
    );

    expect(screen.getByText('Google Scholar Profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Google Scholar Profile URL')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/https:\/\/scholar.google.com/)).toBeInTheDocument();
  });

  it('validates invalid URLs', async () => {
    render(
      <ScholarProfileFetcher
        onProfileFetched={mockOnProfileFetched}
        onError={mockOnError}
      />
    );

    const urlInput = screen.getByLabelText('Google Scholar Profile URL');
    const submitButton = screen.getByText('Fetch Profile');

    await userEvent.clear(urlInput);
    await userEvent.type(urlInput, 'invalid-url');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid Google Scholar profile URL')).toBeInTheDocument();
    });
  });

  it('handles successful profile fetch', async () => {
    const mockProfile = {
      name: 'Dr. John Doe',
      affiliation: 'University of Example',
      researchInterests: ['Machine Learning', 'AI'],
      publications: [],
      citationCount: 500,
      hIndex: 15,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockProfile }),
    });

    render(
      <ScholarProfileFetcher
        onProfileFetched={mockOnProfileFetched}
        onError={mockOnError}
      />
    );

    const urlInput = screen.getByLabelText('Google Scholar Profile URL');
    const submitButton = screen.getByText('Fetch Profile');

    await userEvent.type(urlInput, 'https://scholar.google.com/citations?user=test123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnProfileFetched).toHaveBeenCalledWith(mockProfile);
    });
  });

  it('handles API error during profile fetch', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, error: 'Profile not found' }),
    });

    render(
      <ScholarProfileFetcher
        onProfileFetched={mockOnProfileFetched}
        onError={mockOnError}
      />
    );

    const urlInput = screen.getByLabelText('Google Scholar Profile URL');
    const submitButton = screen.getByText('Fetch Profile');

    await userEvent.type(urlInput, 'https://scholar.google.com/citations?user=test123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Profile not found');
    });
  });

  it('handles search functionality', async () => {
    const mockSearchResults = [
      {
        title: 'Test Paper 1',
        authors: ['Author 1', 'Author 2'],
        year: 2023,
        venue: 'Test Conference',
        citations: 10,
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockSearchResults }),
    });

    render(
      <ScholarProfileFetcher
        onProfileFetched={mockOnProfileFetched}
        onError={mockOnError}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for papers, authors, or topics...');
    
    await userEvent.type(searchInput, 'machine learning');

    // Wait for debounced search
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/scholar?query=machine%20learning')
      );
    }, { timeout: 1000 });
  });

  it('shows loading state during fetch', async () => {
    // Mock a delayed response
    (fetch as jest.Mock).mockReturnValueOnce(
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      }), 100))
    );

    render(
      <ScholarProfileFetcher
        onProfileFetched={mockOnProfileFetched}
        onError={mockOnError}
      />
    );

    const urlInput = screen.getByLabelText('Google Scholar Profile URL');
    const submitButton = screen.getByText('Fetch Profile');

    await userEvent.type(urlInput, 'https://scholar.google.com/citations?user=test123');
    fireEvent.click(submitButton);

    expect(screen.getByText('Fetching...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Fetch Profile')).toBeInTheDocument();
    });
  });
});
