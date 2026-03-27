import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ArrowLeft className="w-8 h-8 text-slate-500" />
        </div>
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">
          No worries
        </h1>
        <p className="text-slate-600 mb-8">
          You haven't been charged. Come back whenever you're ready — the free tier is always available.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/pricing">
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
              <Sparkles className="w-4 h-4" /> View plans
            </button>
          </Link>
          <Link href="/">
            <button className="px-6 py-3 text-slate-700 font-bold rounded-xl border-2 border-slate-200 hover:border-primary/40 transition-colors">
              Go home
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
