// src/pages/FollowUpCentre.js
import { useState, useEffect } from 'react';
import { useChurch } from '../contexts/ChurchContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast, useCopy } from '../hooks/useToast';
import { generateContent } from '../services/ai/aiService';
import { buildPrompt } from '../services/rag/promptBuilder';
import { getFollowUpTasks, addFollowUpTask, completeFollowUpTask } from '../services/firestore/db';

const TYPES = [
  { value: 'first_timer', label: '👋 First Timer', color: '#C9960C', promptType: 'welcome_message' },
  { value: 'absentee', label: '❤️ Absentee', color: '#D97706', promptType: 'absentee_checkin' },
];

export default function FollowUpCentre() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'first_timer' });
  const [activeTask, setActiveTask] = useState(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const { knowledge } = useChurch();
  const { user } = useAuth();
  const { showToast } = useToast();
  const copy = useCopy(showToast);

  useEffect(() => { load(); }, []);

  async function load() {
    try { setTasks(await getFollowUpTasks()); } catch { setTasks([]); }
  }

  async function handleAdd() {
    if (!form.name.trim()) return;
    await addFollowUpTask({ ...form, addedBy: user?.email });
    setForm({ name: '', type: 'first_timer' });
    setShowForm(false);
    showToast('✓ Task added!');
    load();
  }

  async function handleGenerate(task) {
    setActiveTask(task.id);
    setOutput('');
    setLoading(true);
    try {
      const typeInfo = TYPES.find(t => t.value === task.type);
      const { system, userMessage } = buildPrompt({ contentType: typeInfo.promptType, knowledge, userInput: `Member name: ${task.name}` });
      const result = await generateContent({ system, userMessage, useRefinement: true });
      setOutput(result.text);
    } catch { showToast('Generation failed'); }
    setLoading(false);
  }

  async function handleDone(id) {
    await completeFollowUpTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('✓ Marked as done!');
  }

  return (
    <div className="page-wrap">
      <div className="section-title">FOLLOW-UP CENTRE</div>
      <div className="section-sub">MEMBERS NEEDING CARE THIS WEEK</div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        {TYPES.map(t => (
          <button key={t.value} style={{ ...s.addBtn, borderColor: t.color, color: t.color }} onClick={() => { setForm(p => ({ ...p, type: t.value })); setShowForm(true); }}>+ {t.label}</button>
        ))}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-group">Member Name</label>
            <input className="form-input" placeholder="Full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-primary" onClick={handleAdd} style={{ flex: 1 }}>Add Task</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {tasks.map(task => {
          const typeInfo = TYPES.find(t => t.value === task.type);
          const isActive = activeTask === task.id;
          return (
            <div key={task.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: task.id === activeTask ? '0.5rem' : '0' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '600' }}>{task.name}</div>
                  <div style={{ fontSize: '0.68rem', color: typeInfo?.color || '#9AA3B2' }}>{typeInfo?.label}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-secondary" onClick={() => handleGenerate(task)} disabled={loading && isActive}>{loading && isActive ? '...' : '✨ Message'}</button>
                  <button className="btn-secondary" onClick={() => handleDone(task.id)}>✓ Done</button>
                </div>
              </div>
              {isActive && output && (
                <div className="output-box" style={{ marginTop: '0.5rem' }}>
                  <div className="output-box-header">
                    <span className="output-label">Generated Message</span>
                    <button className="btn-copy" onClick={() => copy(output)}>Copy</button>
                  </div>
                  {output}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  addBtn: { background: 'white', border: '1.5px solid', borderRadius: '20px', padding: '5px 12px', fontSize: '0.7rem', fontWeight: '600', cursor: 'pointer' }
};
