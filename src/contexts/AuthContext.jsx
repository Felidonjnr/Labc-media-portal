// src/contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from '../firebase';
import { getUser, saveUser } from '../services/firestore/db';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(!!auth);

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    // Safety Timeout: If Firebase takes > 10s, force loading to false
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.warn("Auth initialization timed out. Rescuing...");
        setLoading(false);
      }
    }, 10000);

    if (!auth || !auth.onAuthStateChanged) {
      console.error("Firebase Auth is not initialized.");
      setIsConfigured(false);
      setLoading(false);
      clearTimeout(safetyTimer);
      return;
    }
    
    setIsConfigured(true);
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadProfile(firebaseUser);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
      clearTimeout(safetyTimer);
    });
    return () => {
      unsub();
      clearTimeout(safetyTimer);
    };
  }, []);

  async function loadProfile(firebaseUser) {
    try {
      let profile = await getUser(firebaseUser.uid);
      if (!profile) {
        const isAdmin = firebaseUser.email === ADMIN_EMAIL;
        profile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL || null,
          role: isAdmin ? 'admin' : 'member',
          status: isAdmin ? 'approved' : 'pending',
          department: 'Media',
          joinedAt: new Date().toISOString()
        };
        await saveUser(firebaseUser.uid, profile);
      }
      setUserProfile(profile);
    } catch (err) {
      console.error('Profile error:', err);
      setUserProfile({ status: 'error' });
    }
  }

  async function loginWithEmail(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    await signOut(auth);
  }

  const isAdmin = userProfile?.role === 'admin';
  const isApproved = userProfile?.status === 'approved';

  return (
    <AuthContext.Provider value={{
      user, userProfile, loading, isConfigured,
      loginWithEmail, logout,
      isAdmin, isApproved
    }}>
      {children}
    </AuthContext.Provider>
  );
}
