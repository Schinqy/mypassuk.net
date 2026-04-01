import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Filter, Search, GraduationCap, MapPin, Bookmark } from "lucide-react";
import { useGetSubjects } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useNation, NATIONS } from "@/contexts/NationContext";
import { useSavedSubjects } from "@/hooks/useSavedSubjects";

const LEVEL_COLORS: Record<string, string> = {
  "GCSE": "bg-orange-100 text-orange-700",
  "A-Level": "bg-purple-100 text-purple-700",
  "National 5": "bg-teal-100 text-teal-700",
  "Higher": "bg-blue-100 text-blue-700",
  "Advanced Higher": "bg-indigo-100 text-indigo-700",
  "Both": "bg-indigo-100 text-indigo-700",
  "Welsh Bacc": "bg-green-100 text-green-700",
};

const NATION_FILTERS: Record<string, string[]> = {
  england: ["All", "GCSE", "A-Level"],
  wales: ["All", "GCSE", "A-Level", "Welsh Bacc"],
  scotland: ["All", "National 5", "Higher", "Advanced Higher"],
  "northern-ireland": ["All", "GCSE", "A-Level"],
};

const NATION_LEVEL_MATCH: Record<string, string[]> = {
  england: ["GCSE", "A-Level", "Both"],
  wales: ["GCSE", "A-Level", "Both", "Welsh Bacc"],
  scotland: ["National 5", "Higher", "Advanced Higher"],
  "northern-ireland": ["GCSE", "A-Level", "Both"],
};

