'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ResumeUploader from '../components/ResumeUploader';
import ScholarProfileFetcher from '../components/ScholarProfileFetcher';
import ProjectSuggestions from '../components/ProjectSuggestions';

export default function Home() {
  const [scholarProfile, setScholarProfile] = useState(null);
  const [profileError, setProfileError] = useState('');

  const handleProfileFetched = (profile: any) => {
    setScholarProfile(profile);
    setProfileError('');
  };

  const handleProfileError = (error: string) => {
    setProfileError(error);
    setScholarProfile(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Connect Your Resume with 
                <span className="block text-blue-200">Academic Excellence</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Upload your resume and Google Scholar profile to discover personalized 
                research projects and collaboration opportunities powered by AI.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">Resume Parsing</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">Scholar Integration</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">AI Suggestions</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">Collaboration Discovery</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Resume Upload Section */}
              <div>
                <ResumeUploader />
              </div>

              {/* Scholar Profile Section */}
              <div>
                <ScholarProfileFetcher
                  onProfileFetched={handleProfileFetched}
                  onError={handleProfileError}
                />
                
                {profileError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{profileError}</p>
                  </div>
                )}
                
                {scholarProfile && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <h4 className="font-medium text-green-900 mb-2">Profile Loaded Successfully!</h4>
                    <p className="text-sm text-green-700">
                      {(scholarProfile as any).name} • {(scholarProfile as any).affiliation}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {(scholarProfile as any).publications?.length || 0} publications • 
                      {(scholarProfile as any).citationCount || 0} citations
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Project Suggestions */}
            <div>
              <ProjectSuggestions scholarProfile={scholarProfile} />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                ScholarSync combines advanced parsing algorithms with intelligent matching 
                to help you discover your next breakthrough project.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Resume Parsing</h3>
                <p className="text-gray-600">
                  Extract skills, experience, and education from PDF and DOCX files with high accuracy.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Scholar Integration</h3>
                <p className="text-gray-600">
                  Connect with Google Scholar to analyze publications and research interests.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Suggestions</h3>
                <p className="text-gray-600">
                  Get personalized project recommendations based on your unique profile and expertise.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
