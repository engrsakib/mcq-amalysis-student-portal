/** Heuristic: mixed/long options need stacked layout (no circle icon). */
export function optionNeedsMultilineLayout(option: string): boolean {
  const s = option.trim();
  if (!s) return false;
  if (s.length > 44) return true;
  if (/\r?\n|\\\\/.test(s)) return true;
  if (/\\text\{/.test(s) && s.length > 20) return true;
  if (/[\u0980-\u09FF]/.test(s) && /(?:\\frac|frac\{|\$[\s\S]*\\frac)/.test(s)) {
    return true;
  }
  return false;
}
