import { db, subjectsTable, eq } from "@workspace/db";

// Map of subject name → enriched usefulResources array
// All URLs are publicly accessible. YouTube links use the @handle format.
const resourceMap: Record<string, Array<{ name: string; url: string; type: string }>> = {

  // ── MATHEMATICS & STATISTICS ──────────────────────────────────────────────
  "Mathematics": [
    { name: "Maths Genie – Revision & Past Papers", url: "https://www.mathsgenie.co.uk", type: "Website" },
    { name: "Corbettmaths – Videos, Worksheets & Practice", url: "https://corbettmaths.com", type: "Practice Questions" },
    { name: "ExamSolutions – A-Level Maths Tutorials", url: "https://www.examsolutions.net/maths/", type: "Video" },
    { name: "BBC Bitesize – GCSE Maths", url: "https://www.bbc.co.uk/bitesize/subjects/z38pycw", type: "Website" },
    { name: "Save My Exams – GCSE Maths", url: "https://www.savemyexams.com/gcse/maths/", type: "Past Papers" },
    { name: "Save My Exams – A-Level Maths", url: "https://www.savemyexams.com/a-level/maths/", type: "Past Papers" },
    { name: "Physics & Maths Tutor – Maths Revision", url: "https://www.physicsandmathstutor.com/maths-revision/", type: "Revision Guide" },
    { name: "Khan Academy – Maths", url: "https://www.khanacademy.org/math", type: "Video" },
  ],

  "Further Mathematics": [
    { name: "ExamSolutions – Further Maths Tutorials", url: "https://www.examsolutions.net/further-maths/", type: "Video" },
    { name: "Physics & Maths Tutor – Further Maths", url: "https://www.physicsandmathstutor.com/maths-revision/", type: "Past Papers" },
    { name: "Save My Exams – A-Level Further Maths", url: "https://www.savemyexams.com/a-level/further-maths/", type: "Past Papers" },
    { name: "3Blue1Brown YouTube – Essence of Maths", url: "https://www.youtube.com/@3blue1brown", type: "Video" },
    { name: "Integral Maths – MEI Resources", url: "https://integralmaths.org", type: "Website" },
  ],

  "Statistics": [
    { name: "Maths Genie – Statistics Revision", url: "https://www.mathsgenie.co.uk", type: "Website" },
    { name: "Save My Exams – GCSE Statistics", url: "https://www.savemyexams.com/gcse/statistics/", type: "Past Papers" },
    { name: "Physics & Maths Tutor – Statistics", url: "https://www.physicsandmathstutor.com/maths-revision/", type: "Revision Guide" },
    { name: "BBC Bitesize – Statistics (Maths)", url: "https://www.bbc.co.uk/bitesize/subjects/z38pycw", type: "Website" },
  ],

  // ── ENGLISH ───────────────────────────────────────────────────────────────
  "English Language": [
    { name: "BBC Bitesize – GCSE English Language", url: "https://www.bbc.co.uk/bitesize/subjects/zr9d7ty", type: "Website" },
    { name: "Mr Bruff – English YouTube Channel", url: "https://www.youtube.com/@mrbruff", type: "Video" },
    { name: "Save My Exams – GCSE English Language", url: "https://www.savemyexams.com/gcse/english-language/", type: "Past Papers" },
    { name: "GCSE Pod – English Language", url: "https://www.gcsepod.com", type: "Website" },
    { name: "Seneca Learning – English Language", url: "https://senecalearning.com/en-gb/", type: "Website" },
  ],

  "English Literature": [
    { name: "BBC Bitesize – GCSE English Literature", url: "https://www.bbc.co.uk/bitesize/subjects/zr9d7ty", type: "Website" },
    { name: "Mr Bruff – English YouTube Channel", url: "https://www.youtube.com/@mrbruff", type: "Video" },
    { name: "Sparknotes – Study Guides", url: "https://www.sparknotes.com", type: "Website" },
    { name: "Litcharts – Text Analysis", url: "https://www.litcharts.com", type: "Website" },
    { name: "Save My Exams – GCSE English Literature", url: "https://www.savemyexams.com/gcse/english-literature/", type: "Past Papers" },
    { name: "Seneca Learning – English Literature", url: "https://senecalearning.com/en-gb/", type: "Website" },
  ],

  "English Language and Literature": [
    { name: "AQA English Language and Literature Spec & Resources", url: "https://www.aqa.org.uk/subjects/english/as-and-a-level/english-language-and-literature-7707", type: "Past Papers" },
    { name: "Mr Bruff – A-Level English YouTube", url: "https://www.youtube.com/@mrbruff", type: "Video" },
    { name: "Oxford Language and Literature Resource Centre", url: "https://www.oup.com/uk/secondary/english/", type: "Revision Guide" },
    { name: "BBC Bitesize – A-Level English", url: "https://www.bbc.co.uk/bitesize/subjects/zr9d7ty", type: "Website" },
  ],

  // ── SCIENCES ──────────────────────────────────────────────────────────────
  "Combined Science": [
    { name: "Freesciencelessons – GCSE Revision Videos", url: "https://www.freesciencelessons.co.uk/gcse-revision-videos/", type: "Video" },
    { name: "BBC Bitesize – Combined Science", url: "https://www.bbc.co.uk/bitesize/subjects/zrkw2hv", type: "Website" },
    { name: "Save My Exams – GCSE Combined Science", url: "https://www.savemyexams.com/gcse/combined-science/", type: "Past Papers" },
    { name: "Physics & Maths Tutor – GCSE Sciences", url: "https://www.physicsandmathstutor.com", type: "Revision Guide" },
    { name: "Seneca Learning – Combined Science", url: "https://senecalearning.com/en-gb/", type: "Website" },
    { name: "Cognito – GCSE Science YouTube", url: "https://www.youtube.com/@CognitoEdu", type: "Video" },
  ],

  "Biology": [
    { name: "Freesciencelessons – GCSE & A-Level Biology", url: "https://www.freesciencelessons.co.uk/gcse-revision-videos/", type: "Video" },
    { name: "BBC Bitesize – Biology", url: "https://www.bbc.co.uk/bitesize/subjects/z9ddmp3", type: "Website" },
    { name: "Save My Exams – GCSE Biology", url: "https://www.savemyexams.com/gcse/biology/", type: "Past Papers" },
    { name: "Save My Exams – A-Level Biology", url: "https://www.savemyexams.com/a-level/biology/", type: "Past Papers" },
    { name: "Physics & Maths Tutor – Biology Revision", url: "https://www.physicsandmathstutor.com/biology-revision/", type: "Revision Guide" },
    { name: "Science with Hazel YouTube – A-Level Biology", url: "https://www.youtube.com/@SciencewithHazel", type: "Video" },
    { name: "Cognito – GCSE Biology YouTube", url: "https://www.youtube.com/@CognitoEdu", type: "Video" },
  ],

  "Chemistry": [
    { name: "Chemrevise – A-Level Chemistry Notes", url: "https://chemrevise.org/revision-guides/", type: "Revision Guide" },
    { name: "Freesciencelessons – GCSE & A-Level Chemistry", url: "https://www.freesciencelessons.co.uk/gcse-revision-videos/", type: "Video" },
    { name: "BBC Bitesize – Chemistry", url: "https://www.bbc.co.uk/bitesize/subjects/znxcd2p", type: "Website" },
    { name: "Save My Exams – GCSE Chemistry", url: "https://www.savemyexams.com/gcse/chemistry/", type: "Past Papers" },
    { name: "Save My Exams – A-Level Chemistry", url: "https://www.savemyexams.com/a-level/chemistry/", type: "Past Papers" },
    { name: "Physics & Maths Tutor – Chemistry Revision", url: "https://www.physicsandmathstutor.com/chemistry-revision/", type: "Revision Guide" },
    { name: "RSC – Teach Chemistry Resources", url: "https://edu.rsc.org/resources", type: "Website" },
  ],

  "Physics": [
    { name: "Freesciencelessons – GCSE & A-Level Physics", url: "https://www.freesciencelessons.co.uk/gcse-revision-videos/", type: "Video" },
    { name: "BBC Bitesize – Physics", url: "https://www.bbc.co.uk/bitesize/subjects/zng4d2p", type: "Website" },
    { name: "Save My Exams – GCSE Physics", url: "https://www.savemyexams.com/gcse/physics/", type: "Past Papers" },
    { name: "Save My Exams – A-Level Physics", url: "https://www.savemyexams.com/a-level/physics/", type: "Past Papers" },
    { name: "Physics & Maths Tutor – Physics Revision", url: "https://www.physicsandmathstutor.com/physics-revision/", type: "Revision Guide" },
    { name: "Isaac Physics – Problems & Resources", url: "https://isaacphysics.org", type: "Practice Questions" },
    { name: "MinutePhysics YouTube", url: "https://www.youtube.com/@minutephysics", type: "Video" },
  ],

  "Environmental Science": [
    { name: "AQA Environmental Science – Spec & Past Papers", url: "https://www.aqa.org.uk/subjects/science/a-level/environmental-science-7447", type: "Past Papers" },
    { name: "WWF UK – Learn About the Environment", url: "https://www.wwf.org.uk/learn", type: "Website" },
    { name: "Environment Agency – Publications", url: "https://www.gov.uk/government/organisations/environment-agency", type: "Website" },
    { name: "Cool Geography – Environment Resources", url: "https://www.coolgeography.co.uk", type: "Revision Guide" },
  ],

  // ── COMPUTING ─────────────────────────────────────────────────────────────
  "Computer Science": [
    { name: "Craig 'n' Dave – GCSE & A-Level CS Resources", url: "https://craigndave.org/", type: "Video" },
    { name: "Craig 'n' Dave – OCR J277 GCSE Revision", url: "https://student.craigndave.org/j277", type: "Website" },
    { name: "BBC Bitesize – Computer Science", url: "https://www.bbc.co.uk/bitesize/subjects/z34k7ty", type: "Website" },
    { name: "Save My Exams – GCSE Computer Science", url: "https://www.savemyexams.com/gcse/computer-science/", type: "Past Papers" },
    { name: "Raspberry Pi Foundation – Computing Education", url: "https://www.raspberrypi.org/education/", type: "Website" },
    { name: "CS Field Guide – Algorithms & Concepts", url: "https://www.csfieldguide.org.nz", type: "Website" },
    { name: "Seneca Learning – Computer Science", url: "https://senecalearning.com/en-gb/", type: "Website" },
  ],

  "Information Technology": [
    { name: "BBC Bitesize – ICT", url: "https://www.bbc.co.uk/bitesize/subjects/zf2f9j6", type: "Website" },
    { name: "Craig 'n' Dave – Cambridge Nationals IT", url: "https://student.craigndave.org", type: "Website" },
    { name: "Seneca Learning – IT Revision", url: "https://senecalearning.com/en-gb/", type: "Website" },
  ],

  // ── HUMANITIES ────────────────────────────────────────────────────────────
  "History": [
    { name: "History Learning Site – GCSE & A-Level Notes", url: "https://www.historylearningsite.co.uk/", type: "Website" },
    { name: "BBC Bitesize – History", url: "https://www.bbc.co.uk/bitesize/subjects/zk26n39", type: "Website" },
    { name: "Save My Exams – GCSE History", url: "https://www.savemyexams.com/gcse/history/", type: "Past Papers" },
    { name: "Seneca Learning – History", url: "https://senecalearning.com/en-gb/", type: "Website" },
    { name: "TomRichey YouTube – AP & A-Level History", url: "https://www.youtube.com/@TomRichey", type: "Video" },
    { name: "BBC History Extra", url: "https://www.historyextra.com", type: "Website" },
  ],

  "Ancient History": [
    { name: "Classics for All – Teaching Resources", url: "https://www.classicsforall.org.uk", type: "Website" },
    { name: "Perseus Digital Library – Greek & Latin Texts", url: "https://www.perseus.tufts.edu", type: "Website" },
    { name: "OCR Ancient History – Spec & Past Papers", url: "https://www.ocr.org.uk/qualifications/gcse/ancient-history-j198/", type: "Past Papers" },
    { name: "Johnstons Archive – Ancient History Resources", url: "https://www.johnstonarchive.net", type: "Website" },
  ],

  "Geography": [
    { name: "Internet Geography – GCSE Revision", url: "https://www.internetgeography.net/gcse-geography-revision/", type: "Website" },
    { name: "Internet Geography – AQA GCSE Resources", url: "https://www.internetgeography.net/aqa-gcse-geography/", type: "Revision Guide" },
    { name: "Cool Geography – GCSE & A-Level", url: "https://www.coolgeography.co.uk", type: "Website" },
    { name: "Save My Exams – GCSE Geography", url: "https://www.savemyexams.com/gcse/geography/", type: "Past Papers" },
    { name: "BBC Bitesize – Geography", url: "https://www.bbc.co.uk/bitesize/subjects/zkw76sg", type: "Website" },
    { name: "Geography Field Work", url: "https://geographyfieldwork.com", type: "Website" },
  ],

  "Religious Studies": [
    { name: "BBC Bitesize – Religious Studies", url: "https://www.bbc.co.uk/bitesize/subjects/zb48q6f", type: "Website" },
    { name: "Tutor2u – Religious Studies Resources", url: "https://www.tutor2u.net/religious-studies", type: "Website" },
    { name: "Save My Exams – GCSE RS", url: "https://www.savemyexams.com/gcse/religious-studies/", type: "Past Papers" },
    { name: "RS Revision – Online Notes", url: "https://www.rsrevision.com", type: "Revision Guide" },
    { name: "Seneca Learning – Religious Studies", url: "https://senecalearning.com/en-gb/", type: "Website" },
  ],

  "Philosophy": [
    { name: "Internet Encyclopedia of Philosophy", url: "https://iep.utm.edu", type: "Website" },
    { name: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu", type: "Website" },
    { name: "Wi-Phi – Philosophy YouTube Channel", url: "https://www.youtube.com/@WiPhi", type: "Video" },
    { name: "Tutor2u – Philosophy & Ethics", url: "https://www.tutor2u.net/religious-studies", type: "Website" },
    { name: "Physics & Maths Tutor – Philosophy Notes", url: "https://www.physicsandmathstutor.com/philosophy-revision/", type: "Revision Guide" },
  ],

  "Classical Civilisation": [
    { name: "Classics for All – Teaching Resources", url: "https://www.classicsforall.org.uk", type: "Website" },
    { name: "OCR Classical Civilisation – Spec & Past Papers", url: "https://www.ocr.org.uk/qualifications/gcse/classical-civilisation-j199/", type: "Past Papers" },
    { name: "Perseus Digital Library – Greek & Latin Texts", url: "https://www.perseus.tufts.edu", type: "Website" },
    { name: "The Open University – Classical Studies", url: "https://www.open.edu/openlearn/history-the-arts/classical-studies", type: "Website" },
  ],

  "Latin": [
    { name: "Cambridge Latin Course Online", url: "https://www.cambridgescp.com/cambridge-latin-course", type: "Website" },
    { name: "OCR Latin – Spec & Past Papers", url: "https://www.ocr.org.uk/qualifications/gcse/latin-j282/", type: "Past Papers" },
    { name: "Classics for All – Latin Resources", url: "https://www.classicsforall.org.uk", type: "Website" },
    { name: "Dickinson College Commentaries", url: "https://dcc.dickinson.edu", type: "Website" },
  ],

  "Politics": [
    { name: "Tutor2u – Politics Revision", url: "https://www.tutor2u.net/politics", type: "Website" },
    { name: "UK Parliament – Education Resources", url: "https://www.parliament.uk/education/", type: "Website" },
    { name: "Save My Exams – A-Level Politics", url: "https://www.savemyexams.com/a-level/politics/", type: "Past Papers" },
    { name: "BBC News – Politics", url: "https://www.bbc.co.uk/news/politics", type: "Website" },
    { name: "The Constitution Unit – UK Politics Resources", url: "https://www.ucl.ac.uk/constitution-unit/", type: "Website" },
  ],

  "Citizenship Studies": [
    { name: "Citizenship Foundation – Teaching Resources", url: "https://www.citizenshipfoundation.org.uk/resources/", type: "Website" },
    { name: "BBC Bitesize – Citizenship", url: "https://www.bbc.co.uk/bitesize/subjects/zpsvr82", type: "Website" },
    { name: "Democracy Club – UK Electoral Info", url: "https://democracyclub.org.uk", type: "Website" },
    { name: "UK Parliament – Citizenship Resources", url: "https://www.parliament.uk/education/", type: "Website" },
  ],

  // ── SOCIAL SCIENCES ───────────────────────────────────────────────────────
  "Psychology": [
    { name: "Simply Psychology – A-Level Resources", url: "https://www.simplypsychology.org/a-level-psychology.html", type: "Website" },
    { name: "Tutor2u – Psychology Revision", url: "https://www.tutor2u.net/psychology", type: "Website" },
    { name: "Save My Exams – A-Level Psychology", url: "https://www.savemyexams.com/a-level/psychology/", type: "Past Papers" },
    { name: "Physics & Maths Tutor – Psychology Notes", url: "https://www.physicsandmathstutor.com/psychology-revision/", type: "Revision Guide" },
    { name: "AQA Psychology – Spec & Past Papers", url: "https://www.aqa.org.uk/subjects/psychology/as-and-a-level/psychology-7182", type: "Past Papers" },
  ],

  "Sociology": [
    { name: "Tutor2u – Sociology Revision", url: "https://www.tutor2u.net/sociology", type: "Website" },
    { name: "Save My Exams – A-Level Sociology", url: "https://www.savemyexams.com/a-level/sociology/", type: "Past Papers" },
    { name: "Physics & Maths Tutor – Sociology Notes", url: "https://www.physicsandmathstutor.com/sociology-revision/", type: "Revision Guide" },
    { name: "AQA Sociology – Spec & Past Papers", url: "https://www.aqa.org.uk/subjects/sociology/as-and-a-level/sociology-7192", type: "Past Papers" },
    { name: "The Sociology Guy YouTube", url: "https://www.youtube.com/@thesociologyguy", type: "Video" },
  ],

  "Economics": [
    { name: "Tutor2u – Economics Revision & Livestreams", url: "https://www.tutor2u.net/economics", type: "Website" },
    { name: "Econplusdal YouTube – A-Level Economics", url: "https://www.youtube.com/@econplusdal", type: "Video" },
    { name: "Save My Exams – A-Level Economics", url: "https://www.savemyexams.com/a-level/economics/", type: "Past Papers" },
    { name: "Physics & Maths Tutor – Economics Notes", url: "https://www.physicsandmathstutor.com/economics-revision/", type: "Revision Guide" },
    { name: "The Economist – Schools Brief", url: "https://www.economist.com/schools-brief", type: "Website" },
    { name: "Khan Academy – AP Microeconomics", url: "https://www.khanacademy.org/economics-finance-domain", type: "Video" },
  ],

  "Business Studies": [
    { name: "Tutor2u – Business Studies Revision", url: "https://www.tutor2u.net/business", type: "Website" },
    { name: "Save My Exams – GCSE Business Studies", url: "https://www.savemyexams.com/gcse/business-studies/", type: "Past Papers" },
    { name: "BBC Bitesize – Business Studies", url: "https://www.bbc.co.uk/bitesize/subjects/zpsvr82", type: "Website" },
    { name: "Physics & Maths Tutor – Business Notes", url: "https://www.physicsandmathstutor.com/business-revision/", type: "Revision Guide" },
    { name: "BBC News – Business", url: "https://www.bbc.co.uk/news/business", type: "Website" },
  ],

  "Law": [
    { name: "LAW Teacher – Case Studies & Notes", url: "https://www.lawteacher.net", type: "Website" },
    { name: "E-Law Resources – English Legal System", url: "https://e-lawresources.co.uk", type: "Website" },
    { name: "Tutor2u – Law Revision", url: "https://www.tutor2u.net/law", type: "Website" },
    { name: "Physics & Maths Tutor – Law Notes", url: "https://www.physicsandmathstutor.com/law-revision/", type: "Revision Guide" },
    { name: "UK Supreme Court – Judgements & Resources", url: "https://www.supremecourt.uk/education.html", type: "Website" },
  ],

  "Criminology": [
    { name: "Tutor2u – Criminology Revision", url: "https://www.tutor2u.net/criminology", type: "Website" },
    { name: "Howard League for Penal Reform", url: "https://howardleague.org", type: "Website" },
    { name: "WJEC Criminology – Spec & Resources", url: "https://www.wjec.co.uk/qualifications/criminology/", type: "Past Papers" },
    { name: "Office for National Statistics – Crime Data", url: "https://www.ons.gov.uk/peoplepopulationandcommunity/crimeandjustice", type: "Website" },
  ],

  // ── LANGUAGES ─────────────────────────────────────────────────────────────
  "French": [
    { name: "BBC Bitesize – GCSE French", url: "https://www.bbc.co.uk/bitesize/subjects/zgdqxnb", type: "Website" },
    { name: "Duolingo – French Course", url: "https://www.duolingo.com/course/fr/en/Learn-French", type: "Website" },
    { name: "Languagenut – GCSE & A-Level French", url: "https://www.languagenut.com", type: "Website" },
    { name: "Save My Exams – GCSE French", url: "https://www.savemyexams.com/gcse/french/", type: "Past Papers" },
    { name: "RFI – Learn French (Radio France)", url: "https://savoirs.rfi.fr/en/learning-french", type: "Website" },
    { name: "TV5Monde – French Learning Resources", url: "https://apprendre.tv5monde.com/en", type: "Video" },
  ],

  "Spanish": [
    { name: "BBC Bitesize – GCSE Spanish", url: "https://www.bbc.co.uk/bitesize/subjects/zfckjxs", type: "Website" },
    { name: "Duolingo – Spanish Course", url: "https://www.duolingo.com/course/es/en/Learn-Spanish", type: "Website" },
    { name: "Languagenut – GCSE & A-Level Spanish", url: "https://www.languagenut.com", type: "Website" },
    { name: "Save My Exams – GCSE Spanish", url: "https://www.savemyexams.com/gcse/spanish/", type: "Past Papers" },
    { name: "RTVE – Spanish News & Media", url: "https://www.rtve.es", type: "Website" },
    { name: "SpanishPod101 YouTube", url: "https://www.youtube.com/@SpanishPod101", type: "Video" },
  ],

  "German": [
    { name: "BBC Bitesize – GCSE German", url: "https://www.bbc.co.uk/bitesize/subjects/z7jksg8", type: "Website" },
    { name: "Deutsche Welle – Learn German", url: "https://www.dw.com/en/learn-german/s-2469", type: "Website" },
    { name: "Languagenut – GCSE & A-Level German", url: "https://www.languagenut.com", type: "Website" },
    { name: "Save My Exams – GCSE German", url: "https://www.savemyexams.com/gcse/german/", type: "Past Papers" },
    { name: "GermanPod101 YouTube", url: "https://www.youtube.com/@GermanPod101", type: "Video" },
  ],

  "Mandarin Chinese": [
    { name: "Pleco – Chinese Dictionary & Study App", url: "https://www.pleco.com", type: "Website" },
    { name: "HSK Academy – Chinese Flashcards", url: "https://www.hsk.academy", type: "Website" },
    { name: "Chinese Class 101 YouTube", url: "https://www.youtube.com/@ChineseClass101", type: "Video" },
    { name: "Save My Exams – GCSE Mandarin", url: "https://www.savemyexams.com/gcse/chinese-mandarin/", type: "Past Papers" },
    { name: "CGTN – Chinese News & Media", url: "https://www.cgtn.com", type: "Website" },
  ],

  "Italian": [
    { name: "Duolingo – Italian Course", url: "https://www.duolingo.com/course/it/en/Learn-Italian", type: "Website" },
    { name: "RAI Learn – Italian Language Resources", url: "https://www.raiscuola.rai.it/italiano/articoli/2019/03/Italiano-per-stranieri--c5b625da-6ddb-4cf1-8e24-9f7c7e3d5fc7.html", type: "Website" },
    { name: "ItalianPod101 YouTube", url: "https://www.youtube.com/@ItalianPod101", type: "Video" },
    { name: "Save My Exams – GCSE Italian", url: "https://www.savemyexams.com/gcse/italian/", type: "Past Papers" },
  ],

  "Arabic": [
    { name: "BBC Arabic – News & Media", url: "https://www.bbc.co.uk/arabic", type: "Website" },
    { name: "ArabicPod101 YouTube", url: "https://www.youtube.com/@ArabicPod101", type: "Video" },
    { name: "Madinah Arabic – Grammar Course", url: "https://www.madinaharabic.com", type: "Website" },
    { name: "Al Jazeera Arabic – News", url: "https://www.aljazeera.net", type: "Website" },
  ],

  "Russian": [
    { name: "Duolingo – Russian Course", url: "https://www.duolingo.com/course/ru/en/Learn-Russian", type: "Website" },
    { name: "RussianPod101 YouTube", url: "https://www.youtube.com/@RussianPod101", type: "Video" },
    { name: "RT – Russian News & Media", url: "https://www.rttv.ru/en/", type: "Website" },
    { name: "Russian with Max YouTube", url: "https://www.youtube.com/@RussianWithMax", type: "Video" },
  ],

  // ── CREATIVE ARTS ─────────────────────────────────────────────────────────
  "Art and Design": [
    { name: "Tate – Learn & Explore Art", url: "https://www.tate.org.uk/art/students", type: "Website" },
    { name: "BBC Bitesize – Art & Design", url: "https://www.bbc.co.uk/bitesize/subjects/z6vcwmn", type: "Website" },
    { name: "GCSE Pod – Art & Design", url: "https://www.gcsepod.com", type: "Website" },
    { name: "The Art Story – Artists & Movements", url: "https://www.theartstory.org", type: "Website" },
    { name: "National Gallery – Learning", url: "https://www.nationalgallery.org.uk/learning", type: "Website" },
  ],

  "Photography": [
    { name: "British Journal of Photography", url: "https://www.bjp-online.com", type: "Website" },
    { name: "Tate – Photography Collection", url: "https://www.tate.org.uk/art/artworks?medium=photograph", type: "Website" },
    { name: "National Portrait Gallery – Education", url: "https://www.npg.org.uk/learning/", type: "Website" },
    { name: "Cambridge School of Visual & Performing Arts", url: "https://csvpa.com", type: "Website" },
    { name: "AQA Photography – Spec & Past Papers", url: "https://www.aqa.org.uk/subjects/art-and-design/gcse/art-and-design-8201/", type: "Past Papers" },
  ],

  "Graphic Design": [
    { name: "It's Nice That – Design Inspiration", url: "https://www.itsnicethat.com", type: "Website" },
    { name: "Adobe Education Exchange", url: "https://edex.adobe.com", type: "Website" },
    { name: "Canva Design School", url: "https://www.canva.com/designschool/", type: "Website" },
    { name: "Design Museum – Explore & Learn", url: "https://designmuseum.org/learn/", type: "Website" },
    { name: "Core77 – Design Education", url: "https://www.core77.com/education", type: "Website" },
  ],

  "Music": [
    { name: "ABRSM – Music Theory Support", url: "https://www.abrsm.org/en-gb/exam-support/music-theory-support/", type: "Website" },
    { name: "musictheory.net – Free Theory Lessons", url: "https://www.musictheory.net", type: "Practice Questions" },
    { name: "BBC Bitesize – Music", url: "https://www.bbc.co.uk/bitesize/subjects/zmsvr82", type: "Website" },
    { name: "Save My Exams – GCSE Music", url: "https://www.savemyexams.com/gcse/music/", type: "Past Papers" },
    { name: "BBC Radio 3 – Music Learning", url: "https://www.bbc.co.uk/radio3/music-learning", type: "Website" },
    { name: "Teoria – Music Theory Exercises", url: "https://teoria.com", type: "Practice Questions" },
  ],

  "Music Technology": [
    { name: "Sound on Sound – Production Tutorials", url: "https://www.soundonsound.com/techniques", type: "Website" },
    { name: "Edexcel Music Technology – Spec & Resources", url: "https://qualifications.pearson.com/en/qualifications/edexcel-a-levels/music-technology-2017.html", type: "Past Papers" },
    { name: "Splice – Sound Design & Samples", url: "https://splice.com/learn", type: "Website" },
    { name: "ProducerHive YouTube – DAW Tutorials", url: "https://www.youtube.com/@ProducerHive", type: "Video" },
    { name: "AQA Music Technology – Spec & Resources", url: "https://www.aqa.org.uk/subjects/music/a-level/music-technology-7273", type: "Past Papers" },
  ],

  "Drama and Theatre Studies": [
    { name: "National Theatre Learning – Free Resources", url: "https://www.nationaltheatre.org.uk/your-visit/access-schools-and-families/schools/nt-learning/", type: "Website" },
    { name: "Drama Online Library", url: "https://www.dramaonlinelibrary.com", type: "Website" },
    { name: "BBC Bitesize – Drama", url: "https://www.bbc.co.uk/bitesize/subjects/zbckjxs", type: "Website" },
    { name: "AQA Drama – Spec & Past Papers", url: "https://www.aqa.org.uk/subjects/drama/gcse/drama-8261/", type: "Past Papers" },
    { name: "Royal Shakespeare Company – Learning", url: "https://www.rsc.org.uk/education", type: "Website" },
  ],

  "Dance": [
    { name: "One Dance UK – Education Resources", url: "https://www.onedanceuk.org/programmes/education/", type: "Website" },
    { name: "AQA Dance – Spec & Past Papers", url: "https://www.aqa.org.uk/subjects/dance/gcse/dance-8236/", type: "Past Papers" },
    { name: "ScreenDance Studies – Academic Resources", url: "https://www.screendancestudies.org", type: "Website" },
    { name: "English National Ballet – Education", url: "https://www.ballet.org.uk/education/", type: "Website" },
  ],

  "Film Studies": [
    { name: "BFI – Film Education & Resources", url: "https://www.bfi.org.uk/education-research", type: "Website" },
    { name: "Sight & Sound – BFI Film Magazine", url: "https://www.bfi.org.uk/sight-and-sound", type: "Website" },
    { name: "Into Film – Teacher Resources", url: "https://www.intofilm.org/education/resources", type: "Website" },
    { name: "AQA Film Studies – Spec & Past Papers", url: "https://www.aqa.org.uk/subjects/media-studies/a-level/media-studies-7572/", type: "Past Papers" },
    { name: "Screenonline – BFI Screen Heritage", url: "http://www.screenonline.org.uk", type: "Website" },
  ],

  "Media Studies": [
    { name: "Media Know All – Media Studies Resources", url: "https://www.mediaknowall.com", type: "Website" },
    { name: "Tutor2u – Media Studies Revision", url: "https://www.tutor2u.net/media-studies", type: "Website" },
    { name: "BFI – Media Literacy Resources", url: "https://www.bfi.org.uk/education-research/5-19-film-education-scheme-2013-16/media-literacy", type: "Website" },
    { name: "WJEC Eduqas Media Studies – Past Papers", url: "https://www.wjec.co.uk/qualifications/media-studies/", type: "Past Papers" },
  ],

  // ── DESIGN & TECHNOLOGY ───────────────────────────────────────────────────
  "Design and Technology": [
    { name: "Technology Student – D&T Revision", url: "https://www.technologystudent.com", type: "Website" },
    { name: "BBC Bitesize – Design & Technology", url: "https://www.bbc.co.uk/bitesize/subjects/zcd7wmn", type: "Website" },
    { name: "AQA D&T – Spec & Past Papers", url: "https://www.aqa.org.uk/subjects/design-and-technology/gcse/design-and-technology-8552", type: "Past Papers" },
    { name: "Save My Exams – GCSE D&T", url: "https://www.savemyexams.com/gcse/design-and-technology/", type: "Past Papers" },
    { name: "Seneca Learning – Design & Technology", url: "https://senecalearning.com/en-gb/", type: "Website" },
  ],

  "Product Design": [
    { name: "Technology Student – Product Design", url: "https://www.technologystudent.com", type: "Website" },
    { name: "Design Museum – Explore Designers", url: "https://designmuseum.org/explore-design/", type: "Website" },
    { name: "Core77 – Product Design Resources", url: "https://www.core77.com", type: "Website" },
    { name: "AQA Product Design – Spec & Past Papers", url: "https://www.aqa.org.uk/subjects/design-and-technology/a-level/design-and-technology-product-design-7552", type: "Past Papers" },
    { name: "Dezeen – Design News & Inspiration", url: "https://www.dezeen.com/design/product-design/", type: "Website" },
  ],

  "Textiles": [
    { name: "Technology Student – Textiles Revision", url: "https://www.technologystudent.com", type: "Website" },
    { name: "V&A Museum – Textiles Collection", url: "https://www.vam.ac.uk/collections/textiles", type: "Website" },
    { name: "AQA Textiles – Spec & Past Papers", url: "https://www.aqa.org.uk/subjects/art-and-design/gcse/art-and-design-8201/", type: "Past Papers" },
    { name: "Surface Design Association – Resources", url: "https://www.surfacedesign.org", type: "Website" },
  ],

  "Food Preparation and Nutrition": [
    { name: "AQA Food Prep & Nutrition – Spec & Past Papers", url: "https://www.aqa.org.uk/subjects/food-preparation-and-nutrition/gcse/food-preparation-and-nutrition-8585", type: "Past Papers" },
    { name: "BBC Good Food – Recipes & Nutrition", url: "https://www.bbcgoodfood.com", type: "Website" },
    { name: "Food A Fact of Life – Learning Resources", url: "https://www.foodafactoflife.org.uk", type: "Website" },
    { name: "British Nutrition Foundation – Education", url: "https://www.nutrition.org.uk/nutritionscience/", type: "Website" },
    { name: "Save My Exams – GCSE Food Prep", url: "https://www.savemyexams.com/gcse/food-preparation-and-nutrition/", type: "Past Papers" },
  ],

  // ── SPORT & HEALTH ────────────────────────────────────────────────────────
  "Physical Education": [
    { name: "Tutor2u – PE Revision", url: "https://www.tutor2u.net/pe", type: "Website" },
    { name: "Save My Exams – GCSE PE", url: "https://www.savemyexams.com/gcse/physical-education/", type: "Past Papers" },
    { name: "BBC Bitesize – Physical Education", url: "https://www.bbc.co.uk/bitesize/subjects/znycdmn", type: "Website" },
    { name: "Physics & Maths Tutor – PE Notes", url: "https://www.physicsandmathstutor.com/pe-revision/", type: "Revision Guide" },
    { name: "Sport England – Research & Insight", url: "https://www.sportengland.org/research-and-data", type: "Website" },
  ],

  "Sports Science": [
    { name: "BASES – British Association of Sport & Exercise Sciences", url: "https://www.bases.org.uk", type: "Website" },
    { name: "Physiopedia – Anatomy & Physiology", url: "https://www.physio-pedia.com", type: "Website" },
    { name: "Save My Exams – A-Level PE / Sports Science", url: "https://www.savemyexams.com/a-level/physical-education/", type: "Past Papers" },
    { name: "Sport & Exercise Science UK", url: "https://www.bases.org.uk/article-careers_in_sport_and_exercise_science.html", type: "Website" },
  ],

  "Health and Social Care": [
    { name: "NHS Health Careers – Job Profiles", url: "https://www.healthcareers.nhs.uk", type: "Website" },
    { name: "Tutor2u – Health & Social Care", url: "https://www.tutor2u.net/health-social-care", type: "Website" },
    { name: "Care Quality Commission – Learning Resources", url: "https://www.cqc.org.uk/guidance-providers/learning-resources", type: "Website" },
    { name: "Social Care Institute for Excellence", url: "https://www.scie.org.uk/care-providers/", type: "Website" },
    { name: "Edexcel Health & Social Care – Past Papers", url: "https://qualifications.pearson.com/en/qualifications/btec-nationals/health-and-social-care-2016.html", type: "Past Papers" },
  ],

  // ── APPLIED & VOCATIONAL ──────────────────────────────────────────────────
  "Engineering": [
    { name: "Tomorrow's Engineers – Careers Resources", url: "https://www.tomorrowsengineers.org.uk", type: "Website" },
    { name: "IET – Institution of Engineering and Technology", url: "https://www.theiet.org/career/career-support/education/", type: "Website" },
    { name: "Khan Academy – Engineering", url: "https://www.khanacademy.org/science/ap-physics-1", type: "Video" },
    { name: "Isaac Physics – Engineering Maths", url: "https://isaacphysics.org", type: "Practice Questions" },
    { name: "AQA Engineering – Spec & Past Papers", url: "https://www.aqa.org.uk/subjects/engineering/a-level/engineering-7572", type: "Past Papers" },
  ],

  "Applied Science": [
    { name: "AQA Applied Science – Spec & Resources", url: "https://www.aqa.org.uk/subjects/science/a-level/applied-science-8920", type: "Past Papers" },
    { name: "Science Museum – Learning Resources", url: "https://www.sciencemuseumgroup.org.uk/learning/", type: "Website" },
    { name: "Forensic Science International – Open Access", url: "https://www.sciencedirect.com/journal/forensic-science-international", type: "Website" },
    { name: "CLEAPSS – Science Practical Support", url: "https://www.cleapss.org.uk", type: "Website" },
  ],

  "Travel and Tourism": [
    { name: "VisitBritain – Research & Statistics", url: "https://www.visitbritain.org/research-and-statistics", type: "Website" },
    { name: "ABTA – Travel Trade Resources", url: "https://www.abta.com/industry-zone/resources", type: "Website" },
    { name: "UNWTO – World Tourism Organisation", url: "https://www.unwto.org/tourism-data", type: "Website" },
    { name: "OCR Travel & Tourism – Spec & Past Papers", url: "https://www.ocr.org.uk/qualifications/gcse/travel-and-tourism/", type: "Past Papers" },
  ],

  "Child Development": [
    { name: "NSPCC Learning – Child Development Resources", url: "https://learning.nspcc.org.uk", type: "Website" },
    { name: "BBC Bitesize – Child Development", url: "https://www.bbc.co.uk/bitesize/subjects/zrn39j6", type: "Website" },
    { name: "Foundation Years – Early Childhood Resources", url: "https://foundationyears.org.uk", type: "Website" },
    { name: "Save My Exams – GCSE Child Development", url: "https://www.savemyexams.com/gcse/child-development/", type: "Past Papers" },
  ],
};

async function updateResources() {
  console.log("Updating subject resources...");

  const subjects = await db.select({ id: subjectsTable.id, name: subjectsTable.name })
    .from(subjectsTable);

  let updated = 0;
  let skipped = 0;

  for (const subject of subjects) {
    const resources = resourceMap[subject.name];
    if (!resources) {
      console.log(`  ⚠ No resources defined for: ${subject.name}`);
      skipped++;
      continue;
    }

    await db.update(subjectsTable)
      .set({ usefulResources: resources })
      .where(eq(subjectsTable.id, subject.id));

    console.log(`  ✓ Updated: ${subject.name} (${resources.length} resources)`);
    updated++;
  }

  console.log(`\nDone! Updated ${updated} subjects. Skipped ${skipped}.`);
}

updateResources().catch((err) => {
  console.error(err);
  process.exit(1);
});
