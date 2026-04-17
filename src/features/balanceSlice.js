import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  balance: 0,
  loading: false,
  error: null,
};

//  fetching balance
export const fetchBalance = createAsyncThunk(
  'balance/fetchBalance',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://take-home-test-api.nutech-integrasi.com/balance', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 0) {
        return response.data.data.balance;
      } else {
        return rejectWithValue('Failed to fetch balance');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch balance');
    }
  }
);

const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    setBalance: (state, action) => {
      state.balance = action.payload;
      state.error = null;
    },
    setBalanceLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBalanceError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateBalance: (state, action) => {
      state.balance = action.payload;
      state.error = null;
    },
    clearBalanceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setBalance, setBalanceLoading, setBalanceError, updateBalance, clearBalanceError } = balanceSlice.actions;

export default balanceSlice.reducer;