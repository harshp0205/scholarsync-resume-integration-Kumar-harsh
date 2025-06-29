'use client';

import React, { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUploading, setUploadError, setResume, setUploadProgress, clearResume } from '../store/resumeSlice';
import { validateFileType, validateFileSize } from '../utils/validation';

const ResumeUploader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isUploading, progress, error, resume } = useAppSelector(state => state.resume);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!validateFileType(file)) {
      dispatch(setUploadError('Invalid file type. Only PDF and DOCX files are allowed.'));
      return;
    }

    if (!validateFileSize(file, 10)) {
      dispatch(setUploadError('File too large. Maximum size is 10MB.'));
      return;
    }

    dispatch(setUploading(true));

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const resumeData = {
          id: Date.now().toString(),
          fileName: file.name,
          uploadedAt: new Date().toISOString(),
          extractedText: result.data.extractedText,
          skills: result.data.skills,
          experience: result.data.experience,
          education: result.data.education,
          researchInterests: result.data.researchInterests,
        };
        
        dispatch(setResume(resumeData));
      } else {
        dispatch(setUploadError(result.error || 'Failed to parse resume'));
      }
    } catch (error) {
      dispatch(setUploadError(error instanceof Error ? error.message : 'Upload failed'));
    }
  }, [dispatch]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  if (resume) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Resume Parsed Successfully</h3>
          <button
            onClick={() => dispatch(clearResume())}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Remove
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-500">File:</span>
            <p className="text-gray-900">{resume.fileName}</p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Skills Found:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {resume.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Research Interests:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {resume.researchInterests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Resume</h3>
      
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="resume-upload"
          accept=".pdf,.doc,.docx"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isUploading ? 'Processing...' : 'Drop your resume here, or click to browse'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports PDF and DOCX files up to 10MB
            </p>
          </div>
        </div>
        
        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{progress}% complete</p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
