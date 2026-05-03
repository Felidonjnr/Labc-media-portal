// src/pages/ContentStudio.jsx
import { useState } from 'react';
import { useChurch } from '../contexts/ChurchContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast, useCopy } from '../hooks/useToast';
import { generateContent } from '../services/ai/aiService';
import { buildPrompt } from '../services/rag/promptBuilder';
import { addToQueue, logPromptRun } from '../services/firestore/db';
import { 
  MessageSquare, 
  Facebook, 
  ChevronLeft, 
  Sparkles, 
  Save, 
  RefreshCw, 
  Copy, 
  Zap, 
  Cpu, 
  Layout, 
  Laptop,
  CheckCircle2,
  ChevronRight,
  ArrowRightCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = {
  whatsapp: { 
    label: 'WhatsApp', 
    description: 'Broadcasts, Fuel Scripts, Recaps',
    icon: MessageSquare,
    color: '#16A34A', 
    bg: 'bg-green-50', 
    border: 'border-green-100',
    types: [
      { value: 'sunday_recap', label: 'Sunday Recap Message' },
      { value: 'monday_fuel', label: 'Monday Fuel Script' },
      { value: 'word_today', label: 'The Word Today Broadcast' },
    ]
  },
  facebook: { 
    label: 'Facebook', 
    description: 'Quote Cards, Promos, Teasers',
    icon: Facebook,
    color: '#1877F2', 
    bg: 'bg-blue-50', 
    border: 'border-blue-100',
    types: [
      { value: 'quote_card', label: 'Sermon Quote Card Copy' },
      { value: 'saturday_teaser', label: 'Saturday Service Teaser' },
      { value: 'programme_promo', label: 'Mid-Week Promo' },
    ]
  },
};

export default function ContentStudio() {
  const [activeCat, setActiveCat] = useState(null);
  const [contentType, setContentType] = useState('');
  const [context, setContext] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const { knowledge } = useChurch();
  const { user } = useAuth();
  const { showToast } = useToast();
  const copy = useCopy(showToast);

  function selectCat(cat) {
    setActiveCat(cat);
    setContentType(CATEGORIES[cat].types[0].value);
    setContext('');
    setOutput('');
  }

  async function handleGenerate() {
    if (!context.trim()) return;
    setLoading(true);
    try {
      const { system, userMessage } = buildPrompt({ contentType, knowledge, userInput: context });
      const result = await generateContent({ system, userMessage, useRefinement: true });
      setOutput(result.text);
      await logPromptRun({ taskType: contentType, provider: result.provider, score: result.score, userId: user?.uid });
    } catch { showToast('Portal Error: Generation failed'); }
    setLoading(false);
  }

  async function handleSaveToQueue() {
    if (!output) return;
    const cat = CATEGORIES[activeCat];
    const typeLabel = cat.types.find(t => t.value === contentType)?.label;
    await addToQueue({ 
      contentType: typeLabel, 
      contentTypeKey: contentType, 
      platform: activeCat, 
      text: output, 
      context: context.slice(0, 100), 
      generatedBy: user?.email 
    });
    showToast('✓ Deployed to Content Queue');
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 md:px-0 mt-4 md:mt-8 leading-tight">
      <AnimatePresence mode="wait">
        {!activeCat ? (
          <motion.div 
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-px bg-slate-200" />
              <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-slate-400">Target Platforms</h2>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {Object.entries(CATEGORIES).map(([key, cat]) => {
                const CategoryIcon = cat.icon;
                return (
                  <motion.div
                    whileHover={{ y: -12, scale: 1.02 }}
                    key={key}
                    onClick={() => selectCat(key)}
                    className="premium-card p-12 cursor-pointer group border-b-8 transition-all hover:shadow-3xl hover:shadow-navy/10 bg-white"
                    style={{ borderBottomColor: cat.color }}
                  >
                    <div className="flex justify-between items-start mb-12">
                      <div className={`w-24 h-24 rounded-[2.5rem] ${cat.bg} border ${cat.border} flex items-center justify-center group-hover:shadow-xl transition-all duration-500`}>
                        <CategoryIcon size={44} style={{ color: cat.color }} strokeWidth={1.5} />
                      </div>
                      <div className="w-12 h-12 rounded-full bg-offwhite flex items-center justify-center text-slate-300 group-hover:bg-gold group-hover:text-navy transition-all duration-500">
                        <ArrowRightCircle size={24} />
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-12">
                      <h3 className="text-4xl font-display font-bold text-navy tracking-tighter leading-none italic uppercase">
                        {cat.label} <br /> 
                        <span className="text-slate-200">ENGINE</span>
                      </h3>
                      <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[11px]">
                        {cat.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {cat.types.map((t, i) => (
                        <span key={i} className="px-4 py-2 bg-offwhite border border-slate-100 rounded-xl text-[9px] font-black text-navy uppercase tracking-widest group-hover:bg-white transition-colors">
                          {t.label}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="p-14 rounded-[3rem] bg-navy text-white text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
              <div className="relative z-10">
                <p className="text-[11px] font-black text-gold uppercase tracking-[0.5em] mb-6 italic">Neural Transmission Protocol Active</p>
                <p className="text-lg text-white/70 font-display font-bold italic tracking-tight max-w-2xl mx-auto uppercase">
                  Select a distribution node to initialize the generation sequence. All transmissions are anchored to the church core knowledge base.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                <Zap size={200} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="studio"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            {/* Header / Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-8">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setActiveCat(null)}
                  className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-navy hover:shadow-lg transition-all active:scale-90 shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">Workspace</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">{CATEGORIES[activeCat].label}</span>
                  </div>
                  <h2 className="text-2xl font-display font-bold text-navy tracking-tight uppercase">Production Room</h2>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-white border border-slate-100 rounded-xl flex items-center gap-3 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                  <span className="text-[10px] font-bold text-navy uppercase tracking-widest">Neural Link Sync: 100%</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-start">
              {/* Generator Panel */}
              <div className="premium-card p-10 md:p-14 space-y-12 bg-white border-slate-100 shadow-2xl shadow-navy/5 relative overflow-hidden group">
                {(() => {
                  const CategoryIcon = CATEGORIES[activeCat].icon;
                  return (
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-navy/20 relative overflow-hidden" style={{ background: CATEGORIES[activeCat].color }}>
                        <div className="absolute inset-0 bg-white/10 animate-pulse" />
                        <CategoryIcon size={32} strokeWidth={2} className="relative z-10" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-display font-bold text-navy tracking-tight uppercase italic leading-none">Command Hub</h2>
                        <p className="text-[10px] font-black text-slate-300 tracking-[0.3em] uppercase italic mt-1">Configure Mission Parameters</p>
                      </div>
                    </div>
                  );
                })()}

                <div className="space-y-10 relative z-10">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-navy uppercase tracking-[0.3em] flex items-center gap-3 italic">
                      <div className="w-8 h-8 rounded-lg bg-offwhite flex items-center justify-center text-gold shadow-inner">
                        <Layout size={14} />
                      </div>
                      Mission Objective
                    </label>
                    <div className="relative group/select">
                      <select 
                        className="w-full h-16 px-8 bg-offwhite border border-slate-100 rounded-[1.25rem] focus:bg-white focus:ring-8 focus:ring-navy/5 focus:border-navy outline-none transition-all text-[13px] font-bold text-navy appearance-none cursor-pointer uppercase tracking-widest shadow-inner italic"
                        value={contentType} 
                        onChange={e => setContentType(e.target.value)}
                      >
                        {CATEGORIES[activeCat].types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within/select:rotate-180 transition-transform duration-500">
                        <ChevronRight size={18} className="rotate-90 text-slate-300" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-navy uppercase tracking-[0.3em] flex items-center gap-3 italic">
                      <div className="w-8 h-8 rounded-lg bg-offwhite flex items-center justify-center text-gold shadow-inner">
                        <MessageSquare size={14} />
                      </div>
                      Neural Payload
                    </label>
                    <div className="relative group/textarea">
                      <textarea 
                        placeholder="PASTE THE SACRED SCRIPTURES, SERMON EXCERPTS, OR VISION DOCUMENTS HERE..."
                        className="w-full h-72 px-8 py-8 bg-offwhite border border-slate-100 rounded-[2rem] focus:bg-white focus:ring-8 focus:ring-navy/5 focus:border-navy outline-none transition-all text-sm font-bold leading-relaxed resize-none shadow-inner italic placeholder:text-slate-200 placeholder:tracking-widest"
                        value={context} 
                        onChange={e => setContext(e.target.value)} 
                      />
                      <div className="absolute top-8 right-8 pointer-events-none opacity-5">
                         <Sparkles size={40} className="text-navy" />
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={loading || !context.trim()}
                    onClick={handleGenerate}
                    className="btn-primary w-full h-20 shadow-3xl shadow-navy/10 active:scale-[0.98] disabled:opacity-40 relative group/submit overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gold translate-x-[-100%] group-hover/submit:translate-x-0 transition-transform duration-700 opacity-20" />
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div 
                          key="loading"
                          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                          className="flex items-center gap-4 relative z-10"
                        >
                          <RefreshCw className="animate-spin text-gold" size={24} />
                          <span className="text-[12px] font-black tracking-[0.4em] italic">ENGAGING COGNITIVE REASONING</span>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="ready"
                          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                          className="flex items-center gap-4 relative z-10"
                        >
                          <Zap size={24} className="text-gold" />
                          <span className="text-[12px] font-black tracking-[0.4em] italic text-white">EXECUTE TRANSMISSION</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
                
                <div className="absolute -bottom-20 -left-20 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-[2000ms]">
                   <Laptop size={400} />
                </div>
              </div>

              {/* Output & Deployment */}
              <div className="space-y-10">
                {!output && !loading ? (
                  <div className="premium-card h-[750px] flex flex-col items-center justify-center text-center p-16 border-dashed border-4 border-slate-100 bg-offwhite/30 rounded-[3rem]">
                    <div className="w-32 h-32 rounded-[3.5rem] bg-white flex items-center justify-center mb-10 shadow-2xl border border-slate-50 relative group">
                      <div className="absolute inset-0 bg-gold/5 rounded-[3.5rem] animate-pulse" />
                      <Cpu size={56} className="text-slate-100 relative z-10" strokeWidth={1} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-display font-bold text-navy uppercase italic tracking-tighter">Transmission Void</h3>
                      <p className="text-[11px] text-slate-300 font-black uppercase tracking-[0.5em] max-w-[280px] mx-auto leading-relaxed">
                        Awaiting neural directives. Generated payload will manifest within this terminal.
                      </p>
                    </div>
                  </div>
                ) : loading ? (
                  <div className="premium-card h-[750px] p-14 space-y-10 bg-white border-slate-100 rounded-[3rem]">
                    <div className="flex items-center gap-4">
                       <div className="w-4 h-4 bg-gold rounded-full animate-ping" />
                       <div className="h-6 w-1/2 bg-slate-50 rounded-xl animate-pulse" />
                    </div>
                    <div className="space-y-6">
                      <div className="h-4 w-full bg-slate-50 rounded-xl animate-pulse" />
                      <div className="h-4 w-full bg-slate-50 rounded-xl animate-pulse delay-75" />
                      <div className="h-4 w-3/4 bg-slate-50 rounded-xl animate-pulse delay-150" />
                    </div>
                    <div className="pt-16 space-y-8">
                      <div className="h-80 w-full bg-offwhite border border-slate-50 rounded-[2.5rem] animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-10"
                  >
                    <div className="premium-card overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.1)] border-none rounded-[3rem] bg-white">
                      <div className="p-8 bg-navy text-white flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center text-gold border border-gold/20">
                             <CheckCircle2 size={24} />
                          </div>
                          <div>
                             <span className="text-[10px] font-black tracking-[0.3em] uppercase italic text-gold">Validated Neural Export</span>
                             <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">Conf: 98.4% Integrity</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => copy(output)}
                          className="flex items-center gap-3 h-12 px-6 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10 active:scale-95 group/copy"
                        >
                          <Copy size={16} className="group-hover:text-gold transition-colors" />
                          COPY PAYLOAD
                        </button>
                      </div>
                      
                      <div className="p-14 bg-offwhite/20 min-h-[500px] relative overflow-hidden group/text">
                        <div className="relative z-10 text-[15px] leading-relaxed text-navy whitespace-pre-wrap font-bold selection:bg-gold selection:text-white uppercase tracking-tight italic">
                          {output}
                        </div>
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/text:scale-110 transition-transform duration-1000">
                           <Layout size={200} />
                        </div>
                      </div>

                      <div className="p-10 border-t border-slate-50 bg-white grid sm:grid-cols-2 gap-8">
                        <button 
                          onClick={handleSaveToQueue}
                          className="btn-gold h-16 shadow-2xl shadow-gold/20 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase italic flex items-center justify-center gap-4 transition-all hover:bg-navy hover:text-white hover:shadow-navy/20 active:scale-95"
                        >
                          <Save size={20} />
                          COMMIT TO QUEUE
                        </button>
                        <button 
                          onClick={handleGenerate}
                          className="h-16 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase italic flex items-center justify-center gap-4 hover:border-navy hover:text-navy transition-all active:scale-95"
                        >
                          <RefreshCw size={20} />
                          RE-INITIALIZE
                        </button>
                      </div>
                    </div>

                    <div className="premium-card p-10 flex items-center justify-between border-slate-200/60 shadow-2xl shadow-navy/5 bg-white rounded-[2.5rem] relative overflow-hidden group">
                      <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-inner">
                          <Zap size={28} className="fill-blue-600/10" />
                        </div>
                        <div>
                          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Generation Logic Integrity</div>
                          <div className="text-lg font-display font-bold text-navy italic">HIGH-FIDELITY COGNITION ACTIVE</div>
                        </div>
                      </div>
                      <div className="flex gap-2 items-end h-8 relative z-10">
                        {[0.6, 0.4, 0.9, 0.7, 1.0].map((h, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ height: 0 }}
                            animate={{ height: h * 100 + '%' }}
                            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.5, delay: i * 0.1 }}
                            className="w-2 bg-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)]" 
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

