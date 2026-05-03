// src/pages/SermonEngine.js
import { useState } from 'react';
import { useChurch } from '../contexts/ChurchContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast, useCopy } from '../hooks/useToast';
import { generateJSON } from '../services/ai/aiService';
import { buildSermonExtractionPrompt, buildRepurposePrompt } from '../services/rag/promptBuilder';
import { addToQueue, saveSermonBrief } from '../services/firestore/db';

const OUTPUT_PACK = [
  { key: 'sermon_recap', label: '📱 Sunday Recap', platform: 'whatsapp' },
  { key: 'sermon_monday_fuel', label: '🎧 Monday Fuel Script', platform: 'whatsapp' },
  { key: 'sermon_quote', label: '🖼️ Quote Card Text', platform: 'facebook' },
  { key: 'sermon_summary', label: '📝 Sermon Summary', platform: 'whatsapp' },
  { key: 'sermon_whatsapp', label: '💬 Broadcast Message', platform: 'whatsapp' },
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
    } catch { showToast('Could not extract brief'); }
    setLoading(false);
  }

  async function handleGeneratePack() {
    setLoading(true);
    try {
      const { system, userMessage } = buildRepurposePrompt({ knowledge, sermonBrief, userInput: rawInput, outputTypes: OUTPUT_PACK.map(o => o.key) });
      const result = await generateJSON({ system, userMessage, maxTokens: 4000 });
      setOutputs(result);
      setStep('outputs');
    } catch { showToast('Generation failed'); }
    setLoading(false);
  }

  async function handleSaveAll() {
    if (!outputs) return;
    for (const item of OUTPUT_PACK) {
      if (outputs[item.key]) {
        await addToQueue({ contentType: item.label, contentTypeKey: item.key, platform: item.platform, text: outputs[item.key], context: sermonBrief?.title, generatedBy: user?.email });
      }
    }
    showToast('✓ All pieces saved to Queue!');
  }

  return (
    <div className="page-wrap">
      <div className="section-title">SERMON ENGINE</div>
      <div className="section-sub">PROCESSED SERMONS → FULL CONTENT PACKS</div>

      {step === 'input' && (
        <div className="card">
          <div className="form-group">
            <label className="form-label">Sermon Notes / Transcript</label>
            <textarea className="form-textarea" style={{ minHeight: '200px' }} placeholder="Paste your sermon notes here..." value={rawInput} onChange={e => setRawInput(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={handleExtractBrief} disabled={loading || !rawInput.trim()}>
            {loading ? ' Extracting...' : '🔍 EXTRACT SERMON BRIEF'}
          </button>
        </div>
      )}

      {step === 'brief' && sermonBrief && (
        <div>
          <div className="card-gold" style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: '700', color: '#92400E', marginBottom: '0.5rem' }}>✝ SERMON BRIEF EXTRACTED</div>
            <div style={{ fontSize: '0.82rem' }}><strong>Title:</strong> {sermonBrief.title}</div>
            <div style={{ fontSize: '0.82rem' }}><strong>Speaker:</strong> {sermonBrief.speaker}</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-primary" onClick={handleGeneratePack} disabled={loading} style={{ flex: 1 }}>
              {loading ? ' Generating pack...' : '🚀 GENERATE FULL PACK'}
            </button>
            <button className="btn-secondary" onClick={() => setStep('input')}>Back</button>
          </div>
        </div>
      )}

      {step === 'outputs' && outputs && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button className="btn-gold" onClick={handleSaveAll}>📥 SAVE ALL TO QUEUE</button>
          {OUTPUT_PACK.map(item => outputs[item.key] && (
            <div key={item.key} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>{item.label}</span>
                <button className="btn-copy" onClick={() => copy(outputs[item.key])}>Copy</button>
              </div>
              <div style={{ fontSize: '0.78rem', lineHeight: 1.6 }}>{outputs[item.key]}</div>
            </div>
          ))}
          <button className="btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setStep('input')}>Start New Sermon</button>
        </div>
      )}
    </div>
  );
}
