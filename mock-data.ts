import { ExamOption, TestQuestion, PYQItem, ChapterHeat, ChatMessage } from "./types";

export const EXAM_OPTIONS: ExamOption[] = [
  { id: "class10", category: "boards", label: "10th Boards", fullName: "CBSE / State 10th Board", icon: "GraduationCap" },
  { id: "class12", category: "boards", label: "12th Boards", fullName: "CBSE / State 12th Board", icon: "GraduationCap" },
  { id: "jee", category: "competitive", label: "JEE", fullName: "Joint Entrance Examination", icon: "Atom" },
  { id: "neet", category: "competitive", label: "NEET", fullName: "National Eligibility Entrance Test", icon: "Stethoscope" },
  { id: "cuet", category: "competitive", label: "CUET", fullName: "Common University Entrance Test", icon: "BookOpenCheck" },
  { id: "ssc", category: "govt", label: "SSC", fullName: "Staff Selection Commission", icon: "FileBadge" },
  { id: "upsc", category: "govt", label: "UPSC", fullName: "Union Public Service Commission", icon: "Landmark" },
  { id: "banking", category: "govt", label: "Banking", fullName: "IBPS / SBI PO & Clerk", icon: "Banknote" },
  { id: "nda", category: "defence", label: "NDA", fullName: "National Defence Academy", icon: "Shield" },
  { id: "cds", category: "defence", label: "CDS", fullName: "Combined Defence Services", icon: "ShieldCheck" },
  { id: "airforce", category: "defence", label: "Air Force", fullName: "Indian Air Force (AFCAT/X-Y)", icon: "Plane" },
];

export const SUBJECTS_BY_EXAM: Record<string, string[]> = {
  class10: ["Mathematics", "Science", "Social Science", "English"],
  class12: ["Physics", "Chemistry", "Mathematics", "Biology"],
  jee: ["Physics", "Chemistry", "Mathematics"],
  neet: ["Physics", "Chemistry", "Biology"],
  cuet: ["General Test", "Domain Subject", "Language"],
  ssc: ["Quantitative Aptitude", "Reasoning", "English", "General Awareness"],
  upsc: ["Polity", "History", "Geography", "Economy", "Current Affairs"],
  banking: ["Quantitative Aptitude", "Reasoning", "English", "Banking Awareness"],
  nda: ["Mathematics", "General Ability Test"],
  cds: ["English", "General Knowledge", "Elementary Mathematics"],
  airforce: ["Physics", "Mathematics", "General Awareness", "Reasoning"],
};

export const TOPICS_BY_SUBJECT: Record<string, string[]> = {
  Mathematics: ["Algebra", "Trigonometry", "Calculus", "Coordinate Geometry", "Probability"],
  Physics: ["Kinematics", "Laws of Motion", "Thermodynamics", "Optics", "Electrostatics"],
  Chemistry: ["Chemical Bonding", "Organic Reactions", "Periodic Table", "Electrochemistry"],
  Biology: ["Cell Biology", "Genetics", "Human Physiology", "Ecology"],
  Science: ["Light", "Chemical Reactions", "Life Processes", "Electricity"],
  "Social Science": ["Nationalism in India", "Federalism", "Resources & Development"],
  English: ["Reading Comprehension", "Grammar", "Vocabulary"],
  "Quantitative Aptitude": ["Percentage", "Time & Work", "Profit & Loss", "Data Interpretation"],
  Reasoning: ["Puzzles", "Syllogism", "Blood Relations", "Coding-Decoding"],
  "General Awareness": ["Static GK", "Current Affairs", "Defence & Sports"],
  Polity: ["Constitution", "Fundamental Rights", "Parliament"],
  History: ["Ancient India", "Modern India", "Freedom Struggle"],
  Geography: ["Physical Geography", "Indian Geography", "World Geography"],
  Economy: ["Macroeconomics", "Indian Economy", "Budget & Finance"],
  "Current Affairs": ["National", "International", "Sports & Awards"],
  "Banking Awareness": ["RBI & Monetary Policy", "Banking History", "Financial Terms"],
  "General Ability Test": ["English", "General Knowledge"],
  "General Knowledge": ["History", "Geography", "Current Affairs"],
  "Elementary Mathematics": ["Arithmetic", "Algebra", "Mensuration"],
  "General Test": ["Reasoning", "General Awareness", "Numerical Ability"],
  "Domain Subject": ["Core Concepts", "Applications"],
  Language: ["Comprehension", "Grammar"],
};

