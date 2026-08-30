/* All page copy in one place so the Arabic build is a translation, not a rewrite.
   Product descriptions marked TODO are still guesses — the live product pages
   for those three carry placeholder Latin text, so real copy is needed. */

export const nav = {
  /* No "About" link yet: it pointed at /about, which does not exist, so every
     click landed on a 404. Add it back with the page. */
  links: [
    { label: "Systems", href: "#systems" },
    { label: "Solutions", href: "#who" },
    { label: "Customers", href: "#story" },
    { label: "Insights", href: "#insights" },
  ],
  cta: "Book a demo",
  langLabel: "AR",
  langHref: "/ar",
};

export const hero = {
  headline: ["Every system your", "institution runs —", "built by one company."],
  tagline: "Thirteen systems for education · one Saudi company",
  intro:
    "Admissions, transport, content, private lessons, exam preparation, training, and charity management. Take only the systems your institution actually needs.",
  fieldLabel: "Get started",
  fieldPlaceholder: "name@institution.sa",
  cta: "Book a demo",
  note: "30-minute walkthrough on your own data. No commitment.",
  groupsLabel: "Four groups · thirteen systems",
  groups: [
    { name: "School operations", count: "03" },
    { name: "Teaching & learning", count: "04" },
    { name: "Exam preparation", count: "02" },
    { name: "Training & organisations", count: "04" },
  ],
};

export const rail = {
  label: "One student, from the application form to the bus home",
  meta: "ID 20241046 · sample record",
  /* No "you are here" badge: the travelling marker is the only progress
     indicator, so a static one would contradict it. Each stage carries the
     system that produced it and when it happened instead. */
  stages: [
    { icon: "application", index: "01", name: "Application", system: "Admission & Registration", when: "submitted 04 Jan" },
    { icon: "enrolment", index: "02", name: "Enrolment", system: "Admission & Registration", when: "confirmed 19 Jan" },
    { icon: "lessons", index: "03", name: "Lessons", system: "Content Management", when: "every school day" },
    { icon: "bus", index: "04", name: "The bus home", system: "School Transportation", when: "07:48 this morning" },
    { icon: "updates", index: "05", name: "Parent updates", system: "Smart Teacher Assistant", when: "sent 15:20" },
  ],
};

export const stats = [
  { display: "46", label: "Institutions", note: "across Saudi Arabia" },
  { display: "1.4M", label: "Beneficiaries", note: "since 2019" },
  { display: "25,000", label: "Active students", note: "on the platform" },
  { display: "3,000", label: "Teachers & trainers", note: "using it daily" },
];

export const trust = {
  caption: "Trusted by 46 educational and charitable institutions across Saudi Arabia",
  logos: [
    { src: "/clients/01.png", alt: "Future Pathways Training Institute" },
    { src: "/clients/02.png", alt: "Ibn Khaldun Schools" },
    { src: "/clients/03.png", alt: "High Gate" },
    { src: "/clients/04.png", alt: "Al-Kalim Al-Tayyib Schools" },
    { src: "/clients/05.jpg", alt: "Challenge International School" },
    { src: "/clients/06.png", alt: "Dar Al-Ahfad Schools" },
    { src: "/clients/07.jpg", alt: "Al-Khadra Educational Foundation" },
  ],
};

export const comparison = {
  kicker: "The problem",
  headline: ["Six views of the", "same institution."],
  intro:
    "Most institutions buy each system from a different vendor, so the same student exists six times. Drag the handle to see the difference.",
  beforeLabel: "Today — six tools, six logins",
  afterLabel: "With OurEdu — one workspace",
  /* Same six facts on both sides. Only where they live changes — that is the
     whole argument, so no decorative charts are needed. */
  tools: [
    { app: "Admissions portal", value: "1,284", unit: "applicants", tag: "own login" },
    { app: "LMS · content", value: "412", unit: "courses", tag: "own login" },
    { app: "Attendance sheet", value: "96.4%", unit: "this term", tag: "spreadsheet" },
    { app: "Transport app", value: "22", unit: "routes", tag: "third party" },
    { app: "Training portal", value: "31", unit: "cohorts", tag: "own login" },
    { app: "Parent messages", value: "3,180", unit: "guardians", tag: "no record" },
  ],
  unified: [
    { system: "Admission & Registration", value: "1,284", unit: "applicants" },
    { system: "Content Management", value: "412", unit: "courses" },
    { system: "Attendance", value: "96.4%", unit: "this term" },
    { system: "School Transportation", value: "22", unit: "routes" },
    { system: "Training Management", value: "31", unit: "cohorts" },
    { system: "Parent updates", value: "3,180", unit: "guardians" },
  ],
  unifiedFoot: "One login · one student record · one report",
  punchLead: "Six vendors, six logins, six versions of the truth. ",
  punchBlue: "One company instead.",
  hint: "Drag to compare",
};

