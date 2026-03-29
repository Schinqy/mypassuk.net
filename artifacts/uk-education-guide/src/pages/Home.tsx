import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Briefcase, Building2, Map, ArrowRight, Sparkles,
  GraduationCap, Users, Globe2, Star, ChevronRight, Zap,
  CalendarDays, BrainCircuit, Clock, Award, Lightbulb,
  BadgeCheck, ChevronsRight,
} from "lucide-react";
import { useNation, NATIONS, type Nation } from "@/contexts/NationContext";
import { FlagSvg, EnglandFlagSvg, ScotlandFlagSvg, WalesFlagSvg, NIFlagSvg } from "@/components/FlagSvg";
import type { LucideIcon } from "lucide-react";

// ─── Nation Themes ────────────────────────────────────────────────────────────
const THEMES: Record<Nation, {
  bg: string; accentHex: string; pill: string;
  headline: string; subheadline: string; quals: string;
  ctaLabel: string; examBtn: string;
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

// ─── Flag Hero Backgrounds ────────────────────────────────────────────────────
function EnglandHeroBg() {
  return (
    <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect x="41" y="0" width="18" height="60" fill="white" fillOpacity="0.10" />
      <rect x="0" y="23" width="100" height="14" fill="white" fillOpacity="0.10" />
      <rect x="44" y="0" width="12" height="60" fill="#C8102E" fillOpacity="0.38" />
      <rect x="0" y="26" width="100" height="8" fill="#C8102E" fillOpacity="0.38" />
    </svg>
  );
}

function ScotlandHeroBg() {
  return (
    <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="0" x2="100" y2="60" stroke="white" strokeWidth="14" strokeOpacity="0.14" />
      <line x1="100" y1="0" x2="0" y2="60" stroke="white" strokeWidth="14" strokeOpacity="0.14" />
      <line x1="0" y1="0" x2="100" y2="60" stroke="white" strokeWidth="6" strokeOpacity="0.08" />
      <line x1="100" y1="0" x2="0" y2="60" stroke="white" strokeWidth="6" strokeOpacity="0.08" />
    </svg>
  );
}

function WalesHeroBg() {
  return (
    <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="100" height="30" fill="white" fillOpacity="0.06" />
      <rect x="0" y="30" width="100" height="30" fill="#00AB39" fillOpacity="0.35" />
      <rect x="0" y="27" width="100" height="6" fill="#C8102E" fillOpacity="0.45" />
    </svg>
  );
}

function NIHeroBg() {
  return (
    <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="0" x2="100" y2="60" stroke="white" strokeWidth="11" strokeOpacity="0.12" />
      <line x1="100" y1="0" x2="0" y2="60" stroke="white" strokeWidth="11" strokeOpacity="0.12" />
      <rect x="40" y="0" width="20" height="60" fill="white" fillOpacity="0.09" />
      <rect x="0" y="22" width="100" height="16" fill="white" fillOpacity="0.09" />
      <rect x="44" y="0" width="12" height="60" fill="#C8102E" fillOpacity="0.30" />
      <rect x="0" y="26" width="100" height="8" fill="#C8102E" fillOpacity="0.30" />
    </svg>
  );
}

const HERO_BG: Record<Nation, React.ReactNode> = {
  england: <EnglandHeroBg />,
  scotland: <ScotlandHeroBg />,
  wales: <WalesHeroBg />,
  "northern-ireland": <NIHeroBg />,
};

// ─── Nation Picker (no nation set) ───────────────────────────────────────────
function NationPickerHero({ onPick }: { onPick: (n: Nation) => void }) {
  const flagComponents = {
    england: EnglandFlagSvg,
    scotland: ScotlandFlagSvg,
    wales: WalesFlagSvg,
    "northern-ireland": NIFlagSvg,
  };

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-primary/20 to-slate-900" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.04]" />
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
          {NATIONS.map((n, i) => {
            const FlagComp = flagComponents[n.id];
            return (
              <motion.button
                key={n.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.09, duration: 0.5 }}
                onClick={() => onPick(n.id)}
                className="group relative flex flex-col items-center gap-5 p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 hover:scale-105 transition-all duration-300 cursor-pointer text-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-150 bg-white/20 rounded-full" />
                  <FlagComp className="relative w-20 h-14 rounded-lg shadow-lg shadow-black/30 object-cover" />
                </div>
                <div>
                  <p className="text-white font-bold text-xl leading-tight">{n.label}</p>
                  <p className="text-slate-300 text-xs mt-2 leading-snug">{n.qualifications}</p>
                </div>
                <div className="flex items-center gap-1 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Select <ArrowRight className="w-3 h-3" />
                </div>
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-white/5 to-transparent" />
              </motion.button>
            );
          })}
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
          className="mt-10 text-slate-500 text-sm">
          You can change this anytime from the navigation bar.
        </motion.p>
      </div>
    </section>
  );
}

