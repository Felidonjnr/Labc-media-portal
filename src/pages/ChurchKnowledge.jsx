// src/pages/ChurchKnowledge.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { useChurch } from '../contexts/ChurchContext';
import { saveChurchKnowledge } from '../services/firestore/db';

const FIELDS = [
  { key: 'churchName', label: 'Church Name', type: 'input' },
  { key: 'location', label: 'Location', type: 'input' },
  { key: 'serviceTimes', label: 'Service Times', type: 'input' },
  { key: 'pastorName', label: 'Pastor Full Name', type: 'input' },
  { key: 'pastorTitle', label: 'Pastor Title', type: 'input' },
  { key: 'pastorStyle', label: "Pastor's Preaching Style", type: 'textarea' },
  { key: 'vision', label: 'Vision Statement', type: 'textarea' },
  { key: 'mission', label: 'Mission Statement', type: 'textarea' },
  { key: 'coreValues', label: 'Core Values', type: 'textarea' },
  { key: 'departments', label: 'Departments', type: 'input' },
  { key: 'churchLanguage', label: 'Church Language / Key Phrases', type: 'textarea' },
  { key: 'tone', label: 'Tone Profile', type: 'input' },
  { key: 'keyScriptures', label: 'Key Scriptures', type: 'textarea' },
  { key: 'recurringProgrammes', label: 'Recurring Programmes', type: 'textarea' },
  { key: 'upcomingEvents', label: 'Upcoming Events', type: 'textarea' },
];

const DEFAULTS = {
  churchName: 'Light Assembly Bible Church',
  location: 'Uyo, Akwa Ibom, Nigeria',
  pastorName: 'Rev. Emmanuel Udoh',
  pastorTitle: 'Senior Pastor',
};

export default function ChurchKnowledge() {
  const [data, setData] = useState(DEFAULTS);
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
    showToast(`✓ Switched to ${p}`);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveChurchKnowledge(data);
      await refresh();
      showToast('✓ Church Knowledge Base saved!');
    } catch { showToast('Save failed'); }
    setSaving(false);
  }

  const providers = [
    { key: 'claude', label: 'Claude Sonnet', desc: 'Best quality', color: '#C9960C' },
    { key: 'haiku', label: 'Claude Haiku', desc: 'Fast & cheap', color: '#16A34A' },
    { key: 'deepseek', label: 'DeepSeek', desc: 'Budget mode', color: '#7C3AED' },
  ];

  return (
    <div className="page-wrap">
      <div className="section-title">CHURCH KNOWLEDGE BASE</div>
      <div className="section-sub">{isAdmin ? 'ADMIN — EDIT AND SAVE ANYTIME' : 'VIEW ONLY'}</div>

      {isAdmin && (
        <div style={s.providerCard}>
          <div style={s.providerTitle}>⚡ AI ENGINE</div>
          <div style={s.providerGrid}>
            {providers.map(p => (
              <button key={p.key} onClick={() => switchProvider(p.key)}
                style={{ ...s.providerBtn, ...(aiProvider === p.key ? { border: `2px solid ${p.color}`, background: '#FAFBFF' } : {}) }}>
                <div style={{ ...s.providerDot, background: p.color }} />
                <div>
                  <div style={{ ...s.providerLabel, color: aiProvider === p.key ? p.color : '#0D1117' }}>{p.label}</div>
                  <div style={s.providerDesc}>{p.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        {FIELDS.map(field => (
          <div className="form-group" key={field.key}>
            <label className="form-label">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea className="form-textarea" value={data[field.key] || ''} onChange={e => handleChange(field.key, e.target.value)} disabled={!isAdmin} />
            ) : (
              <input className="form-input" value={data[field.key] || ''} onChange={e => handleChange(field.key, e.target.value)} disabled={!isAdmin} />
            )}
          </div>
        ))}
        {isAdmin && (
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? ' Saving...' : '💾 SAVE KNOWLEDGE BASE'}
          </button>
        )}
      </div>
    </div>
  );
}

const s = {
  providerCard: { background: 'white', border: '1px solid #E4E8F0', borderRadius: '14px', padding: '1.1rem', marginBottom: '1rem' },
  providerTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '2px', color: '#0A1628', marginBottom: '0.75rem' },
  providerGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' },
  providerBtn: { display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#F0F4FF', border: '2px solid transparent', borderRadius: '10px', padding: '0.65rem 0.75rem', cursor: 'pointer' },
  providerDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '3px' },
  providerLabel: { fontSize: '0.72rem', fontWeight: '700' },
  providerDesc: { fontSize: '0.58rem', color: '#9AA3B2' }
};
