import { useEffect, useState } from "react";

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  pubDate: string | null;
  description: string;
}

const BASE = import.meta.env.BASE_URL ?? "/";

export function useNews() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${BASE}api/news`)
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          setItems(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  return { items, loading, error };
}
