import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  respError: {},
  isFetching: false,
  user: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ displayName, password }, thunkAPI) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_DEQUERY_API_BASE}/api/token/`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            display_name: displayName,
            password,
          }),
        }
      );
      let data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      thunkAPI.rejectWithValue(e);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ alphaPasscode, displayName, email, password }, thunkAPI) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_DEQUERY_API_BASE}/api/users/`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            alpha_passcode: alphaPasscode,
            display_name: displayName,
            email,
            password,
          }),
        }
      );
      let data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log(e);
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = initialState.user;
      state.respError = initialState.respError;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isFetching = true;
        state.respError = initialState.respError;
      })
      .addCase(login.fulfilled, (state, action) => {
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
        state.isFetching = false;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isFetching = false;
        state.respError = action.payload;
      })
  },
});

export const { logout } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectRespError = (state) => state.auth.respError;

export default authSlice.reducer;
