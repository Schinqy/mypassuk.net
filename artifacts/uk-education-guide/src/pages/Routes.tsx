import { useState } from "react";
import { useGetRoutes, GetRoutesAfterLevel } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Map, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Routes() {
  const [activeTab, setActiveTab] = useState<GetRoutesAfterLevel>("GCSE");
  const { data: routes, isLoading } = useGetRoutes({ afterLevel: activeTab });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
            <Map className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Compare Study Routes</h1>
          <p className="text-lg text-muted-foreground">
            Understand your options after GCSEs or A-Levels. From traditional academic paths to modern technical and vocational qualifications.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-200/50 p-1.5 rounded-2xl inline-flex relative">
            {(["GCSE", "A-Level"] as GetRoutesAfterLevel[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-8 py-3 text-sm md:text-base font-bold rounded-xl transition-all duration-300 z-10 ${
                  activeTab === tab ? "text-primary" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="routeTabBubble"
                    className="absolute inset-0 bg-white shadow-sm rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                After {tab}s
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {routes?.map((route, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  key={route.id}
                  className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col"
                >
                  <div className="mb-6">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4 inline-block">
                      {route.duration}
                    </span>
                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">{route.name}</h3>
                    <p className="text-primary font-medium text-sm">{route.type}</p>
                  </div>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">
                    {route.description}
                  </p>

                  <div className="space-y-6 mb-8">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Pros
                      </h4>
                      <ul className="space-y-2">
                        {route.pros?.map((pro, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" /> {pro}
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
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
