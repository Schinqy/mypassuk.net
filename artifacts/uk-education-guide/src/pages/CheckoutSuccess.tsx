import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles, ArrowRight, Zap } from "lucide-react";

export default function CheckoutSuccess() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const userId = params.get("userId");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (userId) {
      localStorage.setItem("uk-edguide-user-id", userId);
      localStorage.setItem("uk-edguide-premium", "true");
    }
    const timer = setTimeout(() => setConfirmed(true), 600);
    return () => clearTimeout(timer);
  }, [userId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-bold mb-4">
            <Sparkles className="w-4 h-4" /> You're now Student Premium
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
            Welcome aboard!
          </h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Your 7-day free trial is active. You now have <strong>unlimited AI Study Assistant messages</strong>, unlimited Study Plans, and an ad-free experience. Enjoy!
          </p>

          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5 mb-8 text-left space-y-3">
            {[
              "Unlimited AI Study Assistant — ask anything, anytime",
              "Unlimited saved Study Plans",
              "Export your timetable as PDF",
              "Ad-free, distraction-free studying",
              "Early access to new features",
            ].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                {f}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/subjects">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
                Start studying <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/timetable">
              <button className="px-6 py-3 text-slate-700 font-bold rounded-xl border-2 border-slate-200 hover:border-primary/40 transition-colors">
                Build Study Plan
              </button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
