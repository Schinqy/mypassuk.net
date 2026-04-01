import { useState } from "react";
import { useGetRoutes, GetRoutesAfterLevel } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Map, ArrowRight, CheckCircle, XCircle, Info, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNation, NATIONS } from "@/contexts/NationContext";

const ENGLAND_ONLY_ROUTES = ["T-Levels"];
const SCOTLAND_NOTE_ROUTES = ["Scottish Highers & Advanced Highers"];

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

interface ScotlandRoute {
  name: string;
  type: string;
  duration: string;
  highlight?: string;
  description: string;
  pros: string[];
  cons: string[];
  entryRequirements: string;
  badge?: { label: string; color: string };
}

const SCOTLAND_ROUTES_AFTER_NAT5: ScotlandRoute[] = [
  {
    name: "Highers (SQA)",
    type: "Academic Qualification",
    duration: "1 year (S5)",
    highlight: "Most popular",
    description: "Highers are the primary university entrance qualification in Scotland and the most common next step after National 5s. Taken in S5 (age 16–17), each Higher is studied over one year — faster and more focused than English A-Levels. Scottish universities typically require 4–5 Highers for degree entry.",
    pros: [
      "Primary entry route to Scottish universities",
      "Can apply to UCAS in S5 — earlier than English students",
      "One-year format means results faster",
      "Accepted by universities across the UK",
      "Can return in S6 to resit or take extra Highers",
    ],
    cons: [
      "Less in-depth than A-Levels (one year vs two)",
      "Some English universities require Advanced Highers too",
      "Must pick subjects carefully — dropping one means less flexibility",
    ],
    entryRequirements: "Typically grade C or above in National 5 for the same subject. English and Maths National 5 at grade C+ often required by schools for Highers entry.",
    badge: { label: "Most Common Route", color: "bg-teal-100 text-teal-700 border-teal-200" },
  },
  {
    name: "Foundation Apprenticeship",
    type: "Work-Based Learning (SCQF Level 6)",
    duration: "2 years (S5–S6)",
    description: "Foundation Apprenticeships (FAs) are a unique Scottish qualification available in S5 and S6 alongside Highers. Each FA is equivalent to one Higher in UCAS points (SCQF Level 6) and involves real workplace experience — typically two days per week with an employer. They are fully funded by the Scottish Government.",
    pros: [
      "Real workplace experience while still at school",
      "Equivalent to a Higher for UCAS and employer applications",
      "Fully funded — no cost to student",
      "Gives a significant advantage in future job applications or Modern Apprenticeships",
      "Available in computing, engineering, business, social services, and more",
    ],
    cons: [
      "Time commitment means fewer Highers can be taken",
      "Requires reliable transport to employer placement",
      "Not all schools offer all FA frameworks",
      "Success depends partly on employer involvement",
    ],
    entryRequirements: "Usually at least National 5 grades C+ in relevant subjects. School selects candidates — competitive in popular frameworks. Apply through your school's Skills Development Scotland coordinator.",
  },
  {
    name: "Modern Apprenticeship (Level 5)",
    type: "Work-Based Training (SCQF Level 5)",
    duration: "1–3 years",
    description: "Modern Apprenticeships (MAs) in Scotland are government-funded, work-based training programmes managed by Skills Development Scotland (SDS). A Level 5 MA (SCQF Level 5) is equivalent to National 5 level and is the standard entry route for school leavers who want to go straight into employment and earn a wage while training.",
    pros: [
      "Earn a wage from day one",
      "Nationally recognised qualification (SVQ/NVQ)",
      "No student debt",
      "Strong employer relationships — often leads to full employment",
      "Available in 70+ sectors: construction, hospitality, IT, engineering",
    ],
    cons: [
      "Limited career flexibility if you change your mind",
      "Not all apprenticeships lead to degree-level roles",
      "Competitive — employer must take you on",
      "Pay can be lower than a qualified worker's rate initially",
    ],
    entryRequirements: "No fixed academic requirements — employers set their own criteria. Most expect National 5 English and Maths. Must be 16+ and not in full-time education. Apply via myworldofwork.co.uk.",
  },
  {
    name: "College National Certificate (NC)",
    type: "Vocational / College Course (SCQF Level 5–6)",
    duration: "1 year",
    description: "Scotland's colleges offer National Certificates (NCs) at SCQF Level 5 and 6 in a huge range of vocational subjects — from Computing to Hospitality, Beauty Therapy to Engineering. For S4 school leavers, NCs provide a practical, employment-focused alternative to returning to school for Highers.",
    pros: [
      "Practical, skills-focused learning environment",
      "Can progress to HNC/HND and then university via articulation",
      "Wide range of subjects not available at school",
      "Often free for 16–19 year-olds",
      "Smaller class sizes and vocational teaching style",
    ],
    cons: [
      "Less academically prestigious than Highers",
      "Route to university is longer (NC → HNC → HND → Degree Year 2)",
      "Not all universities accept NC as direct entry",
    ],
    entryRequirements: "Usually 2–3 National 4 or 5 passes (grade D–A). Some NCs require specific subjects. Contact your local college for entry requirements for your chosen subject.",
  },
];

