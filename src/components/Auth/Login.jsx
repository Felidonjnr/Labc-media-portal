// src/components/Auth/Login.jsx
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { Lock, Mail, ChevronRight, Sparkles } from 'lucide-react';

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
      setError('Invalid email or password. Access denied.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-navy-dark selection:bg-gold selection:text-white">
      {/* Left Panel: Brand & Visual */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-navy-deep border-r border-white/5">
        <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
          <div className="absolute top-0 -left-20 w-96 h-96 bg-gold rounded-full blur-[120px]" />
          <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-900 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
              <span className="font-display text-white text-2xl pt-1">L</span>
            </div>
            <div>
              <div className="font-display text-2xl text-white tracking-[0.2em] leading-none pt-1">LAMP</div>
              <div className="text-[10px] text-silver font-bold tracking-[0.3em] uppercase">Light Assembly Media Portal</div>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="font-display text-6xl text-white tracking-wider leading-[0.9] mb-6">
              CHURCH MEDIA <br />
              <span className="text-gold">COMMAND CENTER</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-light mb-8 italic">
              "Providing the light of the Gospel through clarity, creativity, and consistent content."
            </p>
            
            <div className="flex flex-col gap-4">
              {[
                "Unified Content Generation",
                "Advanced Sermon Repurposing",
                "Automated Workflow Board",
                "Centralized AI Church Brain"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                  <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
            Light Assembly Bible Church &copy; 2026
          </div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-bg relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden text-center mb-10">
            <div className="font-display text-4xl text-navy tracking-[0.2em] mb-1">LAMP</div>
            <div className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Media Command Center</div>
          </div>

          <div className="premium-card p-8 sm:p-10 border-slate-200 shadow-2xl">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-navy tracking-tight mb-2">Team Authentication</h1>
              <p className="text-slate-500 text-sm">Please sign in to access the Media Portal.</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-navy uppercase tracking-widest flex items-center justify-between">
                  Email Address
                  <Mail size={14} className="text-slate-400" />
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all text-sm font-medium"
                  placeholder="pastor@lightassembly.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-navy uppercase tracking-widest flex items-center justify-between">
                  Security Password
                  <Lock size={14} className="text-slate-400" />
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  {error}
                </motion.div>
              )}

              <button 
                onClick={handleLogin}
                disabled={loading || !email || !password}
                className="w-full h-12 bg-navy text-white rounded-xl shadow-lg shadow-navy/20 font-bold transition-all hover:bg-navy-muted active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>INITIALIZE COMMAND</span>
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ivory rounded-full border border-gold/10 text-[10px] text-gold font-bold tracking-[0.1em] uppercase">
                <Sparkles size={12} />
                Authorized Personnel Only
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-slate-400 text-xs font-medium">
            Forgot credentials? Contact Site Admin.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
