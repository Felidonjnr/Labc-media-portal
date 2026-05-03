// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getQueueItems, getFollowUpTasks } from '../services/firestore/db';
import { 
  Sparkles, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Users, 
  MessageSquare, 
  Zap, 
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import { motion } from 'motion/react';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAY_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DAY_TASKS = {
  0: { tasks: ['Record today\'s service', 'Go live on Facebook', 'Generate Sunday Recap tonight', 'Log first timers in Follow-Up'], forward: false },
  1: { tasks: ['Send Monday Fuel voice note', 'Distribute sermon audio', 'Send welcome messages to Sunday visitors'], forward: false },
  2: { tasks: ['Send Testimony Tuesday prompt', 'Check first timers were welcomed', 'The Word Today broadcast'], forward: false },
  3: { tasks: ['Post Sermon Quote Card on Facebook', 'Update WhatsApp Status with sermon quote', 'The Word Today broadcast'], forward: false },
  4: { tasks: ['Post sermon clip on Facebook', 'Send absentee check-in messages', 'NIGHT PROGRAMME — post reminder now'], forward: false },
  5: { tasks: ['Begin Sunday announcement prep', 'Draft Saturday Teaser Post', 'Confirm Pastor\'s sermon notes are ready'], forward: true },
  6: { tasks: ['Post Saturday Teaser on Facebook', 'Send reminder broadcast', 'Confirm all Sunday content is ready'], forward: true },
};

const WEEKLY_RHYTHM = [
  { short: 'Live + Recap' }, { short: 'Monday Fuel' }, { short: 'Testimony' },
  { short: 'Quote Card' }, { short: 'Clip + Night' }, { short: 'Sun Prep' }, { short: 'Teaser' }
];

export default function Home() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [nextActions, setNextActions] = useState([]);
  const [stats, setStats] = useState({ queue: 0, followups: 0 });
  
  const today = new Date();
  const dayIdx = today.getDay();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const name = userProfile?.fullName?.split(' ')[0] || 'Team';
  const dayData = DAY_TASKS[dayIdx];

  useEffect(() => { 
    computeNextActions(); 
  }, []);

  async function computeNextActions() {
    const actions = [];
    try {
      const queue = await getQueueItems();
      const followups = await getFollowUpTasks();
      
      setStats({
        queue: queue.filter(i => i.status === 'pending').length,
        followups: followups.length
      });

      if (followups.length > 0) {
        actions.push({ icon: Users, label: `${followups.length} Care Tasks Pending`, path: '/followup', urgency: 'high', color: 'text-red-500', bg: 'bg-red-50 border-red-100' });
      }
      const pendingQueue = queue.filter(i => i.status === 'pending');
      if (pendingQueue.length > 0) {
        actions.push({ icon: Clock, label: `${pendingQueue.length} Queue Items for Approval`, path: '/queue', urgency: 'medium', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' });
      }
      if (dayIdx === 0 || dayIdx === 6) {
        actions.push({ icon: Sparkles, label: 'Sermon Pack Not Generated', path: '/sermon', urgency: 'high', color: 'text-gold', bg: 'bg-ivory border-gold/10' });
      }
      
      // Fillers if few actions
      if (actions.length < 3) {
        actions.push({ icon: BookOpen, label: 'Explore Media Studio', path: '/media', urgency: 'low', color: 'text-navy', bg: 'bg-slate-50 border-slate-200' });
      }
    } catch { }
    setNextActions(actions.slice(0, 4));
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome */}
      <div className="relative overflow-hidden rounded-[2rem] bg-navy-dark p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <TrendingUp size={400} className="absolute -bottom-20 -right-20 transform -rotate-12" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
            <Zap size={12} className="fill-white" />
            Media Portal Core
          </div>
          <h1 className="font-display text-5xl md:text-6xl tracking-wider leading-none mb-4">
            {greeting.toUpperCase()}, <br />
            <span className="text-gold">{name.toUpperCase()}</span>
          </h1>
          <p className="text-slate-400 text-lg font-light leading-relaxed mb-8">
            Welcome to the Command Hub. Your church media operations are synced and ready for deployment.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate('/studio')} className="btn-gold px-8 py-3 command-btn flex items-center gap-2 shadow-xl shadow-gold/20 active:scale-95">
              <Sparkles size={18} />
              Quick Gen
            </button>
            <button onClick={() => navigate('/queue')} className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-xl font-display letter-spacing-1 text-sm tracking-widest uppercase transition-all backdrop-blur-sm border border-white/10 active:scale-95">
              View Queue ({stats.queue})
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Next Actions */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase text-slate-500">Best Next Actions</h2>
              <div className="h-px flex-1 bg-slate-200 mx-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nextActions.map((action, i) => (
                <motion.button
                  whileHover={{ y: -4 }}
                  key={i}
                  onClick={() => navigate(action.path)}
                  className={`p-5 rounded-2xl border flex items-center gap-4 text-left transition-all group ${action.bg}`}
                >
                  <div className={`p-3 rounded-xl bg-white shadow-sm ${action.color}`}>
                    <action.icon size={24} strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Recommended</div>
                    <div className="text-sm font-bold text-navy leading-tight">{action.label}</div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-navy transition-colors" />
                </motion.button>
              ))}
            </div>
          </section>

          {/* Today's Tasks */}
          <section className="premium-card overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-ivory/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center">
                  <LayoutDashboard size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy uppercase tracking-wider leading-none">
                    {dayData.forward ? 'Look Ahead: Prep Sunday' : "Today's Command"}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {DAYS[dayIdx]}, {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="px-3 py-1 bg-gold/10 text-gold text-[10px] font-bold rounded-lg tracking-widest uppercase">
                Active Cycle
              </div>
            </div>
            <div className="p-6 space-y-4">
              {dayData.tasks.map((task, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="mt-1">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-gold group-hover:bg-ivory transition-all cursor-pointer shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-gold opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 font-medium group-hover:text-navy transition-colors">{task}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="premium-card p-5 text-center">
              <div className="text-3xl font-display text-navy mb-1 tracking-wider">{stats.queue}</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pending Posts</div>
            </div>
            <div className="premium-card p-5 text-center">
              <div className="text-3xl font-display text-gold mb-1 tracking-wider">{stats.followups}</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Care Alerts</div>
            </div>
          </div>

          {/* Weekly Rhythm */}
          <section className="premium-card p-6">
            <div className="flex items-center gap-2 mb-6 text-navy">
              <CalendarIcon size={18} className="text-gold" />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Weekly Rhythm</h3>
            </div>
            <div className="space-y-3">
              {DAY_SHORT.map((day, i) => (
                <div 
                  key={day} 
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all ${i === dayIdx ? 'bg-navy text-white shadow-lg shadow-navy/10 scale-[1.02]' : 'bg-slate-50 text-slate-400'}`}
                >
                  <div className={`w-10 text-center font-display text-sm tracking-widest ${i === dayIdx ? 'text-gold' : 'text-slate-500'}`}>
                    {day.toUpperCase()}
                  </div>
                  <div className="h-4 w-px bg-slate-200 opacity-20" />
                  <div className="flex-1 text-[10px] font-bold uppercase tracking-widest truncate">
                    {WEEKLY_RHYTHM[i].short}
                  </div>
                  {i === dayIdx && <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />}
                </div>
              ))}
            </div>
          </section>

          {/* Media Brain Status */}
          <div className="gold-border-gradient premium-card p-6 bg-ivory/30">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                <TrendingUp size={16} />
              </div>
              <h3 className="text-xs font-bold text-navy uppercase tracking-widest">AI Brain Sync</h3>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-4">
              The church knowledge base is currently mapped for Sunday delivery. AI Engine is primed for generation.
            </p>
            <button onClick={() => navigate('/church')} className="text-[10px] font-bold text-gold uppercase tracking-widest hover:text-navy transition-colors flex items-center gap-1">
              Configure Brain <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
