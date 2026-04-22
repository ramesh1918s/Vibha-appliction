import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import accountReducer from './slices/accountSlice';
import transactionReducer from './slices/transactionSlice';
import loanReducer from './slices/loanSlice';
import emiReducer from './slices/emiSlice';
import financeReducer from './slices/financeSlice';
import notificationReducer from './slices/notificationSlice';
import aiReducer from './slices/aiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
    transaction: transactionReducer,
    loan: loanReducer,
    emi: emiReducer,
    finance: financeReducer,
    notification: notificationReducer,
    ai: aiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
