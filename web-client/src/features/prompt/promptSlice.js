import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import dequeryClient from 'dequeryClient';

const initialState = {
  respError: {},
  respErrorHiddenList: {},
  increaseBountyRespError: {},
  isFetching: false,
  isFetchingHiddenList: false,
  promptDetail: {},
  promptCreated: {},
  promptList: { results: [] },
  promptHiddenList: { results: [] },
}

export const createAnswer = createAsyncThunk(
  'prompt/submitAnswer',
  async ({ content, prompt }, thunkAPI) => dequeryClient(
    '/api/answers/create/',
    'POST',
    thunkAPI,
    { content, prompt },
    true
  )
);

export const createPrompt = createAsyncThunk(
  'prompt/submitPrompt',
  async ({ askersCut, bounty, content, expirationDatetime, hiddenCode, title }, thunkAPI) => dequeryClient(
    '/api/prompts/create/',
    'POST',
    thunkAPI,
    { askers_cut: askersCut, bounty, content, expiration_datetime: expirationDatetime, hidden_code: hiddenCode, title },
    true
  )
);

export const increasePromptBounty = createAsyncThunk(
  'prompt/increasePromptBounty',
  async ({ amount, extraInfo }, thunkAPI) => dequeryClient(
    '/api/transactions/create/',
    'POST',
    thunkAPI,
    { amount, category: 'increase_prompt_bounty', extra_info: extraInfo },
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

export const listHiddenPrompts = createAsyncThunk(
  'prompt/listHiddenPrompts',
  async ({ hiddenCode }, thunkAPI) => dequeryClient(
    `/api/prompts/?hidden_code=${hiddenCode}`,
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
      state.promptHiddenList = initialState.promptHiddenList;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAnswer.pending, (state) => {
        state.isFetching = true;
        state.respError = initialState.respError;
      })
      .addCase(createAnswer.fulfilled, (state, action) => {
        state.isFetching = false;
        state.promptDetail.answers.unshift(action.payload);
      })
      .addCase(createAnswer.rejected, (state, action) => {
        state.isFetching = false;
        state.respError = action.payload;
      })
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
      .addCase(increasePromptBounty.pending, (state) => {
        state.isFetching = true;
        state.increaseBountyRespError = initialState.increaseBountyRespError;
      })
      .addCase(increasePromptBounty.fulfilled, (state, action) => {
        state.isFetching = false;
        state.promptDetail.bounty = (parseFloat(state.promptDetail.bounty) + parseFloat(action.payload.amount)).toString();
      })
      .addCase(increasePromptBounty.rejected, (state, action) => {
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
      .addCase(listHiddenPrompts.pending, (state) => {
        state.isFetchingHiddenList = true;
        state.respErrorHiddenList = initialState.respErrorHiddenList;
      })
      .addCase(listHiddenPrompts.fulfilled, (state, action) => {
        state.isFetchingHiddenList = false;
        state.promptHiddenList = action.payload;
      })
      .addCase(listHiddenPrompts.rejected, (state, action) => {
        state.isFetchingHiddenList = false;
        state.respErrorHiddenList = action.payload;
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
export const selectIsFetchingHiddenList = (state) => state.prompt.isFetchingHiddenList;
export const selectIncreaseBountyRespError = (state) => state.prompt.increaseBountyRespError;
export const selectPromptCreated = (state) => state.prompt.promptCreated;
export const selectPromptList = (state) => state.prompt.promptList;
export const selectPromptHiddenList = (state) => state.prompt.promptHiddenList;
export const selectPromptDetail = (state) => state.prompt.promptDetail;
export const selectRespError = (state) => state.prompt.respError;
export const selectRespErrorHiddenList = (state) => state.prompt.respErrorHiddenList;


export default promptSlice.reducer;
