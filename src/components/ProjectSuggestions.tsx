'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSuggestions, setSearching, setSearchError } from '../store/searchSlice';
import { ProjectSuggestion } from '../types';

interface ProjectSuggestionsProps {
  scholarProfile?: any;
}

const ProjectSuggestions: React.FC<ProjectSuggestionsProps> = ({ scholarProfile }) => {
  const dispatch = useAppDispatch();
  const { resume } = useAppSelector(state => state.resume);
  const { suggestions, isSearching, error } = useAppSelector(state => state.search);

  useEffect(() => {
    if (!resume) return;

    const fetchSuggestions = async () => {
      dispatch(setSearching(true));
      
      try {
        const response = await fetch('/api/suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resume,
            scholarProfile,
          }),
        });

        const result = await response.json();

        if (result.success) {
          dispatch(setSuggestions(result.data));
          dispatch(setSearching(false));
        } else {
          dispatch(setSearchError(result.error || 'Failed to generate suggestions'));
        }
      } catch (error) {
        dispatch(setSearchError(error instanceof Error ? error.message : 'Network error'));
      }
    };

    fetchSuggestions();
  }, [resume, scholarProfile, dispatch]);

  if (!resume) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Suggestions</h3>
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 text-gray-300 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500">Upload your resume to see personalized project suggestions</p>
        </div>
      </div>
    );
  }

  if (isSearching) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Suggestions</h3>
        <div className="text-center py-8">
          <div className="animate-spin mx-auto w-8 h-8 text-blue-600 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-25"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-gray-600">Generating AI-powered project suggestions tailored to your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Suggestions</h3>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Personalized Project Suggestions</h3>
        <div className="text-sm text-gray-500">
          <span>{suggestions.length} suggestions found</span>
          {suggestions.length > 0 && (
            <span className="ml-2">
              ({suggestions.filter(s => s.source === 'ai').length} AI-generated)
            </span>
          )}
        </div>
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No project suggestions found. Try uploading a different resume or adding more skills.</p>
        </div>
      ) : (
        <>
          {/* Show AI configuration notice if no AI suggestions are present */}
          {suggestions.length > 0 && suggestions.filter(s => s.source === 'ai').length === 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Enable AI-Powered Suggestions
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      You're currently seeing template-based suggestions. To get personalized AI-generated project ideas, 
                      configure your Google Gemini API key in the <code className="bg-blue-100 px-1 rounded">.env.local</code> file.
                    </p>
                    <p className="mt-1">
                      Get your free API key from: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
          {suggestions.map((project: ProjectSuggestion) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900 flex-1 mr-4">
                  {project.title}
                  {project.source === 'ai' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                      ✨ AI-Generated
                    </span>
                  )}
                </h4>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 mr-1">
                      {project.relevanceScore}%
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${project.relevanceScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {project.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-700 block mb-2">Matching Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {project.matchingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700 block mb-2">Categories:</span>
                  <div className="flex flex-wrap gap-1">
                    {project.categories.map((category, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Duration: {project.estimatedDuration}</span>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectSuggestions;
