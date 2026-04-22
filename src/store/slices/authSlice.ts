import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';
import { mockUser } from '../../utils/mockData';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => { state.isLoading = true; state.error = null; },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.otpVerified = false;
    },
    sendOTPSuccess: (state) => { state.otpSent = true; },
    verifyOTPSuccess: (state) => { state.otpVerified = true; },
    mockLogin: (state) => {
      state.isAuthenticated = true;
      state.user = mockUser;
      state.token = 'mock_jwt_token_vibha_banking';
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, sendOTPSuccess, verifyOTPSuccess, mockLogin } = authSlice.actions;
export default authSlice.reducer;