export const MOCK_QUESTIONS: TestQuestion[] = Array.from({ length: 20 }).map((_, i) => {
  const difficulties: TestQuestion["difficulty"][] = ["Easy", "Medium", "Hard"];
  return {
    id: `q-${i + 1}`,
    subject: "Physics",
    topic: i % 2 === 0 ? "Kinematics" : "Laws of Motion",
    difficulty: difficulties[i % 3],
    questionText:
      i % 2 === 0
        ? `A particle moves along a straight line such that its position is x(t) = 3t^2 - 2t + 1 (in metres). What is the instantaneous velocity at t = ${(i % 5) + 1}s?`
        : `A block of mass ${(i % 5) + 2} kg rests on a frictionless surface. A horizontal force of ${(i % 4) + 10} N is applied. Find the resulting acceleration.`,
    options: i % 2 === 0
      ? ["4 m/s", "10 m/s", "16 m/s", "22 m/s"]
      : ["2.5 m/s²", "3.0 m/s²", "4.2 m/s²", "5.5 m/s²"],
    correctIndex: i % 4,
    solution:
      i % 2 === 0
        ? "Differentiate x(t) with respect to t to get v(t) = 6t - 2, then substitute the given value of t."
        : "Apply Newton's Second Law: a = F / m, then substitute the given force and mass values.",
  };
});

export const MOCK_PYQS: PYQItem[] = Array.from({ length: 14 }).map((_, i) => ({
  id: `pyq-${i + 1}`,
  examCategory: ["JEE Main", "NEET", "SSC CGL", "NDA"][i % 4],
  subject: ["Physics", "Chemistry", "Mathematics", "Biology"][i % 4],
  year: 2024 - (i % 10),
  chapter: ["Electrostatics", "Chemical Bonding", "Trigonometry", "Human Physiology"][i % 4],
  questionText: `[${2024 - (i % 10)}] A previous-year question testing core concepts of ${["Electrostatics", "Chemical Bonding", "Trigonometry", "Human Physiology"][i % 4]} — sample statement ${i + 1}.`,
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctIndex: i % 4,
  solution: "Step-by-step: identify the concept, apply the standard formula, and eliminate distractor options using unit analysis.",
  weightage: (["High", "Medium", "Low"] as const)[i % 3],
}));

export const CHAPTER_HEATMAP: ChapterHeat[] = [
  { chapter: "Electrostatics", subject: "Physics", weightage: 92, mastery: 40 },
  { chapter: "Organic Chemistry Basics", subject: "Chemistry", weightage: 88, mastery: 55 },
  { chapter: "Human Physiology", subject: "Biology", weightage: 85, mastery: 70 },
  { chapter: "Trigonometric Identities", subject: "Mathematics", weightage: 80, mastery: 30 },
  { chapter: "Current Electricity", subject: "Physics", weightage: 76, mastery: 62 },
  { chapter: "Chemical Kinetics", subject: "Chemistry", weightage: 70, mastery: 45 },
  { chapter: "Probability", subject: "Mathematics", weightage: 65, mastery: 80 },
  { chapter: "Genetics & Evolution", subject: "Biology", weightage: 60, mastery: 50 },
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "m1",
    role: "assistant",
    content:
      "Namaste! Main Praveen AI hoon — your personal tutor. Batao, aaj kis topic pe kaam karna hai? Aap mujhse Hindi, English ya Hinglish, kisi bhi language mein baat kar sakte ho.\n\nTry asking me something like: *\"Explain projectile motion\"* or upload a photo of a doubt.",
    timestamp: Date.now(),
  },
];
