import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import type { AuthUser } from "@/contexts/AuthContext";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface Props {
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}

export function LoginModal({ onClose, onSuccess }: Props) {
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = (nextTab: "signin" | "register") => {
    setTab(nextTab);
    setError("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = tab === "signin"
      ? `${BASE}/api/auth/login`
      : `${BASE}/api/auth/register`;

    const body = tab === "signin"
      ? { email, password }
      : { email, password, firstName: firstName.trim(), lastName: lastName.trim() };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        onSuccess(data.user);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        {/* Logo stripe */}
        <div className="h-1" style={{ background: "linear-gradient(90deg, hsl(224,76%,28%), hsl(354,72%,40%))" }} />

        {/* Header */}
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900">
                {tab === "signin" ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {tab === "signin"
                  ? "Sign in to your MyPassUK account"
                  : "Join MyPassUK — it's free"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 mx-6">
          {(["signin", "register"] as const).map(t => (
            <button
              key={t}
              onClick={() => reset(t)}
              className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t === "signin" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
          {tab === "register" && (
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              required
              autoComplete="email"
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type={showPw ? "text" : "password"}
              placeholder={tab === "register" ? "Password (min. 8 characters)" : "Password"}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              required
              autoComplete={tab === "signin" ? "current-password" : "new-password"}
              className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="button"
              onClick={() => setShowPw(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: "linear-gradient(135deg, hsl(224,76%,28%) 0%, hsl(354,72%,40%) 100%)" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {tab === "signin" ? "Signing in…" : "Creating account…"}
              </span>
            ) : (
              tab === "signin" ? "Sign In" : "Create Account"
            )}
          </button>
        </form>

        <div className="px-6 pb-5 text-center">
          <p className="text-xs text-slate-400">
            Your data is stored securely and never shared with third parties.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
