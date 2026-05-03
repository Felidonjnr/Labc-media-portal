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
    const timer = setTimeout(() => setShowWarning(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-navy-dark flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mb-6 animate-bounce shadow-2xl shadow-gold/20">
        <span className="font-display text-white text-3xl pt-1">L</span>
      </div>
      <div className="font-display text-2xl tracking-[0.3em] text-white mb-2 uppercase italic">Initializing Portal</div>
      <div className="text-[10px] font-bold tracking-[0.4em] text-silver uppercase mb-8">Light Assembly Media Command</div>
      
      <div className="flex gap-2 mb-12">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 bg-gold rounded-full"
          />
        ))}
      </div>

      {showWarning && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xs space-y-4"
        >
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-relaxed">
              The connection to the Command Center is taking longer than expected. Please verify your network and credentials.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-[0.2em] transition-all"
          >
            Refresh Connection
          </button>
        </motion.div>
      )}
    </div>
  );
}

function Pending({ logout }) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="premium-card p-10 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gold" />
        <div className="w-20 h-20 bg-ivory rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/10">
          <Clock size={32} className="text-gold" strokeWidth={1.5} />
        </div>
        <h2 className="font-display text-3xl tracking-widest text-navy mb-4">ACCESS PENDING</h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Your account has been mapped to the media team registry. Please wait for the Lead Media Director to confirm your deployment.
        </p>
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full h-11 bg-navy text-white rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-navy-muted transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles size={14} />
            Check Status
          </button>
          <button 
            onClick={logout} 
            className="w-full h-11 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={14} />
            Switch Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ConfigurationError() {
  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center p-6 text-center">
      <div className="premium-card p-10 max-w-md w-full bg-red-500/5 border-red-500/20">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
          <Clock size={32} />
        </div>
        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">Initialization Failure</h2>
        <p className="text-red-400 text-sm leading-relaxed mb-6">
          The LAMP Command Center could not initialize its core data protocols. 
        </p>
        <div className="bg-white/5 rounded-lg p-4 mb-8 text-left">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">Checklist for Admin:</p>
          <ul className="text-[10px] text-slate-300 space-y-2 list-disc pl-4">
            <li>Verify VITE_FIREBASE_API_KEY is set</li>
            <li>Ensure environment variables start with VITE_</li>
            <li>Check network firewall permissions</li>
          </ul>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="w-full h-11 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
        >
          Retry Connection
        </button>
      </div>
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
