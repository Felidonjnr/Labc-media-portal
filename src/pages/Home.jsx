// src/pages/Home.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getQueueItems, getFollowUpTasks } from '../services/firestore/db';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAY_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DAY_TASKS = {
  0: { tasks: [' Record today\'s service', ' Go live on Facebook', ' Generate Sunday Recap tonight', ' Log first timers in Follow-Up'], forward: false },
  1: { tasks: [' Send Monday Fuel voice note', ' Distribute sermon audio', ' Send welcome messages to Sunday visitors'], forward: false },
  2: { tasks: [' Send Testimony Tuesday prompt', ' Check first timers were welcomed', ' The Word Today broadcast'], forward: false },
  3: { tasks: [' Post Sermon Quote Card on Facebook', ' Update WhatsApp Status with sermon quote', ' The Word Today broadcast'], forward: false },
  4: { tasks: [' Post sermon clip on Facebook', ' Send absentee check-in messages', ' NIGHT PROGRAMME — post reminder now'], forward: false },
  5: { tasks: [' Begin Sunday announcement prep', ' Draft Saturday Teaser Post', ' Confirm Pastor\'s sermon notes are ready'], forward: true },
  6: { tasks: [' Post Saturday Teaser on Facebook', ' Send reminder broadcast', ' Confirm all Sunday content is ready'], forward: true },
};

const WEEKLY_RHYTHM = [
  { short: 'Live + Recap' }, { short: 'Monday Fuel' }, { short: 'Testimony' },
  { short: 'Quote Card' }, { short: 'Clip + Night' }, { short: 'Sun Prep' }, { short: 'Teaser' }
];

