import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { LoanType } from '../types';
import { formatCurrency, getLoanTypeLabel, getLoanTypeIcon, getProgressPercent } from '../utils/helpers';

const LOAN_PRODUCTS = [
  { type: 'personal' as LoanType, rate: '10.5%', maxAmount: '₹40 Lakh', tenure: '60 months', icon: '👤', color: '#6366f1', features: ['Instant approval', 'No collateral', 'Flexible repayment'] },
  { type: 'home' as LoanType, rate: '8.5%', maxAmount: '₹5 Crore', tenure: '360 months', icon: '🏠', color: '#10b981', features: ['Low interest', 'Tax benefits', 'Top-up available'] },
  { type: 'gold' as LoanType, rate: '7.5%', maxAmount: '₹1 Crore', tenure: '24 months', icon: '🪙', color: '#f59e0b', features: ['Instant disbursement', 'No income proof', 'Renew anytime'] },
  { type: 'vehicle' as LoanType, rate: '9.0%', maxAmount: '₹50 Lakh', tenure: '84 months', icon: '🚗', color: '#3b82f6', features: ['New & used vehicles', 'Quick processing', '100% financing'] },
  { type: 'education' as LoanType, rate: '9.5%', maxAmount: '₹75 Lakh', tenure: '120 months', icon: '🎓', color: '#8b5cf6', features: ['Study abroad', 'Moratorium period', 'Tax deduction'] },
  { type: 'business' as LoanType, rate: '11.5%', maxAmount: '₹2 Crore', tenure: '60 months', icon: '💼', color: '#f97316', features: ['Working capital', 'Equipment finance', 'Balance transfer'] },
  { type: 'health' as LoanType, rate: '12.0%', maxAmount: '₹20 Lakh', tenure: '48 months', icon: '🏥', color: '#ef4444', features: ['Medical emergencies', 'Paperless process', 'Same-day disbursal'] },
];

// Apply Loan Modal
const ApplyModal: React.FC<{ loanType: LoanType; onClose: () => void }> = ({ loanType, onClose }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [tenure, setTenure] = useState('12');
  const product = LOAN_PRODUCTS.find(p => p.type === loanType)!;

  const emi = amount && tenure
    ? Math.round((Number(amount) * (parseFloat(product.rate) / 1200)) / (1 - Math.pow(1 + parseFloat(product.rate) / 1200, -Number(tenure))))
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="modal-title">{product.icon} Apply for {getLoanTypeLabel(loanType)}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--surface-300)', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 99, background: step >= s ? product.color : 'var(--surface-700)', transition: 'background 0.3s' }} />
          ))}
        </div>

        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 16 }}>Loan Details</h3>
            <div className="input-group">
              <label className="input-label">Loan Amount (₹)</label>
              <input className="input" type="number" placeholder="e.g. 500000" value={amount}
                onChange={e => setAmount(e.target.value)} style={{ fontFamily: 'var(--font-mono)', fontSize: 16 }} />
            </div>
            <div className="input-group">
              <label className="input-label">Tenure (months): {tenure}</label>
              <input type="range" min="6" max="120" step="6" value={tenure}
                onChange={e => setTenure(e.target.value)}
                style={{ width: '100%', accentColor: product.color }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--surface-400)', marginTop: 4 }}>
                <span>6 months</span><span>120 months</span>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Purpose</label>
              <select className="input" style={{ cursor: 'pointer' }}>
                <option>Select purpose...</option>
                <option>Debt consolidation</option>
                <option>Home renovation</option>
                <option>Wedding expenses</option>
                <option>Medical emergency</option>
                <option>Other</option>
              </select>
            </div>
            {emi > 0 && (
              <div style={{ padding: '14px 16px', background: `${product.color}15`, border: `1px solid ${product.color}30`, borderRadius: 12, marginTop: 4 }}>
                <div style={{ fontSize: 12, color: 'var(--surface-300)', marginBottom: 4 }}>Estimated Monthly EMI</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: product.color }}>
                  ₹{emi.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: 11, color: 'var(--surface-400)', marginTop: 4 }}>
                  @ {product.rate} p.a. · {tenure} months · Total: ₹{(emi * Number(tenure)).toLocaleString('en-IN')}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 16 }}>Employment Details</h3>
            <div className="input-group">
              <label className="input-label">Employment Type</label>
              <select className="input" style={{ cursor: 'pointer' }}>
                <option>Salaried</option><option>Self-employed</option><option>Business Owner</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Company Name</label>
              <input className="input" placeholder="Enter employer name" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="input-group">
                <label className="input-label">Monthly Income (₹)</label>
                <input className="input" type="number" placeholder="e.g. 85000" />
              </div>
              <div className="input-group">
                <label className="input-label">Work Experience (yrs)</label>
                <input className="input" type="number" placeholder="e.g. 5" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 16 }}>Upload Documents</h3>
            {[
              { label: 'Salary Slips (Last 3 months)', accept: '.pdf,.jpg,.png' },
              { label: 'Bank Statement (Last 6 months)', accept: '.pdf' },
              { label: 'PAN Card', accept: '.jpg,.png,.pdf' },
            ].map(doc => (
              <div key={doc.label} style={{ marginBottom: 12 }}>
                <label className="input-label">{doc.label}</label>
                <div style={{
                  border: '1.5px dashed var(--surface-600)',
                  borderRadius: 10, padding: '14px',
                  display: 'flex', alignItems: 'center', gap: 10,
                  cursor: 'pointer', transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--indigo-500)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--surface-600)')}
                >
                  <span style={{ fontSize: 20 }}>📎</span>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--surface-200)' }}>Click to upload</div>
                    <div style={{ fontSize: 11, color: 'var(--surface-400)' }}>PDF, JPG, PNG (max 5MB)</div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ padding: '10px 14px', background: 'rgba(16,185,129,0.06)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)', marginTop: 4 }}>
              <p style={{ fontSize: 12, color: 'var(--surface-300)' }}>
                ✅ Your documents are encrypted and stored securely on AWS S3. We use AWS Textract to verify authenticity.
              </p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          {step > 1 && <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)} style={{ flex: 1 }}>← Back</button>}
          {step < 3
            ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} style={{ flex: 1 }}>Continue →</button>
            : <button className="btn btn-gold" onClick={onClose} style={{ flex: 1 }}>🚀 Submit Application</button>
          }
        </div>
      </div>
    </div>
  );
};

