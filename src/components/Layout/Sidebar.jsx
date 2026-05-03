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
  <div className="mb-10">
    <div className="flex items-center gap-2 px-6 mb-4">
      <div className="w-1.5 h-1.5 rounded-full bg-gold/50" />
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">
        {title}
      </h3>
    </div>
    <div className="px-3 space-y-1.5">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden
            ${isActive 
              ? 'bg-white/5 text-gold shadow-2xl shadow-black/20' 
              : 'text-slate-500 hover:text-white hover:bg-white/5'}
          `}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gold"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon size={20} className={`${isActive ? 'text-gold' : 'text-slate-600'} group-hover:text-gold transition-colors duration-500`} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={`flex-1 text-[11px] font-black uppercase tracking-[0.2em] italic ${isActive ? 'text-white' : ''}`}>
                {item.label}
              </span>
              <ChevronRight size={14} className={`${isActive ? 'opacity-100 text-gold' : 'opacity-0'} group-hover:opacity-40 transition-all duration-500 transform group-hover:translate-x-1`} />
            </>
          )}
        </NavLink>
      ))}
    </div>
  </div>
);

export default function Sidebar() {
  const { logout, userProfile } = useAuth();

  const mainItems = [
    { label: 'Tactical Overview', path: '/', icon: LayoutDashboard },
    { label: 'Content Studio', path: '/studio', icon: Sparkles },
    { label: 'Sermon Engine', path: '/sermon', icon: Mic2 },
    { label: 'Production Queue', path: '/queue', icon: Layers },
  ];

  const operationsItems = [
    { label: 'Weekly Rhythm', path: '/calendar', icon: Calendar },
    { label: 'Follow-Up Node', path: '/followup', icon: Users },
    { label: 'Media Lab', path: '/media', icon: Camera },
    { label: 'Chronicle Archive', path: '/history', icon: History },
  ];

  const adminItems = [
    { label: 'Neural Brain', path: '/church', icon: Brain },
    { label: 'Cognitive Depot', path: '/knowledge', icon: Database },
    { label: 'Nexus Registry', path: '/team', icon: ShieldCheck },
  ];

  return (
    <aside className="w-[280px] lg:w-72 bg-navy h-full flex flex-col text-white shadow-[20px_0_60px_rgba(0,0,0,0.2)] z-50 border-r border-white/5">
      {/* Brand Header */}
      <div className="h-28 flex items-center px-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-[1.2rem] flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:border-gold/50 transition-colors">
            <div className="absolute inset-0 bg-gold/10 animate-pulse" />
            <span className="font-display font-black text-gold text-2xl pt-1 italic">L</span>
          </div>
          <div>
            <h1 className="font-display font-black text-2xl tracking-tighter leading-none italic uppercase">Labc</h1>
            <p className="text-[9px] text-gold font-black uppercase tracking-[0.4em] mt-1.5 opacity-60">Command Center</p>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 py-6 overflow-y-auto no-scrollbar">
        <NavGroup title="Strategic Operations" items={mainItems} />
        <NavGroup title="Deployment Nodes" items={operationsItems} />
        <NavGroup title="Intelligence Core" items={adminItems} />
      </nav>

      {/* User Actions Account */}
      <div className="p-8 mt-auto border-t border-white/5 bg-black/20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 border border-white/10 hover:text-gold hover:border-gold/30 transition-all cursor-pointer">
              <Settings size={18} />
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Logic Online</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
            title="De-authenticate"
          >
            <LogOut size={18} />
          </button>
        </div>
        
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-gold/20 transition-all duration-700">
          <p className="text-[9px] text-gold/40 uppercase tracking-[0.3em] font-black mb-2 italic">Official Deployment</p>
          <p className="text-[11px] text-slate-300 font-bold leading-relaxed uppercase tracking-tight italic">
            Light Assembly Bible Church — Portal v4.0
          </p>
        </div>
      </div>
    </aside>
  );
}

