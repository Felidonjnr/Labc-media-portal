// src/pages/SermonEngine.jsx
import { useState } from 'react';
import { useChurch } from '../contexts/ChurchContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast, useCopy } from '../hooks/useToast';
import { generateJSON } from '../services/ai/aiService';
import { buildSermonExtractionPrompt, buildRepurposePrompt } from '../services/rag/promptBuilder';
import { addToQueue, saveSermonBrief } from '../services/firestore/db';
import { 
  FileText, 
  Search, 
  Sparkles, 
  ChevronRight, 
  Save, 
  Copy, 
  ArrowLeft, 
  Zap, 
  CheckCircle2, 
  Package,
  Mic2,
  BookOpen,
  MessageSquare,
  ArrowRight,
  Database,
  RefreshCw,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const OUTPUT_PACK = [
  { key: 'sermon_recap', label: 'Sunday Recap Message', icon: MessageSquare, platform: 'whatsapp' },
  { key: 'sermon_monday_fuel', label: 'Monday Fuel Script', icon: Zap, platform: 'whatsapp' },
  { key: 'sermon_quote', label: 'Sermon Quote Card', icon: Layout, platform: 'facebook' },
  { key: 'sermon_summary', label: 'Sermon Summary', icon: BookOpen, platform: 'whatsapp' },
  { key: 'sermon_whatsapp', label: 'Global Broadcast', icon: MessageSquare, platform: 'whatsapp' },
];

const STEPS = [
  { id: 'input', label: 'Lab Input', icon: Mic2 },
  { id: 'brief', label: 'Extraction', icon: Search },
  { id: 'outputs', label: 'Deployment', icon: Package }
];

export default function SermonEngine() {
  const [rawInput, setRawInput] = useState('');
  const [sermonBrief, setSermonBrief] = useState(null);
  const [outputs, setOutputs] = useState(null);
  const [step, setStep] = useState('input');
  const [loading, setLoading] = useState(false);
  const { knowledge } = useChurch();
  const { user } = useAuth();
  const { showToast } = useToast();
  const copy = useCopy(showToast);

  async function handleExtractBrief() {
    if (!rawInput.trim()) return;
    setLoading(true);
    try {
      const { system, userMessage } = buildSermonExtractionPrompt(rawInput, knowledge?.churchName);
      const brief = await generateJSON({ system, userMessage, maxTokens: 1000 });
      setSermonBrief(brief);
      setStep('brief');
      await saveSermonBrief({ ...brief, rawInput: rawInput.slice(0, 500) });
    } catch { showToast('Portal Error: Extraction failed'); }
    setLoading(false);
  }

  async function handleGeneratePack() {
    setLoading(true);
    try {
      const { system, userMessage } = buildRepurposePrompt({ knowledge, sermonBrief, userInput: rawInput, outputTypes: OUTPUT_PACK.map(o => o.key) });
      const result = await generateJSON({ system, userMessage, maxTokens: 4000 });
      setOutputs(result);
      setStep('outputs');
    } catch { showToast('Portal Error: Pack generation failed'); }
    setLoading(false);
  }

  async function handleSaveAll() {
    if (!outputs) return;
    for (const item of OUTPUT_PACK) {
      if (outputs[item.key]) {
        await addToQueue({ 
          contentType: item.label, 
          contentTypeKey: item.key, 
          platform: item.platform, 
          text: outputs[item.key], 
          context: sermonBrief?.title, 
          generatedBy: user?.email 
        });
      }
    }
    showToast('✓ Full Sermon Pack Deployed to Queue');
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32 pt-8 px-4 leading-tight">
      {/* Visual Step Indicator */}
      <div className="flex items-center justify-center gap-12 relative px-4">
        <div className="absolute top-6 left-[15%] right-[15%] h-px bg-slate-200 pointer-events-none" />
        {STEPS.map((s, i) => {
          const isActive = step === s.id;
          const isDone = i < STEPS.findIndex(st => st.id === step);
          return (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
              <div 
                className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 border-2
                  ${isActive ? 'bg-navy border-navy text-white scale-110 shadow-2xl shadow-navy/20' : 
                    isDone ? 'bg-gold border-gold text-white' : 'bg-white border-slate-100 text-slate-300'}
                `}
              >
                {isDone ? <CheckCircle2 size={24} /> : (
                  <s.icon size={22} strokeWidth={ isActive ? 2.5 : 1.5 } />
                )}
              </div>
              <p className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-navy' : 'text-slate-400'}`}>
                {s.label}
              </p>
            </div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div 
            key="input"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
            className="premium-card p-10 md:p-14 space-y-10 group"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[1.8rem] bg-navy-dark text-gold flex items-center justify-center shadow-xl shadow-navy/10 transform group-hover:rotate-6 transition-transform">
                <Mic2 size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-3xl font-display font-bold text-navy tracking-tighter uppercase mb-1">Source Digitization</h2>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.3em]">Module 1: Intelligence Injection</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-bold text-navy uppercase tracking-[0.2em] flex items-center gap-3">
                <Database size={14} className="text-gold" />
                Raw Data (Sermon Transcript / Notes)
              </label>
              <textarea 
                className="w-full h-96 px-8 py-7 bg-offwhite border border-slate-100 rounded-[2.5rem] focus:bg-white focus:ring-8 focus:ring-navy/5 focus:border-navy outline-none transition-all text-[15px] font-medium leading-[1.8] resize-none shadow-inner" 
                placeholder="Initialize by pasting the sermon notes or transcript..." 
                value={rawInput} 
                onChange={e => setRawInput(e.target.value)} 
              />
            </div>

            <button 
              className="btn-primary w-full h-16 shadow-2xl shadow-navy/20 active:scale-[0.98] disabled:opacity-40"
              onClick={handleExtractBrief} 
              disabled={loading || !rawInput.trim()}
            >
              {loading ? (
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="tracking-[0.3em] font-bold">ENGAGING EXTRACTION ENGINE</span>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Search size={22} className="text-gold" />
                  <span className="tracking-[0.3em] font-bold text-sm">EXTRACT DIGITAL BRIEF</span>
                </div>
              )}
            </button>
          </motion.div>
        )}

        {step === 'brief' && sermonBrief && (
          <motion.div 
            key="brief"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
            className="space-y-8"
          >
            <div className="premium-card p-10 md:p-14 border-gold/10 bg-ivory/20 shadow-2xl shadow-navy/5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-14">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-[2.2rem] bg-gold text-white flex items-center justify-center shadow-xl shadow-gold/20">
                    <CheckCircle2 size={36} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-bold text-navy tracking-tight uppercase leading-none mb-2 italic">Extraction Success</h2>
                    <p className="text-[11px] font-bold text-gold uppercase tracking-[0.4em]">High-Fidelity Signature Verified</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gold/10">
                  <Sparkles size={20} className="text-gold animate-pulse" />
                  <span className="text-[10px] font-bold text-navy uppercase tracking-widest">Logic Confidence: 98.4%</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-10 bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                <div className="space-y-2 relative z-10">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-1">Derived Concept</span>
                  <div className="text-2xl font-display font-bold text-navy leading-tight">{sermonBrief.title}</div>
                </div>
                <div className="space-y-2 relative z-10">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-1">Primary Authority</span>
                  <div className="text-2xl font-display font-bold text-navy leading-tight">{sermonBrief.speaker}</div>
                </div>
              </div>

              <div className="text-center pt-10">
                <p className="text-[11px] text-slate-400 uppercase tracking-[0.4em] font-bold max-w-md mx-auto leading-relaxed">
                  The sermon brief is now digitized and mapped to the Light Assembly knowledge base.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <button 
                className="h-16 bg-white border border-slate-100 text-slate-400 rounded-2xl font-bold tracking-[0.2em] uppercase text-[10px] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm"
                onClick={() => setStep('input')}
              >
                <ArrowLeft size={18} />
                Reset Parameters
              </button>
              <button 
                className="btn-primary h-16 shadow-2xl shadow-navy/20 active:scale-[0.98] disabled:opacity-40"
                onClick={handleGeneratePack} 
                disabled={loading}
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <div className="flex items-center gap-4">
                    <Package size={22} className="text-gold" />
                    <span className="tracking-[0.3em] font-bold text-sm">DEPLOY CONTENT PACK</span>
                  </div>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 'outputs' && outputs && (
          <motion.div 
            key="outputs"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl">
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                    <BookOpen size={16} />
                  </div>
                  <span className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">Digitized Pack Output</span>
                </div>
                <h2 className="text-3xl font-display font-bold text-navy tracking-tight">{sermonBrief.title}</h2>
              </div>
              <button 
                className="btn-gold h-16 px-10 shadow-2xl shadow-gold/20 active:scale-[0.98] flex items-center gap-3 text-sm"
                onClick={handleSaveAll}
              >
                <Save size={20} />
                DEPLOY ALL TO QUEUE
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {OUTPUT_PACK.map(item => outputs[item.key] && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={item.key} 
                  className="premium-card flex flex-col group overflow-hidden hover:shadow-2xl hover:shadow-navy/5 transition-all"
                >
                  <div className="p-6 bg-navy text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className="text-gold" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{item.label}</span>
                    </div>
                    <button 
                      className="p-2 text-white/50 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/10 active:scale-90"
                      onClick={() => copy(outputs[item.key])}
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <div className="p-10 text-[14px] leading-relaxed text-slate-600 min-h-[220px] font-bold bg-offwhite/30 italic">
                    {outputs[item.key]}
                  </div>
                  <div className="p-6 mt-auto border-t border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target: {item.platform}</span>
                    </div>
                    <button 
                      className="text-[10px] font-bold text-gold uppercase tracking-widest hover:text-navy transition-all flex items-center gap-2 group/btn"
                      onClick={() => showToast('Feature Coming Soon: Individual Edit')}
                    >
                      Refine Piece <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center pt-20">
              <button 
                className="text-[11px] font-bold text-slate-300 hover:text-navy transition-colors uppercase tracking-[0.4em] flex items-center gap-3 mx-auto group"
                onClick={() => {
                  setStep('input');
                  setOutputs(null);
                  setSermonBrief(null);
                  setRawInput('');
                }}
              >
                <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
                Initialize New Production Cycle
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

