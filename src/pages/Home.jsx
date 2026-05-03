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
    <div className="space-y-12 pb-32 pt-4 relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-[0.02]">
         <Activity size={800} className="absolute -top-40 -right-40 transform rotate-12" />
      </div>

      {/* Premium Hero Header */}
      <section className="relative overflow-hidden rounded-[4rem] bg-navy p-12 md:p-20 text-white shadow-[0_50px_100px_-20px_rgba(15,23,42,0.4)] border border-white/5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-20 pointer-events-none" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black tracking-[0.5em] uppercase text-gold mb-12 italic"
          >
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(212,175,55,1)]" />
            Media Command Core Online
          </motion.div>
          
          <h1 className="font-display text-5xl md:text-8xl font-bold tracking-tighter leading-none mb-8 italic uppercase">
            {greeting}, <br />
            <span className="text-gold group relative inline-block">
               {name}
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '100%' }}
                 transition={{ delay: 0.5, duration: 1 }}
                 className="absolute -bottom-2 left-0 h-2 bg-gold/20" 
               />
            </span>
          </h1>
          
          <p className="text-slate-300 text-lg md:text-2xl font-bold leading-tight max-w-3xl mb-14 uppercase italic tracking-tighter opacity-70">
            Welcome to the Command Hub. Your church media operations are synchronized with the eternal mission.
          </p>
          
          <div className="flex flex-wrap gap-6">
            <button 
              onClick={() => navigate('/studio')}
              className="btn-gold h-20 px-12 shadow-3xl shadow-gold/20 rounded-3xl text-[11px] font-black italic uppercase tracking-[0.3em] flex items-center gap-4 transition-all hover:bg-white hover:text-navy group/btn"
            >
              <PlusCircle size={24} className="group-hover:rotate-90 transition-transform" />
              Initialize Production
            </button>
            <button 
              onClick={() => navigate('/queue')}
              className="h-20 px-12 bg-white/5 hover:bg-gold text-white hover:text-navy border border-white/10 hover:border-gold rounded-3xl text-[11px] font-black italic uppercase tracking-[0.3em] transition-all backdrop-blur-md active:scale-95 flex items-center gap-4"
            >
              <LayoutDashboard size={24} />
              Transmit Queue ({stats.queue})
            </button>
          </div>
        </div>
      </section>

      {/* Stats & Briefing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content Side */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Best Next Actions */}
          <section>
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-[12px] font-black tracking-[0.5em] uppercase text-slate-400 italic whitespace-nowrap">Tactical Briefing</h2>
              <div className="h-px w-full bg-gradient-to-r from-slate-200/60 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nextActions.map((action, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate(action.path)}
                  className={`p-10 rounded-[3rem] border-none relative overflow-hidden group cursor-pointer transition-all duration-700 shadow-2xl ${action.theme} shadow-black/[0.03]`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.05] pointer-events-none group-hover:scale-150 transition-transform duration-1000">
                     <action.icon size={120} />
                  </div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-xl group-hover:rotate-12 transition-transform">
                      <action.icon size={28} strokeWidth={isActive => isConfigured ? 2.5 : 1} />
                    </div>
                    <div className="w-10 h-10 rounded-full border border-current opacity-20 flex items-center justify-center group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 block mb-2 italic">Recommended Intel</span>
                    <h3 className="text-2xl font-black tracking-tighter uppercase italic">{action.label}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Today's Focus Card */}
          <section className="premium-card overflow-hidden bg-white rounded-[4rem] border-none shadow-[0_50px_100px_-20px_rgba(15,23,42,0.06)]">
            <div className="p-12 border-b border-slate-50 bg-offwhite/50 flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gold/5 scale-150 blur-3xl rounded-full translate-x-1/2" />
              <div className="flex items-center gap-8 relative z-10">
                <div className="w-16 h-16 rounded-[2rem] bg-navy text-gold flex items-center justify-center shadow-3xl shadow-navy/20 relative group-hover:rotate-6 transition-transform">
                   <div className="absolute inset-0 bg-gold/10 animate-pulse rounded-[2rem]" />
                   <Activity size={32} strokeWidth={1} className="relative z-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-navy tracking-tighter uppercase italic leading-none mb-2">
                    {dayData.forward ? 'Strategic prep: Sunday' : "Today's Deployment"}
                  </h3>
                  <span className="text-[11px] font-black text-gold uppercase tracking-[0.5em] italic">
                    {DAYS[dayIdx].toUpperCase()} SYNC — {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="px-6 py-2 bg-green-500/10 text-green-600 text-[10px] font-black rounded-full tracking-[0.4em] uppercase border border-green-500/20 italic relative z-10">
                Mission Active
              </div>
            </div>
            <div className="p-16 grid gap-10">
              {dayData.tasks.map((task, i) => (
                <div key={i} className="flex gap-8 group items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-2xl border-2 border-slate-50 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/5 transition-all cursor-pointer shadow-sm">
                      <div className="w-3 h-3 rounded-full bg-gold opacity-0 group-hover:opacity-100 shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                    </div>
                  </div>
                  <p className="text-xl text-slate-500 font-black uppercase tracking-tight italic group-hover:text-navy transition-all leading-relaxed">{task}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Status Column */}
        <div className="lg:col-span-4 space-y-12">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-6">
            <div className="premium-card p-10 text-center group hover:bg-navy hover:text-white transition-all duration-700 bg-white rounded-[3rem] border-none shadow-2xl shadow-navy/5">
              <div className="text-6xl font-display font-medium text-navy mb-3 tracking-tighter group-hover:text-gold transition-colors italic leading-none">{stats.queue}</div>
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] italic">Queue Buffer</div>
            </div>
            <div className="premium-card p-10 text-center group hover:bg-gold transition-all duration-700 bg-white rounded-[3rem] border-none shadow-2xl shadow-navy/5">
              <div className="text-6xl font-display font-medium text-gold mb-3 tracking-tighter group-hover:text-white transition-colors italic leading-none">{stats.followups}</div>
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] italic">Care Alerts</div>
            </div>
          </div>

          {/* Weekly Rhythm Visualizer */}
          <section className="premium-card p-10 bg-white rounded-[3.5rem] border-none shadow-2xl shadow-navy/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-4 mb-10 relative z-10">
              <CalendarIcon size={24} className="text-gold" />
              <h3 className="text-xs font-black font-display uppercase tracking-[0.4em] text-navy italic">Tactical Rhythm</h3>
            </div>
            <div className="space-y-4 relative z-10">
              {DAY_SHORT.map((day, i) => (
                <div 
                  key={day} 
                  className={`flex items-center gap-6 p-5 rounded-[1.5rem] transition-all duration-700 ${i === dayIdx ? 'bg-navy text-white shadow-[0_20px_40px_-10px_rgba(15,23,42,0.4)] scale-110 border border-gold/20' : 'bg-offwhite/50 text-slate-300 hover:bg-slate-50'}`}
                >
                  <div className={`w-12 text-center font-display text-sm font-black tracking-[0.2em] italic ${i === dayIdx ? 'text-gold' : 'text-slate-200'}`}>
                    {day.toUpperCase()}
                  </div>
                  <div className={`h-6 w-px ${i === dayIdx ? 'bg-gold/20' : 'bg-slate-100'}`} />
                  <div className={`flex-1 text-[11px] font-black uppercase tracking-[0.3em] truncate italic ${i === dayIdx ? 'text-white' : 'text-slate-400 group-hover:text-navy cursor-default transition-colors'}`}>
                    {WEEKLY_RHYTHM[i].short}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AI Brain Status Widget */}
          <div className="premium-card p-10 relative overflow-hidden group bg-white rounded-[3rem] border-none shadow-2xl shadow-navy/5">
            <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-gold via-navy to-gold opacity-50" />
            <div className="flex items-center gap-6 mb-10 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gold text-white flex items-center justify-center shadow-2xl shadow-gold/30 group-hover:scale-110 transition-transform">
                <BrainCircuit size={28} />
              </div>
              <div>
                 <h3 className="text-[11px] font-black text-gold uppercase tracking-[0.4em] italic mb-1">Neural Brain Status</h3>
                 <div className="text-lg font-display font-medium text-navy italic leading-none">CONNECTED</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-10 uppercase tracking-tight italic opacity-70">
              Church knowledge base is fully mapped for Sunday delivery. AI Neural Engine is primed for execution.
            </p>
            <button 
              onClick={() => navigate('/church')}
              className="w-full h-16 bg-navy text-white rounded-2xl text-[11px] font-black italic uppercase tracking-[0.5em] hover:bg-gold hover:text-navy transition-all shadow-3xl shadow-navy/20 flex items-center justify-center gap-4 group/btn"
            >
              <Zap size={18} className="text-gold group-hover/btn:animate-ping" />
              CONFIGURE BRAIN NEXUS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

