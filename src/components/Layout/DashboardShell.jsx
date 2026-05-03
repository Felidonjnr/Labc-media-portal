import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, Search, Bell, Plus, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

export default function DashboardShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { userProfile } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    switch(path) {
      case '/': return 'Dashboard';
      case '/studio': return 'Content Studio';
      case '/sermon': return 'Sermon Engine';
      case '/followup': return 'Follow-Up Centre';
      case '/media': return 'Media Studio';
      case '/calendar': return 'Content Calendar';
      case '/queue': return 'Content Queue';
      case '/history': return 'Content History';
      case '/knowledge': return 'Knowledge Dump';
      case '/church': return 'Church Knowledge';
      case '/team': return 'Team Access';
      default: return 'Portal';
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className={`transition-all duration-300 ${sidebarOpen ? 'pl-64' : 'pl-20'}`}>
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex flex-col">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                <span>Media Command</span>
                <ChevronRight size={10} />
                <span className="text-gold">{getPageTitle()}</span>
              </div>
              <h1 className="text-xl font-bold text-navy tracking-tight mt-0.5">{getPageTitle()}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-xl transition-all relative">
              <Search size={19} />
            </button>
            <button className="p-2.5 text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-xl transition-all relative">
              <Bell size={19} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-gold rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            
            <button className="btn-gold hidden sm:flex items-center gap-2 command-btn active:scale-95 shadow-lg shadow-gold/20">
              <Plus size={16} />
              <span>Quick Actions</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
