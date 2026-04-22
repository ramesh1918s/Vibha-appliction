import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addGoal } from '../store/slices/otherSlices';
import { FinanceGoal } from '../types';
import { getProgressPercent, getDaysUntil, formatCurrency, generateId } from '../utils/helpers';
import { mockBudgets, categoryLabels, categoryColors } from '../utils/mockData';

const GOAL_ICONS: Record<string, string> = {
  emergency_fund: '🛡', vacation: '✈️', home: '🏠', vehicle: '🚗',
  education: '🎓', retirement: '👴', other: '🎯',
};

const AddGoalModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [monthly, setMonthly] = useState('');
  const [category, setCategory] = useState('other');
  const [targetDate, setTargetDate] = useState('');
  const [autoSave, setAutoSave] = useState(false);

  const colors = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#f97316', '#ef4444'];
  const [color, setColor] = useState(colors[0]);

  const handleSubmit = () => {
    const goal: FinanceGoal = {
      id: generateId(), title, targetAmount: Number(target),
      currentAmount: 0, targetDate, category: category as any,
      monthlyContribution: Number(monthly), isAutoSave: autoSave, color,
    };
    dispatch(addGoal(goal));
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="modal-title">🎯 Create Goal</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--surface-300)', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <div className="input-group">
          <label className="input-label">Goal Name</label>
          <input className="input" placeholder="e.g. Emergency Fund" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Category</label>
          <select className="input" value={category} onChange={e => setCategory(e.target.value)} style={{ cursor: 'pointer' }}>
            <option value="emergency_fund">🛡 Emergency Fund</option>
            <option value="vacation">✈️ Vacation</option>
            <option value="home">🏠 Home</option>
            <option value="vehicle">🚗 Vehicle</option>
            <option value="education">🎓 Education</option>
            <option value="retirement">👴 Retirement</option>
            <option value="other">🎯 Other</option>
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label className="input-label">Target Amount (₹)</label>
            <input className="input" type="number" placeholder="500000" value={target} onChange={e => setTarget(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Target Date</label>
            <input className="input" type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)}
              style={{ colorScheme: 'dark' }} />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">Monthly Contribution (₹)</label>
          <input className="input" type="number" placeholder="10000" value={monthly} onChange={e => setMonthly(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Goal Color</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {colors.map(c => (
              <button key={c} onClick={() => setColor(c)}
                style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: color === c ? `3px solid white` : '2px solid transparent', cursor: 'pointer', flexShrink: 0 }} />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--surface-800)', borderRadius: 10, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>Auto-Save</div>
            <div style={{ fontSize: 11, color: 'var(--surface-400)' }}>Automatically transfer monthly amount</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={autoSave} onChange={() => setAutoSave(!autoSave)} />
            <span className="toggle-track"></span>
            <span className="toggle-thumb"></span>
          </label>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={!title || !target}>
            Create Goal
          </button>
        </div>
      </div>
    </div>
  );
};

const GoalCard: React.FC<{ goal: FinanceGoal }> = ({ goal }) => {
  const progress = getProgressPercent(goal.currentAmount, goal.targetAmount);
  const daysLeft = getDaysUntil(goal.targetDate);
  const remaining = goal.targetAmount - goal.currentAmount;
  const monthsLeft = Math.ceil(daysLeft / 30);
  const onTrack = monthsLeft > 0 && goal.monthlyContribution * monthsLeft >= remaining;

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden', transition: 'transform 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: goal.color }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${goal.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            {GOAL_ICONS[goal.category]}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'white', fontSize: 14 }}>{goal.title}</div>
            <div style={{ fontSize: 11, color: 'var(--surface-400)' }}>
              {daysLeft > 0 ? `${daysLeft} days left` : 'Past deadline'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {goal.isAutoSave && <span className="badge badge-success" style={{ fontSize: 10 }}>⚡ Auto</span>}
          <span className={`badge ${onTrack ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 10 }}>
            {onTrack ? '✓ On Track' : '⚠ At Risk'}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: goal.color }}>
              ₹{goal.currentAmount.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: 13, color: 'var(--surface-400)' }}> / ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'white' }}>{progress}%</div>
        </div>
        <div className="progress-bar" style={{ height: 10 }}>
          <div className="progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${goal.color}, ${goal.color}aa)` }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ padding: '10px', background: 'var(--surface-800)', borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--surface-400)' }}>Still Needed</div>
          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'white', marginTop: 2 }}>
            ₹{remaining.toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{ padding: '10px', background: 'var(--surface-800)', borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--surface-400)' }}>Monthly</div>
          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--gold-400)', marginTop: 2 }}>
            ₹{goal.monthlyContribution.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>✏️ Edit</button>
        <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>+ Add Funds</button>
      </div>
    </div>
  );
};

const FinancePlannerPage: React.FC = () => {
  const { goals } = useSelector((s: RootState) => s.finance);
  const [showAddGoal, setShowAddGoal] = useState(false);

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalMonthly = goals.reduce((s, g) => s + g.monthlyContribution, 0);

  return (
    <div className="page-container" style={{ paddingBottom: 40 }}>
      {/* Summary */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--indigo-400)' }}>🎯</div>
          <div className="stat-label">Total Goals</div>
          <div className="stat-value" style={{ color: 'var(--indigo-400)', fontSize: 18 }}>{goals.length} Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--success)' }}>💰</div>
          <div className="stat-label">Total Saved</div>
          <div className="stat-value" style={{ color: 'var(--success)', fontSize: 18 }}>₹{totalSaved.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: 12, color: 'var(--surface-400)', marginTop: 4 }}>{Math.round((totalSaved / totalTarget) * 100)}% of target</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--warning)' }}>📅</div>
          <div className="stat-label">Monthly Auto-Save</div>
          <div className="stat-value" style={{ color: 'var(--warning)', fontSize: 18 }}>₹{totalMonthly.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Goals Header */}
      <div className="section-header">
        <span className="section-title">My Financial Goals</span>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddGoal(true)}>+ Add Goal</button>
      </div>

      <div className="grid-2" style={{ marginBottom: 32 }}>
        {goals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
      </div>

      {/* Budget Tracker */}
      <div className="section-header">
        <span className="section-title">Budget Tracker — January 2024</span>
        <button className="btn btn-ghost btn-sm">✏️ Edit Budgets</button>
      </div>
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {mockBudgets.map(b => {
            const pct = Math.round((b.spentAmount / b.budgetAmount) * 100);
            const over = pct > 100;
            return (
              <div key={b.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: categoryColors[b.category], display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>{categoryLabels[b.category]}</span>
                  </div>
                  <span style={{ fontSize: 12, color: over ? 'var(--danger)' : 'var(--surface-300)', fontFamily: 'var(--font-mono)' }}>
                    ₹{b.spentAmount.toLocaleString('en-IN')} / ₹{b.budgetAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="progress-bar" style={{ height: 7 }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    width: `${Math.min(pct, 100)}%`,
                    background: over ? 'var(--danger)' : pct > 80 ? 'var(--warning)' : categoryColors[b.category],
                    transition: 'width 0.5s ease',
                  }} />
                </div>
                <div style={{ fontSize: 11, color: over ? 'var(--danger)' : 'var(--surface-500)', marginTop: 3, textAlign: 'right' }}>
                  {over ? `⚠ ₹${(b.spentAmount - b.budgetAmount).toLocaleString('en-IN')} over budget` : `${100 - pct}% remaining`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAddGoal && <AddGoalModal onClose={() => setShowAddGoal(false)} />}
    </div>
  );
};

export default FinancePlannerPage;
