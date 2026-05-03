import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  Mic2, 
  Layers, 
  Calendar, 
  Users, 
  Camera, 
  History, 
  Brain, 
  Database, 
  ShieldCheck,
  ChevronRight,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';

const NavGroup = ({ title, items }) => (
  <div className="mb-8">
    <h3 className="px-4 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] opacity-60">
      {title}
    </h3>
    <div className="mx-2 space-y-1">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group
            ${isActive 
              ? 'bg-gold text-white shadow-lg shadow-gold/20 font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'}
          `}
        >
          <item.icon size={18} className={`${item.color || ''} transition-colors`} />
          <span className="flex-1 text-sm tracking-tight">{item.label}</span>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
        </NavLink>
      ))}
    </div>
  </div>
);

export default function Sidebar() {
  const { logout, userProfile } = useAuth();

  const mainItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Create Content', path: '/studio', icon: Sparkles },
    { label: 'Sermon Engine', path: '/sermon', icon: Mic2 },
    { label: 'Content Queue', path: '/queue', icon: Layers },
  ];

  const operationsItems = [
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Follow-Up', path: '/followup', icon: Users },
    { label: 'Media Studio', path: '/media', icon: Camera },
    { label: 'Archive', path: '/history', icon: History },
  ];

  const adminItems = [
    { label: 'AI Brain', path: '/church', icon: Brain },
    { label: 'Knowledge Dump', path: '/knowledge', icon: Database },
    { label: 'Team Nexus', path: '/team', icon: ShieldCheck },
  ];

  return (
    <aside className="w-[280px] lg:w-72 bg-navy h-full flex flex-col text-white shadow-[10px_0_40px_rgba(0,0,0,0.1)] z-50">
      {/* Brand Header */}
      <div className="h-24 flex items-center px-8">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-gold rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-gold/20 transform -rotate-3">
            <span className="font-display font-bold text-white text-2xl pt-1">L</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tighter leading-none">LAMP</h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] mt-1 font-bold">Media Command</p>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto no-scrollbar">
        <NavGroup title="Production" items={mainItems} />
        <NavGroup title="Operations" items={operationsItems} />
        <NavGroup title="Intelligence" items={adminItems} />
      </nav>

      {/* User Actions Account */}
      <div className="p-6 mt-auto border-t border-white/5 bg-navy-dark/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gold border border-white/10">
              <Settings size={14} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Preferences</span>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
        
        <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10">
          <p className="text-[9px] text-gold/60 uppercase tracking-widest font-bold mb-1">Church Portal</p>
          <p className="text-[11px] text-white/80 font-medium leading-relaxed">
            Light Assembly Bible Church — Global Registry
          </p>
        </div>
      </div>
    </aside>
  );
}

