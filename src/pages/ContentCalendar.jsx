// src/pages/ContentCalendar.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { getCalendarItems, addCalendarItem, updateCalendarItem } from '../services/firestore/db';

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DEFAULT_SLOTS = {
  0: [{ type: 'Facebook Live', platform: 'facebook' }, { type: 'Sunday Recap', platform: 'whatsapp' }],
  1: [{ type: 'Monday Fuel', platform: 'whatsapp' }],
  2: [{ type: 'Testimony Tuesday', platform: 'whatsapp' }],
  3: [{ type: 'Sermon Quote', platform: 'facebook' }],
  4: [{ type: 'Sermon Clip', platform: 'facebook' }],
  5: [{ type: 'Sunday Prep', platform: 'internal' }],
  6: [{ type: 'Saturday Teaser', platform: 'facebook' }],
};

export default function ContentCalendar() {
  const [calItems, setCalItems] = useState({});
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const weekStart = new Date(); // Simplified for now
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toISOString().split('T')[0];

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const items = await getCalendarItems(weekStartStr);
      const grouped = {};
      items.forEach(item => {
        if (!grouped[item.dayIndex]) grouped[item.dayIndex] = [];
        grouped[item.dayIndex].push(item);
      });
      setCalItems(grouped);
    } catch { }
    setLoading(false);
  }

  async function initWeek() {
    for (let d = 0; d < 7; d++) {
      const slots = DEFAULT_SLOTS[d] || [];
      for (const slot of slots) {
        await addCalendarItem({ dayIndex: d, weekStart: weekStartStr, ...slot, status: 'pending' });
      }
    }
    showToast('✓ Week initialized!');
    load();
  }

  return (
    <div className="page-wrap">
      <div className="section-title">CONTENT CALENDAR</div>
      <div className="section-sub">WEEKLY MEDIA SCHEDULE</div>
      
      {Object.keys(calItems).length === 0 && !loading && (
        <button className="btn-primary" onClick={initWeek}>Initialize This Week</button>
      )}

      <div style={s.grid}>
        {DAYS.map((day, i) => (
          <div key={day} style={s.dayCol}>
            <div style={s.dayHeader}>{day}</div>
            {calItems[i]?.map((item, idx) => (
              <div key={idx} style={s.calItem}>{item.type}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', overflowX: 'auto' },
  dayCol: { background: 'white', border: '1px solid #E4E8F0', borderRadius: '8px', padding: '6px', minWidth: '80px' },
  dayHeader: { fontWeight: '700', fontSize: '0.75rem', textAlign: 'center', marginBottom: '8px' },
  calItem: { background: '#F0F4FF', borderRadius: '4px', padding: '4px', fontSize: '0.55rem', marginBottom: '4px' }
};
