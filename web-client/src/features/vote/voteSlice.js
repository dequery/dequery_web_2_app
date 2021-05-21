import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import dequeryClient from 'dequeryClient';

const initialState = {
  respErrorCreate: {},
  respErrorList: {},
  isFetching: false,
  voteCastCreated: {},
  voteBalanceList: { results: [] },
}


export const listVoteBalances = createAsyncThunk(
  'vote/retrieveVoteBalance',
  async ({ promptPk }, thunkAPI) => dequeryClient(
    `/api/vote-balances/?prompt=${promptPk}`,
    'GET',
    thunkAPI,
    {},
    true,
  )
);

export const createVoteCast = createAsyncThunk(
  'vote/castVote',
  async ({ amount, vote_balance, answer }, thunkAPI) => dequeryClient(
    '/api/vote-casts/create/',
    'POST',
    thunkAPI,
    { amount, vote_balance, answer },
    true
  )
);

export const voteSlice = createSlice({
  name: 'prompt',
  initialState,
  reducers: {
    clearVoteCast: (state) => {
      state.voteCastCreated = initialState.voteCastCreated;
    },
    clearVoteBalanceList: (state) => {
      state.voteBalanceList = initialState.voteBalanceList;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVoteCast.pending, (state) => {
        state.isFetching = true;
        state.respErrorCreate = initialState.respErrorCreate;
      })
      .addCase(createVoteCast.fulfilled, (state, action) => {
        state.isFetching = false;
        state.voteCastCreated = action.payload;
      })
      .addCase(createVoteCast.rejected, (state, action) => {
        state.isFetching = false;
        state.respErrorCreate = action.payload;
      })
      .addCase(listVoteBalances.pending, (state) => {
        state.isFetching = true;
        state.respErrorList = initialState.respErrorList;
      })
      .addCase(listVoteBalances.fulfilled, (state, action) => {
        state.isFetching = false;
        state.voteBalanceList = action.payload;
      })
      .addCase(listVoteBalances.rejected, (state, action) => {
        state.isFetching = false;
        state.respErrorList = action.payload;
      })
  }
});

export const { clearVoteCast, clearVoteBalanceList } = voteSlice.actions;

export const selectIsFetching = (state) => state.vote.isFetching;
export const selectRespErrorCreate = (state) => state.vote.respErrorCreate;
export const selectRespErrorList = (state) => state.vote.respErrorList;
export const selectVoteBalanceList = (state) => state.vote.voteBalanceList;
export const selectVoteCastCreated = (state) => state.vote.voteCastCreated;

export default voteSlice.reducer;
