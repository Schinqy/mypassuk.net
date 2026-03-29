import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { useNation, NATIONS } from "@/contexts/NationContext";
import { FlagSvg } from "@/components/FlagSvg";
import {
  User, Mail, Crown, CalendarDays, CreditCard, LogOut,
  Globe, Settings, ShieldCheck, Trash2, ChevronRight, Loader2,
  BadgeCheck, Sparkles, BookOpen, Bookmark, Terminal, Users, BarChart3,
  Eye, EyeOff, Gift, MessageSquare, Lock
} from "lucide-react";
import { useSavedSubjects } from "@/hooks/useSavedSubjects";

const ADMIN_LS = "mypassuk-admin-secret";
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface AccountData {
  user: {
    id: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    profileImageUrl?: string | null;
  };
  subscription: {
    isPremium: boolean;
    planLabel: string;
    status: string;
    currentPeriodEnd?: string | null;
    cancelAtPeriodEnd?: boolean;
  };
}

interface AdminStats {
  users: { total: number; premium: number };
  content: { subjects: number; careers: number; institutions: number };
  activity: { aiConversations: number; savedSubjects: number };
  promoCodes: { total: number; used: number; available: number };
}

function AdminWidget() {
  const [secret, setSecret] = useState<string | null>(() => {
    try { return localStorage.getItem(ADMIN_LS); } catch { return null; }
  });
  const [input, setInput] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!secret) return;
    fetch(`${BASE}/api/admin/stats`, { headers: { "x-admin-secret": secret } })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) { setStats(d); setOpen(true); }
        else { localStorage.removeItem(ADMIN_LS); setSecret(null); }
      })
      .catch(() => {});
  }, [secret]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch(`${BASE}/api/admin/stats`, { headers: { "x-admin-secret": input } });
    if (res.ok) {
      localStorage.setItem(ADMIN_LS, input);
      setSecret(input);
      const d = await res.json();
      setStats(d);
      setOpen(true);
    } else {
      setError("Incorrect admin password.");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_LS);
    setSecret(null); setStats(null); setOpen(false); setInput("");
  };

  if (!secret || !stats) {
    return (
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Lock className="w-4 h-4" /> Administration
          </span>
          <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-90" : ""}`} />
        </button>
        {open && (
          <div className="px-6 pb-5">
            <p className="text-xs text-slate-500 mb-3">Enter your admin password to access platform controls.</p>
            <form onSubmit={handleLogin} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showPw ? "text" : "password"}
                  value={input}
                  onChange={e => { setInput(e.target.value); setError(""); }}
                  placeholder="Admin password"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading || !input}
                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
              </button>
            </form>
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <Terminal className="w-4 h-4 text-primary" /> Administration
        </span>
        <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-red-500 transition-colors">Sign out of admin</button>
      </div>
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Users className="w-3.5 h-3.5" /> Users
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.users.total}</p>
            <p className="text-xs text-slate-500">{stats.users.premium} premium</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Gift className="w-3.5 h-3.5" /> Promo Codes
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.promoCodes.available}</p>
            <p className="text-xs text-slate-500">{stats.promoCodes.used}/{stats.promoCodes.total} used</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <MessageSquare className="w-3.5 h-3.5" /> AI Chats
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.activity.aiConversations}</p>
            <p className="text-xs text-slate-500">total conversations</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Bookmark className="w-3.5 h-3.5" /> Saved Subjects
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.activity.savedSubjects}</p>
            <p className="text-xs text-slate-500">across all users</p>
          </div>
        </div>
        <Link href="/admin">
          <button className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
            <BarChart3 className="w-4 h-4" /> Open Full Admin Dashboard
          </button>
        </Link>
      </div>
    </section>
  );
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });
}

function PlanBadge({ label, isPremium }: { label: string; isPremium: boolean }) {
  if (!isPremium) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        <Globe className="w-3.5 h-3.5" /> Free
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold text-white shadow-sm"
      style={{ background: "linear-gradient(135deg, hsl(224,76%,28%), hsl(354,72%,40%))" }}>
      <Crown className="w-3.5 h-3.5" /> {label}
    </span>
  );
}

