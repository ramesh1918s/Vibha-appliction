import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Transaction } from '../types';
import { categoryLabels as catLabels, categoryColors as catColors } from '../utils/mockData';

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtTime = (d: string) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

const TransactionDetail: React.FC<{ txn: Transaction; onClose: () => void }> = ({ txn, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 className="modal-title">Transaction Details</h2>
          <p style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--surface-400)' }}>#{txn.referenceNumber}</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--surface-300)', cursor: 'pointer', fontSize: 20 }}>✕</button>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 12px', background: txn.type === 'credit' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
          {txn.type === 'credit' ? '↓' : '↑'}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: txn.type === 'credit' ? 'var(--success)' : 'var(--danger)' }}>
          {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
        </div>
        <div style={{ fontSize: 14, color: 'var(--surface-200)', marginTop: 6 }}>{txn.description}</div>
        <div style={{ marginTop: 8 }}>
          <span className={`badge ${txn.status === 'completed' ? 'badge-success' : txn.status === 'failed' ? 'badge-danger' : 'badge-warning'}`}>{txn.status.toUpperCase()}</span>
        </div>
      </div>
      <div>
        {[
          { label: 'Transaction ID', value: txn.transactionId, mono: true },
          { label: 'Date & Time', value: `${fmtDate(txn.timestamp)} · ${fmtTime(txn.timestamp)}` },
          { label: 'Mode', value: txn.mode },
          { label: 'Category', value: catLabels[txn.category] || txn.category },
          { label: 'From Account', value: txn.fromAccount, mono: true },
          ...(txn.toAccount ? [{ label: 'To Account', value: txn.toAccount, mono: true }] : []),
          ...(txn.toName ? [{ label: 'Beneficiary', value: txn.toName }] : []),
          { label: 'Balance After', value: `₹${txn.balanceAfter.toLocaleString('en-IN')}`, mono: true },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--surface-800)' }}>
            <span style={{ fontSize: 13, color: 'var(--surface-400)' }}>{row.label}</span>
            <span style={{ fontSize: 13, color: 'white', fontFamily: row.mono ? 'var(--font-mono)' : 'inherit', fontWeight: 500 }}>{row.value}</span>
          </div>
        ))}
      </div>
      {txn.fraudScore !== undefined && (
        <div style={{ marginTop: 16, padding: '10px 14px', background: txn.fraudScore < 0.1 ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${txn.fraudScore < 0.1 ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🤖</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: txn.fraudScore < 0.1 ? 'var(--success)' : 'var(--warning)' }}>AI Fraud Score: {(txn.fraudScore * 100).toFixed(0)}% risk</div>
            <div style={{ fontSize: 11, color: 'var(--surface-400)' }}>{txn.fraudScore < 0.1 ? 'Transaction verified as safe' : 'Slight anomaly detected — monitored'}</div>
          </div>
        </div>
      )}
      <button className="btn btn-ghost w-full" style={{ marginTop: 20 }} onClick={onClose}>Close</button>
    </div>
  </div>
);

const TransferModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [mode, setMode] = useState('IMPS');
  const [amount, setAmount] = useState('');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="modal-title">Fund Transfer</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--surface-300)', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 20 }}>
          {['IMPS', 'NEFT', 'RTGS', 'UPI'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ padding: '10px 0', borderRadius: 10, border: `1.5px solid ${mode === m ? 'var(--indigo-500)' : 'var(--surface-600)'}`, background: mode === m ? 'rgba(99,102,241,0.15)' : 'transparent', color: mode === m ? 'white' : 'var(--surface-300)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{m}</button>
          ))}
        </div>
        <div className="input-group"><label className="input-label">Account / UPI ID</label><input className="input" placeholder={mode === 'UPI' ? 'name@upi' : 'Account number'} /></div>
        {mode !== 'UPI' && <div className="input-group"><label className="input-label">IFSC Code</label><input className="input" placeholder="VIBH0001234" /></div>}
        <div className="input-group"><label className="input-label">Beneficiary Name</label><input className="input" placeholder="Enter name" /></div>
        <div className="input-group"><label className="input-label">Amount (₹)</label><input className="input" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} style={{ fontFamily: 'var(--font-mono)', fontSize: 18 }} /></div>
        <div className="input-group"><label className="input-label">Remarks</label><input className="input" placeholder="Optional" /></div>
        <div style={{ padding: '12px 14px', background: 'rgba(99,102,241,0.06)', borderRadius: 10, border: '1px solid rgba(99,102,241,0.15)', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--surface-300)' }}>
            <span>Amount</span><span style={{ color: 'white', fontFamily: 'var(--font-mono)' }}>₹{Number(amount || 0).toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--surface-300)', marginTop: 6 }}>
            <span>Charges</span><span style={{ color: 'var(--success)' }}>FREE</span>
          </div>
        </div>
        <button className="btn btn-primary w-full btn-lg" onClick={onClose} style={{ marginBottom: 10 }}>Transfer ₹{Number(amount || 0).toLocaleString('en-IN')}</button>
        <button className="btn btn-ghost w-full" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

const TransactionsPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const { transactions } = useSelector((s: RootState) => s.transaction);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [search, setSearch] = useState('');

  const filtered = transactions.filter(t => {
    if (filter === 'credit' && t.type !== 'credit') return false;
    if (filter === 'debit' && t.type !== 'debit') return false;
    if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalCredit = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalDebit = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="page-container" style={{ paddingBottom: 40 }}>
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card"><div className="stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--success)' }}>↓</div><div className="stat-label">Total Credits</div><div className="stat-value" style={{ color: 'var(--success)', fontSize: 18 }}>+₹{totalCredit.toLocaleString('en-IN')}</div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--danger)' }}>↑</div><div className="stat-label">Total Debits</div><div className="stat-value" style={{ color: 'var(--danger)', fontSize: 18 }}>-₹{totalDebit.toLocaleString('en-IN')}</div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--indigo-400)' }}>≡</div><div className="stat-label">Transactions</div><div className="stat-value" style={{ color: 'var(--indigo-400)', fontSize: 18 }}>{transactions.length}</div></div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="input" placeholder="🔍 Search transactions..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'credit', 'debit'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} style={{ textTransform: 'capitalize' }}>
              {f === 'all' ? 'All' : f === 'credit' ? '↓ Credits' : '↑ Debits'}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm">📥 Download</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowTransfer(true)}>⇄ Transfer</button>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Description</th><th>Date & Time</th><th>Mode</th><th>Category</th><th>Status</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
          <tbody>
            {filtered.map(txn => (
              <tr key={txn.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(txn)}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: txn.type === 'credit' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{txn.type === 'credit' ? '↓' : '↑'}</div>
                    <div><div style={{ fontWeight: 500, color: 'white', fontSize: 13 }}>{txn.description}</div>{txn.merchantName && <div style={{ fontSize: 11, color: 'var(--surface-400)' }}>{txn.merchantName}</div>}</div>
                  </div>
                </td>
                <td style={{ fontSize: 12, color: 'var(--surface-300)', fontFamily: 'var(--font-mono)' }}>{fmtDate(txn.timestamp)}<br /><span style={{ color: 'var(--surface-500)' }}>{fmtTime(txn.timestamp)}</span></td>
                <td><span className="badge badge-info">{txn.mode}</span></td>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: catColors[txn.category], display: 'inline-block' }} /><span style={{ fontSize: 12, color: 'var(--surface-200)' }}>{catLabels[txn.category]}</span></div></td>
                <td><span className={`badge ${txn.status === 'completed' ? 'badge-success' : txn.status === 'failed' ? 'badge-danger' : 'badge-warning'}`}>{txn.status}</span></td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, color: txn.type === 'credit' ? 'var(--success)' : 'var(--danger)', fontSize: 14 }}>{txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && <TransactionDetail txn={selected} onClose={() => setSelected(null)} />}
      {showTransfer && <TransferModal onClose={() => setShowTransfer(false)} />}
    </div>
  );
};

export default TransactionsPage;
