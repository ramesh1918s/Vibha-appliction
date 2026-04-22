import React, { useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from './store';
import './index.css';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import LoansPage from './pages/LoansPage';
import EMIPage from './pages/EMIPage';
import FinancePlannerPage from './pages/FinancePlannerPage';
import AIAdvisorPage from './pages/AIAdvisorPage';
import NotificationsPage from './pages/NotificationsPage';
import AccountsPage from './pages/AccountsPage';

// Common
import Sidebar from './components/common/Sidebar';
import TopBar from './components/common/TopBar';

type Page =
  | 'dashboard' | 'accounts' | 'transactions' | 'transfer'
  | 'loans' | 'emi' | 'electronics' | 'finance'
  | 'ai-advisor' | 'notifications' | 'profile';

const PAGE_TITLES: Record<Page, { title: string; subtitle?: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Your financial overview' },
  accounts: { title: 'Accounts', subtitle: 'Manage your bank accounts' },
  transactions: { title: 'Transactions', subtitle: 'All your transactions in one place' },
  transfer: { title: 'Fund Transfer', subtitle: 'Send money instantly' },
  loans: { title: 'Loans', subtitle: 'Manage and apply for loans' },
  emi: { title: 'EMI Manager', subtitle: 'Track and manage your EMIs' },
  electronics: { title: 'Electronics EMI', subtitle: 'Buy now, pay later' },
  finance: { title: 'Finance Planner', subtitle: 'Goals, budgets, and savings' },
  'ai-advisor': { title: 'AI Financial Advisor', subtitle: 'Powered by Claude' },
  notifications: { title: 'Notifications', subtitle: 'Stay updated' },
  profile: { title: 'Profile & Settings', subtitle: 'Manage your account' },
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  const [activePage, setActivePage] = useState<Page>('dashboard');

  if (!isAuthenticated) return <LoginPage />;

  const { title, subtitle } = PAGE_TITLES[activePage];

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage onNavigate={p => setActivePage(p as Page)} />;
      case 'accounts': return <AccountsPage />;
      case 'transactions':
      case 'transfer': return <TransactionsPage onNavigate={p => setActivePage(p as Page)} />;
      case 'loans': return <LoansPage />;
      case 'emi':
      case 'electronics': return <EMIPage />;
      case 'finance': return <FinancePlannerPage />;
      case 'ai-advisor': return <AIAdvisorPage />;
      case 'notifications': return <NotificationsPage />;
      case 'profile': return (
        <div className="page-container">
          <div className="card" style={{ maxWidth: 600 }}>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--indigo-700), var(--gold-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: 'white', margin: '0 auto 16px' }}>VS</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white', marginBottom: 4 }}>Vibha Sharma</h2>
              <p style={{ fontSize: 13, color: 'var(--surface-400)' }}>vibha.sharma@email.com · +91 98765 43210</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                <span className="badge badge-success">KYC Verified</span>
                <span className="badge badge-info">Premium Customer</span>
              </div>
            </div>
            <div className="divider" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '10px 0' }}>
              {['Edit Profile', 'Change Password', 'Linked Cards', 'Beneficiaries', 'Documents', 'Preferences'].map(item => (
                <button key={item} className="btn btn-ghost" style={{ justifyContent: 'flex-start', gap: 10 }}>
                  ⚙️ {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
      default: return <DashboardPage onNavigate={p => setActivePage(p as Page)} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={p => setActivePage(p as Page)} />
      <main className="main-content">
        <TopBar
          title={title}
          subtitle={subtitle}
          onNavigate={p => setActivePage(p as Page)}
        />
        {activePage === 'ai-advisor' ? renderPage() : (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {renderPage()}
          </div>
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
