import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, X, Sparkles, Building2, GraduationCap, Zap, Mail, Star } from "lucide-react";

const FREE_FEATURES = [
  "Browse all 267 institutions",
  "Explore 500+ careers & salaries",
  "Compare study routes (A-Levels, T-Levels, BTECs)",
  "Full GCSE & A-Level exam prep",
  "5 AI Study Assistant messages per day",
  "1 saved Study Plan",
  "Recruitment alerts & open days",
];

const FREE_NO = [
  "Unlimited AI Study Assistant",
  "Unlimited saved Study Plans",
  "Exportable PDF timetables",
  "Priority email support",
];

const PREMIUM_FEATURES = [
  "Everything in Free",
  "Unlimited AI Study Assistant messages",
  "Unlimited saved Study Plans",
  "Export Study Plans as PDF",
  "Ad-free experience",
  "Early access to new features",
  "Priority email support",
];

const INSTITUTION_FEATURES = [
  "Featured listing — appear at the top of all searches",
  "Enhanced profile with photos & open day highlights",
  "Recruitment alert priority placement",
  "Analytics dashboard — views & click-throughs",
  "Direct application CTA button on your profile",
  "Dedicated account manager",
  "Cancel anytime",
];

export default function Pricing() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 text-accent border border-accent/20 rounded-full text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4" /> Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            Choose your plan
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Start free. Upgrade when you need more. Institutions can reach thousands of prospective students.
          </p>
        </motion.div>

        {/* Student Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Free</h2>
                <p className="text-sm text-slate-500">For every student</p>
              </div>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-display font-bold text-slate-900">£0</span>
              <span className="text-slate-500 ml-1">/ month</span>
            </div>
            <Link href="/quiz">
              <button className="w-full py-3 rounded-xl font-bold text-primary border-2 border-primary hover:bg-primary/5 transition-colors mb-8">
                Get started free
              </button>
            </Link>
            <ul className="space-y-3">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-green-700 shrink-0 mt-0.5" /> {f}
                </li>
              ))}
              {FREE_NO.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-400">
                  <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary rounded-3xl p-8 shadow-xl shadow-primary/20 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 px-3 py-1 bg-accent rounded-full text-white text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" /> Most popular
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Student Premium</h2>
                <p className="text-sm text-white/70">Unlimited everything</p>
              </div>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-display font-bold text-white">£3.99</span>
              <span className="text-white/70 ml-1">/ month</span>
            </div>
            <button className="w-full py-3 rounded-xl font-bold bg-accent text-white hover:bg-red-700 transition-colors mb-2">
              Start 7-day free trial
            </button>
            <p className="text-white/50 text-xs text-center mb-8">No card required during trial</p>
            <ul className="space-y-3">
              {PREMIUM_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white">
                  <Check className="w-4 h-4 text-green-300 shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Institution Plan */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl border-2 border-amber-200 p-8 shadow-sm mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-slate-900">Institution Featured</h2>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">B2B</span>
                </div>
                <p className="text-sm text-slate-500">Reach thousands of prospective students actively choosing their path</p>
              </div>
            </div>
            <div className="shrink-0">
              <div className="text-right">
                <span className="text-3xl font-display font-bold text-slate-900">£99</span>
                <span className="text-slate-500 ml-1">/ month</span>
                <p className="text-xs text-slate-400 mt-1">Annual plan available — save 20%</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {INSTITUTION_FEATURES.map(f => (
              <div key={f} className="flex items-start gap-2.5 text-sm text-slate-700 bg-amber-50/60 border border-amber-100 rounded-xl p-3">
                <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> {f}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:partnerships@ukedguide.co.uk"
              className="flex-1 py-3 rounded-xl font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors text-center flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" /> Contact us to get listed
            </a>
            <Link href="/institutions">
              <button className="flex-1 py-3 rounded-xl font-bold text-slate-700 border-2 border-slate-200 hover:border-amber-300 transition-colors w-full">
                See example featured listings
              </button>
            </Link>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-8">Common questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
            {[
              { q: "Can I cancel anytime?", a: "Yes — no lock-ins. Cancel your Premium subscription from your account settings at any time." },
              { q: "Is my data safe?", a: "Your study plans are stored locally in your browser. We never sell personal data." },
              { q: "How does the free AI limit work?", a: "Free accounts get 5 AI Study Assistant messages per day, resetting at midnight. Premium removes all limits." },
              { q: "Can schools get a group licence?", a: "Yes. We offer multi-seat school licences for careers advisers. Email us for a bespoke quote." },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <p className="font-bold text-slate-900 mb-2">{q}</p>
                <p className="text-sm text-slate-600">{a}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
