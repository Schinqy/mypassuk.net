import { GraduationCap, BrainCircuit, Building2, Briefcase, Users, Star, BookOpen, CalendarDays } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-24 px-4">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 70% 30%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-semibold tracking-wide mb-6 border border-white/20">
            About MyPassUK
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-6">
            Your guide from exam prep<br className="hidden md:block" /> to a career you love
          </h1>
          <p className="text-white/75 text-lg leading-relaxed max-w-2xl mx-auto">
            MyPassUK brings together everything a UK student needs — structured revision, career clarity, and real university connections — in one trusted platform.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none text-foreground/80 space-y-5 leading-relaxed">
            <p>
              MyPassUK is a comprehensive UK education and career platform built to guide students from secondary school through to higher education and beyond. The platform supports learners preparing for <strong>GCSE, A-Level, Scottish Higher, and Welsh qualification examinations</strong>, offering structured subject guides, past-paper resources, and an AI-powered study assistant tailored specifically to the UK national curriculum.
            </p>
            <p>
              At its core, MyPassUK operates across three interconnected pillars: <strong>exam preparation</strong>, <strong>career discovery</strong>, and <strong>institution exploration</strong>. Students can browse a detailed catalogue of subjects, get on-demand tutoring and essay feedback from the AI study assistant, and generate personalised Pomodoro-based revision timetables that fit around their schedule.
            </p>
            <p>
              A curated careers database maps qualifications to over 150 professions — helping students connect what they study today to the work they want to do tomorrow. The institution directory spans <strong>287+ UK universities and colleges</strong>, complete with open day listings, entry requirements, and programme highlights.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 px-4 bg-muted/40 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl text-foreground mb-3">Who MyPassUK is built for</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Three groups, one platform — each finding exactly what they need.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: GraduationCap,
                title: "Secondary students (14–18)",
                color: "text-primary bg-primary/10 border-primary/20",
                points: [
                  "GCSE, A-Level, Scottish Higher & Welsh exam prep",
                  "AI study assistant for instant subject support",
                  "Personalised revision timetables",
                  "Subject-to-career pathways made clear",
                ],
              },
              {
                icon: Users,
                title: "Parents & guardians",
                color: "text-accent bg-accent/10 border-accent/20",
                points: [
                  "Trusted, curriculum-aligned study resources",
                  "Transparent university and college profiles",
                  "Open day calendar to plan campus visits",
                  "Career outcome data for informed decisions",
                ],
              },
              {
                icon: Building2,
                title: "Universities & colleges",
                color: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20",
                points: [
                  "Featured listings reaching high-intent applicants",
                  "Recruitment alert priority placement",
                  "Direct 'Apply Now' pathway on your profile",
                  "Real-time analytics: views & apply clicks",
                ],
              },
            ].map(({ icon: Icon, title, color, points }) => (
              <div key={title} className="bg-card border border-border rounded-2xl p-7 shadow-sm">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border mb-5 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-4">{title}</h3>
                <ul className="space-y-2.5">
                  {points.map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Star className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/60" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value at a Glance */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl text-foreground mb-3">What makes MyPassUK different</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Every feature is built around one question: what do UK students actually need to succeed?</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, label: "Exam prep across all UK nations", desc: "GCSE · A-Level · Scottish · Welsh" },
              { icon: BrainCircuit, label: "AI-powered study assistant", desc: "On-demand tutoring & feedback" },
              { icon: Building2, label: "287+ institutions", desc: "Universities & further ed colleges" },
              { icon: Briefcase, label: "150+ career profiles", desc: "Qualification → career pathways" },
              { icon: CalendarDays, label: "Open Days calendar", desc: "Plan campus visits with ease" },
              { icon: Star, label: "Recommendation quiz", desc: "Matched to your strengths" },
              { icon: Users, label: "Expert tutors directory", desc: "Vetted UK-based tutors" },
              { icon: GraduationCap, label: "Study planner", desc: "Pomodoro revision timetables" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center text-center p-5 rounded-2xl bg-muted/50 border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors">
                <Icon className="w-6 h-6 text-primary mb-3" />
                <p className="font-semibold text-sm text-foreground leading-snug mb-1">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl text-white mb-4">Ready to get started?</h2>
          <p className="text-white/75 mb-8 leading-relaxed">
            Join thousands of UK students using MyPassUK to revise smarter, explore careers, and find the right university — all in one place.
          </p>
          <a href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-2xl font-bold hover:bg-white/90 transition-colors shadow-lg">
            <GraduationCap className="w-5 h-5" /> Explore the platform
          </a>
        </div>
      </section>

    </div>
  );
}
