// src/hooks/useToast.js
import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, duration = 2500) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }, []);
  return { toast, showToast };
}

export function useCopy(showToast) {
  const copy = useCallback(async (text, label = '') => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(label ? `✓ ${label} copied!` : '✓ Copied to clipboard!');
      return true;
    } catch {
      showToast('Copy failed — try selecting and copying manually');
      return false;
    }
  }, [showToast]);
  return copy;
}
