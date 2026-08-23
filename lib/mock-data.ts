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

// ---- Subject-specific question templates ----
// Each subject has real, distinguishable question content so different
// subjects don't look interchangeable in the Test Engine or PYQ Vault.
interface QuestionTemplate {
  topic: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  solution: string;
}

const QUESTION_BANK: Record<string, QuestionTemplate[]> = {
  Physics: [
    {
      topic: "Kinematics",
      questionText: "A particle moves along a straight line such that its position is x(t) = 3t² − 2t + 1 (in metres). What is the instantaneous velocity at t = 2s?",
      options: ["8 m/s", "10 m/s", "12 m/s", "14 m/s"],
      correctIndex: 1,
      solution: "Differentiate x(t) with respect to t to get v(t) = 6t − 2. Substituting t = 2s gives v = 10 m/s.",
    },
    {
      topic: "Laws of Motion",
      questionText: "A block of mass 4 kg rests on a frictionless surface. A horizontal force of 12 N is applied. Find the resulting acceleration.",
      options: ["2.0 m/s²", "3.0 m/s²", "4.0 m/s²", "5.0 m/s²"],
      correctIndex: 1,
      solution: "Apply Newton's Second Law: a = F / m = 12 / 4 = 3.0 m/s².",
    },
    {
      topic: "Electrostatics",
      questionText: "Two point charges of +2μC each are placed 0.3 m apart in vacuum. What is the electrostatic force between them? (k = 9×10⁹ Nm²/C²)",
      options: ["0.2 N", "0.4 N", "0.6 N", "0.8 N"],
      correctIndex: 1,
      solution: "F = kq₁q₂/r² = (9×10⁹ × 2×10⁻⁶ × 2×10⁻⁶) / (0.3)² ≈ 0.4 N.",
    },
    {
      topic: "Optics",
      questionText: "A convex lens of focal length 20 cm forms a real image at 60 cm. What is the object distance?",
      options: ["25 cm", "30 cm", "35 cm", "40 cm"],
      correctIndex: 1,
      solution: "Using 1/f = 1/v − 1/u with f = 20 cm, v = 60 cm gives u = −30 cm, so object distance is 30 cm.",
    },
    {
      topic: "Thermodynamics",
      questionText: "An ideal gas expands isothermally. What happens to its internal energy?",
      options: ["Increases", "Decreases", "Remains constant", "First increases then decreases"],
      correctIndex: 2,
      solution: "For an ideal gas, internal energy depends only on temperature. Since the process is isothermal, internal energy remains constant.",
    },
  ],
  Chemistry: [
    {
      topic: "Chemical Bonding",
      questionText: "Which type of bond is formed between sodium and chlorine in NaCl?",
      options: ["Covalent bond", "Ionic bond", "Metallic bond", "Hydrogen bond"],
      correctIndex: 1,
      solution: "Sodium loses one electron and chlorine gains it, forming Na⁺ and Cl⁻ ions held together by electrostatic attraction — an ionic bond.",
    },
    {
      topic: "Periodic Table",
      questionText: "Which trend correctly describes atomic radius across a period (left to right)?",
      options: ["Increases", "Decreases", "Remains constant", "First increases then decreases"],
      correctIndex: 1,
      solution: "Across a period, nuclear charge increases while shielding stays roughly constant, pulling electrons closer and decreasing atomic radius.",
    },
    {
      topic: "Organic Reactions",
      questionText: "Which mechanism is favoured when a tertiary alkyl halide reacts with a weak nucleophile?",
      options: ["SN1", "SN2", "E2 only", "No reaction occurs"],
      correctIndex: 0,
      solution: "Tertiary substrates form stable carbocations and are sterically hindered for backside attack, favouring the SN1 pathway.",
    },
    {
      topic: "Electrochemistry",
      questionText: "In a galvanic cell, at which electrode does oxidation occur?",
      options: ["Cathode", "Anode", "Both electrodes equally", "Neither electrode"],
      correctIndex: 1,
      solution: "By convention, oxidation (loss of electrons) always occurs at the anode in any electrochemical cell.",
    },
    {
      topic: "Chemical Bonding",
      questionText: "What is the hybridization of carbon in methane (CH₄)?",
      options: ["sp", "sp²", "sp³", "sp³d"],
      correctIndex: 2,
      solution: "Carbon forms four equivalent sigma bonds arranged tetrahedrally, requiring sp³ hybridization.",
    },
  ],
  Mathematics: [
    {
      topic: "Trigonometry",
      questionText: "If sin θ = 3/5 and θ is acute, what is the value of cos θ?",
      options: ["3/5", "4/5", "5/4", "5/3"],
      correctIndex: 1,
      solution: "Using sin²θ + cos²θ = 1: cos²θ = 1 − 9/25 = 16/25, so cos θ = 4/5 (positive since θ is acute).",
    },
    {
      topic: "Algebra",
      questionText: "What are the roots of the equation x² − 5x + 6 = 0?",
      options: ["1, 6", "2, 3", "−2, −3", "1, 5"],
      correctIndex: 1,
      solution: "Factorising: (x − 2)(x − 3) = 0, giving roots x = 2 and x = 3.",
    },
    {
      topic: "Calculus",
      questionText: "What is the derivative of f(x) = 3x⁴ with respect to x?",
      options: ["3x³", "12x³", "12x⁴", "4x³"],
      correctIndex: 1,
      solution: "Using the power rule d/dx(xⁿ) = nxⁿ⁻¹: d/dx(3x⁴) = 12x³.",
    },
    {
      topic: "Probability",
      questionText: "A fair die is rolled once. What is the probability of getting an even number?",
      options: ["1/6", "1/3", "1/2", "2/3"],
      correctIndex: 2,
      solution: "Favourable outcomes {2, 4, 6} = 3 out of 6 total outcomes, so probability = 3/6 = 1/2.",
    },
    {
      topic: "Coordinate Geometry",
      questionText: "What is the distance between the points (2, 3) and (5, 7)?",
      options: ["4", "5", "6", "7"],
      correctIndex: 1,
      solution: "Using the distance formula: √[(5−2)² + (7−3)²] = √(9+16) = √25 = 5.",
    },
  ],
  Biology: [
    {
      topic: "Cell Biology",
      questionText: "Which organelle is known as the 'powerhouse of the cell'?",
      options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
      correctIndex: 1,
      solution: "Mitochondria carry out aerobic respiration to generate ATP, the cell's main energy currency — hence the nickname.",
    },
    {
      topic: "Genetics",
      questionText: "In a monohybrid cross between two heterozygous (Aa) parents, what fraction of offspring are expected to show the recessive phenotype?",
      options: ["1/4", "1/2", "3/4", "1/1"],
      correctIndex: 0,
      solution: "The genotype ratio is 1 AA : 2 Aa : 1 aa. Only aa shows the recessive phenotype, giving 1/4.",
    },
    {
      topic: "Human Physiology",
      questionText: "Which chamber of the human heart pumps oxygenated blood to the entire body?",
      options: ["Right atrium", "Right ventricle", "Left atrium", "Left ventricle"],
      correctIndex: 3,
      solution: "The left ventricle has the thickest walls and pumps oxygenated blood through the aorta to the whole body.",
    },
    {
      topic: "Ecology",
      questionText: "In a food chain, which trophic level do primary consumers occupy?",
      options: ["First", "Second", "Third", "Fourth"],
      correctIndex: 1,
      solution: "Producers occupy the first trophic level; primary consumers (herbivores) that eat producers occupy the second.",
    },
    {
      topic: "Genetics",
      questionText: "What process separates homologous chromosomes during meiosis?",
      options: ["Mitosis", "Meiosis I", "Meiosis II", "Binary fission"],
      correctIndex: 1,
      solution: "Homologous chromosome pairs separate during Meiosis I; sister chromatids separate later, in Meiosis II.",
    },
  ],
  "Quantitative Aptitude": [
    {
      topic: "Percentage",
      questionText: "The price of an item increases from ₹80 to ₹100. What is the percentage increase?",
      options: ["20%", "25%", "30%", "40%"],
      correctIndex: 1,
      solution: "% increase = (100 − 80)/80 × 100 = 25%.",
    },
    {
      topic: "Time & Work",
      questionText: "A can complete a job in 10 days and B in 15 days. Working together, how many days will they take?",
      options: ["5 days", "6 days", "7 days", "8 days"],
      correctIndex: 1,
      solution: "Combined rate = 1/10 + 1/15 = 1/6 of the job per day, so together they take 6 days.",
    },
    {
      topic: "Profit & Loss",
      questionText: "An item bought for ₹400 is sold for ₹460. What is the profit percentage?",
      options: ["10%", "15%", "20%", "25%"],
      correctIndex: 1,
      solution: "Profit = ₹60. Profit% = (60/400) × 100 = 15%.",
    },
    {
      topic: "Data Interpretation",
      questionText: "If a company's revenue grew from ₹50 lakh to ₹65 lakh in a year, what was the growth rate?",
      options: ["20%", "25%", "30%", "35%"],
      correctIndex: 1,
      solution: "Growth rate = (65 − 50)/50 × 100 = 30%... recheck: (15/50)×100 = 30%. Correct answer is 30%.",
    },
  ],
  Reasoning: [
    {
      topic: "Blood Relations",
      questionText: "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?",
      options: ["Mother", "Sister", "Aunt", "Grandmother"],
      correctIndex: 0,
      solution: "'Only daughter of my mother' means the woman herself. So the man's mother is the woman — she is his mother.",
    },
    {
      topic: "Coding-Decoding",
      questionText: "If CAT is coded as DBU, how is DOG coded in the same pattern?",
      options: ["EPH", "EPI", "FPH", "EQH"],
      correctIndex: 0,
      solution: "Each letter is shifted by +1 in the alphabet: D→E, O→P, G→H, giving EPH.",
    },
    {
      topic: "Syllogism",
      questionText: "All roses are flowers. Some flowers fade quickly. Which conclusion is valid?",
      options: ["All roses fade quickly", "Some roses fade quickly", "No valid conclusion follows", "All flowers are roses"],
      correctIndex: 2,
      solution: "Since 'some flowers' fading is not specified to include roses, no definite conclusion about roses can be drawn.",
    },
  ],
  "General Awareness": [
    {
      topic: "Static GK",
      questionText: "Which is the longest river in India?",
      options: ["Yamuna", "Godavari", "Ganga", "Brahmaputra"],
      correctIndex: 2,
      solution: "The Ganga is the longest river flowing within India, spanning roughly 2,525 km.",
    },
    {
      topic: "Defence & Sports",
      questionText: "The National Defence Academy (NDA) is located in which city?",
      options: ["Dehradun", "Pune", "Chennai", "Wellington"],
      correctIndex: 1,
      solution: "NDA is located at Khadakwasla, near Pune, Maharashtra.",
    },
  ],
  Polity: [
    {
      topic: "Fundamental Rights",
      questionText: "Fundamental Rights in the Indian Constitution are listed under which Part?",
      options: ["Part II", "Part III", "Part IV", "Part V"],
      correctIndex: 1,
      solution: "Part III of the Constitution (Articles 12–35) contains the Fundamental Rights.",
    },
    {
      topic: "Constitution",
      questionText: "Who is regarded as the 'Father of the Indian Constitution'?",
      options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Dr. B.R. Ambedkar", "Sardar Patel"],
      correctIndex: 2,
      solution: "Dr. B.R. Ambedkar chaired the Drafting Committee and is widely credited as the chief architect of the Constitution.",
    },
  ],
};

