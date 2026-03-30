import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function ResetPassword() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setDone(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="h-1" style={{ background: "linear-gradient(90deg, hsl(224,76%,28%), hsl(354,72%,40%))" }} />

        <div className="px-8 py-8">
          {/* No token */}
          {!token && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-7 h-7 text-red-400" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Invalid link</h1>
              <p className="text-sm text-slate-500">
                This password reset link is missing or malformed. Please request a new one.
              </p>
              <Link href="/" className="inline-block mt-2 text-sm font-semibold text-primary hover:underline">
                Back to home
              </Link>
            </div>
          )}

          {/* Success */}
          {token && done && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 text-green-500" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Password updated!</h1>
              <p className="text-sm text-slate-500">
                Your password has been changed successfully. You can now sign in with your new password.
              </p>
              <Link href="/" className="inline-block mt-2 text-sm font-semibold text-primary hover:underline">
                Go to sign in
              </Link>
            </div>
          )}

          {/* Form */}
          {token && !done && (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">Choose a new password</h1>
                <p className="text-sm text-slate-500 mt-1">Must be at least 8 characters.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="New password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    required
                    minLength={8}
                    autoComplete="new-password"
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

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirm}
                    onChange={e => { setConfirm(e.target.value); setError(""); }}
                    required
                    autoComplete="new-password"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !password || !confirm}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, hsl(224,76%,28%) 0%, hsl(354,72%,40%) 100%)" }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Updating…
                    </span>
                  ) : "Set New Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
