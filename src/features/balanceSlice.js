import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  balance: 0,
  loading: false,
  error: null,
};

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
});

export const { setBalance, setBalanceLoading, setBalanceError, updateBalance, clearBalanceError } = balanceSlice.actions;

export default balanceSlice.reducer;