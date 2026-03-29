import { useState } from "react";
import { useGetRoutes, GetRoutesAfterLevel } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Map, ArrowRight, CheckCircle, XCircle, Info, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNation, NATIONS } from "@/contexts/NationContext";

const ENGLAND_ONLY_ROUTES = ["T-Levels"];
const SCOTLAND_NOTE_ROUTES = ["Scottish Highers & Advanced Highers"];
const WALES_NOTE_ROUTES = ["Welsh Baccalaureate (WBQ)"];

function getNationBadge(routeName: string, nation: string | null) {
  if (ENGLAND_ONLY_ROUTES.some(r => routeName.includes(r))) {
    if (nation === "scotland" || nation === "northern-ireland") {
      return { label: "England & Wales only", color: "bg-orange-100 text-orange-700 border-orange-200" };
    }
    return { label: "England only", color: "bg-orange-100 text-orange-700 border-orange-200" };
  }
  if (SCOTLAND_NOTE_ROUTES.some(r => routeName.includes(r))) {
    return { label: "Scotland", color: "bg-teal-100 text-teal-700 border-teal-200" };
  }
  return null;
}

export default function Routes() {
  const { nation, openSelector } = useNation();
  const [activeTab, setActiveTab] = useState<GetRoutesAfterLevel>("GCSE");
  const { data: routes, isLoading } = useGetRoutes({ afterLevel: activeTab });
  const nationInfo = nation ? NATIONS.find(n => n.id === nation) : null;

  const tabs: { value: GetRoutesAfterLevel; label: string }[] = [
    { value: "GCSE", label: nation === "scotland" ? "After National 5" : "After GCSEs" },
    { value: "A-Level", label: nation === "scotland" ? "After Highers" : "After A-Levels" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
            <Map className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Compare Study Routes</h1>
          <p className="text-lg text-muted-foreground">
            Understand your options after your qualifications. From traditional academic paths to modern technical and vocational routes — across all four UK nations.
          </p>
        </div>

        {/* Nation banner */}
        {nationInfo ? (
          <div className="mb-8 flex items-center justify-between gap-3 px-5 py-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{nationInfo.flag}</span>
              <p className="text-sm font-semibold text-slate-800">
                Showing routes for <span className="text-primary">{nationInfo.label}</span>
                <span className="text-slate-500 font-normal"> — routes not available in your nation are flagged</span>
              </p>
            </div>
            <button onClick={openSelector} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors px-3 py-1.5 rounded-xl hover:bg-slate-50 shrink-0">
              <MapPin className="w-3.5 h-3.5" /> Change
            </button>
          </div>
        ) : (
          <div className="mb-8 flex items-center gap-3 px-5 py-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-sm max-w-3xl mx-auto">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-amber-800">
              <span className="font-semibold">Some routes are nation-specific.</span> Set your location and we'll flag what applies to you.
            </p>
            <button onClick={openSelector} className="ml-auto shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors">
              Set location
            </button>
          </div>
        )}

        {/* Scottish system explainer */}
        {nation === "scotland" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 px-6 py-5 bg-teal-50 border border-teal-200 rounded-2xl max-w-3xl mx-auto"
          >
            <p className="font-bold text-teal-900 mb-2 flex items-center gap-2">🏴󠁧󠁢󠁳󠁣󠁴󠁿 The Scottish Pathways</p>
            <p className="text-sm text-teal-800 leading-relaxed mb-3">
              Scotland's education system is distinct. The typical route is:
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
              <span className="px-3 py-1.5 bg-teal-100 text-teal-800 rounded-xl font-bold">National 5s (S4)</span>
              <ArrowRight className="w-4 h-4 text-teal-600" />
              <span className="px-3 py-1.5 bg-teal-100 text-teal-800 rounded-xl font-bold">Highers (S5)</span>
              <ArrowRight className="w-4 h-4 text-teal-600" />
              <span className="px-3 py-1.5 bg-teal-200 text-teal-900 rounded-xl font-bold">University / College</span>
            </div>
            <p className="text-xs text-teal-700 mt-3">
              Most Scottish universities require 4–5 Highers. Advanced Highers (S6) are taken for highly competitive courses (medicine, law, some English universities). Scottish students studying in Scotland do <strong>not</strong> pay tuition fees.
            </p>
          </motion.div>
        )}

        {/* Wales system note */}
        {nation === "wales" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 px-6 py-5 bg-green-50 border border-green-200 rounded-2xl max-w-3xl mx-auto"
          >
            <p className="font-bold text-green-900 mb-2">🏴󠁧󠁢󠁷󠁬󠁳󠁿 Routes in Wales</p>
            <p className="text-sm text-green-800 leading-relaxed">
              Welsh students follow a similar pathway to England, but with important differences. The <strong>Welsh Baccalaureate (WBQ)</strong> is offered by many schools alongside A-Levels and is accepted by most UK universities. T-Levels are being <strong>piloted in Wales</strong> but are not yet universally available. Most Welsh universities charge up to <strong>£9,535/year</strong>, with means-tested Welsh Government grants available.
            </p>
          </motion.div>
        )}

        {/* NI note */}
        {nation === "northern-ireland" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 px-6 py-5 bg-blue-50 border border-blue-200 rounded-2xl max-w-3xl mx-auto"
          >
            <p className="font-bold text-blue-900 mb-2">🇬🇧 Routes in Northern Ireland</p>
            <p className="text-sm text-blue-800 leading-relaxed">
              NI students take GCSEs and A-Levels like England but under <strong>CCEA</strong> specifications. T-Levels are <strong>not currently available</strong> in Northern Ireland. The <strong>BTEC</strong> and <strong>Apprenticeship</strong> routes are available. NI students studying at NI universities pay lower tuition fees (currently <strong>£4,760/year</strong>). Many students also choose universities in England, Scotland, or the Republic of Ireland.
            </p>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-200/50 p-1.5 rounded-2xl inline-flex relative">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`relative px-8 py-3 text-sm md:text-base font-bold rounded-xl transition-all duration-300 z-10 ${
                  activeTab === tab.value ? "text-primary" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {activeTab === tab.value && (
                  <motion.div
                    layoutId="routeTabBubble"
                    className="absolute inset-0 bg-white shadow-sm rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {routes?.map((route, idx) => {
                const badge = getNationBadge(route.name, nation);
                const isUnavailable = badge && (nation === "scotland" || nation === "northern-ireland") && ENGLAND_ONLY_ROUTES.some(r => route.name.includes(r));
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    key={route.id}
                    className={`bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 border flex flex-col ${isUnavailable ? "border-orange-200 opacity-75" : "border-slate-100"}`}
                  >
                    <div className="mb-6">
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider inline-block">
                          {route.duration}
                        </span>
                        {badge && (
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${badge.color} shrink-0`}>
                            {badge.label}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">{route.name}</h3>
                      <p className="text-primary font-medium text-sm">{route.type}</p>
                    </div>

                    {isUnavailable && (
                      <div className="mb-4 px-3 py-2.5 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-800 font-medium">
                        ⚠️ T-Levels are <strong>not currently available</strong> in {nationInfo?.label}. Consider BTECs or Apprenticeships as alternatives.
                      </div>
                    )}

                    <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">
                      {route.description}
                    </p>

                    <div className="space-y-6 mb-8">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                          <CheckCircle className="w-4 h-4 text-green-700" /> Pros
                        </h4>
                        <ul className="space-y-2">
                          {route.pros?.map((pro, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-700 mt-1.5 shrink-0" /> {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                          <XCircle className="w-4 h-4 text-rose-400" /> Cons
                        </h4>
                        <ul className="space-y-2">
                          {route.cons?.map((con, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" /> {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Entry Requirements</p>
                      <p className="text-sm font-medium text-slate-800">{route.entryRequirements}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
