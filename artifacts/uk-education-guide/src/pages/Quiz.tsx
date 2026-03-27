import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, GraduationCap, ArrowLeft, Loader2, Target, Sparkles, Building2, Map } from "lucide-react";
import { useGetSubjects, useGetRecommendations, QuizInputPreferredRouteType } from "@workspace/api-client-react";
import { Link } from "wouter";

// Form Schema
const gcseSchema = z.object({
  subjectId: z.coerce.number().min(1, "Select a subject"),
  grade: z.string().min(1, "Select a grade")
});

const formSchema = z.object({
  gcseSubjects: z.array(gcseSchema).min(1, "Add at least one GCSE"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  preferredRegion: z.string().optional(),
  preferredRouteType: z.nativeEnum(QuizInputPreferredRouteType).default("Any"),
});

type FormValues = z.infer<typeof formSchema>;

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

export default function Quiz() {
  const [step, setStep] = useState(1);
  const { data: allSubjects } = useGetSubjects({ level: "GCSE" });
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
    // Transform to API expected shape if needed, here it matches perfectly
    getRecs({ data });
    setStep(4); // Results step
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-12">
      {[1, 2, 3].map((num) => (
        <div key={num} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            step >= num ? "bg-primary text-white" : "bg-slate-200 text-slate-400"
          }`}>
            {step > num ? <Check className="w-4 h-4" /> : num}
          </div>
          {num < 3 && (
            <div className={`w-12 h-1 mx-2 rounded-full transition-colors ${
              step > num ? "bg-primary" : "bg-slate-200"
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  if (step === 4 && results) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-primary text-white rounded-3xl p-10 mb-8 text-center relative overflow-hidden">
             <Sparkles className="absolute top-10 right-10 w-24 h-24 text-white/10" />
             <h1 className="text-4xl font-display font-bold mb-4">Your Personalized Path</h1>
             <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">{results.personalMessage}</p>
             <div className="mt-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full font-bold">
               Match Score: <span className="text-accent">{results.matchScore}%</span>
             </div>
          </div>

          <div className="space-y-12">
            {/* Top Careers */}
            <section>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><Target className="w-6 h-6 text-primary" /> Recommended Careers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.recommendedCareers.slice(0,4).map(career => (
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

            {/* Top Institutions */}
            <section>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><Building2 className="w-6 h-6 text-primary" /> Suggested Institutions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.recommendedInstitutions.slice(0,3).map(inst => (
                   <Link key={inst.id} href={`/institutions/${inst.id}`}>
                    <div className="bg-white p-6 border border-slate-200 rounded-2xl hover:border-primary/50 transition-colors cursor-pointer">
                      <h3 className="font-bold text-base mb-1">{inst.name}</h3>
                      <p className="text-sm text-slate-500">{inst.city}, {inst.type}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
            
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

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {step < 4 && renderStepIndicator()}

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}}>
                  <h2 className="text-3xl font-bold mb-2">What did you study?</h2>
                  <p className="text-slate-500 mb-8">Add your GCSE subjects and expected/achieved grades to help us understand your academic profile.</p>
                  
                  <div className="space-y-4 mb-6">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-start">
                        <div className="flex-grow">
                          <select 
                            {...form.register(`gcseSubjects.${index}.subjectId` as const)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                          >
                            <option value="0">Select Subject...</option>
                            {allSubjects?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                          {form.formState.errors.gcseSubjects?.[index]?.subjectId && (
                            <p className="text-red-500 text-xs mt-1">{form.formState.errors.gcseSubjects[index]?.subjectId?.message}</p>
                          )}
                        </div>
                        <div className="w-24 shrink-0">
                           <select 
                            {...form.register(`gcseSubjects.${index}.grade` as const)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                          >
                            <option value="">Grade</option>
                            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>
                        {index > 0 && (
                          <button type="button" onClick={() => remove(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl mt-0">
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <button type="button" onClick={() => append({ subjectId: 0, grade: "" })} className="text-primary font-bold text-sm mb-12 hover:underline">
                    + Add another subject
                  </button>

                  <div className="flex justify-end">
                    <button type="button" onClick={nextStep} className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors">
                      Continue <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}}>
                  <h2 className="text-3xl font-bold mb-2">What interests you?</h2>
                  <p className="text-slate-500 mb-8">Select areas you enjoy or want to work in.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
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
                          {interest}
                        </button>
                      )
                    })}
                  </div>
                  {form.formState.errors.interests && <p className="text-red-500 text-sm mb-4">{form.formState.errors.interests.message}</p>}

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

              {step === 3 && (
                <motion.div key="step3" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}}>
                  <h2 className="text-3xl font-bold mb-2">Preferences</h2>
                  <p className="text-slate-500 mb-8">Fine tune your results.</p>
                  
                  <div className="space-y-6 mb-12">
                    <div>
                      <label className="font-bold text-slate-800 block mb-2">Preferred Region (Optional)</label>
                      <select {...form.register("preferredRegion")} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none">
                        <option value="">Anywhere in UK</option>
                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-2">Route Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.values(QuizInputPreferredRouteType).map(type => {
                           const current = form.watch("preferredRouteType");
                           return (
                             <label key={type} className={`p-4 border rounded-xl cursor-pointer flex items-center gap-3 transition-colors ${current === type ? 'border-primary bg-primary/5' : 'border-slate-200'}`}>
                               <input type="radio" value={type} {...form.register("preferredRouteType")} className="w-4 h-4 text-primary" />
                               <span className="font-medium text-sm">{type}</span>
                             </label>
                           )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button type="button" onClick={() => setStep(2)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl flex items-center gap-2">
                      <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <button type="submit" disabled={isPending} className="px-8 py-3 bg-accent text-white rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-colors disabled:opacity-70">
                      {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Results"}
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
