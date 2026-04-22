import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { formatCurrency } from '../utils/helpers';
import { mockTransactions } from '../utils/mockData';

const AccountsPage: React.FC = () => {
  const { accounts } = useSelector((s: RootState) => s.account);
  const [selectedAcc, setSelectedAcc] = useState(accounts[0]);

  const accTxns = mockTransactions.filter(t =>
    t.fromAccount.includes(selectedAcc.accountNumber.slice(-4)) ||
    (t.toAccount && t.toAccount.includes(selectedAcc.accountNumber.slice(-4)))
  ).slice(0, 6);

  return (
    <div className="page-container" style={{ paddingBottom: 40 }}>
      {/* Account Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        {accounts.map(acc => {
          const isSelected = acc.id === selectedAcc.id;
          return (
            <div key={acc.id}
              onClick={() => setSelectedAcc(acc)}
              style={{
                flex: '1 1 300px', maxWidth: 380,
                background: isSelected
                  ? 'linear-gradient(135deg, var(--indigo-800), var(--indigo-600))'
                  : 'var(--surface-850)',
                border: `1.5px solid ${isSelected ? 'var(--indigo-400)' : 'var(--surface-700)'}`,
                borderRadius: 20, padding: '24px 24px',
                cursor: 'pointer', transition: 'all 0.25s',
                boxShadow: isSelected ? 'var(--shadow-glow-indigo)' : 'none',
                position: 'relative', overflow: 'hidden',
              }}>
              {isSelected && (
                <>
                  <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', bottom: -20, right: 60, width: 80, height: 80, borderRadius: '50%', background: 'rgba(251,191,36,0.08)', pointerEvents: 'none' }} />
                </>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--surface-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {acc.accountType} Account
                </div>
                <div style={{ width: 32, height: 32, background: isSelected ? 'rgba(255,255,255,0.15)' : 'var(--surface-700)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                  🏦
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--surface-300)', letterSpacing: '0.15em', marginBottom: 14 }}>
                •••• •••• •••• {acc.accountNumber.slice(-4)}
              </div>
              <div>
                <div style={{ fontSize: 11, color: isSelected ? 'rgba(255,255,255,0.6)' : 'var(--surface-500)', marginBottom: 4 }}>Available Balance</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 800, color: isSelected ? 'white' : 'var(--gold-400)' }}>
                  {formatCurrency(acc.availableBalance)}
                </div>
              </div>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: isSelected ? 'rgba(255,255,255,0.6)' : 'var(--surface-400)' }}>
                <span>IFSC: {acc.ifscCode}</span>
                <span className={`badge ${acc.isActive ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: 10 }}>
                  {acc.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          );
        })}

        {/* Add Account CTA */}
        <div style={{
          flex: '1 1 200px', maxWidth: 240,
          border: '1.5px dashed var(--surface-600)', borderRadius: 20,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 24, cursor: 'pointer', color: 'var(--surface-400)',
          transition: 'all 0.2s', gap: 8,
        }}
          onMouseEnter={e => { (e.currentTarget.style.borderColor = 'var(--indigo-500)'); (e.currentTarget.style.color = 'var(--indigo-400)'); }}
          onMouseLeave={e => { (e.currentTarget.style.borderColor = 'var(--surface-600)'); (e.currentTarget.style.color = 'var(--surface-400)'); }}>
          <div style={{ fontSize: 28 }}>+</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Open New Account</div>
        </div>
      </div>

      {/* Account Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        {/* Details Panel */}
        <div className="card">
          <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 16 }}>Account Details</div>
          {[
            { label: 'Account Holder', value: 'Vibha Sharma' },
            { label: 'Account Number', value: selectedAcc.accountNumber, mono: true },
            { label: 'IFSC Code', value: selectedAcc.ifscCode, mono: true },
            { label: 'Account Type', value: selectedAcc.accountType.charAt(0).toUpperCase() + selectedAcc.accountType.slice(1) },
            { label: 'Currency', value: selectedAcc.currency },
            { label: 'Total Balance', value: formatCurrency(selectedAcc.balance) },
            { label: 'Available Balance', value: formatCurrency(selectedAcc.availableBalance), highlight: true },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--surface-800)' }}>
              <span style={{ fontSize: 12, color: 'var(--surface-400)' }}>{row.label}</span>
              <span style={{
                fontSize: 13, fontWeight: 500,
                fontFamily: row.mono ? 'var(--font-mono)' : 'inherit',
                color: row.highlight ? 'var(--gold-400)' : 'white',
              }}>{row.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>📊 Statement</button>
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>💳 Cheque Book</button>
          </div>
        </div>

        {/* Mini Statement */}
        <div className="card">
          <div className="section-header">
            <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Recent Activity</span>
            <button className="btn btn-ghost btn-sm">📥 Download</button>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr><th>Description</th><th>Date</th><th>Mode</th><th style={{ textAlign: 'right' }}>Amount</th><th style={{ textAlign: 'right' }}>Balance</th></tr>
              </thead>
              <tbody>
                {mockTransactions.slice(0, 8).map(txn => (
                  <tr key={txn.id}>
                    <td style={{ fontSize: 13 }}>{txn.description}</td>
                    <td style={{ fontSize: 12, color: 'var(--surface-400)', fontFamily: 'var(--font-mono)' }}>
                      {new Date(txn.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                    <td><span className="badge badge-neutral" style={{ fontSize: 10 }}>{txn.mode}</span></td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: txn.type === 'credit' ? 'var(--success)' : 'var(--danger)' }}>
                      {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--surface-300)' }}>
                      ₹{txn.balanceAfter.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
