import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Briefcase, Building2, Map, ArrowRight, Sparkles,
  GraduationCap, Users, Globe2, Star, ChevronRight, Zap,
  CalendarDays, BrainCircuit, Clock,
} from "lucide-react";
import { useNation, NATIONS, type Nation } from "@/contexts/NationContext";

// ─── Nation Themes ─────────────────────────────────────────────────────────────

const THEMES: Record<Nation, {
  bg: string;
  accentHex: string;
  pill: string;
  headline: string;
  subheadline: string;
  quals: string;
  ctaLabel: string;
  examBtn: string;
}> = {
  england: {
    bg: "from-slate-950 via-red-950/40 to-slate-900",
    accentHex: "#C8102E",
    pill: "bg-red-900/40 text-red-200 border-red-700/50",
    headline: "Ace your GCSEs & A-Levels",
    subheadline: "England's most complete exam prep, university finder, and career guide — built for school leavers like you.",
    quals: "GCSEs · A-Levels · BTECs · T-Levels",
    ctaLabel: "Find My Path",
    examBtn: "GCSE & A-Level Prep",
  },
  scotland: {
    bg: "from-slate-950 via-blue-950/50 to-slate-900",
    accentHex: "#0065BD",
    pill: "bg-blue-900/40 text-blue-200 border-blue-700/50",
    headline: "Conquer your Highers & National 5s",
    subheadline: "Scotland's guide to SQA exams, free university places, and the Curriculum for Excellence.",
    quals: "National 5 · Higher · Advanced Higher",
    ctaLabel: "Find My Path",
    examBtn: "SQA Exam Prep",
  },
  wales: {
    bg: "from-slate-950 via-green-950/40 to-slate-900",
    accentHex: "#00AB39",
    pill: "bg-green-900/40 text-green-200 border-green-700/50",
    headline: "Pass your GCSEs & Welsh Bacc",
    subheadline: "Wales's guide to WJEC exams, the Welsh Baccalaureate, and universities across the UK.",
    quals: "GCSE · A-Level · Welsh Baccalaureate",
    ctaLabel: "Find My Path",
    examBtn: "GCSE & Welsh Bacc Prep",
  },
  "northern-ireland": {
    bg: "from-slate-950 via-indigo-950/40 to-slate-900",
    accentHex: "#C8102E",
    pill: "bg-indigo-900/40 text-indigo-200 border-indigo-700/50",
    headline: "Nail your GCSEs & A-Levels",
    subheadline: "Northern Ireland's guide to CCEA exams, grammar schools, and universities across the UK.",
    quals: "GCSE · A-Level (CCEA) · Grammar Schools",
    ctaLabel: "Find My Path",
    examBtn: "GCSE & A-Level Prep",
  },
};

// ─── Flag SVG Patterns ─────────────────────────────────────────────────────────

function EnglandFlag() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white" fillOpacity="0.02" />
      <rect x="46%" y="0" width="8%" height="100%" fill="#C8102E" fillOpacity="0.18" />
      <rect x="0" y="46%" width="100%" height="8%" fill="#C8102E" fillOpacity="0.18" />
    </svg>
  );
}

function ScotlandFlag() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0065BD" fillOpacity="0.15" />
      <line x1="0" y1="0" x2="100%" y2="100%" stroke="white" strokeWidth="9%" strokeOpacity="0.13" strokeLinecap="square" />
      <line x1="100%" y1="0" x2="0" y2="100%" stroke="white" strokeWidth="9%" strokeOpacity="0.13" strokeLinecap="square" />
    </svg>
  );
}

function WalesFlag() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="50%" fill="white" fillOpacity="0.06" />
      <rect y="50%" width="100%" height="50%" fill="#00AB39" fillOpacity="0.22" />
      <rect y="47%" width="100%" height="6%" fill="#C8102E" fillOpacity="0.30" />
      <ellipse cx="50%" cy="50%" rx="18%" ry="12%" fill="#C8102E" fillOpacity="0.07" />
    </svg>
  );
}

function NIFlag() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="0" x2="100%" y2="100%" stroke="white" strokeWidth="7%" strokeOpacity="0.08" />
      <line x1="100%" y1="0" x2="0" y2="100%" stroke="white" strokeWidth="7%" strokeOpacity="0.08" />
      <rect x="45%" y="0" width="10%" height="100%" fill="white" fillOpacity="0.07" />
      <rect x="0" y="45%" width="100%" height="10%" fill="white" fillOpacity="0.07" />
      <rect x="47%" y="0" width="6%" height="100%" fill="#C8102E" fillOpacity="0.15" />
      <rect x="0" y="47%" width="100%" height="6%" fill="#C8102E" fillOpacity="0.15" />
    </svg>
  );
}

const FLAG_SVG: Record<Nation, React.ReactNode> = {
  england: <EnglandFlag />,
  scotland: <ScotlandFlag />,
  wales: <WalesFlag />,
  "northern-ireland": <NIFlag />,
};

// ─── No-Nation Picker ──────────────────────────────────────────────────────────

