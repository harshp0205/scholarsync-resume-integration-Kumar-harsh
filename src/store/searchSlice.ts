import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchState, ProjectSuggestion } from '../types';

const initialState: SearchState & { suggestions: ProjectSuggestion[] } = {
  isSearching: false,
  query: '',
  results: [],
  error: null,
  suggestions: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setSearchError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isSearching = false;
    },
    setSearchResults: (state, action: PayloadAction<ProjectSuggestion[]>) => {
      state.results = action.payload;
      state.isSearching = false;
      state.error = null;
    },
    setSuggestions: (state, action: PayloadAction<ProjectSuggestion[]>) => {
      console.log('Setting suggestions:', action.payload.length);
      state.suggestions = action.payload;
      state.isSearching = false;
      state.error = null;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.error = null;
      state.isSearching = false;
    },
  },
});

export const {
  setSearchQuery,
  setSearching,
  setSearchError,
  setSearchResults,
  setSuggestions,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
