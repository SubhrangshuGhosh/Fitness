import { useState, useCallback } from 'react';

const API_URL = import.meta.env.DEV
  ? 'http://localhost:3001/api/generate'
  : '/api/generate';

export function useGemini() {
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async (prompt) => {
    setIsLoading(true);
    setError(null);
    setPlan(null);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setPlan(data.plan);
      return data.plan;
    } catch (err) {
      console.error('Gemini error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPlan(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { plan, isLoading, error, generate, reset };
}