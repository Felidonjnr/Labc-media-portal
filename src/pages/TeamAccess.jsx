// src/pages/TeamAccess.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { getAllUsers, updateUser } from '../services/firestore/db';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  UserMinus,
  Settings2,
  Mail,
  Shield,
  Clock,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TeamAccess() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { isAdmin, user: me } = useAuth();
  const { showToast } = useToast();

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  async function load() {
    setLoading(true);
    try { 
      const data = await getAllUsers();
      setUsers(data); 
    } catch { 
      setUsers([]); 
    }
    setLoading(false);
  }

  async function update(uid, field, value) {
    try {
      await updateUser(uid, { [field]: value });
      setUsers(prev => prev.map(u => u.id === uid ? { ...u, [field]: value } : u));
      showToast(`✓ Permission Updated: ${field.toUpperCase()} -> ${value}`);
    } catch (err) {
      showToast('Error updating permissions');
    }
  }

  if (!isAdmin) return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-500">
        <ShieldAlert size={40} />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-navy tracking-tight uppercase italic">Access Restricted</h2>
        <p className="text-slate-500 text-sm mt-2">Only senior administrators can access personnel management.</p>
      </div>
    </div>
  );

  const pending = users.filter(u => u.status === 'pending');
  const approved = users.filter(u => u.status === 'approved' && u.id !== me?.uid);
  const filteredApproved = approved.filter(u => 
    u.displayName?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Team Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center shadow-lg shadow-navy/20">
              <Users size={20} />
            </div>
            <h2 className="text-3xl font-bold text-navy tracking-tight uppercase tracking-widest italic">Operations Command</h2>
          </div>
          <p className="text-slate-500 font-medium tracking-wide">Manage team permissions, onboarding, and access hierarchy.</p>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={16} className="text-amber-500" />
            <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Pending Induction ({pending.length})</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {pending.map(u => (
              <motion.div 
                key={u.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card p-5 bg-amber-50/30 border-amber-200/50 flex items-center justify-between gap-4 ring-2 ring-amber-500/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-700">
                    {u.displayName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-navy">{u.displayName}</div>
                    <div className="text-[10px] text-slate-500 font-medium tracking-wide">{u.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => update(u.id, 'status', 'approved')}
                    className="h-9 px-4 bg-green-500 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20 active:scale-95 transition-all"
                  >
                    Induct
                  </button>
                  <button 
                    onClick={() => update(u.id, 'status', 'suspended')}
                    className="h-9 w-9 bg-white border border-slate-200 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-50 transition-all shadow-sm"
                  >
                    <XCircle size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Main Team Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck size={16} className="text-gold" />
            <h3 className="text-[10px] font-black text-navy uppercase tracking-[0.2em]">Active Command Team ({approved.length + 1})</h3>
          </div>
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-gold transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search team..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-gold/10 focus:border-gold transition-all text-[11px] font-bold"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User's own card */}
          <div className="premium-card p-6 border-gold/40 ring-4 ring-gold/5 relative overflow-hidden backdrop-blur-sm">
             <div className="absolute top-0 right-0 p-2 opacity-10">
               <Shield size={60} />
             </div>
             <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-navy text-gold flex items-center justify-center text-xl font-bold border-2 border-gold shadow-lg">
                    {me?.displayName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <h4 className="text-lg font-bold text-navy">{me?.displayName}</h4>
                       <span className="bg-gold text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">Master</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Mail size={10} />
                      {me?.email}
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">My Identity Profile</span>
                   <button className="text-[10px] font-bold text-gold hover:text-navy transition-colors flex items-center gap-1.5 uppercase tracking-widest">
                     Settings
                     <ChevronRight size={12} />
                   </button>
                </div>
             </div>
          </div>

          {/* Filtered list of other team members */}
          <AnimatePresence mode="popLayout">
            {filteredApproved.map(u => (
              <motion.div 
                layout
                key={u.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="premium-card p-6 flex flex-col justify-between group group-hover:border-navy/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                   <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-ivory/50 group-hover:text-navy transition-all duration-500">
                    {u.displayName?.[0]?.toUpperCase()}
                   </div>
                   <select 
                    value={u.role || 'member'} 
                    onChange={e => update(u.id, 'role', e.target.value)}
                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-gold text-right outline-none cursor-pointer hover:text-navy transition-colors"
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                    <option value="view">Spectator</option>
                  </select>
                </div>

                <div className="space-y-1 mb-6">
                   <h4 className="font-bold text-navy group-hover:text-gold transition-colors">{u.displayName}</h4>
                   <div className="text-[10px] text-slate-400 font-medium truncate italic">{u.email}</div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                   <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Access</span>
                   </div>
                   <button 
                    onClick={() => update(u.id, 'status', 'suspended')}
                    className="text-slate-200 hover:text-red-500 transition-colors"
                    title="Suspend Access"
                   >
                     <UserMinus size={16} />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredApproved.length === 0 && approved.length > 0 && (
          <div className="py-12 text-center text-slate-400 text-xs italic font-medium">
            No team members matched your search.
          </div>
        )}
      </div>

      {/* Security Context */}
      <div className="premium-card p-6 bg-ivory text-navy border-none shadow-none ring-1 ring-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <Shield size={24} className="text-gold" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black uppercase tracking-widest tracking-tighter italic">Induction Ethics & Security</h4>
            <p className="text-[11px] font-medium text-slate-400 leading-relaxed max-w-2xl">
              New team members are placed in "Pending Induction" by default. All portal data is governed by the Church Leadership Council ethics policy. Access logs are captured for all operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
