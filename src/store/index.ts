import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './resumeSlice';
import searchReducer from './searchSlice';

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['resume/setResume'],
        ignoredPaths: ['resume.resume.uploadedAt'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
