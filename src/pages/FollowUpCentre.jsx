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
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TYPES = [
  { value: 'first_timer', label: 'First Timer', icon: UserPlus, color: '#C9960C', bg: 'bg-gold/10', promptType: 'welcome_message' },
  { value: 'absentee', label: 'Absentee', icon: Heart, color: '#DC2626', bg: 'bg-red-50', promptType: 'absentee_checkin' },
  { value: 'visitor', label: 'Visitor', icon: MessageSquare, color: '#10B981', bg: 'bg-emerald-50', promptType: 'welcome_message' },
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
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header & Care Dashboard Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-navy tracking-tight">Care Command Center</h2>
          <p className="text-slate-500 font-medium tracking-wide">Monitor and engage with members needing follow-up.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="h-12 px-6 bg-navy text-white rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-navy/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Log Care Need
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pending Care', val: tasks.length, icon: Clock, color: 'text-amber-500' },
          { label: 'First Timers', val: tasks.filter(t => t.type === 'first_timer').length, icon: UserPlus, color: 'text-gold' },
          { label: 'Urgent Care', val: tasks.filter(t => t.type === 'absentee').length, icon: AlertTriangle, color: 'text-red-500' },
          { label: 'Completed Today', val: 0, icon: CheckCircle2, color: 'text-green-500' },
        ].map((stat, i) => (
          <div key={i} className="premium-card p-4 flex flex-col items-center justify-center text-center space-y-1">
            <stat.icon size={16} className={stat.color} />
            <div className="text-xl font-bold text-navy tracking-tight">{stat.val}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="premium-card p-6 md:p-8 space-y-6 ring-2 ring-gold/20"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-navy uppercase tracking-widest">New Follow-up Task</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-300 hover:text-navy"><X size={20} /></button>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member Full Name</label>
                <input 
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all text-sm font-semibold"
                  placeholder="Ebuka Emmanuel..."
                  value={form.name} 
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Care Category</label>
                <select 
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all text-sm font-semibold appearance-none"
                  value={form.type} 
                  onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                >
                  {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>

            <button 
              onClick={handleAdd}
              className="w-full h-12 bg-gold text-white rounded-xl font-bold text-xs uppercase tracking-widest active:scale-[0.98] transition-all shadow-lg shadow-gold/10"
            >
              Add to Portal
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {tasks.map(task => {
            const typeInfo = TYPES.find(t => t.value === task.type);
            const isActive = activeTask === task.id;
            return (
              <motion.div 
                layout
                key={task.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                className="premium-card group overflow-hidden"
              >
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${typeInfo?.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                      {typeInfo && <typeInfo.icon size={22} style={{ color: typeInfo.color }} />}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-navy tracking-tight">{task.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: typeInfo?.color }}>
                          {typeInfo?.label}
                        </span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Added {new Date(task.createdAt?.seconds * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleGenerate(task)}
                      disabled={loading && isActive}
                      className="h-11 px-5 bg-white border border-slate-200 text-navy rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group/btn"
                    >
                      <Sparkles size={14} className="group-hover/btn:text-gold transition-colors" />
                      {isActive && loading ? 'Thinking...' : 'Draft Message'}
                    </button>
                    <button 
                      className="h-11 w-11 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-navy hover:border-navy transition-all shadow-sm"
                      onClick={() => showToast('Feature: Action coming soon')}
                    >
                      <Phone size={16} />
                    </button>
                    <button 
                      onClick={() => handleDone(task.id)}
                      className="h-11 px-5 bg-navy/5 text-navy rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-navy hover:text-white transition-all active:scale-95"
                    >
                      <CheckCircle2 size={14} />
                      Done
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isActive && output && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 bg-slate-50/50"
                    >
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-gold" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-navy">AI Care Recommendation</span>
                          </div>
                          <button 
                            onClick={() => copy(output)}
                            className="text-[10px] font-bold text-gold hover:text-navy uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                          >
                            <Copy size={12} />
                            Copy Draft
                          </button>
                        </div>
                        <div className="p-5 bg-white border border-slate-200 rounded-2xl text-sm leading-relaxed italic text-navy font-medium shadow-sm">
                          {output}
                        </div>
                        <div className="flex justify-end">
                          <button 
                            className="bg-gold/10 text-gold px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-white transition-all flex items-center gap-2"
                            onClick={() => showToast('Redirecting to Content Studio...')}
                          >
                            <Send size={12} />
                            Send via Studio
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
          <div className="premium-card py-20 bg-slate-50/30 border-dashed border-2 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-100">
              <CheckCircle2 size={28} className="text-green-500" />
            </div>
            <h3 className="text-sm font-bold text-navy uppercase tracking-widest mb-2">All Clear</h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">No pending care items. New follow-ups will appear here once logged.</p>
          </div>
        )}
      </div>

      {/* Historical Context */}
      <div className="premium-card p-6 bg-navy text-white relative overflow-hidden group">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <History size={20} className="text-gold" />
            </div>
            <h3 className="text-lg font-bold tracking-tight italic">Church Care Intelligence</h3>
          </div>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            The Follow-up Portal uses the Church Knowledge Base to ensure every message resonates with our current sermon series and values.
          </p>
        </div>
        <div className="absolute top-0 right-0 h-40 w-40 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform duration-700" />
      </div>
    </div>
  );
}
