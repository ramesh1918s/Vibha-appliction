import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountState, Account } from '../../types';
import { mockAccounts } from '../../utils/mockData';

const initialState: AccountState = {
  accounts: mockAccounts,
  selectedAccount: mockAccounts[0],
  isLoading: false,
  error: null,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setSelectedAccount: (state, action: PayloadAction<Account>) => {
      state.selectedAccount = action.payload;
    },
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
    },
  },
});

export const { setSelectedAccount, setAccounts } = accountSlice.actions;
export default accountSlice.reducer;
