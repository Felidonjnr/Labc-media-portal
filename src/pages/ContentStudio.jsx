// src/pages/ContentStudio.js
import { useState } from 'react';
import { useChurch } from '../contexts/ChurchContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast, useCopy } from '../hooks/useToast';
import { generateContent } from '../services/ai/aiService';
import { buildPrompt } from '../services/rag/promptBuilder';
import { addToQueue, logPromptRun, logFeedback } from '../services/firestore/db';

const CATEGORIES = {
  whatsapp: { label: '💬 WhatsApp', color: '#16A34A', bg: '#F0FDF4', types: [
    { value: 'sunday_recap', label: 'Sunday Recap Message' },
    { value: 'monday_fuel', label: 'Monday Fuel Script' },
    { value: 'word_today', label: 'The Word Today' },
  ]},
  facebook: { label: '📘 Facebook', color: '#1877F2', bg: '#EFF6FF', types: [
    { value: 'quote_card', label: 'Sermon Quote Card' },
    { value: 'saturday_teaser', label: 'Saturday Teaser' },
    { value: 'programme_promo', label: 'Programme Promo' },
  ]},
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
    } catch { showToast('Generation failed'); }
    setLoading(false);
  }

  async function handleSaveToQueue() {
    if (!output) return;
    const cat = CATEGORIES[activeCat];
    const typeLabel = cat.types.find(t => t.value === contentType)?.label;
    await addToQueue({ contentType: typeLabel, contentTypeKey: contentType, platform: activeCat, text: output, context: context.slice(0, 100), generatedBy: user?.email });
    showToast('✓ Saved to Queue!');
  }

  if (!activeCat) return (
    <div className="page-wrap">
      <div className="section-title">CONTENT STUDIO</div>
      <div className="section-sub">SELECT A CATEGORY</div>
      <div style={s.catGrid}>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button key={key} style={{ ...s.catCard, borderTopColor: cat.color }} onClick={() => selectCat(key)}>
            <div style={s.catIcon}>{cat.label.split(' ')[0]}</div>
            <div style={{ ...s.catName, color: cat.color }}>{cat.label.slice(2)}</div>
            <div style={s.catCount}>{cat.types.length} types</div>
          </button>
        ))}
      </div>
    </div>
  );

  const cat = CATEGORIES[activeCat];

  return (
    <div className="page-wrap">
      <button style={s.back} onClick={() => setActiveCat(null)}>← Categories</button>
      <div className="section-title">{cat.label}</div>
      <div className="card">
        <div className="form-group">
          <label className="form-label">Content Type</label>
          <select className="form-select" value={contentType} onChange={e => setContentType(e.target.value)}>
            {cat.types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Context / Details</label>
          <textarea className="form-textarea" placeholder="Add specific details or points..." value={context} onChange={e => setContext(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={handleGenerate} disabled={loading || !context.trim()}>
          {loading ? ' Generating...' : '✨ GENERATE CONTENT'}
        </button>
      </div>

      {output && (
        <div className="output-box">
          <div className="output-box-header">
            <span className="output-label">✓ Generated Output</span>
            <button className="btn-copy" onClick={() => copy(output)}>Copy</button>
          </div>
          {output}
          <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
            <button className="btn-secondary" onClick={handleSaveToQueue} style={{ flex: 1 }}>📥 Save to Queue</button>
            <button className="btn-secondary" onClick={handleGenerate} style={{ flex: 1 }}>🔄 Regenerate</button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  catGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
  catCard: { background: 'white', border: '1px solid #E4E8F0', borderTop: '3px solid', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer', textAlign: 'center' },
  catIcon: { fontSize: '1.5rem', marginBottom: '0.5rem' },
  catName: { fontWeight: '600', fontSize: '0.85rem' },
  catCount: { fontSize: '0.62rem', color: '#9AA3B2' },
  back: { background: 'none', border: 'none', color: '#5A6478', fontSize: '0.75rem', cursor: 'pointer', marginBottom: '0.75rem' }
};
