import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, BookOpen, ExternalLink, Star, ChevronDown, Users, GraduationCap, X, TrendingUp, Clock, PoundSterling } from "lucide-react";
import { useGetSubjects } from "@workspace/api-client-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Subject { id: number; name: string; level: string; category: string; }

// ─── Constants ────────────────────────────────────────────────────────────────

const UK_AREAS = [
  "London", "Birmingham", "Manchester", "Leeds", "Bristol",
  "Liverpool", "Sheffield", "Edinburgh", "Glasgow", "Cardiff",
  "Newcastle", "Nottingham", "Southampton", "Leicester", "Coventry",
  "Bradford", "Oxford", "Cambridge", "Brighton", "Reading",
  "Portsmouth", "Derby", "Wolverhampton", "Stoke-on-Trent", "Plymouth",
  "Exeter", "York", "Bath", "Norwich", "Ipswich",
];

// Price ranges by region (£/hr)
const AREA_PRICE_BOOST: Record<string, number> = {
  London: 20, Oxford: 15, Cambridge: 15, Brighton: 10, Bristol: 5,
  Edinburgh: 5, Cardiff: 0, Manchester: 0, Birmingham: 0,
};

type Level = "GCSE" | "A-Level" | "Both";

interface Platform {
  name: string;
  tagline: string;
  color: string;
  textColor: string;
  borderColor: string;
  tutorCount: string;
  minRating: number;
  description: string;
  pros: string[];
  buildUrl: (subject: string, area: string, level: Level) => string;
}

const PLATFORMS: Platform[] = [
  {
    name: "Tutorful",
    tagline: "UK's largest tutor marketplace",
    color: "from-violet-600 to-purple-700",
    textColor: "text-violet-700",
    borderColor: "border-violet-200",
    tutorCount: "20,000+",
    minRating: 4.8,
    description: "Verified UK tutors with DBS checks, flexible online or in-person sessions and a satisfaction guarantee.",
    pros: ["DBS checked", "Satisfaction guarantee", "Online & in-person"],
    buildUrl: (subject, area, level) => {
      const slug = subject.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const loc = area ? `/${area.toLowerCase().replace(/\s+/g, "-")}` : "";
      return `https://tutorful.co.uk/tutors/${slug}${loc}`;
    },
  },
  {
    name: "MyTutor",
    tagline: "Online tutoring from top universities",
    color: "from-blue-500 to-indigo-600",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    tutorCount: "13,000+",
    minRating: 4.9,
    description: "Tutors recruited from Russell Group universities. Every session is online with a shared digital whiteboard.",
    pros: ["Russell Group tutors", "Free intro session", "Money-back guarantee"],
    buildUrl: (subject, _area, level) => {
      const lvl = level === "Both" ? "GCSE" : level;
      const subSlug = subject.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "");
      return `https://www.mytutor.co.uk/tutors/${lvl}/${subSlug}/`;
    },
  },
  {
    name: "Superprof",
    tagline: "Find local & online tutors fast",
    color: "from-orange-500 to-red-500",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
    tutorCount: "40,000+",
    minRating: 4.7,
    description: "Huge selection of local and online tutors across all subjects. Many offer a free first lesson.",
    pros: ["Free first lesson", "Local & online", "Widest choice"],
    buildUrl: (subject, area, level) => {
      const term = encodeURIComponent(subject.toLowerCase() + " tutor");
      const loc = area ? `/${area.toLowerCase().replace(/\s+/g, "-")}` : "";
      return `https://www.superprof.co.uk/s/${term}${loc}/`;
    },
  },
  {
    name: "TutorHunt",
    tagline: "Direct contact, no agency fees",
    color: "from-emerald-500 to-green-600",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    tutorCount: "7,000+",
    minRating: 4.6,
    description: "Contact tutors directly — no platform commission means tutors often charge less and respond faster.",
    pros: ["No middleman fees", "Direct contact", "Local focus"],
    buildUrl: (subject, area, level) => {
      const sub = encodeURIComponent(subject);
      const loc = area ? `&town=${encodeURIComponent(area)}` : "";
      const lvl = level === "Both" ? "" : `&level=${encodeURIComponent(level)}`;
      return `https://www.tutorhunt.com/resource/find-a-tutor/?subject=${sub}${loc}${lvl}`;
    },
  },
];

// Price guide by level and area
function getPriceRange(level: Level, area: string): { low: number; high: number } {
  const boost = AREA_PRICE_BOOST[area] ?? 0;
  if (level === "A-Level") return { low: 35 + boost, high: 70 + boost };
  return { low: 25 + boost, high: 55 + boost };
}

// Most popular/searched subjects
const POPULAR_SUBJECTS = [
  "Mathematics", "English Literature", "Biology", "Chemistry", "Physics",
  "History", "Geography", "French", "Spanish", "Computer Science",
  "Further Mathematics", "Psychology", "Economics", "Business Studies",
];

