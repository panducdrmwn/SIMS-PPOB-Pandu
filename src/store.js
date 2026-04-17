import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import userReducer from './features/userSlice';
import balanceReducer from './features/balanceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    balance: balanceReducer,
  },
});

export default store;