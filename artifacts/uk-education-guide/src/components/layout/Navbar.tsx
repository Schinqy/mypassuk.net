import { Link, useLocation } from "wouter";
import { GraduationCap, Map, BookOpen, Briefcase, Building2, Menu, X, Newspaper, ChevronRight, CalendarDays, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RecruitmentAlerts } from "@/components/RecruitmentAlerts";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Exam Prep", href: "/subjects", icon: BookOpen },
    { name: "Careers", href: "/careers", icon: Briefcase },
    { name: "Institutions", href: "/institutions", icon: Building2 },
    { name: "Routes", href: "/routes", icon: Map },
    { name: "Study Plan", href: "/timetable", icon: CalendarDays, badge: "New" },
    { name: "Find Tutors", href: "/tutors", icon: Users },
    { name: "About UK Education", href: "/editorial", icon: Newspaper },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Thicker gradient accent stripe */}
      <div className="h-[3px] bg-gradient-to-r from-accent via-primary to-accent" />

      <div className="bg-[hsl(43,30%,97%)]/95 backdrop-blur-xl border-b border-[hsl(43,18%,88%)] shadow-sm shadow-slate-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative">
                {/* Soft glow halo behind icon */}
                <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md scale-125 group-hover:bg-primary/35 group-hover:scale-150 transition-all duration-300" />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center shadow-md shadow-primary/30 group-hover:scale-105 transition-transform duration-200">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                <span className="text-slate-800">UK Ed</span>
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, hsl(224,76%,28%) 0%, hsl(354,72%,40%) 100%)" }}
                >
                  Guide
                </span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = location.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative group/nav flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-b from-primary/12 to-primary/5 text-primary font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/80"
                    }`}
                  >
                    <item.icon
                      className={`w-3.5 h-3.5 shrink-0 transition-colors duration-200 ${
                        isActive ? "text-primary" : "text-slate-400 group-hover/nav:text-slate-500"
                      }`}
                    />
                    <span>{item.name}</span>

                    {"badge" in item && item.badge && (
                      <span className="relative ml-0.5 px-1.5 py-0.5 text-white text-[10px] font-bold rounded-full leading-none bg-accent overflow-hidden">
                        <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-50" />
                        <span className="relative">{item.badge}</span>
                      </span>
                    )}

                    {/* Gradient underline — glows on active, fades in on hover */}
                    <span
                      className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full transition-all duration-200 ${
                        isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover/nav:opacity-30"
                      }`}
                      style={{ backgroundImage: "linear-gradient(90deg, hsl(224,76%,28%), hsl(354,72%,40%))" }}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-2">
              <RecruitmentAlerts />

              {/* Gradient-fade divider */}
              <div className="w-px h-6 mx-1" style={{ background: "linear-gradient(to bottom, transparent, hsl(220,13%,80%), transparent)" }} />

              {/* Pricing — gradient-bordered pill */}
              <Link
                href="/pricing"
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 group/pricing overflow-hidden ${
                  location.startsWith("/pricing")
                    ? "text-amber-700"
                    : "text-amber-600 hover:text-amber-700"
                }`}
              >
                {/* Border via box-shadow + pseudo inner bg */}
                <span className="absolute inset-0 rounded-lg border border-amber-300/70 group-hover/pricing:border-amber-400 bg-gradient-to-br from-amber-50/80 to-orange-50/60 transition-all duration-200" />
                <Sparkles className="relative w-3.5 h-3.5" />
                <span className="relative">Pricing</span>
              </Link>

              {/* CTA — crimson-to-navy gradient with shimmer */}
              <Link
                href="/quiz"
                className="group relative inline-flex items-center gap-1.5 px-5 py-2 rounded-xl font-bold text-sm text-white overflow-hidden shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                style={{ background: "linear-gradient(135deg, hsl(224,76%,28%) 0%, hsl(224,76%,22%) 50%, hsl(354,72%,36%) 100%)" }}
              >
                {/* Shimmer sweep */}
                <span className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg]" />
                <span className="relative">Get Recommendations</span>
                <ChevronRight className="relative w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden bg-white border-b border-slate-200 shadow-xl shadow-slate-900/10"
          >
            <nav className="flex flex-col px-4 py-4 gap-1">
              {navItems.map((item) => {
                const isActive = location.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-primary/12 to-primary/5 text-primary font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-slate-400"}`} />
                    {item.name}
                    {"badge" in item && item.badge && (
                      <span className="relative px-1.5 py-0.5 bg-accent text-white text-[10px] font-bold rounded-full leading-none overflow-hidden">
                        <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-50" />
                        <span className="relative">{item.badge}</span>
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="pt-3 mt-2 border-t border-slate-100 space-y-2">
                <Link
                  href="/pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-amber-700 border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 hover:border-amber-300 transition-colors"
                >
                  <Sparkles className="w-4 h-4" /> Pricing & Plans
                </Link>
                <Link
                  href="/quiz"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-white shadow-md shadow-primary/20"
                  style={{ background: "linear-gradient(135deg, hsl(224,76%,28%) 0%, hsl(354,72%,36%) 100%)" }}
                >
                  Get Recommendations
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
