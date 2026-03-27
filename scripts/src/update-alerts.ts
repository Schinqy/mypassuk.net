import { db, institutionsTable, eq } from "@workspace/db";

interface AlertData {
  annualFees: number | null;
  internationalFees: number | null;
  openDayDates: string[];
  applicationDeadline: string;
  applicationsOpen: string;
}

const alertData: Record<number, AlertData> = {
  // Universities (domestic fee £9,250/year for most)
  31: { annualFees: 9250, internationalFees: 46812, openDayDates: ["2026-06-18", "2026-09-16"], applicationDeadline: "15 October 2026", applicationsOpen: "September 2026" },
  32: { annualFees: 9250, internationalFees: 53268, openDayDates: ["2026-07-02", "2026-07-03"], applicationDeadline: "15 October 2026", applicationsOpen: "September 2026" },
  33: { annualFees: 9250, internationalFees: 40000, openDayDates: ["2026-06-20", "2026-10-17"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  34: { annualFees: 9250, internationalFees: 30000, openDayDates: ["2026-06-28", "2026-09-20"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  35: { annualFees: 9250, internationalFees: 27500, openDayDates: ["2026-06-14", "2026-10-03"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  36: { annualFees: 9250, internationalFees: 27100, openDayDates: ["2026-06-27", "2026-09-12"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  37: { annualFees: 9250, internationalFees: 14000, openDayDates: ["2026-06-20", "2026-07-11"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  38: { annualFees: 9250, internationalFees: 16500, openDayDates: ["2026-07-05", "2026-10-18"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  39: { annualFees: 9250, internationalFees: 23400, openDayDates: ["2026-11-08", "2027-02-07"], applicationDeadline: "1 October 2026", applicationsOpen: "August 2026" },
  40: { annualFees: 9250, internationalFees: 28920, openDayDates: ["2026-06-25", "2026-10-22"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  41: { annualFees: 0, internationalFees: 8500, openDayDates: ["2026-06-20", "2026-09-19"], applicationDeadline: "31 August 2026", applicationsOpen: "May 2026" },
  42: { annualFees: 0, internationalFees: 8500, openDayDates: ["2026-06-14", "2026-09-13"], applicationDeadline: "31 August 2026", applicationsOpen: "May 2026" },
  43: { annualFees: null, internationalFees: null, openDayDates: [], applicationDeadline: "Rolling admissions", applicationsOpen: "September 2026" },
  44: { annualFees: 9250, internationalFees: 17760, openDayDates: ["2026-06-21", "2026-10-04"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  45: { annualFees: 9250, internationalFees: 27160, openDayDates: ["2026-06-27", "2026-10-10"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  46: { annualFees: 9250, internationalFees: 37200, openDayDates: ["2026-06-21", "2026-09-27"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  47: { annualFees: 9250, internationalFees: 38400, openDayDates: ["2026-07-04", "2026-09-20"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  48: { annualFees: 9250, internationalFees: 26000, openDayDates: ["2026-06-13", "2026-10-03"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  49: { annualFees: 9250, internationalFees: 25800, openDayDates: ["2026-06-20", "2026-10-17"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  50: { annualFees: 9250, internationalFees: 25500, openDayDates: ["2026-06-06", "2026-10-10"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  51: { annualFees: 9250, internationalFees: 25500, openDayDates: ["2026-06-27", "2026-09-12"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  52: { annualFees: 9250, internationalFees: 24200, openDayDates: ["2026-06-28", "2026-10-11"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  53: { annualFees: 9250, internationalFees: 24000, openDayDates: ["2026-06-21", "2026-09-19"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  54: { annualFees: 9250, internationalFees: 22680, openDayDates: ["2026-06-19", "2026-10-03"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  55: { annualFees: 9250, internationalFees: 23400, openDayDates: ["2026-06-14", "2026-10-10"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  56: { annualFees: 9250, internationalFees: 25000, openDayDates: ["2026-06-21", "2026-09-26"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  57: { annualFees: 9250, internationalFees: 22700, openDayDates: ["2026-06-20", "2026-10-17"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  58: { annualFees: 4712, internationalFees: 22000, openDayDates: ["2026-06-13", "2026-10-10"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  59: { annualFees: 9250, internationalFees: 24300, openDayDates: ["2026-06-14", "2026-10-17"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  60: { annualFees: 9250, internationalFees: 24000, openDayDates: ["2026-06-28", "2026-09-26"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  61: { annualFees: 9250, internationalFees: 27440, openDayDates: ["2026-06-06", "2026-10-03"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  62: { annualFees: 9250, internationalFees: 17500, openDayDates: ["2026-07-05", "2026-10-18"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  63: { annualFees: 9250, internationalFees: 17000, openDayDates: ["2026-07-12", "2026-10-11"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  64: { annualFees: 9250, internationalFees: 17500, openDayDates: ["2026-06-27", "2026-10-10"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  65: { annualFees: 9250, internationalFees: 18000, openDayDates: ["2026-06-06", "2026-10-10"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  66: { annualFees: 9250, internationalFees: 24500, openDayDates: ["2026-06-20", "2026-10-03"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  67: { annualFees: 9250, internationalFees: 28750, openDayDates: ["2026-11-22"], applicationDeadline: "1 October 2026", applicationsOpen: "August 2026" },
  68: { annualFees: 9250, internationalFees: 27050, openDayDates: ["2026-11-08"], applicationDeadline: "1 October 2026", applicationsOpen: "August 2026" },
  69: { annualFees: 9250, internationalFees: 16500, openDayDates: ["2026-07-11", "2026-10-03"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  70: { annualFees: 9250, internationalFees: 25500, openDayDates: ["2026-06-28", "2026-10-17"], applicationDeadline: "15 January 2027", applicationsOpen: "September 2026" },
  // FE Colleges (free for 16-19 learners in England)
  71: { annualFees: 0, internationalFees: 7500, openDayDates: ["2026-06-14", "2026-09-20"], applicationDeadline: "31 August 2026", applicationsOpen: "May 2026" },
  72: { annualFees: 0, internationalFees: 7500, openDayDates: ["2026-06-21", "2026-09-12"], applicationDeadline: "31 August 2026", applicationsOpen: "May 2026" },
  73: { annualFees: 0, internationalFees: 7500, openDayDates: ["2026-06-27", "2026-09-19"], applicationDeadline: "31 August 2026", applicationsOpen: "May 2026" },
  74: { annualFees: 0, internationalFees: 7500, openDayDates: ["2026-07-04", "2026-09-20"], applicationDeadline: "31 August 2026", applicationsOpen: "May 2026" },
  75: { annualFees: 0, internationalFees: 7500, openDayDates: ["2026-06-20", "2026-10-03"], applicationDeadline: "31 August 2026", applicationsOpen: "May 2026" },
  76: { annualFees: 0, internationalFees: 7500, openDayDates: ["2026-06-21", "2026-09-13"], applicationDeadline: "31 August 2026", applicationsOpen: "May 2026" },
  77: { annualFees: 0, internationalFees: 7500, openDayDates: ["2026-06-14", "2026-09-20"], applicationDeadline: "31 August 2026", applicationsOpen: "May 2026" },
  78: { annualFees: 0, internationalFees: 7500, openDayDates: ["2026-06-28", "2026-09-12"], applicationDeadline: "31 August 2026", applicationsOpen: "May 2026" },
  79: { annualFees: 0, internationalFees: 7500, openDayDates: ["2026-07-05", "2026-10-04"], applicationDeadline: "31 August 2026", applicationsOpen: "May 2026" },
  // Apprenticeship Providers (earn while you learn — no fees)
  80: { annualFees: null, internationalFees: null, openDayDates: ["2026-09-12"], applicationDeadline: "December 2026", applicationsOpen: "September 2026" },
  81: { annualFees: null, internationalFees: null, openDayDates: ["2026-09-19"], applicationDeadline: "November 2026", applicationsOpen: "September 2026" },
  82: { annualFees: null, internationalFees: null, openDayDates: ["2026-09-26"], applicationDeadline: "November 2026", applicationsOpen: "September 2026" },
  83: { annualFees: null, internationalFees: null, openDayDates: ["2026-10-17"], applicationDeadline: "January 2027", applicationsOpen: "October 2026" },
  84: { annualFees: null, internationalFees: null, openDayDates: [], applicationDeadline: "Rolling admissions", applicationsOpen: "Year-round" },
  85: { annualFees: null, internationalFees: null, openDayDates: ["2026-10-10"], applicationDeadline: "January 2027", applicationsOpen: "September 2026" },
  86: { annualFees: null, internationalFees: null, openDayDates: ["2026-10-24"], applicationDeadline: "December 2026", applicationsOpen: "October 2026" },
  87: { annualFees: null, internationalFees: null, openDayDates: ["2026-09-19"], applicationDeadline: "January 2027", applicationsOpen: "September 2026" },
};

async function updateAlerts() {
  console.log("Updating institution recruitment alerts, fees and dates...\n");
  let updated = 0;

  for (const [idStr, data] of Object.entries(alertData)) {
    const id = Number(idStr);
    await db.update(institutionsTable)
      .set({
        annualFees: data.annualFees,
        internationalFees: data.internationalFees,
        openDayDates: data.openDayDates,
        applicationDeadline: data.applicationDeadline,
        applicationsOpen: data.applicationsOpen,
      })
      .where(eq(institutionsTable.id, id));
    updated++;
  }

  console.log(`✅ Updated ${updated} institutions with fee and alert data.`);
  process.exit(0);
}

updateAlerts().catch(e => { console.error(e); process.exit(1); });
