import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Building2, Search, MapPin, Star, GraduationCap, Filter, Landmark, Users, Briefcase, Zap, Mail } from "lucide-react";
import { useGetInstitutions, GetInstitutionsType } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";

const TYPE_ICON = {
  University: Landmark,
  College: GraduationCap,
  "Apprenticeship Provider": Briefcase,
  Conservatoire: Users,
};

const TYPE_COLORS = {
  University: "bg-blue-100 text-blue-800 border-blue-200",
  College: "bg-rose-100 text-rose-700 border-rose-200",
  "Apprenticeship Provider": "bg-amber-100 text-amber-800 border-amber-200",
  Conservatoire: "bg-purple-100 text-purple-700 border-purple-200",
};

const TYPE_ICON_BG = {
  University: "bg-blue-50 text-blue-700",
  College: "bg-rose-50 text-rose-600",
  "Apprenticeship Provider": "bg-amber-50 text-amber-700",
  Conservatoire: "bg-purple-50 text-purple-500",
};

export default function Institutions() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<GetInstitutionsType | "All">("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [russellGroupOnly, setRussellGroupOnly] = useState(false);

  const { data: institutions, isLoading } = useGetInstitutions();
  const base = import.meta.env.BASE_URL;

  const regions = ["All", ...Array.from(new Set(institutions?.map(i => i.region).filter(Boolean) || []))].sort((a, b) => a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b));

  const cities = ["All", ...Array.from(new Set(
    institutions
      ?.filter(i => regionFilter === "All" || i.region === regionFilter)
      .map(i => i.city)
      .filter(c => c && c !== "Various") || []
  )).sort()];

  const filteredInstitutions = institutions?.filter(i => {
    const cityLower = (i.city || "").toLowerCase();
    const nameLower = (i.name || "").toLowerCase();
    const searchLower = search.toLowerCase().trim();
    const matchesSearch = !searchLower || nameLower.includes(searchLower) || cityLower.includes(searchLower);
    const matchesType = typeFilter === "All" || i.type === typeFilter;
    const matchesCity = cityFilter === "All" || (i.city || "") === cityFilter;
    const matchesRegion = regionFilter === "All" || i.region === regionFilter;
    const matchesRG = !russellGroupOnly || i.russellGroup === true;
    return matchesSearch && matchesType && matchesCity && matchesRegion && matchesRG;
  });

  const handleRegionChange = (region: string) => {
    setRegionFilter(region);
    setCityFilter("All");
  };

  if (isLoading) return <LoadingSpinner className="mt-32" />;

  const totalCount = institutions?.length ?? 0;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Banner */}
        <div className="bg-primary rounded-3xl mb-8 relative overflow-hidden">
          <img
            src={`${base}images/uni-campus.png`}
            alt="University campus"
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/40" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 text-white border border-white/20 rounded-full text-sm font-bold mb-5">
                <Building2 className="w-4 h-4" /> {totalCount} Institutions
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Find Institutions</h1>
              <p className="text-primary-foreground/80 text-lg">
                Explore Universities, Colleges, and Apprenticeship providers across the UK. Compare entry requirements and find your fit.
              </p>
            </div>
            <div className="hidden md:block shrink-0">
              <img
                src={`${base}images/uni-campus.png`}
                alt="University campus"
                className="w-56 h-36 object-cover rounded-2xl shadow-2xl border border-white/20 -rotate-2"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Filter className="w-5 h-5 text-primary" /> Filters</h3>

              <div className="space-y-6">
                {/* Name search */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Search by Name</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Manchester..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Institution Type */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-3 block">Institution Type</label>
                  <div className="flex flex-col gap-2">
                    {["All", "University", "College", "Apprenticeship Provider", "Conservatoire"].map(type => {
                      const Icon = type !== "All" ? (TYPE_ICON[type as keyof typeof TYPE_ICON] ?? Building2) : Building2;
                      return (
                        <button
                          key={type}
                          onClick={() => setTypeFilter(type as GetInstitutionsType | "All")}
                          className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                            typeFilter === type
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "text-slate-600 hover:bg-slate-100 border border-transparent"
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Region */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Region</label>
                  <select
                    value={regionFilter}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                {/* City dropdown */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> City
                  </label>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Russell Group */}
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

                {/* Active filter count */}
                {(search || typeFilter !== "All" || cityFilter !== "All" || regionFilter !== "All" || russellGroupOnly) && (
                  <button
                    onClick={() => { setSearch(""); setTypeFilter("All"); setCityFilter("All"); setRegionFilter("All"); setRussellGroupOnly(false); }}
                    className="w-full py-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors border border-slate-200 rounded-xl hover:border-primary/30"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-3">
            <div className="mb-4 text-sm text-slate-500 font-medium">
              Showing {filteredInstitutions?.length ?? 0} of {totalCount} institutions
            </div>
            {!filteredInstitutions?.length ? (
              <EmptyState title="No institutions found" description="Adjust your filters to see more results." />
            ) : (
              <div className="flex flex-col gap-4">
                {filteredInstitutions.map((inst, idx) => {
                  const Icon = TYPE_ICON[inst.type as keyof typeof TYPE_ICON] ?? Building2;
                  const iconBg = TYPE_ICON_BG[inst.type as keyof typeof TYPE_ICON_BG] ?? "bg-slate-50 text-slate-500";
                  const typeBadge = TYPE_COLORS[inst.type as keyof typeof TYPE_COLORS] ?? "bg-slate-50 text-slate-600 border-slate-200";
                  const isFeatured = inst.featured === true;
                  return (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                      key={inst.id}
                    >
                      <Link href={`/institutions/${inst.id}`}>
                        <div className={`bg-white p-6 rounded-2xl border hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-6 cursor-pointer group relative overflow-hidden ${isFeatured ? "border-amber-300 shadow-amber-100/60 shadow-md" : "border-slate-200 hover:border-primary/40"}`}>

                          {isFeatured && (
                            <div className="absolute top-0 right-0">
                              <div className="flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                                <Zap className="w-2.5 h-2.5 fill-white" /> FEATURED
                              </div>
                            </div>
                          )}

                          <div className={`w-16 h-16 shrink-0 rounded-xl flex items-center justify-center border ${isFeatured ? "border-amber-200 bg-amber-50 text-amber-700" : `border-slate-100 ${iconBg}`}`}>
                            <Icon className="w-8 h-8" />
                          </div>

                          <div className="flex-grow">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{inst.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1 font-medium flex-wrap">
                                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {inst.city}, {inst.region}</span>
                                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${typeBadge}`}>
                                    {inst.type}
                                  </span>
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
                            {inst.studentSatisfaction != null && (
                              <div className="text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Satisfaction</p>
                                <div className="flex items-center justify-center gap-1 bg-amber-50 px-2 py-1 rounded-md text-amber-700 font-bold text-sm">
                                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {inst.studentSatisfaction.toFixed(1)}/5
                                </div>
                              </div>
                            )}
                          </div>

                        </div>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Advertise CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
                      <Zap className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Is your institution listed here?</p>
                      <p className="text-sm text-slate-600">Get a featured listing and reach thousands of prospective students actively choosing their path.</p>
                    </div>
                  </div>
                  <Link href="/pricing">
                    <button className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors whitespace-nowrap">
                      <Mail className="w-4 h-4" /> Get Featured — £99/mo
                    </button>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
