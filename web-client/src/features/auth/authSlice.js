import Cookies from 'js-cookie';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import dequeryClient from 'dequeryClient';


const initialState = {
  alphaRequestSuccess: false,
  respError: {},
  isFetching: false,
  user: {},
  userCreated: false,
};

export const submitAlphaRequest = createAsyncThunk(
  'auth/alpharequest',
  async ({ email, text }, thunkAPI) => dequeryClient(
    '/api/alpharequests/',
    'POST',
    thunkAPI,
    { email, text }
  )
);

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

export const retrieveUser = createAsyncThunk(
  'auth/retrieveUser',
  async (_, thunkAPI) => dequeryClient(
    '/api/users/retrieve/',
    'GET',
    thunkAPI,
    {},
    true,
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
      state.user = initialState.user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAlphaRequest.pending, (state) => {
        state.isFetching = true;
        state.respError = initialState.respError;
      })
      .addCase(submitAlphaRequest.fulfilled, (state, action) => {
        state.isFetching = false;
        state.alphaRequestSuccess = true;
      })
      .addCase(submitAlphaRequest.rejected, (state, action) => {
        state.isFetching = false;
        state.respError = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isFetching = true;
        state.respError = initialState.respError;
      })
      .addCase(login.fulfilled, (state, action) => {
        setTokenCookies(action.payload);
        state.isFetching = false;
        state.userCreated = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isFetching = false;
        state.respError = action.payload;
      })
      .addCase(retrieveUser.pending, (state) => {
        state.isFetching = true;
        state.respError = initialState.respError;
      })
      .addCase(retrieveUser.fulfilled, (state, action) => {
        state.isFetching = false;
        state.user = action.payload;
      })
      .addCase(retrieveUser.rejected, (state, action) => {
        state.isFetching = false;
        state.respError = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.isFetching = true;
        state.respError = initialState.respError;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isFetching = false;
        state.userCreated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isFetching = false;
        state.respError = action.payload;
      })
  },
});

export const { logout } = authSlice.actions;

export const selectAlphaRequestSuccess = (state) => state.auth.alphaRequestSuccess;
export const selectIsFetching = (state) => state.auth.isFetching;
export const selectUser = (state) => state.auth.user;
export const selectUserCreated = (state) => state.auth.userCreated;
export const selectRespError = (state) => state.auth.respError;

export default authSlice.reducer;
