// src/components/Auth/Login.js
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const { loginWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError('');
    try {
      await loginWithEmail(email.trim(), password);
    } catch {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.headerBand}>
          <div style={s.cross}>✝</div>
          <div style={s.appName}>LIGHT ASSEMBLY</div>
          <div style={s.appTitle}>MEDIA PORTAL</div>
          <div style={s.appSub}>Media Director Command Center</div>
        </div>
        <div style={s.form}>
          <p style={s.desc}>Private access — authorized team only</p>
          <div style={s.fieldGroup}>
            <label style={s.label}>EMAIL</label>
            <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>PASSWORD</label>
            <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <div style={s.error}>{error}</div>}
          <button style={{ ...s.btn, opacity: loading || !email || !password ? 0.6 : 1 }} onClick={handleLogin} disabled={loading || !email || !password}>
            {loading ? 'Signing in...' : 'SIGN IN'}
          </button>
        </div>
        <p style={s.footer}>Light Assembly Bible Church · Uyo, Akwa Ibom, Nigeria</p>
      </div>
    </div>
  );
}

const s = {
  wrap: { minHeight: '100vh', background: 'linear-gradient(135deg, #EEF1F8 0%, #F0F4FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  card: { background: 'white', borderRadius: '20px', boxShadow: '0 8px 40px rgba(10,22,40,0.12)', maxWidth: '380px', width: '100%', overflow: 'hidden' },
  headerBand: { background: '#0A1628', padding: '2rem 2rem 1.5rem', textAlign: 'center' },
  cross: { fontSize: '2rem', color: '#C9960C', marginBottom: '0.5rem' },
  appName: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '4px', color: '#C9960C', lineHeight: 1 },
  appTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.4rem', letterSpacing: '5px', color: 'white', lineHeight: 1.1 },
  appSub: { fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', marginTop: '6px', textTransform: 'uppercase' },
  form: { padding: '1.75rem 1.75rem 1rem' },
  desc: { fontSize: '0.75rem', color: '#9AA3B2', marginBottom: '1.25rem', textAlign: 'center' },
  fieldGroup: { marginBottom: '0.9rem' },
  label: { display: 'block', fontSize: '0.62rem', fontWeight: '700', color: '#0A1628', letterSpacing: '1.5px', marginBottom: '5px' },
  input: { width: '100%', border: '1.5px solid #E4E8F0', borderRadius: '8px', padding: '0.7rem 0.9rem', fontSize: '0.85rem' },
  error: { background: '#FEF2F2', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '8px', color: '#DC2626', fontSize: '0.72rem', padding: '0.6rem 0.75rem', marginBottom: '0.75rem' },
  btn: { width: '100%', background: '#0A1628', color: 'white', border: 'none', borderRadius: '10px', padding: '0.8rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: '3px', cursor: 'pointer' },
  footer: { textAlign: 'center', fontSize: '0.62rem', color: '#9AA3B2', padding: '0.75rem 1rem 1.25rem' }
};
