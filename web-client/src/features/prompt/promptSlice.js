import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import dequeryClient from 'dequeryClient';

const initialState = {
  respError: {},
  isFetching: false,
  promptDetail: {},
  promptCreated: {},
  promptList: { results: [] },
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

export const listPrompts = createAsyncThunk(
  'prompt/listPrompts',
  async (_, thunkAPI) => dequeryClient(
    '/api/prompts/',
    'GET',
    thunkAPI,
  )
);

export const retrievePrompt = createAsyncThunk(
  'prompt/retrievePrompt',
  async (promptPk, thunkAPI) => dequeryClient(
    `/api/prompts/${promptPk}`,
    'GET',
    thunkAPI,
  )
);

export const promptSlice = createSlice({
  name: 'prompt',
  initialState,
  reducers: {
    clearPromptCreated: (state) => {
      state.promptCreated = initialState.promptCreated;
    },
    clearPromptDetail: (state) => {
      state.promptDetail = initialState.promptDetail;
    },
    clearPromptList: (state) => {
      state.promptList = initialState.promptList;
    }
  },
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
        state.respError = action.payload;
      })
      .addCase(listPrompts.pending, (state) => {
        state.isFetching = true;
        state.respError = initialState.respError;
      })
      .addCase(listPrompts.fulfilled, (state, action) => {
        state.isFetching = false;
        state.promptList = action.payload;
      })
      .addCase(listPrompts.rejected, (state, action) => {
        state.isFetching = false;
        state.respError = action.payload;
      })
      .addCase(retrievePrompt.pending, (state) => {
        state.isFetching = true;
        state.respError = initialState.respError;
      })
      .addCase(retrievePrompt.fulfilled, (state, action) => {
        state.isFetching = false;
        state.promptDetail = action.payload;
      })
      .addCase(retrievePrompt.rejected, (state, action) => {
        state.isFetching = false;
        state.respError = action.payload;
      })
  }
});

export const { clearPromptDetail, clearPromptList, clearPromptCreated } = promptSlice.actions;

export const selectIsFetching = (state) => state.prompt.isFetching;
export const selectPromptCreated = (state) => state.prompt.promptCreated;
export const selectPromptList = (state) => state.prompt.promptList;
export const selectPromptDetail = (state) => state.prompt.promptDetail;
export const selectRespError = (state) => state.prompt.respError;

export default promptSlice.reducer;
