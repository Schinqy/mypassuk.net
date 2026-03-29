import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, LogOut, RefreshCw, Plus, Trash2, RotateCcw,
  CheckCircle, XCircle, Clock, Gift, Copy, Check,
} from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const LS_KEY = "mypassuk-admin-secret";

interface PromoCode {
  code: string;
  isUsed: boolean;
  usedAt: string | null;
  createdAt: string;
}

interface Stats {
  total: number;
  used: number;
  available: number;
}

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ─── Login screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (secret: string) => void }) {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/api/admin/promo-codes`, {
        headers: { "x-admin-secret": secret },
      });
      if (res.ok) {
        localStorage.setItem(LS_KEY, secret);
        onLogin(secret);
      } else {
        setError("Incorrect admin password. Try again.");
      }
    } catch {
      setError("Network error. Is the server running?");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 border border-primary/30 rounded-2xl mb-4">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">MyPassUK Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Enter your admin password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={secret}
            onChange={e => { setSecret(e.target.value); setError(""); }}
            placeholder="Admin password"
            autoFocus
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || !secret}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Checking…" : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Code row ────────────────────────────────────────────────────────────────

function CodeRow({
  code, secret, onRefresh,
}: {
  code: PromoCode;
  secret: string;
  onRefresh: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState<"reset" | "delete" | null>(null);
  const [busy, setBusy] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const doReset = async () => {
    setBusy(true);
    await fetch(`${BASE}/api/admin/promo-codes/${code.code}/reset`, {
      method: "PATCH",
      headers: { "x-admin-secret": secret },
    });
    setBusy(false);
    setConfirming(null);
    onRefresh();
  };

  const doDelete = async () => {
    setBusy(true);
    await fetch(`${BASE}/api/admin/promo-codes/${code.code}`, {
      method: "DELETE",
      headers: { "x-admin-secret": secret },
    });
    setBusy(false);
    setConfirming(null);
    onRefresh();
  };

  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors group">
      {/* Code + copy */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-sm text-white">{code.code}</span>
          <button
            onClick={copy}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-slate-300"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        {code.isUsed ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/15 text-red-400 text-xs font-bold rounded-full border border-red-500/20">
            <XCircle className="w-3 h-3" /> Used
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/15 text-green-400 text-xs font-bold rounded-full border border-green-500/20">
            <CheckCircle className="w-3 h-3" /> Available
          </span>
        )}
      </td>

      {/* Used at */}
      <td className="px-4 py-3 text-slate-400 text-sm">
        <span className="flex items-center gap-1.5">
          {code.isUsed && <Clock className="w-3.5 h-3.5 shrink-0" />}
          {fmt(code.usedAt)}
        </span>
      </td>

      {/* Created at */}
      <td className="px-4 py-3 text-slate-500 text-sm">{fmt(code.createdAt)}</td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {confirming === "reset" ? (
            <>
              <button onClick={doReset} disabled={busy} className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-lg hover:bg-amber-500/30 transition-colors">
                {busy ? "…" : "Confirm reset"}
              </button>
              <button onClick={() => setConfirming(null)} className="px-2.5 py-1 text-slate-500 text-xs rounded-lg hover:text-slate-300 transition-colors">Cancel</button>
            </>
          ) : confirming === "delete" ? (
            <>
              <button onClick={doDelete} disabled={busy} className="px-2.5 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500/30 transition-colors">
                {busy ? "…" : "Confirm delete"}
              </button>
              <button onClick={() => setConfirming(null)} className="px-2.5 py-1 text-slate-500 text-xs rounded-lg hover:text-slate-300 transition-colors">Cancel</button>
            </>
          ) : (
            <>
              {code.isUsed && (
                <button
                  onClick={() => setConfirming("reset")}
                  title="Mark as available again"
                  className="p-1.5 text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setConfirming("delete")}
                title="Delete code"
                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Add codes modal ──────────────────────────────────────────────────────────

function AddCodesModal({
  secret, onClose, onRefresh,
}: {
  secret: string;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [raw, setRaw] = useState("");
  const [result, setResult] = useState<{ inserted: string[]; skipped: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    const codes = raw.split(/[\n,]+/).map(s => s.trim().toUpperCase()).filter(Boolean);
    if (codes.length === 0) { setError("Enter at least one code."); return; }
    setLoading(true);
    setError("");
    const res = await fetch(`${BASE}/api/admin/promo-codes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ codes }),
    });
    const json = await res.json();
    setResult(json);
    setLoading(false);
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <h3 className="text-white font-bold text-lg mb-1">Add Promo Codes</h3>
        <p className="text-slate-400 text-sm mb-4">Enter one code per line, or separate with commas.</p>

        {!result ? (
          <>
            <textarea
              value={raw}
              onChange={e => { setRaw(e.target.value); setError(""); }}
              rows={6}
              placeholder={"MYPASS-SUMMER1\nMYPASS-SUMMER2\nMYPASS-SUMMER3"}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-2"
            />
            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={loading}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Adding…" : "Add Codes"}
              </button>
              <button onClick={onClose} className="px-4 py-2.5 text-slate-400 hover:text-white rounded-xl border border-slate-700 text-sm transition-colors">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            {result.inserted.length > 0 && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                <p className="text-green-400 text-sm font-bold mb-1">✓ Added {result.inserted.length} code{result.inserted.length !== 1 ? "s" : ""}</p>
                <p className="font-mono text-green-300 text-xs">{result.inserted.join(", ")}</p>
              </div>
            )}
            {result.skipped.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                <p className="text-amber-400 text-sm font-bold mb-1">⚠ Skipped {result.skipped.length} (already exist)</p>
                <p className="font-mono text-amber-300 text-xs">{result.skipped.join(", ")}</p>
              </div>
            )}
            <button onClick={onClose} className="w-full py-2.5 bg-slate-700 text-white rounded-xl font-bold text-sm hover:bg-slate-600 transition-colors">
              Done
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

