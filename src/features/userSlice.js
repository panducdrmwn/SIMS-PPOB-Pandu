import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

//  fetching user profile
export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://take-home-test-api.nutech-integrasi.com/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 0) {
        return response.data.data;
      } else {
        return rejectWithValue('Failed to fetch profile');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.profile = action.payload;
      state.error = null;
    },
    clearUser: (state) => {
      state.profile = null;
      state.error = null;
    },
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setUser, clearUser, clearUserError } = userSlice.actions;
export default userSlice.reducer;
