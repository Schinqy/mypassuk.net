import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, BookOpen, ChevronRight, ChevronLeft, Clock, Coffee,
  Sun, Sunset, Moon, RotateCcw, GraduationCap, Check, Save,
  FolderOpen, Trash2, FlaskConical, Atom, Leaf, X, Plus, Download,
  Play, Pause, Square, Bell, Timer, Minimize2, Maximize2, SkipForward,
} from "lucide-react";
import { useGetSubjects } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Link } from "wouter";

function isPremiumUser(): boolean {
  return localStorage.getItem("uk-edguide-premium") === "true";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COMBINED_SCIENCE_ID = 80;

const COMBINED_SCIENCE_COMPONENTS = [
  { id: "cs-bio", name: "Combined Science: Biology", icon: Leaf, category: "STEM", level: "GCSE", virtual: true },
  { id: "cs-chem", name: "Combined Science: Chemistry", icon: FlaskConical, category: "STEM", level: "GCSE", virtual: true },
  { id: "cs-phys", name: "Combined Science: Physics", icon: Atom, category: "STEM", level: "GCSE", virtual: true },
] as const;

const SUBJECT_COLORS = [
  { bg: "bg-blue-500", light: "bg-blue-100", text: "text-blue-700", border: "border-blue-300", hex: "#3b82f6" },
  { bg: "bg-green-700", light: "bg-green-100", text: "text-green-800", border: "border-green-300", hex: "#15803d" },
  { bg: "bg-violet-500", light: "bg-violet-100", text: "text-violet-700", border: "border-violet-300", hex: "#8b5cf6" },
  { bg: "bg-orange-500", light: "bg-orange-100", text: "text-orange-700", border: "border-orange-300", hex: "#f97316" },
  { bg: "bg-pink-500", light: "bg-pink-100", text: "text-pink-700", border: "border-pink-300", hex: "#ec4899" },
  { bg: "bg-cyan-500", light: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-300", hex: "#06b6d4" },
  { bg: "bg-amber-500", light: "bg-amber-100", text: "text-amber-700", border: "border-amber-300", hex: "#f59e0b" },
  { bg: "bg-rose-500", light: "bg-rose-100", text: "text-rose-700", border: "border-rose-300", hex: "#f43f5e" },
  { bg: "bg-teal-700", light: "bg-teal-100", text: "text-teal-800", border: "border-teal-300", hex: "#0f766e" },
  { bg: "bg-indigo-500", light: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-300", hex: "#6366f1" },
  { bg: "bg-lime-500", light: "bg-lime-100", text: "text-lime-700", border: "border-lime-300", hex: "#84cc16" },
  { bg: "bg-fuchsia-500", light: "bg-fuchsia-100", text: "text-fuchsia-700", border: "border-fuchsia-300", hex: "#d946ef" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type ScheduleMode = "term" | "revision";

interface SlotDef {
  start: string;
  end: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

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

// ─── Break / Timer Types ───────────────────────────────────────────────────────

type SegmentKind = "study" | "break";

interface Segment {
  kind: SegmentKind;
  durationSecs: number;
  label: string;
  breakActivity?: string;
}

interface ActiveSession {
  subjectName: string;
  slotLabel: string;
  colorHex: string;
  colorClass: (typeof SUBJECT_COLORS)[0];
  segments: Segment[];
  segIdx: number;
  secsRemaining: number;
  paused: boolean;
  completed: boolean;
  minimised: boolean;
}

// ─── Break schedule builder ────────────────────────────────────────────────────

function buildSegments(totalMins: number): Segment[] {
  if (totalMins <= 30) {
    return [{ kind: "study", durationSecs: totalMins * 60, label: "Study" }];
  }
  if (totalMins <= 50) {
    // One short break in the middle
    const half = Math.floor(totalMins / 2);
    return [
      { kind: "study", durationSecs: half * 60, label: "Study Block 1" },
      { kind: "break", durationSecs: 5 * 60, label: "5-min Break", breakActivity: "Rest your eyes & drink water 💧" },
      { kind: "study", durationSecs: (totalMins - half) * 60, label: "Study Block 2" },
    ];
  }
  if (totalMins <= 75) {
    // Two 25-min study blocks with one 5-min break
    const remaining = totalMins - 30;
    return [
      { kind: "study", durationSecs: 25 * 60, label: "Study Block 1" },
      { kind: "break", durationSecs: 5 * 60, label: "5-min Break", breakActivity: "Stand up & walk around 🚶" },
      { kind: "study", durationSecs: remaining * 60, label: "Study Block 2" },
    ];
  }
  if (totalMins <= 90) {
    // Two 25-min blocks + one 5-min break + final block
    const lastBlock = totalMins - 60;
    return [
      { kind: "study", durationSecs: 25 * 60, label: "Study Block 1" },
      { kind: "break", durationSecs: 5 * 60, label: "5-min Break", breakActivity: "Drink water & rest your eyes 💧" },
      { kind: "study", durationSecs: 25 * 60, label: "Study Block 2" },
      { kind: "break", durationSecs: 5 * 60, label: "5-min Break", breakActivity: "Stretch & move around 🧘" },
      { kind: "study", durationSecs: lastBlock * 60, label: "Study Block 3" },
    ];
  }
  // 90+ mins: three 25-min blocks with two 10-min breaks
  const lastBlock = totalMins - 80;
  return [
    { kind: "study", durationSecs: 25 * 60, label: "Study Block 1" },
    { kind: "break", durationSecs: 10 * 60, label: "10-min Break", breakActivity: "Walk outside & drink water 💧" },
    { kind: "study", durationSecs: 25 * 60, label: "Study Block 2" },
    { kind: "break", durationSecs: 10 * 60, label: "10-min Break", breakActivity: "Healthy snack & fresh air 🍎" },
    { kind: "study", durationSecs: lastBlock * 60, label: "Study Block 3" },
  ];
}

function totalSegmentSecs(segments: Segment[]) {
  return segments.reduce((a, s) => a + s.durationSecs, 0);
}

function elapsedSecs(segments: Segment[], segIdx: number, secsRemaining: number) {
  const completedSecs = segments.slice(0, segIdx).reduce((a, s) => a + s.durationSecs, 0);
  return completedSecs + (segments[segIdx]?.durationSecs ?? 0) - secsRemaining;
}

function fmtMMSS(secs: number) {
  const s = Math.max(0, secs);
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}

// ─── Circular Progress Ring ────────────────────────────────────────────────────

function CircularProgress({ progress, color, size = 160, strokeWidth = 10 }: {
  progress: number; color: string; size?: number; strokeWidth?: number;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.max(0, Math.min(1, progress)));
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.9s linear" }}
      />
    </svg>
  );
}

// ─── Break pill showing structure ─────────────────────────────────────────────

function BreakStructurePill({ totalMins }: { totalMins: number }) {
  const segs = buildSegments(totalMins);
  const breakCount = segs.filter(s => s.kind === "break").length;
  if (breakCount === 0) return null;
  return (
    <div className="flex items-center gap-0.5 flex-wrap mt-1.5">
      {segs.map((seg, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full ${seg.kind === "study" ? "bg-primary/40" : "bg-emerald-400"}`}
          style={{ width: `${Math.round((seg.durationSecs / 60 / totalMins) * 48)}px`, minWidth: "4px" }}
          title={`${seg.label} — ${Math.round(seg.durationSecs / 60)}m`}
        />
      ))}
      <span className="text-[9px] text-slate-400 ml-1 font-medium">
        {breakCount} break{breakCount !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

// ─── Session Timer Modal ───────────────────────────────────────────────────────

function SessionTimerModal({
  session,
  onPause,
  onResume,
  onSkip,
  onStop,
  onMinimise,
}: {
  session: ActiveSession;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  onStop: () => void;
  onMinimise: () => void;
}) {
  const seg = session.segments[session.segIdx];
  const isBreak = seg?.kind === "break";
  const isCompleted = session.completed;

  const totalSecs = totalSegmentSecs(session.segments);
  const elapsed = elapsedSecs(session.segments, session.segIdx, session.secsRemaining);
  const overallProgress = elapsed / totalSecs;

  const segProgress = seg ? 1 - session.secsRemaining / seg.durationSecs : 1;
  const ringColor = isCompleted ? "#16a34a" : isBreak ? "#10b981" : session.colorHex;
  const ringText = isCompleted ? "Done!" : isBreak ? "Break" : "Study";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div
          className="px-6 pt-6 pb-4 flex items-start justify-between"
          style={{ background: isBreak || isCompleted ? "#f0fdf4" : `${session.colorHex}18` }}
        >
          <div>
            <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${isBreak ? "text-emerald-600" : isCompleted ? "text-green-700" : session.colorClass.text}`}>
              {isCompleted ? "Session Complete" : isBreak ? "☕ Break Time!" : "📚 Studying"}
            </div>
            <h3 className="font-bold text-slate-900 text-lg leading-tight">{session.subjectName}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{session.slotLabel}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={onMinimise} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors" title="Minimise">
              <Minimize2 className="w-4 h-4" />
            </button>
            <button onClick={onStop} className="p-2 rounded-xl text-slate-400 hover:bg-red-100 hover:text-red-500 transition-colors" title="End session">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Circular timer */}
          <div className="flex flex-col items-center my-6 relative">
            <CircularProgress progress={isCompleted ? 1 : segProgress} color={ringColor} size={180} strokeWidth={12} />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              {isCompleted ? (
                <>
                  <Check className="w-10 h-10 text-green-600" />
                  <span className="text-sm font-bold text-green-700">All done!</span>
                </>
              ) : (
                <>
                  <span className={`text-4xl font-mono font-bold tabular-nums ${isBreak ? "text-emerald-600" : "text-slate-900"}`}>
                    {fmtMMSS(session.secsRemaining)}
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${isBreak ? "text-emerald-500" : session.colorClass.text}`}>
                    {ringText}
                  </span>
                  {isBreak && seg?.breakActivity && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] text-slate-500 text-center max-w-[120px] leading-tight mt-1"
                    >
                      {seg.breakActivity}
                    </motion.span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Current segment label */}
          {!isCompleted && (
            <div className={`text-center text-sm font-semibold mb-4 ${isBreak ? "text-emerald-700" : "text-slate-700"}`}>
              {seg?.label}
              {" · "}
              <span className="font-normal text-slate-400 text-xs">
                Block {session.segIdx + 1} of {session.segments.length}
              </span>
            </div>
          )}

          {/* Overall progress bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Overall progress</span>
              <span>{Math.round(overallProgress * 100)}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: isCompleted ? "#16a34a" : `linear-gradient(90deg, ${session.colorHex}, ${isBreak ? "#10b981" : session.colorHex}cc)` }}
                animate={{ width: `${Math.round(overallProgress * 100)}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          {/* Segment indicators */}
          <div className="flex items-center gap-1.5 mb-6 flex-wrap">
            {session.segments.map((s, i) => {
              const isDone = i < session.segIdx;
              const isCurrent = i === session.segIdx && !isCompleted;
              return (
                <div key={i} className="flex items-center gap-1">
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                    isDone ? "bg-slate-100 text-slate-400 line-through" :
                    isCurrent ? (s.kind === "break" ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300" : "bg-primary/10 text-primary ring-2 ring-primary/30") :
                    s.kind === "break" ? "bg-slate-50 text-slate-300 border border-slate-200" : "bg-slate-50 text-slate-300 border border-slate-200"
                  }`}>
                    {s.kind === "break" ? <Coffee className="w-2.5 h-2.5" /> : <BookOpen className="w-2.5 h-2.5" />}
                    {Math.round(s.durationSecs / 60)}m
                  </div>
                  {i < session.segments.length - 1 && <div className="w-1.5 h-px bg-slate-200" />}
                </div>
              );
            })}
          </div>

          {/* Controls */}
          {isCompleted ? (
            <button onClick={onStop}
              className="w-full py-3 rounded-2xl font-bold text-white text-sm bg-green-600 hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> Close — great work!
            </button>
          ) : (
            <div className="flex gap-2">
              {session.paused ? (
                <button onClick={onResume}
                  className="flex-1 py-3 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background: `linear-gradient(135deg, ${session.colorHex}, ${session.colorHex}cc)` }}>
                  <Play className="w-4 h-4 fill-current" /> Resume
                </button>
              ) : (
                <button onClick={onPause}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2 transition-colors">
                  <Pause className="w-4 h-4 fill-current" /> Pause
                </button>
              )}
              <button onClick={onSkip}
                className="px-4 py-3 rounded-2xl text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 text-sm font-semibold"
                title="Skip to next segment">
                <SkipForward className="w-4 h-4" /> Skip
              </button>
              <button onClick={onStop}
                className="px-4 py-3 rounded-2xl text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors"
                title="End session">
                <Square className="w-4 h-4 fill-current" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Minimised pill ────────────────────────────────────────────────────────────

function MinimisedPill({ session, onExpand, onStop }: {
  session: ActiveSession;
  onExpand: () => void;
  onStop: () => void;
}) {
  const seg = session.segments[session.segIdx];
  const isBreak = seg?.kind === "break";
  const isCompleted = session.completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 60 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] flex items-center gap-3 bg-white rounded-2xl shadow-2xl border border-slate-200 px-4 py-2.5 cursor-pointer"
      onClick={onExpand}
    >
      <div className={`w-2 h-2 rounded-full animate-pulse ${isCompleted ? "bg-green-500" : isBreak ? "bg-emerald-400" : "bg-primary"}`} />
      <div className="text-sm">
        <span className="font-bold text-slate-900">{session.subjectName}</span>
        <span className="text-slate-400 mx-1.5">·</span>
        <span className={`font-semibold ${isBreak ? "text-emerald-600" : "text-primary"}`}>
          {isCompleted ? "Done!" : `${isBreak ? "☕ Break" : "📚 Study"} — ${fmtMMSS(session.secsRemaining)}`}
        </span>
      </div>
      <button onClick={e => { e.stopPropagation(); onExpand(); }} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
      <button onClick={e => { e.stopPropagation(); onStop(); }} className="p-1 rounded-lg text-slate-400 hover:text-rose-500">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface EffectiveSubject {
  id: number | string;
  name: string;
  category: string;
  level: string;
  virtual?: boolean;
}

interface TimetableCell {
  slot: SlotDef;
  subjectIndex: number | null;
  label?: string;
}

interface SavedPlan {
  id: string;
  name: string;
  subjectIds: number[];
  mode: ScheduleMode;
  savedAt: string;
}

// ─── LocalStorage helpers ─────────────────────────────────────────────────────

const LS_KEY = "uk-edguide-saved-plans";

function loadSavedPlans(): SavedPlan[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function persistPlans(plans: SavedPlan[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(plans));
}

// ─── Timetable helpers ────────────────────────────────────────────────────────

function getSlotsForDay(dayIndex: number, mode: ScheduleMode): SlotDef[] {
  const isWeekend = dayIndex >= 5;
  if (mode === "term") return isWeekend ? WEEKEND_SLOTS_TERM : WEEKDAY_SLOTS;
  return HOLIDAY_SLOTS;
}

function buildEffectiveSubjects(selected: { id: number; name: string; category: string; level: string }[]): EffectiveSubject[] {
  const result: EffectiveSubject[] = [];
  for (const s of selected) {
    if (s.id === COMBINED_SCIENCE_ID) {
      result.push(...COMBINED_SCIENCE_COMPONENTS);
    } else {
      result.push(s);
    }
  }
  return result;
}

function generateTimetable(subjects: EffectiveSubject[], mode: ScheduleMode): TimetableCell[][] {
  if (subjects.length === 0) {
    return DAYS.map((_, di) => getSlotsForDay(di, mode).map(slot => ({ slot, subjectIndex: null })));
  }
  let cursor = 0;
  return DAYS.map((_, dayIndex) => {
    const slots = getSlotsForDay(dayIndex, mode);
    let prev = -1;
    return slots.map(slot => {
      let pick = cursor % subjects.length;
      let tries = 0;
      while (pick === prev && subjects.length > 1 && tries < subjects.length) {
        cursor++; pick = cursor % subjects.length; tries++;
      }
      prev = pick;
      cursor++;
      return { slot, subjectIndex: pick, label: subjects[pick].name };
    });
  });
}

function calcMins(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

function formatDuration(mins: number) {
  if (mins >= 60) { const h = Math.floor(mins / 60); const m = mins % 60; return m ? `${h}h ${m}m` : `${h}h`; }
  return `${mins}m`;
}

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const p = h >= 12 ? "pm" : "am";
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${m.toString().padStart(2, "0")}${p}`;
}

function calcWeeklyMins(grid: TimetableCell[][]) {
  return grid.flat().reduce((acc, c) => c.subjectIndex !== null ? acc + calcMins(c.slot.start, c.slot.end) : acc, 0);
}

function calcSubjectMins(grid: TimetableCell[][], idx: number) {
  return grid.flat().reduce((acc, c) => c.subjectIndex === idx ? acc + calcMins(c.slot.start, c.slot.end) : acc, 0);
}

function rnd(mins: number) { return Math.round(mins / 6) / 10; }
function nanoid6() { return Math.random().toString(36).slice(2, 8); }

// ─── Save Modal ───────────────────────────────────────────────────────────────

function SaveModal({ onSave, onClose }: { onSave: (name: string) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Save className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Save Timetable</h3>
            <p className="text-xs text-slate-500">Give your plan a name to find it later</p>
          </div>
        </div>
        <input
          autoFocus type="text" placeholder="e.g. Year 11 Term 2 Plan"
          value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && name.trim() && onSave(name.trim())}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 mb-4"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button
            onClick={() => name.trim() && onSave(name.trim())}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-all"
            style={{ background: "linear-gradient(135deg, hsl(224,76%,28%) 0%, hsl(224,76%,40%) 100%)" }}
          >
            Save Plan
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Timetable() {
  const { data: allSubjects = [], isLoading } = useGetSubjects();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [levelFilter, setLevelFilter] = useState<"All" | "GCSE" | "A-Level">("All");
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<ScheduleMode>("term");

  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(loadSavedPlans);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [premium] = useState(isPremiumUser);
  const [showPdfGate, setShowPdfGate] = useState(false);
  const [showSaveLimitGate, setShowSaveLimitGate] = useState(false);
  const FREE_PLAN_LIMIT = 3;

  // ─── Timer state ─────────────────────────────────────────────────────────────
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const advanceTimer = useCallback(() => {
    setActiveSession(prev => {
      if (!prev || prev.paused || prev.completed) return prev;
      const newSecs = prev.secsRemaining - 1;
      if (newSecs > 0) return { ...prev, secsRemaining: newSecs };
      // Segment completed — move to next
      const nextIdx = prev.segIdx + 1;
      if (nextIdx >= prev.segments.length) {
        // All done
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Session complete!", { body: `${prev.subjectName} study session finished. 🎉`, icon: "/favicon.ico" });
        }
        return { ...prev, secsRemaining: 0, completed: true };
      }
      const nextSeg = prev.segments[nextIdx];
      // Break alert notification
      if (nextSeg.kind === "break" && "Notification" in window && Notification.permission === "granted") {
        new Notification("Break time!", { body: nextSeg.breakActivity ?? "Time for a short break 🧘", icon: "/favicon.ico" });
      }
      if (nextSeg.kind === "study" && "Notification" in window && Notification.permission === "granted") {
        new Notification("Back to study!", { body: `${nextSeg.label} — let's go! 📚`, icon: "/favicon.ico" });
      }
      return { ...prev, segIdx: nextIdx, secsRemaining: nextSeg.durationSecs };
    });
  }, []);

  useEffect(() => {
    if (activeSession && !activeSession.paused && !activeSession.completed) {
      clearTimer();
      intervalRef.current = setInterval(advanceTimer, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [activeSession?.paused, activeSession?.completed, advanceTimer, clearTimer]);

  const startSession = useCallback((cell: TimetableCell, colorClass: typeof SUBJECT_COLORS[0]) => {
    clearTimer();
    const totalMins = calcMins(cell.slot.start, cell.slot.end);
    const segments = buildSegments(totalMins);
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setActiveSession({
      subjectName: cell.label ?? "Study",
      slotLabel: cell.slot.label,
      colorHex: colorClass.hex,
      colorClass,
      segments,
      segIdx: 0,
      secsRemaining: segments[0].durationSecs,
      paused: false,
      completed: false,
      minimised: false,
    });
  }, [clearTimer]);

  const filteredSubjects = allSubjects.filter(s => {
    const matchLevel = levelFilter === "All" || s.level === levelFilter || s.level === "Both";
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  const selectedSubjects = allSubjects.filter(s => selectedIds.has(s.id));
  const effectiveSubjects = useMemo(() => buildEffectiveSubjects(selectedSubjects), [selectedSubjects]);
  const grid = useMemo(() => generateTimetable(effectiveSubjects, mode), [effectiveSubjects, mode]);

  const weeklyMins = calcWeeklyMins(grid);
  const weeklyHours = rnd(weeklyMins);
  const perSubject = effectiveSubjects.length > 0 ? rnd(weeklyMins / effectiveSubjects.length) : 0;
  const totalSessions = grid.reduce((a, d) => a + d.length, 0);

  const toggleSubject = (id: number) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const handleSaveClick = () => {
    if (!premium && savedPlans.length >= FREE_PLAN_LIMIT) {
      setShowSaveLimitGate(true);
    } else {
      setShowSaveModal(true);
    }
  };

  const handleSave = useCallback((name: string) => {
    const plan: SavedPlan = {
      id: nanoid6(), name, subjectIds: [...selectedIds], mode, savedAt: new Date().toISOString(),
    };
    const updated = [plan, ...savedPlans];
    setSavedPlans(updated);
    persistPlans(updated);
    setShowSaveModal(false);
    setSavedBanner(name);
    setTimeout(() => setSavedBanner(null), 3000);
  }, [selectedIds, mode, savedPlans]);

  const handleDeletePlan = (id: string) => {
    const updated = savedPlans.filter(p => p.id !== id);
    setSavedPlans(updated);
    persistPlans(updated);
  };

  const handleLoadPlan = (plan: SavedPlan) => {
    setSelectedIds(new Set(plan.subjectIds));
    setMode(plan.mode);
    setStep(3);
    setShowSavedPanel(false);
  };

  const hasCombinedScience = selectedIds.has(COMBINED_SCIENCE_ID);

  if (isLoading) return <LoadingSpinner className="mt-32" />;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">

      {/* Saved banner toast */}
      <AnimatePresence>
        {savedBanner && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[9998] flex items-center gap-2 px-5 py-3 bg-green-800 text-white text-sm font-semibold rounded-full shadow-xl">
            <Check className="w-4 h-4" /> "{savedBanner}" saved!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Timer */}
      <AnimatePresence>
        {activeSession && !activeSession.minimised && (
          <SessionTimerModal
            session={activeSession}
            onPause={() => setActiveSession(s => s ? { ...s, paused: true } : s)}
            onResume={() => setActiveSession(s => s ? { ...s, paused: false } : s)}
            onSkip={() => setActiveSession(s => {
              if (!s) return s;
              const nextIdx = s.segIdx + 1;
              if (nextIdx >= s.segments.length) return { ...s, completed: true, secsRemaining: 0 };
              return { ...s, segIdx: nextIdx, secsRemaining: s.segments[nextIdx].durationSecs, paused: false };
            })}
            onStop={() => { clearTimer(); setActiveSession(null); }}
            onMinimise={() => setActiveSession(s => s ? { ...s, minimised: true } : s)}
          />
        )}
      </AnimatePresence>

      {/* Minimised pill */}
      <AnimatePresence>
        {activeSession && activeSession.minimised && (
          <MinimisedPill
            session={activeSession}
            onExpand={() => setActiveSession(s => s ? { ...s, minimised: false } : s)}
            onStop={() => { clearTimer(); setActiveSession(null); }}
          />
        )}
      </AnimatePresence>

      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && <SaveModal onSave={handleSave} onClose={() => setShowSaveModal(false)} />}
      </AnimatePresence>

      {/* PDF Premium Gate Modal */}
      <AnimatePresence>
        {showPdfGate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => setShowPdfGate(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center" onClick={e => e.stopPropagation()}>
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Export as PDF</h3>
              <p className="text-sm text-slate-500 mb-6">Save your study timetable as a printable PDF — available with Student Premium.</p>
              <Link href="/pricing">
                <button onClick={() => setShowPdfGate(false)}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white mb-3 hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, hsl(224,76%,28%) 0%, hsl(224,76%,40%) 100%)" }}>
                  Upgrade to Premium — £3.99/mo
                </button>
              </Link>
              <button onClick={() => setShowPdfGate(false)} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Maybe later</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Limit Gate Modal */}
      <AnimatePresence>
        {showSaveLimitGate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => setShowSaveLimitGate(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center" onClick={e => e.stopPropagation()}>
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Save className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Plan limit reached</h3>
              <p className="text-sm text-slate-500 mb-6">Free accounts can save up to {FREE_PLAN_LIMIT} study plans. Upgrade to Premium for unlimited saves.</p>
              <Link href="/pricing">
                <button onClick={() => setShowSaveLimitGate(false)}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white mb-3 hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, hsl(224,76%,28%) 0%, hsl(224,76%,40%) 100%)" }}>
                  Upgrade to Premium — £3.99/mo
                </button>
              </Link>
              <button onClick={() => setShowSaveLimitGate(false)} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Maybe later</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-primary/80 px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white/80 border border-white/15 rounded-full text-sm font-medium mb-5">
            <CalendarDays className="w-4 h-4" /> Study Programme Builder
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">Your Personal Study Timetable</h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            Select your subjects, pick your schedule mode, and start timed sessions with automatic break alerts built in.
          </p>

          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            <div className="flex items-center gap-2">
              {[
                { n: 1, label: "Choose Subjects" },
                { n: 2, label: "Schedule Mode" },
                { n: 3, label: "Your Timetable" },
              ].map((s, i) => (
                <div key={s.n} className="flex items-center gap-2">
                  <button
                    onClick={() => (step > s.n) && setStep(s.n as 1 | 2 | 3)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${step === s.n ? "bg-white text-slate-900 shadow-lg" : step > s.n ? "bg-white/20 text-white cursor-pointer hover:bg-white/30" : "bg-white/10 text-white/50 cursor-default"}`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${step > s.n ? "bg-green-700 text-white" : step === s.n ? "bg-primary text-white" : "bg-white/20"}`}>
                      {step > s.n ? <Check className="w-3 h-3" /> : s.n}
                    </span>
                    {s.label}
                  </button>
                  {i < 2 && <div className="w-6 h-px bg-white/20" />}
                </div>
              ))}
            </div>

            {savedPlans.length > 0 && (
              <button onClick={() => setShowSavedPanel(v => !v)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/20 transition-all">
                <FolderOpen className="w-3.5 h-3.5" /> My Plans ({savedPlans.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Saved Plans Drawer */}
      <AnimatePresence>
        {showSavedPanel && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-indigo-950 border-b border-white/10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-indigo-300" /> Saved Timetables
                </h3>
                <button onClick={() => setShowSavedPanel(false)} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedPlans.map(plan => (
                  <div key={plan.id} className="flex items-center gap-3 bg-white/10 hover:bg-white/15 rounded-xl p-3 border border-white/10 transition-all group">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{plan.name}</p>
                      <p className="text-indigo-300 text-xs mt-0.5">
                        {plan.subjectIds.length} subject{plan.subjectIds.length !== 1 ? "s" : ""} · {plan.mode === "term" ? "Term Time" : "Revision"} · {new Date(plan.savedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleLoadPlan(plan)}
                        className="px-3 py-1.5 bg-primary hover:bg-primary/80 text-white text-xs font-semibold rounded-lg transition-colors">
                        Load
                      </button>
                      <button onClick={() => handleDeletePlan(plan.id)}
                        className="p-1.5 text-white/40 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <AnimatePresence mode="wait">

          {/* ─── STEP 1 ─── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Which subjects are you sitting?</h2>
                  <p className="text-slate-500 text-sm mt-1">Select all subjects you want included. Combined Science automatically splits into Biology, Chemistry and Physics.</p>
                </div>
                {selectedIds.size > 0 && (
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm text-slate-600 font-medium">{selectedIds.size} selected</span>
                    <button onClick={() => setStep(2)}
                      className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
                      style={{ background: "linear-gradient(135deg, hsl(224,76%,28%) 0%, hsl(224,76%,40%) 100%)" }}>
                      Continue <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}
              </div>

              {hasCombinedScience && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-xl mb-5 text-sm">
                  <div className="flex gap-1 mt-0.5 shrink-0">
                    <Leaf className="w-4 h-4 text-green-700" />
                    <FlaskConical className="w-4 h-4 text-blue-500" />
                    <Atom className="w-4 h-4 text-violet-500" />
                  </div>
                  <p className="text-indigo-800">
                    <span className="font-semibold">Combined Science detected</span> — your timetable will include separate sessions for <strong>Biology</strong>, <strong>Chemistry</strong>, and <strong>Physics</strong>.
                  </p>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1 max-w-xs">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search subjects..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40" />
                </div>
                <div className="flex gap-2">
                  {(["All", "GCSE", "A-Level"] as const).map(lvl => (
                    <button key={lvl} onClick={() => setLevelFilter(lvl)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${levelFilter === lvl ? "bg-primary text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:border-primary/30"}`}>
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredSubjects.map(subject => {
                  const isSelected = selectedIds.has(subject.id);
                  const colorIdx = [...selectedIds].indexOf(subject.id);
                  const color = colorIdx >= 0 ? SUBJECT_COLORS[colorIdx % SUBJECT_COLORS.length] : null;
                  const isCombined = subject.id === COMBINED_SCIENCE_ID;
                  return (
                    <motion.button key={subject.id} onClick={() => toggleSubject(subject.id)} whileTap={{ scale: 0.97 }}
                      className={`relative flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-200 ${
                        isSelected ? `${color?.light} ${color?.border} border-2 shadow-sm` : "bg-white border-slate-200 hover:border-primary/30 hover:bg-slate-50"
                      }`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? `${color?.bg} border-transparent` : "border-slate-300"}`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`font-semibold text-sm ${isSelected ? color?.text : "text-slate-800"}`}>{subject.name}</p>
                          {isCombined && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                              <Plus className="w-2.5 h-2.5" />3 components
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{subject.category} · {subject.level}</p>
                        {isCombined && isSelected && (
                          <div className="flex gap-1 mt-1.5">
                            {[{ label: "Bio", icon: Leaf, c: "text-green-700" }, { label: "Chem", icon: FlaskConical, c: "text-blue-600" }, { label: "Phys", icon: Atom, c: "text-violet-600" }].map(x => (
                              <span key={x.label} className={`flex items-center gap-0.5 text-[10px] font-semibold ${x.c}`}>
                                <x.icon className="w-2.5 h-2.5" />{x.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {selectedIds.size > 0 && (
                <div className="mt-8 flex justify-end">
                  <button onClick={() => setStep(2)}
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, hsl(224,76%,28%) 0%, hsl(224,76%,40%) 100%)" }}>
                    Next: Choose Schedule Mode <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ─── STEP 2 ─── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="max-w-2xl mx-auto">
              <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to subjects
              </button>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">When are you studying?</h2>
              <p className="text-slate-500 text-sm mb-8">Choose the type of schedule that best matches your current period</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                <button onClick={() => setMode("term")}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 group ${mode === "term" ? "border-primary bg-primary/5 shadow-md" : "border-slate-200 bg-white hover:border-primary/40"}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${mode === "term" ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"}`}>
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">Term Time</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">Study slots fitted around your school day — lunchtime, after school, evenings during the week, with longer sessions at weekends.</p>
                  <div className="space-y-1.5 text-xs font-medium">
                    <div className="flex items-center gap-2 text-slate-600"><Coffee className="w-3.5 h-3.5 text-amber-500" /> Weekdays: Lunch + After school + Evening</div>
                    <div className="flex items-center gap-2 text-slate-600"><Sun className="w-3.5 h-3.5 text-yellow-500" /> Weekends: Morning + Afternoon + Evening</div>
                  </div>
                </button>

                <button onClick={() => setMode("revision")}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 group ${mode === "revision" ? "border-primary bg-primary/5 shadow-md" : "border-slate-200 bg-white hover:border-primary/40"}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${mode === "revision" ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"}`}>
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">Revision / Holidays</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">Full-day study plan for school holidays, study leave, or intensive pre-exam revision periods with 5 sessions every day.</p>
                  <div className="space-y-1.5 text-xs font-medium">
                    <div className="flex items-center gap-2 text-slate-600"><Sun className="w-3.5 h-3.5 text-yellow-500" /> Every day: 2× morning + 2× afternoon + evening</div>
                    <div className="flex items-center gap-2 text-slate-600"><Clock className="w-3.5 h-3.5 text-indigo-500" /> Intensive revision pace all week</div>
                  </div>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-8">
                <h4 className="font-semibold text-slate-700 text-sm mb-3">
                  Subjects ({effectiveSubjects.length} sessions planned{hasCombinedScience ? " — Combined Science expanded" : ""})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {effectiveSubjects.map((s, i) => {
                    const color = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
                    return (
                      <span key={String(s.id)} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${color.light} ${color.text}`}>
                        <span className={`w-2 h-2 rounded-full ${color.bg}`} />
                        {s.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              <button onClick={() => setStep(3)}
                className="group w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, hsl(224,76%,28%) 0%, hsl(224,76%,40%) 100%)" }}>
                Generate My Timetable <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* ─── STEP 3 ─── */}
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
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={handleSaveClick}
                    className="group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, hsl(224,76%,28%) 0%, hsl(224,76%,40%) 100%)" }}>
                    <Save className="w-4 h-4" /> Save Plan
                  </button>
                  <button
                    onClick={() => premium ? window.print() : setShowPdfGate(true)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${premium ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100" : "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"}`}>
                    <Download className="w-4 h-4" /> Export PDF {!premium && <span className="text-[10px] font-bold bg-amber-400 text-white px-1.5 py-0.5 rounded-full ml-1">PRO</span>}
                  </button>
                  {savedPlans.length > 0 && (
                    <button onClick={() => setShowSavedPanel(v => !v)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                      <FolderOpen className="w-4 h-4" /> My Plans ({savedPlans.length})
                    </button>
                  )}
                  <button onClick={() => { setSelectedIds(new Set()); setStep(1); }}
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" /> Start over
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { value: `${weeklyHours}h`, label: "Hours/Week", color: "text-primary" },
                  { value: String(effectiveSubjects.length), label: "Subjects", color: "text-green-700" },
                  { value: String(totalSessions), label: "Sessions/Week", color: "text-violet-600" },
                  { value: `${perSubject}h`, label: "Per Subject/Wk", color: "text-orange-500" },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Break alert explainer */}
              <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-5 text-sm">
                <Bell className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-emerald-800">Break alerts are built in.</span>
                  <span className="text-emerald-700"> Click <strong>▶ Start</strong> on any session card to launch a countdown timer with automatic break reminders at the right intervals.</span>
                  <span className="text-emerald-600 text-xs block mt-0.5">The coloured dots on each card show the break structure — blue = study, green = break.</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-2 mb-6">
                {effectiveSubjects.map((s, i) => {
                  const color = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
                  const hrs = rnd(calcSubjectMins(grid, i));
                  return (
                    <div key={String(s.id)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${color.light} ${color.border}`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${color.bg} shrink-0`} />
                      <span className={`text-xs font-semibold ${color.text}`}>{s.name}</span>
                      <span className="text-xs text-slate-400 font-medium">{hrs}h/wk</span>
                    </div>
                  );
                })}
              </div>

              {/* Timetable grid */}
              <div className="overflow-x-auto pb-4">
                <div className="min-w-[700px]">
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {DAYS.map((day, di) => (
                      <div key={day} className={`text-center py-2 rounded-xl text-xs font-bold tracking-wide uppercase ${di >= 5 ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-600"}`}>
                        <span className="hidden sm:inline">{day}</span>
                        <span className="sm:hidden">{DAYS_SHORT[di]}</span>
                      </div>
                    ))}
                  </div>

                  {/* Slot rows */}
                  {(() => {
                    const maxSlots = Math.max(...grid.map(d => d.length));
                    return Array.from({ length: maxSlots }, (_, slotIdx) => (
                      <div key={slotIdx} className="grid grid-cols-7 gap-2 mb-2">
                        {grid.map((daySlots, dayIdx) => {
                          const cell = daySlots[slotIdx];
                          if (!cell) return <div key={dayIdx} />;
                          const color = cell.subjectIndex !== null ? SUBJECT_COLORS[cell.subjectIndex % SUBJECT_COLORS.length] : null;
                          const SlotIcon = cell.slot.icon;
                          const totalMins = calcMins(cell.slot.start, cell.slot.end);
                          const isActive = activeSession &&
                            activeSession.subjectName === cell.label &&
                            activeSession.slotLabel === cell.slot.label;

                          return (
                            <motion.div key={dayIdx}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: (dayIdx + slotIdx * 7) * 0.015 }}
                              className={`rounded-xl border group relative ${color ? `${color.light} ${color.border} border` : `${cell.slot.color} border-transparent`} ${isActive ? "ring-2 ring-primary/40" : ""}`}>
                              <div className="p-3">
                                <div className="flex items-center gap-1 mb-1.5">
                                  <SlotIcon className={`w-3 h-3 ${color ? color.text : "text-slate-400"} shrink-0`} />
                                  <span className="text-[10px] text-slate-400 font-medium truncate">{formatTime(cell.slot.start)}–{formatTime(cell.slot.end)}</span>
                                </div>
                                {color && cell.label
                                  ? <p className={`text-xs font-bold leading-tight ${color.text}`}>{cell.label}</p>
                                  : <p className="text-xs text-slate-400 italic">Free</p>}
                                <p className="text-[10px] text-slate-400 mt-0.5">{formatDuration(totalMins)}</p>

                                {/* Break structure dots */}
                                {color && <BreakStructurePill totalMins={totalMins} />}
                              </div>

                              {/* Start Session button — appears on hover */}
                              {color && cell.label && (
                                <motion.button
                                  onClick={() => startSession(cell, color)}
                                  className={`w-full flex items-center justify-center gap-1 py-1.5 rounded-b-xl text-[10px] font-bold transition-all ${
                                    isActive
                                      ? "bg-primary/20 text-primary"
                                      : "bg-black/5 text-slate-500 hover:bg-primary hover:text-white opacity-0 group-hover:opacity-100"
                                  }`}
                                >
                                  {isActive ? (
                                    <><Timer className="w-2.5 h-2.5" /> Running</>
                                  ) : (
                                    <><Play className="w-2.5 h-2.5 fill-current" /> Start</>
                                  )}
                                </motion.button>
                              )}
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
                    { icon: "⏱️", tip: "The timer uses Pomodoro-style breaks built into each session — follow them for peak focus." },
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
