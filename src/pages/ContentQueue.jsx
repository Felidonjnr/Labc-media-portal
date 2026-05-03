// src/pages/ContentQueue.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast, useCopy } from '../hooks/useToast';
import { getQueueItems, updateQueueItem, deleteQueueItem } from '../services/firestore/db';
import { 
  MessageSquare, 
  Facebook, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Trash2, 
  Send,
  Layers,
  Search,
  Activity,
  ArrowRight,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ContentQueue() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const { showToast } = useToast();
  const copy = useCopy(showToast);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { 
      const data = await getQueueItems();
      setItems(data); 
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleMarkSent(id) {
    try {
      await updateQueueItem(id, { status: 'sent', sentAt: new Date() });
      setItems(prev => prev.filter(i => i.id !== id));
      showToast('✓ Deployment confirmed & Logged');
    } catch (err) {
      showToast('Deployment log failed');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Scrub this item from the queue?')) return;
    try {
      await deleteQueueItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
      showToast('Record purged');
    } catch (err) {
      showToast('Purge failed');
    }
  }

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.platform === filter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 pt-4 px-4 leading-tight">
      {/* Dashboard Style Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center shadow-lg shadow-navy/20">
              <Activity size={20} />
            </div>
            <h2 className="text-3xl font-display font-bold text-navy tracking-tighter uppercase">Mission Control</h2>
          </div>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.3em] pl-1">Awaiting Deployment Authorization</p>
        </div>

        {/* Tactical Filters */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-xl shadow-navy/5 border border-slate-100">
          {[
            { id: 'all', label: 'All Operations' },
            { id: 'whatsapp', label: 'WhatsApp', color: 'text-green-600', activeBg: 'bg-green-600' },
            { id: 'facebook', label: 'Facebook', color: 'text-blue-600', activeBg: 'bg-blue-600' }
          ].map(f => (
            <button 
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`
                px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
                ${filter === f.id ? `${f.activeBg || 'bg-navy'} text-white shadow-xl` : `${f.color || 'text-slate-400'} hover:bg-slate-50`}
              `}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-48 bg-slate-100 rounded-[2.5rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="premium-card relative group overflow-hidden border-l-[12px] transition-all hover:shadow-2xl hover:shadow-navy/5"
                style={{ borderLeftColor: item.platform === 'whatsapp' ? '#16A34A' : '#1877F2' }}
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  {item.platform === 'whatsapp' ? <MessageSquare size={160} /> : <Facebook size={160} />}
                </div>

                <div className="p-8 md:p-10 relative z-10 flex flex-col md:flex-row gap-10">
                  {/* Item Metadata */}
                  <div className="md:w-64 space-y-6 shrink-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                         <Shield size={14} className="text-gold" />
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auth Protocol</span>
                      </div>
                      <h3 className="text-xl font-display font-bold text-navy tracking-tight uppercase italic">{item.contentType}</h3>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${item.platform === 'whatsapp' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.platform === 'whatsapp' ? 'bg-green-500' : 'bg-blue-600'}`} />
                        {item.platform} Broadcast
                      </div>
                    </div>

                    <div className="pt-4 space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-offwhite flex items-center justify-center">
                           <CheckCircle2 size={14} className="text-slate-400" />
                         </div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                           Built by <br />
                           <span className="text-navy">{item.generatedBy?.split('@')[0]}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-offwhite flex items-center justify-center">
                           <Clock size={14} className="text-gold" />
                         </div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                           Queued Status <br />
                           <span className="text-gold">Ready for Live</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 space-y-8">
                    <div className="p-8 bg-offwhite border border-slate-100 rounded-[2rem] shadow-inner font-bold text-[15px] leading-relaxed text-navy italic selection:bg-navy selection:text-white">
                      {item.text}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-6">
                       <div className="flex items-center gap-3">
                         {item.context && (
                            <div className="px-4 py-2 bg-navy text-white/40 text-[10px] font-bold rounded-xl uppercase tracking-widest flex items-center gap-2">
                              <Layers size={14} className="text-gold" />
                              Ref: {item.context}
                            </div>
                         )}
                       </div>

                       <div className="flex items-center gap-3">
                         <button 
                           onClick={() => copy(item.text)}
                           className="h-12 px-6 bg-white border border-slate-100 rounded-xl text-navy font-bold text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-ivory hover:shadow-lg transition-all active:scale-95"
                         >
                           <Copy size={16} className="text-slate-400" />
                           Capture Payload
                         </button>
                         <button 
                           onClick={() => handleMarkSent(item.id)}
                           className="btn-primary h-12 px-8 shadow-xl shadow-navy/20 active:scale-[0.98] group/btn"
                         >
                           <Send size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                           DEPLOY LIVE
                         </button>
                         <button 
                           onClick={() => handleDelete(item.id)}
                           className="h-12 w-12 flex items-center justify-center bg-white border border-slate-100 text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all rounded-xl active:scale-90"
                         >
                           <Trash2 size={18} />
                         </button>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="premium-card py-28 flex flex-col items-center justify-center text-center px-12 border-dashed border-2 border-slate-200 bg-offwhite/50"
            >
              <div className="w-24 h-24 rounded-[2.5rem] bg-white flex items-center justify-center mb-8 shadow-xl border border-slate-100">
                <Shield size={40} className="text-gold opacity-30" />
              </div>
              <h3 className="text-sm font-bold text-navy uppercase tracking-[0.4em] mb-4">Command Deck Cleared</h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-bold uppercase tracking-widest">
                0 Pending deployments detected. <br />Engage the Production Studio to manifest new assets.
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

