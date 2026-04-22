import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoanState, EMIState, FinanceState, NotificationState, AIState, Notification, ChatMessage, EMI, FinanceGoal } from '../../types';
import { mockLoans, mockEMIs, mockElectronicsEMIs, mockFinanceGoals, mockBudgets, mockNotifications, mockChatMessages } from '../../utils/mockData';

// ── Loan Slice ──────────────────────────────────────────────
export const loanSlice = createSlice({
  name: 'loan',
  initialState: { loans: mockLoans, applications: [], isLoading: false, error: null } as LoanState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => { state.isLoading = action.payload; },
  },
});
export const loanReducer = loanSlice.reducer;

// ── EMI Slice ───────────────────────────────────────────────
export const emiSlice = createSlice({
  name: 'emi',
  initialState: { emis: mockEMIs, electronicsEMIs: mockElectronicsEMIs, isLoading: false, error: null } as EMIState,
  reducers: {
    toggleAutoPay: (state, action: PayloadAction<string>) => {
      const emi = state.emis.find(e => e.id === action.payload);
      if (emi) emi.autoPay = !emi.autoPay;
    },
  },
});
export const { toggleAutoPay } = emiSlice.actions;
export const emiReducer = emiSlice.reducer;

// ── Finance Slice ───────────────────────────────────────────
export const financeSlice = createSlice({
  name: 'finance',
  initialState: { goals: mockFinanceGoals, budgets: mockBudgets, isLoading: false, error: null } as FinanceState,
  reducers: {
    addGoal: (state, action: PayloadAction<FinanceGoal>) => { state.goals.push(action.payload); },
    updateGoal: (state, action: PayloadAction<FinanceGoal>) => {
      const idx = state.goals.findIndex(g => g.id === action.payload.id);
      if (idx !== -1) state.goals[idx] = action.payload;
    },
    deleteGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter(g => g.id !== action.payload);
    },
  },
});
export const { addGoal, updateGoal, deleteGoal } = financeSlice.actions;
export const financeReducer = financeSlice.reducer;

// ── Notification Slice ──────────────────────────────────────
export const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: mockNotifications,
    unreadCount: mockNotifications.filter(n => !n.isRead).length,
    isLoading: false,
  } as NotificationState,
  reducers: {
    markAsRead: (state, action: PayloadAction<string>) => {
      const n = state.notifications.find(n => n.id === action.payload);
      if (n && !n.isRead) { n.isRead = true; state.unreadCount = Math.max(0, state.unreadCount - 1); }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.isRead = true);
      state.unreadCount = 0;
    },
  },
});
export const { markAsRead, markAllAsRead } = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;

// ── AI Slice ────────────────────────────────────────────────
export const aiSlice = createSlice({
  name: 'ai',
  initialState: { messages: mockChatMessages, isTyping: false, error: null } as AIState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => { state.messages.push(action.payload); },
    setTyping: (state, action: PayloadAction<boolean>) => { state.isTyping = action.payload; },
    clearMessages: (state) => { state.messages = mockChatMessages; },
  },
});
export const { addMessage, setTyping, clearMessages } = aiSlice.actions;
export const aiReducer = aiSlice.reducer;
