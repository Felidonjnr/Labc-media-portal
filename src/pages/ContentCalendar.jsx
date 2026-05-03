// src/pages/ContentCalendar.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { getCalendarItems, addCalendarItem, updateCalendarItem } from '../services/firestore/db';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MessageSquare,
  Facebook,
  Monitor,
  LayoutGrid,
  Zap,
  Target,
  Activity,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const DEFAULT_SLOTS = {
  0: [{ type: 'Sunday Service Live', platform: 'facebook', time: '09:00 AM' }, { type: 'Sunday Recap', platform: 'whatsapp', time: '06:00 PM' }],
  1: [{ type: 'Monday Fuel Broadcast', platform: 'whatsapp', time: '06:00 AM' }],
  2: [{ type: 'Tuesday Word', platform: 'whatsapp', time: '12:00 PM' }],
  3: [{ type: 'Mid-Week Promo', platform: 'facebook', time: '10:00 AM' }],
  4: [{ type: 'Sermon Highlights', platform: 'whatsapp', time: '04:00 PM' }],
  5: [{ type: 'Weekly Fasting Charge', platform: 'whatsapp', time: '06:00 AM' }],
  6: [{ type: 'Service Teaser', platform: 'facebook', time: '05:00 PM' }],
};

export default function ContentCalendar() {
  const [calItems, setCalItems] = useState({});
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekStartStr = weekStart.toISOString().split('T')[0];

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const items = await getCalendarItems(weekStartStr);
      const grouped = {};
      items.forEach(item => {
        if (!grouped[item.dayIndex]) grouped[item.dayIndex] = [];
        grouped[item.dayIndex].push(item);
      });
      setCalItems(grouped);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function initWeek() {
    setLoading(true);
    try {
      for (let d = 0; d < 7; d++) {
        const slots = DEFAULT_SLOTS[d] || [];
        for (const slot of slots) {
          await addCalendarItem({ 
            dayIndex: d, 
            weekStart: weekStartStr, 
            ...slot, 
            status: 'pending' 
          });
        }
      }
      showToast('✓ Content Rhythm Initialized');
      await load();
    } catch (err) {
      showToast('Failed to initialize week');
    }
    setLoading(false);
  }

  async function toggleStatus(item) {
    const newStatus = item.status === 'completed' ? 'pending' : 'completed';
    try {
      await updateCalendarItem(item.id, { status: newStatus });
      await load();
      showToast(`Status: ${newStatus}`);
    } catch (err) {
      showToast('Error updating status');
    }
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook': return <Facebook size={14} />;
      case 'whatsapp': return <MessageSquare size={14} />;
      default: return <Monitor size={14} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 pt-4 px-4 leading-tight">
      {/* Calendar Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center shadow-lg shadow-navy/20">
              <CalendarIcon size={20} />
            </div>
            <h2 className="text-3xl font-display font-bold text-navy tracking-tighter uppercase">Content Rhythm</h2>
          </div>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.3em] pl-1">Master Mission Schedule for {new Date(weekStart).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {new Date(weekStart.getTime() + 6*24*60*60*1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-offwhite p-1 rounded-2xl border border-slate-100 shadow-inner">
            <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-navy hover:bg-white rounded-xl transition-all"><ChevronLeft size={20} /></button>
            <div className="px-6 text-[11px] font-black text-navy uppercase tracking-widest italic">Current Mission Week</div>
            <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-navy hover:bg-white rounded-xl transition-all"><ChevronRight size={20} /></button>
          </div>
          <button 
            onClick={initWeek}
            disabled={loading}
            className="btn-primary h-14 px-10 shadow-2xl shadow-navy/10 active:scale-95 transition-all text-[11px] font-bold tracking-[0.2em] flex items-center gap-3 disabled:opacity-50"
          >
            <Plus size={18} />
            INITIALIZE RHYTHM
          </button>
        </div>
      </div>

      {loading && Object.keys(calItems).length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          {DAYS.map(d => (
            <div key={d} className="h-[500px] bg-slate-50/50 rounded-[2rem] border border-slate-100 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-start pb-12">
          {DAYS.map((day, i) => {
            const isToday = new Date().getDay() === i;
            const items = calItems[i] || [];
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={day} 
                className={`flex flex-col min-h-[500px] rounded-[2rem] transition-all duration-500 overflow-hidden relative group
                  ${isToday ? 'bg-white ring-4 ring-gold/10 shadow-2xl shadow-gold/5 scale-105 z-10' : 'bg-white/40 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-navy/5'}
                `}
              >
                {/* Day Header */}
                <div className={`p-6 border-b flex items-center justify-between relative z-10 
                  ${isToday ? 'bg-navy border-navy text-white' : 'border-slate-50'}
                `}>
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isToday ? 'text-gold' : 'text-slate-300'}`}>
                      {SHORT_DAYS[i]}
                    </span>
                    <span className="text-lg font-display font-bold uppercase italic tracking-tight">{day}</span>
                  </div>
                  {isToday && (
                    <div className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse shadow-[0_0_12px_rgba(212,175,55,1)]" />
                  )}
                </div>

                {/* Day Items */}
                <div className="p-4 space-y-4 flex-1 relative z-10">
                  {items.map((item, idx) => (
                    <motion.button 
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      key={item.id} 
                      onClick={() => toggleStatus(item)}
                      className={`
                        w-full p-5 rounded-2xl border text-left transition-all relative overflow-hidden group/item
                        ${item.status === 'completed' 
                          ? 'bg-green-50 border-green-100 text-green-800' 
                          : 'bg-white border-slate-100 hover:border-gold hover:shadow-xl hover:shadow-navy/5'}
                      `}
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className={`p-2 rounded-xl transition-all
                          ${item.status === 'completed' ? 'bg-green-200 text-green-700' : 'bg-offwhite text-slate-400 group-hover/item:bg-navy group-hover/item:text-white'}
                        `}>
                          {getPlatformIcon(item.platform)}
                        </div>
                        <div className={`text-[9px] font-black uppercase tracking-widest italic flex items-center gap-1.5 
                          ${item.status === 'completed' ? 'text-green-500' : 'text-slate-300'}
                        `}>
                          <Clock size={10} />
                          {item.time}
                        </div>
                      </div>
                      
                      <div className={`text-[12px] font-bold leading-tight uppercase tracking-tight
                        ${item.status === 'completed' ? 'text-green-900 italic line-through opacity-70' : 'text-navy group-hover/item:text-gold'}
                      `}>
                        {item.type}
                      </div>

                      {item.status === 'completed' && (
                        <div className="absolute bottom-2 right-2">
                           <CheckCircle2 size={16} className="text-green-500" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                  
                  {items.length === 0 && (
                    <div className="h-24 flex items-center justify-center p-6 border border-dashed border-slate-100 rounded-[1.5rem] bg-offwhite/50">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No Data</span>
                    </div>
                  )}

                  <button className="w-full h-12 flex items-center justify-center rounded-[1.5rem] border border-dashed border-slate-100 text-slate-300 hover:text-navy hover:bg-white hover:border-navy hover:shadow-md transition-all active:scale-95 group/add">
                    <Plus size={18} className="group-hover/add:rotate-90 transition-transform" />
                  </button>
                </div>
                
                {isToday && (
                   <div className="absolute inset-0 bg-gold/5 pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Strategic Intelligence Footer */}
      <div className="grid md:grid-cols-3 gap-8 pt-8">
        <div className="premium-card p-10 bg-navy text-white flex items-center justify-between border-none shadow-2xl shadow-navy/20 relative group overflow-hidden">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gold">
                  <Target size={16} />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">Strategic Bandwidth</p>
            </div>
            <p className="text-4xl font-display font-bold italic tracking-tighter leading-none">{items.length || 14} DEPLOYMENTS</p>
          </div>
          <LayoutGrid size={80} className="text-gold opacity-5 absolute right-[-10px] bottom-[-10px] group-hover:scale-110 transition-transform duration-1000" />
        </div>

        <div className="premium-card p-10 bg-white flex items-center justify-between border-slate-100 shadow-2xl shadow-navy/5 group">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-offwhite border border-slate-50 flex items-center justify-center text-gold">
                  <Activity size={16} />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 italic">Rhythm Integrity</p>
            </div>
            <div className="flex items-end gap-3">
               <p className="text-4xl font-display font-bold italic tracking-tighter leading-none text-navy">65%</p>
               <span className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">+12% vs LW</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-slate-50 border-t-gold animate-spin-slow" />
        </div>

        <div className="premium-card p-10 bg-gold text-white flex items-center justify-between border-none shadow-2xl shadow-gold/20 relative group overflow-hidden">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/20 flex items-center justify-center text-white">
                  <Zap size={16} />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 italic">Critical Priority</p>
            </div>
            <p className="text-xl font-display font-bold italic tracking-tight leading-tight uppercase text-navy">Sermon Highlight Synthesis</p>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
             <History size={100} />
          </div>
        </div>
      </div>
    </div>
  );
}

