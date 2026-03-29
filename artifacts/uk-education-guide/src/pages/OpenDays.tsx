import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar, MapPin, Clock, ExternalLink, ChevronRight,
  Building2, GraduationCap, Briefcase, Filter, Search,
  Bell, Star, AlertCircle, Wrench, FlaskConical, X
} from "lucide-react";
import { useGetInstitutions } from "@workspace/api-client-react";
import { Link } from "wouter";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useNation } from "@/contexts/NationContext";

const NATION_REGION_MAP: Record<string, string> = {
  scotland: "Scotland",
  wales: "Wales",
  england: "All Regions",
  "northern-ireland": "All Regions",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function daysUntil(iso: string): number {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return Math.ceil((new Date(iso).getTime() - now.getTime()) / 86400000);
}

function isUrgent(deadline: string | null | undefined): boolean {
  if (!deadline) return false;
  const d = new Date(deadline);
  if (isNaN(d.getTime())) return false;
  return daysUntil(deadline) <= 30;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  "University":            { color: "text-blue-700",    bg: "bg-blue-100",    icon: GraduationCap, label: "University" },
  "College":               { color: "text-rose-700",    bg: "bg-rose-100",    icon: Building2,     label: "College" },
  "Apprenticeship Provider": { color: "text-orange-700", bg: "bg-orange-100",  icon: Briefcase,     label: "Apprenticeship" },
  "Industrial Placement":  { color: "text-emerald-700", bg: "bg-emerald-100", icon: Wrench,        label: "Industrial Placement" },
  "Conservatoire":         { color: "text-violet-700",  bg: "bg-violet-100",  icon: Star,          label: "Conservatoire" },
};

const REGIONS = [
  "All Regions", "London", "South East", "South West", "Midlands",
  "North West", "North East", "Yorkshire", "East of England", "Wales", "Scotland",
];

interface EventEntry {
  institutionId: number;
  institutionName: string;
  type: string;
  region: string;
  city: string;
  date: string;
  applicationDeadline: string | null;
  applicationsOpen: string | null;
  websiteUrl: string | null;
  featured: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OpenDays() {
  const { nation } = useNation();
  const { data: institutions = [], isLoading } = useGetInstitutions({ limit: 400 });

  const [typeFilter, setTypeFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState(() => nation ? (NATION_REGION_MAP[nation] ?? "All Regions") : "All Regions");
  const [search, setSearch] = useState("");
  const [showPast, setShowPast] = useState(false);

  // Sync region filter whenever the user switches nation
  useEffect(() => {
    setRegionFilter(nation ? (NATION_REGION_MAP[nation] ?? "All Regions") : "All Regions");
  }, [nation]);

  const today = new Date().toISOString().slice(0, 10);

  // Flatten all open day dates into individual event entries
  const allEvents = useMemo<EventEntry[]>(() => {
    const events: EventEntry[] = [];
    for (const inst of institutions as any[]) {
      const dates: string[] = inst.openDayDates ?? [];
      for (const date of dates) {
        events.push({
          institutionId: inst.id,
          institutionName: inst.name,
          type: inst.type,
          region: inst.region,
          city: inst.city,
          date,
          applicationDeadline: inst.applicationDeadline,
          applicationsOpen: inst.applicationsOpen,
          websiteUrl: inst.websiteUrl,
          featured: inst.featured,
        });
      }
    }
    return events.sort((a, b) => a.date.localeCompare(b.date));
  }, [institutions]);

  const filtered = useMemo(() => {
    return allEvents.filter(ev => {
      if (!showPast && ev.date < today) return false;
      if (typeFilter !== "All" && ev.type !== typeFilter) return false;
      if (regionFilter !== "All Regions" && ev.region !== regionFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!ev.institutionName.toLowerCase().includes(q) && !ev.city.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [allEvents, typeFilter, regionFilter, search, showPast, today]);

  // Group by month
  const grouped = useMemo(() => {
    const map = new Map<string, EventEntry[]>();
    for (const ev of filtered) {
      const key = formatMonth(ev.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const upcomingCount = allEvents.filter(e => e.date >= today).length;
  const types = ["All", ...Object.keys(TYPE_CONFIG).filter(t => allEvents.some(e => e.type === t))];

  if (isLoading) return <LoadingSpinner className="mt-32" />;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-primary/90 to-indigo-950 px-4 py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 70% 30%, hsl(354,72%,50%) 0%, transparent 50%)" }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white/80 border border-white/15 rounded-full text-sm font-medium mb-5">
            <Calendar className="w-4 h-4" /> Open Days &amp; Recruitment Events
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
            Upcoming Events &amp; Open Days
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mb-8">
            Every open day, insight day and application deadline across universities, colleges, apprenticeship providers and industrial placement programmes — all in one calendar.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Upcoming events", value: upcomingCount.toString() },
              { label: "Institutions covered", value: institutions.length.toString() },
              { label: "Regions", value: "11" },
              { label: "Types of programme", value: Object.keys(TYPE_CONFIG).length.toString() },
            ].map(s => (
              <div key={s.label} className="bg-white/10 border border-white/15 rounded-2xl px-5 py-3 text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-8 flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search institution or city…"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
            />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>}
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400 mr-1" />
            {types.map(t => {
              const cfg = t !== "All" ? TYPE_CONFIG[t] : null;
              return (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    typeFilter === t
                      ? "bg-primary text-white border-primary"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {cfg && <cfg.icon className="w-3 h-3" />}
                  {t === "All" ? "All Types" : TYPE_CONFIG[t]?.label ?? t}
                </button>
              );
            })}
          </div>

          {/* Region filter */}
          <select
            value={regionFilter}
            onChange={e => setRegionFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 outline-none focus:ring-2 focus:ring-primary/20"
          >
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          {/* Past events toggle */}
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer whitespace-nowrap">
            <input type="checkbox" checked={showPast} onChange={e => setShowPast(e.target.checked)} className="rounded" />
            Show past events
          </label>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-900">{filtered.length}</span> events found
            {typeFilter !== "All" && <> · <span className="text-primary font-semibold">{TYPE_CONFIG[typeFilter]?.label}</span></>}
            {regionFilter !== "All Regions" && <> · <span className="text-primary font-semibold">{regionFilter}</span></>}
          </p>
          {(typeFilter !== "All" || regionFilter !== "All Regions" || search) && (
            <button onClick={() => { setTypeFilter("All"); setRegionFilter("All Regions"); setSearch(""); }}
              className="text-xs text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
            <span key={type} className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
              <cfg.icon className="w-3 h-3" /> {cfg.label}
            </span>
          ))}
        </div>

        {/* No results */}
        {grouped.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-600 mb-1">No events found</p>
            <p className="text-sm text-slate-400">Try adjusting your filters or enabling past events.</p>
          </div>
        )}

        {/* Grouped by month */}
        <div className="space-y-10">
          {grouped.map(([month, events]) => (
            <div key={month}>
              {/* Month header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-slate-200" />
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full font-bold text-sm">
                  <Calendar className="w-4 h-4" />
                  {month}
                  <span className="bg-primary/20 rounded-full px-2 py-0.5 text-xs">{events.length}</span>
                </div>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Event cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((ev, i) => {
                  const cfg = TYPE_CONFIG[ev.type] ?? TYPE_CONFIG["University"];
                  const days = daysUntil(ev.date);
                  const isPast = ev.date < today;
                  const deadlineUrgent = isUrgent(ev.applicationDeadline);

                  return (
                    <motion.div
                      key={`${ev.institutionId}-${ev.date}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.4) }}
                      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all group ${
                        isPast ? "opacity-60 border-slate-100" : ev.featured ? "border-amber-200" : "border-slate-100"
                      }`}
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            {ev.featured && (
                              <div className="flex items-center gap-1 text-amber-600 text-[10px] font-bold mb-1">
                                <Star className="w-3 h-3 fill-amber-500" /> Featured
                              </div>
                            )}
                            <Link href={`/institutions/${ev.institutionId}`}>
                              <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-primary transition-colors cursor-pointer truncate">
                                {ev.institutionName}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                                <cfg.icon className="w-3 h-3" /> {cfg.label}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-slate-500">
                                <MapPin className="w-3 h-3" /> {ev.city}
                              </span>
                            </div>
                          </div>

                          {/* Date badge */}
                          <div className={`shrink-0 rounded-xl text-center px-3 py-2 min-w-[56px] ${isPast ? "bg-slate-100" : "bg-primary/10"}`}>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isPast ? "text-slate-400" : "text-primary/70"}`}>
                              {new Date(ev.date).toLocaleDateString("en-GB", { month: "short" })}
                            </p>
                            <p className={`text-2xl font-bold leading-none ${isPast ? "text-slate-400" : "text-primary"}`}>
                              {new Date(ev.date).getDate()}
                            </p>
                            <p className={`text-[10px] font-medium ${isPast ? "text-slate-400" : "text-primary/60"}`}>
                              {new Date(ev.date).getFullYear()}
                            </p>
                          </div>
                        </div>

                        {/* Date & deadline info */}
                        <div className="space-y-1.5 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {isPast ? (
                              <span className="text-slate-400">Event passed</span>
                            ) : (
                              <span className="text-slate-700">
                                <span className="font-semibold">{formatDateShort(ev.date)}</span>
                                {days === 0 ? " — Today!" : days === 1 ? " — Tomorrow" : ` — in ${days} days`}
                              </span>
                            )}
                          </div>

                          {ev.applicationDeadline && (
                            <div className={`flex items-center gap-2 text-sm ${deadlineUrgent && !isPast ? "text-accent font-semibold" : "text-slate-500"}`}>
                              {deadlineUrgent && !isPast ? <AlertCircle className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                              Apply by: <span className="font-semibold">{ev.applicationDeadline}</span>
                              {deadlineUrgent && !isPast && " — closing soon!"}
                            </div>
                          )}

                          {ev.applicationsOpen && (
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <Bell className="w-3 h-3 shrink-0" />
                              Applications open: {ev.applicationsOpen}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Link href={`/institutions/${ev.institutionId}`}>
                            <button className="flex-1 py-2 px-4 rounded-xl bg-slate-100 hover:bg-primary/10 hover:text-primary text-sm font-semibold text-slate-700 transition-colors text-center">
                              View Profile
                            </button>
                          </Link>
                          {ev.websiteUrl && (
                            <a href={ev.websiteUrl} target="_blank" rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {filtered.length > 0 && (
          <div className="mt-12 text-center bg-white rounded-2xl border border-slate-100 p-8">
            <Bell className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Don't miss an event</h3>
            <p className="text-sm text-slate-500 mb-4 max-w-md mx-auto">
              Use the recruitment alerts bell in the top navbar to get notified about upcoming open days and application deadlines.
            </p>
            <Link href="/institutions">
              <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
                Browse All Institutions
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
