import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Filter, Search, GraduationCap } from "lucide-react";
import { useGetSubjects } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";

export default function Subjects() {
  const [levelFilter, setLevelFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  const { data: subjects, isLoading, error } = useGetSubjects();

  if (isLoading) return <LoadingSpinner className="mt-24" />;
  if (error) return <div className="text-center text-red-500 mt-24">Failed to load subjects</div>;

  const filteredSubjects = subjects?.filter((s) => {
    const matchesLevel = levelFilter === "All" || s.level === levelFilter || s.level === "Both";
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const base = import.meta.env.BASE_URL;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-10 bg-slate-900">
          <img
            src={`${base}images/students-studying.jpg`}
            alt="Students studying"
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-14">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-bold mb-5">
                <GraduationCap className="w-4 h-4" /> 55 Subjects
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Exam Preparation</h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                Detailed guides, study tips, and resources for GCSE and A-Level subjects to help you secure the top grades.
              </p>
            </div>
            <div className="hidden md:block shrink-0">
              <img
                src={`${base}images/students-studying.jpg`}
                alt="Students studying"
                className="w-52 h-36 object-cover rounded-2xl shadow-2xl border border-white/10 rotate-2"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Filter className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
            {["All", "GCSE", "A-Level"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                  levelFilter === lvl
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {!filteredSubjects?.length ? (
          <EmptyState title="No subjects found" description="Try adjusting your search or filters." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                key={subject.id}
              >
                <Link href={`/subjects/${subject.id}`}>
                  <div className="glass-card p-6 rounded-2xl h-full flex flex-col group cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        <BookOpen className="w-6 h-6 text-primary group-hover:text-white" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        subject.level === 'GCSE' ? 'bg-orange-100 text-orange-700' :
                        subject.level === 'A-Level' ? 'bg-purple-100 text-purple-700' :
                        'bg-indigo-100 text-indigo-700'
                      }`}>
                        {subject.level}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{subject.name}</h3>
                    <span className="text-sm font-medium text-slate-500 mb-4">{subject.category}</span>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                      {subject.description}
                    </p>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-auto">
                      <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-500 ease-out" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
