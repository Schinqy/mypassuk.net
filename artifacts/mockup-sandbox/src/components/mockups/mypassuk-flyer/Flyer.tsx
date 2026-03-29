import {
  GraduationCap, Briefcase, Building2, GitCompare, Bot, Timer,
  Bell, Users, CalendarDays, Zap, CheckCircle, Star
} from "lucide-react";

const NAVY = "#1e3a8a";
const CRIMSON = "#be123c";
const CREAM = "#faf8f4";

const features = [
  { icon: GraduationCap, label: "Exam Prep", desc: "Every GCSE & A-Level subject" },
  { icon: Briefcase, label: "Career Explorer", desc: "69 profiles with salaries & routes" },
  { icon: Building2, label: "287+ Institutions", desc: "Unis, colleges, apprenticeships" },
  { icon: GitCompare, label: "Routes Comparison", desc: "Uni vs apprenticeship vs work" },
  { icon: Bot, label: "AI Study Assistant", desc: "Upload docs · unlimited with Premium" },
  { icon: Timer, label: "Study Plans", desc: "Pomodoro timetables & break alerts" },
  { icon: Bell, label: "Recruitment Alerts", desc: "Industrial placements at top firms" },
  { icon: Users, label: "Find a Tutor", desc: "Qualified tutors near you" },
  { icon: CalendarDays, label: "Open Days", desc: "569+ events across the UK" },
];

const plans = [
  { label: "Free", price: "£0", color: "#475569", bg: "#f1f5f9", features: ["Exam resources", "Career profiles", "Institution browser"] },
  { label: "Premium", price: "£3.99/mo", color: "#fff", bg: NAVY, features: ["Unlimited AI assistant", "Document uploads", "Full study plans"] },
  { label: "Institutions", price: "£99/mo", color: "#fff", bg: CRIMSON, features: ["Featured listing", "Recruitment alerts", "Open day promotion"] },
];

