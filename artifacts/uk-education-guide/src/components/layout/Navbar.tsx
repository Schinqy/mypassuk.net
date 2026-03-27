import { Link, useLocation } from "wouter";
import { GraduationCap, Map, BookOpen, Briefcase, Building2, Menu, X, Newspaper } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Exam Prep", href: "/subjects", icon: BookOpen },
    { name: "Careers", href: "/careers", icon: Briefcase },
    { name: "Institutions", href: "/institutions", icon: Building2 },
    { name: "Routes", href: "/routes", icon: Map },
    { name: "About UK Education", href: "/editorial", icon: Newspaper },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary/10 p-2.5 rounded-xl group-hover:bg-primary/20 transition-colors">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              UK Ed<span className="text-primary">Guide</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                  {item.name}
                </Link>
              );
            })}
            <Link
              href="/quiz"
              className="ml-4 px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Get Recommendations
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <nav className="flex flex-col px-4 py-6 gap-4">
              {navItems.map((item) => {
                const isActive = location.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-slate-50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
              <Link
                href="/quiz"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-primary text-primary-foreground"
              >
                Get Recommendations
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
