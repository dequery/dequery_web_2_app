import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import dequeryClient from 'dequeryClient';


const initialState = {
  transactionList: {},
  respError: {},
  isFetching: false,
};

export const listTransactions = createAsyncThunk(
  'transactions/list',
  async (_, thunkAPI) => dequeryClient(
    '/api/transactions/',
    'GET',
    thunkAPI,
    {},
    true
  )
);

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listTransactions.pending, (state) => {
        state.isFetching = true;
        state.respError = initialState.respError;
      })
      .addCase(listTransactions.fulfilled, (state, action) => {
        state.isFetching = false;
        debugger
        state.transactionList = action.payload;
      })
      .addCase(listTransactions.rejected, (state, action) => {
        state.isFetching = false;
        debugger
        state.respError = action.payload;
      })
  },
});

export const selectTransactionList = (state) => state.profile.transactionList;
export const selectIsFetching = (state) => state.profile.isFetching;
export const selectRespError = (state) => state.profile.respError;

export default profileSlice.reducer;
