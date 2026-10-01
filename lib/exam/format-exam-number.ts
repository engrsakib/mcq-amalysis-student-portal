export function formatExamNumber(examNumber: number): string {
  const n = Number.isFinite(examNumber) ? Math.max(0, Math.floor(examNumber)) : 0;
  return `#${String(n).padStart(4, "0")}`;
}
