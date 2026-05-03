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
          sticky top-0 z-40 h-20 transition-all duration-300 px-6 lg:px-10 flex items-center justify-between
          ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'bg-transparent'}
        `}>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-navy hover:bg-slate-100 rounded-xl lg:hidden"
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden sm:block">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
                <span className="text-navy/40">LAMP Command</span>
                <ChevronRight size={10} className="text-gold" />
                <span className="text-navy">{getBreadcrumb()}</span>
              </div>
              <h1 className="text-2xl font-display font-bold text-navy tracking-tight">{getPageTitle()}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center bg-white border border-slate-100 rounded-xl px-4 h-11 w-64 shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search commands..." 
                className="bg-transparent border-none focus:ring-0 text-sm ml-3 w-full"
              />
            </div>

            <button className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-navy hover:bg-white border-transparent hover:border-slate-200 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-gold rounded-full border-2 border-white ring-2 ring-gold/20 animate-pulse"></span>
            </button>

            <div className="h-6 w-[1.5px] bg-slate-200 mx-1"></div>

            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="flex flex-col items-end hidden md:flex">
                <span className="text-xs font-bold text-navy leading-none mb-1">{userProfile?.fullName || 'User'}</span>
                <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{userProfile?.role || 'Team Member'}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
                {userProfile?.fullName?.charAt(0) || <User size={18} />}
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