export default function Subjects() {
  const { nation, openSelector } = useNation();
  const { savedIds, toggle, isAuthenticated } = useSavedSubjects();
  const [search, setSearch] = useState("");

  const filterOptions = nation ? NATION_FILTERS[nation] : ["All", "GCSE", "A-Level", "National 5", "Higher", "Advanced Higher"];
  const [levelFilter, setLevelFilter] = useState<string>("All");

  // Reset filter to "All" whenever the nation changes so Scotland subjects are always visible
  useEffect(() => {
    setLevelFilter("All");
  }, [nation]);

  const { data: subjects, isLoading, error } = useGetSubjects();

  const isScotland = nation === "scotland";

  const filteredSubjects = useMemo(() => {
    if (!subjects) return [];

    const allowedLevels: string[] | null = nation ? NATION_LEVEL_MATCH[nation] ?? null : null;
    const q = search.toLowerCase();

    return subjects.filter((s) => {
      // 1. Nation gate
      if (allowedLevels && !allowedLevels.includes(s.level)) return false;

      // 2. Level filter tab
      if (levelFilter !== "All") {
        const directMatch = s.level === levelFilter;
        // For non-Scotland, a "Both" subject counts as GCSE and A-Level
        const bothMatch = !isScotland && s.level === "Both" && (levelFilter === "GCSE" || levelFilter === "A-Level");
        if (!directMatch && !bothMatch) return false;
      }

      // 3. Search
      if (q) {
        return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
      }

      return true;
    });
  }, [subjects, nation, isScotland, levelFilter, search]);

  const nationInfo = nation ? NATIONS.find(n => n.id === nation) : null;
  const base = import.meta.env.BASE_URL;

  if (isLoading) return <LoadingSpinner className="mt-24" />;
  if (error) return <div className="text-center text-red-500 mt-24">Failed to load subjects</div>;

  const totalCount = filteredSubjects?.length ?? 0;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-10 bg-slate-900">
          <img
            src={`${base}images/students-studying.jpg`}
            alt="Students studying"
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-14">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-bold mb-5">
                <GraduationCap className="w-4 h-4" /> {totalCount} Subjects
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Exam Preparation</h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                {nation === "scotland"
                  ? "Detailed guides, study tips, and resources for National 5, Higher, and Advanced Higher subjects — tailored to the SQA."
                  : nation === "northern-ireland"
                  ? "Detailed guides, study tips, and resources for GCSE and A-Level subjects. NI uses CCEA alongside AQA and Edexcel."
                  : nation === "wales"
                  ? "Detailed guides, study tips, and resources for GCSE and A-Level subjects. Wales uses WJEC/Eduqas alongside other boards."
                  : "Detailed guides, study tips, and resources for GCSE and A-Level subjects to help you secure the top grades."}
              </p>
            </div>
            <div className="hidden md:block shrink-0">
              <img
                src={`${base}images/students-studying.jpg`}
                alt="Students studying"
                className="w-52 h-36 object-cover rounded-2xl shadow-2xl border border-white/10 rotate-2"
              />
            </div>
          </div>
        </div>

        {/* Nation banner */}
        {nationInfo ? (
          <div className="mb-6 flex items-center justify-between gap-3 px-5 py-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{nationInfo.flag}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Showing <span className="text-primary">{nationInfo.qualifications}</span> for {nationInfo.label}
                </p>
                <p className="text-xs text-slate-500">Content is tailored to your education system</p>
              </div>
            </div>
            <button
              onClick={openSelector}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors px-3 py-1.5 rounded-xl hover:bg-slate-50"
            >
              <MapPin className="w-3.5 h-3.5" /> Change
            </button>
          </div>
        ) : (
          <div className="mb-6 flex items-center gap-3 px-5 py-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-sm">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-amber-800">
              <span className="font-semibold">Tell us where you're studying</span> and we'll show only the subjects relevant to your qualifications.
            </p>
            <button
              onClick={openSelector}
              className="ml-auto shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors"
            >
              Set location
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 flex-wrap">
            <Filter className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
            {filterOptions.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                  levelFilter === lvl
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Scottish system notice */}
        {nation === "scotland" && (
          <div className="mb-6 px-5 py-4 bg-teal-50 border border-teal-200 rounded-2xl text-sm">
            <p className="font-semibold text-teal-900 mb-1">🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scottish Qualifications Authority (SQA) System</p>
            <p className="text-teal-800 leading-relaxed">
              Scottish students typically take <strong>National 5s</strong> in S4 (equivalent to GCSEs), then <strong>Highers</strong> in S5 — the main qualification for university entry — and optionally <strong>Advanced Highers</strong> in S6 for competitive courses. All content here is matched to the SQA curriculum.
            </p>
          </div>
        )}

        {nation === "wales" && (
          <div className="mb-6 px-5 py-4 bg-green-50 border border-green-200 rounded-2xl text-sm">
            <p className="font-semibold text-green-900 mb-1">🏴󠁧󠁢󠁷󠁬󠁳󠁿 Wales — WJEC, Eduqas & Welsh Bacc</p>
            <p className="text-green-800 leading-relaxed">
              Welsh students take GCSEs and A-Levels — but many are examined by <strong>WJEC</strong> or its English-market brand <strong>Eduqas</strong>. Some schools also require the <strong>Welsh Baccalaureate</strong> (WBQ). Check your specific exam board with your school, as some specifications differ from AQA and Edexcel equivalents.
            </p>
          </div>
        )}

        {nation === "northern-ireland" && (
          <div className="mb-6 px-5 py-4 bg-blue-50 border border-blue-200 rounded-2xl text-sm">
            <p className="font-semibold text-blue-900 mb-1">🇬🇧 Northern Ireland — CCEA & Shared Qualifications</p>
            <p className="text-blue-800 leading-relaxed">
              NI students take GCSEs and A-Levels, but many are set by <strong>CCEA</strong> (Council for the Curriculum, Examinations and Assessment) which often has different content and mark schemes to AQA or Edexcel. Always check whether your subject is CCEA or a shared board specification before using exam resources.
            </p>
          </div>
        )}

        {!filteredSubjects?.length ? (
          <EmptyState title="No subjects found" description="Try adjusting your search or filters." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.04 }}
                key={subject.id}
              >
                <Link href={`/subjects/${subject.id}`}>
                  <div className="glass-card p-6 rounded-2xl h-full flex flex-col group cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        <BookOpen className="w-6 h-6 text-primary group-hover:text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${LEVEL_COLORS[subject.level] ?? "bg-slate-100 text-slate-600"}`}>
                          {subject.level}
                        </span>
                        {isAuthenticated && (
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(subject.id); }}
                            title={savedIds.has(subject.id) ? "Remove from saved" : "Save subject"}
                            className={`p-1.5 rounded-lg transition-all duration-200 ${
                              savedIds.has(subject.id)
                                ? "text-primary bg-primary/10"
                                : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${savedIds.has(subject.id) ? "fill-current" : ""}`} />
                          </button>
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{subject.name}</h3>
                    <span className="text-sm font-medium text-slate-500 mb-4">{subject.category}</span>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                      {subject.description}
                    </p>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-auto">
                      <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-500 ease-out" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
