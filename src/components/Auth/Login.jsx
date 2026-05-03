// src/components/Auth/Login.jsx
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { Lock, Mail, ChevronRight, ShieldCheck } from 'lucide-react';

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
    } catch (err) {
      setError('Invalid email or password. Access denied.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-ivory selection:bg-gold selection:text-white">
      {/* Visual Panel */}
      <div className="hidden lg:flex lg:col-span-4 bg-navy flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 -left-20 w-[600px] h-[600px] bg-gold rounded-full blur-[160px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 bg-gold rounded-[1.2rem] flex items-center justify-center shadow-xl shadow-gold/30 transform rotate-3">
              <span className="font-display font-bold text-white text-3xl pt-1">L</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl text-white tracking-tighter leading-none">LAMP</span>
              <span className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase mt-1">Command Suite</span>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="font-display text-5xl font-bold text-white tracking-tight leading-[1.1]">
              Equipping the <br /> 
              <span className="text-gold italic">Global Church</span> <br />
              with Media Light.
            </h2>
            <div className="w-12 h-1 bg-gold/30 rounded-full" />
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              A professional-grade command center for Light Assembly Bible Church.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            <ShieldCheck size={20} className="text-gold" />
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] max-w-[140px]">
            Encrypted Team Terminal v2.4
          </p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="col-span-12 lg:col-span-8 flex items-center justify-center p-6 lg:p-24 relative bg-offwhite">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden text-center mb-12">
            <div className="w-16 h-16 bg-navy rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <span className="font-display font-bold text-white text-4xl pt-2">L</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-navy tracking-tighter mb-2">LAMP</h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase">Media Command Center</p>
          </div>

          <div className="premium-card p-8 lg:p-12 border-slate-200/60 shadow-2xl shadow-navy/5">
            <div className="mb-10">
              <h1 className="text-3xl font-display font-bold text-navy tracking-tight mb-3">Welcome Back</h1>
              <p className="text-slate-500 text-sm font-medium">Please authenticate to access the command suite.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-navy uppercase tracking-widest flex items-center justify-between">
                  Identity Protocol
                  <Mail size={14} className="text-slate-300" />
                </label>
                <div className="relative group">
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-navy/5 focus:border-navy outline-none transition-all text-sm font-bold text-navy placeholder:text-slate-300 placeholder:font-normal"
                    placeholder="name@lightassembly.com"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-navy uppercase tracking-widest flex items-center justify-between">
                  Security Passcode
                  <Lock size={14} className="text-slate-300" />
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-navy/5 focus:border-navy outline-none transition-all text-sm font-bold text-navy placeholder:text-slate-300 placeholder:font-normal"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  {error}
                </motion.div>
              )}

              <button 
                onClick={handleLogin}
                disabled={loading || !email || !password}
                className="btn-primary w-full h-14 text-xs tracking-[0.2em] font-bold shadow-xl shadow-navy/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>AUTHENTICATE PORTAL</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-50 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
                Protected by the secure cloud framework of <br /> Light Assembly Bible Church.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center space-y-4">
            <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-navy transition-colors">
              Access Request
            </button>
            <div className="text-[9px] text-slate-300 uppercase tracking-[0.3em]">
              L.A.M.P &copy; 2026 Registry Systems
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

