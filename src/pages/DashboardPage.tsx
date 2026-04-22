import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { formatCurrency, getCreditScoreLabel } from '../utils/helpers';
import { mockDashboardMetrics, spendingChartData, categoryColors, categoryLabels, mockBudgets } from '../utils/mockData';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, Title, Tooltip, Legend, ArcElement, Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, ArcElement, Filler);

interface DashboardProps { onNavigate: (page: string) => void; }

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { accounts } = useSelector((s: RootState) => s.account);
  const { transactions } = useSelector((s: RootState) => s.transaction);
  const { emis } = useSelector((s: RootState) => s.emi);
  const [chartView, setChartView] = useState<'bar' | 'line'>('bar');

  const metrics = mockDashboardMetrics;
  const creditLabel = getCreditScoreLabel(metrics.creditScore);
  const recent = transactions.slice(0, 5);

  const chartOptions: any = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'var(--surface-800)',
        titleColor: '#fff',
        bodyColor: 'var(--surface-200)',
        borderColor: 'var(--surface-600)',
        borderWidth: 1,
        callbacks: {
          label: (ctx: any) => `₹${ctx.raw.toLocaleString('en-IN')}`,
        },
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'var(--surface-300)', font: { size: 11 } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'var(--surface-300)', font: { size: 11 }, callback: (v: any) => `₹${(v / 1000).toFixed(0)}k` } },
    },
  };

  const barData = {
    labels: spendingChartData.labels,
    datasets: [
      { label: 'Income', data: spendingChartData.income, backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 6, borderSkipped: false },
      { label: 'Expenses', data: spendingChartData.expenses, backgroundColor: 'rgba(245,158,11,0.5)', borderRadius: 6, borderSkipped: false },
    ],
  };

  const lineData = {
    labels: spendingChartData.labels,
    datasets: [
      {
        label: 'Income', data: spendingChartData.income,
        borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)',
        tension: 0.4, fill: true, pointBackgroundColor: '#6366f1', pointRadius: 4,
      },
      {
        label: 'Expenses', data: spendingChartData.expenses,
        borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.08)',
        tension: 0.4, fill: true, pointBackgroundColor: '#f59e0b', pointRadius: 4,
      },
    ],
  };

  const spendingByCategory = mockBudgets.map(b => ({ ...b, percent: Math.round((b.spentAmount / b.budgetAmount) * 100) }));
  const doughnutData = {
    labels: mockBudgets.map(b => categoryLabels[b.category]),
    datasets: [{
      data: mockBudgets.map(b => b.spentAmount),
      backgroundColor: mockBudgets.map(b => categoryColors[b.category] + 'cc'),
      borderColor: mockBudgets.map(b => categoryColors[b.category]),
      borderWidth: 1.5,
    }],
  };
  const doughnutOptions: any = {
    responsive: true, maintainAspectRatio: false, cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx: any) => ` ₹${ctx.raw.toLocaleString('en-IN')}` } },
    },
  };

  return (
    <div className="page-container" style={{ paddingBottom: 40 }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--indigo-900) 0%, var(--indigo-800) 50%, rgba(245,158,11,0.15) 100%)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 'var(--radius-2xl)',
        padding: '24px 28px',
        marginBottom: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(245,158,11,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, right: 100, width: 120, height: 120, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', pointerEvents: 'none' }} />
        <div>
          <p style={{ fontSize: 13, color: 'var(--indigo-300)', marginBottom: 4 }}>Good Morning,</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'white', marginBottom: 8 }}>
            Welcome back, Vibha! 👋
          </h2>
          <p style={{ fontSize: 13, color: 'var(--surface-300)' }}>
            Here's your financial overview for today
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 12, color: 'var(--surface-300)', marginBottom: 4 }}>Total Portfolio Value</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--gold-400)', textShadow: 'var(--shadow-glow-gold)' }}>
            {formatCurrency(metrics.totalBalance)}
          </p>
          <p style={{ fontSize: 12, color: 'var(--success)', marginTop: 4 }}>↑ ₹12,500 this month</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Monthly Income', value: formatCurrency(metrics.monthlyIncome), icon: '↓', color: '#10b981', bg: 'rgba(16,185,129,0.12)', change: 'Salary + Others' },
          { label: 'Monthly Expenses', value: formatCurrency(metrics.monthlyExpenses), icon: '↑', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', change: `${((metrics.monthlyExpenses / metrics.monthlyIncome) * 100).toFixed(0)}% of income` },
          { label: 'Savings Rate', value: `${metrics.savingsRate}%`, icon: '💹', color: '#6366f1', bg: 'rgba(99,102,241,0.12)', change: 'Above avg 28%' },
          { label: 'Upcoming EMIs', value: formatCurrency(metrics.upcomingEMIs), icon: '📅', color: '#f97316', bg: 'rgba(249,115,22,0.12)', change: 'Due this month' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color, fontSize: 18 }}>{s.value}</div>
            <div className="stat-change" style={{ color: 'var(--surface-400)' }}>{s.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 24 }}>
        {/* Income vs Expense Chart */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">Income vs Expenses</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['bar', 'line'] as const).map(v => (
                <button key={v} onClick={() => setChartView(v)}
                  className={`btn btn-sm ${chartView === v ? 'btn-primary' : 'btn-ghost'}`}>
                  {v === 'bar' ? '📊 Bar' : '📈 Line'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: 220 }}>
            {chartView === 'bar'
              ? <Bar data={barData} options={chartOptions} />
              : <Line data={lineData} options={chartOptions} />}
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
            {[{ label: 'Income', color: '#6366f1' }, { label: 'Expenses', color: '#f59e0b' }].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: l.color, display: 'inline-block' }} />
                <span style={{ fontSize: 12, color: 'var(--surface-300)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Score + Spend Donut */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Credit Score */}
          <div className="card" style={{ flex: 1 }}>
            <div className="section-header" style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Credit Score</span>
              <span className="badge badge-success">CIBIL</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 72, height: 72,
                borderRadius: '50%',
                background: `conic-gradient(${creditLabel.color} ${(metrics.creditScore / 900) * 360}deg, var(--surface-700) 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--surface-850)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700,
                  color: creditLabel.color,
                }}>{metrics.creditScore}</div>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: creditLabel.color }}>{creditLabel.label}</div>
                <div style={{ fontSize: 12, color: 'var(--surface-300)', marginTop: 2 }}>out of 900</div>
                <div style={{ fontSize: 11, color: 'var(--success)', marginTop: 4 }}>↑ +15 this month</div>
              </div>
            </div>
          </div>

          {/* Accounts */}
          <div className="card" style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 10 }}>My Accounts</div>
            {accounts.map(acc => (
              <div key={acc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--surface-700)' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'white', fontWeight: 500 }}>{acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1)}</div>
                  <div style={{ fontSize: 11, color: 'var(--surface-400)', fontFamily: 'var(--font-mono)' }}>••••{acc.accountNumber.slice(-4)}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--gold-400)' }}>
                  ₹{acc.availableBalance.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Spending by Category */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">Spending Breakdown</span>
            <span style={{ fontSize: 12, color: 'var(--surface-400)' }}>January 2024</span>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 140, height: 140, flexShrink: 0 }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
            <div style={{ flex: 1 }}>
              {spendingByCategory.map(b => (
                <div key={b.category} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: 'var(--surface-200)' }}>{categoryLabels[b.category]}</span>
                    <span style={{ fontSize: 11, color: b.percent > 100 ? 'var(--danger)' : 'var(--surface-400)', fontFamily: 'var(--font-mono)' }}>
                      {b.percent}%
                    </span>
                  </div>
                  <div style={{ height: 5, background: 'var(--surface-700)', borderRadius: 99 }}>
                    <div style={{
                      height: '100%', borderRadius: 99,
                      width: `${Math.min(b.percent, 100)}%`,
                      background: b.percent > 100 ? 'var(--danger)' : categoryColors[b.category],
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">Recent Transactions</span>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('transactions')}>View All</button>
          </div>
          <div>
            {recent.map(txn => (
              <div key={txn.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0', borderBottom: '1px solid var(--surface-800)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: txn.type === 'credit' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>
                  {txn.type === 'credit' ? '↓' : '↑'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {txn.description}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--surface-400)' }}>
                    {new Date(txn.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} · {txn.mode}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                  color: txn.type === 'credit' ? 'var(--success)' : 'var(--danger)',
                  flexShrink: 0,
                }}>
                  {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">Quick Actions</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          {[
            { icon: '⇄', label: 'Transfer', page: 'transfer' },
            { icon: '📱', label: 'Pay Bills', page: 'transactions' },
            { icon: '💰', label: 'Apply Loan', page: 'loans' },
            { icon: '📅', label: 'EMI', page: 'emi' },
            { icon: '📊', label: 'Invest', page: 'finance' },
            { icon: '🤖', label: 'AI Advisor', page: 'ai-advisor' },
          ].map(a => (
            <button key={a.label} onClick={() => onNavigate(a.page)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                padding: '16px 8px',
                background: 'var(--surface-800)',
                border: '1px solid var(--surface-700)',
                borderRadius: 14,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--indigo-500)'; (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--surface-700)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface-800)'; }}
            >
              <span style={{ fontSize: 24 }}>{a.icon}</span>
              <span style={{ fontSize: 12, color: 'var(--surface-200)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
