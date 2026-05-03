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
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
  
  // Current Week logic
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
      case 'facebook': return <Facebook size={12} />;
      case 'whatsapp': return <MessageSquare size={12} />;
      default: return <Monitor size={12} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center shadow-lg shadow-navy/20">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-navy tracking-tight">Content Rhythm</h2>
            <p className="text-slate-500 font-medium text-sm">Weekly Master Schedule for {new Date(weekStart).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
            <button className="p-2 text-slate-400 hover:text-navy transition-colors"><ChevronLeft size={20} /></button>
            <span className="px-4 text-xs font-bold text-navy uppercase tracking-widest">Active Week</span>
            <button className="p-2 text-slate-400 hover:text-navy transition-colors"><ChevronRight size={20} /></button>
          </div>
          <button 
            onClick={initWeek}
            disabled={loading}
            className="h-10 px-6 bg-gold text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gold-dark transition-all shadow-xl shadow-gold/20 flex items-center gap-2 disabled:opacity-50"
          >
            <Plus size={14} />
            Initialize Rhythm
          </button>
        </div>
      </div>

      {loading && Object.keys(calItems).length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {DAYS.map(d => (
            <div key={d} className="h-96 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-start pb-12">
          {DAYS.map((day, i) => {
            const isToday = new Date().getDay() === i;
            const items = calItems[i] || [];
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={day} 
                className={`flex flex-col min-h-[400px] rounded-2xl transition-all duration-300 ${isToday ? 'bg-ivory ring-2 ring-gold/20 shadow-xl' : 'bg-white border border-slate-100 shadow-sm'}`}
              >
                {/* Day Header */}
                <div className={`p-4 border-b ${isToday ? 'border-gold/20' : 'border-slate-50'} flex items-center justify-between`}>
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isToday ? 'text-gold' : 'text-slate-400'}`}>
                      {SHORT_DAYS[i]}
                    </span>
                    <span className="text-sm font-bold text-navy">{day}</span>
                  </div>
                  {isToday && (
                    <div className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(201,150,12,0.6)]" />
                  )}
                </div>

                {/* Day Items */}
                <div className="p-2 space-y-2 flex-1">
                  {items.map((item, idx) => (
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={item.id} 
                      onClick={() => toggleStatus(item)}
                      className={`
                        w-full p-3 rounded-xl border text-left transition-all relative overflow-hidden group
                        ${item.status === 'completed' 
                          ? 'bg-green-50 border-green-100' 
                          : 'bg-white border-slate-100 hover:border-gold hover:shadow-md'}
                      `}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className={`p-1.5 rounded-lg ${item.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400 group-hover:bg-gold/10 group-hover:text-gold'}`}>
                          {getPlatformIcon(item.platform)}
                        </div>
                        <div className={`text-[9px] font-bold uppercase tracking-widest ${item.status === 'completed' ? 'text-green-500' : 'text-slate-300'}`}>
                          {item.time}
                        </div>
                      </div>
                      
                      <div className={`text-[11px] font-bold leading-tight line-clamp-2 ${item.status === 'completed' ? 'text-green-700' : 'text-navy group-hover:text-gold'}`}>
                        {item.type}
                      </div>

                      {item.status === 'completed' && (
                        <div className="absolute bottom-1 right-1">
                          <CheckCircle2 size={12} className="text-green-500" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                  
                  {items.length === 0 && (
                    <div className="h-20 flex items-center justify-center p-4 border border-dashed border-slate-100 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No Events</span>
                    </div>
                  )}

                  <button className="w-full h-10 flex items-center justify-center rounded-xl border border-dashed border-slate-200 text-slate-400 hover:text-navy hover:bg-slate-50 transition-all">
                    <Plus size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Calendar Stats Footer */}
      <div className="grid md:grid-cols-3 gap-6 pt-4">
        <div className="premium-card p-6 bg-navy text-white flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Deployments</p>
            <p className="text-2xl font-bold">14 Pieces</p>
          </div>
          <LayoutGrid size={32} className="text-gold opacity-20" />
        </div>
        <div className="premium-card p-6 bg-white flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Weekly Progress</p>
            <p className="text-2xl font-bold text-navy">65%</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-gold animate-spin-slow" />
        </div>
        <div className="premium-card p-6 border-gold/30 gold-border-gradient">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Next Critical Action</p>
            <p className="text-xl font-bold text-navy">Sermon Highlights Broadcast</p>
          </div>
        </div>
      </div>
    </div>
  );
}
