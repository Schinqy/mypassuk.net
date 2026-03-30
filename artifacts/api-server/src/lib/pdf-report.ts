import PDFDocument from "pdfkit";

export interface ReportData {
  institutionName: string;
  contactName: string | null;
  city: string;
  periodMonth: number;
  periodYear: number;
  views: number;
  applyClicks: number;
  allTimeViews: number;
  allTimeClicks: number;
}

const NAVY  = "#1e3a8a";
const CRIMSON = "#9f1239";
const SLATE = "#334155";
const LIGHT = "#f8fafc";
const BORDER = "#e2e8f0";
const GREEN  = "#16a34a";
const AMBER  = "#d97706";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function monthLabel(month: number, year: number) {
  return `${MONTHS[month - 1]} ${year}`;
}

function ctrColor(ctr: number) {
  if (ctr >= 8) return GREEN;
  if (ctr >= 4) return AMBER;
  return SLATE;
}

export function generateAnalyticsPdf(data: ReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 0, info: {
      Title: `MyPassUK Analytics Report — ${data.institutionName}`,
      Author: "MyPassUK",
    }});

    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const W = 595.28;
    const margin = 48;
    const contentW = W - margin * 2;

    // ── Header band ─────────────────────────────────────────────────────────
    doc.rect(0, 0, W, 110).fill(NAVY);
    // Accent stripe
    doc.rect(0, 106, W, 4).fill(CRIMSON);

    // Logo text
    doc.font("Helvetica-Bold").fontSize(22).fillColor("white")
      .text("MyPassUK", margin, 30);
    doc.font("Helvetica").fontSize(10).fillColor("rgba(255,255,255,0.7)")
      .text("Monthly Analytics Report · Confidential", margin, 56);

    // Period badge
    const periodText = monthLabel(data.periodMonth, data.periodYear);
    const badgeW = 130;
    doc.roundedRect(W - margin - badgeW, 28, badgeW, 26, 6).fill("rgba(255,255,255,0.15)");
    doc.font("Helvetica-Bold").fontSize(10).fillColor("white")
      .text(periodText, W - margin - badgeW, 38, { width: badgeW, align: "center" });

    let y = 130;

    // ── Institution name block ────────────────────────────────────────────────
    doc.font("Helvetica-Bold").fontSize(18).fillColor(NAVY)
      .text(data.institutionName, margin, y, { width: contentW });
    y = (doc.y ?? y) + 4;

    doc.font("Helvetica").fontSize(11).fillColor(SLATE)
      .text(`Featured Partner · ${data.city}`, margin, y);
    y = (doc.y ?? y) + 6;

    // Featured badge pill
    doc.roundedRect(margin, y, 110, 20, 10).fill(NAVY);
    doc.font("Helvetica-Bold").fontSize(9).fillColor("white")
      .text("★  FEATURED LISTING", margin + 8, y + 5, { width: 94 });
    y += 32;

    // Divider
    doc.rect(margin, y, contentW, 1).fill(BORDER);
    y += 20;

    // ── This month heading ────────────────────────────────────────────────────
    doc.font("Helvetica-Bold").fontSize(13).fillColor(NAVY)
      .text(`Performance — ${periodText}`, margin, y);
    y += 24;

    // ── Stat cards (views / apply clicks / CTR) ──────────────────────────────
    const cardW = (contentW - 16) / 3;
    const cardH = 86;

    const ctr = data.views > 0
      ? parseFloat(((data.applyClicks / data.views) * 100).toFixed(1))
      : 0;

    const cards = [
      { label: "Profile Views",   value: data.views.toLocaleString(),       sub: "this month",    color: NAVY },
      { label: "Apply Clicks",    value: data.applyClicks.toLocaleString(), sub: "this month",    color: CRIMSON },
      { label: "Click-Through",   value: `${ctr}%`,                         sub: "views → clicks", color: ctrColor(ctr) },
    ];

    cards.forEach((card, i) => {
      const cx = margin + i * (cardW + 8);
      doc.roundedRect(cx, y, cardW, cardH, 8).fill(LIGHT);
      doc.rect(cx, y, cardW, 4).fill(card.color);
      doc.font("Helvetica").fontSize(9).fillColor(SLATE)
        .text(card.label.toUpperCase(), cx + 12, y + 14, { width: cardW - 24 });
      doc.font("Helvetica-Bold").fontSize(26).fillColor(card.color)
        .text(card.value, cx + 12, y + 28, { width: cardW - 24 });
      doc.font("Helvetica").fontSize(8).fillColor("#94a3b8")
        .text(card.sub, cx + 12, y + 62, { width: cardW - 24 });
    });
    y += cardH + 24;

    // ── All-time totals ───────────────────────────────────────────────────────
    doc.rect(margin, y, contentW, 1).fill(BORDER);
    y += 16;
    doc.font("Helvetica-Bold").fontSize(12).fillColor(NAVY)
      .text("All-Time Totals", margin, y);
    y += 20;

    const allCtr = data.allTimeViews > 0
      ? parseFloat(((data.allTimeClicks / data.allTimeViews) * 100).toFixed(1))
      : 0;

    const summaryRows = [
      ["Total Profile Views",    data.allTimeViews.toLocaleString()],
      ["Total Apply Clicks",     data.allTimeClicks.toLocaleString()],
      ["Overall Click-Through",  `${allCtr}%`],
    ];

    summaryRows.forEach(([label, value], i) => {
      const rowY = y + i * 26;
      if (i % 2 === 0) doc.rect(margin, rowY, contentW, 24).fill("#f1f5f9");
      doc.font("Helvetica").fontSize(10).fillColor(SLATE)
        .text(label, margin + 10, rowY + 6, { width: contentW / 2 });
      doc.font("Helvetica-Bold").fontSize(10).fillColor(NAVY)
        .text(value, margin + contentW / 2, rowY + 6, { width: contentW / 2, align: "right" });
    });
    y += summaryRows.length * 26 + 20;

    // ── What's included section ───────────────────────────────────────────────
    doc.rect(margin, y, contentW, 1).fill(BORDER);
    y += 16;
    doc.font("Helvetica-Bold").fontSize(12).fillColor(NAVY)
      .text("Your Featured Listing Includes", margin, y);
    y += 20;

    const features = [
      "Priority placement at the top of all institution searches",
      "Enhanced profile page with open day highlights",
      "Recruitment alert priority placement to high-intent students",
      'Direct "Apply Now" button linked to your application portal',
      "Monthly analytics reports delivered to your inbox",
    ];

    features.forEach(f => {
      doc.circle(margin + 6, y + 4.5, 3).fill(CRIMSON);
      doc.font("Helvetica").fontSize(10).fillColor(SLATE)
        .text(f, margin + 18, y, { width: contentW - 18 });
      y += 20;
    });
    y += 12;

    // ── Next steps / message ─────────────────────────────────────────────────
    doc.rect(margin, y, contentW, 1).fill(BORDER);
    y += 16;
    doc.roundedRect(margin, y, contentW, 56, 8).fill("#f0f9ff");
    doc.font("Helvetica").fontSize(9).fillColor(SLATE)
      .text(
        "Questions about your analytics or listing? Reply directly to this email and our team will get back to you within one business day.\n\nTo update your contact email, application URL, or profile details, please email munyaradzi.nyamasoka@gmail.com.",
        margin + 14, y + 10, { width: contentW - 28, lineGap: 3 }
      );
    y += 68;

    // ── Footer ────────────────────────────────────────────────────────────────
    const footerY = 780;
    doc.rect(0, footerY, W, 62).fill(NAVY);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("white")
      .text("MyPassUK", margin, footerY + 12);
    doc.font("Helvetica").fontSize(8).fillColor("rgba(255,255,255,0.6)")
      .text("Simunye Art Limited · 85 Great Portland Street, London W1W 7LT", margin, footerY + 26);
    doc.font("Helvetica").fontSize(8).fillColor("rgba(255,255,255,0.6)")
      .text(`Report generated ${new Date().toLocaleDateString("en-GB", { day:"numeric",month:"long",year:"numeric" })}  ·  exam-navigator-MatthewNyamasok.replit.app`, margin, footerY + 40);

    doc.end();
  });
}
