# VIBHA BANKING — Frontend Application

> Your Trusted Financial Partner

## Tech Stack
- **React 18** + **TypeScript**
- **Redux Toolkit** for state management
- **Chart.js** / **react-chartjs-2** for data visualisation
- Custom CSS design system (indigo/gold dark theme)

## Features
- 🔐 Login / Register / OTP authentication
- 📊 Dashboard with income vs expense charts, credit score, spending breakdown
- 💳 Accounts — mini statement, account switcher
- ↕ Transactions — searchable table, NEFT/IMPS/UPI filter, fraud scores
- ⇄ Fund Transfer — IMPS / NEFT / RTGS / UPI modal
- 💰 Loans — apply (Personal/Home/Gold/Vehicle/Education/Business/Health), track status
- 📅 EMI Manager — auto-pay toggle, schedule viewer, Electronics EMI / BNPL
- 🎯 Finance Planner — goals tracker, budget analytics
- 🤖 AI Financial Advisor — Claude-powered chatbot with spending analysis
- 🔔 Notifications — priority alerts, mark-read

## Project Structure
```
src/
  App.tsx              # Root component + routing
  index.tsx            # Entry point
  index.css            # Global design system
  types/index.ts       # TypeScript interfaces
  utils/
    helpers.ts         # Formatting utilities
    mockData.ts        # Mock data for all entities
  store/
    index.ts           # Redux store
    slices/            # Auth, Account, Transaction, Loan, EMI, Finance, Notification, AI
  pages/
    LoginPage.tsx
    DashboardPage.tsx
    AccountsPage.tsx
    TransactionsPage.tsx
    LoansPage.tsx
    EMIPage.tsx
    FinancePlannerPage.tsx
    AIAdvisorPage.tsx
    NotificationsPage.tsx
  components/
    common/
      Sidebar.tsx      # Navigation sidebar
      TopBar.tsx       # Header bar
```

## Quick Start
```bash
npm install
npm start
```
Click **"Demo Login (Skip Auth)"** on the login screen to enter instantly.

## Backend Integration Points
Each page is wired to Redux slices. Replace mock data with real API calls in:
- `src/utils/mockData.ts` → connect to actual microservice endpoints
- `src/store/slices/` → add `createAsyncThunk` for each service

## Microservices (Backend - not included in this repo)
| Service | Port | Tech |
|---------|------|------|
| auth-service | 3001 | Node.js/Express |
| account-service | 3002 | Node.js/Express |
| transaction-service | 3003 | Java Spring Boot |
| loan-service | 3004 | Java Spring Boot |
| emi-service | 3005 | Node.js/Express |
| finance-service | 3006 | Node.js/Express |
| notification-service | 3007 | Node.js/Express |
| ai-service | 3008 | Node.js (AWS Bedrock) |
