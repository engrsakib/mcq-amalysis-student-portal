import {
  convertBengaliDigitsOutsideTextBlocks,
  foldMultilineTextBlocks,
  hasBengaliLetters,
  normalizeApiLatexEscaping,
  normalizeMathPlaceholders,
  repairBareLatexCommands,
  repairDivisionAndFractionTypos,
  repairImplicitFractionEquation,
  stripInvisibleChars,
} from "@/lib/exam/math-latex-repairs";

export type ExamContentSegment =
  | { kind: "prose"; value: string }
  | { kind: "math"; value: string; display: "inline" | "block" };

export type ParsedExamContent = {
  segments: ExamContentSegment[];
  hadDelimiters: boolean;
};

function pushProse(segments: ExamContentSegment[], value: string) {
  if (!value) return;
  const prev = segments[segments.length - 1];
  if (prev?.kind === "prose") {
    prev.value += value;
    return;
  }
  segments.push({ kind: "prose", value });
}

function parseDelimitedSegments(raw: string): ParsedExamContent {
  const segments: ExamContentSegment[] = [];
  let hadDelimiters = false;
  let i = 0;
  let proseBuf = "";

  const flushProse = () => {
    if (proseBuf) {
      pushProse(segments, proseBuf);
      proseBuf = "";
    }
  };

  while (i < raw.length) {
    if (raw.startsWith("$$", i)) {
      hadDelimiters = true;
      flushProse();
      i += 2;
      const start = i;
      while (i < raw.length && !raw.startsWith("$$", i)) {
        i += 1;
      }
      const inner = raw.slice(start, i).trim();
      if (inner) {
        segments.push({ kind: "math", value: inner, display: "block" });
      }
      if (raw.startsWith("$$", i)) i += 2;
      continue;
    }

    if (raw[i] === "$" && raw[i - 1] !== "\\") {
      hadDelimiters = true;
      flushProse();
      i += 1;
      const start = i;
      while (i < raw.length) {
        if (raw[i] === "$" && raw[i - 1] !== "\\") break;
        i += 1;
      }
      const inner = raw.slice(start, i).trim();
      if (inner) {
        segments.push({ kind: "math", value: inner, display: "inline" });
      }
      if (raw[i] === "$") i += 1;
      continue;
    }

    proseBuf += raw[i];
    i += 1;
  }

  flushProse();

  if (segments.length === 0 && raw) {
    segments.push({ kind: "prose", value: raw });
  }

  return { segments, hadDelimiters };
}

/** Tokenize `$...$` / `$$...$$` vs prose without mutating prose content. */
export function parseExamContentSegments(raw: string): ParsedExamContent {
  const cleaned = stripInvisibleChars(raw.trim());
  if (!cleaned) {
    return { segments: [], hadDelimiters: false };
  }
  return parseDelimitedSegments(cleaned);
}

/** Apply API/math repairs to a single math segment (never prose). */
export function repairMathLatex(latex: string): string {
  let s = latex.trim();
  if (!s) return s;

  s = normalizeApiLatexEscaping(s);
  s = foldMultilineTextBlocks(s);
  s = s.replace(/^[\u09CD\u200C\u200D\uFEFF\s]+/, "");
  s = repairBareLatexCommands(s);
  s = repairDivisionAndFractionTypos(s);
  s = convertBengaliDigitsOutsideTextBlocks(s);
  s = s.replace(/\\frac(\d)(\d)(?!\d)/g, "\\frac{$1}{$2}");
  s = repairImplicitFractionEquation(s);
  return normalizeMathPlaceholders(s);
}

/** True when undelimited string matches raw implicit fraction API shape. */
export function isImplicitRawEquation(value: string): boolean {
  if (/\\frac\s*\{/.test(value)) return false;
  if (hasBengaliLetters(value)) return false;
  const cleaned = value.trim();
  return /^[^\s]+\s+[^\s]+\s*(\d+)?\s*(?:\\?div|÷)\s*[^\s]+\s+[^\s]+\s*$/i.test(
    cleaned
  );
}

/** @deprecated Use parseExamContentSegments + repairMathLatex */
export function prepareExamMathContent(raw: string): string {
  const parsed = parseExamContentSegments(raw);
  if (parsed.hadDelimiters) {
    return parsed.segments
      .map((seg) => {
        if (seg.kind !== "math") return seg.value;
        const inner = repairMathLatex(seg.value);
        return seg.display === "block" ? `$$${inner}$$` : `$${inner}$`;
      })
      .join("");
  }
  return repairMathLatex(raw);
}
