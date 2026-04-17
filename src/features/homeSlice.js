import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  services: [],
  banners: [],
  loading: false,
  error: null,
};

//  fetching services
export const fetchServices = createAsyncThunk(
  'home/fetchServices',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://take-home-test-api.nutech-integrasi.com/services', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 0) {
        return response.data.data;
      } else {
        return rejectWithValue('Failed to fetch services');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch services');
    }
  }
);

//  fetching banners
export const fetchBanners = createAsyncThunk(
  'home/fetchBanners',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://take-home-test-api.nutech-integrasi.com/banner', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 0) {
        return response.data.data;
      } else {
        return rejectWithValue('Failed to fetch banners');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch banners');
    }
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearHomeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.banners = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearHomeError } = homeSlice.actions;

export default homeSlice.reducer;