export function Flyer() {
  return (
    <div className="w-full min-h-screen flex items-start justify-center"
      style={{ background: "#e8eaf6", padding: "0" }}>
      <div
        style={{
          width: "500px",
          background: "#fff",
          fontFamily: "'Inter', sans-serif",
          boxShadow: "0 8px 40px rgba(30,58,138,0.18)",
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            background: `linear-gradient(140deg, ${NAVY} 0%, #172562 100%)`,
            padding: "28px 32px 22px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background grid texture */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.06,
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }} />

          {/* Logo row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", position: "relative" }}>
            <svg width="44" height="44" viewBox="0 0 36 36" fill="none">
              <defs>
                <linearGradient id="hbg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#2d55c8"/>
                  <stop offset="100%" stopColor="#1a2e80"/>
                </linearGradient>
              </defs>
              <rect width="36" height="36" rx="9" fill="url(#hbg)"/>
              <rect width="36" height="36" rx="9" fill="white" fillOpacity="0.08"/>
              <polygon points="18,6 30,12 18,18 6,12" fill="white" fillOpacity="0.95"/>
              <path d="M10 14 L10 22 Q18 26 26 22 L26 14 Q18 18 10 14Z" fill="white" fillOpacity="0.82"/>
              <line x1="30" y1="12" x2="30" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6"/>
              <circle cx="30" cy="21.5" r="1.8" fill="white" fillOpacity="0.55"/>
              <circle cx="27" cy="27" r="8" fill="#be123c"/>
              <path d="M23 27 L26 30 L31.5 23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <div style={{ fontWeight: 800, fontSize: "26px", letterSpacing: "-0.5px", lineHeight: 1 }}>
                <span style={{ color: "#cbd5e1" }}>My</span>
                <span style={{ color: "#fff" }}>Pass</span>
                <span style={{
                  fontSize: "12px", fontWeight: 900, color: "#fff",
                  background: CRIMSON, padding: "2px 7px", borderRadius: "5px",
                  marginLeft: "5px", verticalAlign: "middle", position: "relative", top: "-2px"
                }}>UK</span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", marginTop: "2px", letterSpacing: "0.3px" }}>
                mypassuk.com
              </div>
            </div>
          </div>

          {/* Headline */}
          <div style={{ position: "relative" }}>
            <div style={{
              display: "inline-block", background: CRIMSON, color: "#fff",
              fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px",
              padding: "3px 10px", borderRadius: "4px", marginBottom: "10px",
              textTransform: "uppercase"
            }}>
              For UK School Leavers · GCSE &amp; A-Level
            </div>
            <h1 style={{
              color: "#fff", fontWeight: 900, fontSize: "28px",
              lineHeight: 1.15, margin: 0, letterSpacing: "-0.5px"
            }}>
              Everything you need<br />
              <span style={{ color: "#93c5fd" }}>to pass</span> and{" "}
              <span style={{ color: "#fca5a5" }}>succeed.</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "13px", marginTop: "10px", lineHeight: 1.5, marginBottom: 0 }}>
              Revision tools, career guidance, AI assistance, 287+ institutions
              and more — all in one free platform.
            </p>
          </div>
        </div>

        {/* ── SERVICES GRID ── */}
        <div style={{ padding: "22px 28px 18px", background: CREAM }}>
          <div style={{
            fontSize: "10px", fontWeight: 800, letterSpacing: "1.8px",
            color: CRIMSON, textTransform: "uppercase", marginBottom: "14px"
          }}>
            9 Powerful Features
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px"
          }}>
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{
                background: "#fff", borderRadius: "10px", padding: "12px 10px",
                border: "1px solid rgba(30,58,138,0.09)",
                boxShadow: "0 2px 8px rgba(30,58,138,0.06)",
              }}>
                <div style={{
                  width: "30px", height: "30px", borderRadius: "8px",
                  background: "rgba(30,58,138,0.1)", display: "flex",
                  alignItems: "center", justifyContent: "center", marginBottom: "7px"
                }}>
                  <Icon size={15} color={NAVY} />
                </div>
                <div style={{ fontWeight: 700, fontSize: "11px", color: "#1e293b", lineHeight: 1.2 }}>{label}</div>
                <div style={{ fontSize: "9.5px", color: "#64748b", marginTop: "3px", lineHeight: 1.4 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HIGHLIGHT STRIP ── */}
        <div style={{
          background: `linear-gradient(90deg, ${NAVY} 0%, #1d4ed8 100%)`,
          padding: "14px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-around", gap: "8px"
        }}>
          {[
            ["287+", "Institutions"],
            ["69", "Career Guides"],
            ["569+", "Open Day Events"],
            ["20", "Placement Partners"],
          ].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ color: "#fbbf24", fontWeight: 900, fontSize: "20px", lineHeight: 1 }}>{num}</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "9px", marginTop: "2px", letterSpacing: "0.3px" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── PRICING ── */}
        <div style={{ padding: "20px 28px 18px", background: "#fff" }}>
          <div style={{
            fontSize: "10px", fontWeight: 800, letterSpacing: "1.8px",
            color: CRIMSON, textTransform: "uppercase", marginBottom: "12px"
          }}>
            Simple Pricing
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            {plans.map(({ label, price, color, bg, features: fs }) => (
              <div key={label} style={{
                background: bg, borderRadius: "10px", padding: "14px 12px",
                border: bg === "#f1f5f9" ? "1px solid #e2e8f0" : "none",
                boxShadow: bg !== "#f1f5f9" ? "0 4px 16px rgba(0,0,0,0.18)" : "none",
                position: "relative", overflow: "hidden"
              }}>
                {label === "Premium" && (
                  <div style={{
                    position: "absolute", top: "8px", right: "8px",
                    background: "#fbbf24", borderRadius: "4px", padding: "1px 5px",
                    fontSize: "8px", fontWeight: 800, color: "#92400e"
                  }}>⭐ POPULAR</div>
                )}
                <div style={{ fontWeight: 800, fontSize: "12px", color: color === "#fff" ? "rgba(255,255,255,0.75)" : "#64748b", marginBottom: "4px" }}>{label}</div>
                <div style={{ fontWeight: 900, fontSize: "18px", color: color === "#fff" ? "#fff" : NAVY, marginBottom: "10px", lineHeight: 1 }}>{price}</div>
                {fs.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "5px", marginBottom: "5px" }}>
                    <CheckCircle size={9} color={color === "#fff" ? "rgba(255,255,255,0.7)" : "#22c55e"} style={{ marginTop: "1px", flexShrink: 0 }} />
                    <span style={{ fontSize: "9px", color: color === "#fff" ? "rgba(255,255,255,0.85)" : "#475569", lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA FOOTER ── */}
        <div style={{
          background: `linear-gradient(135deg, ${CRIMSON} 0%, #9f1239 100%)`,
          padding: "20px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", right: "-20px", top: "-20px", width: "120px", height: "120px", background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", right: "30px", bottom: "-30px", width: "80px", height: "80px", background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontWeight: 900, fontSize: "18px", color: "#fff", marginBottom: "4px" }}>
              Start free today
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)" }}>
              No credit card required · Free forever plan
            </div>
          </div>
          <div style={{
            background: "#fff", borderRadius: "10px",
            padding: "10px 18px", position: "relative"
          }}>
            <div style={{ fontWeight: 900, fontSize: "13px", color: NAVY }}>mypassuk.com</div>
            <div style={{ fontSize: "9px", color: "#64748b", marginTop: "1px" }}>Sign up free →</div>
          </div>
        </div>

        {/* ── FINE PRINT ── */}
        <div style={{ background: "#1e293b", padding: "8px 32px", textAlign: "center" }}>
          <span style={{ fontSize: "9px", color: "#64748b", letterSpacing: "0.3px" }}>
            © 2026 MyPassUK · For GCSE &amp; A-Level students across England, Wales &amp; Scotland
          </span>
        </div>
      </div>
    </div>
  );
}
