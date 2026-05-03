// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChurchProvider } from './contexts/ChurchContext';

import Login from './components/Auth/Login';
import TopNav from './components/Layout/TopNav';
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

function Loading() {
  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '4px', color: '#0A1628' }}>LIGHT ASSEMBLY</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: '8px', height: '8px', background: '#C9960C', borderRadius: '50%', animation: 'pulse 1.2s ease-in-out infinite', animationDelay: `${i*0.2}s` }} />
        ))}
      </div>
    </div>
  );
}

function Pending({ logout }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 8px 40px rgba(10,22,40,0.10)', padding: '2rem', maxWidth: '360px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '3px', color: '#D97706', marginBottom: '0.75rem' }}>PENDING APPROVAL</div>
        <p style={{ fontSize: '0.78rem', color: '#9AA3B2', lineHeight: 1.6, marginBottom: '1.25rem' }}>Your request has been submitted. The admin will approve you shortly.</p>
        <button onClick={logout} style={{ background: 'none', border: '1px solid #E4E8F0', color: '#9AA3B2', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.72rem', cursor: 'pointer' }}>Sign out</button>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user, userProfile, loading, logout, isAdmin } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Login />;
  
  if (!userProfile || userProfile.status === 'new' || userProfile.status === 'pending') {
    return <Pending logout={logout} />;
  }

  if (userProfile.status === 'suspended') {
    return (
      <div style={{ minHeight: '100vh', background: '#F0F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', textAlign: 'center', color: '#DC2626' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚫</div>
          <div>Access suspended. Contact admin.</div>
          <button onClick={logout} style={{ marginTop: '1rem', background: 'none', border: '1px solid #E4E8F0', color: '#9AA3B2', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer' }}>Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <ChurchProvider>
      <div style={{ minHeight: '100vh', background: '#F0F4FF', display: 'flex', flexDirection: 'column' }}>
        <TopNav />
        <div style={{ flex: 1, overflowY: 'auto' }}>
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
      </div>
    </ChurchProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
