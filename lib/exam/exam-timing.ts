export function getExamEndMs(
  examDateTime: string,
  durationMinutes: number
): number {
  return (
    new Date(examDateTime).getTime() + durationMinutes * 60 * 1000
  );
}

export function isOnTime(clientSubmittedAt: string, examEndMs: number): boolean {
  return new Date(clientSubmittedAt).getTime() <= examEndMs;
}
