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
  History
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
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Sync Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center border border-gold/20 shadow-sm">
              <BrainCircuit size={20} />
            </div>
            <h2 className="text-3xl font-bold text-navy tracking-tight uppercase tracking-widest italic">Neural Sync Chamber</h2>
          </div>
          <p className="text-slate-500 font-medium tracking-wide">Sync sermon transcripts, articles, and pastoral notes to train the LAMP AI brain.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xl font-bold text-navy tracking-tight">{resources.length}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Syncs</div>
          </div>
          <div className="h-8 w-[1px] bg-slate-200" />
          <div className="text-center">
             <div className="text-xl font-bold text-gold tracking-tight">Prime</div>
             <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sync Level</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Input Area */}
        <div className="lg:col-span-12">
          <div className="premium-card p-8 md:p-10 space-y-8 ring-2 ring-navy/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UploadCloud size={20} className="text-gold" />
                <h3 className="text-sm font-black text-navy uppercase tracking-widest">New Intelligence Dump</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source: External Terminal</span>
            </div>

            <div className="relative group">
              <textarea 
                className="w-full h-64 p-8 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-gold/5 focus:border-gold transition-all text-sm font-medium leading-relaxed resize-none group-hover:bg-slate-50/10"
                placeholder="Paste the raw sermon transcript, theological notes, or ministry vision document here..."
                value={input} 
                onChange={e => setInput(e.target.value)} 
              />
              {!input && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
                   <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm text-slate-300">
                     <FileText size={24} />
                   </div>
                   <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Awaiting Command Input</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleAdd}
              disabled={adding || !input.trim()}
              className="w-full h-16 bg-navy text-white rounded-2xl font-bold text-xs uppercase tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-xl shadow-navy/20 disabled:opacity-50 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gold translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 opacity-10" />
              {adding ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  Synchronizing Neural Pathways...
                </>
              ) : (
                <>
                  <Zap size={20} className="text-gold" />
                  Initiate Brain Sync
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recent Syncs */}
        <div className="lg:col-span-12 space-y-4">
           <div className="flex items-center gap-3">
             <History size={16} className="text-slate-400" />
             <h3 className="text-[10px] font-black text-navy uppercase tracking-[0.2em]">Sync Intelligence Log ({resources.length})</h3>
           </div>
           
           <div className="grid sm:grid-cols-2 gap-6">
             <AnimatePresence mode="popLayout">
               {resources.map((r, i) => (
                 <motion.div 
                   layout
                   key={r.id}
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.05 }}
                   className="premium-card group hover:shadow-lg transition-all duration-500 overflow-hidden"
                 >
                   <div className="p-6 space-y-4">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-lg bg-gold/5 flex items-center justify-center text-gold border border-gold/10">
                           <FileText size={14} />
                         </div>
                         <span className="text-[10px] font-black text-navy uppercase tracking-widest">Document Insight</span>
                       </div>
                       <CheckCircle2 size={16} className="text-green-500/50 group-hover:text-green-500 transition-colors" />
                     </div>
                     
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-navy line-clamp-1 italic">"{r.preview}..."</p>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-3">
                          {r.summary}
                        </p>
                     </div>

                     <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp size={10} />
                          Intelligence Boosted
                        </div>
                        <button className="text-gold hover:text-navy transition-colors flex items-center gap-1">
                          Full View
                          <ChevronRight size={10} />
                        </button>
                     </div>
                   </div>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>

           {resources.length === 0 && (
              <div className="premium-card py-20 flex flex-col items-center text-center space-y-4 opacity-50">
                 <Database size={40} className="text-slate-200" />
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Brain is currently empty. Synchronize data to begin.</p>
              </div>
           )}
        </div>
      </div>

      {/* Sync Footer */}
      <div className="premium-card p-6 bg-ivory/50 flex flex-col sm:flex-row items-center justify-between gap-4 border-dashed border-2 border-slate-100">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <TrendingUp size={20} className="text-gold" />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-navy uppercase tracking-widest">Contextual Depth</h4>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sermon consistency is verified against current sync log.</p>
            </div>
         </div>
         <button className="h-10 px-6 bg-white border border-slate-200 text-navy rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-navy transition-all shadow-sm">
            Export Intelligence
         </button>
      </div>
    </div>
  );
}
