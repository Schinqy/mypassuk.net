import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Building2, Search, MapPin, Star, GraduationCap, Filter } from "lucide-react";
import { useGetInstitutions, GetInstitutionsType } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";

export default function Institutions() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<GetInstitutionsType | "All">("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [russellGroupOnly, setRussellGroupOnly] = useState(false);

  const { data: institutions, isLoading } = useGetInstitutions();

  const regions = ["All", ...Array.from(new Set(institutions?.map(i => i.region) || []))];

  const filteredInstitutions = institutions?.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.city.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || i.type === typeFilter;
    const matchesRegion = regionFilter === "All" || i.region === regionFilter;
    const matchesRG = !russellGroupOnly || i.russellGroup === true;
    return matchesSearch && matchesType && matchesRegion && matchesRG;
  });

  if (isLoading) return <LoadingSpinner className="mt-32" />;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-primary rounded-3xl p-8 md:p-12 text-white mb-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop')] opacity-10 mix-blend-overlay object-cover" />
           <div className="relative z-10 max-w-2xl">
             <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Find Institutions</h1>
             <p className="text-primary-foreground/80 text-lg">
               Explore Universities, Colleges, and Apprenticeship providers across the UK. Compare entry requirements and find your fit.
             </p>
           </div>
           <div className="relative z-10 hidden md:block">
             <div className="w-32 h-32 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
               <Building2 className="w-16 h-16 text-white" />
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Filter className="w-5 h-5 text-primary" /> Filters</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Search Name or City</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Manchester..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-3 block">Institution Type</label>
                  <div className="flex flex-col gap-2">
                    {["All", "University", "College", "Apprenticeship Provider"].map(type => (
                      <button
                        key={type}
                        onClick={() => setTypeFilter(type as GetInstitutionsType | "All")}
                        className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          typeFilter === type 
                            ? "bg-primary/10 text-primary border border-primary/20" 
                            : "text-slate-600 hover:bg-slate-100 border border-transparent"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-3 block">Region</label>
                  <select 
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={russellGroupOnly}
                        onChange={(e) => setRussellGroupOnly(e.target.checked)}
                      />
                      <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                      <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">Russell Group Only</span>
                  </label>
                </div>

              </div>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-3">
            {!filteredInstitutions?.length ? (
              <EmptyState title="No institutions found" description="Adjust your filters to see more results." />
            ) : (
              <div className="flex flex-col gap-4">
                {filteredInstitutions.map((inst, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={inst.id}
                  >
                    <Link href={`/institutions/${inst.id}`}>
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-6 cursor-pointer group">
                        
                        {/* Imagined logo placeholder */}
                        <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                          <Building2 className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>

                        <div className="flex-grow">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{inst.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-slate-500 mt-1 font-medium">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {inst.city}, {inst.region}</span>
                                <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {inst.type}</span>
                              </div>
                            </div>
                            {inst.russellGroup && (
                              <span className="shrink-0 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                                Russell Group
                              </span>
                            )}
                          </div>
                          
                          <p className="text-slate-600 text-sm mt-4 line-clamp-2">{inst.description}</p>
                        </div>

                        <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 md:border-l border-slate-100 md:pl-6 shrink-0 md:w-40">
                          {inst.ranking && (
                            <div className="text-center">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">UK Rank</p>
                              <p className="text-2xl font-display font-bold text-slate-900">#{inst.ranking}</p>
                            </div>
                          )}
                          <div className="text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Satisfaction</p>
                            <div className="flex items-center justify-center gap-1 bg-amber-50 px-2 py-1 rounded-md text-amber-700 font-bold text-sm">
                              <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {inst.studentSatisfaction}%
                            </div>
                          </div>
                        </div>

                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
