import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { useNation, NATIONS, Nation } from "@/contexts/NationContext";

export function NationSelectorModal() {
  const { showSelector, setNation, nation, closeSelector } = useNation();

  return (
    <AnimatePresence>
      {showSelector && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 16 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="px-8 pt-8 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(224,76%,28%), hsl(224,76%,42%))" }}>
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg leading-tight">Where are you studying?</h2>
                  <p className="text-xs text-slate-500">We'll tailor the content to your qualifications</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {NATIONS.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setNation(n.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                      nation === n.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-slate-200 hover:border-primary/40 bg-slate-50/50"
                    }`}
                  >
                    <span className="text-3xl leading-none">{n.flag}</span>
                    <div className="text-center">
                      <p className="font-bold text-slate-900 text-sm">{n.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{n.qualifications}</p>
                    </div>
                  </button>
                ))}
              </div>

              {nation && (
                <button
                  onClick={closeSelector}
                  className="mt-4 w-full text-xs text-slate-400 hover:text-slate-600 transition-colors py-1"
                >
                  Keep current selection
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
