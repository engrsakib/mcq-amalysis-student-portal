import type { ProctoringEventLocal } from "@/lib/api/types";

const KEY_PREFIX = "exam-proctoring:";

function storageKey(examNumber: number): string {
  return `${KEY_PREFIX}${examNumber}`;
}

function readEvents(examNumber: number): ProctoringEventLocal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(examNumber));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ProctoringEventLocal[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEvents(examNumber: number, events: ProctoringEventLocal[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(examNumber), JSON.stringify(events));
}

export function appendBackgroundStart(examNumber: number, at: string) {
  const events = readEvents(examNumber);
  events.push({ type: "app_background", at, endedAt: null });
  writeEvents(examNumber, events);
}

export function closeLastBackgroundEvent(examNumber: number, endedAt: string) {
  const events = readEvents(examNumber);
  for (let i = events.length - 1; i >= 0; i -= 1) {
    if (events[i].endedAt === null) {
      events[i] = { ...events[i], endedAt };
      writeEvents(examNumber, events);
      return;
    }
  }
}

export function getProctoringEvents(examNumber: number): ProctoringEventLocal[] {
  return readEvents(examNumber);
}

export function clearProctoringEvents(examNumber: number) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey(examNumber));
}

export const SESSION_START_KEY_PREFIX = "exam-session-start:";

export function getOrCreateSessionStartedAt(examNumber: number): string {
  if (typeof window === "undefined") {
    return new Date().toISOString();
  }
  const key = `${SESSION_START_KEY_PREFIX}${examNumber}`;
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const started = new Date().toISOString();
  localStorage.setItem(key, started);
  return started;
}

export function clearSessionStartedAt(examNumber: number) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${SESSION_START_KEY_PREFIX}${examNumber}`);
}
