import { configureStore } from '@reduxjs/toolkit';

import authReducer from 'features/auth/authSlice';
import promptReducer from 'features/prompt/promptSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    prompt: promptReducer,
  },
});
