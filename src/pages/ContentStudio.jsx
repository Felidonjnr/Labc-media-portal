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
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = {
  whatsapp: { 
    label: 'WhatsApp', 
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
    <div className="max-w-6xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {!activeCat ? (
          <motion.div 
            key="categories"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-navy tracking-tight mb-2">Platform Selection</h2>
              <p className="text-slate-500">Select the objective platform for your generated content.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <motion.button
                  whileHover={{ y: -8 }}
                  key={key}
                  onClick={() => selectCat(key)}
                  className={`premium-card p-12 text-center group border-t-4 transition-all duration-300`}
                  style={{ borderTopColor: cat.color }}
                >
                  <div className={`w-20 h-20 rounded-[2.5rem] ${cat.bg} ${cat.border} border flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    {(() => {
                      const Icon = cat.icon;
                      return <Icon size={36} style={{ color: cat.color }} />;
                    })()}
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2 tracking-tight">{cat.label} Content</h3>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
                    {cat.types.length} Ready Blueprints
                  </div>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {cat.types.slice(0, 2).map((t, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 uppercase">
                        {t.label}
                      </span>
                    ))}
                    {cat.types.length > 2 && (
                      <span className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 uppercase">
                        +{cat.types.length - 2} More
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="studio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
              <button 
                onClick={() => setActiveCat(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-navy uppercase tracking-[0.2em] transition-colors"
              >
                <ChevronLeft size={16} />
                Switch Platform
              </button>
              
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white border border-slate-200`}>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 leading-none">
                    <Laptop size={12} className="text-gold" />
                    Production Room
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Generator Panel */}
              <div className="premium-card p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg`} style={{ background: CATEGORIES[activeCat].color }}>
                    {(() => {
                      const Icon = CATEGORIES[activeCat].icon;
                      return <Icon size={22} strokeWidth={2.5} />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-navy tracking-tight">{CATEGORIES[activeCat].label} Generator</h2>
                    <p className="text-xs text-slate-400 font-medium tracking-wide">Syncing with Church Knowledge Base...</p>
                  </div>
                </div>

                <div className="space-y-5 pt-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-navy uppercase tracking-widest flex items-center gap-2">
                      <Layout size={14} className="text-gold" />
                      Content Strategy
                    </label>
                    <select 
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all text-sm font-semibold text-navy appearance-none"
                      value={contentType} 
                      onChange={e => setContentType(e.target.value)}
                    >
                      {CATEGORIES[activeCat].types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-navy uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare size={14} className="text-gold" />
                      Command Input (Context)
                    </label>
                    <textarea 
                      placeholder="Paste sermon summary, event details, or specific directives here..."
                      className="w-full h-40 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all text-sm font-medium leading-relaxed resize-none"
                      value={context} 
                      onChange={e => setContext(e.target.value)} 
                    />
                  </div>

                  <button 
                    disabled={loading || !context.trim()}
                    onClick={handleGenerate}
                    className="w-full h-14 bg-navy text-white rounded-xl shadow-xl shadow-navy/20 command-btn active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 overflow-hidden relative group"
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div 
                          key="loading"
                          initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>SYNCHRONIZING AI</span>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="ready"
                          initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}
                          className="flex items-center gap-3"
                        >
                          <Sparkles size={20} className="text-gold fill-gold/20" />
                          <span>EXECUTE GENERATION</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>

              {/* Output Panel */}
              <div className="space-y-6">
                {!output && !loading ? (
                  <div className="premium-card h-[500px] flex flex-col items-center justify-center text-center p-12 border-dashed border-2 border-slate-200 bg-slate-50/50">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                      <Cpu size={32} className="text-slate-300" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Idle State</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      Configure your content strategy and context. <br />Generated results will appear here.
                    </p>
                  </div>
                ) : loading ? (
                  <div className="premium-card h-[500px] p-6 space-y-4">
                    <div className="h-4 w-1/3 bg-slate-100 rounded animate-pulse" />
                    <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                    <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
                    <div className="pt-8 h-4 w-full bg-slate-100 rounded animate-pulse shadow-sm" />
                    <div className="h-60 w-full bg-slate-50 border border-slate-100 rounded-xl" />
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="premium-card overflow-hidden">
                      <div className="p-4 bg-navy-dark text-white flex items-center justify-between border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-gold" />
                          <span className="text-[10px] font-bold tracking-widest uppercase">Verified Generation</span>
                        </div>
                        <button 
                          onClick={() => copy(output)}
                          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 py-1.5 px-3 rounded-lg transition-colors"
                        >
                          <Copy size={12} />
                          Quick Copy
                        </button>
                      </div>
                      <div className="p-6 md:p-8 bg-ivory/50 min-h-[340px] text-sm leading-relaxed text-navy whitespace-pre-wrap font-medium">
                        {output}
                      </div>
                      <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-4">
                        <button 
                          onClick={handleSaveToQueue}
                          className="h-12 bg-gold text-white rounded-xl font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-gold-dark transition-all transform active:scale-95 shadow-lg shadow-gold/20"
                        >
                          <Save size={16} />
                          Save to Queue
                        </button>
                        <button 
                          onClick={handleGenerate}
                          className="h-12 border border-slate-200 text-slate-500 rounded-xl font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-slate-50 transition-all font-display transform active:scale-95"
                        >
                          <RefreshCw size={16} />
                          Regenerate
                        </button>
                      </div>
                    </div>

                    <div className="premium-card p-4 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                          <Zap size={16} />
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          AI Confidence: <span className="text-navy">94%</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[0,1,2,3,4].map(i => <div key={i} className="w-1 h-3 rounded-full bg-gold/30" />)}
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
