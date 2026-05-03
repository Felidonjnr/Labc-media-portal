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
  ChevronRight
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
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Vault Header & Tool Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center border border-gold/10">
              <Archive size={20} />
            </div>
            <h2 className="text-3xl font-bold text-navy tracking-tight uppercase tracking-widest italic">The Content Vault</h2>
          </div>
          <p className="text-slate-500 font-medium tracking-wide">Secure archive of all historical transmissions and generated assets.</p>
        </div>
      </div>

      {/* Global Command Bar */}
      <div className="premium-card p-2 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search the vault for keywords, scriptures, or topics..."
            className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-gold/10 focus:border-gold transition-all text-sm font-medium"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-white text-navy shadow-sm border border-slate-200' : 'text-slate-400 hover:text-navy'}`}
          >
            Universal
          </button>
          <button 
            onClick={() => setFilter('whatsapp')}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'whatsapp' ? 'bg-white text-navy shadow-sm border border-slate-200' : 'text-slate-400 hover:text-navy'}`}
          >
            WhatsApp
          </button>
          <button 
            onClick={() => setFilter('facebook')}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'facebook' ? 'bg-white text-navy shadow-sm border border-slate-200' : 'text-slate-400 hover:text-navy'}`}
          >
            Facebook
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => (
              <motion.div 
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="premium-card flex flex-col group overflow-hidden border-slate-100 hover:border-gold/30 hover:shadow-xl transition-all duration-500"
              >
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${item.platform === 'whatsapp' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      {item.platform === 'whatsapp' ? <MessageSquare size={12} /> : <Facebook size={12} />}
                    </div>
                    <span className="text-[10px] font-bold text-navy uppercase tracking-widest">
                      {item.contentType}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                    <Calendar size={10} />
                    {item.sentAt?.toDate ? item.sentAt.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Archive'}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col space-y-4">
                  <p className="text-xs text-navy/70 leading-relaxed italic line-clamp-6">
                    "{item.text}"
                  </p>
                </div>

                <div className="p-4 bg-white border-t border-slate-50 flex items-center justify-between">
                  <button 
                    onClick={() => copy(item.text)}
                    className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-gold uppercase tracking-widest transition-colors"
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                  <button className="flex items-center gap-1 text-[10px] font-bold text-navy hover:text-gold uppercase tracking-widest transition-colors group/btn">
                    Repurpose
                    <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                <History size={32} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy uppercase tracking-widest">No Records Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">The search criteria did not match any items in the vault.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-center gap-4 pt-12 border-t border-slate-100">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <History size={14} />
          Total Assets in Vault: <span className="text-navy">{items.length}</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-300" />
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Last Backup: <span className="text-navy">Synchronized</span>
        </div>
      </div>
    </div>
  );
}
