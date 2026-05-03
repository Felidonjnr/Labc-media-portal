// src/pages/ChurchKnowledge.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { useChurch } from '../contexts/ChurchContext';
import { saveChurchKnowledge } from '../services/firestore/db';
import { 
  Database, 
  Cpu, 
  Save, 
  Lock, 
  Unlock, 
  Layout, 
  Flag,
  User,
  Clock,
  Mic2,
  CheckCircle2,
  RefreshCw,
  Activity,
  Zap,
  Shield,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SECTIONS = [
  {
    id: 'identity',
    label: 'Core Identity',
    sub: 'Legal and physical footprint',
    icon: Layout,
    fields: [
      { key: 'churchName', label: 'Church Legal Name', type: 'input' },
      { key: 'location', label: 'Physical Headquarters', type: 'input' },
      { key: 'serviceTimes', label: 'Service Schedule', type: 'input' },
    ]
  },
  {
    id: 'leadership',
    label: 'Pastorate Profile',
    sub: 'Personal authority and style',
    icon: User,
    fields: [
      { key: 'pastorName', label: 'Senior Pastor Full Name', type: 'input' },
      { key: 'pastorTitle', label: 'Pastoral Title (Rev, Dr, Pastor)', type: 'input' },
      { key: 'pastorStyle', label: "Preaching & Communication Style", type: 'textarea' },
    ]
  },
  {
    id: 'foundations',
    label: 'Spiritual Foundations',
    sub: 'The spiritual mandate',
    icon: Flag,
    fields: [
      { key: 'vision', label: 'The Vision Statement', type: 'textarea' },
      { key: 'mission', label: 'The Mission Mandate', type: 'textarea' },
      { key: 'coreValues', label: 'Operational Values', type: 'textarea' },
    ]
  },
  {
    id: 'voice',
    label: 'Language & Voice',
    sub: 'AI persona configuration',
    icon: Mic2,
    fields: [
      { key: 'churchLanguage', label: 'Local Phrases & Vocabulary', type: 'textarea' },
      { key: 'tone', label: 'Aesthetic Tone (Warm, Bold, Minimal)', type: 'input' },
      { key: 'keyScriptures', label: 'Watchword Scriptures', type: 'textarea' },
    ]
  },
  {
    id: 'cycles',
    label: 'Ministry Rhythms',
    sub: 'Calendar and sequences',
    icon: Clock,
    fields: [
      { key: 'recurringProgrammes', label: 'Recurring Annual Events', type: 'textarea' },
      { key: 'upcomingEvents', label: 'Current Season Focus', type: 'textarea' },
    ]
  }
];

const DEFAULTS = {
  churchName: 'Light Assembly Bible Church',
  location: 'Uyo, Akwa Ibom, Nigeria',
  pastorName: 'Rev. Emmanuel Udoh',
  pastorTitle: 'Senior Pastor',
};

export default function ChurchKnowledge() {
  const [data, setData] = useState(DEFAULTS);
  const [activeSection, setActiveSection] = useState('identity');
  const [aiProvider, setAiProvider] = useState('claude');
  const [saving, setSaving] = useState(false);
  const { isAdmin } = useAuth();
  const { knowledge, refresh } = useChurch();
  const { showToast } = useToast();

  useEffect(() => {
    if (knowledge) setData({ ...DEFAULTS, ...knowledge });
    setAiProvider(localStorage.getItem('lamp_ai_provider') || 'claude');
  }, [knowledge]);

  function handleChange(key, value) {
    if (!isAdmin) return;
    setData(p => ({ ...p, [key]: value }));
  }

  function switchProvider(p) {
    if (!isAdmin) return;
    setAiProvider(p);
    localStorage.setItem('lamp_ai_provider', p);
    showToast(`✓ AI Intelligence: ${p.toUpperCase()} Synced`);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveChurchKnowledge(data);
      await refresh();
      showToast('✓ Church Brain Synchronized');
    } catch { showToast('Portal Error: Save failed'); }
    setSaving(false);
  }

  const providers = [
    { key: 'claude', label: 'Deep Intel', sub: 'Sonnet 3.5', color: '#D4AF37' },
    { key: 'haiku', label: 'Fast Logic', sub: 'Haiku 3.0', color: '#16A34A' },
    { key: 'deepseek', label: 'Neural Mode', sub: 'Efficient V3', color: '#7C3AED' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 pt-4 px-4 leading-tight">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center shadow-lg shadow-navy/20">
              <Database size={20} />
            </div>
            <h2 className="text-3xl font-display font-bold text-navy tracking-tighter uppercase">Knowledge Archive</h2>
          </div>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.3em] pl-1">Church Brain Core Configuration</p>
        </div>

        {isAdmin && (
          <button 
            onClick={handleSave}
            disabled={saving}
            className="btn-primary h-14 px-10 shadow-2xl shadow-navy/20 active:scale-[0.98] transition-all flex items-center gap-4 disabled:opacity-50 text-[11px] font-bold tracking-[0.3em]"
          >
            {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} className="text-gold" />}
            SYNCHRONIZE BRAIN
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* Tactical Navigation */}
        <div className="lg:col-span-4 space-y-8">
          {isAdmin && (
            <div className="premium-card p-8 space-y-6 bg-offwhite border-slate-100 shadow-xl shadow-navy/5">
               <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-navy">
                 <Cpu size={16} className="text-gold" />
                 AI Processing Core
               </div>
               <div className="grid gap-3">
                 {providers.map(p => (
                   <button 
                     key={p.key}
                     onClick={() => switchProvider(p.key)}
                     className={`w-full p-4 rounded-2xl border transition-all text-left group
                       ${aiProvider === p.key ? 'bg-white border-gold shadow-lg' : 'bg-transparent border-transparent hover:bg-white/50 text-slate-400'}
                     `}
                   >
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className={`w-2.5 h-2.5 rounded-full ${aiProvider === p.key ? 'animate-pulse' : ''}`} style={{ background: p.color }} />
                         <div>
                           <div className={`text-[10px] font-bold uppercase tracking-widest ${aiProvider === p.key ? 'text-navy' : ''}`}>{p.label}</div>
                           <div className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">{p.sub}</div>
                         </div>
                       </div>
                       {aiProvider === p.key && <Zap size={14} className="text-gold" />}
                     </div>
                   </button>
                 ))}
               </div>
            </div>
          )}

          <div className="premium-card p-4 space-y-2 bg-white">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all group overflow-hidden
                  ${activeSection === s.id ? 'bg-navy text-white shadow-2xl shadow-navy/20' : 'text-slate-400 hover:bg-offwhite hover:text-navy'}
                `}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                  ${activeSection === s.id ? 'bg-white/10 text-gold' : 'bg-slate-50 text-slate-400 group-hover:text-navy'}
                `}>
                  <s.icon size={20} strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-black font-display tracking-widest uppercase mb-0.5">{s.label}</div>
                  <div className={`text-[9px] font-bold opacity-40 uppercase tracking-tighter ${activeSection === s.id ? 'text-white' : 'text-slate-400'}`}>
                     {s.sub}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Intelligence Input Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="premium-card p-10 md:p-14 bg-white border-slate-100 shadow-2xl shadow-navy/5 relative group"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                 {(() => {
                    const section = SECTIONS.find(s => s.id === activeSection);
                    return <section.icon size={120} />;
                 })()}
              </div>

              <div className="flex items-center justify-between gap-6 mb-12 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-gold/5 flex items-center justify-center text-gold border border-gold/10">
                    {(() => {
                      const section = SECTIONS.find(s => s.id === activeSection);
                      return <section.icon size={32} strokeWidth={1.5} />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-3xl font-display font-bold text-navy tracking-tight uppercase leading-none mb-2 italic">
                       {SECTIONS.find(s => s.id === activeSection).label}
                    </h3>
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-offwhite border border-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {isAdmin ? <Unlock size={12} className="text-green-500" /> : <Lock size={12} className="text-red-500" />}
                          {isAdmin ? 'Read/Write Sequence' : 'Archive Read-Only'}
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-10 relative z-10">
                {SECTIONS.find(s => s.id === activeSection).fields.map(field => (
                  <div key={field.key} className="space-y-3 group/field">
                    <label className="text-[10px] font-black text-navy uppercase tracking-[0.2em] flex items-center justify-between pl-1">
                      <div className="flex items-center gap-2">
                         <Bookmark size={12} className="text-gold" />
                         {field.label}
                      </div>
                      {data[field.key] && <CheckCircle2 size={14} className="text-green-500 opacity-0 group-focus-within/field:opacity-100 transition-opacity" />}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="w-full h-48 px-7 py-6 bg-offwhite border border-slate-100 rounded-[2rem] focus:bg-white focus:ring-8 focus:ring-navy/5 focus:border-navy outline-none transition-all text-sm font-bold leading-relaxed resize-none shadow-inner disabled:opacity-40 italic"
                        value={data[field.key] || ''}
                        onChange={e => handleChange(field.key, e.target.value)}
                        disabled={!isAdmin}
                        placeholder={`Defining ${field.label}...`}
                      />
                    ) : (
                      <input
                        className="w-full h-16 px-7 bg-offwhite border border-slate-100 rounded-2xl focus:bg-white focus:ring-8 focus:ring-navy/5 focus:border-navy outline-none transition-all text-sm font-bold text-navy shadow-inner disabled:opacity-40 uppercase tracking-wider"
                        value={data[field.key] || ''}
                        onChange={e => handleChange(field.key, e.target.value)}
                        disabled={!isAdmin}
                        placeholder={`Defining ${field.label}...`}
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {isAdmin && (
                <div className="mt-14 pt-10 border-t border-slate-50 flex justify-end">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary h-16 px-12 italic text-sm tracking-[0.2em]"
                  >
                    COMMIT UPDATES
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

