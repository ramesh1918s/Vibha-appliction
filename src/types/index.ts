// ============================================================
// VIBHA BANKING - Type Definitions
// ============================================================

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  panNumber?: string;
  aadhaarNumber?: string;
  kycStatus: 'pending' | 'in_review' | 'approved' | 'rejected';
  profilePicture?: string;
  createdAt: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'savings' | 'current' | 'salary' | 'fd';
  balance: number;
  availableBalance: number;
  currency: string;
  isActive: boolean;
  userId: string;
}

export interface Transaction {
  id: string;
  transactionId: string;
  type: 'credit' | 'debit';
  mode: 'NEFT' | 'RTGS' | 'IMPS' | 'UPI' | 'ATM' | 'INTERNAL' | 'EMI';
  amount: number;
  currency: string;
  description: string;
  merchantName?: string;
  category: TransactionCategory;
  fromAccount: string;
  toAccount?: string;
  toName?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'reversed';
  timestamp: string;
  balanceAfter: number;
  referenceNumber: string;
  fraudScore?: number;
}

export type TransactionCategory =
  | 'food_dining'
  | 'shopping'
  | 'travel'
  | 'utilities'
  | 'healthcare'
  | 'entertainment'
  | 'education'
  | 'investment'
  | 'transfer'
  | 'salary'
  | 'emi'
  | 'other';

export interface Loan {
  id: string;
  loanNumber: string;
  type: LoanType;
  principalAmount: number;
  outstandingAmount: number;
  interestRate: number;
  tenure: number; // months
  emiAmount: number;
  disbursedDate: string;
  nextEmiDate: string;
  status: 'applied' | 'under_review' | 'approved' | 'disbursed' | 'closed' | 'rejected';
  userId: string;
}

export type LoanType =
  | 'personal'
  | 'home'
  | 'gold'
  | 'vehicle'
  | 'education'
  | 'business'
  | 'health';

export interface LoanApplication {
  id: string;
  loanType: LoanType;
  requestedAmount: number;
  tenure: number;
  purpose: string;
  employmentType: 'salaried' | 'self_employed' | 'business';
  monthlyIncome: number;
  documents: UploadedDocument[];
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt?: string;
  creditScore?: number;
}

export interface EMI {
  id: string;
  loanId: string;
  loanType: LoanType;
  lenderName: string;
  totalAmount: number;
  emiAmount: number;
  paidEMIs: number;
  totalEMIs: number;
  nextDueDate: string;
  nextDueAmount: number;
  autoPay: boolean;
  status: 'active' | 'completed' | 'overdue';
}

export interface EMISchedule {
  month: number;
  dueDate: string;
  emiAmount: number;
  principal: number;
  interest: number;
  outstandingBalance: number;
  status: 'paid' | 'due' | 'upcoming';
  paidDate?: string;
}

export interface ElectronicsEMI {
  id: string;
  productName: string;
  merchantName: string;
  productImage: string;
  totalAmount: number;
  downPayment: number;
  emiAmount: number;
  tenure: number;
  interestRate: number;
  nextDueDate: string;
  remainingEMIs: number;
  status: 'active' | 'completed';
}

export interface FinanceGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'emergency_fund' | 'vacation' | 'home' | 'vehicle' | 'education' | 'retirement' | 'other';
  monthlyContribution: number;
  isAutoSave: boolean;
  color: string;
}

export interface SpendingBudget {
  category: TransactionCategory;
  budgetAmount: number;
  spentAmount: number;
  month: string;
}

export interface Notification {
  id: string;
  type: 'transaction' | 'loan' | 'emi' | 'offer' | 'security' | 'general';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: 'aadhaar' | 'pan' | 'salary_slip' | 'bank_statement' | 'property_doc' | 'other';
  url: string;
  uploadedAt: string;
  status: 'uploading' | 'uploaded' | 'verified' | 'rejected';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export interface FraudAlert {
  transactionId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  score: number;
}

export interface DashboardMetrics {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  upcomingEMIs: number;
  creditScore: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  otpVerified: boolean;
}

export interface AccountState {
  accounts: Account[];
  selectedAccount: Account | null;
  isLoading: boolean;
  error: string | null;
}

export interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  filters: TransactionFilters;
}

export interface TransactionFilters {
  type?: 'credit' | 'debit';
  category?: TransactionCategory;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface LoanState {
  loans: Loan[];
  applications: LoanApplication[];
  isLoading: boolean;
  error: string | null;
}

export interface EMIState {
  emis: EMI[];
  electronicsEMIs: ElectronicsEMI[];
  isLoading: boolean;
  error: string | null;
}

export interface FinanceState {
  goals: FinanceGoal[];
  budgets: SpendingBudget[];
  isLoading: boolean;
  error: string | null;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

export interface AIState {
  messages: ChatMessage[];
  isTyping: boolean;
  error: string | null;
}