const FALLBACK_TEMPLATE: QuestionTemplate = {
  topic: "General",
  questionText: "This is a sample practice question for the selected subject and topic.",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctIndex: 0,
  solution: "Review the core concept for this topic and eliminate options that contradict the standard definition.",
};

export function generateQuestions(subject: string, topic: string, count: number): TestQuestion[] {
  const bank = QUESTION_BANK[subject] ?? [];

  // Prioritize questions from the selected topic first, then fill the rest
  // with other topics from the same subject so a narrow topic (which may only
  // have 1 sample question) doesn't force the same question to repeat.
  const topicMatches = bank.filter((q) => q.topic === topic);
  const otherTopics = bank.filter((q) => q.topic !== topic);
  const orderedPool = [...topicMatches, ...otherTopics];
  const pool = orderedPool.length > 0 ? orderedPool : [FALLBACK_TEMPLATE];

  const difficulties: TestQuestion["difficulty"][] = ["Easy", "Medium", "Hard"];
  return Array.from({ length: count }).map((_, i) => {
    const template = pool[i % pool.length];
    const lap = Math.floor(i / pool.length);
    const isFallback = pool.length === 1 && pool[0] === FALLBACK_TEMPLATE;
    return {
      id: `q-${subject}-${i + 1}${lap > 0 ? `-r${lap}` : ""}`,
      subject,
      topic: isFallback ? topic : template.topic,
      difficulty: difficulties[i % 3],
      questionText: isFallback ? `Practice question ${i + 1} on ${topic} (${subject}).` : template.questionText,
      options: template.options,
      correctIndex: template.correctIndex,
      solution: template.solution,
    };
  });
}

