import type { LucideIcon } from "lucide-react";
import { BarChart3, BookOpen, ClipboardList, Target } from "lucide-react";

export type FeatureHighlight = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const FEATURE_HIGHLIGHTS: FeatureHighlight[] = [
  {
    id: "past-mcq",
    title: "Verified past MCQs",
    description:
      "Practice exam-style questions organized by subject and difficulty so you build real test stamina.",
    icon: BookOpen,
  },
  {
    id: "live-exams",
    title: "Live exam routines",
    description:
      "Join scheduled mocks and routines aligned with competitive exam calendars.",
    icon: ClipboardList,
  },
  {
    id: "leaderboard",
    title: "Leaderboard & results",
    description:
      "See where you stand and review score breakdowns after every attempt.",
    icon: BarChart3,
  },
  {
    id: "mistakes",
    title: "Mistake analysis",
    description:
      "Spot weak topics from your wrong answers and focus the next study session.",
    icon: Target,
  },
];
