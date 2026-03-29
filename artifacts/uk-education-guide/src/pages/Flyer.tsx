import { useRef } from "react";
import { Link } from "wouter";
import {
  GraduationCap, Briefcase, Building2, GitCompare, Bot, Timer,
  Bell, Users, CalendarDays, CheckCircle, ArrowLeft, Printer,
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
  {
    label: "Free", price: "£0", textColor: "#475569", bg: "#f1f5f9",
    features: ["Exam resources", "Career profiles", "Institution browser"],
  },
  {
    label: "Premium", price: "£3.99/mo", textColor: "#fff", bg: NAVY,
    features: ["Unlimited AI assistant", "Document uploads", "Full study plans"],
  },
  {
    label: "Institutions", price: "£99/mo", textColor: "#fff", bg: CRIMSON,
    features: ["Featured listing", "Recruitment alerts", "Open day promotion"],
  },
];

export default function FlyerPage() {
  const flyerRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#d1d5db", fontFamily: "'Inter', sans-serif" }}>
      {/* Toolbar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "#1e293b", padding: "10px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}>
        <Link href="/">
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            color: "#94a3b8", fontSize: "13px", cursor: "pointer",
            textDecoration: "none",
          }}>
            <ArrowLeft size={16} />
            Back to MyPassUK
          </div>
        </Link>
        <span style={{ color: "#64748b", fontSize: "12px", fontWeight: 600, letterSpacing: "0.5px" }}>
          ADVERTISING FLYER
        </span>
        <button
          onClick={() => window.print()}
          style={{
            display: "flex", alignItems: "center", gap: "7px",
            background: NAVY, color: "#fff", border: "none",
            padding: "8px 16px", borderRadius: "8px",
            fontSize: "13px", fontWeight: 600, cursor: "pointer",
          }}
        >
          <Printer size={14} />
          Print / Save PDF
        </button>
      </div>

      {/* Print hint */}
      <div style={{
        textAlign: "center", padding: "16px",
        color: "#6b7280", fontSize: "12px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
      }}>
        <span>Tip: Use</span>
        <kbd style={{ background: "#e5e7eb", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" }}>Ctrl+P</kbd>
        <span>or the Print button to save as PDF — set paper size to A4, no margins.</span>
      </div>

      {/* Flyer document */}
      <div style={{ display: "flex", justifyContent: "center", paddingBottom: "48px" }}>
        <div
          ref={flyerRef}
          id="flyer"
          style={{
            width: "595px",
            background: "#fff",
            boxShadow: "0 8px 48px rgba(0,0,0,0.25)",
          }}
        >
          {/* ── HEADER ── */}
          <div style={{
            background: `linear-gradient(140deg, ${NAVY} 0%, #172562 100%)`,
            padding: "36px 40px 28px",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Dot-grid texture */}
            <div style={{
              position: "absolute", inset: 0, opacity: 0.06,
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }} />

            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "22px", position: "relative" }}>
              <svg width="52" height="52" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="fbg2" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#2d55c8" />
                    <stop offset="100%" stopColor="#1a2e80" />
                  </linearGradient>
                </defs>
                <rect width="36" height="36" rx="9" fill="url(#fbg2)" />
                <rect width="36" height="36" rx="9" fill="white" fillOpacity="0.08" />
                <polygon points="18,6 30,12 18,18 6,12" fill="white" fillOpacity="0.95" />
                <path d="M10 14 L10 22 Q18 26 26 22 L26 14 Q18 18 10 14Z" fill="white" fillOpacity="0.82" />
                <line x1="30" y1="12" x2="30" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
                <circle cx="30" cy="21.5" r="1.8" fill="white" fillOpacity="0.55" />
                <circle cx="27" cy="27" r="8" fill="#be123c" />
                <path d="M23 27 L26 30 L31.5 23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <div style={{ fontWeight: 800, fontSize: "32px", letterSpacing: "-0.5px", lineHeight: 1 }}>
                  <span style={{ color: "#cbd5e1" }}>My</span>
                  <span style={{ color: "#fff" }}>Pass</span>
                  <span style={{
                    fontSize: "14px", fontWeight: 900, color: "#fff",
                    background: CRIMSON, padding: "3px 8px", borderRadius: "5px",
                    marginLeft: "6px", verticalAlign: "middle", position: "relative", top: "-2px",
                  }}>UK</span>
                </div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", marginTop: "3px", letterSpacing: "0.3px" }}>
                  mypassuk.com
                </div>
              </div>
            </div>

            {/* Eyebrow + headline */}
            <div style={{ position: "relative" }}>
              <div style={{
                display: "inline-block", background: CRIMSON, color: "#fff",
                fontSize: "10px", fontWeight: 700, letterSpacing: "1.8px",
                padding: "4px 12px", borderRadius: "4px", marginBottom: "14px",
                textTransform: "uppercase",
              }}>
                For UK School Leavers · GCSE &amp; A-Level
              </div>
              <h1 style={{
                color: "#fff", fontWeight: 900, fontSize: "34px",
                lineHeight: 1.1, margin: 0, letterSpacing: "-0.5px",
              }}>
                Everything you need<br />
                <span style={{ color: "#93c5fd" }}>to pass</span> and{" "}
                <span style={{ color: "#fca5a5" }}>succeed.</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginTop: "12px", lineHeight: 1.6, marginBottom: 0 }}>
                Revision tools, career guidance, AI assistance, 287+ institutions
                and more — all in one free platform.
              </p>
            </div>
          </div>

          {/* ── FEATURES GRID ── */}
          <div style={{ padding: "28px 36px 22px", background: CREAM }}>
            <div style={{
              fontSize: "10px", fontWeight: 800, letterSpacing: "2px",
              color: CRIMSON, textTransform: "uppercase", marginBottom: "16px",
            }}>
              9 Powerful Features
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              {features.map(({ icon: Icon, label, desc }) => (
                <div key={label} style={{
                  background: "#fff", borderRadius: "12px", padding: "14px 12px",
                  border: "1px solid rgba(30,58,138,0.09)",
                  boxShadow: "0 2px 10px rgba(30,58,138,0.07)",
                }}>
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "9px",
                    background: "rgba(30,58,138,0.1)", display: "flex",
                    alignItems: "center", justifyContent: "center", marginBottom: "9px",
                  }}>
                    <Icon size={17} color={NAVY} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "12px", color: "#1e293b", lineHeight: 1.2 }}>{label}</div>
                  <div style={{ fontSize: "10px", color: "#64748b", marginTop: "4px", lineHeight: 1.4 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── STATS STRIP ── */}
          <div style={{
            background: `linear-gradient(90deg, ${NAVY} 0%, #1d4ed8 100%)`,
            padding: "18px 36px",
            display: "flex", alignItems: "center", justifyContent: "space-around",
          }}>
            {[
              ["287+", "Institutions"],
              ["69", "Career Guides"],
              ["569+", "Open Day Events"],
              ["20", "Placement Partners"],
            ].map(([num, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ color: "#fbbf24", fontWeight: 900, fontSize: "24px", lineHeight: 1 }}>{num}</div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "10px", marginTop: "3px", letterSpacing: "0.3px" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* ── PRICING ── */}
          <div style={{ padding: "24px 36px 22px", background: "#fff" }}>
            <div style={{
              fontSize: "10px", fontWeight: 800, letterSpacing: "2px",
              color: CRIMSON, textTransform: "uppercase", marginBottom: "14px",
            }}>
              Simple Pricing
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              {plans.map(({ label, price, textColor, bg, features: fs }) => (
                <div key={label} style={{
                  background: bg, borderRadius: "12px", padding: "16px 14px",
                  border: bg === "#f1f5f9" ? "1px solid #e2e8f0" : "none",
                  boxShadow: bg !== "#f1f5f9" ? "0 4px 20px rgba(0,0,0,0.2)" : "none",
                  position: "relative", overflow: "hidden",
                }}>
                  {label === "Premium" && (
                    <div style={{
                      position: "absolute", top: "10px", right: "10px",
                      background: "#fbbf24", borderRadius: "4px", padding: "2px 6px",
                      fontSize: "9px", fontWeight: 800, color: "#92400e",
                    }}>⭐ POPULAR</div>
                  )}
                  <div style={{
                    fontWeight: 800, fontSize: "12px",
                    color: textColor === "#fff" ? "rgba(255,255,255,0.7)" : "#64748b",
                    marginBottom: "5px",
                  }}>{label}</div>
                  <div style={{
                    fontWeight: 900, fontSize: "22px",
                    color: textColor === "#fff" ? "#fff" : NAVY,
                    marginBottom: "12px", lineHeight: 1,
                  }}>{price}</div>
                  {fs.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "6px" }}>
                      <CheckCircle
                        size={10}
                        color={textColor === "#fff" ? "rgba(255,255,255,0.65)" : "#22c55e"}
                        style={{ marginTop: "2px", flexShrink: 0 }}
                      />
                      <span style={{
                        fontSize: "10px",
                        color: textColor === "#fff" ? "rgba(255,255,255,0.85)" : "#475569",
                        lineHeight: 1.45,
                      }}>{f}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA FOOTER ── */}
          <div style={{
            background: `linear-gradient(135deg, ${CRIMSON} 0%, #9f1239 100%)`,
            padding: "24px 40px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", right: "-24px", top: "-24px", width: "140px", height: "140px", background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", right: "36px", bottom: "-36px", width: "100px", height: "100px", background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontWeight: 900, fontSize: "22px", color: "#fff", marginBottom: "5px" }}>
                Start free today
              </div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>
                No credit card required · Free forever plan
              </div>
            </div>
            <div style={{
              background: "#fff", borderRadius: "12px",
              padding: "12px 22px", position: "relative",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            }}>
              <div style={{ fontWeight: 900, fontSize: "15px", color: NAVY }}>mypassuk.com</div>
              <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>Sign up free →</div>
            </div>
          </div>

          {/* ── FINE PRINT ── */}
          <div style={{ background: "#1e293b", padding: "10px 40px", textAlign: "center" }}>
            <span style={{ fontSize: "10px", color: "#64748b", letterSpacing: "0.3px" }}>
              © 2026 MyPassUK · For GCSE &amp; A-Level students across England, Wales &amp; Scotland
            </span>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #flyer, #flyer * { visibility: visible; }
          #flyer {
            position: fixed;
            top: 0; left: 50%;
            transform: translateX(-50%);
            width: 595px;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
