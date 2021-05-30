import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import dequeryClient from 'dequeryClient';


const initialState = {
  transactionList: { results: [] },
  respError: {},
  isFetching: false,
  transactionCreated: false,
};

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async ({ amount, category, extra_info }, thunkAPI) => dequeryClient(
    '/api/transactions/create/',
    'POST',
    thunkAPI,
    { amount, category, extra_info },
    true
  )
);

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
  reducers: {
    clearTransactionCreated: (state) => {
      state.transactionCreated = initialState.transactionCreated;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTransaction.pending, (state) => {
        state.isFetching = true;
        state.respError = initialState.respError;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isFetching = false;
        state.transactionCreated = true;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isFetching = false;
        state.respError = action.payload;
      })
      .addCase(listTransactions.pending, (state) => {
        state.isFetching = true;
        state.respError = initialState.respError;
      })
      .addCase(listTransactions.fulfilled, (state, action) => {
        state.isFetching = false;
        state.transactionList = action.payload;
      })
      .addCase(listTransactions.rejected, (state, action) => {
        state.isFetching = false;
        state.respError = action.payload;
      })
  },
});

export const { clearTransactionCreated } = profileSlice.actions;

export const selectTransactionCreated = (state) => state.profile.transactionCreated;
export const selectTransactionList = (state) => state.profile.transactionList;
export const selectIsFetching = (state) => state.profile.isFetching;
export const selectRespError = (state) => state.profile.respError;

export default profileSlice.reducer;
