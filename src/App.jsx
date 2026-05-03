import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChurchProvider } from './contexts/ChurchContext';

import DashboardShell from './components/Layout/DashboardShell';
import ErrorBoundary from './components/Common/ErrorBoundary';
import Login from './components/Auth/Login';
import Home from './pages/Home';
import ContentStudio from './pages/ContentStudio';
import SermonEngine from './pages/SermonEngine';
import FollowUpCentre from './pages/FollowUpCentre';
import MediaStudio from './pages/MediaStudio';
import ContentCalendar from './pages/ContentCalendar';
import ContentQueue from './pages/ContentQueue';
import ContentHistory from './pages/ContentHistory';
import KnowledgeDump from './pages/KnowledgeDump';
import ChurchKnowledge from './pages/ChurchKnowledge';
import TeamAccess from './pages/TeamAccess';

import { motion } from 'motion/react';
import { Clock, LogOut, Sparkles } from 'lucide-react';

function Loading() {
  const [showWarning, setShowWarning] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowWarning(true), 12000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/20 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10"
      >
        <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl relative group overflow-hidden">
          <div className="absolute inset-0 bg-gold/10 animate-pulse" />
          <span className="font-display text-gold text-5xl pt-2 relative z-10 italic font-bold">L</span>
        </div>
        
        <div className="space-y-4">
          <h2 className="font-display text-4xl tracking-tighter text-white uppercase italic font-bold">Initializing Portal</h2>
          <div className="flex items-center justify-center gap-4">
             <div className="h-[1px] w-8 bg-gold/30" />
             <p className="text-[10px] font-black tracking-[0.5em] text-gold uppercase italic">Command Center</p>
             <div className="h-[1px] w-8 bg-gold/30" />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-6">
          <div className="flex gap-3">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1], 
                  opacity: [0.2, 1, 0.2],
                  backgroundColor: ['#D4AF37', '#FFFFFF', '#D4AF37']
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                className="w-2.5 h-2.5 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]"
              />
            ))}
          </div>
          <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] font-mono">Syncing Neural Pathways...</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showWarning && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-12 max-w-sm w-full px-6 space-y-6 z-20"
          >
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-md shadow-2xl">
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-relaxed italic">
                LATENCY DETECTED: The connection to the Command Center is taking longer than expected. Please verify your network and credentials.
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="group h-12 px-10 bg-white/5 hover:bg-gold text-white hover:text-navy border border-white/10 hover:border-gold rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 mx-auto shadow-xl"
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
              Reset Link
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Pending({ logout }) {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
         <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-gold/20 rounded-full blur-[150px]" />
         <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-gold/10 rounded-full blur-[150px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="premium-card p-12 max-w-lg w-full text-center bg-white border-none shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold via-navy to-gold" />
        
        <div className="w-24 h-24 bg-offwhite rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-slate-100 shadow-inner group relative">
          <div className="absolute inset-0 bg-gold/5 rounded-[2rem] animate-pulse" />
          <Clock size={40} className="text-gold relative z-10" strokeWidth={1} />
        </div>

        <h2 className="font-display text-4xl font-bold tracking-tighter text-navy mb-4 uppercase italic">Access Pending</h2>
        
        <div className="flex items-center justify-center gap-2 mb-8">
           <div className="h-[1px] w-6 bg-slate-200" />
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Awaiting Command Approval</p>
           <div className="h-[1px] w-6 bg-slate-200" />
        </div>

        <p className="text-slate-400 text-[13px] font-bold leading-relaxed mb-12 uppercase tracking-tight max-w-sm mx-auto">
          Your account has been mapped to the media team registry. Please wait for the Lead Media Director to verify your identity and deployment level.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-3 h-14 bg-navy text-white rounded-2xl font-bold text-[11px] tracking-[0.2em] uppercase hover:bg-gold hover:text-navy transition-all shadow-xl shadow-navy/20 active:scale-95"
          >
            <Sparkles size={16} className="text-gold" />
            Check Status
          </button>
          <button 
            onClick={logout} 
            className="flex items-center justify-center gap-3 h-14 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-bold text-[11px] tracking-[0.2em] uppercase hover:border-navy hover:text-navy transition-all active:scale-95"
          >
            <LogOut size={16} />
            Switch Link
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-50">
           <div className="flex items-center justify-center gap-6 opacity-30 grayscale underline underline-offset-4 decoration-slate-200">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Light Assembly</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Media Portal v4.0</div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}

function ConfigurationError() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-8 relative overflow-hidden">
      {/* Red Background Warning Glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] bg-red-600/30 rounded-full blur-[150px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-12 max-w-lg w-full bg-white border-none shadow-[0_50px_100px_-20px_rgba(15,23,42,0.5)] text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-red-600 animate-pulse" />
        
        <div className="w-24 h-24 bg-red-50 border border-red-100 rounded-[2rem] flex items-center justify-center mx-auto mb-10 text-red-600 shadow-inner">
          <AlertCircle size={40} strokeWidth={1} />
        </div>

        <h2 className="font-display text-4xl font-bold tracking-tighter text-navy mb-4 uppercase italic">Initialization Failure</h2>
        
        <div className="flex items-center justify-center gap-2 mb-8">
           <div className="h-[1px] w-6 bg-red-100" />
           <p className="text-[10px] font-black text-red-300 uppercase tracking-[0.4em]">Protocol Critical Error</p>
           <div className="h-[1px] w-6 bg-red-100" />
        </div>

        <p className="text-slate-400 text-[13px] font-bold leading-relaxed mb-10 uppercase tracking-tight italic">
          The LAMP Command Center could not initialize its core data protocols. This usually indicates a misalignment in the environment configuration.
        </p>

        <div className="bg-red-50/50 rounded-2xl p-8 mb-12 text-left border border-red-100">
          <p className="text-[11px] font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2 italic">
            <Target size={14} />
            Diagnostic Checklist:
          </p>
          <ul className="text-[11px] text-red-500 font-bold space-y-3 uppercase tracking-tighter">
            <li className="flex items-start gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
               Verify VITE_FIREBASE_API_KEY is present
            </li>
            <li className="flex items-start gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
               Ensure variables use the "VITE_" prefix
            </li>
            <li className="flex items-start gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
               Validate network firewall permissions
            </li>
          </ul>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="h-16 w-full bg-red-600 hover:bg-navy text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] italic transition-all shadow-2xl shadow-red-200 active:scale-95 flex items-center justify-center gap-4 group"
        >
          <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-1000" />
          Re-Initialize Connection
        </button>
      </motion.div>
    </div>
  );
}

function AppRoutes() {
  const { user, userProfile, loading, isConfigured, logout } = useAuth();

  if (loading) return <Loading />;
  if (!isConfigured) return <ConfigurationError />;
  if (!user) return <Login />;
  
  if (!userProfile || userProfile.status === 'new' || userProfile.status === 'pending') {
    return <Pending logout={logout} />;
  }

  if (userProfile.status === 'suspended') {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
        <div className="premium-card p-10 max-w-sm w-full text-center border-red-100 shadow-xl">
          <div className="text-4xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">ACCESS SUSPENDED</h2>
          <p className="text-red-600/70 text-sm mb-6">Your credentials have been revoked by the security protocol.</p>
          <button onClick={logout} className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-xs tracking-widest uppercase shadow-lg shadow-red-200">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <ChurchProvider>
      <DashboardShell>
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/studio" element={<ContentStudio />} />
            <Route path="/sermon" element={<SermonEngine />} />
            <Route path="/followup" element={<FollowUpCentre />} />
            <Route path="/media" element={<MediaStudio />} />
            <Route path="/calendar" element={<ContentCalendar />} />
            <Route path="/queue" element={<ContentQueue />} />
            <Route path="/history" element={<ContentHistory />} />
            <Route path="/knowledge" element={<KnowledgeDump />} />
            <Route path="/church" element={<ChurchKnowledge />} />
            <Route path="/team" element={<TeamAccess />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </DashboardShell>
    </ChurchProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
