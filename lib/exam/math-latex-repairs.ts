const BENGALI_DIGIT = /[\u09E6-\u09EF]/;
const BENGALI_LETTER = /[\u0980-\u09FF]/;

export function readBracedGroup(value: string, contentStart: number): number {
  let depth = 1;
  let j = contentStart;
  while (j < value.length && depth > 0) {
    if (value[j] === "{") depth += 1;
    else if (value[j] === "}") depth -= 1;
    j += 1;
  }
  return j;
}

export function foldMultilineTextBlocks(value: string): string {
  let out = "";
  let i = 0;
  while (i < value.length) {
    if (value.startsWith("\\text{", i)) {
      const contentStart = i + 6;
      const end = readBracedGroup(value, contentStart);
      const inner = value
        .slice(contentStart, end - 1)
        .replace(/\s+/g, " ")
        .trim();
      out += `\\text{${inner}}`;
      i = end;
      continue;
    }
    out += value[i];
    i += 1;
  }
  return out;
}

/** KaTeX math mode expects ASCII digits; keep Bengali numerals inside `\\text{}`. */
export function convertBengaliDigitsOutsideTextBlocks(value: string): string {
  let out = "";
  let i = 0;
  while (i < value.length) {
    if (value.startsWith("\\text{", i)) {
      const contentStart = i + 6;
      const end = readBracedGroup(value, contentStart);
      out += value.slice(i, end);
      i = end;
      continue;
    }
    const ch = value[i];
    if (BENGALI_DIGIT.test(ch)) {
      out += String(ch.charCodeAt(0) - 0x09e6);
    } else {
      out += ch;
    }
    i += 1;
  }
  return out;
}

export function normalizeApiLatexEscaping(value: string): string {
  return value
    .replace(/&#92;/g, "\\")
    .replace(/\\\\(frac|div|sqrt|text|cdot|times|pm|left|right)\b/g, "\\$1");
}

export function repairBareLatexCommands(value: string): string {
  return value
    .replace(/(?<!\\)frac\{([^}]*)\}\{([^}]*)\}/g, "\\frac{$1}{$2}")
    .replace(/(?<!\\)sqrt\{([^}]*)\}/g, "\\sqrt{$1}")
    .replace(/(?<!\\)text\{([^}]*)\}/g, "\\text{$1}");
}

export function repairDivisionAndFractionTypos(value: string): string {
  let s = value.replace(/÷/g, "\\div ");
  s = s.replace(/\\d\{([^}]*)\}\{([^}]*)\}/g, "\\frac{$1}{$2}");
  s = s.replace(/\\d\s*(?=\\frac)/g, "");
  s = s.replace(/\\d(?![a-zA-Z{])/g, "\\div ");
  s = s.replace(/(?<!\\)div(?![a-zA-Z])/g, "\\div ");
  s = s.replace(/\^\{\s*\}/g, "");
  s = s.replace(/\s*\\div\s*/g, " \\div ");
  s = s.replace(/(\})\s*(\d+)\s*(\\div\b)/g, "$1^$2 $3");
  s = s.replace(/(\\frac\{[^}]*\}\{[^}]*\})\s*(\d+)\s*(\\div\b)/g, "$1^$2 $3");
  return s.replace(/\s{2,}/g, " ").trim();
}

export function repairImplicitFractionEquation(value: string): string {
  if (/\\frac\s*\{/.test(value)) return value;
  if (BENGALI_LETTER.test(value)) return value;

  const cleaned = value.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
  const match = cleaned.match(
    /^([^\s]+)\s+([^\s]+)\s*(\d+)?\s*(?:\\?div|÷)\s*([^\s]+)\s+([^\s]+)\s*$/i
  );
  if (!match) return value;

  const [, den1, num1, exponent, den2, num2] = match;
  const expPart = exponent ? `^${exponent}` : "";
  return `\\frac{${num1}}{${den1}}${expPart} \\div \\frac{${num2}}{${den2}}`;
}

export function normalizeMathPlaceholders(value: string): string {
  return value
    .replace(/\\frac\{\?\}\{/g, "\\frac{\\text{?}}{")
    .replace(/\\frac\{\?\}/g, "\\frac{\\text{?}}");
}

export function stripInvisibleChars(value: string): string {
  return value.replace(/[\u200B-\u200D\uFEFF]/g, "");
}

export function hasBengaliLetters(value: string): boolean {
  return BENGALI_LETTER.test(value);
}
