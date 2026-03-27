import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Briefcase, Search, PoundSterling, TrendingUp, Filter } from "lucide-react";
import { useGetCareers } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";

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

const SECTOR_COLORS: Record<string, string> = {
  Healthcare: "from-rose-500/30 to-pink-600/30",
  Technology: "from-blue-500/30 to-cyan-600/30",
  Engineering: "from-amber-500/30 to-orange-600/30",
  Science: "from-emerald-500/30 to-teal-600/30",
  Law: "from-slate-500/30 to-slate-700/30",
  Finance: "from-violet-500/30 to-purple-600/30",
  Business: "from-indigo-500/30 to-blue-600/30",
  Education: "from-sky-500/30 to-blue-600/30",
  "Creative Arts": "from-fuchsia-500/30 to-pink-600/30",
  "Public Services": "from-green-500/30 to-emerald-600/30",
};

export default function Careers() {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");

  const { data: careers, isLoading } = useGetCareers();
  const base = import.meta.env.BASE_URL;

  const sectors = ["All", ...Array.from(new Set(careers?.map(c => c.sector) || []))];

  const filteredCareers = careers?.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchesSector = sectorFilter === "All" || c.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  if (isLoading) return <LoadingSpinner className="mt-32" />;

  const formatSalary = (num: number) => `£${(num / 1000).toFixed(0)}k`;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-foreground mb-4">Career Explorer</h1>
            <p className="text-lg text-muted-foreground">
              Discover pathways, required qualifications, and real-world salary data for hundreds of professions across the UK.
            </p>
          </div>
          {/* Sector collage header strip */}
          <div className="hidden lg:flex gap-2 shrink-0">
            {["sector-healthcare.jpg", "sector-technology.jpg", "sector-engineering.jpg"].map((img, i) => (
              <img
                key={img}
                src={`${base}images/${img}`}
                alt="Sector preview"
                className={`w-20 h-14 object-cover rounded-xl shadow-md border border-white/40 ${i === 1 ? "-mt-3" : i === 2 ? "-mt-1" : ""}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-28">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Filter className="w-5 h-5 text-primary" /> Filters</h3>

              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Job title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 block">Sector</label>
                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2">
                  {sectors.map(sector => (
                    <button
                      key={sector}
                      onClick={() => setSectorFilter(sector)}
                      className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                        sectorFilter === sector
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-slate-600 hover:bg-slate-100 border border-transparent"
                      }`}
                    >
                      {sector !== "All" && SECTOR_IMAGES[sector] && (
                        <img
                          src={`${base}images/${SECTOR_IMAGES[sector]}`}
                          alt={sector}
                          className="w-6 h-6 rounded object-cover shrink-0"
                        />
                      )}
                      {sector}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="lg:col-span-3">
            {!filteredCareers?.length ? (
              <EmptyState title="No careers found" description="Adjust your filters to see more results." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCareers.map((career, idx) => {
                  const sectorImg = SECTOR_IMAGES[career.sector];
                  const gradientClass = SECTOR_COLORS[career.sector] ?? "from-slate-500/20 to-slate-600/20";
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      key={career.id}
                    >
                      <Link href={`/careers/${career.id}`}>
                        <div className="glass-card rounded-2xl h-full flex flex-col group cursor-pointer relative overflow-hidden">
                          {/* Card image strip */}
                          {sectorImg && (
                            <div className="relative h-28 overflow-hidden">
                              <img
                                src={`${base}images/${sectorImg}`}
                                alt={career.sector}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />
                              {career.jobOutlook === 'Excellent' && (
                                <div className="absolute top-2 right-2 bg-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 flex items-center gap-1 shadow-lg">
                                  <TrendingUp className="w-3 h-3" /> HIGH DEMAND
                                </div>
                              )}
                              <div className="absolute bottom-2 left-3">
                                <span className="text-[10px] font-bold text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-wider">
                                  {career.sector}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{career.title}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-grow">
                              {career.description}
                            </p>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                              <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                                <div className="bg-emerald-100 p-1.5 rounded-md"><PoundSterling className="w-4 h-4 text-emerald-600" /></div>
                                {formatSalary(career.averageSalaryMin)} - {formatSalary(career.averageSalaryMax)}
                              </div>
                              <span className="text-xs text-primary font-semibold group-hover:translate-x-1 transition-transform">View →</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
