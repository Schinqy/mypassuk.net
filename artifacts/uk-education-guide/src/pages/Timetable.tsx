import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, BookOpen, ChevronRight, ChevronLeft, Clock, Coffee, Sun, Sunset, Moon, X, Download, RotateCcw, GraduationCap, Check } from "lucide-react";
import { useGetSubjects } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Subject color palette
const SUBJECT_COLORS = [
  { bg: "bg-blue-500", light: "bg-blue-100", text: "text-blue-700", border: "border-blue-300", hex: "#3B82F6" },
  { bg: "bg-emerald-500", light: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300", hex: "#10B981" },
  { bg: "bg-violet-500", light: "bg-violet-100", text: "text-violet-700", border: "border-violet-300", hex: "#8B5CF6" },
  { bg: "bg-orange-500", light: "bg-orange-100", text: "text-orange-700", border: "border-orange-300", hex: "#F97316" },
  { bg: "bg-pink-500", light: "bg-pink-100", text: "text-pink-700", border: "border-pink-300", hex: "#EC4899" },
  { bg: "bg-cyan-500", light: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-300", hex: "#06B6D4" },
  { bg: "bg-amber-500", light: "bg-amber-100", text: "text-amber-700", border: "border-amber-300", hex: "#F59E0B" },
  { bg: "bg-rose-500", light: "bg-rose-100", text: "text-rose-700", border: "border-rose-300", hex: "#F43F5E" },
  { bg: "bg-teal-500", light: "bg-teal-100", text: "text-teal-700", border: "border-teal-300", hex: "#14B8A6" },
  { bg: "bg-indigo-500", light: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-300", hex: "#6366F1" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type ScheduleMode = "term" | "revision";

interface SlotDef {
  start: string;
  end: string;
  label: string;
  icon: React.ElementType;
  color: string; // for slot type background when empty
  isWeekendOnly?: boolean;
  isHolidayOnly?: boolean;
}

// Term time slot definitions per day type
const WEEKDAY_SLOTS: SlotDef[] = [
  { start: "12:15", end: "13:00", label: "Lunchtime Study", icon: Coffee, color: "bg-amber-50" },
  { start: "15:30", end: "16:30", label: "After School – Block A", icon: BookOpen, color: "bg-blue-50" },
  { start: "16:45", end: "17:45", label: "After School – Block B", icon: BookOpen, color: "bg-blue-50" },
  { start: "18:30", end: "19:30", label: "Evening Review", icon: Moon, color: "bg-indigo-50" },
];

const WEEKEND_SLOTS_TERM: SlotDef[] = [
  { start: "09:00", end: "10:30", label: "Morning Session A", icon: Sun, color: "bg-yellow-50" },
  { start: "10:45", end: "12:15", label: "Morning Session B", icon: Sun, color: "bg-yellow-50" },
  { start: "13:30", end: "15:00", label: "Afternoon Session A", icon: Sunset, color: "bg-orange-50" },
  { start: "15:15", end: "16:30", label: "Afternoon Session B", icon: Sunset, color: "bg-orange-50" },
  { start: "18:00", end: "19:00", label: "Evening Review", icon: Moon, color: "bg-indigo-50" },
];

const HOLIDAY_SLOTS: SlotDef[] = [
  { start: "09:00", end: "10:30", label: "Morning Session A", icon: Sun, color: "bg-yellow-50" },
  { start: "10:45", end: "12:15", label: "Morning Session B", icon: Sun, color: "bg-yellow-50" },
  { start: "13:30", end: "15:00", label: "Afternoon Session A", icon: Sunset, color: "bg-orange-50" },
  { start: "15:15", end: "16:45", label: "Afternoon Session B", icon: Sunset, color: "bg-orange-50" },
  { start: "18:00", end: "19:30", label: "Evening Session", icon: Moon, color: "bg-indigo-50" },
];

interface TimetableCell {
  slot: SlotDef;
  subjectIndex: number | null; // null = free / break
  label?: string;
}

function getSlotsForDay(dayIndex: number, mode: ScheduleMode): SlotDef[] {
  const isWeekend = dayIndex >= 5;
  if (mode === "term") {
    return isWeekend ? WEEKEND_SLOTS_TERM : WEEKDAY_SLOTS;
  } else {
    // revision / holiday — all days get full schedule
    return HOLIDAY_SLOTS;
  }
}

function generateTimetable(subjects: { id: number; name: string }[], mode: ScheduleMode): TimetableCell[][] {
  // Returns a 7 (days) × n (slots) grid
  if (subjects.length === 0) return DAYS.map((_, di) => getSlotsForDay(di, mode).map(slot => ({ slot, subjectIndex: null })));

  const grid: TimetableCell[][] = [];

  // We rotate subjects round-robin to fill slots
  // Each subject gets assigned cyclically, with variety ensured by skipping consecutive same subject
  let subjectCursor = 0;

  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const slots = getSlotsForDay(dayIndex, mode);
    const dayCells: TimetableCell[] = [];
    let prevSubjectIndex = -1;

    for (let slotIndex = 0; slotIndex < slots.length; slotIndex++) {
      // Pick a subject that isn't the same as the previous slot for variety
      let candidate = subjectCursor % subjects.length;
      let attempts = 0;
      while (candidate === prevSubjectIndex && subjects.length > 1 && attempts < subjects.length) {
        subjectCursor++;
        candidate = subjectCursor % subjects.length;
        attempts++;
      }

      dayCells.push({ slot: slots[slotIndex], subjectIndex: candidate, label: subjects[candidate].name });
      prevSubjectIndex = candidate;
      subjectCursor++;
    }

    grid.push(dayCells);
  }

  return grid;
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${m.toString().padStart(2, "0")}${period}`;
}

function calcDuration(start: string, end: string): string {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${mins}m`;
}

function calcWeeklyHours(grid: TimetableCell[][]): number {
  let total = 0;
  for (const day of grid) {
    for (const cell of day) {
      if (cell.subjectIndex !== null) {
        const [sh, sm] = cell.slot.start.split(":").map(Number);
        const [eh, em] = cell.slot.end.split(":").map(Number);
        total += (eh * 60 + em) - (sh * 60 + sm);
      }
    }
  }
  return Math.round(total / 60 * 10) / 10;
}

function calcSubjectHours(grid: TimetableCell[][], subjectIndex: number): number {
  let total = 0;
  for (const day of grid) {
    for (const cell of day) {
      if (cell.subjectIndex === subjectIndex) {
        const [sh, sm] = cell.slot.start.split(":").map(Number);
        const [eh, em] = cell.slot.end.split(":").map(Number);
        total += (eh * 60 + em) - (sh * 60 + sm);
      }
    }
  }
  return Math.round(total / 60 * 10) / 10;
}

export default function Timetable() {
  const { data: allSubjects = [], isLoading } = useGetSubjects();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [levelFilter, setLevelFilter] = useState<"All" | "GCSE" | "A-Level">("All");
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<ScheduleMode>("term");

  const filteredSubjects = allSubjects.filter(s => {
    const matchLevel = levelFilter === "All" || s.level === levelFilter || s.level === "Both";
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  const selectedSubjects = allSubjects.filter(s => selectedIds.has(s.id));

  const colorMap = useMemo(() => {
    const map: Record<number, typeof SUBJECT_COLORS[0]> = {};
    selectedSubjects.forEach((s, i) => {
      map[s.id] = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
    });
    return map;
  }, [selectedSubjects]);

  const grid = useMemo(() => {
    return generateTimetable(selectedSubjects.map(s => ({ id: s.id, name: s.name })), mode);
  }, [selectedSubjects, mode]);

  const weeklyHours = calcWeeklyHours(grid);

  const toggleSubject = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) return <LoadingSpinner className="mt-32" />;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-primary/80 px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white/80 border border-white/15 rounded-full text-sm font-medium mb-5">
            <CalendarDays className="w-4 h-4" /> Study Programme Builder
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
            Your Personal Study Timetable
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            Select your subjects and we'll build a structured weekly study plan around school hours, weekends, and holidays.
          </p>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {[
              { n: 1, label: "Choose Subjects" },
              { n: 2, label: "Schedule Mode" },
              { n: 3, label: "Your Timetable" },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <button
                  onClick={() => step > s.n && setStep(s.n as 1 | 2 | 3)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    step === s.n
                      ? "bg-white text-slate-900 shadow-lg"
                      : step > s.n
                      ? "bg-white/20 text-white cursor-pointer hover:bg-white/30"
                      : "bg-white/10 text-white/50 cursor-default"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${step > s.n ? "bg-emerald-400 text-white" : step === s.n ? "bg-primary text-white" : "bg-white/20"}`}>
                    {step > s.n ? <Check className="w-3 h-3" /> : s.n}
                  </span>
                  {s.label}
                </button>
                {i < 2 && <div className="w-6 h-px bg-white/20" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <AnimatePresence mode="wait">

          {/* ─── STEP 1: Subject Selection ─── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Which subjects are you sitting?</h2>
                  <p className="text-slate-500 text-sm mt-1">Select all subjects you want to include in your study plan</p>
                </div>
                {selectedIds.size > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 font-medium">{selectedIds.size} selected</span>
                    <button
                      onClick={() => setStep(2)}
                      className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
                      style={{ background: "linear-gradient(135deg, hsl(226,71%,40%) 0%, hsl(226,71%,52%) 100%)" }}
                    >
                      Continue <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1 max-w-xs">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  />
                </div>
                <div className="flex gap-2">
                  {(["All", "GCSE", "A-Level"] as const).map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setLevelFilter(lvl)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        levelFilter === lvl ? "bg-primary text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:border-primary/30"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredSubjects.map((subject) => {
                  const isSelected = selectedIds.has(subject.id);
                  const colorIdx = [...selectedIds].indexOf(subject.id);
                  const color = colorIdx >= 0 ? SUBJECT_COLORS[colorIdx % SUBJECT_COLORS.length] : null;
                  return (
                    <motion.button
                      key={subject.id}
                      onClick={() => toggleSubject(subject.id)}
                      whileTap={{ scale: 0.97 }}
                      className={`relative flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-200 ${
                        isSelected
                          ? `${color?.light} ${color?.border} border-2 shadow-sm`
                          : "bg-white border-slate-200 hover:border-primary/30 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? `${color?.bg} border-transparent` : "border-slate-300"
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold text-sm ${isSelected ? color?.text : "text-slate-800"}`}>{subject.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{subject.category} · {subject.level}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {selectedIds.size > 0 && (
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, hsl(226,71%,40%) 0%, hsl(226,71%,52%) 100%)" }}
                  >
                    Next: Choose Schedule Mode <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ─── STEP 2: Schedule Mode ─── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="max-w-2xl mx-auto">
              <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to subjects
              </button>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">When are you studying?</h2>
              <p className="text-slate-500 text-sm mb-8">Choose the type of schedule that best matches your current period</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                {/* Term Time */}
                <button
                  onClick={() => setMode("term")}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 group ${
                    mode === "term" ? "border-primary bg-primary/5 shadow-md" : "border-slate-200 bg-white hover:border-primary/40"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${mode === "term" ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"}`}>
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">Term Time</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                    Study sessions around your school day — lunchtime, after school, and evenings during the week, with longer sessions at weekends.
                  </p>
                  <div className="space-y-1.5 text-xs font-medium">
                    <div className="flex items-center gap-2 text-slate-600"><Coffee className="w-3.5 h-3.5 text-amber-500" /> Weekdays: Lunch + After school + Evening</div>
                    <div className="flex items-center gap-2 text-slate-600"><Sun className="w-3.5 h-3.5 text-yellow-500" /> Weekends: Morning + Afternoon + Evening</div>
                  </div>
                </button>

                {/* Revision / Holiday */}
                <button
                  onClick={() => setMode("revision")}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 group ${
                    mode === "revision" ? "border-primary bg-primary/5 shadow-md" : "border-slate-200 bg-white hover:border-primary/40"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${mode === "revision" ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"}`}>
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">Revision / Holidays</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                    Full-day study plan for school holidays, study leave, or intensive pre-exam revision periods with 5 sessions every day.
                  </p>
                  <div className="space-y-1.5 text-xs font-medium">
                    <div className="flex items-center gap-2 text-slate-600"><Sun className="w-3.5 h-3.5 text-yellow-500" /> Every day: 2 morning + 2 afternoon + evening</div>
                    <div className="flex items-center gap-2 text-slate-600"><Clock className="w-3.5 h-3.5 text-indigo-500" /> Up to ~{selectedSubjects.length > 0 ? Math.round(7 * 5 * 1.4) : "35"}+ hours/week</div>
                  </div>
                </button>
              </div>

              {/* Selected subjects summary */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-8">
                <h4 className="font-semibold text-slate-700 text-sm mb-3">Your subjects ({selectedSubjects.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSubjects.map((s, i) => {
                    const color = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
                    return (
                      <span key={s.id} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${color.light} ${color.text}`}>
                        <span className={`w-2 h-2 rounded-full ${color.bg}`} />
                        {s.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                className="group w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, hsl(226,71%,40%) 0%, hsl(226,71%,52%) 100%)" }}
              >
                Generate My Timetable <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* ─── STEP 3: Timetable View ─── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-1">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <h2 className="text-2xl font-bold text-slate-900">Your Weekly Study Plan</h2>
                  <p className="text-slate-500 text-sm mt-0.5">
                    {mode === "term" ? "Term-time schedule" : "Revision / holiday schedule"} · <span className="font-semibold text-primary">{weeklyHours} hours/week</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setSelectedIds(new Set()); setStep(1); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Start over
                  </button>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
                  <p className="text-2xl font-bold text-primary">{weeklyHours}h</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Hours/Week</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
                  <p className="text-2xl font-bold text-emerald-600">{selectedSubjects.length}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Subjects</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
                  <p className="text-2xl font-bold text-violet-600">{grid.reduce((acc, day) => acc + day.length, 0)}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Sessions/Week</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
                  <p className="text-2xl font-bold text-orange-500">{Math.round(weeklyHours / selectedSubjects.length * 10) / 10}h</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Per Subject/Wk</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedSubjects.map((s, i) => {
                  const color = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
                  const hours = calcSubjectHours(grid, i);
                  return (
                    <div key={s.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${color.light} ${color.border}`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${color.bg} shrink-0`} />
                      <span className={`text-xs font-semibold ${color.text}`}>{s.name}</span>
                      <span className="text-xs text-slate-400 font-medium">{hours}h/wk</span>
                    </div>
                  );
                })}
              </div>

              {/* Timetable grid — scrollable horizontally */}
              <div className="overflow-x-auto pb-4">
                <div className="min-w-[700px]">
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {DAYS.map((day, di) => {
                      const isWeekend = di >= 5;
                      return (
                        <div key={day} className={`text-center py-2 rounded-xl text-xs font-bold tracking-wide uppercase ${
                          isWeekend ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-600"
                        }`}>
                          <span className="hidden sm:inline">{day}</span>
                          <span className="sm:hidden">{DAYS_SHORT[di]}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Find max slots to render rows correctly */}
                  {(() => {
                    const maxSlots = Math.max(...grid.map(d => d.length));
                    return Array.from({ length: maxSlots }, (_, slotIndex) => (
                      <div key={slotIndex} className="grid grid-cols-7 gap-2 mb-2">
                        {grid.map((daySlots, dayIndex) => {
                          const cell = daySlots[slotIndex];
                          if (!cell) return <div key={dayIndex} />;
                          const isWeekend = dayIndex >= 5;
                          const color = cell.subjectIndex !== null ? SUBJECT_COLORS[cell.subjectIndex % SUBJECT_COLORS.length] : null;
                          const SlotIcon = cell.slot.icon;
                          return (
                            <motion.div
                              key={dayIndex}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: (dayIndex + slotIndex * 7) * 0.02 }}
                              className={`rounded-xl p-3 border transition-all ${
                                color
                                  ? `${color.light} ${color.border} border`
                                  : `${cell.slot.color} border-transparent`
                              }`}
                            >
                              <div className="flex items-center gap-1 mb-1.5">
                                <SlotIcon className={`w-3 h-3 ${color ? color.text : "text-slate-400"} shrink-0`} />
                                <span className="text-[10px] text-slate-400 font-medium leading-tight truncate">
                                  {formatTime(cell.slot.start)}–{formatTime(cell.slot.end)}
                                </span>
                              </div>
                              {color && cell.label ? (
                                <p className={`text-xs font-bold leading-tight ${color.text}`}>{cell.label}</p>
                              ) : (
                                <p className="text-xs text-slate-400 italic">Free slot</p>
                              )}
                              <p className="text-[10px] text-slate-400 mt-1">{calcDuration(cell.slot.start, cell.slot.end)}</p>
                            </motion.div>
                          );
                        })}
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Study Tips */}
              <div className="mt-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Study Tips for Your Plan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: "🧠", tip: "Use active recall — close your notes and write down everything you remember after each session." },
                    { icon: "⏱️", tip: "Stick to the Pomodoro technique: 25 mins focused study, 5 mins break — it preserves concentration." },
                    { icon: "📝", tip: "Summarise each session in 3 bullet points in a revision notebook before you finish." },
                    { icon: "🔄", tip: "Revisit the previous session's topic at the start of each new one — spaced repetition boosts retention." },
                    { icon: "📅", tip: "Mark exam dates on a calendar and work backwards to prioritise subjects with closer deadlines." },
                    { icon: "💤", tip: "Never skip sleep for revision. The brain consolidates memory during sleep — rest is part of the plan." },
                  ].map((t, i) => (
                    <div key={i} className="flex gap-3 items-start bg-white rounded-xl p-4 border border-white shadow-sm">
                      <span className="text-xl shrink-0">{t.icon}</span>
                      <p className="text-xs text-slate-600 leading-relaxed">{t.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
