import { useState } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function getUserId(): string {
  const key = "uk-edguide-user-id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = getUserId();

  async function startCheckout(priceId: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/api/stripe/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, userId }),
      });
      if (!res.ok) throw new Error("Failed to create checkout session");
      const { url } = await res.json();
      window.location.href = url;
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
      setLoading(false);
    }
  }

  async function openPortal() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/api/stripe/portal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("No active subscription found");
      const { url } = await res.json();
      window.location.href = url;
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
      setLoading(false);
    }
  }

  async function checkPremium(): Promise<boolean> {
    try {
      const res = await fetch(`${BASE}/api/stripe/subscription/${userId}`);
      const data = await res.json();
      return data.isPremium ?? false;
    } catch {
      return false;
    }
  }

  return { userId, loading, error, startCheckout, openPortal, checkPremium };
}
