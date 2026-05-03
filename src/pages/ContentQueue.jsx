// src/pages/ContentQueue.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast, useCopy } from '../hooks/useToast';
import { getQueueItems, updateQueueItem, logFeedback } from '../services/firestore/db';

export default function ContentQueue() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const copy = useCopy(showToast);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { setItems(await getQueueItems()); } catch { }
    setLoading(false);
  }

  async function handleMarkSent(id) {
    await updateQueueItem(id, { status: 'sent', sentAt: new Date() });
    setItems(prev => prev.filter(i => i.id !== id));
    await logFeedback(id, 'sent');
    showToast('✓ Marked as sent!');
  }

  return (
    <div className="page-wrap">
      <div className="section-title">CONTENT QUEUE</div>
      <div className="section-sub">READY TO BROADCAST</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map(item => (
          <div key={item.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#16A34A' }}>{item.platform?.toUpperCase()} · {item.contentType}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-copy" onClick={() => copy(item.text)}>Copy</button>
                <button className="btn-secondary" onClick={() => handleMarkSent(item.id)}>Sent ✓</button>
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', whiteSpace: 'pre-wrap' }}>{item.text}</div>
          </div>
        ))}
        {items.length === 0 && !loading && <div style={{ textAlign: 'center', color: '#9AA3B2', padding: '2rem' }}>Queue is empty.</div>}
      </div>
    </div>
  );
}