const SCOTLAND_ROUTES_AFTER_HIGHERS: ScotlandRoute[] = [
  {
    name: "University (via Highers & UCAS)",
    type: "Higher Education (SCQF Level 10)",
    duration: "4 years (Honours)",
    highlight: "Most popular",
    description: "The majority of Scottish Higher achievers go on to university. Scottish universities typically require 4–5 Highers at grades A–C for entry. Scottish students studying at Scottish universities pay no tuition fees — the Scottish Government covers fees via SAAS. Scottish degrees are 4-year Honours, with a broader first year before subject specialisation.",
    pros: [
      "Free tuition for Scottish students (SAAS funding)",
      "4-year degree with a broad first year — change course direction in Year 1",
      "World-class Scottish universities: Edinburgh, Glasgow, St Andrews, Aberdeen",
      "Can apply to English, Welsh, or Northern Irish universities too",
      "Higher average salary outcomes for degree holders over a lifetime",
    ],
    cons: [
      "Living costs still significant (rent, food, travel) — student loan available",
      "4 years is longer than English 3-year degrees",
      "Competitive courses (medicine, law, veterinary) require very high Highers/Adv. Highers",
      "Not all degree subjects lead directly to employment",
    ],
    entryRequirements: "Typically 4–5 Highers at grades A–C (specific grades depend on course and university). English at Higher required for most degrees. Apply through UCAS — deadline usually mid-January for most courses.",
    badge: { label: "Most Common Route", color: "bg-teal-100 text-teal-700 border-teal-200" },
  },
  {
    name: "Advanced Highers (SQA)",
    type: "Academic Qualification (SCQF Level 7)",
    duration: "1 year (S6)",
    description: "Advanced Highers are the most demanding SQA qualifications, taken in S6 alongside or instead of additional Highers. They are equivalent to A-Levels in UCAS tariff (Advanced Higher A = 56 UCAS points = A-Level A). Highly competitive universities in England — and courses like medicine — often require Advanced Highers.",
    pros: [
      "Equivalent UCAS tariff to A-Levels (opens doors to English universities)",
      "Some universities offer advanced entry (Year 2) for Advanced Higher achievers",
      "Demonstrates academic depth to competitive admissions tutors",
      "Can be used to boost UCAS points alongside Highers",
      "Required for Oxford, Cambridge, and medical courses at English universities",
    ],
    cons: [
      "Very demanding — designed to be university-level content",
      "Not required for most Scottish university courses",
      "Resitting Highers in S6 may be more beneficial for some students",
    ],
    entryRequirements: "Usually grade B or above in the equivalent Higher is required. Some schools only offer Advanced Highers to students who scored A in their Higher. Check with your school.",
  },
  {
    name: "HNC / HND at College",
    type: "Higher National Qualification (SCQF Level 7–8)",
    duration: "HNC: 1 year / HND: 2 years",
    description: "Higher National Certificates (HNCs) and Higher National Diplomas (HNDs) are awarded by the SQA and delivered at Scotland's colleges. They provide a practical, skills-based alternative to university and can lead directly into employment or into university Year 2 via articulation agreements. Scotland has an extensive network of articulation pathways.",
    pros: [
      "Can enter university in Year 2 with an HND (saving 1 year of fees)",
      "Practical, employer-aligned curriculum",
      "Available in almost every vocational sector",
      "Often free for Scottish students aged 16–19",
      "Strong graduate employment rates in technical fields",
    ],
    cons: [
      "Articulation route is longer overall than going directly to university",
      "Not all universities accept HNC/HND for Year 2 entry in all subjects",
      "Less socially prestigious perception compared to traditional degree entry",
    ],
    entryRequirements: "HNC typically requires 1–2 Highers at grade C+ or a relevant NC. HND often requires 2–3 Highers or an HNC. Entry requirements vary by subject and college.",
  },
  {
    name: "Modern Apprenticeship (Level 6–8)",
    type: "Work-Based Training (SCQF Level 6–8)",
    duration: "2–4 years",
    description: "Higher-level Modern Apprenticeships in Scotland sit at SCQF Level 6, 7, or 8 — equivalent to Highers, Advanced Highers, or HNDs. Managed by Skills Development Scotland, these provide a genuine career alternative to university, particularly in engineering, IT, financial services, construction, and the public sector.",
    pros: [
      "Earn a full wage while training — no student debt",
      "Nationally recognised SVQ qualification",
      "Strong employer relationships and often direct job offer on completion",
      "Structured off-the-job learning combined with real work experience",
      "Government-funded — no cost to apprentice",
    ],
    cons: [
      "Employer-dependent — quality of experience varies",
      "Career path is more fixed than a degree",
      "Competitive — fewer places than university",
      "Some sectors have limited availability in rural areas",
    ],
    entryRequirements: "Typically 3–4 Highers at grade C+ for Level 7/8 MAs. Employer-set criteria apply. Some MAs are open to those with Level 5 MAs already completed. Apply via myworldofwork.co.uk.",
  },
  {
    name: "Graduate Apprenticeship",
    type: "Degree-Level Apprenticeship (SCQF Level 10)",
    duration: "4–5 years",
    description: "Scotland's Graduate Apprenticeships are degree-level programmes, fully funded by the Scottish Government, delivered by universities in partnership with employers. Students earn a full salary and graduate with an Honours degree — with no tuition fees or student debt. Available in Software Development, Engineering, Data Science, Business Management, and more.",
    pros: [
      "Full Honours degree (SCQF Level 10) — same as a traditional degree",
      "Fully funded — no tuition fees AND earn a salary throughout",
      "Real work experience integrated across the whole degree",
      "Strong employer sponsorship often leads to permanent roles",
      "Highly competitive on CVs — rare and prestigious",
    ],
    cons: [
      "Highly competitive — fewer places than university or MAs",
      "Subject range is still limited (mainly STEM and business)",
      "Work and study balance is demanding",
      "Must stay with employer for the duration — limited flexibility",
    ],
    entryRequirements: "Typically 3–5 Highers at grade B–C+ depending on programme. Employer interview and selection process in addition to academic entry. Apply directly to the employer/university partnership. Check apprenticeships.scot.",
    badge: { label: "Scotland Only", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  },
  {
    name: "Gap Year & Deferred Entry",
    type: "Voluntary / Travel / Work",
    duration: "1 year",
    description: "Deferring university entry by one year is accepted by almost all Scottish and UK universities. A structured gap year can include voluntary work, travel, language learning, or part-time employment. Many students use the time to strengthen their UCAS application, earn money, or gain clarity on their degree choice.",
    pros: [
      "Develop independence and life skills",
      "Earn money to offset university living costs",
      "Gain work experience relevant to intended career",
      "Universities welcome applicants who can demonstrate what they did",
      "Time to reconsider course choice before committing",
    ],
    cons: [
      "Can be difficult to return to study after a break",
      "Unstructured gap years are viewed negatively by admissions tutors",
      "Must apply to UCAS in S5/S6 before the gap year (deferred entry)",
      "Financial cost if travelling internationally",
    ],
    entryRequirements: "Apply to UCAS with deferred entry (tick the 'deferred entry' box). Universities may ask about your gap year plans in the personal statement or at interview. No extra qualifications required.",
  },
];

export default function Routes() {
  const { nation, openSelector } = useNation();
  const [activeTab, setActiveTab] = useState<GetRoutesAfterLevel>("GCSE");
  const { data: routes, isLoading } = useGetRoutes({ afterLevel: activeTab });
  const nationInfo = nation ? NATIONS.find(n => n.id === nation) : null;
  const isScotland = nation === "scotland";

  const tabs: { value: GetRoutesAfterLevel; label: string }[] = [
    { value: "GCSE", label: isScotland ? "After National 5" : "After GCSEs" },
    { value: "A-Level", label: isScotland ? "After Highers" : "After A-Levels" },
  ];

  const scotlandRoutes = activeTab === "GCSE" ? SCOTLAND_ROUTES_AFTER_NAT5 : SCOTLAND_ROUTES_AFTER_HIGHERS;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
            <Map className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {isScotland ? "Scottish Study Routes" : "Compare Study Routes"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isScotland
              ? "Explore every pathway available to Scottish students — from Highers and Advanced Highers to Modern Apprenticeships, Foundation Apprenticeships, and Graduate Apprenticeships."
              : "Understand your options after your qualifications. From traditional academic paths to modern technical and vocational routes — across all four UK nations."}
          </p>
        </div>

        {/* Nation banner */}
        {nationInfo ? (
          <div className="mb-8 flex items-center justify-between gap-3 px-5 py-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{nationInfo.flag}</span>
              <p className="text-sm font-semibold text-slate-800">
                Showing routes for <span className="text-primary">{nationInfo.label}</span>
                {isScotland
                  ? <span className="text-slate-500 font-normal"> — SQA qualifications &amp; Scottish pathways</span>
                  : <span className="text-slate-500 font-normal"> — routes not available in your nation are flagged</span>}
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
        {isScotland && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 px-6 py-5 bg-teal-50 border border-teal-200 rounded-2xl max-w-3xl mx-auto"
          >
            <p className="font-bold text-teal-900 mb-2 flex items-center gap-2">🏴󠁧󠁢󠁳󠁣󠁴󠁿 The Scottish Qualification Pathway</p>
            <p className="text-sm text-teal-800 leading-relaxed mb-3">
              Scotland's SQA system follows a distinct progression. Most students take this route:
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium mb-3">
              <span className="px-3 py-1.5 bg-teal-100 text-teal-800 rounded-xl font-bold">National 5s (S4)</span>
              <ArrowRight className="w-4 h-4 text-teal-600" />
              <span className="px-3 py-1.5 bg-teal-100 text-teal-800 rounded-xl font-bold">Highers (S5)</span>
              <ArrowRight className="w-4 h-4 text-teal-600" />
              <span className="px-3 py-1.5 bg-teal-200 text-teal-900 rounded-xl font-bold">University / Advanced Highers / Apprenticeship</span>
            </div>
            <p className="text-xs text-teal-700">
              Most Scottish universities require <strong>4–5 Highers</strong>. Advanced Highers (S6) are taken for highly competitive courses or to match A-Level equivalent UCAS points for English universities. Scottish students studying in Scotland pay <strong>no tuition fees</strong> (SAAS).
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

        {/* Scotland-specific route cards */}
        {isScotland ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {scotlandRoutes.map((route, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  key={route.name}
                  className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col"
                >
                  <div className="mb-6">
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-full uppercase tracking-wider inline-block">
                        {route.duration}
                      </span>
                      {route.badge && (
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${route.badge.color} shrink-0`}>
                          {route.badge.label}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">{route.name}</h3>
                    <p className="text-primary font-medium text-sm">{route.type}</p>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">
                    {route.description}
                  </p>

                  <div className="space-y-6 mb-8">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                        <CheckCircle className="w-4 h-4 text-green-700" /> Pros
                      </h4>
                      <ul className="space-y-2">
                        {route.pros.map((pro, i) => (
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
                        {route.cons.map((con, i) => (
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
        ) : isLoading ? (
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
