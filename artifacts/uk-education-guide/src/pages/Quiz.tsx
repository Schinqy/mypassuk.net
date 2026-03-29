import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ArrowLeft, Loader2, Target, Sparkles, Building2, Map, CheckCircle, XCircle, ChevronDown, Search, X } from "lucide-react";
import { useGetSubjects, useGetRecommendations, QuizInputPreferredRouteType } from "@workspace/api-client-react";
import { Link } from "wouter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Subject {
  id: number;
  name: string;
  level: string;
  category: string;
}

// ─── Form Schema ──────────────────────────────────────────────────────────────

const gcseSchema = z.object({
  subjectId: z.coerce.number().min(1, "Select a subject"),
  grade: z.string().min(1, "Select a grade")
});

const formSchema = z.object({
  gcseSubjects: z.array(gcseSchema).min(1, "Add at least one subject"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  preferredRegion: z.string().optional(),
  preferredRouteType: z.nativeEnum(QuizInputPreferredRouteType).default("Any"),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const GRADES = ["9", "8", "7", "6", "5", "4", "3", "2", "1", "U"];
const INTERESTS = [
  "Technology & Coding", "Healthcare & Medicine", "Creative Arts",
  "Business & Finance", "Engineering & Math", "Social Sciences",
  "Law & Order", "Environment & Nature", "Education & Teaching"
];
const REGIONS = [
  "London", "South East", "South West", "Midlands", "North West",
  "North East", "Yorkshire", "East of England", "Wales", "Scotland"
];

const LEVEL_STYLES: Record<string, string> = {
  "GCSE":    "bg-blue-100 text-blue-700",
  "A-Level": "bg-violet-100 text-violet-700",
  "Both":    "bg-emerald-100 text-emerald-700",
};

const LEVEL_LABEL: Record<string, string> = {
  "GCSE":    "GCSE",
  "A-Level": "A-Level",
  "Both":    "GCSE & A-Level",
};

// ─── Searchable Subject Picker ────────────────────────────────────────────────

function SubjectPicker({
  value,
  onChange,
  subjects,
  error,
}: {
  value: number;
  onChange: (id: number) => void;
  subjects: Subject[];
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = subjects.find(s => s.id === value);

  const filtered = search.trim()
    ? subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()))
    : subjects;

  const grouped = filtered.reduce<Record<string, Subject[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const sortedCategories = Object.keys(grouped).sort();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSelect = (id: number) => {
    onChange(id);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className={`w-full p-3 bg-slate-50 border rounded-xl flex items-center justify-between text-left transition-colors ${
          error ? "border-red-300 focus:ring-red-200" : "border-slate-200 hover:border-primary/40"
        } ${open ? "ring-2 ring-primary/20 border-primary/40" : ""}`}
      >
        {selected ? (
          <span className="flex items-center gap-2.5 min-w-0">
            <span className="text-slate-900 font-medium truncate">{selected.name}</span>
            <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${LEVEL_STYLES[selected.level] ?? "bg-slate-100 text-slate-600"}`}>
              {LEVEL_LABEL[selected.level] ?? selected.level}
            </span>
          </span>
        ) : (
          <span className="text-slate-400">Select subject...</span>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/60 overflow-hidden"
          >
            {/* Search bar */}
            <div className="p-2.5 border-b border-slate-100 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search all subjects..."
                className="flex-1 text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Subject count */}
            <div className="px-3 py-1.5 text-[10px] text-slate-400 font-medium bg-slate-50/70 border-b border-slate-100">
              {filtered.length} subject{filtered.length !== 1 ? "s" : ""} · grouped by category
            </div>

            {/* Subject list */}
            <div className="overflow-y-auto max-h-64">
              {sortedCategories.length === 0 ? (
                <div className="px-4 py-8 text-sm text-slate-400 text-center">No subjects match "{search}"</div>
              ) : (
                sortedCategories.map(cat => (
                  <div key={cat}>
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 sticky top-0 border-b border-slate-100/60">
                      {cat}
                    </div>
                    {grouped[cat].sort((a, b) => a.name.localeCompare(b.name)).map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelect(s.id)}
                        className={`w-full px-3 py-2.5 text-left flex items-center justify-between gap-3 hover:bg-primary/5 transition-colors ${
                          s.id === value ? "bg-primary/10" : ""
                        }`}
                      >
                        <span className={`text-sm ${s.id === value ? "text-primary font-semibold" : "text-slate-700"}`}>
                          {s.name}
                        </span>
                        <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${LEVEL_STYLES[s.level] ?? "bg-slate-100 text-slate-600"}`}>
                          {LEVEL_LABEL[s.level] ?? s.level}
                        </span>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ─── Main Quiz Component ──────────────────────────────────────────────────────

export default function Quiz() {
  const [step, setStep] = useState(1);
  const { data: allSubjects = [] } = useGetSubjects();
  const { mutate: getRecs, data: results, isPending } = useGetRecommendations();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gcseSubjects: [{ subjectId: 0, grade: "" }],
      interests: [],
      preferredRouteType: "Any",
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "gcseSubjects"
  });

  const nextStep = async () => {
    let valid = false;
    if (step === 1) valid = await form.trigger("gcseSubjects");
    if (step === 2) valid = await form.trigger("interests");
    if (valid) setStep(s => s + 1);
  };

  const onSubmit = (data: FormValues) => {
    getRecs({ data });
    setStep(4);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-10">
      {[
        { n: 1, label: "Your Subjects" },
        { n: 2, label: "Interests" },
        { n: 3, label: "Preferences" },
      ].map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step >= s.n ? "bg-primary text-white" : "bg-slate-200 text-slate-400"
            }`}>
              {step > s.n ? <Check className="w-4 h-4" /> : s.n}
            </div>
            <span className={`hidden sm:block text-xs font-semibold ${step === s.n ? "text-slate-800" : "text-slate-400"}`}>{s.label}</span>
          </div>
          {i < 2 && <div className={`w-8 sm:w-12 h-1 mx-2 rounded-full transition-colors ${step > s.n ? "bg-primary" : "bg-slate-200"}`} />}
        </div>
      ))}
    </div>
  );

  // ── Results ──────────────────────────────────────────────────────────────────

  if (step === 4 && results) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-primary text-white rounded-3xl p-10 mb-8 text-center relative overflow-hidden">
            <Sparkles className="absolute top-10 right-10 w-24 h-24 text-white/10" />
            <h1 className="text-4xl font-display font-bold mb-4">Your Personalised Path</h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">{results.personalMessage}</p>
            <div className="mt-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full font-bold">
              Match Score: <span className="text-accent">{results.matchScore}%</span>
            </div>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><Target className="w-6 h-6 text-primary" /> Recommended Careers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.recommendedCareers.slice(0, 4).map(career => (
                  <Link key={career.id} href={`/careers/${career.id}`}>
                    <div className="glass-card p-6 rounded-2xl cursor-pointer">
                      <h3 className="font-bold text-lg">{career.title}</h3>
                      <p className="text-sm text-slate-500 mb-2">{career.sector}</p>
                      <p className="text-sm line-clamp-2 text-slate-600">{career.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><Building2 className="w-6 h-6 text-primary" /> Suggested Institutions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.recommendedInstitutions.slice(0, 3).map(inst => (
                  <Link key={inst.id} href={`/institutions/${inst.id}`}>
                    <div className="bg-white p-6 border border-slate-200 rounded-2xl hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                      <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">{inst.name}</h3>
                      <p className="text-sm text-slate-500">{inst.city} · {inst.type}</p>
                      {inst.ranking && <p className="text-xs font-bold text-indigo-600 mt-2">UK Rank #{inst.ranking}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {results.recommendedRoutes && results.recommendedRoutes.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><Map className="w-6 h-6 text-primary" /> Suggested Pathways</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.recommendedRoutes.slice(0, 4).map(route => (
                    <div key={route.id} className="bg-white border border-slate-200 rounded-2xl p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{route.duration}</span>
                          <h3 className="font-bold text-base text-slate-900 mt-1">{route.name}</h3>
                        </div>
                        <span className="shrink-0 px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{route.type}</span>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4">{route.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {route.pros?.slice(0, 2).map((pro, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-green-700">
                            <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {pro}
                          </div>
                        ))}
                        {route.cons?.slice(0, 2).map((con, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-rose-500">
                            <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {con}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="text-center mt-12 pb-12">
              <button onClick={() => { form.reset(); setStep(1); }} className="text-primary font-bold hover:underline">
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz Form ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {step < 4 && renderStepIndicator()}

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">

              {/* ── Step 1: Subjects ── */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-bold mb-1">What did you study?</h2>
                  <p className="text-slate-500 text-sm mb-6">
                    Add your subjects and expected or achieved grades. Includes all GCSE and A-Level subjects.
                  </p>

                  {/* Legend */}
                  <div className="flex items-center gap-3 mb-5 flex-wrap">
                    {Object.entries(LEVEL_STYLES).map(([lvl, cls]) => (
                      <span key={lvl} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>
                        {LEVEL_LABEL[lvl]}
                      </span>
                    ))}
                    <span className="text-[10px] text-slate-400">— shown in the dropdown</span>
                  </div>

                  <div className="space-y-3 mb-5">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-3 items-start">
                        <div className="flex-grow min-w-0">
                          <SubjectPicker
                            value={form.watch(`gcseSubjects.${index}.subjectId`)}
                            onChange={id => form.setValue(`gcseSubjects.${index}.subjectId`, id, { shouldValidate: true })}
                            subjects={allSubjects as Subject[]}
                            error={form.formState.errors.gcseSubjects?.[index]?.subjectId?.message}
                          />
                        </div>
                        <div className="w-24 shrink-0">
                          <select
                            {...form.register(`gcseSubjects.${index}.grade` as const)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                          >
                            <option value="">Grade</option>
                            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                          {form.formState.errors.gcseSubjects?.[index]?.grade && (
                            <p className="text-red-500 text-xs mt-1">{form.formState.errors.gcseSubjects[index]?.grade?.message}</p>
                          )}
                        </div>
                        {index > 0 && (
                          <button type="button" onClick={() => remove(index)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => append({ subjectId: 0, grade: "" })}
                    className="text-primary font-bold text-sm mb-8 hover:underline flex items-center gap-1"
                  >
                    + Add another subject
                  </button>

                  {form.formState.errors.gcseSubjects?.root && (
                    <p className="text-red-500 text-sm mb-4">{form.formState.errors.gcseSubjects.root.message}</p>
                  )}

                  <div className="flex justify-end">
                    <button type="button" onClick={nextStep} className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors">
                      Continue <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Interests ── */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-bold mb-1">What interests you?</h2>
                  <p className="text-slate-500 text-sm mb-6">Select the areas you enjoy or want to work in. Choose as many as apply.</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                    {INTERESTS.map(interest => {
                      const currentInterests = form.watch("interests") || [];
                      const isSelected = currentInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              form.setValue("interests", currentInterests.filter(i => i !== interest));
                            } else {
                              form.setValue("interests", [...currentInterests, interest]);
                            }
                          }}
                          className={`p-4 text-sm font-semibold rounded-xl border text-left transition-all ${
                            isSelected ? "bg-primary/10 border-primary text-primary" : "bg-white border-slate-200 text-slate-600 hover:border-primary/50"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 mb-1 text-primary" />}
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                  {form.formState.errors.interests && (
                    <p className="text-red-500 text-sm mb-4">{form.formState.errors.interests.message}</p>
                  )}

                  <div className="flex justify-between">
                    <button type="button" onClick={() => setStep(1)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl flex items-center gap-2">
                      <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <button type="button" onClick={nextStep} className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors">
                      Continue <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Preferences ── */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-bold mb-1">Preferences</h2>
                  <p className="text-slate-500 text-sm mb-6">Fine-tune your recommendations.</p>

                  <div className="space-y-6 mb-10">
                    <div>
                      <label className="font-bold text-slate-800 block mb-2 text-sm">Preferred Region <span className="text-slate-400 font-normal">(optional)</span></label>
                      <select {...form.register("preferredRegion")} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm">
                        <option value="">Anywhere in UK</option>
                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-2 text-sm">Preferred Route Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.values(QuizInputPreferredRouteType).map(type => {
                          const current = form.watch("preferredRouteType");
                          return (
                            <label key={type} className={`p-3.5 border rounded-xl cursor-pointer flex items-center gap-3 transition-colors ${current === type ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"}`}>
                              <input type="radio" value={type} {...form.register("preferredRouteType")} className="w-4 h-4 text-primary" />
                              <span className="font-medium text-sm">{type}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button type="button" onClick={() => setStep(2)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl flex items-center gap-2">
                      <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <button type="submit" disabled={isPending} className="px-8 py-3 bg-accent text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-70">
                      {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Get My Results</>}
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}
