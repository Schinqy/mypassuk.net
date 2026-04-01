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

// ─── SCOTLAND-SPECIFIC SECTIONS ──────────────────────────────────────────────

function ScotlandCurriculumSection() {
  return (
    <section className="mb-16">
      <SectionHeading
        icon={<BookOpen className="w-6 h-6" />}
        title="Curriculum for Excellence (CfE)"
        subtitle="Scotland's national framework for learning from ages 3 to 18"
      />
      <div className="prose prose-slate max-w-none text-muted-foreground space-y-4 mb-8">
        <p>
          The <strong className="text-foreground">Curriculum for Excellence (CfE)</strong> is Scotland's
          national curriculum framework, introduced in 2010 and covering all learners from early years
          through to the end of school at age 18. It is overseen by{" "}
          <strong className="text-foreground">Education Scotland</strong> and focuses on developing
          four core capacities in every young person: to be a{" "}
          <strong className="text-foreground">successful learner</strong>, a{" "}
          <strong className="text-foreground">confident individual</strong>, a{" "}
          <strong className="text-foreground">responsible citizen</strong>, and an{" "}
          <strong className="text-foreground">effective contributor</strong>.
        </p>
        <p>
          Unlike England's subject-based National Curriculum, the CfE is organised into{" "}
          <strong className="text-foreground">eight curriculum areas</strong> and two broad phases:
          the <strong className="text-foreground">Broad General Education (BGE)</strong> from early years
          to the end of S3, and the <strong className="text-foreground">Senior Phase</strong> from S4 to S6
          where students take SQA qualifications.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { area: "Expressive Arts", items: ["Art & Design", "Drama", "Music", "Dance"] },
          { area: "Health & Wellbeing", items: ["PE", "PSHE", "Food & Health", "Relationships"] },
          { area: "Languages", items: ["English / Literacy", "Modern Languages", "Gàidhlig", "Classics"] },
          { area: "Mathematics", items: ["Numeracy", "Mathematics", "Statistics"] },
          { area: "Religious & Moral Ed.", items: ["RME", "Philosophy", "Ethics"] },
          { area: "Sciences", items: ["Biology", "Chemistry", "Physics", "Environmental"] },
          { area: "Social Studies", items: ["History", "Geography", "Modern Studies", "Economics"] },
          { area: "Technologies", items: ["Computing", "Design & Technology", "Food Tech", "Business"] },
        ].map(a => (
          <div key={a.area} className="bg-teal-50 border border-teal-200 rounded-xl p-4">
            <p className="font-bold text-teal-900 text-sm mb-2">{a.area}</p>
            <ul className="space-y-0.5">
              {a.items.map(i => (
                <li key={i} className="text-xs text-teal-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />{i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-sm text-teal-800">
        <p className="font-semibold mb-1">Cross-cutting skills across all areas</p>
        <p>Literacy, Numeracy, and Health & Wellbeing are declared{" "}
          <strong>responsibilities of all teachers</strong> in all subjects — not just English and Maths teachers.
          This holistic approach means students develop these skills across the whole school day.</p>
      </div>
    </section>
  );
}

function ScotlandStagesSection() {
  return (
    <section className="mb-16">
      <SectionHeading
        icon={<Users className="w-6 h-6" />}
        title="The Scottish Education Stages"
        subtitle="From Early Level (nursery) through to Senior Phase (S4–S6)"
      />
      <div className="grid gap-6">

        <KeyStageCard
          stage="Early Level"
          ages="Ages 3–6"
          years="Nursery & Primary 1"
          color="bg-emerald-500"
          icon={<span className="text-emerald-600 font-bold text-xs">EARLY</span>}
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              The <strong className="text-foreground">Early Level</strong> covers pre-school nursery
              and the first year of primary (P1). Learning is play-based and child-centred, building
              the foundations of literacy and numeracy within a nurturing environment. All eight
              curriculum areas begin here in age-appropriate ways.
            </p>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <p className="font-semibold text-emerald-800 mb-1">Key Features</p>
              <ul className="space-y-1 text-emerald-700">
                {["Play-based learning throughout nursery and P1", "Strong emphasis on oral language and early reading", "Numeracy through exploration and real-world contexts", "Social and emotional development as a priority"].map(f => (
                  <li key={f} className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </KeyStageCard>

        <KeyStageCard
          stage="First Level"
          ages="Ages 6–9"
          years="Primary 2 – Primary 4"
          color="bg-blue-500"
          icon={<span className="text-blue-600 font-bold text-xs">FIRST</span>}
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              The <strong className="text-foreground">First Level</strong> builds reading, writing, and
              number skills systematically. Children engage with all eight curriculum areas through
              cross-curricular projects and topic work. Teachers use a mix of direct teaching and
              enquiry-based learning.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">Focus Areas</p>
                <ul className="space-y-1">{["Phonics & reading fluency", "Writing for different purposes", "Number, money & measure", "Science investigations"].map(s => <li key={s} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />{s}</li>)}</ul>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">Also Covered</p>
                <ul className="space-y-1">{["Modern Languages (from P1)", "PE (2 hours/week minimum)", "RME and social studies", "Creative arts & music"].map(s => <li key={s} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-slate-300 shrink-0" />{s}</li>)}</ul>
              </div>
            </div>
          </div>
        </KeyStageCard>

        <KeyStageCard
          stage="Second Level"
          ages="Ages 9–12"
          years="Primary 5 – Primary 7"
          color="bg-violet-500"
          icon={<span className="text-violet-600 font-bold text-xs">SECOND</span>}
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              The <strong className="text-foreground">Second Level</strong> deepens subject knowledge
              and develops independent learning. By P7, most pupils have a secure grasp of literacy and
              numeracy and are ready for the wider subject range of secondary school. Modern languages
              (usually French or Spanish) are embedded from P1 under the 1+2 Languages policy.
            </p>
            <div className="p-3 rounded-lg bg-violet-50 border border-violet-100">
              <p className="font-semibold text-violet-800 mb-1">Transition to Secondary</p>
              <p className="text-violet-700">Pupils move from P7 to S1 (Secondary 1) at age 11–12. Scottish secondary schools are almost all non-selective comprehensives. The Broad General Education continues through S1–S3 before the Senior Phase begins in S4.</p>
            </div>
          </div>
        </KeyStageCard>

        <KeyStageCard
          stage="Third & Fourth Level — BGE Phase"
          ages="Ages 12–15"
          years="Secondary 1 – Secondary 3 (S1–S3)"
          color="bg-orange-500"
          icon={<span className="text-orange-600 font-bold text-xs">BGE</span>}
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              S1–S3 is the final stage of the{" "}
              <strong className="text-foreground">Broad General Education (BGE)</strong>. Students
              study all eight curriculum areas and develop the knowledge, skills, and attributes needed
              for the Senior Phase. Most pupils work at Third Level in S1–S2 and Fourth Level in S3,
              though progression is personalised.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">BGE Subject Areas</p>
                <ul className="space-y-1">{["English & Literacy", "Mathematics & Numeracy", "Sciences (Biology/Chem/Physics)", "Social subjects (History/Geography)", "Modern Languages", "Technologies & Computing", "Expressive Arts", "Health & Wellbeing"].map(s => <li key={s} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />{s}</li>)}</ul>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 border border-orange-100">
                <p className="font-semibold text-orange-800 mb-1">Choosing S4 Subjects</p>
                <p className="text-orange-700 text-xs">At the end of S3, pupils choose which subjects to take through to National 5 in S4. Most schools offer 6–8 subjects at National 5. English and Mathematics are compulsory. Schools vary in how many subjects they allow pupils to take.</p>
              </div>
            </div>
          </div>
        </KeyStageCard>

        <KeyStageCard
          stage="Senior Phase — National 5"
          ages="Ages 15–16"
          years="Secondary 4 (S4)"
          color="bg-teal-500"
          icon={<span className="text-teal-600 font-bold text-xs">N5</span>}
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">National 5</strong> qualifications are Scotland's
              equivalent of GCSEs, taken in S4. They are awarded by the{" "}
              <strong className="text-foreground">Scottish Qualifications Authority (SQA)</strong> and
              graded A–D (with A being the highest). Most pupils take 6–8 National 5s. Performance
              at National 5 determines which Highers students can access in S5.
            </p>
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
              <p className="font-semibold text-teal-900 mb-3">National 5 Grade Scale</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { grade: "A", label: "70%+", color: "bg-emerald-600 text-white" },
                  { grade: "B", label: "60–69%", color: "bg-blue-500 text-white" },
                  { grade: "C", label: "50–59%", color: "bg-violet-500 text-white" },
                  { grade: "D", label: "45–49%", color: "bg-orange-400 text-white" },
                  { grade: "No Award", label: "Below 45%", color: "bg-slate-400 text-white" },
                ].map(g => (
                  <div key={g.grade} className={`px-3 py-1.5 rounded-lg flex items-center gap-2 ${g.color}`}>
                    <span className="font-bold text-sm">{g.grade}</span>
                    <span className="text-xs opacity-90">{g.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-teal-700 text-xs">
                Assessment is typically a final exam plus a coursework component (assignment, practical, or performance).
                English and Maths must be passed at National 5 for most university courses.
              </p>
            </div>
          </div>
        </KeyStageCard>

        <KeyStageCard
          stage="Senior Phase — Highers"
          ages="Ages 16–17"
          years="Secondary 5 (S5)"
          color="bg-indigo-500"
          icon={<span className="text-indigo-600 font-bold text-xs">H</span>}
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Highers</strong> are the primary university entrance
              qualification in Scotland, taken in S5 (and sometimes S6). Scottish universities typically
              require 4–5 Highers for entry. They are one-year courses — faster and more focused than
              English A-Levels, though slightly less in-depth. Graded A–D.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-2">
              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                <p className="font-semibold text-indigo-800 mb-1">UCAS Tariff (Highers)</p>
                <div className="space-y-0.5 text-xs text-indigo-700">
                  {[["A", "33 points"], ["B", "27 points"], ["C", "21 points"], ["D", "15 points"]].map(([g, p]) => (
                    <div key={g} className="flex justify-between"><span className="font-bold">{g}</span><span>{p}</span></div>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">Popular Highers</p>
                <ul className="space-y-0.5 text-xs">{["English (usually required)", "Mathematics", "Biology / Chemistry / Physics", "History / Modern Studies", "Business Management", "French / Spanish / German"].map(s => <li key={s} className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-indigo-400 shrink-0" />{s}</li>)}</ul>
              </div>
            </div>
          </div>
        </KeyStageCard>

        <KeyStageCard
          stage="Senior Phase — Advanced Highers"
          ages="Ages 17–18"
          years="Secondary 6 (S6)"
          color="bg-rose-500"
          icon={<span className="text-rose-600 font-bold text-xs">AH</span>}
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Advanced Highers</strong> are the most demanding
              SQA qualifications, taken in S6. They are comparable in depth to the first year of a
              university degree and equivalent to A-Levels in terms of UCAS tariff. They are taken
              for highly competitive university courses (medicine, law, engineering at Scottish and
              English universities) and are required by some English universities.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-2">
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-100">
                <p className="font-semibold text-rose-800 mb-1">UCAS Tariff (Advanced Highers)</p>
                <div className="space-y-0.5 text-xs text-rose-700">
                  {[["A", "56 points (= A-Level A)"], ["B", "48 points (= A-Level B)"], ["C", "40 points (= A-Level C)"], ["D", "32 points (= A-Level D)"]].map(([g, p]) => (
                    <div key={g} className="flex justify-between"><span className="font-bold">{g}</span><span>{p}</span></div>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">Who Takes Advanced Highers?</p>
                <ul className="space-y-0.5 text-xs">{["Students applying for medicine or dentistry", "Applicants to Oxford or Cambridge", "Those targeting highly selective English universities", "Students who want exemption from university Year 1 modules", "High achievers looking to boost UCAS points"].map(s => <li key={s} className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-rose-400 shrink-0" />{s}</li>)}</ul>
              </div>
            </div>
          </div>
        </KeyStageCard>

      </div>
    </section>
  );
}

function ScotlandExamBoardSection() {
  return (
    <section className="mb-16">
      <SectionHeading
        icon={<Award className="w-6 h-6" />}
        title="The Scottish Qualifications Authority (SQA)"
        subtitle="Scotland's single national awarding body for qualifications"
      />
      <div className="prose prose-slate max-w-none text-muted-foreground mb-8">
        <p>
          Unlike England, which has multiple competing exam boards (AQA, OCR, Edexcel),{" "}
          <strong className="text-foreground">Scotland has one national awarding body: the SQA</strong>.
          This means every school in Scotland uses the same specifications, past papers, and marking
          schemes — making revision resources consistent and portable across the country. The SQA is
          regulated by the <strong className="text-foreground">Scottish Government</strong> and{" "}
          <strong className="text-foreground">Education Scotland</strong>.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {[
          {
            name: "National 1–5",
            desc: "The full range of National qualifications from National 1 (entry-level) through to National 5 (GCSE equivalent). National 5 is the standard S4 qualification for most pupils.",
            tags: ["National 1", "National 2", "National 3", "National 4", "National 5"],
            color: "bg-teal-50 border-teal-200",
          },
          {
            name: "Highers",
            desc: "Scotland's primary university entrance qualification. One-year courses taken in S5 (and sometimes S6). 4–5 Highers at grades A–C are required for most Scottish university degree programmes.",
            tags: ["Higher English", "Higher Maths", "Higher Biology", "Higher Chemistry", "Higher History", "Higher Modern Studies"],
            color: "bg-indigo-50 border-indigo-200",
          },
          {
            name: "Advanced Highers",
            desc: "The most demanding SQA academic qualification, broadly equivalent to A-Levels in UCAS tariff. Taken in S6. Often required for competitive medicine, law, and engineering courses.",
            tags: ["Advanced Higher Maths", "Advanced Higher English", "Advanced Higher Biology", "Advanced Higher Chemistry"],
            color: "bg-rose-50 border-rose-200",
          },
          {
            name: "HNC & HND",
            desc: "Higher National Certificates (1 year) and Diplomas (2 years) are delivered through Scotland's college sector and awarded by the SQA. They provide vocational pathways into professions and can lead to university entry at Year 2.",
            tags: ["HNC Computing", "HNC Business", "HND Accounting", "HND Engineering", "HND Creative Industries"],
            color: "bg-orange-50 border-orange-200",
          },
          {
            name: "Professional Development Awards",
            desc: "PDAs are specialist qualifications for those already holding a vocational or academic qualification who want to extend their skills in a specific area. Available at various SCQF levels.",
            tags: ["Education", "Social Care", "IT & Computing", "Business", "Environmental"],
            color: "bg-violet-50 border-violet-200",
          },
          {
            name: "Core Skills",
            desc: "SQA awards five Core Skills qualifications: Communication, Numeracy, Information & Communication Technology, Problem Solving, and Working with Others. These are embedded in National Qualifications and assessed as part of the main subject.",
            tags: ["Communication", "Numeracy", "ICT", "Problem Solving", "Working with Others"],
            color: "bg-slate-50 border-slate-200",
          },
        ].map(q => (
          <motion.div
            key={q.name}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`rounded-2xl border p-6 ${q.color}`}
          >
            <h4 className="font-bold text-foreground mb-2">{q.name}</h4>
            <p className="text-sm text-muted-foreground mb-4">{q.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {q.tags.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full bg-white/80 border text-xs text-muted-foreground">{t}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="p-5 rounded-xl border bg-teal-50 border-teal-200">
        <p className="font-semibold text-teal-900 mb-2">Why one exam board matters for revision</p>
        <p className="text-sm text-teal-800">
          Because all Scottish schools use SQA specifications, the <strong>same past papers</strong>,{" "}
          <strong>marking instructions</strong>, and <strong>course notes</strong> apply to every student in the country.
          SQA publishes all past papers free on its website (sqa.org.uk). There is no need to check which board
          your school uses — it's always SQA.
        </p>
      </div>
    </section>
  );
}

function ScotlandHigherEducationSection() {
  return (
    <section className="mb-16">
      <SectionHeading
        icon={<GraduationCap className="w-6 h-6" />}
        title="Higher Education in Scotland"
        subtitle="Free tuition, 4-year Honours degrees, and world-class universities"
      />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Scotland has <strong className="text-foreground">19 universities</strong> and several specialist
            higher education institutions. The system is funded by the{" "}
            <strong className="text-foreground">Scottish Funding Council (SFC)</strong> and regulated
            differently from England's Office for Students.
          </p>
          <p>
            The most distinctive feature is that{" "}
            <strong className="text-foreground">Scottish-domiciled students studying in Scotland pay no tuition fees</strong>.
            Fees are covered by the{" "}
            <strong className="text-foreground">Student Awards Agency Scotland (SAAS)</strong>. Students
            from other UK nations, EU, or internationally pay fees as normal.
          </p>
          <p>
            Scottish Honours degrees are <strong className="text-foreground">4 years</strong> (compared to
            3 in England), because the broader first year (Year 1) covers multiple subjects before specialisation.
            Students who achieve very high grades in Advanced Highers may enter directly into Year 2 at some
            universities. An{" "}
            <strong className="text-foreground">Ordinary degree</strong> (3 years) is also available
            and a recognised qualification in its own right.
          </p>
          <div className="p-4 rounded-xl bg-muted/50 space-y-2">
            <p className="font-semibold text-foreground">Scottish Universities (Selection)</p>
            {[
              { name: "University of Edinburgh", note: "Russell Group · #1 in Scotland many years · Medicine, Law, Arts" },
              { name: "University of St Andrews", note: "Often #1 in UK rankings · Science, Philosophy, International Relations" },
              { name: "University of Glasgow", note: "Russell Group · Strong Medicine, Engineering, Humanities" },
              { name: "University of Aberdeen", note: "Scotland's third oldest · Medicine, Law, Engineering" },
              { name: "University of Strathclyde", note: "Modern & technical · Engineering, Business, Pharmacy" },
              { name: "Heriot-Watt University", note: "STEM specialist · Engineering, Computing, Actuarial" },
            ].map(u => (
              <div key={u.name}>
                <p className="font-medium text-foreground text-xs">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.note}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-xl border bg-card">
            <p className="font-semibold text-foreground mb-3">Tuition Fees &amp; SAAS Funding (Scotland)</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between"><span>Annual tuition fee (Scottish students in Scotland)</span><span className="font-bold text-emerald-600">£0</span></div>
              <div className="flex justify-between"><span>Paid by SAAS on your behalf</span><span className="font-semibold text-foreground">~£1,820/yr cap</span></div>
              <div className="flex justify-between"><span>Scottish students at English universities</span><span className="font-semibold text-foreground">Up to £9,250/yr</span></div>
              <div className="flex justify-between"><span>Bursary (means-tested, low income)</span><span className="font-semibold text-foreground">Up to £2,000/yr</span></div>
              <div className="flex justify-between"><span>Student loan (living costs)</span><span className="font-semibold text-foreground">Up to ~£7,750/yr</span></div>
              <div className="flex justify-between"><span>Repayment threshold</span><span className="font-semibold text-foreground">£25,000/yr</span></div>
              <p className="text-xs mt-2 text-teal-700 bg-teal-50 p-2 rounded-lg border border-teal-200">
                SAAS (saas.gov.uk) is Scotland's equivalent of Student Finance England. Apply before starting your course. The fee waiver is automatic for Scottish-domiciled students at Scottish universities.
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
                { cls: "Ordinary Degree", mark: "3-year route (without Honours)", color: "text-slate-500" },
              ].map(d => (
                <div key={d.cls} className="flex justify-between">
                  <span className={`font-medium ${d.color}`}>{d.cls}</span>
                  <span className="text-muted-foreground text-xs self-center">{d.mark}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-teal-50 border-teal-200">
            <p className="font-semibold text-teal-900 mb-1">Applying via UCAS</p>
            <p className="text-sm text-teal-800">Scottish students apply through <strong>UCAS</strong> like all other UK students — typically in S5 (December deadline for Oxford/Cambridge, January for most others). You can apply to Scottish and non-Scottish universities on the same UCAS form (up to 5 choices total).</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScotlandFurtherEducationSection() {
  return (
    <section className="mb-16">
      <SectionHeading
        icon={<Briefcase className="w-6 h-6" />}
        title="Further Education &amp; Apprenticeships in Scotland"
        subtitle="Colleges, Modern Apprenticeships, and Foundation Apprenticeships"
      />
      <div className="prose prose-slate max-w-none text-muted-foreground mb-6">
        <p>
          Scotland has around <strong className="text-foreground">26 regional further education colleges</strong>,
          funded by the <strong className="text-foreground">Scottish Funding Council (SFC)</strong>. FE
          colleges offer a wide range of courses — from National Qualifications (N1–N5) and Highers through
          to HNCs, HNDs, and vocational programmes. Apprenticeships are managed nationally by{" "}
          <strong className="text-foreground">Skills Development Scotland (SDS)</strong>.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          {
            title: "Scottish Further Education Colleges",
            icon: <Building2 className="w-5 h-5 text-blue-600" />,
            bg: "bg-blue-50",
            border: "border-blue-200",
            points: [
              "Offer National 4/5, Highers, HNC and HND courses",
              "~26 regional colleges covering all of Scotland",
              "Free for 16–19 year-olds in most cases",
              "Adult learners supported through Individual Learning Accounts",
              "Can provide a route to university via articulation agreements (entering Year 2 with HND)",
            ],
          },
          {
            title: "Modern Apprenticeships (MAs)",
            icon: <Briefcase className="w-5 h-5 text-orange-600" />,
            bg: "bg-orange-50",
            border: "border-orange-200",
            points: [
              "Scotland's government-funded work-based training programme",
              "Available at SCQF Levels 5, 6, 7 and above",
              "Earn a wage while training in your chosen sector",
              "Available in 70+ frameworks: engineering, IT, business, hospitality, hair & beauty",
              "Managed by Skills Development Scotland (myworldofwork.co.uk)",
            ],
          },
          {
            title: "Foundation Apprenticeships",
            icon: <Award className="w-5 h-5 text-violet-600" />,
            bg: "bg-violet-50",
            border: "border-violet-200",
            points: [
              "Taken during S5 and S6 alongside Highers and other subjects",
              "Equivalent to a Higher (SCQF Level 6) — counts as a Higher for UCAS points",
              "Real workplace experience (2 days per week typically)",
              "Available in Computing, Engineering, Social Services, Business, Creative & Digital Media",
              "Gives students a head start in Modern Apprenticeships or university",
            ],
          },
          {
            title: "Graduate Apprenticeships",
            icon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
            bg: "bg-emerald-50",
            border: "border-emerald-200",
            points: [
              "Degree-level apprenticeships fully funded by the Scottish Government",
              "Earn while you learn — no tuition fees and full salary",
              "Available in Software Development, Engineering, Business Management, Data Science",
              "Delivered by universities in partnership with employers",
              "Lead to an Honours degree (SCQF Level 10) in 4–5 years",
            ],
          },
          {
            title: "Skills Development Scotland (SDS)",
            icon: <Users className="w-5 h-5 text-teal-600" />,
            bg: "bg-teal-50",
            border: "border-teal-200",
            points: [
              "Scotland's national skills agency — myworldofwork.co.uk",
              "Provides free career guidance to all ages",
              "My World of Work platform for career exploration",
              "Supports school leavers, adults, and employers",
              "Administers Modern and Foundation Apprenticeship programmes",
            ],
          },
          {
            title: "Articulation Pathways",
            icon: <ArrowRight className="w-5 h-5 text-slate-600" />,
            bg: "bg-slate-50",
            border: "border-slate-200",
            points: [
              "College HND → University Year 2 (very common in Scotland)",
              "College HNC → University Year 1 or 2 depending on subject",
              "Hundreds of formal articulation agreements between colleges and universities",
              "Allows students to enter degrees without traditional Higher grades",
              "Particularly strong in computing, business, engineering, and nursing pathways",
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
  );
}

function ScotlandQualificationsSection() {
  return (
    <section className="mb-16">
      <SectionHeading
        icon={<Award className="w-6 h-6" />}
        title="The Scottish Credit and Qualifications Framework (SCQF)"
        subtitle="How all Scottish qualifications relate to each other"
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 rounded-tl-xl font-semibold text-foreground">SCQF Level</th>
              <th className="text-left p-3 font-semibold text-foreground">School / Academic</th>
              <th className="text-left p-3 font-semibold text-foreground">Vocational / College</th>
              <th className="text-left p-3 rounded-tr-xl font-semibold text-foreground">Apprenticeship</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { level: "SCQF 1–4", academic: "National 1 – National 4", vocational: "Entry-level vocational awards", app: "—" },
              { level: "SCQF 5", academic: "National 5", vocational: "SVQ Level 2", app: "Modern Apprenticeship (L5)" },
              { level: "SCQF 6", academic: "Higher / Foundation Apprenticeship", vocational: "NC / NPA", app: "Modern Apprenticeship (L6)" },
              { level: "SCQF 7", academic: "Advanced Higher", vocational: "HNC / NC (some)", app: "Modern Apprenticeship (L7)" },
              { level: "SCQF 8", academic: "Year 1 of a degree", vocational: "HND", app: "Higher Apprenticeship" },
              { level: "SCQF 9", academic: "Year 2/3 of a degree", vocational: "Graduate Diploma", app: "Graduate Apprenticeship" },
              { level: "SCQF 10", academic: "Honours Degree (4 years)", vocational: "Professional qualifications", app: "Graduate Apprenticeship" },
              { level: "SCQF 11", academic: "Master's Degree", vocational: "Postgrad Diploma", app: "—" },
              { level: "SCQF 12", academic: "Doctorate (PhD)", vocational: "—", app: "—" },
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
        The SCQF has 12 levels and covers all Scottish qualifications from school through to doctorate. It is broadly compatible with the English RQF and the European Qualifications Framework (EQF). SCQF Level 6 (Higher) ≈ RQF Level 3 (A-Level). SCQF Level 10 (Honours Degree) ≈ RQF Level 6.
      </p>
    </section>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Editorial() {
  const { nation, openSelector } = useNation();
  const nationPanel = nation ? NATION_PANELS[nation] : null;
  const isScotland = nation === "scotland";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <motion.div {...fadeIn} className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <BookOpen className="w-4 h-4" />
          Editorial Overview
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-5">
          {isScotland ? (
            <>Scotland's Education System:{" "}<span className="text-primary">A Complete Guide</span></>
          ) : (
            <>The UK Education System:{" "}<span className="text-primary">A Complete Guide</span></>
          )}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          {isScotland
            ? "From primary school through National 5s, Highers, and Advanced Highers to free university places at Scotland's world-class institutions — this guide walks you through Scotland's Curriculum for Excellence and the SQA system."
            : "From the first day of primary school to university graduation and professional qualification, the United Kingdom has one of the world's most structured and internationally respected education systems. This guide walks you through every stage — who oversees it, how it is assessed, and what it means for your future."}
        </p>

        {/* Nation-specific system panel */}
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
            {!isScotland && (
              <p className={`text-xs mt-3 ${nationPanel.textColor} opacity-70`}>
                The sections below cover the England system in detail.{" "}
                <button onClick={openSelector} className="underline font-semibold hover:opacity-100">
                  Change nation
                </button>
              </p>
            )}
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

      {/* ── CURRICULUM SECTION ─────────────────────────────────────────────── */}
      {isScotland ? (
        <ScotlandCurriculumSection />
      ) : (
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
      )}

      {/* ── KEY STAGES / SCOTTISH STAGES ──────────────────────────────────── */}
      {isScotland ? (
        <ScotlandStagesSection />
      ) : (
        <section className="mb-16">
          <SectionHeading
            icon={<Users className="w-6 h-6" />}
            title="The Key Stages"
            subtitle="Compulsory education from age 5 to 16 — and beyond"
          />
          <div className="grid gap-6">
            <KeyStageCard stage="Key Stage 1" ages="Ages 5–7" years="Years 1–2" color="bg-emerald-500" icon={<span className="text-emerald-600 font-bold text-sm">KS1</span>}>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Children in Key Stage 1 follow the <strong className="text-foreground">Early Years Foundation Stage (EYFS)</strong> principles transitioning into the full National Curriculum. The focus is on establishing literacy and numeracy through a rich, play-informed curriculum.</p>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">Core Subjects</p>
                    <ul className="space-y-1">{["English (including Phonics)", "Mathematics", "Science"].map(s => <li key={s} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />{s}</li>)}</ul>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">Foundation Subjects</p>
                    <ul className="space-y-1">{["Art & Design", "Computing", "Design & Technology", "Geography", "History", "Music", "PE", "RE (locally agreed)"].map(s => <li key={s} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-slate-300 shrink-0" />{s}</li>)}</ul>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">Assessments</p>
                  <p className="text-emerald-700 dark:text-emerald-400"><strong>Year 1 Phonics Screening Check</strong> — a short 40-word check assessing decoding ability. <strong>KS1 SATs</strong> (Year 2) in Reading and Maths were made optional from 2023; teacher assessment remains statutory.</p>
                </div>
              </div>
            </KeyStageCard>

            <KeyStageCard stage="Key Stage 2" ages="Ages 7–11" years="Years 3–6" color="bg-blue-500" icon={<span className="text-blue-600 font-bold text-sm">KS2</span>}>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Key Stage 2 builds on KS1 skills with increasing subject depth. Children learn all core and foundation subjects, and many schools begin teaching a modern foreign language from Year 3 (statutory from Year 3). The stage culminates in national tests at the end of Year 6.</p>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">Core Subjects</p>
                    <ul className="space-y-1">{["English", "Mathematics", "Science"].map(s => <li key={s} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />{s}</li>)}</ul>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">Added in KS2</p>
                    <ul className="space-y-1">{["Modern Foreign Language (statutory)", "Latin (some schools)", "PSHE", "Relationships Education (statutory)"].map(s => <li key={s} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-slate-300 shrink-0" />{s}</li>)}</ul>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                  <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">KS2 SATs (Year 6)</p>
                  <p className="text-blue-700 dark:text-blue-400">National tests in <strong>Reading</strong>, <strong>GPS (Grammar, Punctuation and Spelling)</strong>, and <strong>Mathematics</strong> (two papers: arithmetic and reasoning). Results are used for school performance data, secondary school transition, and setting.</p>
                </div>
              </div>
            </KeyStageCard>

            <KeyStageCard stage="Key Stage 3" ages="Ages 11–14" years="Years 7–9" color="bg-violet-500" icon={<span className="text-violet-600 font-bold text-sm">KS3</span>}>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>At secondary school, students experience a broad curriculum across up to 15 subjects before narrowing their focus at GCSE. KS3 is the last stage at which all subjects are compulsory. Many students and teachers regard this as a crucial foundation stage.</p>
                <div className="grid sm:grid-cols-3 gap-3 mt-4">
                  {[
                    { label: "Compulsory Core", items: ["English", "Maths", "Science", "Physical Education", "RE", "PSHE", "RSE"] },
                    { label: "Typically Taught", items: ["History", "Geography", "Languages (MFL)", "Computing", "Drama", "Music", "Art & Design"] },
                    { label: "Often Offered", items: ["DT / Food Tech", "Citizenship", "Business Studies", "Classical Civilisation", "Latin", "Dance"] },
                  ].map(col => (
                    <div key={col.label}>
                      <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">{col.label}</p>
                      <ul className="space-y-1">{col.items.map(s => <li key={s} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />{s}</li>)}</ul>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/30">
                  <p className="font-semibold text-violet-800 dark:text-violet-300 mb-1">Choosing GCSE Options (Year 9)</p>
                  <p className="text-violet-700 dark:text-violet-400">At the end of Year 9, students choose their GCSE <strong>option subjects</strong> for Years 10 and 11. English Language, English Literature, Mathematics, and Science are compulsory. Students typically choose 3–4 additional subjects. The <strong>EBacc</strong> is a government-encouraged combination.</p>
                </div>
              </div>
            </KeyStageCard>

            <KeyStageCard stage="Key Stage 4 — GCSEs" ages="Ages 14–16" years="Years 10–11" color="bg-orange-500" icon={<span className="text-orange-600 font-bold text-sm">KS4</span>}>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p><strong className="text-foreground">General Certificate of Secondary Education (GCSE)</strong> qualifications are the primary academic qualification taken at the end of compulsory schooling. Students typically take 8–10 GCSEs across core and option subjects.</p>
                <div className="mt-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-700/30">
                  <p className="font-semibold text-orange-800 dark:text-orange-300 mb-3">The GCSE Grading Scale (since 2017)</p>
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
                </div>
              </div>
            </KeyStageCard>

            <KeyStageCard stage="Key Stage 5 — Post-16" ages="Ages 16–18" years="Years 12–13 (Sixth Form)" color="bg-rose-500" icon={<span className="text-rose-600 font-bold text-sm">KS5</span>}>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Participation in education or training is <strong className="text-foreground">compulsory to age 18</strong> in England. Post-16 learners have more choices than ever before:</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                  {[
                    { title: "A-Levels", desc: "Traditional academic route. 3 subjects studied deeply over 2 years. Graded A*–E. Primary route into most university courses.", color: "border-rose-200", bg: "bg-rose-50" },
                    { title: "T-Levels", desc: "New (from 2020) technical qualifications equivalent to 3 A-Levels. Includes a 45-day industry placement. Currently ~20 subjects available.", color: "border-blue-200", bg: "bg-blue-50" },
                    { title: "BTECs / Applied Generals", desc: "Coursework-based vocational qualifications at Level 3. Widely accepted by universities. Range from Award to Extended Diploma (= 3 A-Levels).", color: "border-violet-200", bg: "bg-violet-50" },
                    { title: "International Baccalaureate", desc: "6-subject international qualification + ToK, Extended Essay, CAS. Highly regarded globally. Available at ~200 UK schools.", color: "border-emerald-200", bg: "bg-emerald-50" },
                    { title: "Apprenticeships (Level 3)", desc: "Earn a salary while training. Equivalent to A-Levels. Combines on-the-job learning with off-the-job education.", color: "border-orange-200", bg: "bg-orange-50" },
                    { title: "Access to HE Diploma", desc: "For adults returning to education. One-year intensive course providing equivalent entry to university.", color: "border-slate-200", bg: "bg-slate-50" },
                  ].map(r => (
                    <div key={r.title} className={`p-4 rounded-xl border ${r.color} ${r.bg}`}>
                      <p className="font-semibold text-foreground mb-1">{r.title}</p>
                      <p className="text-xs leading-relaxed">{r.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-700/30">
                  <p className="font-semibold text-rose-800 dark:text-rose-300 mb-1">UCAS Points &amp; University Entry</p>
                  <p className="text-rose-700 dark:text-rose-400">A-Level grades convert to <strong>UCAS Tariff Points</strong>: A* = 56, A = 48, B = 40, C = 32, D = 24, E = 16. T-Levels at Distinction* = 168 points. Most universities quote entry in A-Level grades.</p>
                </div>
              </div>
            </KeyStageCard>
          </div>
        </section>
      )}

      {/* ── EXAM BOARDS ──────────────────────────────────────────────────── */}
      {isScotland ? (
        <ScotlandExamBoardSection />
      ) : (
        <section className="mb-16">
          <SectionHeading
            icon={<Award className="w-6 h-6" />}
            title="The Major Exam Boards"
            subtitle="Who sets, marks, and awards GCSEs and A-Levels in the UK"
          />
          <div className="prose prose-slate max-w-none text-muted-foreground mb-8">
            <p>Exam boards design qualifications, set papers, mark scripts, and issue certificates. They are regulated in England by <strong className="text-foreground">Ofqual</strong>, in Wales by <strong className="text-foreground">Qualifications Wales</strong>, and in Northern Ireland by the <strong className="text-foreground">CCEA</strong>. Schools choose which board to use for each subject.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <ExamBoardCard name="AQA" fullName="Assessment and Qualifications Alliance" description="The largest exam board in England by entries. A registered charity and not-for-profit organisation. Offers GCSEs, A-Levels, and a range of vocational qualifications. Particularly strong across sciences, humanities, and English." subjects={["Mathematics", "English Language & Literature", "Sciences", "History", "Geography", "Psychology", "French", "Spanish", "Sociology", "Business", "PE", "Music"]} website="https://aqa.org.uk" />
            <ExamBoardCard name="OCR" fullName="Oxford, Cambridge and RSA Examinations" description="Part of the Cambridge Assessment group. Offers GCSEs, A-Levels, Cambridge Nationals (vocational), and Cambridge Technicals. Known for strong provision in Law, Philosophy, Classical subjects, and STEM." subjects={["Mathematics", "Sciences", "Computer Science", "History", "English", "Law", "Philosophy", "Classical Civilisation", "Latin", "Media Studies", "Cambridge Nationals"]} website="https://ocr.org.uk" />
            <ExamBoardCard name="Pearson Edexcel" fullName="Pearson Education (Edexcel)" description="Part of Pearson plc. Offers GCSEs, International GCSEs (IGCSEs), A-Levels, and BTEC vocational qualifications widely used in colleges." subjects={["Mathematics", "Sciences", "English", "History", "Geography", "Business", "Economics", "BTECs", "International GCSEs", "Drama", "Statistics"]} website="https://qualifications.pearson.com" />
            <ExamBoardCard name="WJEC" fullName="Welsh Joint Education Committee / Eduqas" description="Wales's national awarding body. WJEC offers qualifications in Wales, while Eduqas offers qualifications in England. Strong in Welsh language, Film Studies, and Media Studies." subjects={["Welsh Language", "English", "Mathematics", "Sciences", "History", "Film Studies", "Media Studies", "Religious Studies", "Art & Design", "Drama", "Music", "Law"]} website="https://wjec.co.uk" />
            <ExamBoardCard name="Cambridge" fullName="Cambridge Assessment International Education" description="Offers the internationally recognised Cambridge IGCSE and Cambridge International AS and A-Levels. Used by international schools and some independent schools in the UK." subjects={["Mathematics", "Sciences", "English", "Languages", "Humanities", "Business Studies", "Computer Science", "Cambridge Pre-U"]} website="https://cambridgeinternational.org" />
            <ExamBoardCard name="CCEA" fullName="Council for Curriculum, Examinations and Assessment" description="The statutory body responsible for the curriculum, examinations, and assessment in Northern Ireland. Sets its own GCSEs and A-Levels for Northern Irish schools." subjects={["All GCSEs and A-Levels", "Essential Skills", "Northern Ireland specific qualifications"]} website="https://ccea.org.uk" />
          </div>
          <div className="mt-6 p-5 rounded-xl border bg-muted/30">
            <p className="font-semibold text-foreground mb-2">How schools choose exam boards</p>
            <p className="text-sm text-muted-foreground">Schools typically register with 1–3 exam boards and may use different boards for different subjects. The content within a subject can vary significantly between boards — so it is worth checking which board your school uses before choosing revision resources.</p>
          </div>
        </section>
      )}

      {/* ── HIGHER EDUCATION ──────────────────────────────────────────────── */}
      {isScotland ? (
        <ScotlandHigherEducationSection />
      ) : (
        <section className="mb-16">
          <SectionHeading
            icon={<GraduationCap className="w-6 h-6" />}
            title="Higher Education (HE)"
            subtitle="University degrees and advanced study from age 18"
          />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>The UK has over <strong className="text-foreground">160 universities</strong> and higher education institutions, regulated by the <strong className="text-foreground">Office for Students (OfS)</strong> in England.</p>
              <p>Most undergraduate degrees are <strong className="text-foreground">three years</strong> in England (four in Scotland). Students apply through <strong className="text-foreground">UCAS</strong>, typically in Year 13 with up to 5 choices.</p>
              <div className="p-4 rounded-xl bg-muted/50 space-y-2">
                <p className="font-semibold text-foreground">Types of UK Universities</p>
                {[
                  { name: "Russell Group (24 universities)", desc: "Research-intensive, high-ranking. Includes Oxford, Cambridge, Imperial, LSE, UCL, Edinburgh, Manchester." },
                  { name: "Post-1992 Universities", desc: "Former polytechnics, often more vocational and teaching-focused." },
                  { name: "Specialist Institutions", desc: "Conservatoires, art schools, agricultural colleges, and theological colleges." },
                  { name: "Online/Distance", desc: "Open University offers degrees part-time and online." },
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
                  <p className="text-xs mt-2 text-amber-700 bg-amber-50 p-2 rounded-lg">Scottish students studying in Scotland pay no tuition fees. Welsh and Northern Irish students have different schemes.</p>
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
      )}

      {/* ── FURTHER EDUCATION ─────────────────────────────────────────────── */}
      {isScotland ? (
        <ScotlandFurtherEducationSection />
      ) : (
        <section className="mb-16">
          <SectionHeading
            icon={<Briefcase className="w-6 h-6" />}
            title="Further Education (FE)"
            subtitle="Colleges, apprenticeships, and vocational routes"
          />
          <div className="prose prose-slate max-w-none text-muted-foreground mb-6">
            <p><strong className="text-foreground">Further Education</strong> refers to post-16 education that is not at degree level, delivered primarily through FE colleges, sixth form colleges, and independent training providers. England has around <strong className="text-foreground">240 general FE colleges</strong>, overseen by the <strong className="text-foreground">Education and Skills Funding Agency (ESFA)</strong>.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "General FE Colleges", icon: <Building2 className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50", border: "border-blue-200", points: ["Offer A-Levels, T-Levels, BTECs, and HNCs", "Typically larger and more diverse than school sixth forms", "Adult education and community learning", "Entry-level, Level 1 and Level 2 courses for school leavers without GCSEs", "Higher Education programmes (HNCs, HNDs, Foundation Degrees)"] },
              { title: "Apprenticeships", icon: <Briefcase className="w-5 h-5 text-orange-600" />, bg: "bg-orange-50", border: "border-orange-200", points: ["Level 2 (GCSE equivalent) to Level 7 (Master's equivalent)", "Funded by government Apprenticeship Levy", "Minimum 20% off-the-job training requirement", "Earn at least the National Minimum Wage", "Available in 700+ occupations"] },
              { title: "Higher Technical Qualifications (HTQs)", icon: <Award className="w-5 h-5 text-violet-600" />, bg: "bg-violet-50", border: "border-violet-200", points: ["Level 4 and 5 — between A-Levels and a full degree", "Employer-approved and occupationally specific", "HNCs (1 year) and HNDs (2 years)", "Delivered at colleges and some universities", "Can be studied alongside work"] },
            ].map(card => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className={`p-5 rounded-2xl border ${card.border} ${card.bg}`}>
                <div className="flex items-center gap-2 mb-4">{card.icon}<h4 className="font-bold text-foreground">{card.title}</h4></div>
                <ul className="space-y-2">{card.points.map(p => <li key={p} className="flex gap-2 text-sm text-muted-foreground"><ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />{p}</li>)}</ul>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── QUALIFICATIONS FRAMEWORK ──────────────────────────────────────── */}
      {isScotland ? (
        <ScotlandQualificationsSection />
      ) : (
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
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-8 text-primary-foreground text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          {isScotland ? "Ready to plan your Scottish pathway?" : "Ready to plan your next step?"}
        </h2>
        <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
          {isScotland
            ? "Use our personalised tool to find careers, institutions, and routes matched to your National 5s, Highers, and interests."
            : "Use our personalised recommendation tool to find the careers, institutions, and routes that best match your subjects, grades, and interests."}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/quiz" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary font-bold hover:bg-white/90 transition-colors">
            Get My Recommendations <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/subjects" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition-colors">
            {isScotland ? "Browse SQA Subjects" : "Browse Subjects"}
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
