import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Calendar, 
  HeartHandshake, 
  Camera, 
  History, 
  Brain, 
  Database, 
  Users, 
  Settings,
  ChevronRight,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

const NavGroup = ({ title, children, isOpen }) => (
  <div className="mb-6">
    <h3 className={`px-4 mb-2 text-[10px] font-bold tracking-[0.2em] text-silver uppercase transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      {title}
    </h3>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

const NavItem = ({ to, icon: Icon, label, isOpen }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group
      ${isActive 
        ? 'bg-gold text-white shadow-lg shadow-gold/20' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'}
    `}
  >
    <Icon size={20} className="shrink-0" />
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="text-sm font-medium whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>
    {!isOpen && (
      <div className="absolute left-full ml-4 px-2 py-1 bg-navy-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
        {label}
      </div>
    )}
  </NavLink>
);

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { logout, userProfile } = useAuth();

  return (
    <aside 
      className={`
        fixed left-0 top-0 h-full bg-navy bg-navy-dark border-r border-white/5 z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-20'}
      `}
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center shrink-0">
            <span className="text-white font-display text-xl leading-none pt-1">L</span>
          </div>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="font-display text-lg tracking-widest text-white leading-none pt-1">LAMP</span>
              <span className="text-[9px] text-silver tracking-[0.15em] uppercase font-bold">Media Portal</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 h-[calc(100%-160px)] overflow-y-auto custom-scrollbar">
        <NavGroup title="Main" isOpen={isOpen}>
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" isOpen={isOpen} />
          <NavItem to="/studio" icon={Sparkles} label="Create Content" isOpen={isOpen} />
          <NavItem to="/sermon" icon={BookOpen} label="Sermon Engine" isOpen={isOpen} />
          <NavItem to="/queue" icon={Layers} label="Content Queue" isOpen={isOpen} />
        </NavGroup>

        <NavGroup title="Operations" isOpen={isOpen}>
          <NavItem to="/calendar" icon={Calendar} label="Calendar" isOpen={isOpen} />
          <NavItem to="/followup" icon={HeartHandshake} label="Follow-Up Centre" isOpen={isOpen} />
          <NavItem to="/media" icon={Camera} label="Media Studio" isOpen={isOpen} />
          <NavItem to="/history" icon={History} label="Content History" isOpen={isOpen} />
        </NavGroup>

        <NavGroup title="Brain & Admin" isOpen={isOpen}>
          <NavItem to="/church" icon={Brain} label="Church Knowledge" isOpen={isOpen} />
          <NavItem to="/knowledge" icon={Database} label="Knowledge Dump" isOpen={isOpen} />
          <NavItem to="/team" icon={Users} label="Team Access" isOpen={isOpen} />
          <NavItem to="/settings" icon={Settings} label="Settings" isOpen={isOpen} />
        </NavGroup>
      </div>

      {/* User Area */}
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/5 bg-navy-deep">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-silver text-xs font-bold uppercase leading-none">
                {userProfile?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate">{userProfile?.fullName || 'User'}</span>
                <span className="text-[10px] text-silver truncate uppercase tracking-wider font-medium">{userProfile?.role || 'Team'}</span>
              </div>
            </div>
          )}
          <button 
            onClick={logout}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group relative"
          >
            <LogOut size={18} />
            {!isOpen && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-navy-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                Logout
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-24 w-6 h-6 bg-gold hover:bg-gold-dark text-white rounded-full flex items-center justify-center shadow-lg transition-colors border-2 border-bg hidden md:flex"
      >
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronRight size={14} />
        </motion.div>
      </button>
    </aside>
  );
}
