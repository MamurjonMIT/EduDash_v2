export type GradeScale = '4.0' | '5.0' | 'percentage';

export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'F';

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  grade: LetterGrade;
  numericGrade: number;
  semester: string;
  teacher: string;
  color: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  grade: string;
  section: string;
  avatar?: string;
  gpa: number;
  rank: number;
  totalStudents: number;
}

export interface RankingEntry {
  id: string;
  studentName: string;
  gpa: number;
  rank: number;
  avatar?: string;
  trend?: 'up' | 'down' | 'same';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'academic' | 'event' | 'urgent';
  date: string;
  author: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
}

export interface Transcript {
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  academicYear: string;
  courses: Course[];
  overallGPA: number;
  generatedDate: string;
}

export interface GPACalculation {
  gpa: number;
  totalCredits: number;
  totalGradePoints: number;
  letterGrade: LetterGrade;
}
