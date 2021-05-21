import { configureStore } from '@reduxjs/toolkit';

import authReducer from 'features/auth/authSlice';
import promptReducer from 'features/prompt/promptSlice';
import voteReducer from 'features/vote/voteSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    prompt: promptReducer,
    vote: voteReducer,
  },
});
