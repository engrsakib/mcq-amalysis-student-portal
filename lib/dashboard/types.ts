import type { LucideIcon } from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  /** When set, item is active if pathname starts with this prefix */
  activePathPrefix?: string;
  /** When true, active only on exact pathname match (for href `/`) */
  activeExact?: boolean;
  /** Open href in a new tab (external link) */
  external?: boolean;
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

export type StatCardData = {
  id: string;
  title: string;
  value: string;
  delta: string;
  deltaPositive?: boolean;
  variant: "donut" | "bars" | "line";
  donutPercent?: number;
  barValues?: number[];
  lineValues?: number[];
};

export type MonthlyExamPoint = {
  month: string;
  exams: number;
  takers: number;
};

export type SubjectStackSegment = {
  key: "easy" | "medium" | "hard" | "missed";
  label: string;
  value: number;
};

export type SubjectResultRow = {
  subject: string;
  segments: SubjectStackSegment[];
};

export type ResultTableRow = {
  id: string;
  name: string;
  subject: string;
  totalScore: number;
  reasoning: number;
  time: string;
  analysis: number[];
  startDate: string;
  genericScore: number;
};

export type DashboardMock = {
  student: {
    name: string;
    email: string;
    initials: string;
  };
  examDate: string;
  stats: StatCardData[];
  examsTakenSeries: MonthlyExamPoint[];
  subjectResults: SubjectResultRow[];
  recentResults: ResultTableRow[];
};
