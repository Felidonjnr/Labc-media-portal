// src/services/firestore/db.js
import {
  collection, doc, getDoc, getDocs, setDoc, addDoc,
  updateDoc, deleteDoc, query, where, orderBy,
  limit, serverTimestamp
 } from 'firebase/firestore';
 import { db } from '../../firebase';
 
 // ── CHURCH KNOWLEDGE ──
 export async function getChurchKnowledge() {
  const snap = await getDoc(doc(db, 'lamp_church', 'knowledge'));
  return snap.exists() ? snap.data() : null;
 }
 export async function saveChurchKnowledge(data) {
  await setDoc(doc(db, 'lamp_church', 'knowledge'), {
  ...data,
  updatedAt: serverTimestamp()
  });
 }
 
 // ── USERS ──
 export async function getUser(uid) {
  const snap = await getDoc(doc(db, 'lamp_users', uid));
  return snap.exists() ? snap.data() : null;
 }
 export async function saveUser(uid, data) {
  await setDoc(doc(db, 'lamp_users', uid), data);
 }
 export async function updateUser(uid, data) {
  await updateDoc(doc(db, 'lamp_users', uid), data);
 }
 export async function getAllUsers() {
  const snap = await getDocs(collection(db, 'lamp_users'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
 }
 
 // ── CONTENT QUEUE ──
 export async function getQueueItems(platformFilter = null) {
  const snap = await getDocs(collection(db, 'lamp_content_queue'));
  let items = snap.docs
  .map(d => ({ id: d.id, ...d.data() }))
  .filter(item => item.status === 'pending' || item.status === 'draft' || item.status === 'approved');
  if (platformFilter && platformFilter !== 'all') {
  items = items.filter(item => item.platform === platformFilter);
  }
  items.sort((a, b) => {
  const aTime = a.createdAt?.seconds || 0;
  const bTime = b.createdAt?.seconds || 0;
  return bTime - aTime;
  });
  return items;
 }
 export async function addToQueue(item) {
  const ref = await addDoc(collection(db, 'lamp_content_queue'), {
  ...item,
  status: 'pending',
  createdAt: serverTimestamp()
  });
  return ref.id;
 }
 export async function updateQueueItem(id, data) {
  await updateDoc(doc(db, 'lamp_content_queue', id), {
  ...data,
  updatedAt: serverTimestamp()
  });
 }
 
 // ── CONTENT HISTORY ──
 export async function getHistoryItems(limitCount = 100) {
  const snap = await getDocs(collection(db, 'lamp_content_queue'));
  let items = snap.docs
  .map(d => ({ id: d.id, ...d.data() }))
  .filter(item => item.status === 'sent' || item.status === 'archived');
  items.sort((a, b) => {
  const aTime = a.sentAt?.seconds || a.createdAt?.seconds || 0;
  const bTime = b.sentAt?.seconds || b.createdAt?.seconds || 0;
  return bTime - aTime;
  });
  return items.slice(0, limitCount);
 }
 
 // ── FOLLOW-UP TASKS ──
 export async function getFollowUpTasks() {
  const snap = await getDocs(collection(db, 'lamp_followup'));
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  .filter(item => item.status === 'pending');
  items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  return items;
 }
 export async function addFollowUpTask(data) {
  await addDoc(collection(db, 'lamp_followup'), {
  ...data,
  status: 'pending',
  createdAt: serverTimestamp()
  });
 }
 export async function completeFollowUpTask(id) {
  await updateDoc(doc(db, 'lamp_followup', id), {
  status: 'done',
  completedAt: serverTimestamp()
  });
 }
 
 // ── CALENDAR ──
 export async function getCalendarItems(weekStart) {
  const snap = await getDocs(collection(db, 'lamp_calendar'));
  return snap.docs
  .map(d => ({ id: d.id, ...d.data() }))
  .filter(item => item.weekStart === weekStart);
 }
 export async function addCalendarItem(data) {
  await addDoc(collection(db, 'lamp_calendar'), {
  ...data,
  createdAt: serverTimestamp()
  });
 }
 export async function updateCalendarItem(id, data) {
  await updateDoc(doc(db, 'lamp_calendar', id), data);
 }
 
 // ── KNOWLEDGE DUMP ──
 export async function getKnowledgeDocuments() {
  const snap = await getDocs(collection(db, 'lamp_knowledge'));
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  return items;
 }
 export async function addKnowledgeDocument(data) {
  await addDoc(collection(db, 'lamp_knowledge'), {
  ...data,
  createdAt: serverTimestamp()
  });
 }
 
 // ── SERMON DOCUMENTS ──
 export async function saveSermonBrief(brief) {
  const id = `sermon_${Date.now()}`;
  await setDoc(doc(db, 'lamp_sermons', id), {
  ...brief,
  createdAt: serverTimestamp()
  });
  return id;
 }
 export async function getRecentSermons(limitCount = 10) {
  const snap = await getDocs(collection(db, 'lamp_sermons'));
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  return items.slice(0, limitCount);
 }
 
 // ── PROMPT RUNS ──
 export async function logPromptRun(data) {
  try {
  await addDoc(collection(db, 'lamp_prompt_runs'), {
  ...data,
  createdAt: serverTimestamp()
  });
  } catch { }
 }
 
 // ── CONTENT FEEDBACK ──
 export async function logFeedback(contentId, action) {
  try {
  await addDoc(collection(db, 'lamp_feedback'), {
  contentId,
  action,
  createdAt: serverTimestamp()
  });
  } catch { }
 }