export type SystemGroup = {
  index: string;
  count: string;
  title: string[];
  description: string;
  systems: { name: string; blurb: string; todo?: boolean }[];
};

export const systemGroups: SystemGroup[] = [
  {
    index: "01",
    count: "03 systems",
    title: ["School", "operations"],
    description:
      "Everything a school runs on daily — who applies, who is enrolled, what they study, and how they get home.",
    systems: [
      { name: "Admission & Registration", blurb: "Applications, enrolment, and the student record.", todo: true },
      { name: "School Transportation", blurb: "Track buses on their routes and monitor the school run." },
      { name: "Content Management System", blurb: "Build and manage your educational content in one library.", todo: true },
    ],
  },
  {
    index: "02",
    count: "04 systems",
    title: ["Teaching", "& learning"],
    description:
      "The tools a teacher touches every day — building the lesson, running it live, and knowing it landed.",
    systems: [
      { name: "Smart Teacher Assistant", blurb: "Prepare lessons with smart tools, built around the curriculum." },
      { name: "Darosi", blurb: "Private lessons online — teach from anywhere, at any time." },
      { name: "Educational Video Game", blurb: "Build educational games with no programming experience." },
      { name: "Easy Meet", blurb: "Video meetings with recording and Google / Microsoft 365." },
    ],
  },
  {
    index: "03",
    count: "02 systems",
    title: ["Exam", "preparation"],
    description:
      "Structured practice for the tests that decide what happens next — for students sitting Qudrat, and teachers sitting licence exams.",
    systems: [
      { name: "TopQdrat", blurb: "Distance courses that lift student performance on tests." },
      { name: "Mehanyia", blurb: "Train teachers for professional licence tests." },
    ],
  },
  {
    index: "04",
    count: "04 systems",
    title: ["Training &", "organisations"],
    description:
      "For the institutions that are not schools — training centres, charities, and the teams that market and produce their content.",
    systems: [
      { name: "Training Management System", blurb: "For training centres, trainers, and internal corporate training." },
      { name: "Charitable Organization", blurb: "Automate charity operations and support decision-making." },
      { name: "Educational Content Development", blurb: "Content production — articles, ad copy, and social media." },
      { name: "Marketing for Institutions", blurb: "Marketing services for education providers.", todo: true },
    ],
  },
];

export const whoItsFor = {
  kicker: "Who it's for",
  headline: ["Three kinds of institution.", "Three different problems."],
  intro:
    "Start where it hurts most. Every path below names the systems that fit it — nothing you don't need.",
  paths: [
    {
      index: "01",
      title: ["Schools &", "educational institutions"],
      pains: [
        "Admissions still run on paper",
        "No live view of the school run",
        "Content scattered across teachers' own drives",
      ],
      systems: [
        "Admission & Registration",
        "School Transportation",
        "Content Management System",
        "Smart Teacher Assistant",
      ],
    },
    {
      index: "02",
      title: ["Training centres", "& trainers"],
      pains: [
        "Trainee records kept in separate files",
        "Certificates issued by hand",
        "No view of programme impact",
      ],
      systems: ["Training Management System", "Mehanyia", "Easy Meet"],
    },
    {
      index: "03",
      title: ["Charitable", "organisations"],
      pains: [
        "Beneficiaries tracked in spreadsheets",
        "Donor reports take weeks to assemble",
        "Decisions made without the data",
      ],
      systems: ["Charitable Organization", "Educational Content Development"],
    },
  ],
};

