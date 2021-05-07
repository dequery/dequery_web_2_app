import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import dequeryClient from 'dequeryClient';

const initialState = {
  respError: {},
  isFetching: false,
  promptDetail: {},
  promptCreated: {},
  promptList: [],
}

export const createPrompt = createAsyncThunk(
  'prompt/submitPrompt',
  async ({ content, expirationDatetime, title }, thunkAPI) => dequeryClient(
    '/api/prompts/create/',
    'POST',
    thunkAPI,
    { content, expiration_datetime: expirationDatetime, title },
    true
  )
);

export const promptSlice = createSlice({
  name: 'prompt',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPrompt.pending, (state) => {
        state.isFetching = true;
        state.respError = initialState.respError;
      })
      .addCase(createPrompt.fulfilled, (state, action) => {
        state.isFetching = false;
        state.promptCreated = action.payload;
      })
      .addCase(createPrompt.rejected, (state, action) => {
        state.isFetching = false;
        debugger
        state.respError = action.payload;
      })
  }
});

export const selectPromptCreated = (state) => state.prompt.promptCreated;
export const selectRespError = (state) => state.prompt.respError;

export default promptSlice.reducer;
