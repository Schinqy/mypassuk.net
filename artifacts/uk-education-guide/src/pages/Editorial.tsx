import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Users,
  Award,
  Briefcase,
  Building2,
  ChevronRight,
  Info,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useNation } from "@/contexts/NationContext";

const NATION_PANELS: Record<string, {
  flag: string;
  title: string;
  color: string;
  borderColor: string;
  textColor: string;
  titleColor: string;
  body: string;
  facts: { label: string; value: string }[];
}> = {
  scotland: {
    flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    title: "You're viewing as: Scotland — Curriculum for Excellence",
    color: "bg-teal-50",
    borderColor: "border-teal-200",
    textColor: "text-teal-700",
    titleColor: "text-teal-900",
    body: "Scotland's education system is governed by the Scottish Government and uses the Curriculum for Excellence (CfE) framework — separate from England's National Curriculum. Exams are set by the Scottish Qualifications Authority (SQA). The progression is: National 5 (age 15–16) → Higher (age 16–17) → Advanced Higher (age 17–18), leading to university (typically 4 years). Scottish universities charge no tuition fees for Scottish-domiciled students (SAAS).",
    facts: [
      { label: "Curriculum", value: "Curriculum for Excellence (CfE)" },
      { label: "Exam Body", value: "Scottish Qualifications Authority (SQA)" },
      { label: "Qualifications", value: "National 5 → Higher → Advanced Higher" },
      { label: "University Length", value: "4 years (typically)" },
      { label: "Tuition Fees", value: "Free for Scottish students (SAAS)" },
      { label: "Inspectorate", value: "Education Scotland" },
    ],
  },
  wales: {
    flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    title: "You're viewing as: Wales — Curriculum for Wales",
    color: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    titleColor: "text-green-900",
    body: "Wales introduced a new Curriculum for Wales in 2022, replacing the previous National Curriculum. It is based on 6 Areas of Learning and Experience (AoLE) with a strong emphasis on four purposes of education. Qualifications are overseen by Qualifications Wales; WJEC/Eduqas is the main exam board. Students sit GCSEs and A-Levels, plus the Welsh Baccalaureate (Cymru Bacc). Welsh-medium education is available across the country.",
    facts: [
      { label: "Curriculum", value: "Curriculum for Wales (2022)" },
      { label: "Exam Body", value: "Qualifications Wales / WJEC / Eduqas" },
      { label: "Qualifications", value: "GCSE, A-Level, Welsh Baccalaureate" },
      { label: "Tuition Fees", value: "Up to £9,535/yr (Student Finance Wales)" },
      { label: "Inspectorate", value: "Estyn" },
      { label: "Welsh Medium", value: "Welsh-medium schools available nationally" },
    ],
  },
  "northern-ireland": {
    flag: "🇬🇧",
    title: "You're viewing as: Northern Ireland — Northern Ireland Curriculum",
    color: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    titleColor: "text-blue-900",
    body: "Northern Ireland operates its own curriculum under the Council for the Curriculum, Examinations and Assessment (CCEA). The grammar school system remains active — children can sit the Transfer Test (GL/AQE) at age 10–11 to access selective grammar schools. GCSEs and A-Levels are mainly through CCEA (with some AQA/Edexcel). NI students at NI universities pay a reduced tuition fee of ~£4,760/year.",
    facts: [
      { label: "Curriculum", value: "Northern Ireland Curriculum (CCEA)" },
      { label: "Exam Body", value: "CCEA (+ AQA, Edexcel for some subjects)" },
      { label: "Qualifications", value: "GCSE, A-Level (CCEA)" },
      { label: "Grammar Schools", value: "Selective via Transfer Test (GL / AQE)" },
      { label: "Tuition Fees (NI Uni)", value: "~£4,760/year for NI students" },
      { label: "Inspectorate", value: "Education and Training Inspectorate (ETI)" },
    ],
  },
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

interface KeyStageCardProps {
  stage: string;
  ages: string;
  years: string;
  color: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function KeyStageCard({ stage, ages, years, color, icon, children }: KeyStageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative bg-card border rounded-2xl overflow-hidden"
    >
      <div className={`h-2 w-full ${color}`} />
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-4 mb-5">
          <div className={`p-3 rounded-xl ${color} bg-opacity-10 shrink-0`}>{icon}</div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{stage}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {ages} &bull; {years}
            </p>
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

function ExamBoardCard({
  name,
  fullName,
  description,
  subjects,
  website,
}: {
  name: string;
  fullName: string;
  description: string;
  subjects: string[];
  website: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-card border rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="font-bold text-primary text-sm">{name}</span>
        </div>
        <div>
          <h4 className="font-bold text-foreground">{fullName}</h4>
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            {website.replace("https://", "")}
          </a>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div>
        <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Key Subject Areas</p>
        <div className="flex flex-wrap gap-1.5">
          {subjects.map((s) => (
            <span key={s} className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SectionHeading({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">{icon}</div>
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function Editorial() {
  const { nation, openSelector } = useNation();
  const nationPanel = nation ? NATION_PANELS[nation] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <motion.div {...fadeIn} className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <BookOpen className="w-4 h-4" />
          Editorial Overview
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-5">
          The UK Education System:{" "}
          <span className="text-primary">A Complete Guide</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          From the first day of primary school to university graduation and professional qualification,
          the United Kingdom has one of the world's most structured and internationally respected
          education systems. This guide walks you through every stage — who oversees it, how it is
          assessed, and what it means for your future.
        </p>

        {/* Nation-specific system panel — replaces the generic devolution note */}
        {nationPanel ? (
          <div className={`mt-8 rounded-2xl border ${nationPanel.color} ${nationPanel.borderColor} p-5`}>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-2xl">{nationPanel.flag}</span>
              <p className={`font-bold text-sm ${nationPanel.titleColor}`}>{nationPanel.title}</p>
            </div>
            <p className={`text-sm leading-relaxed mb-4 ${nationPanel.textColor}`}>{nationPanel.body}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {nationPanel.facts.map(f => (
                <div key={f.label} className="bg-white/60 rounded-xl p-3">
                  <p className={`text-[10px] font-bold uppercase tracking-wide mb-0.5 ${nationPanel.textColor} opacity-70`}>{f.label}</p>
                  <p className={`text-xs font-semibold ${nationPanel.titleColor}`}>{f.value}</p>
                </div>
              ))}
            </div>
            <p className={`text-xs mt-3 ${nationPanel.textColor} opacity-70`}>
              The sections below cover the England system in detail.{" "}
              <button onClick={openSelector} className="underline font-semibold hover:opacity-100">
                Change nation
              </button>
            </p>
          </div>
        ) : (
          <div className="mt-8 p-4 rounded-xl border bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-700/30 flex gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Note on devolution:</strong> Education is a devolved matter in the UK. This guide
              primarily covers the system in <strong>England</strong>. Scotland (SQA),
              Wales (Qualifications Wales / WJEC) and Northern Ireland (CCEA) each have their own frameworks.{" "}
              <button onClick={openSelector} className="underline font-semibold">Set your nation</button> for tailored content.
            </p>
          </div>
        )}
      </motion.div>

      {/* ── THE NATIONAL CURRICULUM ───────────────────────────────────────── */}
      <section className="mb-16">
        <SectionHeading
          icon={<BookOpen className="w-6 h-6" />}
          title="The National Curriculum"
          subtitle="England's statutory framework for what children learn in state-funded schools"
        />
        <div className="prose prose-slate max-w-none text-muted-foreground space-y-4">
          <p>
            The <strong className="text-foreground">National Curriculum</strong> sets out the programmes
            of study and attainment targets for all subjects taught in state-funded schools in England.
            It is organised into four <strong className="text-foreground">Key Stages</strong> aligned
            with a child's age and school year. Independent (private) schools are not legally required
            to follow it, though many do.
          </p>
          <p>
            The curriculum is overseen by the <strong className="text-foreground">Department for Education
            (DfE)</strong> and implemented through Ofsted inspections. Academies and free schools have
            greater curriculum freedom but must still teach a broad and balanced curriculum and ensure
            all pupils have access to Religious Education.
          </p>
        </div>
      </section>

      {/* ── KEY STAGES ───────────────────────────────────────────────────── */}
      <section className="mb-16">
        <SectionHeading
          icon={<Users className="w-6 h-6" />}
          title="The Key Stages"
          subtitle="Compulsory education from age 5 to 16 — and beyond"
        />
        <div className="grid gap-6">

          {/* KS1 */}
          <KeyStageCard
            stage="Key Stage 1"
            ages="Ages 5–7"
            years="Years 1–2"
            color="bg-emerald-500"
            icon={<span className="text-emerald-600 font-bold text-sm">KS1</span>}
          >
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Children in Key Stage 1 follow the <strong className="text-foreground">Early Years
                Foundation Stage (EYFS)</strong> principles transitioning into the full National Curriculum.
                The focus is on establishing literacy and numeracy through a rich, play-informed curriculum.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">Core Subjects</p>
                  <ul className="space-y-1">
                    {["English (including Phonics)", "Mathematics", "Science"].map(s => (
                      <li key={s} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">Foundation Subjects</p>
                  <ul className="space-y-1">
                    {["Art & Design", "Computing", "Design & Technology", "Geography", "History", "Music", "PE", "RE (locally agreed)"].map(s => (
                      <li key={s} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-slate-300 shrink-0" />{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                <p className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">Assessments</p>
                <p className="text-emerald-700 dark:text-emerald-400">
                  <strong>Year 1 Phonics Screening Check</strong> — a short 40-word check assessing decoding ability.
                  <strong> KS1 SATs</strong> (Year 2) in Reading and Maths were made optional from 2023; teacher assessment remains statutory.
                </p>
              </div>
            </div>
          </KeyStageCard>

          {/* KS2 */}
          <KeyStageCard
            stage="Key Stage 2"
            ages="Ages 7–11"
            years="Years 3–6"
            color="bg-blue-500"
            icon={<span className="text-blue-600 font-bold text-sm">KS2</span>}
          >
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Key Stage 2 builds on KS1 skills with increasing subject depth. Children learn all core
                and foundation subjects, and many schools begin teaching a modern foreign language from
                Year 3 (statutory from Year 3). The stage culminates in national tests at the end of
                Year 6.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">Core Subjects</p>
                  <ul className="space-y-1">
                    {["English", "Mathematics", "Science"].map(s => (
                      <li key={s} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">Added in KS2</p>
                  <ul className="space-y-1">
                    {["Modern Foreign Language (statutory)", "Latin (some schools)", "PSHE", "Relationships Education (statutory)"].map(s => (
                      <li key={s} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-slate-300 shrink-0" />{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">KS2 SATs (Year 6)</p>
                <p className="text-blue-700 dark:text-blue-400">
                  National tests in <strong>Reading</strong>, <strong>GPS (Grammar, Punctuation and Spelling)</strong>,
                  and <strong>Mathematics</strong> (two papers: arithmetic and reasoning). Results are used for school
                  performance data, secondary school transition, and setting. Science is assessed through teacher
                  assessment rather than a formal test.
                </p>
              </div>
            </div>
          </KeyStageCard>

          {/* KS3 */}
          <KeyStageCard
            stage="Key Stage 3"
            ages="Ages 11–14"
            years="Years 7–9"
            color="bg-violet-500"
            icon={<span className="text-violet-600 font-bold text-sm">KS3</span>}
          >
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                At secondary school, students experience a broad curriculum across up to 15 subjects before
                narrowing their focus at GCSE. KS3 is the last stage at which all subjects are compulsory.
                Many students and teachers regard this as a crucial foundation stage — strong KS3 skills
                in reading, writing, and mathematical reasoning are strongly linked to GCSE success.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 mt-4">
                {[
                  { label: "Compulsory Core", items: ["English", "Maths", "Science", "Physical Education", "RE", "PSHE", "RSE"] },
                  { label: "Typically Taught", items: ["History", "Geography", "Languages (MFL)", "Computing", "Drama", "Music", "Art & Design"] },
                  { label: "Often Offered", items: ["DT / Food Tech", "Citizenship", "Business Studies", "Classical Civilisation", "Latin", "Dance"] },
                ].map(col => (
                  <div key={col.label}>
                    <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">{col.label}</p>
                    <ul className="space-y-1">
                      {col.items.map(s => <li key={s} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />{s}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/30">
                <p className="font-semibold text-violet-800 dark:text-violet-300 mb-1">Choosing GCSE Options (Year 9)</p>
                <p className="text-violet-700 dark:text-violet-400">
                  At the end of Year 9, students choose their GCSE <strong>option subjects</strong> to study in Years
                  10 and 11. English Language, English Literature, Mathematics, and Science are compulsory. Students
                  typically choose 3–4 additional subjects. The <strong>EBacc</strong> (English, Maths, Sciences,
                  History or Geography, and a language) is a government-encouraged combination.
                </p>
              </div>
            </div>
          </KeyStageCard>

          {/* KS4 */}
          <KeyStageCard
            stage="Key Stage 4 — GCSEs"
            ages="Ages 14–16"
            years="Years 10–11"
            color="bg-orange-500"
            icon={<span className="text-orange-600 font-bold text-sm">KS4</span>}
          >
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">General Certificate of Secondary Education (GCSE)</strong> qualifications
                are the primary academic qualification taken at the end of compulsory schooling. Students
                typically take 8–10 GCSEs across core and option subjects, assessed through a mix of final
                exams, controlled assessments, coursework, and practical examinations (depending on the subject).
              </p>
              <div className="mt-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-700/30">
                <p className="font-semibold text-orange-800 dark:text-orange-300 mb-3">The New GCSE Grading Scale (since 2017)</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { grade: "9", label: "Highest", color: "bg-emerald-600 text-white" },
                    { grade: "8", label: "A*", color: "bg-emerald-500 text-white" },
                    { grade: "7", label: "A", color: "bg-blue-500 text-white" },
                    { grade: "6", label: "B", color: "bg-blue-400 text-white" },
                    { grade: "5", label: "Strong pass", color: "bg-violet-500 text-white" },
                    { grade: "4", label: "Standard pass", color: "bg-yellow-500 text-white" },
                    { grade: "3", label: "D", color: "bg-orange-400 text-white" },
                    { grade: "2", label: "E", color: "bg-red-400 text-white" },
                    { grade: "1", label: "F/G", color: "bg-red-500 text-white" },
                    { grade: "U", label: "Ungraded", color: "bg-slate-400 text-white" },
                  ].map(g => (
                    <div key={g.grade} className={`px-3 py-1.5 rounded-lg flex items-center gap-2 ${g.color}`}>
                      <span className="font-bold text-base">{g.grade}</span>
                      <span className="text-xs opacity-90">{g.label}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-orange-700 dark:text-orange-400 text-xs">
                  A <strong>grade 4</strong> is the standard pass (equivalent to old grade C). A <strong>grade 5</strong>
                  is a "strong pass" and required by many sixth forms and employers. English and Maths at grade 4+
                  must be re-sat if not achieved before age 18.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">Compulsory GCSEs</p>
                  <ul className="space-y-1">
                    {["English Language", "English Literature", "Mathematics", "Combined or Triple Science"].map(s => (
                      <li key={s} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">The EBacc</p>
                  <p className="text-xs">Government-promoted combination of subjects: English Language + Literature, Maths, 2 Sciences, History or Geography, and a Modern Foreign Language. Strengthens university applications.</p>
                </div>
              </div>
            </div>
          </KeyStageCard>

          {/* KS5 */}
          <KeyStageCard
            stage="Key Stage 5 — Post-16"
            ages="Ages 16–18"
            years="Years 12–13 (Sixth Form)"
            color="bg-rose-500"
            icon={<span className="text-rose-600 font-bold text-sm">KS5</span>}
          >
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Participation in education or training is <strong className="text-foreground">compulsory to age 18</strong>
                {" "}in England (introduced in 2015). Post-16 learners have more choices than ever before:
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                {[
                  {
                    title: "A-Levels",
                    desc: "Traditional academic route. 3 subjects studied deeply over 2 years. Graded A*–E. Primary route into most university courses.",
                    color: "border-rose-200 dark:border-rose-800/40",
                    bg: "bg-rose-50 dark:bg-rose-900/10",
                  },
                  {
                    title: "T-Levels",
                    desc: "New (from 2020) technical qualifications equivalent to 3 A-Levels. Includes a 45-day industry placement. Currently ~20 subjects available.",
                    color: "border-blue-200 dark:border-blue-800/40",
                    bg: "bg-blue-50 dark:bg-blue-900/10",
                  },
                  {
                    title: "BTECs / Applied Generals",
                    desc: "Coursework-based vocational qualifications at Level 3. Widely accepted by universities. Range from Award to Extended Diploma (= 3 A-Levels).",
                    color: "border-violet-200 dark:border-violet-800/40",
                    bg: "bg-violet-50 dark:bg-violet-900/10",
                  },
                  {
                    title: "International Baccalaureate",
                    desc: "6-subject international qualification + ToK, Extended Essay, CAS. Highly regarded globally. Available at ~200 UK schools.",
                    color: "border-emerald-200 dark:border-emerald-800/40",
                    bg: "bg-emerald-50 dark:bg-emerald-900/10",
                  },
                  {
                    title: "Apprenticeships (Level 3)",
                    desc: "Earn a salary while training. Equivalent to A-Levels. Combines on-the-job learning with off-the-job education (typically 1 day/week at college).",
                    color: "border-orange-200 dark:border-orange-800/40",
                    bg: "bg-orange-50 dark:bg-orange-900/10",
                  },
                  {
                    title: "Access to HE Diploma",
                    desc: "For adults returning to education. One-year intensive course providing equivalent entry to university for those without traditional A-Levels.",
                    color: "border-slate-200 dark:border-slate-700/40",
                    bg: "bg-slate-50 dark:bg-slate-800/30",
                  },
                ].map(r => (
                  <div key={r.title} className={`p-4 rounded-xl border ${r.color} ${r.bg}`}>
                    <p className="font-semibold text-foreground mb-1">{r.title}</p>
                    <p className="text-xs leading-relaxed">{r.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-700/30">
                <p className="font-semibold text-rose-800 dark:text-rose-300 mb-1">UCAS Points &amp; University Entry</p>
                <p className="text-rose-700 dark:text-rose-400">
                  A-Level grades convert to <strong>UCAS Tariff Points</strong>: A* = 56, A = 48, B = 40, C = 32,
                  D = 24, E = 16. T-Levels at Distinction* = 168 points (equivalent to A*AA). Most universities
                  quote entry in A-Level grades, but all Level 3 qualifications can contribute UCAS points.
                </p>
              </div>
            </div>
          </KeyStageCard>

        </div>
      </section>

      {/* ── EXAM BOARDS ──────────────────────────────────────────────────── */}
      <section className="mb-16">
        <SectionHeading
          icon={<Award className="w-6 h-6" />}
          title="The Major Exam Boards"
          subtitle="Who sets, marks, and awards GCSEs and A-Levels in the UK"
        />
        <div className="prose prose-slate max-w-none text-muted-foreground mb-8">
          <p>
            Exam boards (also called <em>awarding organisations</em>) design qualifications, set papers,
            mark scripts, and issue certificates. They are regulated in England by
            <strong className="text-foreground"> Ofqual</strong> (Office of Qualifications and Examinations
            Regulation), in Wales by <strong className="text-foreground">Qualifications Wales</strong>, and
            in Northern Ireland by the <strong className="text-foreground">Council for the Curriculum,
            Examinations and Assessment (CCEA)</strong>. Schools choose which board to use for each
            subject — meaning two students studying GCSE History may sit papers from entirely different
            exam boards covering different content.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ExamBoardCard
            name="AQA"
            fullName="Assessment and Qualifications Alliance"
            description="The largest exam board in England by entries. AQA is a registered charity and not-for-profit organisation. It offers GCSEs, A-Levels, and a range of vocational qualifications. Particularly strong across sciences, humanities, and English."
            subjects={["Mathematics", "English Language & Literature", "Sciences (Triple & Combined)", "History", "Geography", "Psychology", "French", "Spanish", "German", "Sociology", "Business", "PE", "Music", "Drama"]}
            website="https://aqa.org.uk"
          />
          <ExamBoardCard
            name="OCR"
            fullName="Oxford, Cambridge and RSA Examinations"
            description="Part of the Cambridge Assessment group (University of Cambridge). OCR offers GCSEs, A-Levels, Cambridge Nationals (vocational), and Cambridge Technicals. Known for innovative question styles and strong provision in Law, Philosophy, Classical subjects, and STEM."
            subjects={["Mathematics", "Sciences", "Computer Science", "History", "English", "Law", "Philosophy", "Classical Civilisation", "Latin", "Ancient History", "Media Studies", "Cambridge Nationals"]}
            website="https://ocr.org.uk"
          />
          <ExamBoardCard
            name="Pearson Edexcel"
            fullName="Pearson Education (Edexcel)"
            description="Part of Pearson plc, the world's largest education company. Edexcel is the only UK exam board that is part of a commercial company. Offers GCSEs, International GCSEs (IGCSEs), A-Levels, and BTEC vocational qualifications widely used in colleges."
            subjects={["Mathematics", "Sciences", "English", "History", "Geography", "Business", "Economics", "BTECs", "International GCSEs (IGCSE)", "Drama", "Music", "Physical Education", "Statistics"]}
            website="https://qualifications.pearson.com"
          />
          <ExamBoardCard
            name="WJEC"
            fullName="Welsh Joint Education Committee / Eduqas"
            description="Wales's national awarding body. WJEC offers qualifications in Wales, while its subsidiary Eduqas offers qualifications in England. Strong in Welsh language, Film Studies, Media Studies, Religious Studies, and creative subjects."
            subjects={["Welsh Language", "English", "Mathematics", "Sciences", "History", "Geography", "Film Studies", "Media Studies", "Religious Studies", "Art & Design", "Drama", "Music", "Law"]}
            website="https://wjec.co.uk"
          />
          <ExamBoardCard
            name="Cambridge"
            fullName="Cambridge Assessment International Education"
            description="Offers the internationally recognised Cambridge IGCSE, Cambridge O-Level, Cambridge International AS and A-Levels. Used by international schools and some independent schools in the UK. Provides a rigorous, globally portable qualification."
            subjects={["Mathematics", "Sciences", "English", "Languages", "Humanities", "Business Studies", "Computer Science", "Cambridge Pre-U (alternative to A-Level)"]}
            website="https://cambridgeinternational.org"
          />
          <ExamBoardCard
            name="CCEA"
            fullName="Council for Curriculum, Examinations and Assessment"
            description="The statutory body responsible for the curriculum, examinations, and assessment in Northern Ireland. Sets its own GCSEs and A-Levels for Northern Irish schools, often with different content and structure from the England equivalents."
            subjects={["All GCSEs and A-Levels", "Graded Objectives in Modern Languages", "Essential Skills", "Northern Ireland specific qualifications"]}
            website="https://ccea.org.uk"
          />
        </div>
        <div className="mt-6 p-5 rounded-xl border bg-muted/30">
          <p className="font-semibold text-foreground mb-2">How schools choose exam boards</p>
          <p className="text-sm text-muted-foreground">
            Schools typically register with 1–3 exam boards and may use different boards for different
            subjects. Factors include specification style (linear vs. modular content), quality of
            resources, training for teachers, and historical relationships with boards. The content within
            a subject (e.g. which poems in English Literature, which historical period in History) can vary
            significantly between boards — so it is worth checking which board your school uses before
            choosing revision resources.
          </p>
        </div>
      </section>

      {/* ── HIGHER EDUCATION ──────────────────────────────────────────────── */}
      <section className="mb-16">
        <SectionHeading
          icon={<GraduationCap className="w-6 h-6" />}
          title="Higher Education (HE)"
          subtitle="University degrees and advanced study from age 18"
        />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              The UK has over <strong className="text-foreground">160 universities</strong> and higher
              education institutions, including some of the world's highest-ranked. The system is
              regulated by the <strong className="text-foreground">Office for Students (OfS)</strong> in England.
            </p>
            <p>
              Most undergraduate degrees are <strong className="text-foreground">three years</strong>
              {" "}in England (four in Scotland, as the Scottish system begins with a broader first year).
              Medicine, dentistry, and architecture are longer (5–6 years). Students apply through
              <strong className="text-foreground"> UCAS</strong> (Universities and Colleges Admissions Service),
              typically in Year 13 with up to 5 choices.
            </p>
            <div className="p-4 rounded-xl bg-muted/50 space-y-2">
              <p className="font-semibold text-foreground">Types of UK Universities</p>
              {[
                { name: "Russell Group (24 universities)", desc: "Research-intensive, high-ranking. Includes Oxford, Cambridge, Imperial, LSE, UCL, Edinburgh, Manchester." },
                { name: "Post-1992 Universities", desc: "Former polytechnics, often more vocational and teaching-focused. Strong in creative arts, nursing, business." },
                { name: "Specialist Institutions", desc: "Conservatoires (RCM, RAM), art schools (Goldsmiths, UAL), agricultural colleges, and theological colleges." },
                { name: "Online/Distance", desc: "Open University offers degrees part-time and online — ideal for those who cannot study full-time." },
              ].map(t => (
                <div key={t.name}>
                  <p className="font-medium text-foreground text-xs">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border bg-card">
              <p className="font-semibold text-foreground mb-3">Tuition Fees &amp; Student Finance (England)</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between"><span>Annual tuition fee (max, England)</span><span className="font-semibold text-foreground">£9,250</span></div>
                <div className="flex justify-between"><span>Maintenance loan (max, away from home)</span><span className="font-semibold text-foreground">~£13,022</span></div>
                <div className="flex justify-between"><span>Repayment threshold</span><span className="font-semibold text-foreground">£25,000/yr</span></div>
                <div className="flex justify-between"><span>Repayment rate above threshold</span><span className="font-semibold text-foreground">9%</span></div>
                <div className="flex justify-between"><span>Loan written off after</span><span className="font-semibold text-foreground">40 years (Plan 5)</span></div>
                <p className="text-xs mt-2 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 p-2 rounded-lg">
                  Scottish students studying in Scotland pay no tuition fees. Welsh and Northern Irish students have different schemes. International students pay significantly higher fees (typically £15,000–£35,000+/yr).
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <p className="font-semibold text-foreground mb-2">Degree Classification</p>
              <div className="space-y-1 text-sm">
                {[
                  { cls: "First Class (1:1)", mark: "70%+", color: "text-emerald-600" },
                  { cls: "Upper Second (2:1)", mark: "60–69%", color: "text-blue-600" },
                  { cls: "Lower Second (2:2)", mark: "50–59%", color: "text-violet-600" },
                  { cls: "Third Class (3rd)", mark: "40–49%", color: "text-orange-600" },
                  { cls: "Ordinary / Pass", mark: "Below 40% in some units", color: "text-slate-500" },
                ].map(d => (
                  <div key={d.cls} className="flex justify-between">
                    <span className={`font-medium ${d.color}`}>{d.cls}</span>
                    <span className="text-muted-foreground text-xs self-center">{d.mark}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FURTHER EDUCATION ─────────────────────────────────────────────── */}
      <section className="mb-16">
        <SectionHeading
          icon={<Briefcase className="w-6 h-6" />}
          title="Further Education (FE)"
          subtitle="Colleges, apprenticeships, and vocational routes"
        />
        <div className="prose prose-slate max-w-none text-muted-foreground mb-6">
          <p>
            <strong className="text-foreground">Further Education</strong> refers to post-16 education
            that is not at degree level, delivered primarily through FE colleges, sixth form colleges,
            and independent training providers. England has around{" "}
            <strong className="text-foreground">240 general FE colleges</strong> alongside hundreds of
            specialist providers. FE is overseen by the{" "}
            <strong className="text-foreground">Education and Skills Funding Agency (ESFA)</strong>.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: "General FE Colleges",
              icon: <Building2 className="w-5 h-5 text-blue-600" />,
              bg: "bg-blue-50 dark:bg-blue-900/10",
              border: "border-blue-200 dark:border-blue-800/30",
              points: [
                "Offer A-Levels, T-Levels, BTECs, and HNCs",
                "Typically larger and more diverse than school sixth forms",
                "Adult education and community learning",
                "Entry-level, Level 1 and Level 2 courses for school leavers without GCSEs",
                "Higher Education programmes (HNCs, HNDs, Foundation Degrees)",
              ],
            },
            {
              title: "Apprenticeships",
              icon: <Briefcase className="w-5 h-5 text-orange-600" />,
              bg: "bg-orange-50 dark:bg-orange-900/10",
              border: "border-orange-200 dark:border-orange-800/30",
              points: [
                "Level 2 (GCSE equivalent) to Level 7 (Master's equivalent)",
                "Funded by government Apprenticeship Levy (employers with >£3m wage bill)",
                "Minimum 20% off-the-job training requirement",
                "Earn at least the National Minimum Wage (Apprentice rate or above)",
                "Available in 700+ occupations including law, medicine support, tech, and finance",
              ],
            },
            {
              title: "Higher Technical Qualifications (HTQs)",
              icon: <Award className="w-5 h-5 text-violet-600" />,
              bg: "bg-violet-50 dark:bg-violet-900/10",
              border: "border-violet-200 dark:border-violet-800/30",
              points: [
                "Level 4 and 5 — between A-Levels and a full degree",
                "Employer-approved and occupationally specific",
                "HNCs (1 year) and HNDs (2 years)",
                "Delivered at colleges and some universities",
                "Can be studied alongside work (part-time routes available)",
              ],
            },
          ].map(card => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={`p-5 rounded-2xl border ${card.border} ${card.bg}`}
            >
              <div className="flex items-center gap-2 mb-4">{card.icon}<h4 className="font-bold text-foreground">{card.title}</h4></div>
              <ul className="space-y-2">
                {card.points.map(p => (
                  <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                    <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />{p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── QUALIFICATIONS FRAMEWORK ──────────────────────────────────────── */}
      <section className="mb-16">
        <SectionHeading
          icon={<Award className="w-6 h-6" />}
          title="The Qualifications Frameworks"
          subtitle="How all UK qualifications relate to each other"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 rounded-tl-xl font-semibold text-foreground">RQF Level</th>
                <th className="text-left p-3 font-semibold text-foreground">School / Academic</th>
                <th className="text-left p-3 font-semibold text-foreground">Vocational / Applied</th>
                <th className="text-left p-3 rounded-tr-xl font-semibold text-foreground">Apprenticeship</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { level: "Entry Level", academic: "Entry level certificates", vocational: "Entry Level Awards", app: "—" },
                { level: "Level 1", academic: "GCSE grades 1–3", vocational: "BTEC Level 1", app: "—" },
                { level: "Level 2", academic: "GCSE grades 4–9", vocational: "BTEC First / NVQ L2", app: "Intermediate Apprenticeship" },
                { level: "Level 3", academic: "A-Levels / IB / T-Levels", vocational: "BTEC Extended Diploma / NVQ L3", app: "Advanced Apprenticeship" },
                { level: "Level 4", academic: "Certificate of HE", vocational: "HNC / NVQ L4", app: "Higher Apprenticeship" },
                { level: "Level 5", academic: "Foundation Degree / HND", vocational: "HND / HTQ", app: "Higher Apprenticeship" },
                { level: "Level 6", academic: "Bachelor's Degree (BA/BSc/BEng)", vocational: "NVQ L6", app: "Degree Apprenticeship" },
                { level: "Level 7", academic: "Master's Degree (MA/MSc/MBA)", vocational: "NVQ L7", app: "Degree Apprenticeship (Masters)" },
                { level: "Level 8", academic: "Doctorate (PhD/EdD)", vocational: "—", app: "—" },
              ].map((row, i) => (
                <tr key={row.level} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                  <td className="p-3 font-semibold text-primary">{row.level}</td>
                  <td className="p-3 text-muted-foreground">{row.academic}</td>
                  <td className="p-3 text-muted-foreground">{row.vocational}</td>
                  <td className="p-3 text-muted-foreground">{row.app}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          RQF = Regulated Qualifications Framework (England and Northern Ireland). Scotland uses the SCQF; Wales uses the CQFW. These are broadly compatible with European Qualification Framework (EQF) levels.
        </p>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-8 text-primary-foreground text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to plan your next step?</h2>
        <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
          Use our personalised recommendation tool to find the careers, institutions, and routes that
          best match your subjects, grades, and interests.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary font-bold hover:bg-white/90 transition-colors"
          >
            Get My Recommendations <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/subjects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
          >
            Browse Subjects
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
