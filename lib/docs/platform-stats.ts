export type PlatformStat = {
  id: string;
  label: string;
  value: string;
  hint: string;
};

/** Placeholder metrics — replace via API in getPlatformStats when available. */
const PLACEHOLDER_STATS: PlatformStat[] = [
  {
    id: "students",
    label: "Registered students",
    value: "12,500+",
    hint: "Active learners on web & app",
  },
  {
    id: "downloads",
    label: "Android downloads",
    value: "8,200+",
    hint: "Google Play installs",
  },
  {
    id: "attempts",
    label: "Exam attempts",
    value: "340,000+",
    hint: "Practice & live exam sessions",
  },
  {
    id: "routines",
    label: "Routines & live classes",
    value: "120+",
    hint: "Scheduled prep programs",
  },
];

/** Server-safe stats loader; wire to backend analytics when ready. */
export async function getPlatformStats(): Promise<PlatformStat[]> {
  return PLACEHOLDER_STATS;
}
