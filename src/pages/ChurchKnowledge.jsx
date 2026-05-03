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
  BookOpen, 
  Target, 
  Flag,
  User,
  MapPin,
  Clock,
  Mic2,
  Settings2,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SECTIONS = [
  {
    id: 'identity',
    label: 'Core Identity',
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
    { key: 'claude', label: 'Deep Intelligence', sub: 'Claude Sonnet', color: '#C9960C' },
    { key: 'haiku', label: 'High Speed', sub: 'Claude Haiku', color: '#16A34A' },
    { key: 'deepseek', label: 'Efficiency Mode', sub: 'DeepSeek', color: '#7C3AED' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Brain Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center shadow-lg shadow-navy/20 relative">
            <Database size={24} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-navy tracking-tight">The Church Brain Hub</h2>
            <p className="text-slate-500 font-medium text-sm">Comprehensive Knowledge Base for AI Customization</p>
          </div>
        </div>

        {isAdmin && (
          <button 
            onClick={handleSave}
            disabled={saving}
            className="btn-navy h-12 px-8 command-btn active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
            Synchronize Brain
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-4">
          {isAdmin && (
            <div className="premium-card p-4 space-y-4 mb-6 ring-2 ring-gold/10 bg-ivory/30">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-navy mb-2">
                 <Cpu size={14} className="text-gold" />
                 AI Processing Core
               </div>
               <div className="space-y-2">
                 {providers.map(p => (
                   <button 
                     key={p.key}
                     onClick={() => switchProvider(p.key)}
                     className={`w-full p-3 rounded-xl border text-left transition-all ${aiProvider === p.key ? 'bg-white border-gold shadow-md' : 'border-transparent hover:bg-white/50 text-slate-400'}`}
                   >
                     <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                       <div>
                         <div className={`text-[10px] font-bold uppercase tracking-widest ${aiProvider === p.key ? 'text-navy' : ''}`}>{p.label}</div>
                         <div className="text-[9px] font-medium opacity-60">{p.sub}</div>
                       </div>
                     </div>
                   </button>
                 ))}
               </div>
            </div>
          )}

          <div className="premium-card p-2 space-y-1">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-display tracking-widest uppercase text-[10px] ${activeSection === s.id ? 'bg-navy text-white shadow-xl shadow-navy/20' : 'text-slate-500 hover:bg-slate-50 hover:text-navy'}`}
              >
                {(() => {
                  const Icon = s.icon;
                  return <Icon size={16} className={activeSection === s.id ? 'text-gold' : 'text-slate-400'} />;
                })()}
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Area */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="premium-card p-8 md:p-10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-lg bg-gold/5 flex items-center justify-center text-gold border border-gold/10">
                  {(() => {
                    const section = SECTIONS.find(s => s.id === activeSection);
                    const Icon = section.icon;
                    return <Icon size={20} />;
                  })()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy tracking-tight">{SECTIONS.find(s => s.id === activeSection).label}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {isAdmin ? <Unlock size={10} className="text-green-500" /> : <Lock size={10} className="text-red-500" />}
                      {isAdmin ? 'Read/Write Mode' : 'Read Only Mode'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {SECTIONS.find(s => s.id === activeSection).fields.map(field => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-[11px] font-bold text-navy uppercase tracking-widest flex items-center justify-between">
                      {field.label}
                      {data[field.key] && <CheckCircle2 size={12} className="text-green-500 opacity-0 group-focus-within:opacity-100" />}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="w-full h-40 px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all text-sm font-medium leading-relaxed resize-none disabled:opacity-60"
                        value={data[field.key] || ''}
                        onChange={e => handleChange(field.key, e.target.value)}
                        disabled={!isAdmin}
                        placeholder={`Defining ${field.label}...`}
                      />
                    ) : (
                      <input
                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all text-sm font-semibold text-navy disabled:opacity-60"
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
                <div className="mt-12 pt-8 border-t border-slate-50 flex justify-end">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="h-14 px-12 bg-navy text-white rounded-xl shadow-xl shadow-navy/20 command-btn active:scale-95 transition-all text-sm disabled:opacity-50"
                  >
                    Save Changes
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
