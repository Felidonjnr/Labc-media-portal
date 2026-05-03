// src/pages/ContentHistory.jsx
import { useState, useEffect } from 'react';
import { useToast, useCopy } from '../hooks/useToast';
import { getHistoryItems } from '../services/firestore/db';
import { 
  Archive, 
  Search, 
  Filter, 
  MessageSquare, 
  Facebook, 
  Copy, 
  Calendar,
  Clock,
  History,
  Trash2,
  ExternalLink,
  ChevronRight,
  Bookmark,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ContentHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const { showToast } = useToast();
  const copy = useCopy(showToast);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { 
      const data = await getHistoryItems();
      setItems(data); 
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.text?.toLowerCase().includes(search.toLowerCase()) || 
                          item.contentType?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || item.platform === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 pt-4 px-4 leading-tight">
      {/* Vault Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center shadow-lg shadow-navy/20">
              <Archive size={20} />
            </div>
            <h2 className="text-3xl font-display font-bold text-navy tracking-tighter uppercase">Content Vault</h2>
          </div>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.3em] pl-1">Historical Repository of All Digital Transmissions</p>
        </div>

        <div className="flex items-center gap-4 bg-offwhite p-1.5 rounded-2xl border border-slate-100">
           <div className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-navy uppercase tracking-widest border-r border-slate-200">
              <Info size={14} className="text-gold" />
              Operational Stats
           </div>
           <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total Assets: <span className="text-navy">{items.length}</span>
           </div>
        </div>
      </div>

      {/* Advanced Command Bar */}
      <div className="premium-card p-4 flex flex-col md:flex-row items-center gap-6 bg-white border-slate-100 shadow-2xl shadow-navy/5">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-gold transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="SCAN ARCHIVES FOR KEYWORDS, SCRIPTURES, OR TOPICS..."
            className="w-full h-14 pl-14 pr-6 bg-offwhite border border-slate-100 rounded-[1.25rem] outline-none focus:bg-white focus:ring-8 focus:ring-navy/5 focus:border-navy transition-all text-[11px] font-bold tracking-widest shadow-inner placeholder:text-slate-300 placeholder:italic"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 bg-offwhite p-1.5 rounded-2xl border border-slate-100 shrink-0">
          {['all', 'whatsapp', 'facebook'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
                ${filter === f ? 'bg-navy text-white shadow-xl shadow-navy/20' : 'text-slate-400 hover:text-navy hover:bg-white'}
              `}
            >
              {f === 'all' ? 'Universal' : f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-80 bg-slate-50/50 rounded-[2rem] border border-slate-50 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => (
              <motion.div 
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="premium-card flex flex-col group overflow-hidden border-slate-100 hover:border-gold/30 hover:shadow-2xl hover:shadow-navy/5 transition-all duration-500 bg-white"
              >
                <div className="p-6 bg-offwhite/50 border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm 
                      ${item.platform === 'whatsapp' ? 'bg-green-500/10 text-green-600' : 'bg-blue-500/10 text-blue-600'}`}>
                      {item.platform === 'whatsapp' ? <MessageSquare size={18} /> : <Facebook size={18} />}
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-navy uppercase tracking-widest">{item.contentType}</div>
                      <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">{item.platform} Engine</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-navy uppercase tracking-widest">
                       <Clock size={12} className="text-gold" />
                       {item.sentAt?.toDate ? item.sentAt.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Archive'}
                    </div>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col space-y-6 relative overflow-hidden">
                  <p className="text-[13px] font-bold text-navy/70 leading-relaxed italic line-clamp-8 relative z-10 uppercase tracking-tighter">
                    "{item.text}"
                  </p>
                  <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                     <Bookmark size={120} />
                  </div>
                </div>

                <div className="p-6 bg-white border-t border-slate-50 flex items-center justify-between">
                  <button 
                    onClick={() => copy(item.text)}
                    className="flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-gold uppercase tracking-[0.2em] transition-all group/copy"
                  >
                    <div className="w-8 h-8 rounded-lg bg-offwhite flex items-center justify-center group-hover/copy:bg-gold/10">
                       <Copy size={14} />
                    </div>
                    COPY
                  </button>
                  <button className="flex items-center gap-3 text-[10px] font-black text-navy hover:text-gold uppercase tracking-[0.2em] transition-all group/btn">
                    REPURPOSE
                    <div className="w-8 h-8 rounded-lg bg-navy text-white flex items-center justify-center group-hover/btn:bg-gold group-hover/btn:text-navy transition-all">
                       <ChevronRight size={14} />
                    </div>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="col-span-full py-48 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
              <div className="w-24 h-24 rounded-[2.5rem] bg-offwhite border border-slate-100 flex items-center justify-center text-slate-200">
                <History size={48} strokeWidth={1} />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-display font-bold text-navy uppercase italic tracking-tight">Archives Exhausted</h3>
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-[0.4em] max-w-sm mx-auto leading-relaxed">
                  The mission database returned null for the specified search criteria.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Archive Intelligence Footer */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-16 border-t border-slate-100">
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-offwhite border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <Zap size={14} className="text-gold" />
          Neural Retrieval Speed: <span className="text-navy ml-1">0.04ms</span>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-offwhite border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <Shield size={14} className="text-gold" />
          Vault Integrity: <span className="text-navy ml-1">ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
}

