import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addMessage, setTyping } from '../store/slices/otherSlices';
import { ChatMessage } from '../types';
import { generateId } from '../utils/helpers';

const QUICK_PROMPTS = [
  'Analyse my spending this month',
  'Should I prepay my home loan?',
  'How to improve my credit score?',
  'Best SIP options for ₹10,000/month',
  'Am I saving enough for retirement?',
  'Compare NEFT vs IMPS vs RTGS',
];

const AI_RESPONSES: Record<string, string> = {
  spending: `Based on your January 2024 transactions, here's your spending analysis:

📊 **Total Spent**: ₹52,239 (61.5% of income)

**Top Categories:**
• Shopping: ₹18,500 — ₹3,500 over budget ⚠️
• Food & Dining: ₹6,200 — within budget ✓
• Utilities: ₹3,800 — within budget ✓
• Entertainment: ₹2,100 — within budget ✓

**💡 Key Insights:**
1. Shopping spend exceeded your ₹15,000 budget by 23%. Consider setting stricter limits on Amazon/online shopping.
2. Your EMIs (₹67,750/month) represent 79.7% of income — this is above the recommended 40-50%.
3. Great job on utilities — you've kept bills under control!

**🎯 Recommendation:** Reduce discretionary shopping by ₹4,000/month and redirect to your Emergency Fund goal. You'll reach your ₹5L target 2 months earlier.`,

  loan: `**Should you prepay your Home Loan?** Here's a detailed analysis:

📋 **Your Loan Details:**
• Outstanding: ₹38,50,000 @ 8.5% p.a.
• Remaining Tenure: 218 months
• Monthly EMI: ₹42,500

**💰 Prepayment Analysis:**
If you prepay ₹5,00,000 today:
• Interest saved: ₹12,40,000
• Tenure reduction: ~24 months
• Break-even: ~8 months

**✅ Recommendation: YES, prepay if you can**

However, first ensure:
1. Emergency fund ≥ 6 months expenses (₹3.1L) — You have ₹3.2L ✓
2. No high-interest debt pending ✓
3. Losing tax benefit (Sec 80C/24B) — Factor in ~₹36,000 annual tax savings

**📌 Better Strategy:** Make annual lump-sum payments of ₹1-2L instead of monthly prepayment for maximum interest savings.`,

  credit: `**How to Improve Your Credit Score — Action Plan**

📈 **Current Score: 782 (Excellent)**
Your score is already strong! Here's how to reach 800+:

**✅ What you're doing right:**
• On-time EMI payments (auto-pay enabled)
• Low credit utilization (<30%)
• Long credit history (2+ years)

**🎯 Steps to reach 800+:**
1. **Keep credit utilization below 20%** — Currently moderate
2. **Don't close old credit cards** — Length of history matters
3. **Avoid multiple loan applications** — Each hard inquiry drops score 5-10 points
4. **Add a credit card** if you don't have one — Diversity helps
5. **Check CIBIL report** annually for errors — 1 in 5 reports has errors

**⏱ Expected timeline:** 3-6 months of consistent behavior should push you to 800+.`,

  default: `I'm your AI Financial Advisor powered by Claude. I've analyzed your account data and I'm ready to help!

Here's what I can assist you with:
• 💰 Spending analysis & budget optimization
• 🏠 Loan & EMI guidance
• 📈 Investment recommendations
• 🎯 Goal planning & tracking
• 💳 Credit score improvement
• 📊 Tax saving strategies

What would you like to explore today?`,
};

const getAIResponse = (message: string): string => {
  const lower = message.toLowerCase();
  if (lower.includes('spend') || lower.includes('budget') || lower.includes('analys')) return AI_RESPONSES.spending;
  if (lower.includes('loan') || lower.includes('prepay') || lower.includes('home')) return AI_RESPONSES.loan;
  if (lower.includes('credit') || lower.includes('score') || lower.includes('cibil')) return AI_RESPONSES.credit;
  return AI_RESPONSES.default;
};

const MessageBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 16, gap: 10 }}>
      {!isUser && (
        <div style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--indigo-700), var(--indigo-500))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          boxShadow: 'var(--shadow-glow-indigo)',
        }}>🤖</div>
      )}
      <div style={{ maxWidth: '75%' }}>
        <div style={{
          padding: '12px 16px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: isUser
            ? 'linear-gradient(135deg, var(--indigo-600), var(--indigo-500))'
            : 'var(--surface-800)',
          border: isUser ? 'none' : '1px solid var(--surface-600)',
          fontSize: 14, color: 'white', lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          boxShadow: isUser ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
        }}>
          {msg.content}
        </div>
        <div style={{ fontSize: 11, color: 'var(--surface-500)', marginTop: 4, textAlign: isUser ? 'right' : 'left' }}>
          {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
        {msg.suggestions && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {msg.suggestions.map(s => (
              <button key={s} style={{
                padding: '5px 12px', borderRadius: 20,
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.3)',
                color: 'var(--indigo-300)', fontSize: 12,
                cursor: 'pointer', transition: 'all 0.2s',
                fontFamily: 'var(--font-body)',
              }}
                onMouseEnter={e => { (e.currentTarget.style.background = 'rgba(99,102,241,0.25)'; (e.currentTarget.style.color = 'white'); }}
                onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; (e.currentTarget.style.color = 'var(--indigo-300)'); }}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      {isUser && (
        <div style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--indigo-700), var(--gold-500))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: 'white',
        }}>VS</div>
      )}
    </div>
  );
};

const TypingIndicator: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, var(--indigo-700), var(--indigo-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
    <div style={{ padding: '12px 16px', background: 'var(--surface-800)', border: '1px solid var(--surface-600)', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 5, alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%', background: 'var(--indigo-400)',
          animation: 'pulse 1.2s ease infinite', animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  </div>
);

const AIAdvisorPage: React.FC = () => {
  const dispatch = useDispatch();
  const { messages, isTyping } = useSelector((s: RootState) => s.ai);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content) return;
    setInput('');

    const userMsg: ChatMessage = { id: generateId(), role: 'user', content, timestamp: new Date().toISOString() };
    dispatch(addMessage(userMsg));
    dispatch(setTyping(true));

    setTimeout(() => {
      dispatch(setTyping(false));
      const aiMsg: ChatMessage = {
        id: generateId(), role: 'assistant',
        content: getAIResponse(content),
        timestamp: new Date().toISOString(),
      };
      dispatch(addMessage(aiMsg));
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 65px)' }}>
      {/* Header */}
      <div style={{
        padding: '16px 28px',
        background: 'var(--surface-900)',
        borderBottom: '1px solid var(--surface-700)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--indigo-700), var(--indigo-500))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, boxShadow: 'var(--shadow-glow-indigo)',
        }}>🤖</div>
        <div>
          <div style={{ fontWeight: 700, color: 'white', fontSize: 15 }}>Vibha AI Financial Advisor</div>
          <div style={{ fontSize: 12, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, background: 'var(--success)', borderRadius: '50%', display: 'inline-block' }}></span>
            Powered by Claude · Analyzing your financial data
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <span className="badge badge-info" style={{ fontSize: 11 }}>🔒 Private</span>
          <span className="badge badge-neutral" style={{ fontSize: 11 }}>AWS Bedrock</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
        {/* Quick Prompts (only at start) */}
        {messages.length === 1 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--surface-400)', marginBottom: 8, textAlign: 'center' }}>Quick Suggestions</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {QUICK_PROMPTS.map(p => (
                <button key={p} onClick={() => sendMessage(p)}
                  style={{
                    padding: '7px 14px', borderRadius: 20,
                    background: 'var(--surface-800)',
                    border: '1px solid var(--surface-600)',
                    color: 'var(--surface-200)', fontSize: 13,
                    cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={e => { (e.currentTarget.style.borderColor = 'var(--indigo-500)'; (e.currentTarget.style.background = 'rgba(99,102,241,0.1)')); }}
                  onMouseLeave={e => { (e.currentTarget.style.borderColor = 'var(--surface-600)'; (e.currentTarget.style.background = 'var(--surface-800)')); }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px 28px',
        background: 'var(--surface-900)',
        borderTop: '1px solid var(--surface-700)',
        display: 'flex', gap: 10, alignItems: 'flex-end',
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask about your finances, investments, loans... (Enter to send)"
            rows={1}
            style={{
              width: '100%',
              background: 'var(--surface-800)',
              border: '1px solid var(--surface-600)',
              borderRadius: 14, color: 'white',
              fontFamily: 'var(--font-body)', fontSize: 14,
              padding: '12px 48px 12px 16px',
              outline: 'none', resize: 'none',
              maxHeight: 120, overflowY: 'auto',
              lineHeight: 1.5,
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--indigo-500)')}
            onBlur={e => (e.target.style.borderColor = 'var(--surface-600)')}
          />
        </div>
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || isTyping}
          className="btn btn-primary"
          style={{ height: 46, width: 46, padding: 0, borderRadius: 12, fontSize: 18, flexShrink: 0 }}>
          ↑
        </button>
      </div>
    </div>
  );
};

export default AIAdvisorPage;