// ── Main Loans Page ─────────────────────────────────────────
const LoansPage: React.FC = () => {
  const { loans } = useSelector((s: RootState) => s.loan);
  const [applying, setApplying] = useState<LoanType | null>(null);
  const [tab, setTab] = useState<'my' | 'apply'>('my');

  return (
    <div className="page-container" style={{ paddingBottom: 40 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--surface-850)', border: '1px solid var(--surface-700)', borderRadius: 14, padding: 4, marginBottom: 24, width: 'fit-content' }}>
        {(['my', 'apply'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`btn ${tab === t ? 'btn-primary' : ''}`}
            style={{ minWidth: 140, background: tab === t ? undefined : 'transparent', color: tab !== t ? 'var(--surface-300)' : undefined, border: 'none', boxShadow: 'none' }}>
            {t === 'my' ? '📋 My Loans' : '➕ Apply Loan'}
          </button>
        ))}
      </div>

      {tab === 'my' ? (
        <div>
          {loans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--surface-400)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
              <div style={{ fontSize: 16 }}>No active loans</div>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setTab('apply')}>Apply for a Loan</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {loans.map(loan => {
                const paidPercent = getProgressPercent(loan.principalAmount - loan.outstandingAmount, loan.principalAmount);
                const product = LOAN_PRODUCTS.find(p => p.type === loan.type);
                return (
                  <div key={loan.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: `${product?.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                          {getLoanTypeIcon(loan.type)}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'white', fontWeight: 700 }}>{getLoanTypeLabel(loan.type)}</div>
                          <div style={{ fontSize: 12, color: 'var(--surface-400)', fontFamily: 'var(--font-mono)' }}>{loan.loanNumber}</div>
                        </div>
                      </div>
                      <span className="badge badge-success">{loan.status.toUpperCase()}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
                      {[
                        { label: 'Principal', value: formatCurrency(loan.principalAmount) },
                        { label: 'Outstanding', value: formatCurrency(loan.outstandingAmount), highlight: true },
                        { label: 'EMI', value: formatCurrency(loan.emiAmount) },
                        { label: 'Interest Rate', value: `${loan.interestRate}% p.a.` },
                      ].map(row => (
                        <div key={row.label}>
                          <div style={{ fontSize: 11, color: 'var(--surface-400)', marginBottom: 4 }}>{row.label}</div>
                          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono)', color: row.highlight ? 'var(--warning)' : 'white' }}>{row.value}</div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--surface-400)', marginBottom: 6 }}>
                        <span>Repayment Progress</span>
                        <span>{paidPercent}% paid</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${paidPercent}%`, background: `linear-gradient(90deg, ${product?.color}, ${product?.color}aa)` }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--surface-500)', marginTop: 6 }}>
                        <span>Disbursed: {new Date(loan.disbursedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                        <span>Next EMI: {new Date(loan.nextEmiDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--surface-700)' }}>
                      <button className="btn btn-ghost btn-sm">📋 Statement</button>
                      <button className="btn btn-ghost btn-sm">📝 Foreclose</button>
                      <button className="btn btn-ghost btn-sm">↑ Part Payment</button>
                      <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }}>💳 Pay EMI Now</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div>
          <p style={{ fontSize: 14, color: 'var(--surface-300)', marginBottom: 24 }}>
            Choose the loan that suits your needs. Pre-approved offers available based on your credit profile.
          </p>
          <div className="grid-3">
            {LOAN_PRODUCTS.map(p => (
              <div key={p.type} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = p.color; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--surface-700)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: p.color, opacity: 0.7 }} />
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${p.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>
                  {p.icon}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'white', fontWeight: 700, marginBottom: 4 }}>{getLoanTypeLabel(p.type)}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: p.color, fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{p.rate} <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--surface-400)' }}>p.a.</span></div>
                <div style={{ fontSize: 12, color: 'var(--surface-400)', marginBottom: 14 }}>Up to {p.maxAmount} · {p.tenure}</div>
                <div style={{ marginBottom: 16 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ fontSize: 12, color: 'var(--surface-300)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ color: p.color }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <button className="btn w-full btn-sm" onClick={() => setApplying(p.type)}
                  style={{ background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}40` }}>
                  Apply Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {applying && <ApplyModal loanType={applying} onClose={() => setApplying(null)} />}
    </div>
  );
};

export default LoansPage;
