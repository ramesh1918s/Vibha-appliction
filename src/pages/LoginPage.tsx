import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { mockLogin } from '../store/slices/authSlice';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (!phone) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); }, 1000);
  };

  const handleVerifyOTP = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); dispatch(mockLogin()); }, 1200);
  };

  const handleOTPInput = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--surface-950)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute', top: -200, left: -200,
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -200, right: -200,
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg, var(--indigo-600), var(--indigo-400))',
            borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 800, color: 'white',
            margin: '0 auto 14px',
            boxShadow: 'var(--shadow-glow-indigo), 0 8px 32px rgba(0,0,0,0.4)',
          }}>VB</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'white', marginBottom: 4 }}>
            VIBHA BANKING
          </h1>
          <p style={{ fontSize: 13, color: 'var(--gold-400)', letterSpacing: '0.1em' }}>
            YOUR TRUSTED FINANCIAL PARTNER
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--surface-850)',
          border: '1px solid var(--surface-700)',
          borderRadius: 'var(--radius-2xl)',
          padding: 32,
          boxShadow: 'var(--shadow-elevated)',
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex', background: 'var(--surface-800)',
            borderRadius: 12, padding: 4, marginBottom: 28, gap: 4,
          }}>
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setStep('credentials'); }}
                style={{
                  flex: 1, padding: '9px 0',
                  background: tab === t ? 'linear-gradient(135deg, var(--indigo-600), var(--indigo-500))' : 'transparent',
                  border: 'none', borderRadius: 9,
                  color: tab === t ? 'white' : 'var(--surface-300)',
                  fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14,
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: tab === t ? '0 2px 10px rgba(99,102,241,0.3)' : 'none',
                }}>
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {step === 'credentials' ? (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              {tab === 'register' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div>
                    <label className="input-label">First Name</label>
                    <input className="input" placeholder="Vibha" />
                  </div>
                  <div>
                    <label className="input-label">Last Name</label>
                    <input className="input" placeholder="Sharma" />
                  </div>
                </div>
              )}
              {tab === 'register' && (
                <div style={{ marginBottom: 16 }}>
                  <label className="input-label">Email Address</label>
                  <input className="input" type="email" placeholder="vibha@email.com" />
                </div>
              )}
              <div style={{ marginBottom: 16 }}>
                <label className="input-label">Mobile Number</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{
                    padding: '11px 14px', background: 'var(--surface-800)',
                    border: '1px solid var(--surface-600)', borderRadius: 'var(--radius-md)',
                    color: 'var(--surface-200)', fontSize: 14, whiteSpace: 'nowrap',
                  }}>🇮🇳 +91</div>
                  <input className="input" placeholder="98765 43210" value={phone}
                    onChange={e => setPhone(e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label className="input-label">Password</label>
                <input className="input" type="password" placeholder="••••••••" value={password}
                  onChange={e => setPassword(e.target.value)} />
              </div>
              {tab === 'login' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -18, marginBottom: 20 }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--indigo-400)', fontSize: 13, cursor: 'pointer' }}>
                    Forgot Password?
                  </button>
                </div>
              )}
              <button className="btn btn-primary w-full btn-lg" onClick={handleSendOTP} disabled={loading}
                style={{ marginBottom: 14 }}>
                {loading ? '⏳ Please wait...' : tab === 'login' ? 'Send OTP & Login' : 'Create Account'}
              </button>
              <button className="btn btn-ghost w-full" onClick={() => dispatch(mockLogin())}
                style={{ fontSize: 13 }}>
                🚀 Demo Login (Skip Auth)
              </button>
            </div>
          ) : (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📱</div>
                <p style={{ fontSize: 14, color: 'var(--surface-200)' }}>
                  OTP sent to <strong style={{ color: 'white' }}>+91 {phone}</strong>
                </p>
                <p style={{ fontSize: 12, color: 'var(--surface-400)', marginTop: 4 }}>
                  Enter the 6-digit code
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
                {otp.map((digit, i) => (
                  <input key={i} id={`otp-${i}`} value={digit}
                    onChange={e => handleOTPInput(e.target.value, i)}
                    maxLength={1}
                    style={{
                      width: 48, height: 52,
                      background: 'var(--surface-800)',
                      border: `1.5px solid ${digit ? 'var(--indigo-500)' : 'var(--surface-600)'}`,
                      borderRadius: 10, color: 'white',
                      fontSize: 20, fontWeight: 700,
                      textAlign: 'center', outline: 'none',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                ))}
              </div>
              <button className="btn btn-primary w-full btn-lg" onClick={handleVerifyOTP} disabled={loading}
                style={{ marginBottom: 14 }}>
                {loading ? '✅ Verifying...' : 'Verify & Login'}
              </button>
              <button className="btn btn-ghost w-full" onClick={() => setStep('credentials')} style={{ fontSize: 13 }}>
                ← Change Number
              </button>
            </div>
          )}

          {/* Security Note */}
          <div style={{
            marginTop: 20, padding: '10px 14px',
            background: 'rgba(99, 102, 241, 0.05)',
            borderRadius: 10, border: '1px solid rgba(99,102,241,0.15)',
          }}>
            <p style={{ fontSize: 11, color: 'var(--surface-400)', textAlign: 'center', lineHeight: 1.5 }}>
              🔒 256-bit SSL encrypted · PCI-DSS compliant · RBI regulated
            </p>
          </div>
        </div>

        {/* KYC CTA */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ fontSize: 12, color: 'var(--surface-400)' }}>
            New customer? <button style={{ background: 'none', border: 'none', color: 'var(--indigo-400)', cursor: 'pointer', fontSize: 12 }}>
              Complete KYC to open account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
