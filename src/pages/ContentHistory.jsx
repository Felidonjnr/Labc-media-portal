// src/pages/ContentHistory.js
import { useState, useEffect } from 'react';
import { useToast, useCopy } from '../hooks/useToast';
import { getHistoryItems } from '../services/firestore/db';

export default function ContentHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const copy = useCopy(showToast);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { setItems(await getHistoryItems()); } catch { }
    setLoading(false);
  }

  return (
    <div className="page-wrap">
      <div className="section-title">CONTENT HISTORY</div>
      <div className="section-sub">ARCHIVE OF SENT CONTENT</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map(item => (
          <div key={item.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
               <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>{item.contentType}</span>
               <button className="btn-copy" onClick={() => copy(item.text)}>Copy</button>
            </div>
            <div style={{ fontSize: '0.73rem', color: '#5A6478', marginBottom: '0.4rem' }}>{item.text?.slice(0, 150)}...</div>
            <div style={{ fontSize: '0.6rem', color: '#9AA3B2' }}>Sent: {item.sentAt?.toDate ? item.sentAt.toDate().toLocaleDateString() : 'recently'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
