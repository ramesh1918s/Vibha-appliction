import {
  User, Account, Transaction, Loan, EMI, ElectronicsEMI,
  FinanceGoal, SpendingBudget, Notification, ChatMessage, DashboardMetrics
} from '../types';

export const mockUser: User = {
  id: 'usr_001',
  firstName: 'Vibha',
  lastName: 'Sharma',
  email: 'vibha.sharma@email.com',
  phone: '+91 98765 43210',
  panNumber: 'ABCDE1234F',
  aadhaarNumber: '****-****-1234',
  kycStatus: 'approved',
  createdAt: '2022-03-15T10:00:00Z',
};

export const mockAccounts: Account[] = [
  {
    id: 'acc_001',
    accountNumber: '****4521',
    ifscCode: 'VIBH0001234',
    accountType: 'savings',
    balance: 284750.50,
    availableBalance: 280000.50,
    currency: 'INR',
    isActive: true,
    userId: 'usr_001',
  },
  {
    id: 'acc_002',
    accountNumber: '****7893',
    ifscCode: 'VIBH0001234',
    accountType: 'salary',
    balance: 125000.00,
    availableBalance: 125000.00,
    currency: 'INR',
    isActive: true,
    userId: 'usr_001',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'txn_001', transactionId: 'VB20240101001',
    type: 'credit', mode: 'NEFT', amount: 85000, currency: 'INR',
    description: 'Salary Credit - Tech Corp', merchantName: 'Tech Corp',
    category: 'salary', fromAccount: 'HDFC****1234', toAccount: '****4521',
    toName: 'Vibha Sharma', status: 'completed',
    timestamp: '2024-01-31T09:00:00Z', balanceAfter: 284750.50,
    referenceNumber: 'VB20240131001', fraudScore: 0.02,
  },
  {
    id: 'txn_002', transactionId: 'VB20240102001',
    type: 'debit', mode: 'UPI', amount: 2450, currency: 'INR',
    description: 'Swiggy Order', merchantName: 'Swiggy',
    category: 'food_dining', fromAccount: '****4521', toAccount: undefined,
    toName: undefined, status: 'completed',
    timestamp: '2024-01-30T19:30:00Z', balanceAfter: 199750.50,
    referenceNumber: 'VB20240130002', fraudScore: 0.05,
  },
  {
    id: 'txn_003', transactionId: 'VB20240103001',
    type: 'debit', mode: 'EMI', amount: 12500, currency: 'INR',
    description: 'Home Loan EMI - January', merchantName: 'Vibha Bank',
    category: 'emi', fromAccount: '****4521', toAccount: undefined,
    toName: 'Home Loan Account', status: 'completed',
    timestamp: '2024-01-28T08:00:00Z', balanceAfter: 202200.50,
    referenceNumber: 'VB20240128003', fraudScore: 0.01,
  },
  {
    id: 'txn_004', transactionId: 'VB20240104001',
    type: 'debit', mode: 'UPI', amount: 15999, currency: 'INR',
    description: 'Amazon Shopping', merchantName: 'Amazon',
    category: 'shopping', fromAccount: '****4521', toAccount: undefined,
    toName: undefined, status: 'completed',
    timestamp: '2024-01-25T14:20:00Z', balanceAfter: 214700.50,
    referenceNumber: 'VB20240125004', fraudScore: 0.08,
  },
  {
    id: 'txn_005', transactionId: 'VB20240105001',
    type: 'debit', mode: 'IMPS', amount: 5000, currency: 'INR',
    description: 'Transfer to Rahul', merchantName: undefined,
    category: 'transfer', fromAccount: '****4521', toAccount: '****9021',
    toName: 'Rahul Kumar', status: 'completed',
    timestamp: '2024-01-24T11:15:00Z', balanceAfter: 230699.50,
    referenceNumber: 'VB20240124005', fraudScore: 0.03,
  },
  {
    id: 'txn_006', transactionId: 'VB20240106001',
    type: 'debit', mode: 'UPI', amount: 3200, currency: 'INR',
    description: 'Electricity Bill - TSSPDCL', merchantName: 'TSSPDCL',
    category: 'utilities', fromAccount: '****4521', toAccount: undefined,
    toName: undefined, status: 'completed',
    timestamp: '2024-01-22T10:00:00Z', balanceAfter: 235699.50,
    referenceNumber: 'VB20240122006', fraudScore: 0.01,
  },
  {
    id: 'txn_007', transactionId: 'VB20240107001',
    type: 'debit', mode: 'UPI', amount: 890, currency: 'INR',
    description: 'Netflix Subscription', merchantName: 'Netflix',
    category: 'entertainment', fromAccount: '****4521', toAccount: undefined,
    toName: undefined, status: 'completed',
    timestamp: '2024-01-20T00:00:00Z', balanceAfter: 238899.50,
    referenceNumber: 'VB20240120007', fraudScore: 0.01,
  },
  {
    id: 'txn_008', transactionId: 'VB20240108001',
    type: 'debit', mode: 'ATM', amount: 10000, currency: 'INR',
    description: 'ATM Withdrawal - Banjara Hills', merchantName: undefined,
    category: 'other', fromAccount: '****4521', toAccount: undefined,
    toName: undefined, status: 'completed',
    timestamp: '2024-01-18T16:45:00Z', balanceAfter: 239789.50,
    referenceNumber: 'VB20240118008', fraudScore: 0.04,
  },
];

