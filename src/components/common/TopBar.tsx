import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onNavigate?: (page: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ title, subtitle, onNavigate }) => {
  const { unreadCount } = useSelector((s: RootState) => s.notification);
  const { selectedAccount } = useSelector((s: RootState) => s.account);

  return (
    <header style={{
      background: 'var(--surface-900)',
      borderBottom: '1px solid var(--surface-700)',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white', fontWeight: 700 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: 'var(--surface-300)', marginTop: 2 }}>{subtitle}</p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Quick Balance */}
        {selectedAccount && (
          <div style={{
            padding: '7px 14px',
            background: 'var(--surface-800)',
            borderRadius: 10,
            border: '1px solid var(--surface-600)',
            cursor: 'pointer',
          }} onClick={() => onNavigate?.('accounts')}>
            <div style={{ fontSize: 10, color: 'var(--surface-400)', letterSpacing: '0.08em' }}>BALANCE</div>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--gold-400)' }}>
              ₹{selectedAccount.availableBalance.toLocaleString('en-IN')}
            </div>
          </div>
        )}

        {/* Notifications */}
        <button
          onClick={() => onNavigate?.('notifications')}
          style={{
            position: 'relative',
            width: 38, height: 38,
            background: 'var(--surface-800)',
            border: '1px solid var(--surface-600)',
            borderRadius: 10,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
            transition: 'all 0.2s',
          }}
        >
          🔔
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              background: 'var(--danger)',
              color: 'white', fontSize: 10, fontWeight: 700,
              width: 18, height: 18,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--surface-900)',
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* KYC Badge */}
        <div style={{
          padding: '5px 12px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 10,
          fontSize: 12, fontWeight: 500, color: 'var(--success)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span>✓</span> KYC Verified
        </div>
      </div>
    </header>
  );
};

export default TopBar;
