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
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const OUTPUT_PACK = [
  { key: 'sermon_recap', label: 'Sunday Recap Message', icon: MessageSquare, platform: 'whatsapp' },
  { key: 'sermon_monday_fuel', label: 'Monday Fuel Script', icon: Zap, platform: 'whatsapp' },
  { key: 'sermon_quote', label: 'Sermon Quote Card', icon: FileText, platform: 'facebook' },
  { key: 'sermon_summary', label: 'Sermon Summary', icon: BookOpen, platform: 'whatsapp' },
  { key: 'sermon_whatsapp', label: 'Global Broadcast', icon: MessageSquare, platform: 'whatsapp' },
];

const STEPS = [
  { id: 'input', label: 'Sermon Flow', icon: FileText },
  { id: 'brief', label: 'Intelligence Review', icon: Search },
  { id: 'outputs', label: 'Content Pack', icon: Package }
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Visual Step Indicator */}
      <div className="flex items-center justify-between relative px-2 py-4">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 -translate-y-1/2 z-0" />
        {STEPS.map((s, i) => {
          const isActive = step === s.id;
          const isDone = i < STEPS.findIndex(st => st.id === step);
          return (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2 group">
              <div 
                className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2
                  ${isActive ? 'bg-navy border-navy text-white scale-110 shadow-xl shadow-navy/20' : 
                    isDone ? 'bg-gold border-gold text-white' : 'bg-white border-slate-200 text-slate-400'}
                `}
              >
                {isDone ? <CheckCircle2 size={24} /> : <s.icon size={22} />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-navy' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div 
            key="input"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="premium-card p-6 md:p-10 space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-ivory text-gold flex items-center justify-center border border-gold/10 shadow-sm">
                <Mic2 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy tracking-tight">Sermon Source Input</h2>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Feed the Sermon Intelligence Engine</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-navy uppercase tracking-widest flex items-center gap-2">
                Sermon Notes or Transcript
              </label>
              <textarea 
                className="w-full h-80 px-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all text-sm font-medium leading-[1.8] resize-none" 
                placeholder="Paste the sermon notes or the full transcript here for extraction..." 
                value={rawInput} 
                onChange={e => setRawInput(e.target.value)} 
              />
            </div>

            <button 
              className="w-full h-14 bg-navy text-white rounded-xl shadow-xl shadow-navy/20 command-btn active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 overflow-hidden"
              onClick={handleExtractBrief} 
              disabled={loading || !rawInput.trim()}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>EXTRACTING INTELLIGENCE</span>
                </>
              ) : (
                <>
                  <Search size={20} />
                  <span>EXTRACT SERMON BRIEF</span>
                </>
              )}
            </button>
          </motion.div>
        )}

        {step === 'brief' && sermonBrief && (
          <motion.div 
            key="brief"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            <div className="premium-card overflow-hidden gold-border-gradient bg-ivory/30 ring-1 ring-gold/10">
              <div className="p-8 md:p-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold text-white flex items-center justify-center shadow-lg shadow-gold/20">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-navy tracking-tight uppercase tracking-wider italic">Intelligence Review Ready</h2>
                    <p className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">Verified Sermon Extraction</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="space-y-1 relative z-10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sermon Theme</span>
                    <div className="text-xl font-bold text-navy">{sermonBrief.title}</div>
                  </div>
                  <div className="space-y-1 relative z-10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Speaker</span>
                    <div className="text-xl font-bold text-navy">{sermonBrief.speaker}</div>
                  </div>
                </div>

                <p className="text-sm text-slate-500 italic text-center font-medium">
                  "The extracted intelligence is consistent with the Light Assembly Bible Church voice. Proceed to content pack generation."
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                className="h-14 border border-slate-200 text-slate-500 rounded-xl font-display tracking-widest uppercase text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                onClick={() => setStep('input')}
              >
                <ArrowLeft size={16} />
                Re-Extract
              </button>
              <button 
                className="h-14 bg-navy text-white rounded-xl shadow-xl shadow-navy/20 command-btn active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                onClick={handleGeneratePack} 
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles size={18} className="text-gold fill-gold/20" />
                    <span>GENERATE FULL PACK</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 'outputs' && outputs && (
          <motion.div 
            key="outputs"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-navy tracking-tight">{sermonBrief.title}</h2>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gold uppercase tracking-widest justify-center sm:justify-start mt-1">
                  <Package size={14} />
                  Sermon Content Pack
                </div>
              </div>
              <button 
                className="btn-gold px-8 py-3 command-btn shadow-xl shadow-gold/20 active:scale-95 flex items-center gap-2"
                onClick={handleSaveAll}
              >
                <Save size={18} />
                Deploy All to Queue
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {OUTPUT_PACK.map(item => outputs[item.key] && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={item.key} 
                  className="premium-card flex flex-col group overflow-hidden"
                >
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-navy">
                      <item.icon size={16} className="text-gold" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                    </div>
                    <button 
                      className="p-2 text-slate-300 hover:text-navy transition-colors bg-white rounded-lg shadow-sm"
                      onClick={() => copy(outputs[item.key])}
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  <div className="p-6 text-sm text-slate-600 leading-relaxed min-h-[160px] italic">
                    {outputs[item.key]}
                  </div>
                  <div className="p-4 mt-auto border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      Platform: {item.platform}
                    </span>
                    <button 
                      className="text-[10px] font-bold text-gold uppercase tracking-widest hover:text-navy transition-all flex items-center gap-1"
                      onClick={() => showToast('Feature Coming Soon: Edit Mode')}
                    >
                      Edit Piece <ChevronRight size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <button 
                className="text-xs font-bold text-slate-400 hover:text-navy transition-colors uppercase tracking-[0.2em] flex items-center gap-2"
                onClick={() => {
                  setStep('input');
                  setOutputs(null);
                  setSermonBrief(null);
                  setRawInput('');
                }}
              >
                <RefreshCw size={14} />
                Initialize New Sermon Engine Cycle
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
