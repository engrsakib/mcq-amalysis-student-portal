import type {
  PersonalGrowthSummary,
  PersonalGrowthTimePoint,
} from "@/lib/api/types";

export function sortTimeSeries(
  points: PersonalGrowthTimePoint[]
): PersonalGrowthTimePoint[] {
  return [...points].sort((a, b) => a.date.localeCompare(b.date));
}

export function lastNDays(
  points: PersonalGrowthTimePoint[],
  n: number
): PersonalGrowthTimePoint[] {
  const sorted = sortTimeSeries(points);
  if (n <= 0) return [];
  return sorted.slice(-n);
}

export type LastDaysSummary = {
  totalAttempts: number;
  averageTotalScore: number;
  averageCorrectRate: number;
};

export function summaryFromLastDays(
  points: PersonalGrowthTimePoint[]
): LastDaysSummary {
  if (points.length === 0) {
    return { totalAttempts: 0, averageTotalScore: 0, averageCorrectRate: 0 };
  }
  const totalAttempts = points.reduce((sum, p) => sum + p.attempts, 0);
  const averageTotalScore =
    points.reduce((sum, p) => sum + p.avgTotalScore, 0) / points.length;
  const averageCorrectRate =
    points.reduce((sum, p) => sum + p.avgCorrectRate, 0) / points.length;
  return { totalAttempts, averageTotalScore, averageCorrectRate };
}

export function formatCorrectRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

export function formatAvgTotalScore(score: number): string {
  return `${score.toFixed(1)} marks`;
}

export function formatAvgScoreValue(score: number): string {
  return score.toFixed(1);
}

export type PersonalGrowthViewModel = {
  lastThreeDays: PersonalGrowthTimePoint[];
  lastDaysSummary: LastDaysSummary;
  professionalGrade: PersonalGrowthSummary["professionalGrade"];
};

export function buildPersonalGrowthView(
  timeSeries: PersonalGrowthTimePoint[],
  summary: PersonalGrowthSummary
): PersonalGrowthViewModel {
  const lastThreeDays = lastNDays(timeSeries, 3);
  return {
    lastThreeDays,
    lastDaysSummary: summaryFromLastDays(lastThreeDays),
    professionalGrade: summary.professionalGrade,
  };
}
