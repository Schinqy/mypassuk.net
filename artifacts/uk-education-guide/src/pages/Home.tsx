import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Briefcase, Building2, Map, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] z-0 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-8">
                <Sparkles className="w-4 h-4" />
                Your future, decoded.
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6">
                Navigate your <br />
                <span className="text-gradient">education journey</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
                The ultimate data-driven guide for UK school leavers. Prepare for exams, discover careers, and find the perfect university or college route tailored to you.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/quiz"
                  className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: "linear-gradient(135deg, hsl(224,76%,28%) 0%, hsl(224,76%,40%) 100%)" }}
                >
                  <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                  Find My Path <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/subjects"
                  className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-white text-slate-700 border border-slate-200 hover:border-primary/40 hover:text-primary hover:bg-primary/5 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Exam Resources
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors duration-200 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-6 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> GCSE & A-Level Data</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> 69 Career Guides</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl rounded-full" />
              <img 
                src={`${import.meta.env.BASE_URL}images/hero-academic.png`} 
                alt="Modern academic illustration" 
                className="w-full h-auto relative z-10 drop-shadow-2xl rounded-3xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/40 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-muted-foreground text-lg">We've consolidated data from across the UK education system to give you clear, actionable guidance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Exam Preparation",
                desc: "Study tips, key topics, and resources for every GCSE and A-Level subject.",
                icon: BookOpen,
                href: "/subjects",
                color: "bg-blue-100 text-blue-800"
              },
              {
                title: "Career Explorer",
                desc: "Discover salaries, required qualifications, and outlooks for hundreds of jobs.",
                icon: Briefcase,
                href: "/careers",
                color: "bg-green-100 text-green-800"
              },
              {
                title: "Institutions",
                desc: "Filter and find Universities, Colleges, and Apprenticeship providers.",
                icon: Building2,
                href: "/institutions",
                color: "bg-purple-100 text-purple-600"
              },
              {
                title: "Study Routes",
                desc: "Compare T-Levels, BTECs, A-Levels and understand the pros and cons of each.",
                icon: Map,
                href: "/routes",
                color: "bg-orange-100 text-orange-600"
              }
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={feature.href}>
                  <div className="glass-card p-8 rounded-2xl h-full flex flex-col items-start cursor-pointer group">
                    <div className={`p-4 rounded-xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground flex-grow mb-6">{feature.desc}</p>
                    <span className="text-primary font-semibold flex items-center gap-2 mt-auto group-hover:gap-3 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Callout */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-foreground rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/40 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/30 blur-3xl rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
            
            <div className="relative z-10 max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Not sure where to start?</h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Take our 2-minute personalized quiz. Enter your subjects, predicted grades, and interests to get AI-matched career and study route recommendations.
              </p>
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-accent text-white hover:bg-red-700 hover:-translate-y-1 shadow-lg shadow-accent/20 transition-all duration-300"
              >
                Start the Quiz <Sparkles className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="relative z-10 hidden md:block w-1/3">
               <img 
                src={`${import.meta.env.BASE_URL}images/career-path.png`} 
                alt="Career Path" 
                className="w-full h-auto drop-shadow-2xl rounded-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
