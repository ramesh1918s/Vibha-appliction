import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈' },
  { id: 'accounts', label: 'Accounts', icon: '🏦' },
  { id: 'transactions', label: 'Transactions', icon: '↕' },
  { id: 'transfer', label: 'Fund Transfer', icon: '⇄' },
  { id: 'loans', label: 'Loans', icon: '💰' },
  { id: 'emi', label: 'EMI Manager', icon: '📅' },
  { id: 'electronics', label: 'Electronics EMI', icon: '📱' },
  { id: 'finance', label: 'Finance Planner', icon: '📊' },
  { id: 'ai-advisor', label: 'AI Advisor', icon: '🤖' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s: RootState) => s.auth);
  const { unreadCount } = useSelector((s: RootState) => s.notification);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--surface-700)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 42, height: 42,
            background: 'linear-gradient(135deg, var(--indigo-600), var(--indigo-400))',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: 'white',
            boxShadow: 'var(--shadow-glow-indigo)',
            flexShrink: 0,
          }}>VB</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
              VIBHA
            </div>
            <div style={{ fontSize: 10, color: 'var(--gold-400)', letterSpacing: '0.15em', fontWeight: 600 }}>
              BANKING
            </div>
          </div>
        </div>
        <div style={{ marginTop: 10, fontSize: 10, color: 'var(--surface-400)', letterSpacing: '0.08em' }}>
          Your Trusted Financial Partner
        </div>
      </div>

      {/* User Card */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--surface-700)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--indigo-700), var(--gold-500))',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0,
          }}>
            {user?.firstName[0]}{user?.lastName[0]}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.firstName} {user?.lastName}
            </div>
            <div style={{ fontSize: 11, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, background: 'var(--success)', borderRadius: '50%', display: 'inline-block' }}></span>
              KYC Verified
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 12px', overflow: 'auto' }}>
        <div style={{ fontSize: 10, color: 'var(--surface-400)', letterSpacing: '0.1em', fontWeight: 600, padding: '8px 8px 6px', textTransform: 'uppercase' }}>
          Main Menu
        </div>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 10px',
              borderRadius: 10,
              background: activePage === item.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              border: activePage === item.id ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
              color: activePage === item.id ? 'white' : 'var(--surface-300)',
              fontSize: 13.5,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              marginBottom: 2,
              transition: 'all 0.15s',
              textAlign: 'left',
            }}
            onMouseEnter={e => {
              if (activePage !== item.id) {
                (e.currentTarget as HTMLElement).style.background = 'var(--surface-800)';
                (e.currentTarget as HTMLElement).style.color = 'white';
              }
            }}
            onMouseLeave={e => {
              if (activePage !== item.id) {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--surface-300)';
              }
            }}
          >
            <span style={{ fontSize: 16, width: 22, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.id === 'notifications' && unreadCount > 0 && (
              <span style={{
                background: 'var(--danger)',
                color: 'white',
                fontSize: 10,
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: 99,
                minWidth: 18,
                textAlign: 'center',
              }}>{unreadCount}</span>
            )}
            {activePage === item.id && (
              <span style={{ width: 4, height: 4, background: 'var(--indigo-400)', borderRadius: '50%' }}></span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--surface-700)' }}>
        <button
          onClick={() => onNavigate('profile')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 10px', borderRadius: 10,
            background: activePage === 'profile' ? 'rgba(99,102,241,0.1)' : 'transparent',
            border: '1px solid transparent',
            color: 'var(--surface-300)', fontSize: 13.5, cursor: 'pointer',
            fontFamily: 'var(--font-body)', marginBottom: 4, transition: 'all 0.15s',
          }}
        >
          <span style={{ fontSize: 16 }}>⚙️</span>
          <span>Settings</span>
        </button>
        <button
          onClick={() => dispatch(logout())}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 10px', borderRadius: 10,
            background: 'transparent', border: '1px solid transparent',
            color: 'var(--danger)', fontSize: 13.5, cursor: 'pointer',
            fontFamily: 'var(--font-body)', transition: 'all 0.15s',
          }}
        >
          <span style={{ fontSize: 16 }}>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
