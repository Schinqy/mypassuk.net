import { useParams, Link } from "wouter";
import { useGetCareerById } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ArrowLeft, Briefcase, PoundSterling, TrendingUp, MapPin, GraduationCap, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const SECTOR_IMAGES: Record<string, string> = {
  Healthcare: "sector-healthcare.jpg",
  Technology: "sector-technology.jpg",
  Engineering: "sector-engineering.jpg",
  Science: "sector-science.jpg",
  Law: "sector-law.jpg",
  Finance: "sector-law.jpg",
  Business: "sector-law.jpg",
  Education: "sector-education.jpg",
  "Creative Arts": "sector-creative.jpg",
  "Public Services": "sector-education.jpg",
};

export default function CareerDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: career, isLoading, error } = useGetCareerById(Number(id));

  if (isLoading) return <LoadingSpinner className="mt-32" />;
  if (error || !career) return <div className="text-center mt-32 text-red-500 font-bold text-xl">Career not found</div>;

  const sectorImage = SECTOR_IMAGES[career.sector] ?? "students-studying.jpg";
  const base = import.meta.env.BASE_URL;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">

      {/* Hero */}
      <div className="bg-slate-900 text-white pt-16 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-800 z-0" />

        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/careers" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to careers
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: text */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-primary rounded-full text-xs font-bold tracking-wider uppercase">
                  {career.sector}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1 ${
                  career.jobOutlook === 'Excellent' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  career.jobOutlook === 'Good' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  <TrendingUp className="w-3.5 h-3.5" /> Outlook: {career.jobOutlook}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">{career.title}</h1>
              <p className="text-lg text-slate-300 leading-relaxed">
                {career.description}
              </p>
            </div>

            {/* Right: sector photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 blur-2xl rounded-3xl" />
              <img
                src={`${base}images/${sectorImage}`}
                alt={career.sector}
                className="relative z-10 w-full h-64 object-cover rounded-3xl shadow-2xl border border-white/10"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">

        {/* Salary Banner */}
        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center justify-around gap-6 mb-8">
           <div className="text-center md:text-left flex items-center gap-4">
             <div className="bg-emerald-100 p-4 rounded-2xl"><PoundSterling className="w-8 h-8 text-emerald-600" /></div>
             <div>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Average Salary Range</p>
               <p className="text-3xl font-display font-bold text-slate-900">£{(career.averageSalaryMin/1000).toFixed(0)}k - £{(career.averageSalaryMax/1000).toFixed(0)}k</p>
             </div>
           </div>
           <div className="h-px w-full md:w-px md:h-16 bg-slate-200" />
           <div className="text-center md:text-left flex items-center gap-4">
             <div className="bg-primary/10 p-4 rounded-2xl"><MapPin className="w-8 h-8 text-primary" /></div>
             <div>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Common Workplaces</p>
               <p className="text-lg font-medium text-slate-900">{career.workplaces?.[0] || 'Office based'} + more</p>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Main details) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-primary" /> Day in the life
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {career.dayInTheLife || "A typical day involves working with teams, analyzing data, and reporting directly to stakeholders..."}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-primary" /> Work Environments
              </h2>
              <div className="flex flex-wrap gap-3">
                {career.workplaces?.map(wp => (
                  <span key={wp} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
                    {wp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Requirements & Routes) */}
          <div className="space-y-8">
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl p-8 shadow-lg text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-accent" /> How to get there
              </h3>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Common Routes</h4>
                <ul className="space-y-3">
                  {career.entryRoutes?.map(route => (
                    <li key={route} className="flex items-start gap-2 text-slate-300 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0" /> {route}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Required Qualifications</h4>
                <div className="flex flex-col gap-2">
                  {career.requiredQualifications?.map(qual => (
                    <div key={qual} className="bg-white/10 p-3 rounded-lg text-sm font-medium">
                      {qual}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
