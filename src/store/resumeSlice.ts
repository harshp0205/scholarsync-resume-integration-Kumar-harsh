import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResumeData, UploadState } from '../types';

const initialState: UploadState & { resume: ResumeData | null } = {
  isUploading: false,
  progress: 0,
  error: null,
  resume: null,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    setUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
      if (action.payload) {
        state.error = null;
        state.progress = 0;
      }
    },
    setUploadError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isUploading = false;
      state.progress = 0;
    },
    setResume: (state, action: PayloadAction<ResumeData>) => {
      state.resume = action.payload;
      state.isUploading = false;
      state.progress = 100;
      state.error = null;
    },
    clearResume: (state) => {
      state.resume = null;
      state.isUploading = false;
      state.progress = 0;
      state.error = null;
    },
  },
});

export const {
  setUploadProgress,
  setUploading,
  setUploadError,
  setResume,
  clearResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;