export default function Home() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [nextActions, setNextActions] = useState([]);
  const today = new Date();
  const dayIdx = today.getDay();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const name = userProfile?.displayName?.split(' ')[0] || 'Team';
  const dayData = DAY_TASKS[dayIdx];

  useEffect(() => { computeNextActions(); }, []);

  async function computeNextActions() {
    const actions = [];
    try {
      const queue = await getQueueItems();
      const followups = await getFollowUpTasks();
      if (followups.length > 0) {
        actions.push({ label: `${followups.length} follow-up${followups.length > 1 ? 's' : ''} pending`, path: '/followup', urgency: 'high' });
      }
      const pendingQueue = queue.filter(i => i.status === 'pending');
      if (pendingQueue.length > 0) {
        actions.push({ label: `${pendingQueue.length} items in queue`, path: '/queue', urgency: 'medium' });
      }
      if (dayIdx === 0 || dayIdx === 6) {
        actions.push({ label: 'Generate this week\'s content pack', path: '/sermon', urgency: 'high' });
      }
    } catch { }
    setNextActions(actions.slice(0, 4));
  }

  const urgencyColors = { high: '#DC2626', medium: '#D97706', low: '#16A34A' };
  const urgencyBg = { high: '#FEF2F2', medium: '#FFFBEB', low: '#F0FDF4' };

  return (
    <div className="page-wrap">
      <div style={s.greetCard}>
        <div style={s.greetLeft}>
          <div style={s.greetText}>{greeting}, <span style={s.greetName}>{name}</span> ✝</div>
          <div style={s.greetSub}>Light Assembly Bible Church — Media Portal</div>
        </div>
        <div style={s.dayChip}>{DAYS[dayIdx].toUpperCase()}</div>
      </div>

      {nextActions.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionHeader}><span style={s.sectionTitle}>⚡ BEST NEXT ACTIONS</span></div>
          {nextActions.map((action, i) => (
            <button key={i} style={{ ...s.actionItem, background: urgencyBg[action.urgency] }} onClick={() => navigate(action.path)}>
              <div style={{ ...s.actionDot, background: urgencyColors[action.urgency] }} />
              <span style={s.actionLabel}>{action.label}</span>
              <span style={s.actionArrow}>→</span>
            </button>
          ))}
        </div>
      )}

      <div style={s.section}>
        <div style={s.sectionHeader}>
          <span style={s.sectionTitle}>{dayData.forward ? '🔭 LOOK AHEAD — PREPARE FOR SUNDAY' : "📋 TODAY'S MEDIA TASKS"}</span>
        </div>
        {dayData.tasks.map((task, i) => (
          <div key={i} style={s.task}>
            <span style={s.taskArrow}>→</span>
            <span style={s.taskText}>{task}</span>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <div style={s.sectionHeader}><span style={s.sectionTitle}>🚀 QUICK ACTIONS</span></div>
        <div style={s.quickGrid}>
          {[
            { label: ' Generate Content', path: '/studio', color: '#0A1628' },
            { label: ' Sermon Engine', path: '/sermon', color: '#C9960C' },
            { label: ' Follow-Up', path: '/followup', color: '#16A34A' },
            { label: ' Calendar', path: '/calendar', color: '#1877F2' },
          ].map(btn => (
            <button key={btn.path} style={s.quickBtn} onClick={() => navigate(btn.path)}>
              <div style={{ ...s.quickBtnAccent, background: btn.color }} />
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div style={s.section}>
        <div style={s.sectionHeader}><span style={s.sectionTitle}>🔄 WEEKLY RHYTHM</span></div>
        <div style={s.rhythmGrid}>
          {DAY_SHORT.map((day, i) => (
            <div key={day} style={{ ...s.rhythmDay, ...(i === dayIdx ? s.rhythmDayActive : {}) }}>
              <div style={{ ...s.rhythmDayLabel, ...(i === dayIdx ? { color: '#C9960C' } : {}) }}>{day}</div>
              <div style={s.rhythmDayTask}>{WEEKLY_RHYTHM[i].short}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  greetCard: { background: '#0A1628', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.875rem' },
  greetText: { fontSize: '1.05rem', fontWeight: '600', color: 'white' },
  greetName: { color: '#C9960C' },
  greetSub: { fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px' },
  dayChip: { background: 'rgba(201,150,12,0.2)', border: '1px solid rgba(201,150,12,0.4)', borderRadius: '8px', padding: '6px 12px', fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.95rem', letterSpacing: '2px', color: '#C9960C' },
  section: { background: 'white', border: '1px solid #E4E8F0', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(10,22,40,0.05)', marginBottom: '0.875rem' },
  sectionHeader: { marginBottom: '0.75rem' },
  sectionTitle: { fontSize: '0.65rem', fontWeight: '700', color: '#0A1628', letterSpacing: '2px', textTransform: 'uppercase' },
  actionItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '0.65rem 0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', marginBottom: '0.4rem', width: '100%', textAlign: 'left' },
  actionDot: { width: '8px', height: '8px', borderRadius: '50%' },
  actionLabel: { flex: 1, fontSize: '0.78rem', color: '#0D1117', fontWeight: '500' },
  actionArrow: { color: '#9AA3B2', fontSize: '0.85rem' },
  task: { display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '0.5rem 0', borderBottom: '1px solid #F0F4FF' },
  taskArrow: { color: '#C9960C', fontWeight: '700' },
  taskText: { fontSize: '0.8rem', color: '#0D1117', lineHeight: 1.5 },
  quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' },
  quickBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: '#F0F4FF', border: '1px solid #E4E8F0', borderRadius: '10px', padding: '0.7rem 0.75rem', fontSize: '0.75rem', fontWeight: '500', color: '#0D1117', cursor: 'pointer', textAlign: 'left' },
  quickBtnAccent: { width: '4px', height: '28px', borderRadius: '2px' },
  rhythmGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' },
  rhythmDay: { background: '#F0F4FF', borderRadius: '8px', padding: '6px 4px', textAlign: 'center' },
  rhythmDayActive: { background: '#FFF8E7', border: '1px solid rgba(201,150,12,0.3)' },
  rhythmDayLabel: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.75rem', letterSpacing: '1px', color: '#0A1628' },
  rhythmDayTask: { fontSize: '0.5rem', color: '#9AA3B2', marginTop: '2px' }
};
