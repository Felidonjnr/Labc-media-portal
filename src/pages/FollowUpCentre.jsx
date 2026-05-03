// src/pages/FollowUpCentre.jsx
import { useState, useEffect } from 'react';
import { useChurch } from '../contexts/ChurchContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast, useCopy } from '../hooks/useToast';
import { generateContent } from '../services/ai/aiService';
import { buildPrompt } from '../services/rag/promptBuilder';
import { getFollowUpTasks, addFollowUpTask, completeFollowUpTask } from '../services/firestore/db';
import { 
  UserPlus, 
  Heart, 
  MessageSquare, 
  CheckCircle2, 
  Plus, 
  Search, 
  Sparkles, 
  Copy, 
  X,
  Phone,
  Clock,
  Send,
  AlertTriangle,
  History,
  Activity,
  ArrowRight,
  Shield,
  Zap,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TYPES = [
  { value: 'first_timer', label: 'First Timer', icon: UserPlus, color: '#D4AF37', bg: 'bg-gold/10', promptType: 'welcome_message' },
  { value: 'absentee', label: 'Absentee', icon: Heart, color: '#EF4444', bg: 'bg-red-50', promptType: 'absentee_checkin' },
  { value: 'visitor', label: 'Visitor', icon: Activity, color: '#10B981', bg: 'bg-emerald-50', promptType: 'welcome_message' },
];

export default function FollowUpCentre() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'first_timer' });
  const [activeTask, setActiveTask] = useState(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const { knowledge } = useChurch();
  const { user } = useAuth();
  const { showToast } = useToast();
  const copy = useCopy(showToast);

  useEffect(() => { load(); }, []);

  async function load() {
    try { 
      const data = await getFollowUpTasks();
      setTasks(data); 
    } catch (err) {
      setTasks([]);
    }
  }

  async function handleAdd() {
    if (!form.name.trim()) return;
    try {
      await addFollowUpTask({ ...form, addedBy: user?.email });
      setForm({ name: '', type: 'first_timer' });
      setShowForm(false);
      showToast('✓ Care Alert Recorded');
      await load();
    } catch (err) {
      showToast('Error recording task');
    }
  }

  async function handleGenerate(task) {
    setActiveTask(task.id);
    setOutput('');
    setLoading(true);
    try {
      const typeInfo = TYPES.find(t => t.value === task.type);
      const { system, userMessage } = buildPrompt({ 
        contentType: typeInfo.promptType, 
        knowledge, 
        userInput: `Member name: ${task.name}. Task Type: ${typeInfo.label}` 
      });
      const result = await generateContent({ system, userMessage, useRefinement: true });
      setOutput(result.text);
    } catch { 
      showToast('Generation failed'); 
    }
    setLoading(false);
  }

  async function handleDone(id) {
    try {
      await completeFollowUpTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      showToast('✓ Care Completed');
    } catch (err) {
      showToast('Error closing task');
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32 pt-4 px-4 leading-tight">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold text-white flex items-center justify-center shadow-lg shadow-gold/20">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-3xl font-display font-bold text-navy tracking-tighter uppercase">Care Command</h2>
          </div>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.3em] pl-1">Outreach & Engagement Operations</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary h-14 px-10 shadow-2xl shadow-navy/20 active:scale-[0.98] flex items-center gap-3 text-sm"
        >
          <Plus size={20} />
          <span className="font-bold tracking-widest text-[11px]">LOG CARE PROTOCOL</span>
        </button>
      </div>

      {/* Radar Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Pending Active', val: tasks.length, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-50/50' },
          { label: 'New Arrivals', val: tasks.filter(t => t.type === 'first_timer').length, icon: UserPlus, color: 'text-gold', bg: 'bg-gold/5' },
          { label: 'Urgent Care', val: tasks.filter(t => t.type === 'absentee').length, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50/50' },
          { label: 'Cleared Today', val: 0, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50/50' },
        ].map((stat, i) => (
          <div key={i} className={`premium-card p-6 flex flex-col items-center justify-center text-center space-y-3 transition-transform hover:scale-[1.02] ${stat.bg} border-transparent`}>
             <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm ${stat.color}`}>
               <stat.icon size={20} />
             </div>
             <div className="space-y-0.5">
               <div className="text-2xl font-display font-bold text-navy tracking-tight">{stat.val}</div>
               <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
             </div>
          </div>
        ))}
      </div>

      {/* Log Form Overlay */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-md p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="premium-card max-w-xl w-full p-10 md:p-12 space-y-10 shadow-[0_40px_100px_-20px_rgba(15,23,42,0.5)] border-gold/10"
            >
              <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-display font-bold text-navy uppercase italic mb-1">New Care Entry</h3>
                   <div className="h-1 w-12 bg-gold rounded-full" />
                </div>
                <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-navy transition-colors shadow-inner"><X size={20} /></button>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                     <Shield size={12} className="text-gold" />
                     Subject Identity (Full Name)
                  </label>
                  <input 
                    className="w-full h-14 px-6 bg-offwhite border border-slate-100 rounded-2xl focus:bg-white focus:ring-8 focus:ring-gold/10 focus:border-gold outline-none transition-all text-sm font-bold shadow-inner"
                    placeholder="Enter full name..."
                    value={form.name} 
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                     <BookmarkIcon size={12} className="text-gold" />
                     Task Classification
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {TYPES.map(t => (
                      <button 
                        key={t.value}
                        onClick={() => setForm(p => ({ ...p, type: t.value }))}
                        className={`p-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all text-center flex flex-col items-center gap-2
                          ${form.type === t.value ? 'bg-navy border-navy text-white shadow-xl shadow-navy/20' : 'bg-white border-slate-100 text-slate-400 hover:border-gold'}
                        `}
                      >
                        <t.icon size={16} />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAdd}
                className="btn-gold w-full h-16 shadow-2xl shadow-gold/20 active:scale-[0.98] font-bold tracking-[0.3em] text-xs"
              >
                COMMIT TO OPERATIONS
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List */}
      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {tasks.map(task => {
            const typeInfo = TYPES.find(t => t.value === task.type);
            const isActive = activeTask === task.id;
            return (
              <motion.div 
                layout
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="premium-card group hover:shadow-2xl hover:shadow-navy/5 transition-all overflow-hidden"
              >
                <div className="p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                  <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-[2rem] ${typeInfo?.bg} flex items-center justify-center shadow-sm relative group-hover:rotate-6 transition-transform flex-shrink-0`}>
                       <typeInfo.icon size={32} style={{ color: typeInfo.color }} strokeWidth={1.5} />
                       <div className="absolute -top-1 -right-1 w-5 h-5 bg-white border-2 border-slate-50 rounded-full flex items-center justify-center animate-pulse">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                       </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                         <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-slate-50 border border-slate-100" style={{ color: typeInfo?.color }}>
                           {typeInfo?.label}
                         </span>
                         <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest bg-white border border-slate-50 px-3 py-1 rounded-full">
                           Ref: {new Date(task.createdAt?.seconds * 1000).toLocaleDateString()}
                         </span>
                      </div>
                      <h4 className="text-3xl font-display font-bold text-navy tracking-tight">{task.name}</h4>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button 
                      onClick={() => handleGenerate(task)}
                      disabled={loading && isActive}
                      className="h-14 px-8 bg-navy text-white rounded-2xl font-bold tracking-[0.2em] uppercase text-[10px] flex items-center gap-3 hover:bg-navy-dark transition-all shadow-xl shadow-navy/20 active:scale-95 group/btn"
                    >
                      <Sparkles size={18} className="text-gold group-hover/btn:animate-spin" />
                      {isActive && loading ? 'ENGINE PROCESSING...' : 'MANIPULATE DRAFT'}
                    </button>
                    <button 
                      className="h-14 w-14 flex items-center justify-center bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-navy hover:shadow-xl transition-all active:scale-90 shadow-sm"
                      onClick={() => showToast('Protocol: VoIP Redirect coming soon')}
                    >
                      <Phone size={22} strokeWidth={1.5} />
                    </button>
                    <button 
                      onClick={() => handleDone(task.id)}
                      className="h-14 px-8 bg-green-50 text-green-600 border border-green-100 rounded-2xl font-bold tracking-[0.2em] uppercase text-[10px] flex items-center gap-3 hover:bg-green-600 hover:text-white transition-all active:scale-95 shadow-sm"
                    >
                      <CheckCircle2 size={18} />
                      COMPLETE
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isActive && output && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 bg-ivory/20"
                    >
                      <div className="p-10 space-y-8">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-white">
                               <Zap size={16} />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-navy italic">Care Logic Generated</span>
                          </div>
                          <button 
                            onClick={() => copy(output)}
                            className="text-[10px] font-bold text-gold hover:text-navy uppercase tracking-[0.3em] flex items-center gap-2 transition-colors group/copy"
                          >
                            <Copy size={14} className="group-hover/copy:scale-110 transition-transform" />
                            CAPTURE PAYLOAD
                          </button>
                        </div>
                        <div className="p-8 bg-white border border-slate-100 rounded-[2rem] text-lg leading-relaxed italic text-navy font-bold shadow-inner">
                          {output}
                        </div>
                        <div className="flex justify-end gap-4">
                           <button 
                            className="bg-navy/5 text-slate-400 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-navy/10 transition-all font-display"
                            onClick={() => setOutput('')}
                          >
                            DISCARD
                          </button>
                          <button 
                            className="btn-gold px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] active:scale-95 shadow-xl shadow-gold/20 flex items-center gap-3 group/link"
                            onClick={() => showToast('Redirecting to Content Studio...')}
                          >
                            ENGAGE STUDIO
                            <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="premium-card py-32 bg-offwhite/50 border-dashed border-2 border-slate-200 flex flex-col items-center justify-center text-center px-12">
            <div className="w-24 h-24 rounded-[3rem] bg-white flex items-center justify-center mb-10 shadow-2xl border border-slate-100">
               <Shield size={40} className="text-gold opacity-30" strokeWidth={1} />
            </div>
            <h3 className="text-sm font-bold text-navy uppercase tracking-[0.5em] mb-4 italic">Operational Silence</h3>
            <p className="text-[10px] text-slate-400 max-w-sm leading-relaxed font-bold uppercase tracking-[0.2em]">All care protocols are currently completed. <br />New alerts will manifest as they are logged.</p>
          </div>
        )}
      </div>

      {/* Historical Intelligence */}
      <div className="premium-card p-12 bg-navy text-white relative overflow-hidden group border-none">
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-gold shadow-2xl">
                <History size={28} />
              </div>
              <h3 className="text-3xl font-display font-bold tracking-tight italic uppercase">Care Intelligence</h3>
            </div>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed font-medium">
              The Follow-up Portal leverages the Church Knowledge Base to derive personalized engagement scripts. Every interaction is synchronized with current spiritual themes.
            </p>
          </div>
          <div className="relative h-40 hidden md:block">
             <div className="absolute inset-0 bg-gradient-to-l from-gold/5 via-transparent to-transparent flex items-center justify-end">
                <Activity size={160} className="text-white/5" />
             </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 h-96 w-96 bg-gold/5 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
      </div>
    </div>
  );
}

function BookmarkIcon({ size, className }) {
  return <Shield size={size} className={className} />;
}

