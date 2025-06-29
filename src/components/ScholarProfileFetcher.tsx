'use client';

import React, { useState, useCallback } from 'react';
import { isValidScholarUrl, debounce } from '../utils/validation';

interface ScholarProfileFetcherProps {
  onProfileFetched: (profile: any) => void;
  onError: (error: string) => void;
}

const ScholarProfileFetcher: React.FC<ScholarProfileFetcherProps> = ({
  onProfileFetched,
  onError,
}) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const fetchProfile = useCallback(async (profileUrl: string) => {
    if (!isValidScholarUrl(profileUrl)) {
      const errorMessage = 'Please enter a valid Google Scholar profile URL';
      setError(errorMessage);
      onError(errorMessage);
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const response = await fetch(`/api/scholar?url=${encodeURIComponent(profileUrl)}`);
      const result = await response.json();

      if (result.success) {
        setError('');
        onProfileFetched(result.data);
      } else {
        const errorMessage = result.error || 'Failed to fetch Google Scholar profile';
        setError(errorMessage);
        onError(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [onProfileFetched, onError]);

  const searchScholar = useCallback(
    debounce(async (query: string) => {
      if (!query || query.length < 3) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(`/api/scholar?query=${encodeURIComponent(query)}`);
        const result = await response.json();

        if (result.success) {
          setSearchResults(result.data);
        } else {
          console.error('Search failed:', result.error);
        }
      } catch (error) {
        console.error('Search error:', error);
      }
    }, 500),
    []
  );

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      fetchProfile(url.trim());
    }
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchScholar(query);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Google Scholar Profile</h3>
      
      {/* Profile URL Input */}
      <form onSubmit={handleUrlSubmit} className="space-y-4">
        <div>
          <label htmlFor="scholar-url" className="block text-sm font-medium text-gray-700 mb-2">
            Google Scholar Profile URL
          </label>
          <div className="flex space-x-2">
            <input
              type="url"
              id="scholar-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://scholar.google.com/citations?user=..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Fetching...' : 'Fetch Profile'}
            </button>
          </div>
        </div>
      </form>

      {/* Search Alternative */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Or search for publications
        </h4>
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            placeholder="Search for papers, authors, or topics..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
            <h5 className="text-sm font-medium text-gray-700">Recent Publications:</h5>
            {searchResults.slice(0, 5).map((publication, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-md">
                <h6 className="text-sm font-medium text-gray-900 line-clamp-2">
                  {publication.title}
                </h6>
                <p className="text-xs text-gray-600 mt-1">
                  {publication.authors.slice(0, 3).join(', ')}
                  {publication.authors.length > 3 && ` +${publication.authors.length - 3} more`}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {publication.year} • {publication.venue}
                  </span>
                  {publication.citations > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {publication.citations} citations
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h5 className="text-sm font-medium text-blue-900 mb-2">Tips:</h5>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Visit Google Scholar and copy your profile URL</li>
          <li>• The URL should contain "user=" followed by your Scholar ID</li>
          <li>• Alternatively, search for your publications to find relevant research</li>
        </ul>
      </div>
    </div>
  );
};

export default ScholarProfileFetcher;