export const outputs = {
  kicker: "What it produces",
  headline: ["Not screenshots.", "The actual output."],
  intro:
    "Every system ends in something a person actually uses — a route sheet, a record, a certificate, a lesson plan.",
  hint: "Keep scrolling to step through each output",
  prev: "Previous output",
  next: "Next output",
  tabs: [
    { label: "Bus route sheet", source: "School Transportation" },
    { label: "Enrolment record", source: "Admission & Registration" },
    { label: "Lesson plan", source: "Smart Teacher Assistant" },
    { label: "Training certificate", source: "Training Management" },
  ],
};

export const story = {
  kicker: "Customer story",
  meta: "Arqa International · Riyadh",
  quoteLead: "Our education platform has proven to be a pioneer in the field of investment in education,",
  quoteRest: " because it has truly placed us in the first ranks among institutions.",
  author: "Mohamed bn Abdullah",
  role: "Manager · Arqa International",
  initials: "MA",
  voices: [
    {
      quote:
        "Teachers have become more interactive with students, and this brought a noticeable growth in the level of students.",
      name: "Mosaed bn Abdulrahman",
      role: "Educational Affairs Manager",
    },
    {
      quote:
        "It changed our secondary students' level for the better, because it makes them learn with enjoyment.",
      name: "Naser bn Hamad",
      role: "Secondary School Manager · Arqa National Education",
    },
  ],
};

export const security = {
  kicker: "Security & compliance",
  headline: ["Your institution's data", "stays your own."],
  intro: "Every claim below is one we can evidence in writing before you sign anything.",
  pillars: [
    {
      index: "01",
      title: "Every role sees only its own view",
      body: "Administration, teacher, guardian, and student each get their own permissions — with a full audit log of every action taken in the system.",
    },
    {
      index: "02",
      title: "Where your data is hosted",
      body: "Hosting location and data residency are confirmed in writing as part of the security review, before any contract is signed.",
      todo: true,
    },
    {
      index: "03",
      title: "Continuity and recovery",
      body: "Backup frequency and availability targets are set out in the service agreement, not left to assumption.",
      todo: true,
    },
  ],
};

export const insights = {
  kicker: "Insights",
  headline: ["From the blog."],
  all: "All articles",
  read: "Read article",
  articles: [
    {
      date: "19 Sep 2025",
      category: "National day",
      title: "Technology and the Kingdom's international position",
      cover: "arcs" as const,
    },
    {
      date: "21 Mar 2025",
      category: "Accessibility",
      title: "The role of ICT in the lives of people with Down Syndrome",
      cover: "dots" as const,
    },
    {
      date: "11 Mar 2025",
      category: "Company news",
      title: "Our Education marks National Flag Day",
      cover: "rays" as const,
    },
  ],
};

export const finalCta = {
  lead: "See it running on ",
  blue: "your own data.",
  sub: "A 30-minute walkthrough with your own numbers in it. No slides, no commitment.",
  placeholder: "name@institution.sa",
  cta: "Book a demo",
  alt: "or call",
  phone: "+966 XX XXX XXXX",
};

export const footer = {
  language: "Language",
  currentLanguage: "EN",
  alternateLanguage: "AR",
  blurb:
    "Taaleemna Investment builds the systems that run educational, training, and charitable institutions across Saudi Arabia.",
  columns: [
    {
      title: "School & teaching",
      links: ["Admission & Registration", "School Transportation", "Content Management System", "Smart Teacher Assistant"],
    },
    { title: "Learning & exams", links: ["Darosi", "Educational Video Game", "Easy Meet", "TopQdrat"] },
    {
      title: "Training & services",
      links: [
        "Mehanyia",
        "Training Management System",
        "Charitable Organization",
        "Educational Content Development",
        "Marketing for Institutions",
      ],
    },
    { title: "Company", links: ["About us", "Customers", "Insights", "Contact us", "Book a demo"] },
  ],
  legal: "© 2026 Taaleemna Investment — Our Education. All rights reserved.",
  legalLinks: ["Privacy policy", "Terms of use", "ouredu.net"],
};

export const systems = {
  kicker: "The systems",
  headline: ["Thirteen systems.", "Four groups."],
  intro:
    "Each system is sold on its own and solves one job. The ones that serve the same institution share its data.",
  railLabel: "The four groups of systems",
  prev: "Previous group",
  next: "Next group",
};

export const forms = {
  emailLabel: "Work email",
};

