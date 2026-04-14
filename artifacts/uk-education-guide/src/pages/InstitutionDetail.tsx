import { useParams, Link } from "wouter";
import { useGetInstitutionById, useGetCareers } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  ArrowLeft, Building2, MapPin, GraduationCap, Star, Trophy,
  Globe, Users, CheckCircle2, BookOpen, Landmark, ExternalLink, Send
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function trackEvent(institutionId: number, eventType: "view" | "apply_click") {
  fetch(`${BASE}/api/institutions/${institutionId}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType }),
  }).catch(() => {});
}

export default function InstitutionDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: institution, isLoading, error } = useGetInstitutionById(Number(id));
  const { data: allCareers } = useGetCareers();

  useEffect(() => {
    if (institution?.id) trackEvent(institution.id, "view");
  }, [institution?.id]);

  if (isLoading) return <LoadingSpinner className="mt-32" />;
  if (error || !institution) return (
    <div className="text-center mt-32">
      <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-slate-700">Institution not found</h2>
      <Link href="/institutions" className="text-primary hover:underline mt-2 inline-block">Back to Institutions</Link>
    </div>
  );

  const relatedCareers = allCareers?.filter(c => (institution.relatedCareers as number[]).includes(c.id)) || [];
  const satisfaction = institution.studentSatisfaction ?? null;
  const satisfactionPct = satisfaction != null ? Math.round((satisfaction / 5) * 100) : 0;

  const typeColor = {
    University: "bg-primary/10 text-primary border-primary/20",
    Conservatoire: "bg-purple-50 text-purple-700 border-purple-200",
    College: "bg-rose-50 text-rose-700 border-rose-200",
    "Apprenticeship Provider": "bg-amber-50 text-amber-800 border-amber-200",
    Specialist: "bg-emerald-50 text-emerald-700 border-emerald-200",
  }[institution.type as string] ?? "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <div className="min-h-screen pb-24">

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-primary/80 text-white pt-16 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&h=600&fit=crop')] opacity-10 object-cover mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/institutions" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-10 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to institutions
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border ${typeColor}`}>
              {institution.type}
            </span>
            {institution.russellGroup && (
              <span className="px-4 py-1.5 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" /> Russell Group
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight">{institution.name}</h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-medium">
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {institution.city}, {institution.region}</span>
            <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> {institution.type}</span>
            {institution.ranking && (
              <span className="flex items-center gap-2"><Trophy className="w-4 h-4" /> UK Rank #{institution.ranking}</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {institution.ranking && (
            <div className="text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">UK Ranking</p>
              <p className="text-3xl font-display font-bold text-slate-900">#{institution.ranking}</p>
            </div>
          )}
          {satisfaction != null && (
            <div className="text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Student Satisfaction</p>
              <div className="flex items-center justify-center gap-1.5 text-amber-600 font-bold text-2xl">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                {satisfaction.toFixed(1)}<span className="text-sm font-normal text-slate-400">/5</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${satisfactionPct}%` }} />
              </div>
            </div>
          )}
          {institution.bursaries && (
            <div className="text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bursaries</p>
              <div className="flex items-center justify-center gap-1 text-green-700 font-bold text-sm mt-1">
                <CheckCircle2 className="w-5 h-5" /> Available
              </div>
            </div>
          )}
          {institution.internationalStudents && (
            <div className="text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">International</p>
              <div className="flex items-center justify-center gap-1 text-primary font-bold text-sm mt-1">
                <Globe className="w-5 h-5" /> Welcomed
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Landmark className="w-6 h-6 text-primary" /> About
              </h2>
              <p className="text-slate-600 leading-relaxed">{institution.description}</p>
            </motion.div>

            {/* Notable Subjects */}
            {institution.notableSubjects && (institution.notableSubjects as string[]).length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-primary" /> Notable Subjects
                </h2>
                <div className="flex flex-wrap gap-3">
                  {(institution.notableSubjects as string[]).map((subject) => (
                    <span key={subject} className="px-4 py-2 bg-primary/5 border border-primary/15 rounded-xl text-primary font-semibold text-sm">
                      {subject}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Facilities */}
            {institution.facilities && (institution.facilities as string[]).length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-primary" /> Facilities & Campus
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(institution.facilities as string[]).map((facility) => (
                    <div key={facility} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                      <span className="text-sm font-medium text-slate-700">{facility}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Related Careers */}
            {relatedCareers.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" /> Career Pathways
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedCareers.map((career) => (
                    <Link key={career.id} href={`/careers/${career.id}`}>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
                        <p className="font-bold text-slate-800 group-hover:text-primary transition-colors text-sm">{career.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{career.sector}</p>
                        <p className="text-xs font-semibold text-green-700 mt-2">
                          £{(career.averageSalaryMin / 1000).toFixed(0)}k – £{(career.averageSalaryMax / 1000).toFixed(0)}k
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column — Sidebar */}
          <div className="space-y-6">

            {/* Entry Requirements */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-accent" /> Entry Requirements
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">{institution.entryRequirements}</p>

              {institution.ucasPoints && (
                <div className="mt-6 bg-white/10 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Typical UCAS Points</p>
                  <p className="text-2xl font-display font-bold text-white">{institution.ucasPoints}</p>
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-5">
              <h3 className="text-xl font-bold">Quick Facts</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">Institution Type</span>
                  <span className="text-sm font-bold text-slate-800">{institution.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">Location</span>
                  <span className="text-sm font-bold text-slate-800">{institution.city}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">Region</span>
                  <span className="text-sm font-bold text-slate-800">{institution.region}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">Russell Group</span>
                  <span className={`text-sm font-bold ${institution.russellGroup ? "text-green-700" : "text-slate-400"}`}>
                    {institution.russellGroup ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">Bursaries</span>
                  <span className={`text-sm font-bold ${institution.bursaries ? "text-green-700" : "text-slate-400"}`}>
                    {institution.bursaries ? "Available" : "Not offered"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">International</span>
                  <span className={`text-sm font-bold ${institution.internationalStudents ? "text-green-700" : "text-slate-400"}`}>
                    {institution.internationalStudents ? "Accepted" : "UK only"}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply CTA — only for featured institutions with applyUrl */}
            {institution.featured && (institution as any).applyUrl && (
              <a
                href={(institution as any).applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent(institution.id, "apply_click")}
                className="flex items-center justify-center gap-3 w-full py-4 bg-accent text-white rounded-2xl font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/25"
              >
                <Send className="w-5 h-5" /> Apply Now
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
            )}

            {/* Official Website Link */}
            {institution.websiteUrl && (
              <a href={institution.websiteUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
                <Globe className="w-5 h-5" /> Visit Official Website
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
