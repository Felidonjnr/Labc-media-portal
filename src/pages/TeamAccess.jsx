// src/pages/TeamAccess.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { getAllUsers, updateUser } from '../services/firestore/db';

export default function TeamAccess() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, user: me } = useAuth();
  const { showToast } = useToast();

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  async function load() {
    setLoading(true);
    try { setUsers(await getAllUsers()); } catch { setUsers([]); }
    setLoading(false);
  }

  async function update(uid, field, value) {
    await updateUser(uid, { [field]: value });
    setUsers(prev => prev.map(u => u.id === uid ? { ...u, [field]: value } : u));
    showToast('✓ Updated!');
  }

  if (!isAdmin) return <div className="page-wrap"><div className="section-title">ADMIN ACCESS REQUIRED</div></div>;

  const pending = users.filter(u => u.status === 'pending');
  const approved = users.filter(u => u.status === 'approved');

  return (
    <div className="page-wrap">
      <div className="section-title">TEAM & ACCESS</div>
      
      {pending.length > 0 && (
        <div style={{ background: '#FFFBEB', border: '1px solid rgba(217,119,6,0.25)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#D97706', letterSpacing: '2px', marginBottom: '0.6rem' }}>PENDING APPROVAL ({pending.length})</div>
          {pending.map(u => (
            <div key={u.id} style={s.userRow}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '600' }}>{u.displayName}</div>
                <div style={{ fontSize: '0.62rem', color: '#9AA3B2' }}>{u.email}</div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => update(u.id, 'status', 'approved')} style={s.approveBtn}>✓ Approve</button>
                <button onClick={() => update(u.id, 'status', 'suspended')} style={s.denyBtn}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#0A1628', letterSpacing: '2px', marginBottom: '0.6rem' }}>TEAM MEMBERS ({approved.length})</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {approved.map(u => (
          <div key={u.id} style={{ ...s.userCard, border: `1px solid ${u.id === me?.uid ? '#C9960C' : '#E4E8F0'}` }}>
            <div style={s.avatar}>{u.displayName?.[0]?.toUpperCase()}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '600' }}>{u.displayName} {u.id === me?.uid && '(YOU)'}</div>
              <div style={{ fontSize: '0.62rem', color: '#9AA3B2' }}>{u.email}</div>
            </div>
            {u.id !== me?.uid && (
              <select value={u.role} onChange={e => update(u.id, 'role', e.target.value)} style={s.roleSelect}>
                {['admin','member','view'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  userRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', borderRadius: '8px', padding: '0.7rem', marginBottom: '0.4rem' },
  userCard: { background: 'white', borderRadius: '10px', padding: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: '#EEF1F8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1rem', color: '#0A1628' },
  approveBtn: { background: '#F0FDF4', border: '1px solid rgba(22,163,74,0.3)', color: '#16A34A', borderRadius: '6px', padding: '5px 10px', fontSize: '0.68rem', fontWeight: '600', cursor: 'pointer' },
  denyBtn: { background: '#FEF2F2', border: '1px solid rgba(220,38,38,0.2)', color: '#DC2626', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer' },
  roleSelect: { background: '#F0F4FF', border: '1px solid #E4E8F0', borderRadius: '6px', padding: '3px 6px', fontSize: '0.65rem' }
};
