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
  Zap, 
  TrendingUp,
  LayoutDashboard,
  BrainCircuit,
  PlusCircle,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'motion/react';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_TASKS = {
  0: { tasks: ['Record today\'s service', 'Go live on Facebook', 'Generate Sunday Recap tonight', 'Log visitors in Follow-Up'], forward: false },
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
  const name = userProfile?.fullName?.split(' ')[0] || 'Team Member';
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
        actions.push({ icon: Users, label: `${followups.length} Care Tasks`, path: '/followup', urgency: 'high', theme: 'bg-red-50 text-red-600 border-red-100' });
      }
      const pendingQueue = queue.filter(i => i.status === 'pending');
      if (pendingQueue.length > 0) {
        actions.push({ icon: Clock, label: `${pendingQueue.length} Approval Pending`, path: '/queue', urgency: 'medium', theme: 'bg-gold-light/40 text-gold border-gold/10' });
      }
      if (dayIdx === 0 || dayIdx === 6) {
        actions.push({ icon: Sparkles, label: 'Generate Sermon Pack', path: '/sermon', urgency: 'high', theme: 'bg-navy text-white border-navy-dark' });
      }
      
      if (actions.length < 4) {
        actions.push({ icon: PlusCircle, label: 'New Content Creation', path: '/studio', urgency: 'low', theme: 'bg-slate-50 text-slate-500 border-slate-100' });
      }
    } catch (err) {
      console.error(err);
    }
    setNextActions(actions.slice(0, 4));
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Premium Hero Header */}
      <section className="relative overflow-hidden rounded-premium-lg bg-navy p-10 md:p-14 text-white shadow-2xl shadow-navy/20">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <Activity size={400} className="absolute -bottom-20 -right-20 transform -rotate-12" />
        </div>
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/20 border border-gold/20 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-gold mb-8"
          >
            <Zap size={12} className="fill-gold" />
            Media Command Core Online
          </motion.div>
          
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            {greeting}, <br />
            <span className="text-gold italic">{name}</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-10">
            Welcome to the Command Hub. Your church media operations are synced and ready for deployment.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/studio')}
              className="btn-gold h-14 px-10 shadow-xl shadow-gold/20"
            >
              <PlusCircle size={20} />
              Quick Gen
            </button>
            <button 
              onClick={() => navigate('/queue')}
              className="h-14 px-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-sm tracking-widest uppercase transition-all backdrop-blur-md active:scale-95"
            >
              View Queue ({stats.queue})
            </button>
          </div>
        </div>
      </section>

      {/* Stats & Briefing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Side */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Best Next Actions */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase text-slate-500 whitespace-nowrap">Command Briefing</h2>
              <div className="h-px w-full bg-slate-200/60" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nextActions.map((action, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(action.path)}
                  className={`p-6 rounded-premium border relative overflow-hidden group cursor-pointer transition-all ${action.theme}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                      <action.icon size={24} strokeWidth={1.5} />
                    </div>
                    <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 block mb-1">Recommended Action</span>
                    <h3 className="text-lg font-bold tracking-tight">{action.label}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Today's Focus Card */}
          <section className="premium-card overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-offwhite flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-navy text-gold flex items-center justify-center shadow-lg shadow-navy/20">
                  <LayoutDashboard size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy tracking-tight uppercase">
                    {dayData.forward ? 'Strategic prep: Sunday' : "Today's Deployment"}
                  </h3>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {DAYS[dayIdx].toUpperCase()}, {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="px-4 py-1.5 bg-green-500/10 text-green-600 text-[10px] font-bold rounded-full tracking-[0.2em] uppercase border border-green-500/10">
                Live Status
              </div>
            </div>
            <div className="p-8 grid gap-6">
              {dayData.tasks.map((task, i) => (
                <div key={i} className="flex gap-5 group items-start">
                  <div className="mt-1 flex-shrink-0">
                    <div className="w-6 h-6 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:border-gold group-hover:bg-gold-light/20 transition-all cursor-pointer">
                      <div className="w-2 h-2 rounded-full bg-gold opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>
                  <p className="text-base text-slate-600 font-medium group-hover:text-navy transition-colors pt-0.5">{task}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Status Column */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="premium-card p-6 text-center group hover:bg-gold-light/10">
              <div className="text-4xl font-display font-bold text-navy mb-2 tracking-tighter group-hover:scale-110 transition-transform">{stats.queue}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Queue Items</div>
            </div>
            <div className="premium-card p-6 text-center group hover:bg-gold-light/10">
              <div className="text-4xl font-display font-bold text-gold mb-2 tracking-tighter group-hover:scale-110 transition-transform">{stats.followups}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Care Alerts</div>
            </div>
          </div>

          {/* Weekly Rhythm Visualizer */}
          <section className="premium-card p-8">
            <div className="flex items-center gap-3 mb-8">
              <CalendarIcon size={20} className="text-gold" />
              <h3 className="text-xs font-bold font-display uppercase tracking-[0.2em] text-navy">Weekly Rhythm</h3>
            </div>
            <div className="space-y-3">
              {DAY_SHORT.map((day, i) => (
                <div 
                  key={day} 
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${i === dayIdx ? 'bg-navy text-white shadow-xl shadow-navy/20 scale-[1.05]' : 'bg-offwhite text-slate-400 hover:bg-slate-100'}`}
                >
                  <div className={`w-10 text-center font-display text-sm font-bold tracking-widest ${i === dayIdx ? 'text-gold' : 'text-slate-400'}`}>
                    {day.toUpperCase()}
                  </div>
                  <div className={`h-4 w-px ${i === dayIdx ? 'bg-white/20' : 'bg-slate-200'}`} />
                  <div className={`flex-1 text-[11px] font-bold uppercase tracking-widest truncate ${i === dayIdx ? 'text-white' : 'text-slate-500'}`}>
                    {WEEKLY_RHYTHM[i].short}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AI Brain Status Widget */}
          <div className="premium-card-accent p-8 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-all" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gold text-white flex items-center justify-center shadow-lg shadow-gold/20">
                <BrainCircuit size={22} />
              </div>
              <h3 className="text-xs font-bold text-navy uppercase tracking-widest">Neural Link</h3>
            </div>
            <p className="text-xs text-slate-500 font-bold leading-relaxed mb-6 uppercase tracking-wider">
              Church knowledge is mapped for Sunday delivery. AI Engine is primed.
            </p>
            <button 
              onClick={() => navigate('/church')}
              className="w-full py-4 bg-white border border-gold/20 rounded-xl text-[10px] font-bold text-gold uppercase tracking-[0.2em] hover:bg-gold hover:text-white transition-all shadow-sm"
            >
              Configure Brain Nexus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