export const mockLoans: Loan[] = [
  {
    id: 'loan_001', loanNumber: 'VBH2022001234',
    type: 'home', principalAmount: 4500000,
    outstandingAmount: 3850000, interestRate: 8.5,
    tenure: 240, emiAmount: 42500, disbursedDate: '2022-03-01',
    nextEmiDate: '2024-02-01', status: 'disbursed', userId: 'usr_001',
  },
  {
    id: 'loan_002', loanNumber: 'VBP2023005678',
    type: 'personal', principalAmount: 300000,
    outstandingAmount: 145000, interestRate: 12.5,
    tenure: 36, emiAmount: 10050, disbursedDate: '2023-01-15',
    nextEmiDate: '2024-02-15', status: 'disbursed', userId: 'usr_001',
  },
];

export const mockEMIs: EMI[] = [
  {
    id: 'emi_001', loanId: 'loan_001', loanType: 'home',
    lenderName: 'Vibha Banking', totalAmount: 4500000,
    emiAmount: 42500, paidEMIs: 22, totalEMIs: 240,
    nextDueDate: '2024-02-01', nextDueAmount: 42500,
    autoPay: true, status: 'active',
  },
  {
    id: 'emi_002', loanId: 'loan_002', loanType: 'personal',
    lenderName: 'Vibha Banking', totalAmount: 300000,
    emiAmount: 10050, paidEMIs: 12, totalEMIs: 36,
    nextDueDate: '2024-02-15', nextDueAmount: 10050,
    autoPay: false, status: 'active',
  },
  {
    id: 'emi_003', loanId: 'loan_003', loanType: 'vehicle',
    lenderName: 'Vibha Banking', totalAmount: 800000,
    emiAmount: 15200, paidEMIs: 18, totalEMIs: 60,
    nextDueDate: '2024-02-10', nextDueAmount: 15200,
    autoPay: true, status: 'active',
  },
];

export const mockElectronicsEMIs: ElectronicsEMI[] = [
  {
    id: 'eemi_001',
    productName: 'iPhone 15 Pro Max 256GB',
    merchantName: 'Apple Store',
    productImage: 'https://via.placeholder.com/80x80/1a1a2e/gold?text=📱',
    totalAmount: 159900,
    downPayment: 15990,
    emiAmount: 7996,
    tenure: 18,
    interestRate: 0,
    nextDueDate: '2024-02-05',
    remainingEMIs: 14,
    status: 'active',
  },
  {
    id: 'eemi_002',
    productName: 'Samsung 65" QLED 4K TV',
    merchantName: 'Samsung Store',
    productImage: 'https://via.placeholder.com/80x80/1a1a2e/gold?text=📺',
    totalAmount: 89990,
    downPayment: 8999,
    emiAmount: 4500,
    tenure: 18,
    interestRate: 0,
    nextDueDate: '2024-02-12',
    remainingEMIs: 10,
    status: 'active',
  },
];

