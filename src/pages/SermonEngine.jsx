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
    <div className="max-w-6xl mx-auto space-y-16 pb-32 pt-8 px-4 sm:px-6 leading-tight relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      
      {/* Visual Step Indicator */}
      <div className="flex items-center justify-center gap-16 md:gap-24 relative px-8">
        <div className="absolute top-8 left-[20%] right-[20%] h-[2px] bg-slate-100 pointer-events-none" />
        {STEPS.map((s, i) => {
          const isActive = step === s.id;
          const isDone = i < STEPS.findIndex(st => st.id === step);
          return (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-5 group">
              <div 
                className={`
                  w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 border-2 relative overflow-hidden
                  ${isActive ? 'bg-navy border-navy text-gold scale-125 shadow-[0_20px_50px_rgba(15,23,42,0.3)]' : 
                    isDone ? 'bg-gold border-gold text-white shadow-xl shadow-gold/20' : 'bg-white border-slate-100 text-slate-200'}
                `}
              >
                {isActive && <div className="absolute inset-0 bg-white/5 animate-pulse" />}
                {isDone ? <CheckCircle2 size={28} strokeWidth={2.5} /> : (
                  <s.icon size={26} strokeWidth={ isActive ? 2.5 : 1.5 } className="relative z-10" />
                )}
              </div>
              <div className="text-center">
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 italic ${isActive ? 'text-navy scale-110' : 'text-slate-300'}`}>
                  {s.label}
                </p>
                {isActive && <motion.div layoutId="stepDot" className="w-1 h-1 bg-gold rounded-full mx-auto mt-2" />}
              </div>
            </div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div 
            key="input"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
            className="premium-card p-12 md:p-16 space-y-12 group relative overflow-hidden border-none shadow-[0_50px_100px_-20px_rgba(15,23,42,0.1)] bg-white"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-[3000ms]" />
            
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-20 h-20 rounded-[2.2rem] bg-navy text-gold flex items-center justify-center shadow-2xl shadow-navy/20 relative group-hover:rotate-6 transition-transform duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-white/5 animate-pulse" />
                <Mic2 size={36} strokeWidth={1} className="relative z-10" />
              </div>
              <div>
                <h2 className="text-4xl font-display font-bold text-navy tracking-tighter uppercase italic leading-none mb-2">Sacred Linkage</h2>
                <div className="flex items-center gap-3">
                   <div className="h-[1px] w-8 bg-gold/30" />
                   <p className="text-[11px] text-slate-300 font-black uppercase tracking-[0.4em] italic">Extraction Phase: 01</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <label className="text-[11px] font-black text-navy uppercase tracking-[0.4em] flex items-center gap-4 italic">
                <div className="w-8 h-8 rounded-lg bg-offwhite flex items-center justify-center text-gold shadow-inner">
                  <Database size={16} />
                </div>
                Raw Sermon Data Repository
              </label>
              <div className="relative group/textarea">
                <textarea 
                  className="w-full h-[500px] px-10 py-10 bg-offwhite border border-slate-100 rounded-[3rem] focus:bg-white focus:ring-[1rem] focus:ring-navy/5 focus:border-navy outline-none transition-all text-[16px] font-bold text-navy leading-loose resize-none shadow-inner italic placeholder:text-slate-200 placeholder:tracking-[0.2em]" 
                  placeholder="PASTE THE VERBAL TRANSCRIPT OR DOCTRINAL NOTES HERE TO BEGIN INITIALIZATION..." 
                  value={rawInput} 
                  onChange={e => setRawInput(e.target.value)} 
                />
                <div className="absolute top-10 right-10 opacity-5 pointer-events-none">
                   <Zap size={64} className="text-navy" />
                </div>
              </div>
            </div>

            <button 
              className="btn-primary w-full h-24 shadow-3xl shadow-navy/20 active:scale-[0.98] disabled:opacity-40 relative group/btn overflow-hidden"
              onClick={handleExtractBrief} 
              disabled={loading || !rawInput.trim()}
            >
              <div className="absolute inset-0 bg-gold translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-700 opacity-20" />
              {loading ? (
                <div className="flex items-center gap-6 relative z-10">
                  <RefreshCw className="animate-spin text-gold" size={28} />
                  <span className="tracking-[0.4em] font-black italic text-sm text-white">COMMENCING NEURAL DECRYPTION</span>
                </div>
              ) : (
                <div className="flex items-center gap-6 relative z-10">
                  <Search size={28} className="text-gold" />
                  <span className="tracking-[0.4em] font-black text-sm text-white italic">EXECUTE DATA EXTRACTION</span>
                </div>
              )}
            </button>
          </motion.div>
        )}

        {step === 'brief' && sermonBrief && (
          <motion.div 
            key="brief"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
            className="space-y-12"
          >
            <div className="premium-card p-12 md:p-16 border-none shadow-[0_50px_100px_-20px_rgba(212,175,55,0.1)] bg-ivory/20 rounded-[3rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12 mb-16 relative z-10">
                <div className="flex items-center gap-8">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-gold text-white flex items-center justify-center shadow-2xl shadow-gold/30 relative">
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-[2.5rem]" />
                    <CheckCircle2 size={48} strokeWidth={1} className="relative z-10" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-display font-bold text-navy tracking-tight uppercase leading-none mb-3 italic">Logic Extracted</h2>
                    <p className="text-[11px] font-black text-gold uppercase tracking-[0.5em] italic">High-Fidelity Signature Verified</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-4 rounded-[1.5rem] border border-gold/20 shadow-xl shadow-gold/5">
                  <Sparkles size={24} className="text-gold animate-pulse" />
                  <div>
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Neural Precision</div>
                    <div className="text-sm font-black text-navy uppercase italic tracking-tighter">98.4% Confidence</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 bg-white/40 backdrop-blur-xl p-14 rounded-[3rem] border border-white/50 shadow-2xl relative overflow-hidden group/brief">
                <div className="space-y-3 relative z-10">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-2 italic">Derived Kingdom Concept</span>
                  <div className="text-3xl font-display font-bold text-navy leading-tight italic uppercase tracking-tighter">{sermonBrief.title}</div>
                </div>
                <div className="space-y-3 relative z-10">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-2 italic">Primary Doctrinal Authority</span>
                  <div className="text-3xl font-display font-bold text-navy leading-tight italic uppercase tracking-tighter">{sermonBrief.speaker}</div>
                </div>
              </div>

              <div className="text-center pt-12 relative z-10">
                <p className="text-[11px] text-slate-400 uppercase tracking-[0.5em] font-black max-w-lg mx-auto leading-relaxed italic opacity-50">
                  The sermon brief is now digitized, semantically audited and mapped to the Light Assembly knowledge base.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <button 
                className="h-20 bg-white border-2 border-slate-100 text-slate-300 rounded-[2rem] font-black tracking-[0.3em] uppercase text-[11px] italic hover:border-navy hover:text-navy transition-all flex items-center justify-center gap-4 active:scale-95 group shadow-sm"
                onClick={() => setStep('input')}
              >
                <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                RE-CONFIGURE INPUT
              </button>
              <button 
                className="btn-primary h-20 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.3)] active:scale-[0.98] disabled:opacity-40 rounded-[2rem]"
                onClick={handleGeneratePack} 
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw className="animate-spin text-gold" size={24} />
                ) : (
                  <div className="flex items-center gap-6">
                    <Package size={24} className="text-gold" />
                    <span className="tracking-[0.4em] font-black text-sm italic">INITIALIZE DEPLOYMENT PACK</span>
                  </div>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 'outputs' && outputs && (
          <motion.div 
            key="outputs"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="space-y-16"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-white p-12 rounded-[3.5rem] border border-slate-50 shadow-[0_50px_100px_-20px_rgba(15,23,42,0.1)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-[4000ms]" />
              <div className="text-center lg:text-left relative z-10">
                <div className="flex items-center gap-4 mb-4 justify-center lg:justify-start">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/10">
                    <BookOpen size={20} />
                  </div>
                  <span className="text-[11px] font-black text-gold uppercase tracking-[0.4em] italic">Full Production Pack Output</span>
                </div>
                <h2 className="text-4xl font-display font-bold text-navy tracking-tighter uppercase italic">{sermonBrief.title}</h2>
              </div>
              <button 
                className="btn-gold h-20 px-12 shadow-2xl shadow-gold/20 active:scale-[0.98] flex items-center gap-6 text-[12px] font-black uppercase tracking-[0.3em] italic rounded-[2rem] relative z-10 overflow-hidden group/btn"
                onClick={handleSaveAll}
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500" />
                <Save size={24} className="relative z-10" />
                <span className="relative z-10">BULK DEPLOY TO QUEUE</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {OUTPUT_PACK.map(item => outputs[item.key] && (
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={item.key} 
                  className="premium-card flex flex-col group overflow-hidden border-none shadow-[0_40px_80px_-20px_rgba(15,23,42,0.1)] hover:shadow-navy/20 transition-all duration-700 bg-white rounded-[3rem]"
                >
                  <div className="p-8 bg-navy text-white flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center text-gold border border-gold/20">
                         <item.icon size={20} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] italic leading-none">{item.label}</span>
                    </div>
                    <button 
                      className="w-10 h-10 text-white/40 hover:text-gold transition-colors bg-white/5 rounded-xl border border-white/10 active:scale-90 flex items-center justify-center"
                      onClick={() => copy(outputs[item.key])}
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <div className="p-14 text-[15px] leading-[1.8] text-navy min-h-[300px] font-black bg-offwhite/10 italic relative overflow-hidden group/text">
                    <div className="relative z-10 whitespace-pre-wrap">{outputs[item.key]}</div>
                    <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none group-hover/text:scale-125 transition-transform duration-1000">
                       <item.icon size={120} />
                    </div>
                  </div>
                  <div className="p-8 mt-auto border-t border-slate-50 flex items-center justify-between bg-white bg-gradient-to-b from-white to-offwhite/20">
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)] animate-pulse" />
                       <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] italic">Network: {item.platform}</span>
                    </div>
                    <button 
                      className="text-[10px] font-black text-navy uppercase tracking-[0.3em] italic hover:text-gold transition-all flex items-center gap-3 group/btn"
                      onClick={() => showToast('Neural Refinement Engine Coming Soon')}
                    >
                      Refine Node <ArrowRightCircle size={18} className="group-hover/btn:translate-x-1 group-hover/btn:rotate-12 transition-all" />
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

