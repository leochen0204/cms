import { configureStore } from '@reduxjs/toolkit';
import cmsEditorReducer from '@src/domains/editor/store/editorSlice';

export const store = configureStore({
  reducer: {
    cmsEditor: cmsEditorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
