import { Link } from "wouter";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="bg-primary p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-2xl text-white tracking-tight">
                UK EdGuide
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Empowering school leavers with the data and insights they need to make confident choices about their future education and careers.
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
              <li><a href="#" className="hover:text-primary transition-colors">Grade Calculator (Coming Soon)</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">UCAS Tariff Guide</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} UK EdGuide. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