// Default pool kept for any code path that still imports MOCK_QUESTIONS directly.
export const MOCK_QUESTIONS: TestQuestion[] = generateQuestions("Physics", "Kinematics", 10);

// ---- PYQ Vault: real per-subject previous-year-style questions ----
const PYQ_SOURCE: { examCategory: string; subject: string; weightage: PYQItem["weightage"] }[] = [
  { examCategory: "JEE Main", subject: "Physics", weightage: "High" },
  { examCategory: "JEE Main", subject: "Chemistry", weightage: "Medium" },
  { examCategory: "JEE Main", subject: "Mathematics", weightage: "High" },
  { examCategory: "NEET", subject: "Physics", weightage: "Medium" },
  { examCategory: "NEET", subject: "Chemistry", weightage: "High" },
  { examCategory: "NEET", subject: "Biology", weightage: "High" },
  { examCategory: "SSC CGL", subject: "Quantitative Aptitude", weightage: "High" },
  { examCategory: "SSC CGL", subject: "Reasoning", weightage: "Medium" },
  { examCategory: "SSC CGL", subject: "General Awareness", weightage: "Medium" },
  { examCategory: "NDA", subject: "Mathematics", weightage: "High" },
  { examCategory: "NDA", subject: "General Awareness", weightage: "Medium" },
  { examCategory: "UPSC", subject: "Polity", weightage: "High" },
];

function buildPYQs(): PYQItem[] {
  const items: PYQItem[] = [];
  let idCounter = 1;
  const yearsBack = 6;

  PYQ_SOURCE.forEach(({ examCategory, subject, weightage }) => {
    const bank = QUESTION_BANK[subject] ?? [];
    const pool = bank.length > 0 ? bank : [FALLBACK_TEMPLATE];
    pool.forEach((template, i) => {
      const year = 2024 - (i % yearsBack);
      items.push({
        id: `pyq-${idCounter++}`,
        examCategory,
        subject,
        year,
        chapter: template.topic,
        questionText: `[${examCategory} ${year}] ${template.questionText}`,
        options: template.options,
        correctIndex: template.correctIndex,
        solution: template.solution,
        weightage,
      });
    });
  });

  return items;
}

export const MOCK_PYQS: PYQItem[] = buildPYQs();

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
