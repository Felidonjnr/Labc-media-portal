// src/pages/KnowledgeDump.js
import { useState, useEffect } from 'react';
import { useChurch } from '../contexts/ChurchContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { generateContent } from '../services/ai/aiService';
import { getKnowledgeDocuments, addKnowledgeDocument } from '../services/firestore/db';

export default function KnowledgeDump() {
  const [input, setInput] = useState('');
  const [resources, setResources] = useState([]);
  const [adding, setAdding] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => { load(); }, []);

  async function load() {
    try { setResources(await getKnowledgeDocuments()); } catch { }
  }

  async function handleAdd() {
    if (!input.trim()) return;
    setAdding(true);
    try {
      const result = await generateContent({
        system: "Summarize this church resource for an AI knowledge base. Focus on main points. Be concise.",
        userMessage: input
      });
      await addKnowledgeDocument({ preview: input.slice(0, 100), fullText: input, summary: result.text, addedBy: user?.email });
      setInput('');
      showToast('✓ Added to Knowledge Base!');
      load();
    } catch { showToast('Failed to add'); }
    setAdding(false);
  }

  return (
    <div className="page-wrap">
      <div className="section-title">KNOWLEDGE DUMP</div>
      <div className="section-sub">FEED THE AI BRAIN</div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Paste Article or Notes</label>
          <textarea className="form-textarea" style={{ minHeight: '120px' }} value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={handleAdd} disabled={adding || !input.trim()}>
          {adding ? ' Processing...' : '➕ ADD TO KNOWLEDGE BASE'}
        </button>
      </div>

      <div style={{ fontSize: '0.65rem', fontWeight: '700', marginBottom: '0.5rem' }}>SAVED RESOURCES ({resources.length})</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {resources.map(r => (
          <div key={r.id} className="card">
            <div style={{ fontSize: '0.75rem', fontWeight: '600' }}>{r.preview}...</div>
            <div style={{ fontSize: '0.65rem', color: '#5A6478', marginTop: '4px' }}>{r.summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
