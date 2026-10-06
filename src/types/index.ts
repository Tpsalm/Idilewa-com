export type RouteType =
  | 'index' | 'about' | 'base' | 'coding' | 'connect_students' | 'connect_teachers' | 'consent' | 'course'
  | 'ere' | 'ere_game' | 'families' | 'guides' | 'human' | 'ifa' | 'ifa_odu' | 'individuals' | 'keepers'
  | 'kids' | 'languages' | 'lesson' | 'login' | 'method' | 'oral' | 'oral_genre' | 'oriki' | 'owe'
  | 'owe_add' | 'owe_detail' | 'owe_story' | 'owe_reflection' | 'pricing' | 'profile' | 'schools'
  | 'tutor' | 'voices';

export interface Language {
  id: string;
  name: string;
  native: string;
  greeting: string;
  hello: string;
  translation: string;
  glyph: string;
  region: string;
  tint: string;
  lessons: string;
}

export interface SoonLanguage {
  id: string;
  name: string;
  region: string;
  glyph: string;
}

export interface NavItem {
  label: string;
  route: RouteType;
  group: string;
}

export interface PageMetaCard {
  title: string;
  text: string;
  icon: string;
  route: RouteType;
  tone: string;
}

export interface PageMeta {
  title: string;
  eyebrow: string;
  desc: string;
  icon: string;
  image: string;
  imageAlt: string;
  active: number;
  flow: string[];
  cta?: string;
  ctaRoute?: RouteType;
  cards: PageMetaCard[];
}

export interface ConsentState {
  requestCode: string;
  approvedCode: string;
  approved: boolean;
  learnerAlias: string;
  accountApproved: boolean;
  tutorApproved: boolean;
  tutorId: string;
  childVerified: boolean;
  tutorValidatedFor: string;
  assignmentAccepted: boolean;
  requestedAt: string;
  approvedAt: string;
  expiresAt: number;
}

export interface CodingState {
  stage: number;
  techId: string;
  level: string;
  missionId: string;
  helperLanguage: string;
  search: string;
  points: number;
  streak: number;
  lastPracticeDate: string;
  completed: string[];
  draft: string;
  result: string;
  questCommands: string[];
  questTrail: Array<{ x: number; y: number }>;
  questResult: string;
}

export interface TeacherRequest {
  id: string;
  learnerName: string;
  guardianName: string;
  language: string;
  level: string;
  notes: string;
  date: string;
}

export interface TeacherReply {
  id: string;
  teacherId: string;
  teacherName: string;
  message: string;
  date: string;
}

export interface AppState {
  currentLang: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  streak: number;
  completed: string[];
  lessonResponses: Record<string, string>;
  quizResults: Record<string, boolean>;
  rewarded: Record<string, boolean>;
  saved: string[];
  savedProverbs: string[];
  reflections: Array<{ text: string; date: string }>;
  reflectionFeeling: string;
  teacherRequests: TeacherRequest[];
  teacherReplies: TeacherReply[];
  teacherFilter: string;
  interested: string[];
  available: Record<string, boolean>;
  loginMode: 'signin' | 'signup' | 'forgot';
  billing: 'monthly' | 'annual';
  consent: ConsentState;
  coding: CodingState;
}

export interface Proverb {
  id: string;
  text: string;
  literal: string;
  meaning: string;
  context: string;
  origin: string;
  language: string;
  story: string;
  questions: Array<{ question: string; options: string[]; answer: number }>;
  reflectionPrompt: string;
}

export interface AiChatMessage {
  role: 'user' | 'assistant';
  text: string;
}
