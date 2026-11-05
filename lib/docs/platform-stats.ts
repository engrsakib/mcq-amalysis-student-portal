import { fetchPublicPlatformStats } from "@/lib/api/platform-stats";

export type PlatformStat = {
  id: string;
  label: string;
  value: string;
  hint: string;
};

const STAT_DEFINITIONS = [
  {
    id: "students",
    label: "Registered students",
    hint: "Active learners on web & app",
    key: "registeredStudents" as const,
  },
  {
    id: "attempts",
    label: "Exam attempts",
    hint: "Practice & live exam sessions",
    key: "examAttempts" as const,
  },
  {
    id: "routines",
    label: "Routines & live classes",
    hint: "Scheduled prep programs",
    key: "routinesAndLiveClasses" as const,
  },
] satisfies Array<{
  id: string;
  label: string;
  hint: string;
  key: keyof Pick<
    Awaited<ReturnType<typeof fetchPublicPlatformStats>>,
    "registeredStudents" | "examAttempts" | "routinesAndLiveClasses"
  >;
}>;

function formatStatValue(value: number): string {
  return value.toLocaleString("en-US");
}

function fallbackStats(): PlatformStat[] {
  return STAT_DEFINITIONS.map((def) => ({
    id: def.id,
    label: def.label,
    value: "—",
    hint: def.hint,
  }));
}

function mapPayloadToStats(data: {
  registeredStudents: number;
  examAttempts: number;
  routinesAndLiveClasses: number;
}): PlatformStat[] {
  return STAT_DEFINITIONS.map((def) => ({
    id: def.id,
    label: def.label,
    value: formatStatValue(data[def.key]),
    hint: def.hint,
  }));
}

/** Server-safe stats loader for public documentation pages. */
export async function getPlatformStats(): Promise<PlatformStat[]> {
  try {
    const data = await fetchPublicPlatformStats();
    return mapPayloadToStats(data);
  } catch (error) {
    console.warn("[getPlatformStats] Using fallback stats:", error);
    return fallbackStats();
  }
}