export default function Account() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();
  const { nation, openSelector } = useNation();
  const nationInfo = nation ? NATIONS.find(n => n.id === nation) : null;
  const { saved: savedSubjects, toggle: toggleSaved, loading: savedLoading } = useSavedSubjects();

  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [accountLoading, setAccountLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setAccountLoading(true);
      fetch("/api/account", { credentials: "include" })
        .then(r => r.json())
        .then(d => { setAccountData(d); setAccountLoading(false); })
        .catch(() => setAccountLoading(false));
    }
  }, [isAuthenticated]);

  const openBillingPortal = async () => {
    setPortalLoading(true);
    const userId = user?.id ?? localStorage.getItem("uk-edguide-user-id") ?? "";
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.url) window.open(data.url, "_blank", "noopener");
      else alert("Could not open billing portal. Please try again.");
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  };

  const clearLocalData = () => {
    if (!clearConfirm) { setClearConfirm(true); return; }
    const keysToRemove = Object.keys(localStorage).filter(k =>
      k.startsWith("uk-edguide") || k.startsWith("mypassuk")
    );
    keysToRemove.forEach(k => localStorage.removeItem(k));
    setClearConfirm(false);
    window.location.reload();
  };

  // Not logged in
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <User className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">Sign in to MyPassUK</h1>
        <p className="text-slate-500 max-w-sm mb-8">
          Create a free account to save your progress, sync your Premium subscription across devices, and unlock personalised features.
        </p>
        <button
          onClick={login}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          style={{ background: "linear-gradient(135deg, hsl(224,76%,28%) 0%, hsl(224,76%,22%) 50%, hsl(354,72%,36%) 100%)" }}
        >
          <ShieldCheck className="w-5 h-5" />
          Sign in with Replit
        </button>
        <p className="mt-4 text-xs text-slate-400">Safe, secure sign-in. No password needed.</p>
      </div>
    );
  }

  // Loading
  if (isLoading || accountLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const sub = accountData?.subscription;
  const profile = accountData?.user ?? user;
  const displayName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "My Account";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-display font-bold text-slate-900">Account Settings</h1>
      </div>

      {/* Profile card */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5">
        <div className="flex items-start gap-4">
          {profile?.profileImageUrl ? (
            <img
              src={profile.profileImageUrl}
              alt={displayName}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 ring-2 ring-primary/20">
              <span className="text-2xl font-bold text-white">
                {(profile?.firstName?.[0] ?? profile?.email?.[0] ?? "U").toUpperCase()}
              </span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-display font-bold text-slate-900 truncate">{displayName}</h2>
            {profile?.email && (
              <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{profile.email}</span>
              </div>
            )}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <PlanBadge label={sub?.planLabel ?? "Free"} isPremium={sub?.isPremium ?? false} />
              {sub?.isPremium && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                  <BadgeCheck className="w-3.5 h-3.5" /> Active
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Plan & Billing */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-500" /> Plan & Billing
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600">Current plan</span>
            <PlanBadge label={sub?.planLabel ?? "Free"} isPremium={sub?.isPremium ?? false} />
          </div>

          {sub?.isPremium && sub.currentPeriodEnd && (
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                {sub.cancelAtPeriodEnd ? "Access until" : "Renews on"}
              </span>
              <span className="text-sm font-semibold text-slate-800">{formatDate(sub.currentPeriodEnd)}</span>
            </div>
          )}

          {sub?.cancelAtPeriodEnd && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
              Your subscription is set to cancel. You'll keep Premium access until {formatDate(sub.currentPeriodEnd)}.
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {sub?.isPremium ? (
            <button
              onClick={openBillingPortal}
              disabled={portalLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors disabled:opacity-60"
            >
              {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              Manage Billing
            </button>
          ) : (
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, hsl(224,76%,28%), hsl(354,72%,40%))" }}
            >
              <Sparkles className="w-4 h-4" /> Upgrade to Premium
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </section>

      {/* Nation preference */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" /> Nation Preference
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {nationInfo ? (
              <FlagSvg nation={nationInfo.id} className="w-10 h-7 rounded shadow-sm shrink-0" />
            ) : (
              <span className="text-2xl">🇬🇧</span>
            )}
            <div>
              <p className="font-semibold text-slate-800">{nationInfo?.label ?? "Not selected"}</p>
              <p className="text-xs text-slate-500">
                {nationInfo ? `Exam content tailored for ${nationInfo.label}` : "Select your nation for personalised content"}
              </p>
            </div>
          </div>
          <button
            onClick={openSelector}
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Change
          </button>
        </div>
      </section>

      {/* Saved Subjects */}
      {isAuthenticated && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5">
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-primary" /> Saved Subjects
          </h3>
          {savedLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            </div>
          ) : savedSubjects.length === 0 ? (
            <p className="text-sm text-slate-500">
              No saved subjects yet. Browse <Link href="/subjects" className="text-primary font-semibold hover:underline">Subjects</Link> and bookmark the ones you're studying.
            </p>
          ) : (
            <div className="space-y-2">
              {savedSubjects.map(s => (
                <div key={s.id} className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-0">
                  <Link href={`/subjects/${s.subjectId}`} className="flex items-center gap-3 min-w-0 group">
                    <div className="bg-blue-50 p-2 rounded-lg shrink-0">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-primary transition-colors">
                        {s.name ?? `Subject ${s.subjectId}`}
                      </p>
                      {(s.level || s.category) && (
                        <p className="text-xs text-slate-500 truncate">{[s.level, s.category].filter(Boolean).join(" · ")}</p>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => toggleSaved(s.subjectId)}
                    title="Remove"
                    className="p-1.5 rounded-lg text-slate-300 hover:text-accent hover:bg-red-50 transition-all shrink-0"
                  >
                    <Bookmark className="w-4 h-4 fill-current text-primary" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Data & Security */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-500" /> Data & Security
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600">Account ID</span>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-lg max-w-[160px] truncate">
              {profile?.id}
            </span>
          </div>

          <div className="pt-1">
            <button
              onClick={clearLocalData}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                clearConfirm
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "text-red-600 border border-red-200 bg-red-50 hover:bg-red-100"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              {clearConfirm ? "Confirm — clear all local data" : "Clear local data"}
            </button>
            {clearConfirm && (
              <p className="text-xs text-red-500 mt-2">This removes saved preferences, chat history, and local progress. Your account and subscription are unaffected.</p>
            )}
          </div>
        </div>
      </section>

      {/* Sign out */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-800">Sign out</p>
            <p className="text-sm text-slate-500 mt-0.5">You'll be signed out of your account on this device.</p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </section>

      {/* Admin */}
      <AdminWidget />
    </div>
  );
}
