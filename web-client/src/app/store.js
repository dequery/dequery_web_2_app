import { configureStore } from '@reduxjs/toolkit';

import authReducer from 'features/auth/authSlice';
import promptReducer from 'features/prompt/promptSlice';
import profileReducer from 'features/profile/profileSlice';
import voteReducer from 'features/vote/voteSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    prompt: promptReducer,
    profile: profileReducer,
    vote: voteReducer,
  },
});