// ─── Nation-specific Education System Content ─────────────────────────────────

interface PathwayStep {
  stage: string;
  age: string;
  quals: string;
  desc: string;
}

interface ExamBoard {
  name: string;
  role: string;
  subjects: string;
}

interface KeyFact {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface NationInfo {
  systemTitle: string;
  systemDesc: string;
  accentColor: string;
  examBoards: ExamBoard[];
  pathway: PathwayStep[];
  keyFacts: KeyFact[];
}

const NATION_INFO: Record<Nation, NationInfo> = {
  england: {
    systemTitle: "The English Education System",
    systemDesc: "England's national curriculum follows a structured path from GCSEs at Year 11 through A-Levels (or vocational alternatives) into higher education or apprenticeships.",
    accentColor: "#C8102E",
    examBoards: [
      { name: "AQA", role: "Most widely used", subjects: "Maths, English, Sciences, Humanities" },
      { name: "Edexcel (Pearson)", role: "A-Levels & vocational", subjects: "Popular across all subjects + BTECs" },
      { name: "OCR", role: "Cambridge-based", subjects: "Sciences, Computing, Latin" },
      { name: "WJEC / Eduqas", role: "Welsh board in England", subjects: "Media, Film, Music, English" },
    ],
    pathway: [
      { stage: "Key Stage 4", age: "14–16 (Year 10–11)", quals: "GCSEs (9–1)", desc: "Most students take 8–10 GCSEs. Core subjects include Maths, English Language, English Literature, and Sciences. Graded 9 (highest) to 1." },
      { stage: "Key Stage 5", age: "16–18 (Year 12–13)", quals: "A-Levels / BTECs / T-Levels", desc: "A-Levels: typically 3 subjects over 2 years. BTECs offer vocational equivalents. T-Levels are new 2-year technical qualifications with a 45-day industry placement." },
      { stage: "Higher Education", age: "18+", quals: "Degree / Higher Apprenticeship / HND", desc: "English universities charge up to £9,250/year for home students. 3-year honours degrees. Student loans repaid at 9% above £25,000 income threshold." },
    ],
    keyFacts: [
      { icon: Award, title: "UCAS Points", desc: "Universities use UCAS tariff points for entry. A* = 56, A = 48, B = 40, C = 32 per A-Level subject." },
      { icon: Building2, title: "Russell Group", desc: "24 research-intensive UK universities — including Oxford, Cambridge, Imperial, and UCL — often require AAA or above." },
      { icon: Briefcase, title: "T-Level Revolution", desc: "T-Levels launched 2020 and are equivalent to 3 A-Levels. Designed with employers — 20% of study is industry placement." },
      { icon: GraduationCap, title: "Apprenticeships", desc: "Degree Apprenticeships let you earn a full degree while working — no tuition fees and a salary from day one." },
    ],
  },
  scotland: {
    systemTitle: "Scotland's SQA Qualification System",
    systemDesc: "Scotland's Curriculum for Excellence (CfE) is entirely distinct from the rest of the UK. All school qualifications are awarded by the Scottish Qualifications Authority (SQA), and university is typically 4 years.",
    accentColor: "#0065BD",
    examBoards: [
      { name: "SQA", role: "The sole Scottish awarding body", subjects: "All National 5s, Highers, Advanced Highers, and Skills for Work qualifications" },
    ],
    pathway: [
      { stage: "S4 (Fourth Year)", age: "15–16", quals: "National 5s", desc: "Equivalent to GCSEs. Students typically take 5–8 National 5 subjects. Graded A–D (pass) or No Award. National 5 Maths and English are most important for university entry." },
      { stage: "S5 (Fifth Year)", age: "16–17", quals: "Highers", desc: "The primary university entry qualification in Scotland. Most students take 4–5 Highers in S5. Top Scottish universities typically require AAAAB or higher." },
      { stage: "S6 (Sixth Year)", age: "17–18", quals: "Advanced Highers", desc: "Optional deeper study — equivalent to first-year university content. Used for highly competitive university places and is looked upon favourably." },
      { stage: "Higher Education", age: "18+", quals: "4-Year Honours Degree / HNC / HND", desc: "Scottish-domiciled students studying in Scotland pay NO tuition fees — funded by the Student Awards Agency Scotland (SAAS). Degrees are 4 years." },
    ],
    keyFacts: [
      { icon: Award, title: "Free University Tuition", desc: "Scottish students studying at Scottish universities pay no tuition fees. SAAS covers up to £9,250/year of fees on your behalf." },
      { icon: Building2, title: "4-Year Honours Degrees", desc: "Scottish degrees are 4 years vs 3 in England — the first year is broader, giving time to choose your specialism." },
      { icon: Briefcase, title: "UCAS & SAAS", desc: "Apply through UCAS like the rest of the UK, but also register with SAAS separately for your fee and maintenance support." },
      { icon: GraduationCap, title: "Bursaries Available", desc: "Low-income households can receive SAAS bursaries of up to £2,000/year (non-repayable) on top of the student loan." },
    ],
  },
  wales: {
    systemTitle: "Wales's WJEC Education System",
    systemDesc: "Wales uses the WJEC/Eduqas exam board for most qualifications and has its own unique qualifications — including the Welsh Baccalaureate Skills Challenge Certificate — not found elsewhere in the UK.",
    accentColor: "#00AB39",
    examBoards: [
      { name: "WJEC / Eduqas", role: "The main Welsh awarding body", subjects: "GCSEs, A-Levels, and vocational qualifications — including Welsh-medium specs" },
      { name: "WJEC Cbac", role: "Welsh-language qualifications", subjects: "Welsh language, Welsh Literature, and bilingual subject specifications" },
    ],
    pathway: [
      { stage: "Key Stage 4", age: "14–16 (Year 10–11)", quals: "GCSEs (WJEC, graded 9–1)", desc: "Most students take around 9 GCSEs using WJEC specifications. GCSE Welsh is compulsory for most pupils in Wales — assessed differently from other GCSEs." },
      { stage: "Key Stage 5", age: "16–18 (Year 12–13)", quals: "A-Levels + Welsh Baccalaureate", desc: "Students take 3–4 A-Levels alongside the Welsh Baccalaureate Skills Challenge Certificate. The Welsh Bacc is worth up to 120 UCAS tariff points." },
      { stage: "Higher Education", age: "18+", quals: "Degree / Higher Apprenticeship / HND", desc: "Welsh students get a non-repayable tuition fee grant and means-tested maintenance loan. Welsh universities include Cardiff, Swansea, Aberystwyth, and Bangor." },
    ],
    keyFacts: [
      { icon: Award, title: "Welsh Baccalaureate", desc: "The Skills Challenge Certificate is studied alongside A-Levels. Worth up to 120 UCAS tariff points. All Welsh students in maintained schools study it." },
      { icon: Building2, title: "Tuition Fee Grant", desc: "Welsh students studying anywhere in the UK receive a partial fee grant (currently up to £1,500/year non-repayable) from Student Finance Wales." },
      { icon: Briefcase, title: "Bilingual Opportunities", desc: "Wales has a growing bilingual job market — Welsh language skills can be advantageous in public sector, education, and media careers." },
      { icon: GraduationCap, title: "WJEC vs AQA/OCR", desc: "Unlike England, most Welsh schools exclusively use WJEC/Eduqas specs. Check which board your school uses before selecting revision resources." },
    ],
  },
  "northern-ireland": {
    systemTitle: "Northern Ireland's CCEA Education System",
    systemDesc: "Northern Ireland's education system is distinct for its selective grammar school structure and its own exam board — CCEA. NI students also have unique cross-border access to Republic of Ireland universities.",
    accentColor: "#C8102E",
    examBoards: [
      { name: "CCEA", role: "The sole NI awarding body", subjects: "All GCSEs and A-Levels in Northern Ireland — separate specifications from AQA/OCR/Edexcel" },
      { name: "AQA / Edexcel", role: "Used for some A-Levels", subjects: "A small number of schools use English boards for subjects not offered by CCEA" },
    ],
    pathway: [
      { stage: "Key Stage 4", age: "14–16 (Year 11–12)", quals: "GCSEs (CCEA, graded A*–G)", desc: "CCEA GCSEs use the older A*–G grading — not the 9–1 system used in England and Wales. Students typically take 10+ GCSEs. Maths and English Language are essential." },
      { stage: "Key Stage 5 (AS)", age: "16–17 (Year 13)", quals: "AS Level (CCEA)", desc: "Unlike England, NI students take AS exams at the end of Year 13 which count towards the full A-Level grade. This is a key difference from English A-Levels." },
      { stage: "Key Stage 5 (A2)", age: "17–18 (Year 14)", quals: "A-Level (CCEA)", desc: "A2 exams complete the A-Level. CCEA A-Levels are graded A*–E. AS results contribute to the overall grade — so Year 13 exam performance matters." },
      { stage: "Higher Education", age: "18+", quals: "Degree / Apprenticeship (UCAS or CAO)", desc: "NI students studying in NI pay only £4,855/year — far less than England. Uniquely, NI students can also apply to Irish universities via the CAO system alongside UCAS." },
    ],
    keyFacts: [
      { icon: Award, title: "Selective Grammar Schools", desc: "NI has a selective secondary system — pupils sit the Transfer Test (AQE or GL Assessment) at age 10–11 to enter grammar schools." },
      { icon: Building2, title: "Lower NI Tuition Fees", desc: "NI-domiciled students studying in Northern Ireland pay only £4,855/year — significantly less than the £9,250 charged in England." },
      { icon: Briefcase, title: "CAO Cross-Border Access", desc: "Uniquely in the UK, NI students can apply to Republic of Ireland universities through the CAO alongside their UCAS application." },
      { icon: GraduationCap, title: "AS Levels Still Count", desc: "Unlike England (where AS was decoupled), NI CCEA AS results contribute to your final A-Level grade — Year 13 performance matters significantly." },
    ],
  },
};

// ─── Nation-specific Feature Card descriptions ────────────────────────────────

interface FeatureDef {
  title: string;
  desc: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
  light: string;
}

const NATION_FEATURES: Record<Nation, FeatureDef[]> = {
  england: [
    { title: "GCSE & A-Level Prep", desc: "Revision guides, key topics, and AI flashcards for AQA, Edexcel, and OCR specifications.", icon: BookOpen, href: "/subjects", gradient: "from-blue-500 to-blue-700", light: "bg-blue-500/10 text-blue-400" },
    { title: "Career Explorer", desc: "Discover salaries, required qualifications, and job outlooks — matched to English GCSE and A-Level routes.", icon: Briefcase, href: "/careers", gradient: "from-emerald-500 to-emerald-700", light: "bg-emerald-500/10 text-emerald-400" },
    { title: "287 Institutions", desc: "Filter UK universities by UCAS tariff points, Russell Group, subject, and region — including clearing options.", icon: Building2, href: "/institutions", gradient: "from-violet-500 to-violet-700", light: "bg-violet-500/10 text-violet-400" },
    { title: "A-Level vs T-Level", desc: "Compare A-Levels, BTECs, and T-Levels — understand UCAS tariff points and progression routes for each.", icon: Map, href: "/routes", gradient: "from-orange-500 to-orange-700", light: "bg-orange-500/10 text-orange-400" },
    { title: "Find a Tutor", desc: "Search tutor platforms by subject and level — GCSE and A-Level specialists compared in one place.", icon: Users, href: "/tutors", gradient: "from-rose-500 to-rose-700", light: "bg-rose-500/10 text-rose-400" },
    { title: "AI Study Assistant", desc: "Ask anything about your GCSEs and A-Levels — get AQA/Edexcel/OCR-specific guidance instantly.", icon: BrainCircuit, href: "/subjects", gradient: "from-sky-500 to-sky-700", light: "bg-sky-500/10 text-sky-400" },
    { title: "Open Days Calendar", desc: "Upcoming open days at English universities — filter by Russell Group, city, and course type.", icon: CalendarDays, href: "/open-days", gradient: "from-amber-500 to-amber-700", light: "bg-amber-500/10 text-amber-400" },
    { title: "Revision Timetable", desc: "Build a Pomodoro revision plan tailored to your GCSE or A-Level exam schedule.", icon: Clock, href: "/timetable", gradient: "from-teal-500 to-teal-700", light: "bg-teal-500/10 text-teal-400" },
  ],
  scotland: [
    { title: "SQA Exam Prep", desc: "Targeted revision for National 5, Higher, and Advanced Higher — aligned with SQA past papers and marking schemes.", icon: BookOpen, href: "/subjects", gradient: "from-blue-500 to-blue-700", light: "bg-blue-500/10 text-blue-400" },
    { title: "Career Explorer", desc: "Discover 69 career profiles with Scottish qualification entry routes, UCAS points, and graduate salary data.", icon: Briefcase, href: "/careers", gradient: "from-emerald-500 to-emerald-700", light: "bg-emerald-500/10 text-emerald-400" },
    { title: "Scottish Universities", desc: "Explore Scotland's 19 universities — compare entry requirements, 4-year honours degrees, and SAAS funding.", icon: Building2, href: "/institutions", gradient: "from-violet-500 to-violet-700", light: "bg-violet-500/10 text-violet-400" },
    { title: "Highers vs Adv. Highers", desc: "Understand the full CfE pathway — from National 5s through Highers, Advanced Highers, and HNC/HND routes.", icon: Map, href: "/routes", gradient: "from-orange-500 to-orange-700", light: "bg-orange-500/10 text-orange-400" },
    { title: "Find a Tutor", desc: "Search for SQA-specialist tutors in Scotland for National 5, Higher, and Advanced Higher subjects.", icon: Users, href: "/tutors", gradient: "from-rose-500 to-rose-700", light: "bg-rose-500/10 text-rose-400" },
    { title: "AI Study Assistant", desc: "Ask anything about SQA exams — get Higher-specific essay guidance, marking scheme tips, and revision strategies.", icon: BrainCircuit, href: "/subjects", gradient: "from-sky-500 to-sky-700", light: "bg-sky-500/10 text-sky-400" },
    { title: "Open Days Calendar", desc: "Open days at Scottish universities and colleges — including SAAS-eligible institutions and campus tours.", icon: CalendarDays, href: "/open-days", gradient: "from-amber-500 to-amber-700", light: "bg-amber-500/10 text-amber-400" },
    { title: "Revision Timetable", desc: "Build a Pomodoro study plan around your SQA exam diet — National 5s, Highers, and Advanced Highers.", icon: Clock, href: "/timetable", gradient: "from-teal-500 to-teal-700", light: "bg-teal-500/10 text-teal-400" },
  ],
  wales: [
    { title: "GCSE & Welsh Bacc Prep", desc: "Revision for WJEC/Eduqas specifications, plus Skills Challenge Certificate guidance — including Welsh-medium resources.", icon: BookOpen, href: "/subjects", gradient: "from-blue-500 to-blue-700", light: "bg-blue-500/10 text-blue-400" },
    { title: "Career Explorer", desc: "Discover 69 career profiles with Welsh qualification routes, bilingual career opportunities, and salary data.", icon: Briefcase, href: "/careers", gradient: "from-emerald-500 to-emerald-700", light: "bg-emerald-500/10 text-emerald-400" },
    { title: "Welsh Universities", desc: "Compare Cardiff, Swansea, Aberystwyth, Bangor and 280+ UK institutions — with Welsh tuition fee grant info.", icon: Building2, href: "/institutions", gradient: "from-violet-500 to-violet-700", light: "bg-violet-500/10 text-violet-400" },
    { title: "A-Level + Welsh Bacc", desc: "See how A-Levels combine with the Skills Challenge Certificate and how UCAS tariff points are calculated.", icon: Map, href: "/routes", gradient: "from-orange-500 to-orange-700", light: "bg-orange-500/10 text-orange-400" },
    { title: "Find a Tutor", desc: "Search for WJEC-specialist tutors in Wales — Welsh-medium and English-medium options available.", icon: Users, href: "/tutors", gradient: "from-rose-500 to-rose-700", light: "bg-rose-500/10 text-rose-400" },
    { title: "AI Study Assistant", desc: "Ask anything about WJEC/Eduqas specifications — get exam technique tips and Welsh Bacc guidance.", icon: BrainCircuit, href: "/subjects", gradient: "from-sky-500 to-sky-700", light: "bg-sky-500/10 text-sky-400" },
    { title: "Open Days Calendar", desc: "Open days at Welsh universities and colleges — including Welsh-medium and bilingual campus events.", icon: CalendarDays, href: "/open-days", gradient: "from-amber-500 to-amber-700", light: "bg-amber-500/10 text-amber-400" },
    { title: "Revision Timetable", desc: "Build a Pomodoro revision plan around your WJEC GCSE or A-Level examination timetable.", icon: Clock, href: "/timetable", gradient: "from-teal-500 to-teal-700", light: "bg-teal-500/10 text-teal-400" },
  ],
  "northern-ireland": [
    { title: "CCEA GCSE & A-Level Prep", desc: "Revision for CCEA specifications — including NI-specific content, AS-level structure, and past paper guidance.", icon: BookOpen, href: "/subjects", gradient: "from-blue-500 to-blue-700", light: "bg-blue-500/10 text-blue-400" },
    { title: "Career Explorer", desc: "Discover 69 career profiles with NI qualification routes, cross-border Irish opportunities, and salary benchmarks.", icon: Briefcase, href: "/careers", gradient: "from-emerald-500 to-emerald-700", light: "bg-emerald-500/10 text-emerald-400" },
    { title: "NI Universities & Colleges", desc: "Explore Queen's Belfast, Ulster, and 280+ UK and Irish institutions — compare fees and UCAS entry requirements.", icon: Building2, href: "/institutions", gradient: "from-violet-500 to-violet-700", light: "bg-violet-500/10 text-violet-400" },
    { title: "UCAS & CAO Routes", desc: "Unique to NI: understand both UK UCAS and Irish CAO applications — compare fees, entry requirements, and courses.", icon: Map, href: "/routes", gradient: "from-orange-500 to-orange-700", light: "bg-orange-500/10 text-orange-400" },
    { title: "Find a Tutor", desc: "Search for CCEA-specialist tutors in NI — Grammar school Transfer Test prep and A-Level support.", icon: Users, href: "/tutors", gradient: "from-rose-500 to-rose-700", light: "bg-rose-500/10 text-rose-400" },
    { title: "AI Study Assistant", desc: "Ask anything about CCEA exams — AS/A-Level strategies, specification guidance, and grade boundary insight.", icon: BrainCircuit, href: "/subjects", gradient: "from-sky-500 to-sky-700", light: "bg-sky-500/10 text-sky-400" },
    { title: "Open Days Calendar", desc: "Open days at Queen's, Ulster, and UK & Irish universities — including cross-border Republic of Ireland events.", icon: CalendarDays, href: "/open-days", gradient: "from-amber-500 to-amber-700", light: "bg-amber-500/10 text-amber-400" },
    { title: "Revision Timetable", desc: "Build a Pomodoro study plan around your CCEA GCSE and A-Level examination series.", icon: Clock, href: "/timetable", gradient: "from-teal-500 to-teal-700", light: "bg-teal-500/10 text-teal-400" },
  ],
};

// ─── Global stats strip ───────────────────────────────────────────────────────
const STATS = [
  { value: "80+", label: "Subjects", icon: BookOpen },
  { value: "287", label: "Institutions", icon: Building2 },
  { value: "69", label: "Career Profiles", icon: Briefcase },
  { value: "4", label: "UK Nations", icon: Globe2 },
];

// ─── Education System Section ─────────────────────────────────────────────────
function EducationSystemSection({ nation }: { nation: Nation }) {
  const info = NATION_INFO[nation];

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={`edu-${nation}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.4 }}
        className="py-20 border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
              <GraduationCap className="w-4 h-4" />
              {info.systemTitle}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Your qualification pathway
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {info.systemDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left: Qualification Pathway */}
            <div className="lg:col-span-2">
              <h3 className="text-base font-bold text-foreground mb-6 flex items-center gap-2">
                <ChevronsRight className="w-4 h-4 text-primary" /> Qualification Pathway
              </h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-6 bottom-6 w-px bg-border" />

                <div className="space-y-0">
                  {info.pathway.map((step, idx) => (
                    <motion.div
                      key={step.stage}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative flex gap-5 pb-8 last:pb-0"
                    >
                      {/* Node */}
                      <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 border-primary bg-background shadow-sm">
                        <span className="text-xs font-bold text-primary">{idx + 1}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all duration-200">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">{step.stage}</span>
                            <h4 className="text-base font-bold text-foreground mt-0.5">{step.quals}</h4>
                          </div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-muted-foreground border border-border whitespace-nowrap">
                            <Clock className="w-3 h-3" /> {step.age}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Exam Boards + Key Facts */}
            <div className="flex flex-col gap-6">

              {/* Exam Boards */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-primary" /> Exam Board{info.examBoards.length > 1 ? "s" : ""}
                </h3>
                <div className="space-y-3">
                  {info.examBoards.map(board => (
                    <div key={board.name} className="p-3 rounded-xl bg-secondary/50 border border-border">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-sm text-foreground">{board.name}</span>
                        <span className="text-xs text-muted-foreground bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                          {board.role}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{board.subjects}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Facts */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" /> Key Facts
                </h3>
                <div className="space-y-4">
                  {info.keyFacts.map((fact) => (
                    <div key={fact.title} className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <fact.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground leading-snug">{fact.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{fact.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const { nation, setNation, openSelector } = useNation();

  if (!nation) return <NationPickerHero onPick={setNation} />;

  const theme = THEMES[nation];
  const heroBg = HERO_BG[nation];
  const nationInfo = NATIONS.find(n => n.id === nation)!;
  const features = NATION_FEATURES[nation];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg}`} />

        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${nation}`}
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
          >
            {heroBg}
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-[140px] opacity-20 pointer-events-none"
          style={{ background: theme.accentHex }} />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.035] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <AnimatePresence mode="wait">
              <motion.div key={`text-${nation}`}
                initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 28 }} transition={{ duration: 0.45 }}>

                <button onClick={openSelector}
                  className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-sm font-bold mb-8 hover:opacity-80 transition-opacity ${theme.pill}`}>
                  <FlagSvg nation={nation} className="w-8 h-5 rounded shadow-sm" />
                  {nationInfo.label}
                  <span className="text-xs opacity-80 font-normal">· change</span>
                </button>

                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.08] mb-5 tracking-tight">
                  {theme.headline}
                </h1>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold mb-6 tracking-wide">
                  <Star className="w-3 h-3" style={{ color: theme.accentHex }} />
                  {theme.quals}
                </div>

                <p className="text-lg text-slate-100 leading-relaxed mb-10 max-w-xl">
                  {theme.subheadline}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href="/quiz"
                    className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white overflow-hidden transition-all duration-200 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 text-base"
                    style={{ background: `linear-gradient(135deg, ${theme.accentHex}ee, ${theme.accentHex}bb)` }}>
                    <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                    {theme.ctaLabel} <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link href="/subjects"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-200 text-base">
                    {theme.examBtn}
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </Link>
                </div>

                <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3">
                  {STATS.map(s => (
                    <span key={s.label} className="flex items-center gap-1.5 text-sm text-slate-200 font-medium">
                      <s.icon className="w-4 h-4 text-slate-300" />
                      <strong className="text-white font-bold">{s.value}</strong>
                      <span>{s.label}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="relative hidden lg:flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div key={`flag-${nation}`}
                  initial={{ opacity: 0, scale: 0.82, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.82, rotate: 5 }}
                  transition={{ duration: 0.5 }}
                  className="relative flex flex-col items-center gap-8">

                  <div className="absolute inset-0 rounded-full blur-[90px] opacity-30 scale-125 pointer-events-none"
                    style={{ background: theme.accentHex }} />

                  {[1.35, 1.7, 2.05].map((scale, idx) => (
                    <div key={idx} className="absolute border border-white/5 rounded-full"
                      style={{ inset: 0, transform: `scale(${scale})` }} />
                  ))}

                  <div className="relative z-10">
                    <div className="w-72 h-48 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border-2 border-white/20 ring-4 ring-white/5">
                      <FlagSvg nation={nation} className="w-full h-full" />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full bg-black/60 backdrop-blur border border-white/25 text-white text-xs font-semibold">
                      {nationInfo.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-6 relative z-10">
                    {[
                      { label: "Institutions", value: "287+", icon: Building2 },
                      { label: "Career paths", value: "69", icon: Briefcase },
                      { label: "Subjects", value: "80+", icon: BookOpen },
                      { label: "Study routes", value: "6+", icon: Map },
                    ].map(card => (
                      <div key={card.label} className="flex items-center gap-3 bg-white/8 border border-white/15 rounded-2xl px-4 py-3 backdrop-blur-sm">
                        <card.icon className="w-4 h-4 text-slate-200 shrink-0" />
                        <div>
                          <p className="text-white font-bold text-sm leading-none">{card.value}</p>
                          <p className="text-slate-300 text-xs mt-0.5">{card.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ── Nation Switcher Strip ──────────────────────────────────────── */}
      <section className="border-t border-b border-border bg-secondary/30 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap shrink-0">
              Viewing as:
            </span>
            {NATIONS.map(n => (
              <button key={n.id} onClick={() => setNation(n.id)}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  nation === n.id
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-primary/40 hover:text-primary"
                }`}>
                <FlagSvg nation={n.id} className="w-6 h-4 rounded-sm shadow-sm" />
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Education System Section ───────────────────────────────────── */}
      <EducationSystemSection nation={nation} />

      {/* ── Feature Cards ─────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
              <Zap className="w-4 h-4" />
              Everything in one place
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Your complete toolkit for {nationInfo.label}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Data-driven guidance from exam prep to career planning — all tailored to {nationInfo.label}'s curriculum and qualification system.
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`features-${nation}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {features.map((f, idx) => (
                <motion.div key={f.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: idx * 0.055 }}>
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
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Quiz CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-secondary/30 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2.5rem] p-10 md:p-16 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12"
            style={{ background: "linear-gradient(135deg, hsl(224,76%,12%) 0%, hsl(224,76%,22%) 100%)" }}>
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/25 blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none opacity-20">{heroBg}</div>

            <div className="relative z-10 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-xs font-semibold mb-6 border border-white/15">
                <GraduationCap className="w-4 h-4" />
                2-minute personalised quiz
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">Not sure where to start?</h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Enter your {nation === "scotland" ? "National 5 / Higher" : nation === "northern-ireland" ? "CCEA GCSE / A-Level" : nation === "wales" ? "WJEC GCSE / A-Level" : "GCSE / A-Level"} subjects and predicted grades — get AI-matched career and study route recommendations in seconds.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/quiz"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-accent text-white hover:bg-red-700 hover:-translate-y-0.5 shadow-lg shadow-accent/30 transition-all duration-200">
                  Start the Quiz <Sparkles className="w-5 h-5" />
                </Link>
                <Link href="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-200">
                  See Premium <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative z-10 hidden md:flex flex-col items-center gap-3">
              <div className="w-36 h-24 rounded-xl overflow-hidden shadow-2xl border-2 border-white/25">
                <FlagSvg nation={nation} className="w-full h-full" />
              </div>
              <p className="text-white/75 text-sm font-medium">{nationInfo.label} Edition</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
