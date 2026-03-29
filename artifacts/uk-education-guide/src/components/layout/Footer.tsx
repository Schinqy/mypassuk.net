import { Link } from "wouter";
import { FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <svg width="40" height="40" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="fbg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1e3a8a"/>
                    <stop offset="100%" stopColor="#172562"/>
                  </linearGradient>
                </defs>
                <rect width="36" height="36" rx="8" fill="url(#fbg)"/>
                <rect width="36" height="36" rx="8" fill="white" fillOpacity="0.07"/>
                <polygon points="18,6 30,12 18,18 6,12" fill="white" fillOpacity="0.95"/>
                <path d="M10 14 L10 22 Q18 26 26 22 L26 14 Q18 18 10 14Z" fill="white" fillOpacity="0.82"/>
                <line x1="30" y1="12" x2="30" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6"/>
                <circle cx="30" cy="21.5" r="1.8" fill="white" fillOpacity="0.55"/>
                <circle cx="27" cy="27" r="8" fill="#be123c"/>
                <path d="M23 27 L26 30 L31.5 23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-display font-bold text-2xl text-white tracking-tight">
                My<span style={{ background: "linear-gradient(135deg,#60a5fa,#93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Pass</span>
                <span className="ml-1 px-1.5 py-0.5 text-[11px] font-black text-white rounded align-middle relative -top-0.5"
                  style={{ background: "linear-gradient(135deg,hsl(354,72%,40%),hsl(354,72%,32%))" }}>UK</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Helping UK school leavers pass their exams and find their path — with expert guides, 287 institutions, 69 career profiles and AI-powered study tools.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-white mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="/subjects" className="hover:text-primary transition-colors">GCSE & A-Level Prep</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Career Explorer</Link></li>
              <li><Link href="/institutions" className="hover:text-primary transition-colors">Find Universities</Link></li>
              <li><Link href="/routes" className="hover:text-primary transition-colors">Study Routes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-6">Tools</h4>
            <ul className="space-y-4">
              <li><Link href="/quiz" className="hover:text-primary transition-colors">Recommendation Quiz</Link></li>
              <li><Link href="/timetable" className="hover:text-primary transition-colors">Study Planner</Link></li>
              <li><Link href="/tutors" className="hover:text-primary transition-colors">Find a Tutor</Link></li>
              <li><Link href="/open-days" className="hover:text-primary transition-colors">Open Days Calendar</Link></li>
              <li>
                <Link href="/flyer" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                  <FileText className="w-3.5 h-3.5" />
                  Advertising Flyer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} MyPassUK. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <Link href="/admin" className="text-slate-700 hover:text-slate-500 transition-colors text-xs">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
