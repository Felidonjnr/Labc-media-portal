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
  Filter,
  Layers,
  Search,
  ExternalLink
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
      showToast('✓ Deployment confirmed');
    } catch (err) {
      showToast('Error updating status');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Archive this piece?')) return;
    try {
      await deleteQueueItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
      showToast('Content archived');
    } catch (err) {
      showToast('Error archiving');
    }
  }

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.platform === filter;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Queue Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-navy tracking-tight">Content Queue</h2>
          <p className="text-slate-500 font-medium tracking-wide">Approved assets ready for platform broadcast.</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-navy text-white shadow-lg shadow-navy/20' : 'text-slate-400 hover:text-navy'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('whatsapp')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filter === 'whatsapp' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-slate-400 hover:text-green-600'}`}
          >
            WhatsApp
          </button>
          <button 
            onClick={() => setFilter('facebook')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filter === 'facebook' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-blue-600'}`}
          >
            Facebook
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="premium-card group overflow-hidden"
              >
                <div className="flex flex-col md:flex-row min-h-[160px]">
                  {/* Side Indicators */}
                  <div className={`w-2 md:w-4 ${item.platform === 'whatsapp' ? 'bg-green-500' : 'bg-blue-600'}`} />
                  
                  <div className="flex-1 flex flex-col p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.platform === 'whatsapp' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                          {item.platform === 'whatsapp' ? <MessageSquare size={16} /> : <Facebook size={16} />}
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                            {item.platform} Engine Build
                          </div>
                          <div className="text-sm font-bold text-navy uppercase tracking-tight">
                            {item.contentType}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-100 flex items-center gap-1.5">
                          <Clock size={12} />
                          Pending Dispatch
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-navy/80 leading-relaxed font-medium whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                      {item.text}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-green-500" />
                          Generated by {item.generatedBy?.split('@')[0]}
                        </span>
                        {item.context && (
                          <span className="flex items-center gap-1.5">
                            <Layers size={12} className="text-gold" />
                            Ref: {item.context}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => copy(item.text)}
                          className="h-10 px-4 bg-white border border-slate-200 text-navy font-bold text-[10px] uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm group/btn"
                        >
                          <Copy size={14} className="group-hover/btn:text-gold transition-colors" />
                          Copy content
                        </button>
                        <button 
                          onClick={() => handleMarkSent(item.id)}
                          className="h-10 px-4 bg-navy text-white font-bold text-[10px] uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-navy/20 group/btn"
                        >
                          <Send size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                          Deploy
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="h-10 w-10 flex items-center justify-center bg-white border border-slate-200 text-slate-300 hover:text-red-500 hover:border-red-100 transition-all rounded-lg"
                        >
                          <Trash2 size={16} />
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
              className="premium-card py-20 flex flex-col items-center justify-center text-center px-12 border-dashed border-2 bg-slate-50/30"
            >
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm ring-1 ring-slate-100">
                <Search size={28} className="text-slate-300" />
              </div>
              <h3 className="text-sm font-bold text-navy uppercase tracking-[0.2em] mb-2">Queue Clearance</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-medium">
                The content queue is currently empty. Generated assets from the Studio will appear here for final deployment.
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
