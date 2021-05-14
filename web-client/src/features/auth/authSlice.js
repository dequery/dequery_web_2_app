import Cookies from 'js-cookie';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import dequeryClient from 'dequeryClient';


const initialState = {
  respError: {},
  isFetching: false,
  user: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ displayName, password }, thunkAPI) => dequeryClient(
    '/api/token/',
    'POST',
    thunkAPI,
    { display_name: displayName, password }
  )
);

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ alphaPasscode, displayName, email, password }, thunkAPI) => dequeryClient(
    '/api/users/create/',
    'POST',
    thunkAPI,
    { alpha_passcode: alphaPasscode, display_name: displayName, email, password }
  )
);

function setTokenCookies(payload) {
  Cookies.set('accessToken', payload.access);
  Cookies.set('refreshToken', payload.refresh, { expires: 7 });
}

function removeCookies() {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      removeCookies();
      state.user = initialState.user;
      state.respError = initialState.respError;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isFetching = true;
        state.respError = initialState.respError;
      })
      .addCase(login.fulfilled, (state, action) => {
        setTokenCookies(action.payload);
        state.isFetching = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isFetching = false;
        state.respError = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.isFetching = true;
        state.respError = initialState.respError;
      })
      .addCase(signup.fulfilled, (state, action) => {
        setTokenCookies(action.payload);
        state.isFetching = false;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isFetching = false;
        state.respError = action.payload;
      })
  },
});

export const { logout, setUser } = authSlice.actions;

export const selectIsFetching = (state) => state.auth.isFetching;
export const selectUser = (state) => state.auth.user;
export const selectRespError = (state) => state.auth.respError;

export default authSlice.reducer;