const LEVEL_BADGE: Record<string, string> = {
  GCSE: "bg-blue-100 text-blue-700",
  "A-Level": "bg-violet-100 text-violet-700",
  Both: "bg-emerald-100 text-emerald-700",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Tutors() {
  const { data: allSubjects = [] } = useGetSubjects();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedArea, setSelectedArea] = useState("London");
  const [selectedLevel, setSelectedLevel] = useState<Level>("GCSE");
  const [subjectSearch, setSubjectSearch] = useState("");
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const [areaSearch, setAreaSearch] = useState("");

  const filteredSubjects = useMemo(() => {
    const s = subjectSearch.trim().toLowerCase();
    return (allSubjects as Subject[]).filter(sub =>
      !s || sub.name.toLowerCase().includes(s) || sub.category.toLowerCase().includes(s)
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [allSubjects, subjectSearch]);

  const filteredAreas = useMemo(() => {
    const s = areaSearch.trim().toLowerCase();
    return s ? UK_AREAS.filter(a => a.toLowerCase().includes(s)) : UK_AREAS;
  }, [areaSearch]);

  const priceRange = getPriceRange(selectedLevel, selectedArea);
  const hasSelection = !!selectedSubject;

  const popularSubjectObjs = useMemo(() =>
    POPULAR_SUBJECTS.map(name => (allSubjects as Subject[]).find(s => s.name === name)).filter(Boolean) as Subject[],
    [allSubjects]
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-primary/90 to-indigo-900 px-4 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, hsl(354,72%,50%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(224,76%,60%) 0%, transparent 40%)" }} />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white/80 border border-white/15 rounded-full text-sm font-medium mb-5">
            <Users className="w-4 h-4" /> Private Tutor Finder
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Find Your Perfect Tutor
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
            Search across the UK's top tutor platforms in one place. Compare prices, read reviews and book directly — for every GCSE and A-Level subject.
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl p-3 flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto shadow-2xl shadow-black/20">

            {/* Subject picker */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => { setSubjectOpen(v => !v); setAreaOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-left hover:border-primary/40 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                {selectedSubject ? (
                  <span className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-semibold text-slate-900 truncate">{selectedSubject.name}</span>
                    <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${LEVEL_BADGE[selectedSubject.level] ?? "bg-slate-100 text-slate-600"}`}>
                      {selectedSubject.level === "Both" ? "GCSE & A-Level" : selectedSubject.level}
                    </span>
                  </span>
                ) : (
                  <span className="text-slate-400 text-sm">Choose a subject…</span>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${subjectOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {subjectOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute z-50 top-full mt-1.5 left-0 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-2.5 border-b border-slate-100 flex items-center gap-2">
                      <Search className="w-4 h-4 text-slate-400" />
                      <input autoFocus type="text" value={subjectSearch} onChange={e => setSubjectSearch(e.target.value)}
                        placeholder="Search subjects…"
                        className="flex-1 text-sm outline-none placeholder-slate-400" />
                      {subjectSearch && <button type="button" onClick={() => setSubjectSearch("")}><X className="w-3.5 h-3.5 text-slate-400" /></button>}
                    </div>
                    <div className="overflow-y-auto max-h-64">
                      {filteredSubjects.map(s => (
                        <button key={s.id} type="button"
                          onClick={() => { setSelectedSubject(s); setSubjectOpen(false); setSubjectSearch(""); }}
                          className={`w-full px-3 py-2.5 flex items-center justify-between gap-3 hover:bg-primary/5 transition-colors text-left ${selectedSubject?.id === s.id ? "bg-primary/10" : ""}`}
                        >
                          <span className="text-sm text-slate-700">{s.name}</span>
                          <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${LEVEL_BADGE[s.level] ?? "bg-slate-100 text-slate-600"}`}>
                            {s.level === "Both" ? "GCSE & A-Level" : s.level}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Area picker */}
            <div className="relative sm:w-52">
              <button
                type="button"
                onClick={() => { setAreaOpen(v => !v); setSubjectOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-left hover:border-primary/40 transition-colors"
              >
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="flex-1 text-sm font-semibold text-slate-900 truncate">{selectedArea}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${areaOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {areaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute z-50 top-full mt-1.5 left-0 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-2.5 border-b border-slate-100 flex items-center gap-2">
                      <Search className="w-4 h-4 text-slate-400" />
                      <input autoFocus type="text" value={areaSearch} onChange={e => setAreaSearch(e.target.value)}
                        placeholder="Search areas…" className="flex-1 text-sm outline-none placeholder-slate-400" />
                    </div>
                    <div className="overflow-y-auto max-h-56">
                      {filteredAreas.map(a => (
                        <button key={a} type="button"
                          onClick={() => { setSelectedArea(a); setAreaOpen(false); setAreaSearch(""); }}
                          className={`w-full px-3 py-2.5 text-left text-sm hover:bg-primary/5 transition-colors ${selectedArea === a ? "bg-primary/10 font-semibold text-primary" : "text-slate-700"}`}
                        >{a}</button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Level toggle */}
            <div className="flex rounded-xl overflow-hidden border border-slate-200 shrink-0">
              {(["GCSE", "A-Level"] as Level[]).map(lvl => (
                <button key={lvl} type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-4 py-3 text-sm font-bold transition-colors ${selectedLevel === lvl ? "bg-primary text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
                >{lvl}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Price guide strip */}
        <div className="bg-white border border-slate-100 rounded-2xl px-6 py-4 mb-8 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <PoundSterling className="w-4 h-4 text-primary" />
            <span className="font-bold text-slate-900">{selectedLevel} tutors in {selectedArea}:</span>
            <span className="text-slate-600">typically <span className="font-bold text-primary">£{priceRange.low}–£{priceRange.high}/hr</span></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <TrendingUp className="w-4 h-4" />
            London & Oxbridge tutors typically 25–40% higher
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            Most tutors offer 1-hour sessions
          </div>
        </div>

        {/* Popular subjects quick-select (shown when no subject chosen) */}
        {!hasSelection && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" /> Most-searched subjects
            </h2>
            <div className="flex flex-wrap gap-2">
              {popularSubjectObjs.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedSubject(s);
                    if (s.level === "A-Level") setSelectedLevel("A-Level");
                    else setSelectedLevel("GCSE");
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all"
                >
                  {s.name}
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${LEVEL_BADGE[s.level] ?? ""}`}>
                    {s.level === "Both" ? "GCSE & AL" : s.level}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Platform cards */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-xl font-bold text-slate-900">
            {hasSelection
              ? <>Tutors for <span className="text-primary">{selectedSubject!.name}</span> in <span className="text-primary">{selectedArea}</span></>
              : <>All tutor platforms — {selectedArea}</>}
          </h2>
          {hasSelection && (
            <button onClick={() => setSelectedSubject(null)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
              <X className="w-4 h-4" /> Clear subject
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {PLATFORMS.map((platform, i) => {
            const url = platform.buildUrl(
              selectedSubject?.name ?? "maths",
              selectedArea,
              selectedLevel
            );
            return (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`bg-white rounded-2xl border ${platform.borderColor} shadow-sm hover:shadow-md transition-all group overflow-hidden`}
              >
                {/* Platform header */}
                <div className={`bg-gradient-to-r ${platform.color} px-6 py-4 flex items-center justify-between`}>
                  <div>
                    <h3 className="text-white font-bold text-lg">{platform.name}</h3>
                    <p className="text-white/80 text-xs mt-0.5">{platform.tagline}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(platform.minRating) ? "text-amber-300 fill-amber-300" : "text-white/30"}`} />
                      ))}
                    </div>
                    <p className="text-white/80 text-xs mt-0.5">{platform.minRating}★ avg</p>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{platform.description}</p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {platform.tutorCount} tutors
                    </span>
                    {platform.pros.map(pro => (
                      <span key={pro} className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                        ✓ {pro}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Typical rate</p>
                      <p className={`text-sm font-bold ${platform.textColor}`}>£{priceRange.low}–£{priceRange.high}/hr</p>
                    </div>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${platform.color} hover:opacity-90 hover:shadow-md hover:-translate-y-0.5 transition-all`}
                    >
                      {hasSelection ? `Find ${selectedSubject!.name} Tutors` : "Browse Tutors"}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tips section */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-10">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" /> Tips for choosing a tutor
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Check their exam board", body: "Make sure your tutor knows Pearson Edexcel, AQA or OCR — whichever your school uses. Syllabi differ significantly." },
              { title: "Trial session first", body: "Most platforms offer a free or low-cost first session. Use it to gauge teaching style before committing." },
              { title: "Grade guarantees", body: "Tutorful and MyTutor both offer money-back if you're not satisfied after your first lesson." },
              { title: "Online vs in-person", body: "Online tutors are often £10–15/hr cheaper and offer more flexibility. Good for fitting around school." },
              { title: "Frequency matters", body: "Research shows weekly sessions (1 hr) with consistent homework deliver better results than infrequent long sessions." },
              { title: "Start early", body: "Begin tutoring at least 6 months before exams. Last-minute cramming is less effective and tutors get booked up." },
            ].map(tip => (
              <div key={tip.title} className="bg-slate-50 rounded-xl p-4">
                <p className="font-bold text-sm text-slate-800 mb-1.5">{tip.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Subject browse by category */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-5">Browse tutors by subject</h3>
          {(["STEM", "Humanities", "Languages", "Social Sciences", "Creative Arts", "Applied", "Sport & Health"] as const).map(cat => {
            const catSubjects = (allSubjects as Subject[]).filter(s => s.category === cat);
            if (!catSubjects.length) return null;
            return (
              <div key={cat} className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5">{cat}</h4>
                <div className="flex flex-wrap gap-2">
                  {catSubjects.sort((a, b) => a.name.localeCompare(b.name)).map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedSubject(s);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                        selectedSubject?.id === s.id
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-slate-700 border-slate-200 hover:border-primary/50 hover:text-primary"
                      }`}
                    >
                      {s.name}
                      <span className={`text-[9px] font-bold px-1 py-0.5 rounded-full ${
                        selectedSubject?.id === s.id ? "bg-white/20 text-white" : LEVEL_BADGE[s.level] ?? "bg-slate-100 text-slate-600"
                      }`}>
                        {s.level === "Both" ? "G&A" : s.level}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
