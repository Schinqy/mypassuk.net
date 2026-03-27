import { Link, useLocation } from "wouter";
import { GraduationCap, Map, BookOpen, Briefcase, Building2, Menu, X, Newspaper, ChevronRight, CalendarDays } from "lucide-react";
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
    { name: "About UK Education", href: "/editorial", icon: Newspaper },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Accent top line */}
      <div className="h-0.5 bg-gradient-to-r from-primary via-blue-400 to-accent" />

      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-sm shadow-slate-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md shadow-primary/30 group-hover:shadow-lg group-hover:shadow-primary/40 group-hover:scale-105 transition-all duration-200">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-slate-900">
                UK Ed<span className="text-primary">Guide</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <item.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-primary" : "text-slate-400"}`} />
                    {item.name}
                    {"badge" in item && item.badge && (
                      <span className="ml-0.5 px-1.5 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full leading-none">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-dot"
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right side: bell + CTA */}
            <div className="hidden md:flex items-center gap-2">
              <RecruitmentAlerts />

              <div className="w-px h-6 bg-slate-200 mx-1" />

              <Link
                href="/quiz"
                className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm text-white overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: "linear-gradient(135deg, hsl(226,71%,40%) 0%, hsl(226,71%,52%) 100%)" }}
              >
                {/* shimmer sweep */}
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                Get Recommendations
                <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
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
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-slate-400"}`} />
                    {item.name}
                    {"badge" in item && item.badge && (
                      <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full leading-none">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="pt-3 mt-2 border-t border-slate-100">
                <Link
                  href="/quiz"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-white"
                  style={{ background: "linear-gradient(135deg, hsl(226,71%,40%) 0%, hsl(226,71%,52%) 100%)" }}
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
