import { Link } from "wouter";
import { FileText, Newspaper, ExternalLink, ArrowRight } from "lucide-react";
import { useNews } from "@/hooks/useNews";

const SOURCE_COLORS: Record<string, string> = {
  "BBC Education": "bg-red-900/60 text-red-200",
  "TES": "bg-amber-900/60 text-amber-200",
  "DfE Gov.UK": "bg-blue-900/60 text-blue-200",
  "Times Higher Education": "bg-violet-900/60 text-violet-200",
};

function formatRelative(pubDate: string | null): string {
  if (!pubDate) return "";
  const d = new Date(pubDate);
  if (isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(diff / 86400000);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function NewsTicker() {
  const { items, loading } = useNews();

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden py-1">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="shrink-0 w-72 h-28 rounded-xl bg-slate-800/60 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <div
      className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {items.map((item, i) => {
        const badgeClass = SOURCE_COLORS[item.source] ?? "bg-slate-700 text-slate-300";
        const rel = formatRelative(item.pubDate);
        return (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group shrink-0 w-72 snap-start bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 hover:border-slate-500/70 rounded-xl p-4 flex flex-col gap-2.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${badgeClass}`}>
                {item.source}
              </span>
              {rel && (
                <span className="text-[10px] text-slate-500 shrink-0">{rel}</span>
              )}
            </div>
            <p className="text-sm font-semibold text-slate-200 leading-snug group-hover:text-white line-clamp-3 transition-colors">
              {item.title}
            </p>
            {item.description && (
              <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 flex-1">
                {item.description}
              </p>
            )}
            <div className="flex items-center gap-1 text-[11px] text-primary/70 group-hover:text-primary font-semibold transition-colors mt-auto pt-1">
              Read more <ExternalLink className="w-3 h-3" />
            </div>
          </a>
        );
      })}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-24">

      {/* ── News Feed Band ──────────────────────────────────────── */}
      <div className="border-b border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20">
                <Newspaper className="w-4 h-4 text-primary" />
              </span>
              <h3 className="font-display font-bold text-white text-lg tracking-tight">
                Latest in UK Education
              </h3>
              <span className="hidden sm:inline text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full font-medium">
                Live feeds · BBC · TES · DfE · THE
              </span>
            </div>
            <a
              href="https://www.tes.com/news"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors font-medium"
            >
              More news <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <NewsTicker />
        </div>
      </div>

      {/* ── Main Footer Links ────────────────────────────────────── */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <svg width="40" height="40" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="fbg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#1e3a8a"/>
                      <stop offset="100%" stopColor="#172562"/>
                    </linearGradient>
                  </defs>
                  <rect width="36" height="36" rx="8" fill="url(#fbg)"/>
                  <rect width="36" height="36" rx="8" fill="white" fillOpacity="0.07"/>
                  <polygon points="18,6 30,12 18,18 6,12" fill="white" fillOpacity="0.95"/>
                  <path d="M10 14 L10 22 Q18 26 26 22 L26 14 Q18 18 10 14Z" fill="white" fillOpacity="0.82"/>
                  <line x1="30" y1="12" x2="30" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6"/>
                  <circle cx="30" cy="21.5" r="1.8" fill="white" fillOpacity="0.55"/>
                  <circle cx="27" cy="27" r="8" fill="#be123c"/>
                  <path d="M23 27 L26 30 L31.5 23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-display font-bold text-2xl text-white tracking-tight">
                  My<span style={{ background: "linear-gradient(135deg,#60a5fa,#93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Pass</span>
                  <span className="ml-1 px-1.5 py-0.5 text-[11px] font-black text-white rounded align-middle relative -top-0.5"
                    style={{ background: "linear-gradient(135deg,hsl(354,72%,40%),hsl(354,72%,32%))" }}>UK</span>
                </span>
              </Link>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Helping UK school leavers pass their exams and find their path — with expert guides, 287 institutions, 69 career profiles and AI-powered study tools.
              </p>
            </div>

            <div>
              <h4 className="font-display font-bold text-white mb-6">Resources</h4>
              <ul className="space-y-4">
                <li><Link href="/subjects" className="hover:text-primary transition-colors">GCSE & A-Level Prep</Link></li>
                <li><Link href="/careers" className="hover:text-primary transition-colors">Career Explorer</Link></li>
                <li><Link href="/institutions" className="hover:text-primary transition-colors">Find Universities</Link></li>
                <li><Link href="/routes" className="hover:text-primary transition-colors">Study Routes</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">About MyPassUK</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-white mb-6">Tools</h4>
              <ul className="space-y-4">
                <li><Link href="/quiz" className="hover:text-primary transition-colors">Recommendation Quiz</Link></li>
                <li><Link href="/timetable" className="hover:text-primary transition-colors">Study Planner</Link></li>
                <li><Link href="/tutors" className="hover:text-primary transition-colors">Find a Tutor</Link></li>
                <li><Link href="/open-days" className="hover:text-primary transition-colors">Open Days Calendar</Link></li>
                <li>
                  <Link href="/flyer" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                    <FileText className="w-3.5 h-3.5" />
                    Advertising Flyer
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} MyPassUK. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
