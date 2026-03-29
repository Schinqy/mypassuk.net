import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@workspace/replit-auth-web";

export interface SavedSubject {
  id: number;
  subjectId: number;
  savedAt: string | null;
  name: string | null;
  level: string | null;
  category: string | null;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function useSavedSubjects() {
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState<SavedSubject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setSaved([]);
      return;
    }
    setLoading(true);
    fetch(`${BASE}/api/saved/subjects`, { credentials: "include" })
      .then(r => r.json())
      .then(d => { setSaved(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isAuthenticated]);

  const savedIds = new Set(saved.map(s => s.subjectId));

  const toggle = useCallback(async (subjectId: number) => {
    if (!isAuthenticated) return false;

    if (savedIds.has(subjectId)) {
      await fetch(`${BASE}/api/saved/subjects/${subjectId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setSaved(prev => prev.filter(s => s.subjectId !== subjectId));
    } else {
      const res = await fetch(`${BASE}/api/saved/subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ subjectId }),
      });
      const data = await res.json();
      if (data.saved) {
        setSaved(prev => [...prev, {
          id: data.id,
          subjectId,
          savedAt: new Date().toISOString(),
          name: null,
          level: null,
          category: null,
        }]);
      }
    }
    return true;
  }, [isAuthenticated, savedIds]);

  return { saved, savedIds, loading, toggle, isAuthenticated };
}
