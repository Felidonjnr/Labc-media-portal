import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Menu, Search, Bell, Plus, ChevronRight, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { userProfile, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/': 'Command Center',
      '/studio': 'Content Studio',
      '/sermon': 'Sermon Engine',
      '/followup': 'Follow-Up Centre',
      '/media': 'Media Studio',
      '/calendar': 'Weekly Rhythm',
      '/queue': 'Content Queue',
      '/history': 'Archive',
      '/knowledge': 'Knowledge Depot',
      '/church': 'AI Brain',
      '/team': 'Team Nexus',
    };
    return titles[path] || 'Portal';
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return 'Overview';
    if (['/studio', '/sermon', '/queue'].includes(path)) return 'Production';
    if (['/calendar', '/followup', '/media', '/history'].includes(path)) return 'Operations';
    return 'Intelligence';
  };

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0">
        <Sidebar />
      </div>
      
      {/* Main content wrapper */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen relative">
        {/* Topbar */}
        <header className={`
          sticky top-0 z-40 h-24 transition-all duration-500 px-6 lg:px-12 flex items-center justify-between
          ${scrolled ? 'bg-white/70 backdrop-blur-2xl border-b border-slate-100 shadow-2xl shadow-navy/5' : 'bg-transparent'}
        `}>
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-3 text-navy bg-white shadow-lg rounded-2xl lg:hidden active:scale-95 transition-transform"
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden sm:block">
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-1.5 italic">
                <span className="text-gold">Neural Node</span>
                <div className="w-1 h-1 rounded-full bg-slate-200" />
                <span className="text-navy/30">{getBreadcrumb()}</span>
              </div>
              <h1 className="text-3xl font-display font-bold text-navy tracking-tighter uppercase italic leading-none">{getPageTitle()}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:flex items-center bg-white border border-slate-100 rounded-2xl px-6 h-14 w-80 shadow-inner group focus-within:border-navy/20 transition-all">
              <Search size={18} className="text-slate-200 group-focus-within:text-gold transition-colors" />
              <input 
                type="text" 
                placeholder="EXECUTE SCAN..." 
                className="bg-transparent border-none focus:ring-0 text-[11px] font-black tracking-widest ml-4 w-full placeholder:text-slate-200 uppercase italic"
              />
            </div>

            <button className="w-14 h-14 flex items-center justify-center text-slate-300 hover:text-gold hover:bg-white border-transparent hover:border-slate-100 rounded-2xl transition-all relative group shadow-sm">
              <Bell size={22} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-gold rounded-full border-2 border-white shadow-[0_0_10px_rgba(212,175,55,0.5)] animate-pulse"></span>
            </button>

            <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block"></div>

            <div className="flex items-center gap-4 pl-2 group cursor-pointer">
              <div className="flex flex-col items-end hidden md:flex">
                <span className="text-[12px] font-black text-navy leading-none mb-1 uppercase italic tracking-tight">{userProfile?.fullName || 'Operative'}</span>
                <span className="text-[9px] font-black text-gold uppercase tracking-[0.2em] italic opacity-60">{userProfile?.role || 'Unit 01'}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-navy text-white flex items-center justify-center font-bold shadow-2xl group-hover:scale-105 group-hover:shadow-navy/40 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 font-display italic text-lg">{userProfile?.fullName?.charAt(0) || <User size={20} />}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-[280px]"
            >
              <Sidebar />
              <button 
                onClick={() => setSidebarOpen(false)}
                className="absolute top-6 -right-12 p-2 bg-white rounded-full text-navy shadow-xl"
              >
                <Menu size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

