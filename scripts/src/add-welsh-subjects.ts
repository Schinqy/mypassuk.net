import { db } from "@workspace/db";
import { subjectsTable } from "@workspace/db/schema";

const welshSubjects = [
  {
    name: "Welsh Baccalaureate (WBQ)",
    level: "Welsh Bacc",
    category: "Qualifications",
    description: "The Welsh Baccalaureate Qualification (WBQ) is a distinctive Welsh qualification taken alongside GCSEs or A-Levels. It develops essential skills — critical thinking, communication, planning and digital literacy — through a Skills Challenge Certificate and individual and group projects.",
    examBoards: ["Qualifications Wales", "WJEC"],
    studyTips: [
      "Start your Individual Project early — it takes much longer than students expect",
      "Keep a reflective learning log throughout the course; don't leave it to the last minute",
      "Use the Skills Challenge Certificate tasks to practice real-world problem solving",
      "Read the mark scheme carefully for each component — marks are easy to lose by missing key criteria",
      "Your Community Challenge is worth significant marks — document everything you do",
      "Treat the WBQ as seriously as your other qualifications — many Welsh universities expect it",
    ],
    keyTopics: [
      "Skills Challenge Certificate",
      "Individual Project",
      "Community Challenge",
      "Enterprise & Employability Challenge",
      "Global Citizenship Challenge",
      "Welsh Language Skills",
      "Critical Thinking & Problem Solving",
      "Digital Literacy",
      "Communication Skills",
    ],
    assessmentStructure: "Foundation WBQ: Skills Challenge Certificate (SCC) at GCSE standard. National WBQ (Level 3): Skills Challenge Certificate at AS/A Level standard. Both include an Individual Project, Community Challenge, Enterprise & Employability, and Global Citizenship component.",
    usefulResources: [
      { name: "WJEC – Welsh Baccalaureate Resources", url: "https://www.wjec.co.uk/qualifications/welsh-baccalaureate-qualification/", type: "Website" },
      { name: "Qualifications Wales – WBQ Overview", url: "https://www.qualificationswales.org/english/qualifications/the-welsh-baccalaureate/", type: "Website" },
      { name: "BBC Bitesize – Skills for the WBQ", url: "https://www.bbc.co.uk/bitesize/wales", type: "Website" },
      { name: "Hwb – Welsh Government Learning Platform", url: "https://hwb.gov.wales", type: "Website" },
      { name: "WJEC – WBQ Past Papers & Mark Schemes", url: "https://www.wjec.co.uk/home/search/?q=welsh+baccalaureate", type: "Past Papers" },
    ],
    relatedCareers: [],
  },
  {
    name: "Welsh Language",
    level: "Both",
    category: "Languages",
    description: "Welsh Language GCSE and A-Level are offered in two tiers: Welsh First Language (for native/fluent speakers) and Welsh Second Language (for learners). Welsh is a compulsory subject in all state schools in Wales up to age 16. Proficiency in Welsh opens doors to public sector jobs, media, and education roles in Wales.",
    examBoards: ["WJEC"],
    studyTips: [
      "Watch S4C and listen to BBC Radio Cymru to immerse yourself in the language",
      "Practise oral assessments by recording yourself and listening back",
      "Learn common idioms and phrases — they're heavily rewarded in writing tasks",
      "Use the WJEC Understanding Standards documents to see what top marks look like",
      "First Language and Second Language have very different expectations — check which tier you're entered for",
    ],
    keyTopics: [
      "Reading Comprehension", "Creative and Formal Writing", "Oral Assessment", "Listening Skills",
      "Literary Study (First Language)", "Grammar and Vocabulary", "Welsh Culture and Society",
      "Translation (Second Language)",
    ],
    assessmentStructure: "GCSE: Reading, Writing, Speaking & Listening components. A-Level: Additional literary analysis and extended writing. WJEC is the sole exam board for Welsh Language.",
    usefulResources: [
      { name: "WJEC – Welsh Past Papers", url: "https://www.wjec.co.uk/home/search/?q=welsh+language", type: "Past Papers" },
      { name: "BBC Bitesize – Welsh Language (GCSE)", url: "https://www.bbc.co.uk/bitesize/subjects/z2hxrwx", type: "Website" },
      { name: "Duolingo – Learn Welsh", url: "https://www.duolingo.com/course/cy/en/Learn-Welsh", type: "Website" },
      { name: "S4C – Welsh Language TV", url: "https://www.s4c.cymru", type: "Website" },
      { name: "Hwb – Welsh Language Resources", url: "https://hwb.gov.wales", type: "Website" },
    ],
    relatedCareers: [],
  },
];

async function main() {
  console.log(`Seeding ${welshSubjects.length} Welsh subjects...`);
  for (const subject of welshSubjects) {
    await db.insert(subjectsTable).values(subject).onConflictDoNothing();
    console.log(`  ✓ ${subject.level} – ${subject.name}`);
  }
  console.log("Done!");
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
