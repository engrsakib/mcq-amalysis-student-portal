export function formatLeaderboardScore(score: number): string {
  const rounded = Math.round(score * 100) / 100;
  const text =
    Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
  return `${text} pts`;
}
