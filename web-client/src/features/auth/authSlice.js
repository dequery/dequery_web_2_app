import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  errors: [],
  isFetching: false,
  user: null,
};

export const login = createAsyncThunk(
  'auth/logIn',
  async ({ displayName, password }, thunkAPI) => {
    try {
      const response = await fetch(
        'http://localhost:8000/api/token/',
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
      if (response.status == 200) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('error', e);
      thunkAPI.rejectWithValue(e);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = initialState.user;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isFetching = true;
        state.errors = []
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isFetching = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isFetching = false;
        state.errors.push(action.payload);
      })
  },
});

export const { logout } = authSlice.actions;

export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
