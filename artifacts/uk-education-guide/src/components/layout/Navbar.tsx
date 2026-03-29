import { Link, useLocation } from "wouter";
import { Map, BookOpen, Briefcase, Building2, Menu, X, Newspaper, CalendarDays, Sparkles, Users, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RecruitmentAlerts } from "@/components/RecruitmentAlerts";
import { useNation, NATIONS } from "@/contexts/NationContext";
import { FlagSvg } from "@/components/FlagSvg";
import { useAuth } from "@workspace/replit-auth-web";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { nation, openSelector } = useNation();
  const nationInfo = nation ? NATIONS.find(n => n.id === nation) : null;
  const { user, isAuthenticated, login } = useAuth();

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
                <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md scale-125 group-hover:bg-primary/35 group-hover:scale-150 transition-all duration-300" />
                <div className="relative w-9 h-9 group-hover:scale-105 transition-transform duration-200">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="nb" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#1e3a8a"/>
                        <stop offset="100%" stopColor="#172562"/>
                      </linearGradient>
                    </defs>
                    <rect width="36" height="36" rx="8" fill="url(#nb)"/>
                    <rect width="36" height="36" rx="8" fill="white" fillOpacity="0.07"/>
                    {/* Mortarboard */}
                    <polygon points="18,6 30,12 18,18 6,12" fill="white" fillOpacity="0.95"/>
                    <path d="M10 14 L10 22 Q18 26 26 22 L26 14 Q18 18 10 14Z" fill="white" fillOpacity="0.82"/>
                    <line x1="30" y1="12" x2="30" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6"/>
                    <circle cx="30" cy="21.5" r="1.8" fill="white" fillOpacity="0.55"/>
                    {/* Crimson checkmark badge */}
                    <circle cx="27" cy="27" r="8" fill="#be123c"/>
                    <path d="M23 27 L26 30 L31.5 23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                <span className="text-slate-800">My</span>
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, hsl(224,76%,28%) 0%, hsl(224,76%,42%) 100%)" }}
                >
                  Pass
                </span>
                <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-black text-white rounded align-middle relative -top-0.5"
                  style={{ background: "linear-gradient(135deg, hsl(354,72%,40%), hsl(354,72%,32%))" }}>
                  UK
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
                      <span className="relative ml-0.5 inline-flex items-center">
                        <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-60" />
                        <span className="relative px-1.5 py-0.5 text-white text-[10px] font-bold rounded-full bg-accent leading-none">{item.badge}</span>
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
              {/* Nation pill */}
              <button
                onClick={openSelector}
                title="Change your nation"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 transition-all duration-200 border border-slate-200/60"
              >
                {nationInfo
                  ? <FlagSvg nation={nationInfo.id} className="w-7 h-5 rounded shadow-sm shrink-0" />
                  : <span className="text-base leading-none">🇬🇧</span>
                }
                <span className="hidden lg:inline">{nationInfo ? nationInfo.label : "Select nation"}</span>
              </button>

              <RecruitmentAlerts />

              {/* Account button */}
              {isAuthenticated ? (
                <Link
                  href="/account"
                  title="My Account"
                  className={`flex items-center justify-center w-8 h-8 rounded-full overflow-hidden ring-2 transition-all duration-200 ${
                    location.startsWith("/account") ? "ring-primary" : "ring-slate-200 hover:ring-primary/40"
                  }`}
                >
                  {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="Account" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-sm text-white"
                      style={{ background: "linear-gradient(135deg, hsl(224,76%,28%), hsl(354,72%,40%))" }}>
                      {(user?.firstName?.[0] ?? user?.email?.[0] ?? "U").toUpperCase()}
                    </div>
                  )}
                </Link>
              ) : (
                <button
                  onClick={login}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:text-primary hover:bg-primary/5 transition-all duration-200 border border-slate-200/80"
                >
                  <UserCircle2 className="w-4 h-4" />
                  Sign in
                </button>
              )}

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
                <span className="absolute inset-0 rounded-lg border border-amber-300/70 group-hover/pricing:border-amber-400 bg-gradient-to-br from-amber-50/80 to-orange-50/60 transition-all duration-200" />
                <Sparkles className="relative w-3.5 h-3.5" />
                <span className="relative">Pricing</span>
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
                {isAuthenticated ? (
                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all border border-slate-200"
                  >
                    {user?.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt="Account" className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <UserCircle2 className="w-5 h-5 text-slate-400" />
                    )}
                    My Account
                  </Link>
                ) : (
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); login(); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-600 border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <UserCircle2 className="w-4 h-4" /> Sign in
                  </button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