function NationPickerHero({ onPick }: { onPick: (n: Nation) => void }) {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-primary/20 to-slate-900" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.04]" />
      {/* Blurred glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[130px] opacity-15 bg-primary pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[110px] opacity-10 bg-accent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 font-semibold text-sm mb-8 border border-white/15 backdrop-blur-sm">
            <Globe2 className="w-4 h-4" />
            Select your nation to personalise your experience
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
            Your UK Education
            <br />
            <span className="text-gradient">Journey Starts Here</span>
          </h1>
          <p className="text-lg text-slate-300 mb-14 max-w-2xl mx-auto leading-relaxed">
            MyPassUK covers all four UK nations. Pick yours for nation-specific exam prep, qualifications, university finder, and career guides.
          </p>
        </motion.div>

        {/* Nation cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
          {NATIONS.map((n, i) => (
            <motion.button
              key={n.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 + i * 0.09, duration: 0.5 }}
              onClick={() => onPick(n.id)}
              className="group relative flex flex-col items-center gap-5 p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 hover:scale-105 transition-all duration-300 cursor-pointer text-center"
            >
              {/* Flag + glow */}
              <div className="relative">
                <div className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 scale-150 bg-white/20 rounded-full" />
                <span className="relative text-6xl leading-none drop-shadow-2xl">{n.flag}</span>
              </div>
              <div>
                <p className="text-white font-bold text-xl leading-tight">{n.label}</p>
                <p className="text-slate-400 text-xs mt-2 leading-snug">{n.qualifications}</p>
              </div>
              {/* Hover arrow */}
              <div className="flex items-center gap-1 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Select <ArrowRight className="w-3 h-3" />
              </div>
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-white/5 to-transparent" />
            </motion.button>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="mt-10 text-slate-500 text-sm"
        >
          You can change this anytime from the navigation bar.
        </motion.p>
      </div>
    </section>
  );
}

// ─── Stats + Features ──────────────────────────────────────────────────────────

const STATS = [
  { value: "80+", label: "Subjects", icon: BookOpen },
  { value: "287", label: "Institutions", icon: Building2 },
  { value: "69", label: "Career Profiles", icon: Briefcase },
  { value: "4", label: "UK Nations", icon: Globe2 },
];

