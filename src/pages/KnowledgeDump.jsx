// src/pages/KnowledgeDump.jsx
import { useState, useEffect } from 'react';
import { useChurch } from '../contexts/ChurchContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { generateContent } from '../services/ai/aiService';
import { getKnowledgeDocuments, addKnowledgeDocument } from '../services/firestore/db';
import { 
  Zap, 
  Database, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  FileText, 
  Search,
  BookOpen,
  BrainCircuit,
  UploadCloud,
  ChevronRight,
  TrendingUp,
  Layout,
  History,
  Activity,
  Box,
  Fingerprint,
  HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function KnowledgeDump() {
  const [input, setInput] = useState('');
  const [resources, setResources] = useState([]);
  const [adding, setAdding] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => { load(); }, []);

  async function load() {
    try { 
      const data = await getKnowledgeDocuments();
      setResources(data); 
    } catch { 
      setResources([]);
    }
  }

  async function handleAdd() {
    if (!input.trim()) return;
    setAdding(true);
    try {
      const result = await generateContent({
        system: "Summarize this church resource for an AI knowledge base. Focus on main points. Be concise. Output in clear bullet points or a professional summary paragraph.",
        userMessage: input
      });
      await addKnowledgeDocument({ 
        preview: input.slice(0, 150), 
        fullText: input, 
        summary: result.text, 
        addedBy: user?.email,
        createdAt: new Date()
      });
      setInput('');
      showToast('✓ AI Brain Matrix Synchronized');
      await load();
    } catch { 
      showToast('Failed to add document'); 
    }
    setAdding(false);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 pt-4 px-4 leading-tight font-sans">
      {/* Neural Sync Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center shadow-lg shadow-navy/20">
              <BrainCircuit size={20} />
            </div>
            <h2 className="text-3xl font-display font-bold text-navy tracking-tighter uppercase">Intelligence Dump</h2>
          </div>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.3em] pl-1">Neural Syncing & Pastoral Knowledge Indexing</p>
        </div>
        
        <div className="flex items-center gap-10 bg-offwhite p-1 rounded-2xl border border-slate-100 pr-8">
           <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-50 shadow-sm">
             <div className="text-center px-4">
               <div className="text-2xl font-display font-bold text-navy tracking-tight">{resources.length}</div>
               <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mt-1">Total Syncs</div>
             </div>
             <div className="h-10 w-[1px] bg-slate-100" />
             <div className="text-center px-4">
                <div className="text-xl font-display font-bold text-gold tracking-tighter uppercase italic">PRIME</div>
                <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mt-1">Sync Hub</div>
             </div>
           </div>
           <div className="flex items-center gap-2 text-green-500">
              <Activity size={18} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Active Link</span>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Terminal Input Area */}
        <div className="lg:col-span-12">
          <div className="premium-card p-10 md:p-14 space-y-10 bg-white border-slate-100 shadow-2xl shadow-navy/5 relative group">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[1rem] bg-navy text-gold flex items-center justify-center shadow-lg">
                   <UploadCloud size={24} strokeWidth={1.5} />
                </div>
                <div>
                   <h3 className="text-xl font-display font-bold text-navy uppercase tracking-tight italic">Knowledge Acquisition Terminal</h3>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Source: Manual Data Transmission</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-slate-100 animate-pulse" />
                 <div className="w-3 h-3 rounded-full bg-slate-100 animate-pulse delay-75" />
                 <div className="w-3 h-3 rounded-full bg-slate-100 animate-pulse delay-150" />
              </div>
            </div>

            <div className="relative group/input z-10">
              <textarea 
                className="w-full h-80 p-10 bg-offwhite border border-slate-100 rounded-[2.5rem] outline-none focus:bg-white focus:ring-8 focus:ring-navy/5 focus:border-navy transition-all text-sm font-bold leading-relaxed resize-none shadow-inner italic"
                placeholder="Paste the raw sermon transcript, theological notes, or ministry vision document here..."
                value={input} 
                onChange={e => setInput(e.target.value)} 
              />
              {!input && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center opacity-30 group-focus-within/input:opacity-10 transition-opacity">
                   <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-200">
                     <HardDrive size={32} className="text-slate-300" />
                   </div>
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Awaiting Payload Input</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleAdd}
              disabled={adding || !input.trim()}
              className="btn-primary h-20 shadow-2xl shadow-navy/10 active:scale-[0.99] transition-all flex items-center justify-center gap-6 overflow-hidden relative group/btn disabled:opacity-40"
            >
              <div className="absolute inset-0 bg-gold translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-700 opacity-20" />
              {adding ? (
                <>
                  <RefreshCw className="animate-spin" size={24} />
                  <span className="text-[12px] font-bold tracking-[0.4em] italic">SYNCHRONIZING NEURAL PATHWAYS...</span>
                </>
              ) : (
                <>
                  <Zap size={24} className="text-gold" />
                  <span className="text-[12px] font-bold tracking-[0.4em] italic">INITIATE ARCHIVE SYNC</span>
                </>
              )}
            </button>
            
            <div className="absolute bottom-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-1000">
               <Fingerprint size={180} />
            </div>
          </div>
        </div>

        {/* Intelligence Log */}
        <div className="lg:col-span-12 space-y-8">
           <div className="flex items-center gap-4 px-1">
             <History size={18} className="text-gold" />
             <h3 className="text-[11px] font-black text-navy uppercase tracking-[0.3em] italic underline underline-offset-8 decoration-navy/10">Extraction Logistics Log ({resources.length})</h3>
           </div>
           
           <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
             <AnimatePresence mode="popLayout">
               {resources.map((r, i) => (
                 <motion.div 
                   layout
                   key={r.id}
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.05 }}
                   className="premium-card bg-white border-slate-100 group hover:shadow-2xl hover:shadow-navy/5 transition-all duration-700 overflow-hidden"
                 >
                   <div className="p-10 space-y-8 relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-offwhite flex items-center justify-center text-slate-300 group-hover:text-gold transition-colors shadow-inner">
                            <FileText size={20} strokeWidth={1.5} />
                          </div>
                          <div>
                             <div className="text-[10px] font-black text-navy uppercase tracking-widest">Archive Extraction</div>
                             <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic leading-none mt-1">Status: Verified</div>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-green-50/50 border border-green-100 flex items-center justify-center text-green-500">
                           <CheckCircle2 size={16} />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                         <p className="text-lg font-display font-bold text-navy line-clamp-1 italic tracking-tight uppercase">"{r.preview}..."</p>
                         <p className="text-[13px] text-slate-400 font-bold leading-relaxed line-clamp-4 uppercase tracking-tighter">
                           {r.summary}
                         </p>
                      </div>

                      <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Box size={14} className="text-gold" />
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Neural Impact High</span>
                         </div>
                         <button className="text-[10px] font-black text-navy hover:text-gold transition-all flex items-center gap-3 uppercase tracking-[0.2em] group/btn">
                           EXPAND DATA
                           <div className="w-8 h-8 rounded-lg bg-offwhite flex items-center justify-center group-hover/btn:bg-navy group-hover/btn:text-white transition-all">
                             <ChevronRight size={14} />
                           </div>
                         </button>
                      </div>
                      
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                         <BookOpen size={80} />
                      </div>
                   </div>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>

           {resources.length === 0 && (
              <div className="premium-card py-32 flex flex-col items-center text-center space-y-8 bg-offwhite/30 border-2 border-dashed border-slate-100">
                 <div className="w-24 h-24 rounded-[2.5rem] bg-white shadow-xl flex items-center justify-center text-slate-100">
                    <Database size={48} strokeWidth={1} />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-xl font-display font-bold text-navy uppercase italic tracking-tight">Intelligence Void</h4>
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em] max-w-sm mx-auto">AI Brain is currently at zero context. Synchronize primary pastoral data to begin.</p>
                 </div>
              </div>
           )}
        </div>
      </div>

      {/* Sync Control Footer */}
      <div className="premium-card p-12 bg-ivory/30 flex flex-col lg:flex-row items-center justify-between gap-10 border-dashed border-2 border-slate-200 relative overflow-hidden">
         <div className="flex items-center gap-8 relative z-10">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl flex-shrink-0">
               <TrendingUp size={32} className="text-gold" strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
               <h4 className="text-xl font-display font-bold text-navy uppercase italic tracking-tight leading-none">Intelligence Fidelity Guarantee</h4>
               <p className="text-[12px] font-bold text-slate-400 uppercase tracking-tighter max-w-xl">
                 All synchronized pastoral data is analyzed for semantic consistency. The AI Brain logic updates in real-time to reflect the latest theology and vision.
               </p>
            </div>
         </div>
         <button className="h-16 px-12 bg-navy text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] italic hover:bg-gold hover:text-navy transition-all shadow-2xl shadow-navy/20 active:scale-95 shrink-0 whitespace-nowrap">
            EXPORT COGNITIVE LEDGER
         </button>
         
         <div className="absolute top-0 right-0 h-full w-48 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
