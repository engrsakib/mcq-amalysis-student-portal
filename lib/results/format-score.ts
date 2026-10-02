export function formatLeaderboardScoreValue(score: number): string {
  const rounded = Math.round(score * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

export function formatLeaderboardScore(score: number): string {
  return `${formatLeaderboardScoreValue(score)} pts`;
}