const FEATURES = [
  { title: "Exam Preparation", desc: "Study tips, key topics, and resources for GCSEs, A-Levels, Scottish Highers, and more.", icon: BookOpen, href: "/subjects", gradient: "from-blue-500 to-blue-700", light: "bg-blue-500/10 text-blue-400" },
  { title: "Career Explorer", desc: "Discover salaries, required qualifications, and job outlooks for 69 career profiles.", icon: Briefcase, href: "/careers", gradient: "from-emerald-500 to-emerald-700", light: "bg-emerald-500/10 text-emerald-400" },
  { title: "287 Institutions", desc: "Filter and compare Universities, Colleges, and Apprenticeship providers across the UK.", icon: Building2, href: "/institutions", gradient: "from-violet-500 to-violet-700", light: "bg-violet-500/10 text-violet-400" },
  { title: "Study Routes", desc: "Compare A-Levels, Highers, BTECs, T-Levels and more — with nation-specific guidance.", icon: Map, href: "/routes", gradient: "from-orange-500 to-orange-700", light: "bg-orange-500/10 text-orange-400" },
  { title: "Find a Tutor", desc: "Search UK tutor platforms by subject, level, and city — prices compared in one place.", icon: Users, href: "/tutors", gradient: "from-rose-500 to-rose-700", light: "bg-rose-500/10 text-rose-400" },
  { title: "AI Study Assistant", desc: "Ask anything about your subjects, get revision plans, and practise with AI-powered tools.", icon: BrainCircuit, href: "/subjects", gradient: "from-sky-500 to-sky-700", light: "bg-sky-500/10 text-sky-400" },
  { title: "Open Days Calendar", desc: "Upcoming university open days across the UK — filter by region and institution type.", icon: CalendarDays, href: "/open-days", gradient: "from-amber-500 to-amber-700", light: "bg-amber-500/10 text-amber-400" },
  { title: "Study Planner", desc: "Build a personalised Pomodoro-based revision timetable for your exam schedule.", icon: Clock, href: "/timetable", gradient: "from-teal-500 to-teal-700", light: "bg-teal-500/10 text-teal-400" },
];

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const { nation, setNation, openSelector } = useNation();

  if (!nation) {
    return <NationPickerHero onPick={setNation} />;
  }

  const theme = THEMES[nation];
  const flagBg = FLAG_SVG[nation];
  const nationInfo = NATIONS.find(n => n.id === nation)!;

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">

        {/* Gradient base */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg}`} />

        {/* Animated flag SVG */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={nation}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {flagBg}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Accent glow */}
        <div
          className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-[140px] opacity-20 pointer-events-none"
          style={{ background: theme.accentHex }}
        />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-8 bg-white pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.035] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={nation}
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 28 }}
                transition={{ duration: 0.45 }}
              >
                {/* Nation pill */}
                <button
                  onClick={openSelector}
                  className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-sm font-bold mb-8 hover:opacity-80 transition-opacity ${theme.pill}`}
                >
                  <span className="text-xl leading-none">{nationInfo.flag}</span>
                  {nationInfo.label}
                  <span className="text-xs opacity-55 font-normal">· change</span>
                </button>

                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.08] mb-5 tracking-tight">
                  {theme.headline}
                </h1>

                {/* Quals chip */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/65 text-xs font-semibold mb-6 tracking-wide">
                  <Star className="w-3 h-3" style={{ color: theme.accentHex }} />
                  {theme.quals}
                </div>

                <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-xl">
                  {theme.subheadline}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/quiz"
                    className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white overflow-hidden transition-all duration-200 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 text-base"
                    style={{ background: `linear-gradient(135deg, ${theme.accentHex}ee, ${theme.accentHex}bb)` }}
                  >
                    <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                    {theme.ctaLabel} <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/subjects"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-200 text-base"
                  >
                    {theme.examBtn}
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </Link>
                </div>

                {/* Stats row */}
                <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3">
                  {STATS.map(s => (
                    <span key={s.label} className="flex items-center gap-1.5 text-sm text-slate-400 font-medium">
                      <s.icon className="w-4 h-4 text-slate-500" />
                      <strong className="text-white font-bold">{s.value}</strong>
                      <span>{s.label}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Right — flag showcase */}
            <motion.div
              className="relative hidden lg:flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.18 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={nation}
                  initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 4 }}
                  transition={{ duration: 0.5 }}
                  className="relative flex flex-col items-center gap-8"
                >
                  {/* Glow ring */}
                  <div
                    className="absolute inset-0 rounded-full blur-[90px] opacity-25 scale-125 pointer-events-none"
                    style={{ background: theme.accentHex }}
                  />
                  {/* Decorative concentric rings */}
                  {[1.3, 1.6, 1.9].map((scale, idx) => (
                    <div
                      key={idx}
                      className="absolute border border-white/5 rounded-full"
                      style={{
                        inset: 0,
                        transform: `scale(${scale})`,
                      }}
                    />
                  ))}

                  {/* Large flag emoji */}
                  <div className="text-[10rem] leading-none drop-shadow-2xl select-none">
                    {nationInfo.flag}
                  </div>

                  {/* Mini info cards */}
                  <div className="grid grid-cols-2 gap-3 w-full max-w-sm relative z-10">
                    {[
                      { label: "Institutions", value: "287+", icon: Building2 },
                      { label: "Career paths", value: "69", icon: Briefcase },
                      { label: "Subjects", value: "80+", icon: BookOpen },
                      { label: "Study routes", value: "6+", icon: Map },
                    ].map(card => (
                      <div key={card.label} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm">
                        <card.icon className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <p className="text-white font-bold text-sm leading-none">{card.value}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{card.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade-out */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ── Nation Switcher Strip ───────────────────────────────────────── */}
      <section className="border-t border-b border-border bg-secondary/30 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap shrink-0">
              Viewing as:
            </span>
            {NATIONS.map(n => (
              <button
                key={n.id}
                onClick={() => setNation(n.id)}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  nation === n.id
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-primary/40 hover:text-primary"
                }`}
              >
                <span className="text-base leading-none">{n.flag}</span>
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Cards ──────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
              <Zap className="w-4 h-4" />
              Everything in one place
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Your complete toolkit for success
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Data-driven guidance from exam prep to career planning — all tailored to your nation's curriculum.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.055 }}
              >
                <Link href={f.href}>
                  <div className="group h-full flex flex-col bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/6 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer">
                    <div className={`h-1.5 w-full bg-gradient-to-r ${f.gradient}`} />
                    <div className="p-6 flex flex-col flex-1">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${f.light}`}>
                        <f.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-base mb-2 text-foreground">{f.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-grow">{f.desc}</p>
                      <div className="mt-5 flex items-center gap-1.5 text-primary text-xs font-bold group-hover:gap-2.5 transition-all duration-200">
                        Explore <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quiz CTA ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-secondary/30 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-[2.5rem] p-10 md:p-16 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12"
            style={{ background: "linear-gradient(135deg, hsl(224,76%,12%) 0%, hsl(224,76%,22%) 100%)" }}
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/25 blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none opacity-20">{flagBg}</div>

            <div className="relative z-10 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-xs font-semibold mb-6 border border-white/15">
                <GraduationCap className="w-4 h-4" />
                2-minute personalised quiz
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
                Not sure where to start?
              </h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Enter your subjects, predicted grades, and interests — get AI-matched career and study route recommendations in seconds.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-accent text-white hover:bg-red-700 hover:-translate-y-0.5 shadow-lg shadow-accent/30 transition-all duration-200"
                >
                  Start the Quiz <Sparkles className="w-5 h-5" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  See Premium <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative z-10 hidden md:flex flex-col items-center gap-3">
              <div className="text-[7rem] leading-none drop-shadow-2xl select-none">
                {nationInfo.flag}
              </div>
              <p className="text-white/40 text-sm font-medium">{nationInfo.label} Edition</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
