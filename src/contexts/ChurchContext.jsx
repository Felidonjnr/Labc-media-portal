// src/contexts/ChurchContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { getChurchKnowledge } from '../services/firestore/db';

const ChurchContext = createContext();

export const useChurch = () => useContext(ChurchContext);

export function ChurchProvider({ children }) {
  const [knowledge, setKnowledge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getChurchKnowledge();
      setKnowledge(data);
    } catch (err) {
      console.error('Church knowledge error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    const data = await getChurchKnowledge();
    setKnowledge(data);
  }

  return (
    <ChurchContext.Provider value={{ knowledge, loading, refresh }}>
      {children}
    </ChurchContext.Provider>
  );
}