export const a11y = {
  platform: "The platform in use",
  numbers: "OurEdu in numbers",
  logos: "Institutions using OurEdu",
  compare: "Compare today with OurEdu",
};

/* The product panel speaks to the reader too, so its labels are translated
   like any other copy. Names and places are localised, not transliterated. */
export const product = {
  org: "Your school",
  manage: "Manage",
  teachingTools: "Teaching tools",
  nav: ["Overview", "Admissions", "Content", "Attendance", "Darosi", "Transport", "Meetings"],
  tools: ["AI Assistant", "Games"],
  user: { name: "Huda Al-Amri", role: "Academic lead", initials: "HA" },
  views: ["Attendance", "Enrolment", "Courses", "Transport", "Grades"],
  periods: ["Week", "Term", "Year"],
  search: "Search",
  searchQuery: "grade 10",
  crumb: "/ Term 2 · 2025/26",
  attendance: {
    label: "Attendance rate · term to date",
    delta: "↑ 2.1 vs Term 1",
    meta: "32 classes · 1,284 students · updated 08:14",
  },
  enrolment: {
    label: "Applications · term 2",
    of: "enrolled of 1,284 applied",
    waiting: "applications waiting on review",
    title: "Enrolment",
    term: "Term 2",
    ofApplied: "of 1,284 applied",
    funnel: ["Applied", "Screened", "Offered", "Enrolled"],
  },
  transport: {
    label: "Routes running · this morning",
    unit: "routes · 108 stops",
    title: "School transport",
    live: "Live",
    bus: "Bus",
    enRoute: "En route",
    arrived: "Arrived",
    routes: ["Al-Yasmin route", "Al-Rawdah route", "Al-Nakheel route"],
  },
  grades: {
    label: "Grades published · term 2",
    unit: "assessments · 86.3 average",
    published: "Published",
    draft: "Draft",
    rows: ["Abdullah Al-Harbi", "Norah Al-Qahtani", "Yousef Al-Dossari", "Reem Al-Anazi"],
  },
  courses: {
    title: "Courses",
    meta: "Content Management · 412 active",
    add: "Add course",
    students: "students",
    menuTitle: "Add a course from",
    menu: ["Curriculum library", "Duplicate a course", "Import .csv / SCORM"],
    list: [
      { name: "Mathematics · Grade 10", teacher: "Huda Al-Amri" },
      { name: "Arabic Language · Grade 9", teacher: "Sara Al-Qahtani" },
      { name: "Physics · Grade 11", teacher: "Omar Al-Nasser" },
      { name: "Islamic Studies · Grade 10", teacher: "Fahd Al-Harbi" },
      { name: "Science · Grade 8", teacher: "Reem Al-Anazi" },
    ],
  },
};

/* The four outputs, in words. Structural values (times, percentages, ids)
   stay where they are; everything a reader actually reads lives here. */