function Dashboard({ secret, onLogout }: { secret: string; onLogout: () => void }) {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<"all" | "available" | "used">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/admin/promo-codes`, {
        headers: { "x-admin-secret": secret },
      });
      if (res.ok) {
        const json = await res.json();
        setCodes(json.codes);
        setStats(json.stats);
      }
    } finally {
      setLoading(false);
    }
  }, [secret]);

  useEffect(() => { load(); }, [load]);

  const filtered = codes.filter(c => {
    if (filter === "available") return !c.isUsed;
    if (filter === "used") return c.isUsed;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-bold text-white">MyPassUK Admin</span>
            <span className="text-slate-500 text-xs ml-2">Promo Codes</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Codes
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg text-sm transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total codes", value: stats.total, icon: Gift, color: "text-slate-300", bg: "bg-slate-800" },
              { label: "Available", value: stats.available, icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10 border border-green-500/20" },
              { label: "Used", value: stats.used, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border border-red-500/20" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className={`${bg} rounded-2xl p-5`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">{label}</span>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className={`text-3xl font-bold ${color}`}>{value}</div>
                {stats.total > 0 && (
                  <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${label === "Available" ? "bg-green-500" : label === "Used" ? "bg-red-500" : "bg-slate-500"}`}
                      style={{ width: `${(value / stats.total) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 mb-4 w-fit">
          {(["all", "available", "used"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors ${
                filter === f ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Codes table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Redeemed at</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center text-slate-500">
                      {loading ? "Loading…" : "No codes found"}
                    </td>
                  </tr>
                ) : (
                  filtered.map(code => (
                    <CodeRow key={code.code} code={code} secret={secret} onRefresh={load} />
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <p className="text-slate-600 text-xs text-center mt-6">
          MyPassUK Admin · Changes take effect immediately
        </p>
      </div>

      {/* Add codes modal */}
      <AnimatePresence>
        {showAdd && (
          <AddCodesModal secret={secret} onClose={() => setShowAdd(false)} onRefresh={load} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [secret, setSecret] = useState<string | null>(() => {
    try { return localStorage.getItem(LS_KEY); } catch { return null; }
  });

  const handleLogin = (s: string) => setSecret(s);

  const handleLogout = () => {
    localStorage.removeItem(LS_KEY);
    setSecret(null);
  };

  if (!secret) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <Dashboard secret={secret} onLogout={handleLogout} />;
}
