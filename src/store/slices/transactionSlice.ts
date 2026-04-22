import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransactionState, Transaction, TransactionFilters } from '../../types';
import { mockTransactions } from '../../utils/mockData';

const initialState: TransactionState = {
  transactions: mockTransactions,
  isLoading: false,
  error: null,
  totalCount: mockTransactions.length,
  filters: {},
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
      state.totalCount = action.payload.length;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
      state.totalCount += 1;
    },
    setFilters: (state, action: PayloadAction<TransactionFilters>) => {
      state.filters = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setTransactions, addTransaction, setFilters, setLoading } = transactionSlice.actions;
export default transactionSlice.reducer;
