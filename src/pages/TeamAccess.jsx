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
  CheckCircle2, 
  XCircle, 
  UserMinus,
  Mail,
  Shield,
  Clock,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Activity,
  Fingerprint
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
    <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 px-6">
      <div className="w-24 h-24 rounded-[2.5rem] bg-red-50 flex items-center justify-center text-red-500 shadow-inner">
        <ShieldAlert size={48} strokeWidth={1.5} />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-display font-bold text-navy tracking-tighter uppercase italic">Access Restricted</h2>
        <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.3em]">Module 9: Clearance Level 1 Required</p>
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
    <div className="max-w-6xl mx-auto space-y-12 pb-32 pt-4 px-4 leading-tight">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center shadow-lg shadow-navy/20">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-3xl font-display font-bold text-navy tracking-tighter uppercase">Identity Vault</h2>
          </div>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.3em] pl-1">Personnel & Access Hierarchy Management</p>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <Clock size={16} className="text-gold" />
            <h3 className="text-[11px] font-black text-navy uppercase tracking-[0.2em] italic underline underline-offset-8 decoration-gold/30">Pending Induction ({pending.length})</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {pending.map(u => (
              <motion.div 
                key={u.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="premium-card p-6 bg-offwhite border-slate-100 flex items-center justify-between gap-6 shadow-xl shadow-navy/5"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-50 flex items-center justify-center font-display font-bold text-navy text-lg shadow-inner">
                    {u.displayName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-navy tracking-tight">{u.displayName}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">{u.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => update(u.id, 'status', 'approved')}
                    className="h-12 px-6 bg-navy text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-navy/20 active:scale-95 transition-all"
                  >
                    INDUCT
                  </button>
                  <button 
                    onClick={() => update(u.id, 'status', 'suspended')}
                    className="h-12 w-12 bg-white border border-slate-100 text-slate-300 rounded-xl flex items-center justify-center hover:bg-white hover:text-red-500 hover:border-red-100 transition-all shadow-sm active:scale-90"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Main Personnel Grid */}
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row items-center gap-8 justify-between px-1">
          <div className="flex items-center gap-3">
            <Fingerprint size={20} className="text-gold" />
            <h3 className="text-[11px] font-black text-navy uppercase tracking-[0.2em] italic underline underline-offset-8 decoration-navy/10">Active Personnel Directory ({approved.length + 1})</h3>
          </div>
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-gold transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH IDENTITY..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-14 pl-12 pr-6 bg-offwhite border border-slate-100 rounded-[1.25rem] outline-none focus:bg-white focus:ring-8 focus:ring-navy/5 focus:border-navy transition-all text-[11px] font-bold tracking-widest shadow-inner"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Master User Identity Card */}
          <div className="premium-card p-10 bg-navy text-white relative overflow-hidden group border-none shadow-2xl shadow-navy/20">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Fingerprint size={120} />
             </div>
             <div className="relative z-10 flex flex-col gap-10">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-[2rem] bg-white/5 border-2 border-gold/50 text-gold flex items-center justify-center text-3xl font-display font-bold shadow-xl shadow-navy-dark/50">
                    {me?.displayName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                       <h4 className="text-2xl font-display font-bold tracking-tight italic uppercase">{me?.displayName}</h4>
                    </div>
                    <div className="px-3 py-1 bg-gold text-navy inline-block rounded-full text-[9px] font-black uppercase tracking-[0.2em]">CLEARANCE: MASTER</div>
                  </div>
                </div>
                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-widest italic">
                      <Mail size={12} />
                      {me?.email}
                   </div>
                   <button className="text-[10px] font-bold text-gold hover:text-white transition-all flex items-center gap-2 uppercase tracking-[0.2em] group/btn">
                     LOGS
                     <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
             <div className="absolute top-0 right-0 h-40 w-40 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
          </div>

          {/* Personnel Roster */}
          <AnimatePresence mode="popLayout">
            {filteredApproved.map(u => (
              <motion.div 
                layout
                key={u.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="premium-card p-10 flex flex-col justify-between group hover:shadow-2xl hover:shadow-navy/5 transition-all duration-500 bg-white"
              >
                <div className="flex items-center justify-between mb-8">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-offwhite border border-slate-50 flex items-center justify-center text-slate-300 font-display font-bold text-xl group-hover:bg-ivory/50 group-hover:text-navy transition-all duration-700">
                    {u.displayName?.[0]?.toUpperCase()}
                   </div>
                   <div className="relative">
                      <select 
                        value={u.role || 'member'} 
                        onChange={e => update(u.id, 'role', e.target.value)}
                        className="bg-offwhite border border-slate-50 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gold text-right outline-none cursor-pointer hover:bg-white hover:shadow-sm transition-all appearance-none pr-8"
                      >
                        <option value="admin">LEVEL: ADMIN</option>
                        <option value="member">LEVEL: MEMBER</option>
                        <option value="view">LEVEL: GUEST</option>
                      </select>
                      <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gold pointer-events-none" />
                   </div>
                </div>

                <div className="space-y-2 mb-10">
                   <h4 className="text-2xl font-display font-bold text-navy group-hover:text-gold transition-colors tracking-tight italic uppercase">{u.displayName}</h4>
                   <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic flex items-center gap-2">
                      <Mail size={12} className="opacity-50" />
                      {u.email}
                   </div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                   <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                      <Activity size={12} className="text-green-500" />
                      <span className="text-[9px] font-black text-navy uppercase tracking-widest">ENCRYPTED CLEARANCE</span>
                   </div>
                   <button 
                    onClick={() => update(u.id, 'status', 'suspended')}
                    className="w-10 h-10 flex items-center justify-center text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                    title="Suspend Access"
                   >
                     <UserMinus size={20} />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredApproved.length === 0 && approved.length > 0 && (
          <div className="py-24 text-center">
             <Search size={40} className="mx-auto text-slate-100 mb-6" />
             <p className="text-[11px] text-slate-300 font-bold uppercase tracking-[0.4em] italic">No identities matched the search parameters</p>
          </div>
        )}
      </div>

      {/* Security Context Archive */}
      <div className="premium-card p-12 bg-ivory/30 border-dashed border-2 border-slate-200 text-navy relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="w-16 h-16 rounded-[1.8rem] bg-white flex items-center justify-center shadow-xl flex-shrink-0">
            <Shield size={32} className="text-gold" strokeWidth={1.5} />
          </div>
          <div className="space-y-3">
            <h4 className="text-lg font-display font-bold uppercase tracking-widest italic leading-none">Induction Ethics & Personnel Security</h4>
            <p className="text-[12px] font-bold text-slate-400 leading-relaxed max-w-2xl uppercase tracking-tighter">
              All personnel access is governed by the Light Assembly Ethics Protocol. Unauthorized session capture is monitored. Every modification to clearance level is logged to the central ledger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

