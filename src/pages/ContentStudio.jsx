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

            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <motion.div
                  whileHover={{ y: -8 }}
                  key={key}
                  onClick={() => selectCat(key)}
                  className="premium-card p-10 cursor-pointer group border-b-8 transition-all hover:shadow-2xl hover:shadow-navy/5"
                  style={{ borderBottomColor: cat.color }}
                >
                  <div className="flex justify-between items-start mb-10">
                    <div className={`w-20 h-20 rounded-[2rem] ${cat.bg} border ${cat.border} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <cat.icon size={36} style={{ color: cat.color }} />
                    </div>
                    <ArrowRightCircle size={28} className="text-slate-200 group-hover:text-gold transition-colors" />
                  </div>
                  
                  <h3 className="text-3xl font-display font-bold text-navy mb-3 tracking-tighter leading-tight">
                    {cat.label} <br /> 
                    <span className="text-slate-400">Content Studio</span>
                  </h3>
                  <p className="text-slate-500 font-medium mb-10 text-sm">
                    {cat.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {cat.types.map((t, i) => (
                      <span key={i} className="px-3 py-1.5 bg-offwhite border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {t.label}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-10 rounded-premium-lg bg-navy/5 border-2 border-dashed border-navy/5 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Autonomous Intelligence Active</p>
              <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
                Select a platform to reveal the generation workspace. All outputs are synced with active church context.
              </p>
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
              <div className="premium-card p-8 md:p-10 space-y-10 group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-gold/20" style={{ background: CATEGORIES[activeCat].color }}>
                    <CATEGORIES[activeCat].icon size={26} strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-navy tracking-tight uppercase">Control Center</h2>
                    <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Input Objective Parameters</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-navy uppercase tracking-widest flex items-center gap-2 mb-1">
                      <Layout size={14} className="text-gold" />
                      Content Strategy
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full h-14 px-5 bg-offwhite border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-navy/5 focus:border-navy outline-none transition-all text-sm font-bold text-navy appearance-none cursor-pointer"
                        value={contentType} 
                        onChange={e => setContentType(e.target.value)}
                      >
                        {CATEGORIES[activeCat].types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      <ChevronRight size={16} className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-navy uppercase tracking-widest flex items-center gap-2 mb-1">
                      <MessageSquare size={14} className="text-gold" />
                      System Overrides / Context
                    </label>
                    <div className="relative">
                      <textarea 
                        placeholder="Paste sermon summary, event details, or specific directives here..."
                        className="w-full h-56 px-6 py-5 bg-offwhite border border-slate-100 rounded-3xl focus:bg-white focus:ring-4 focus:ring-navy/5 focus:border-navy outline-none transition-all text-sm font-medium leading-relaxed resize-none shadow-inner"
                        value={context} 
                        onChange={e => setContext(e.target.value)} 
                      />
                    </div>
                  </div>

                  <button 
                    disabled={loading || !context.trim()}
                    onClick={handleGenerate}
                    className="btn-primary w-full h-16 shadow-2xl shadow-navy/20 active:scale-[0.98] disabled:opacity-40"
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div 
                          key="loading"
                          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                          <span className="tracking-[0.2em]">ENGAGING NEURAL REASONING</span>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="ready"
                          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                          className="flex items-center gap-3"
                        >
                          <Sparkles size={22} className="text-gold fill-gold/20" />
                          <span className="tracking-[0.2em]">EXECUTE GENERATION</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>

              {/* Output & Deployment */}
              <div className="space-y-8">
                {!output && !loading ? (
                  <div className="premium-card h-[600px] flex flex-col items-center justify-center text-center p-12 border-dashed border-2 border-slate-200 bg-navy/[0.02]">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-white flex items-center justify-center mb-8 shadow-xl border border-slate-100 group-hover:rotate-6 transition-transform">
                      <Cpu size={40} className="text-gold" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em] mb-4">Command Terminal Idle</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium max-w-[240px]">
                      Awaiting objective parameters. <br />Generated payload will manifest here.
                    </p>
                  </div>
                ) : loading ? (
                  <div className="premium-card h-[600px] p-10 space-y-6">
                    <div className="h-6 w-1/3 bg-slate-100 rounded-lg animate-pulse" />
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-slate-100 rounded-lg animate-pulse" />
                      <div className="h-4 w-full bg-slate-100 rounded-lg animate-pulse" />
                      <div className="h-4 w-2/3 bg-slate-100 rounded-lg animate-pulse" />
                    </div>
                    <div className="pt-10 space-y-4">
                      <div className="h-4 w-full bg-slate-100 rounded-lg animate-pulse opacity-50" />
                      <div className="h-64 w-full bg-offwhite border border-slate-100 rounded-3xl animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <div className="premium-card overflow-hidden shadow-2xl shadow-navy/5">
                      <div className="p-5 bg-navy text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={18} className="text-gold" />
                          <span className="text-[11px] font-bold tracking-[0.2em] uppercase">Verified Logic Export</span>
                        </div>
                        <button 
                          onClick={() => copy(output)}
                          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 py-2 px-4 rounded-xl transition-all active:scale-95 border border-white/10"
                        >
                          <Copy size={14} />
                          Copy Output
                        </button>
                      </div>
                      <div className="p-10 bg-ivory/40 min-h-[400px] text-[15px] leading-relaxed text-navy whitespace-pre-wrap font-bold selection:bg-gold selection:text-white">
                        {output}
                      </div>
                      <div className="p-8 border-t border-slate-100 bg-white grid grid-cols-2 gap-6">
                        <button 
                          onClick={handleSaveToQueue}
                          className="btn-gold h-14 shadow-xl shadow-gold/20"
                        >
                          <Save size={18} />
                          DEPLOY TO QUEUE
                        </button>
                        <button 
                          onClick={handleGenerate}
                          className="h-14 border-2 border-slate-100 text-slate-500 rounded-2xl font-bold text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
                        >
                          <RefreshCw size={18} />
                          RE-GENERATE
                        </button>
                      </div>
                    </div>

                    <div className="premium-card p-6 flex items-center justify-between border-slate-200/60 shadow-lg shadow-navy/5 bg-white">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                          <Zap size={20} className="fill-blue-600/10" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Generation Integrity</div>
                          <div className="text-sm font-bold text-navy">High-Fidelity Mode Active</div>
                        </div>
                      </div>
                      <div className="flex gap-1.5 items-end h-4">
                        {[0.6, 0.4, 0.9, 0.7, 1.0].map((h, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ height: 0 }}
                            animate={{ height: h * 100 + '%' }}
                            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.5, delay: i * 0.1 }}
                            className="w-1.5 bg-gold rounded-full" 
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

