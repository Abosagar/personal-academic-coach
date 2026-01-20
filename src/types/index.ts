export interface User {
  uid: string;
  email: string;
  displayName?: string;
  isEduEmail: boolean;
  createdAt: Date;
}

export interface Topic {
  id: string;
  name: string;
  nameAr: string;
  priority: 'high' | 'low';
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: Date;
}

export interface CourseFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  url?: string;
}

export interface Course {
  id: string;
  userId: string;
  name: string;
  nameAr: string;
  color: string;
  topics: Topic[];
  files: CourseFile[];
  syllabus?: CourseFile;
  createdAt: Date;
  updatedAt: Date;
  totalStudyTime: number; // in minutes
}

export interface StudySession {
  id: string;
  courseId: string;
  topicId: string;
  startedAt: Date;
  endedAt?: Date;
  duration: number; // in minutes
  completed: boolean;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  arabic: string;
}

export interface CriticalThinkingQuestion {
  id: string;
  question: string;
  hints?: string[];
}