export const outputPanels = {
  print: "Print",
  export: "Export",
  route: {
    title: "Route 07 — Al-Yasmin",
    meta: "Morning run · Sun 12 Jan · departed 07:05",
    status: "En route",
    stopsLabel: "Stops — 5 of 6 completed · pick one",
    stops: [
      "Al-Yasmin Gate 1", "Al-Yasmin Gate 3", "King Fahd Road",
      "Al-Rawdah Square", "Al-Nakheel Circle", "School gate",
    ],
    boarded: ["+9 boarded", "+7 boarded", "+11 boarded", "+6 boarded", "+5 boarded", "arrival"],
    distance: "Distance",
    arrives: "Arrives",
    ahead: "Ahead",
    aheadValue: "2 min",
    onBoardAt: "On board at",
    of: "of 42",
    waiting: "Still waiting",
    notBoarded: ["Yousef Al-Dossari", "Maha Al-Shehri", "Saleh Al-Ghamdi", "Lama Al-Zahrani"],
    more: "more",
    notify: "Notify guardians",
  },
  enrolment: {
    title: "Application 20241046 — Norah Al-Qahtani",
    meta: "Admission & Registration · Grade 10 · 2025/26",
    status: "Enrolled",
    stagesLabel: "Application stages — 5 of 5 completed",
    stages: [
      { when: "04 Jan", name: "Submitted", note: "online form" },
      { when: "06 Jan", name: "Documents verified", note: "4 of 4 files" },
      { when: "09 Jan", name: "Interview", note: "passed" },
      { when: "12 Jan", name: "Offer issued", note: "accepted 14 Jan" },
      { when: "19 Jan", name: "Enrolled", note: "class 10-B" },
    ],
    docs: ["Birth certificate", "Previous school report", "National ID copy", "Medical form"],
    verified: "verified",
  },
  lesson: {
    title: "Lesson plan — Mathematics · Grade 10",
    meta: "Smart Teacher Assistant · 45 minutes",
    status: "Ready to send",
    structure: "Lesson structure — 45 minutes",
    blocks: ["Starter", "Direct teaching", "Guided practice", "Independent work", "Plenary"],
    durations: ["5 min", "12 min", "15 min", "10 min", "3 min"],
    objective: "Objective",
    objectives: [
      "Solve quadratic equations by factorising",
      "Recognise when factorising will not work",
      "Apply the method to a word problem",
    ],
  },
  certificate: {
    title: "Certificate CERT-2026-0148",
    meta: "Training Management System · issued 12 Jan 2026",
    status: "Verified",
    heading: "Certificate of completion",
    name: "Norah Al-Qahtani",
    completed: "has successfully completed",
    programme: "Classroom Assessment Design — Level 2",
    facts: [
      { value: "24", label: "Training hours" },
      { value: "12 Jan 2026", label: "Completion" },
      { value: "A", label: "Final grade" },
    ],
    verification: "Verification",
    rows: [
      { k: "Issued to", v: "Norah Al-Qahtani" },
      { k: "Programme", v: "Assessment Design L2" },
      { k: "Valid", v: "No expiry" },
    ],
    note: "Anyone can check this code without logging in.",
  },
};

/* The four mock screens on the systems rail. */
export const systemMocks = {
  admissions: {
    title: "New application",
    meta: "Step 2 of 4",
    badge: "Draft saved",
    fullName: "Full name",
    nameValue: "Norah Al-Qahtani",
    dob: "Date of birth",
    grade: "Grade",
    gradeValue: "Grade 10",
    mobile: "Guardian mobile",
    fee: "Registration fee",
    feeValue: "500 SAR",
    pay: "Continue to payment",
    docs: "Documents 3 / 4",
    docList: ["Birth certificate", "School report", "National ID", "Medical form"],
  },
  lesson: {
    title: "Quadratic equations",
    meta: "Grade 10 · week 09",
    badge: "Autosaved",
    kinds: ["Video", "Reading", "Game", "Quiz"],
    blocks: [
      "Worked example — factorising",
      "Method summary",
      "Factor match — 12 rounds",
      "Exit ticket — 5 questions",
    ],
    add: "Add block",
  },
  test: {
    title: "Qudrat practice · Test 04",
    meta: "TopQdrat",
    badge: "Save as template",
    answerType: "Question 4 · answer type",
    types: ["Multiple choice", "True / False", "Short answer"],
    question: "If x² − 5x + 6 = 0, what are the roots of the equation?",
    options: ["x = 1 and x = 6", "x = −2 and x = −3", "x = 2 and x = 3", "No real roots"],
    correct: "Correct",
  },
  programme: {
    title: "New programme",
    meta: "Training management",
    badge: "Draft",
    name: "Programme title",
    nameValue: "Classroom Assessment — L2",
    hours: "Total hours",
    sessions: "Sessions",
    template: "Certificate template",
    templateValue: "OurEdu standard",
    trainees: "Trainees · 31",
    people: ["Huda Al-Amri", "Maha Al-Shehri", "Faisal Al-Otaibi"],
    add: "Add trainee",
  },
};

export const cursor: Record<string, string> = {
  drag: "drag",
  explore: "explore",
  open: "open",
  read: "read",
  send: "send",
  view: "view",
};

export const chrome = {
  logoAlt: "OurEdu",
  home: "OurEdu — home",
  langSwitch: "Switch to Arabic",
};

export const whoLabels = {
  broken: "What\u2019s broken today",
  fits: "Systems that fit",
  see: "See the systems",
};

export const compareUI = {
  workspace: "Your school \u00b7 one workspace",
  oneLogin: "One login",
};

export const navUI = {
  main: "Main",
  home: "/",
};

export const preloader = {
  wordmark: "Our Education",
  tagline: "Every system your institution runs",
};
