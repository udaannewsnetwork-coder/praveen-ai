export type ExamCategory = "boards" | "defence" | "govt" | "competitive";

export interface ExamOption {
  id: string;
  category: ExamCategory;
  label: string;
  fullName: string;
  icon: string;
}

export interface UserProfile {
  id: string;
  name: string;
  targetExam: string;
  stream?: string;
  className?: string;
  daysUntilExam: number;
}

export type MessageRole = "user" | "assistant";

export interface ChatAttachment {
  type: "image";
  url: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  attachments?: ChatAttachment[];
  timestamp: number;
  isHint?: boolean;
}

export type QuestionStatus = "unattempted" | "answered" | "marked" | "answered-marked";

export interface TestQuestion {
  id: string;
  subject: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questionText: string;
  options: string[];
  correctIndex: number;
  solution: string;
}

export interface PYQItem {
  id: string;
  examCategory: string;
  subject: string;
  year: number;
  chapter: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  solution: string;
  weightage: "High" | "Medium" | "Low";
}

export interface ChapterHeat {
  chapter: string;
  subject: string;
  weightage: number;
  mastery: number;
}
