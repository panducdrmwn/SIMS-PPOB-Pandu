import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import userReducer from './features/userSlice';
import balanceReducer from './features/balanceSlice';
import homeReducer from './features/homeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    balance: balanceReducer,
    home: homeReducer,
  },
});

export default store;