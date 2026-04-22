import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleAutoPay } from '../store/slices/otherSlices';
import { formatCurrency, getLoanTypeLabel, getLoanTypeIcon, getDaysUntil } from '../utils/helpers';
import { EMI } from '../types';

const EMIScheduleModal: React.FC<{ emi: EMI; onClose: () => void }> = ({ emi, onClose }) => {
  const scheduleRows = Array.from({ length: 12 }, (_, i) => {
    const isPaid = i < emi.paidEMIs;
    const isDue = i === emi.paidEMIs;
    const date = new Date();
    date.setMonth(date.getMonth() + (i - emi.paidEMIs) + 1);
    const principal = Math.round(emi.emiAmount * 0.65);
    const interest = emi.emiAmount - principal;
    return { month: i + 1, date, isPaid, isDue, principal, interest };
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 className="modal-title">{getLoanTypeIcon(emi.loanType)} EMI Schedule</h2>
            <p style={{ fontSize: 13, color: 'var(--surface-300)' }}>{getLoanTypeLabel(emi.loanType)} · ₹{emi.emiAmount.toLocaleString('en-IN')}/month</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--surface-300)', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>

        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>#</th><th>Due Date</th><th>Principal</th><th>Interest</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {scheduleRows.map(row => (
                <tr key={row.month}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--surface-400)', fontSize: 12 }}>{row.month}</td>
                  <td style={{ fontSize: 13 }}>{row.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>₹{row.principal.toLocaleString('en-IN')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>₹{row.interest.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`badge ${row.isPaid ? 'badge-success' : row.isDue ? 'badge-warning' : 'badge-neutral'}`}>
                      {row.isPaid ? '✓ Paid' : row.isDue ? '⏰ Due' : 'Upcoming'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn btn-ghost w-full" style={{ marginTop: 16 }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const EMICard: React.FC<{ emi: EMI; onSchedule: () => void }> = ({ emi, onSchedule }) => {
  const dispatch = useDispatch();
  const daysUntil = getDaysUntil(emi.nextDueDate);
  const progressPct = Math.round((emi.paidEMIs / emi.totalEMIs) * 100);
  const isOverdue = daysUntil < 0;
  const isDueSoon = daysUntil >= 0 && daysUntil <= 5;

  const accentColors: Record<string, string> = {
    home: '#10b981', personal: '#6366f1', vehicle: '#3b82f6',
    education: '#8b5cf6', gold: '#f59e0b', business: '#f97316', health: '#ef4444',
  };
  const accent = accentColors[emi.loanType] || '#6366f1';

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden', transition: 'transform 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `${accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            {getLoanTypeIcon(emi.loanType)}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'white', fontSize: 14 }}>{getLoanTypeLabel(emi.loanType)}</div>
            <div style={{ fontSize: 11, color: 'var(--surface-400)' }}>{emi.lenderName}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isOverdue && <span className="badge badge-danger">OVERDUE</span>}
          {isDueSoon && !isOverdue && <span className="badge badge-warning">DUE SOON</span>}
          <label className="toggle">
            <input type="checkbox" checked={emi.autoPay} onChange={() => dispatch(toggleAutoPay(emi.id))} />
            <span className="toggle-track"></span>
            <span className="toggle-thumb"></span>
          </label>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--surface-400)', marginBottom: 3 }}>Monthly EMI</div>
          <div style={{ fontSize: 17, fontWeight: 700, fontFamily: 'var(--font-mono)', color: accent }}>
            ₹{emi.emiAmount.toLocaleString('en-IN')}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--surface-400)', marginBottom: 3 }}>Next Due</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: isOverdue ? 'var(--danger)' : isDueSoon ? 'var(--warning)' : 'white' }}>
            {new Date(emi.nextDueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          </div>
          <div style={{ fontSize: 11, color: 'var(--surface-500)' }}>
            {isOverdue ? `${Math.abs(daysUntil)}d overdue` : `${daysUntil}d left`}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--surface-400)', marginBottom: 3 }}>Remaining</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{emi.totalEMIs - emi.paidEMIs} EMIs</div>
          <div style={{ fontSize: 11, color: 'var(--surface-500)' }}>{emi.paidEMIs} paid</div>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--surface-400)', marginBottom: 5 }}>
          <span>Repayment Progress</span>
          <span>{progressPct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${accent}, ${accent}90)` }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid var(--surface-700)' }}>
        <button className="btn btn-ghost btn-sm" onClick={onSchedule} style={{ flex: 1 }}>📅 Schedule</button>
        <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>📋 Statement</button>
        <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>💳 Pay Now</button>
      </div>

      <div style={{ marginTop: 10, fontSize: 11, color: emi.autoPay ? 'var(--success)' : 'var(--surface-400)', display: 'flex', alignItems: 'center', gap: 5 }}>
        {emi.autoPay ? '⚡ Auto-pay enabled' : '⚠ Auto-pay disabled — enable to avoid late fees'}
      </div>
    </div>
  );
};

const EMIPage: React.FC = () => {
  const { emis, electronicsEMIs } = useSelector((s: RootState) => s.emi);
  const [scheduleFor, setScheduleFor] = useState<EMI | null>(null);
  const [tab, setTab] = useState<'loans' | 'electronics'>('loans');

  const totalEMI = emis.reduce((s, e) => s + e.emiAmount, 0);
  const upcomingCount = emis.filter(e => getDaysUntil(e.nextDueDate) <= 7 && getDaysUntil(e.nextDueDate) >= 0).length;
  const autoPayOn = emis.filter(e => e.autoPay).length;

  return (
    <div className="page-container" style={{ paddingBottom: 40 }}>
      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--indigo-400)' }}>📅</div>
          <div className="stat-label">Total Monthly EMIs</div>
          <div className="stat-value" style={{ color: 'var(--indigo-400)', fontSize: 18 }}>₹{totalEMI.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: 12, color: 'var(--surface-400)', marginTop: 4 }}>{emis.length} active loans</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--warning)' }}>⏰</div>
          <div className="stat-label">Due This Week</div>
          <div className="stat-value" style={{ color: 'var(--warning)', fontSize: 18 }}>{upcomingCount} EMIs</div>
          <div style={{ fontSize: 12, color: 'var(--surface-400)', marginTop: 4 }}>Next 7 days</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--success)' }}>⚡</div>
          <div className="stat-label">Auto-Pay Enabled</div>
          <div className="stat-value" style={{ color: 'var(--success)', fontSize: 18 }}>{autoPayOn}/{emis.length}</div>
          <div style={{ fontSize: 12, color: 'var(--surface-400)', marginTop: 4 }}>Toggle below to enable</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: 'var(--surface-850)', border: '1px solid var(--surface-700)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {(['loans', 'electronics'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`btn btn-sm ${tab === t ? 'btn-primary' : ''}`}
            style={{ minWidth: 160, background: tab !== t ? 'transparent' : undefined, border: 'none', boxShadow: 'none', color: tab !== t ? 'var(--surface-300)' : undefined }}>
            {t === 'loans' ? '💰 Loan EMIs' : '📱 Electronics EMIs'}
          </button>
        ))}
      </div>

      {tab === 'loans' ? (
        <div className="grid-2">
          {emis.map(emi => (
            <EMICard key={emi.id} emi={emi} onSchedule={() => setScheduleFor(emi)} />
          ))}
        </div>
      ) : (
        <div className="grid-2">
          {electronicsEMIs.map(item => (
            <div key={item.id} className="card" style={{ transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--surface-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, border: '1px solid var(--surface-600)', flexShrink: 0 }}>
                  {item.productName.includes('iPhone') ? '📱' : item.productName.includes('TV') ? '📺' : '🖥'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'white', fontSize: 14, marginBottom: 2 }}>{item.productName}</div>
                  <div style={{ fontSize: 12, color: 'var(--surface-400)' }}>{item.merchantName}</div>
                  <div style={{ fontSize: 11, color: 'var(--success)', marginTop: 4 }}>
                    {item.interestRate === 0 ? '✨ 0% Interest EMI' : `${item.interestRate}% p.a.`}
                  </div>
                </div>
                <span className="badge badge-info">BNPL</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[
                  { label: 'EMI Amount', value: `₹${item.emiAmount.toLocaleString('en-IN')}`, highlight: true },
                  { label: 'Total Price', value: `₹${item.totalAmount.toLocaleString('en-IN')}` },
                  { label: 'Remaining', value: `${item.remainingEMIs} EMIs` },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: 11, color: 'var(--surface-400)', marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: s.highlight ? 'var(--gold-400)' : 'white' }}>{s.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ height: 6, background: 'var(--surface-700)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round(((item.tenure - item.remainingEMIs) / item.tenure) * 100)}%`, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--surface-400)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.tenure - item.remainingEMIs} of {item.tenure} paid</span>
                  <span>Next: {new Date(item.nextDueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                </div>
              </div>

              <button className="btn btn-gold w-full btn-sm">💳 Pay EMI</button>
            </div>
          ))}
        </div>
      )}

      {scheduleFor && <EMIScheduleModal emi={scheduleFor} onClose={() => setScheduleFor(null)} />}
    </div>
  );
};

export default EMIPage;
