import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, ExternalLink, Calendar, PoundSterling, GraduationCap, Building2, ChevronRight } from "lucide-react";
import { useGetInstitutions } from "@workspace/api-client-react";

const getTypeStyles = (type: string) => ({
  "University": "bg-blue-100 text-blue-700 border-blue-200",
  "Conservatoire": "bg-purple-100 text-purple-700 border-purple-200",
  "College": "bg-rose-50 text-rose-700 border-rose-200",
  "Apprenticeship Provider": "bg-amber-50 text-amber-800 border-amber-200",
  "Specialist": "bg-emerald-50 text-emerald-700 border-emerald-200",
}[type] ?? "bg-slate-100 text-slate-700 border-slate-200");

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function daysUntil(iso: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatFee(fee: number | null | undefined, type: string): string {
  if (type === "Apprenticeship Provider") return "Earn while you learn";
  if (fee === 0) return "Free (16-19 funded)";
  if (!fee) return "See website";
  return `£${fee.toLocaleString()}/yr`;
}

export function RecruitmentAlerts() {
  const [open, setOpen] = useState(false);
  const { data: institutions = [], isLoading } = useGetInstitutions({}, { query: { enabled: open } } as any);

  const today = new Date().toISOString().slice(0, 10);
  const hasUpcoming = institutions.some(i => (i.openDayDates as string[]).some(d => d >= today));

  const panel = (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
          />

          {/* Slide-in Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 w-[min(520px,100vw)] bg-white shadow-2xl z-[9999] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg leading-tight">Recruitment Alerts</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Open days, fees &amp; application deadlines</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary bar */}
            <div className="px-6 py-3 bg-slate-50 border-b flex items-center gap-6 shrink-0 text-sm">
              <div className="flex items-center gap-1.5 text-slate-600">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span><strong className="text-slate-900">{institutions.length}</strong> institutions</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Calendar className="w-4 h-4 text-primary" />
                <span><strong className="text-slate-900">{institutions.filter(i => (i.openDayDates as string[]).some(d => d >= today)).length}</strong> upcoming open days</span>
              </div>
            </div>

            {/* Institution List */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {institutions.map((inst) => {
                    const dates = (inst.openDayDates as string[]) ?? [];
                    const nextDate = dates.find(d => d >= today);
                    const days = nextDate ? daysUntil(nextDate) : null;
                    const isUrgent = days !== null && days <= 14;
                    const isSoon = days !== null && days <= 60;

                    return (
                      <li key={inst.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                        {/* Top row: name + type */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getTypeStyles(inst.type)}`}>
                                {inst.type}
                              </span>
                              {isUrgent && (
                                <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full animate-pulse">
                                  Urgent
                                </span>
                              )}
                              {isSoon && !isUrgent && (
                                <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                                  Coming soon
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm leading-snug">{inst.name}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{inst.city}</p>
                          </div>
                          {inst.websiteUrl && (
                            <a
                              href={inst.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>

                        {/* Info grid */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* Fees */}
                          <div className="bg-slate-50 rounded-xl p-3">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <PoundSterling className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">UK Fees</span>
                            </div>
                            <p className="text-sm font-bold text-slate-800">{formatFee(inst.annualFees, inst.type)}</p>
                            {inst.internationalFees && inst.type !== "Apprenticeship Provider" && (
                              <p className="text-xs text-slate-500 mt-0.5">Int'l: £{inst.internationalFees.toLocaleString()}/yr</p>
                            )}
                          </div>

                          {/* Next open day */}
                          <div className={`rounded-xl p-3 ${isUrgent ? "bg-red-50" : isSoon ? "bg-amber-50" : "bg-slate-50"}`}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Calendar className={`w-3.5 h-3.5 ${isUrgent ? "text-red-400" : isSoon ? "text-amber-400" : "text-slate-400"}`} />
                              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Next Open Day</span>
                            </div>
                            {nextDate ? (
                              <>
                                <p className={`text-sm font-bold ${isUrgent ? "text-red-700" : isSoon ? "text-amber-700" : "text-slate-800"}`}>
                                  {formatDate(nextDate)}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {days === 0 ? "Today!" : days === 1 ? "Tomorrow" : `In ${days} days`}
                                </p>
                              </>
                            ) : (
                              <p className="text-sm font-bold text-slate-500">See website</p>
                            )}
                          </div>
                        </div>

                        {/* Deadline row */}
                        {inst.applicationDeadline && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>
                              <span className="font-semibold">Apply by:</span> {inst.applicationDeadline}
                              {inst.applicationsOpen && (
                                <span className="text-slate-400"> · Opens {inst.applicationsOpen}</span>
                              )}
                            </span>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t bg-slate-50 text-center shrink-0">
              <p className="text-xs text-slate-400">Dates are indicative — always check institution websites for confirmed schedules</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(true)}
        className="relative p-2.5 rounded-xl hover:bg-slate-100 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Recruitment alerts"
      >
        <Bell className="w-5 h-5" />
        {hasUpcoming && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>

      {/* Portal: renders at document.body, escaping the navbar stacking context */}
      {createPortal(panel, document.body)}
    </>
  );
}