export const mockFinanceGoals: FinanceGoal[] = [
  {
    id: 'goal_001',
    title: 'Emergency Fund',
    targetAmount: 500000,
    currentAmount: 320000,
    targetDate: '2024-12-31',
    category: 'emergency_fund',
    monthlyContribution: 15000,
    isAutoSave: true,
    color: '#6366f1',
  },
  {
    id: 'goal_002',
    title: 'Goa Trip 2024',
    targetAmount: 80000,
    currentAmount: 52000,
    targetDate: '2024-06-01',
    category: 'vacation',
    monthlyContribution: 10000,
    isAutoSave: false,
    color: '#f59e0b',
  },
  {
    id: 'goal_003',
    title: 'New Car Fund',
    targetAmount: 1200000,
    currentAmount: 380000,
    targetDate: '2025-12-31',
    category: 'vehicle',
    monthlyContribution: 20000,
    isAutoSave: true,
    color: '#10b981',
  },
];

export const mockBudgets: SpendingBudget[] = [
  { category: 'food_dining', budgetAmount: 8000, spentAmount: 6200, month: '2024-01' },
  { category: 'shopping', budgetAmount: 15000, spentAmount: 18500, month: '2024-01' },
  { category: 'travel', budgetAmount: 5000, spentAmount: 2100, month: '2024-01' },
  { category: 'utilities', budgetAmount: 4000, spentAmount: 3800, month: '2024-01' },
  { category: 'healthcare', budgetAmount: 3000, spentAmount: 1200, month: '2024-01' },
  { category: 'entertainment', budgetAmount: 2500, spentAmount: 2100, month: '2024-01' },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'transaction',
    title: 'Salary Credited',
    message: '₹85,000 has been credited to your account ****4521 from Tech Corp.',
    isRead: false,
    timestamp: '2024-01-31T09:00:00Z',
    priority: 'high',
  },
  {
    id: 'notif_002',
    type: 'emi',
    title: 'EMI Due Reminder',
    message: 'Home Loan EMI of ₹42,500 is due on Feb 1, 2024. Auto-pay is enabled.',
    isRead: false,
    timestamp: '2024-01-29T10:00:00Z',
    priority: 'high',
  },
  {
    id: 'notif_003',
    type: 'offer',
    title: 'Pre-approved Personal Loan',
    message: 'Congratulations! You are pre-approved for a Personal Loan up to ₹5,00,000 at 10.5% p.a.',
    isRead: false,
    timestamp: '2024-01-28T12:00:00Z',
    priority: 'medium',
  },
  {
    id: 'notif_004',
    type: 'security',
    title: 'New Login Detected',
    message: 'A new login was detected from Hyderabad, Telangana. If this was not you, please contact support.',
    isRead: true,
    timestamp: '2024-01-27T08:30:00Z',
    priority: 'high',
  },
  {
    id: 'notif_005',
    type: 'general',
    title: 'KYC Verified',
    message: 'Your KYC documents have been successfully verified. Enjoy full banking services.',
    isRead: true,
    timestamp: '2024-01-20T14:00:00Z',
    priority: 'low',
  },
];

export const mockDashboardMetrics: DashboardMetrics = {
  totalBalance: 409750.50,
  monthlyIncome: 85000,
  monthlyExpenses: 52239,
  savingsRate: 38.5,
  upcomingEMIs: 69750,
  creditScore: 782,
};

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg_001',
    role: 'assistant',
    content: 'Hello Vibha! 👋 I\'m your AI Financial Advisor powered by Claude. I can help you with spending analysis, investment advice, loan guidance, and more. What would you like to know today?',
    timestamp: new Date().toISOString(),
    suggestions: [
      'Analyse my spending this month',
      'Should I prepay my home loan?',
      'How to improve my credit score?',
      'Best investment options for ₹50,000',
    ],
  },
];

export const spendingChartData = {
  labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
  income: [82000, 85000, 85000, 88000, 85000, 85000],
  expenses: [48000, 52000, 49000, 58000, 63000, 52239],
};

export const categoryColors: Record<string, string> = {
  food_dining: '#f59e0b',
  shopping: '#6366f1',
  travel: '#10b981',
  utilities: '#3b82f6',
  healthcare: '#ef4444',
  entertainment: '#8b5cf6',
  education: '#06b6d4',
  investment: '#22c55e',
  transfer: '#64748b',
  salary: '#10b981',
  emi: '#f97316',
  other: '#94a3b8',
};

export const categoryLabels: Record<string, string> = {
  food_dining: 'Food & Dining',
  shopping: 'Shopping',
  travel: 'Travel',
  utilities: 'Utilities',
  healthcare: 'Healthcare',
  entertainment: 'Entertainment',
  education: 'Education',
  investment: 'Investment',
  transfer: 'Transfer',
  salary: 'Salary',
  emi: 'EMI',
  other: 'Other',
};
