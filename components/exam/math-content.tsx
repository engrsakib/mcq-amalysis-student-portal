"use client";

import "katex/dist/katex.min.css";
import katex from "katex";
import { Fragment, useMemo } from "react";
import {
  convertBengaliDigitsOutsideTextBlocks,
  foldMultilineTextBlocks,
  normalizeMathPlaceholders,
  readBracedGroup,
  repairBareLatexCommands,
  repairDivisionAndFractionTypos,
  stripInvisibleChars,
} from "@/lib/exam/math-latex-repairs";
import {
  isImplicitRawEquation,
  parseExamContentSegments,
  repairMathLatex,
  type ExamContentSegment,
} from "@/lib/exam/prepare-latex-content";
import { cn } from "@/lib/utils";

type MathContentProps = {
  content: string;
  displayMode?: boolean;
  className?: string;
};

type ContentSegment =
  | { kind: "text"; value: string }
  | { kind: "math"; value: string };

type FlowItem = ContentSegment | { kind: "break" };

function looksLikeLatex(value: string): boolean {
  return (
    /\\[a-zA-Z]|\\text\{|\^|_|\\frac|\\sqrt/.test(value) ||
    /(?<!\\)(frac|sqrt|text)\{/.test(value)
  );
}

function isInsideTextBlock(value: string, index: number): boolean {
  let i = 0;
  while (i < value.length) {
    if (value.startsWith("\\text{", i)) {
      const end = readBracedGroup(value, i + 6);
      if (index >= i && index < end) return true;
      i = end;
      continue;
    }
    i += 1;
  }
  return false;
}

function stripTextBlocks(value: string): string {
  let s = foldMultilineTextBlocks(value);
  let i = 0;
  let out = "";
  while (i < s.length) {
    if (s.startsWith("\\text{", i)) {
      i = readBracedGroup(s, i + 6);
      continue;
    }
    out += s[i];
    i += 1;
  }
  return out.trim();
}

function hasNonTextLatex(value: string): boolean {
  const rest = stripTextBlocks(value);
  if (!rest) return false;
  return (
    /\\frac|\\sqrt|\^|_|\\cdot|\\times|\\div|\\pm|\\leq|\\geq|\\neq|\\left|\\right/.test(
      rest
    ) ||
    /\\(?!text\b)[a-zA-Z]/.test(rest) ||
    /(?<!\\)(frac|sqrt)\{/.test(rest)
  );
}

function hasTextAndMathLatex(value: string): boolean {
  return /\\text\{/.test(value) && hasNonTextLatex(value);
}

/** Legacy undelimited normalization — not used when `$` / `$$` delimiters present. */
function normalizeExamLatex(value: string): string {
  let s = value.trim();
  s = s.replace(/[\u200B-\u200D\uFEFF]/g, "");
  s = foldMultilineTextBlocks(s);
  s = s.replace(/^[\u09CD\u200C\u200D\uFEFF\s]+/, "");
  s = s.replace(/^[\u09CD]+(?=\\text)/, "");
  s = repairBareLatexCommands(s);
  s = repairDivisionAndFractionTypos(s);
  if (looksLikeLatex(s)) {
    s = convertBengaliDigitsOutsideTextBlocks(s);
  }
  s = s.replace(/\\frac(\d)(\d)(?!\d)/g, "\\frac{$1}{$2}");
  s = s.replace(/(\\text\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})(?:\s*\1)+/g, "$1");
  return s;
}

function sanitizeProseText(text: string): string {
  return text
    .replace(/^[\u09CD\u200C\u200D\uFEFF\s]+/, "")
    .replace(/[\u09CD](?=\s|$)/g, "")
    .replace(/\s+/g, " ");
}

function dedupeRepeatedProse(text: string): string {
  const compact = sanitizeProseText(text).trim();
  if (compact.length < 40) return compact;

  const half = Math.floor(compact.length / 2);
  const first = compact.slice(0, half).trim();
  const second = compact.slice(half).trim();
  if (first === second) return first;
  if (second.startsWith(first) && first.length >= 30) return first;

  return compact;
}

function parseInlineLatexSegmentsOrdered(value: string): ContentSegment[] {
  const s = normalizeExamLatex(value);
  const segments: ContentSegment[] = [];
  const re =
    /\\text\{([^}]*)\}|\\frac\{([^}]*)\}\{([^}]*)\}|\\frac(\d)(\d)/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(s)) !== null) {
    if (m.index > last) {
      const between = sanitizeProseText(s.slice(last, m.index));
      if (between) segments.push({ kind: "text", value: between });
    }
    if (m[1] !== undefined) {
      segments.push({
        kind: "text",
        value: sanitizeProseText(m[1]),
      });
    } else if (m[2] !== undefined && m[3] !== undefined) {
      segments.push({
        kind: "math",
        value: `\\frac{${m[2]}}{${m[3]}}`,
      });
    } else if (m[4] !== undefined && m[5] !== undefined) {
      segments.push({
        kind: "math",
        value: `\\frac{${m[4]}}{${m[5]}}`,
      });
    }
    last = m.index + m[0].length;
  }

  if (last < s.length) {
    const tail = sanitizeProseText(s.slice(last));
    if (tail) segments.push({ kind: "text", value: tail });
  }

  const deduped: ContentSegment[] = [];
  for (const seg of segments) {
    const prev = deduped[deduped.length - 1];
    if (
      seg.kind === "text" &&
      prev?.kind === "text" &&
      prev.value === seg.value
    ) {
      continue;
    }
    if (seg.kind === "text" && !seg.value.trim()) continue;
    deduped.push(seg);
  }

  return deduped;
}

function latexTextSegments(value: string): string[] {
  const segments: string[] = [];
  const re = /\\text\{([^}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(value)) !== null) {
    segments.push(match[1].trim());
  }

  const deduped: string[] = [];
  for (const seg of segments) {
    if (deduped[deduped.length - 1] !== seg) deduped.push(seg);
  }
  return deduped;
}

function latexToPlainText(value: string): string {
  let s = normalizeExamLatex(value);
  s = s.replace(/\\text\{([^}]*)\}/g, "$1");
  s = s.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "$1/$2");
  s = s.replace(/\\[a-zA-Z]+\*?(\{[^}]*\})?/g, "");
  s = s.replace(/[{}\\$]/g, "");
  return dedupeRepeatedProse(s);
}

function splitAtSentenceBoundaries(text: string): string[] {
  const parts = dedupeRepeatedProse(text)
    .split(/(?<=[।?])\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 1 ? parts : [dedupeRepeatedProse(text)];
}

function firstBengaliIndex(value: string): number {
  return value.search(/[\u0980-\u09FF]/);
}

function parseLatexEquationWithTail(value: string): ContentSegment[] | null {
  const idx = firstBengaliIndex(value);
  if (idx <= 0) return null;
  if (isInsideTextBlock(value, idx)) return null;

  const mathPart = normalizeMathPlaceholders(
    repairBareLatexCommands(value.slice(0, idx).trim())
  );
  const textPart = sanitizeProseText(value.slice(idx));
  if (!mathPart || !textPart || !looksLikeLatex(mathPart)) return null;

  return [
    { kind: "math", value: repairMathLatex(mathPart) },
    { kind: "text", value: textPart },
  ];
}

function isMathGlueText(value: string): boolean {
  const t = value.trim();
  if (!t || /[\u0980-\u09FF]/.test(t)) return false;
  if (/\\(div|cdot|times|pm|frac|sqrt)/i.test(t)) return true;
  if (/^\^[\d{}]+/.test(t)) return true;
  if (/^[\d\s^\\=+\-]+$/.test(t)) return true;
  return looksLikeLatex(t) && /\\/.test(t);
}

function isEquationOnlyLatex(value: string): boolean {
  if (/[\u0980-\u09FF]/.test(stripTextBlocks(value))) return false;
  const s = normalizeExamLatex(value);
  if (!hasNonTextLatex(s)) return false;
  if (/\\frac[\s\S]*\\div[\s\S]*\\frac/.test(s)) return true;
  const fracs = s.match(/\\frac/g)?.length ?? 0;
  if (fracs >= 2 || /\\sqrt/.test(s)) return true;
  return false;
}

function coalesceMathExpressionSegments(
  segments: ContentSegment[]
): ContentSegment[] {
  const merged: ContentSegment[] = [];
  let pendingMath = "";

  const flushMath = () => {
    if (pendingMath.trim()) {
      merged.push({ kind: "math", value: pendingMath.trim() });
      pendingMath = "";
    }
  };

  for (const seg of segments) {
    if (seg.kind === "math") {
      pendingMath += seg.value;
      continue;
    }
    if (isMathGlueText(seg.value)) {
      pendingMath += seg.value;
      continue;
    }
    flushMath();
    if (seg.value.trim()) merged.push({ kind: "text", value: seg.value.trim() });
  }
  flushMath();
  return merged;
}

function segmentsToFlowItems(segments: ContentSegment[]): FlowItem[] {
  const flow: FlowItem[] = [];

  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    if (segment.kind === "math") {
      flow.push(segment);
      const next = segments[i + 1];
      if (next?.kind === "text" && !isMathGlueText(next.value)) {
        flow.push({ kind: "break" });
      }
      continue;
    }

    const lines = splitAtSentenceBoundaries(segment.value);
    for (let j = 0; j < lines.length; j += 1) {
      if (j > 0) flow.push({ kind: "break" });
      flow.push({ kind: "text", value: lines[j] });
    }
  }

  return flow;
}

function plainLines(normalized: string): string[] {
  const textSegments = latexTextSegments(normalized);
  if (textSegments.length > 1) {
    return textSegments.flatMap((line) => splitAtSentenceBoundaries(line));
  }

  const plain = looksLikeLatex(normalized)
    ? latexToPlainText(normalized)
    : dedupeRepeatedProse(normalized);

  const split = plain
    .split(/\r?\n+|\\\\/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (split.length === 1 && split[0].length > 72) {
    return splitAtSentenceBoundaries(split[0]);
  }

  return split;
}

function renderKatexString(
  latex: string,
  displayMode = false
): string | null {
  const normalized = normalizeMathPlaceholders(repairMathLatex(latex));
  if (!normalized) return null;

  try {
    const rendered = katex.renderToString(normalized, {
      displayMode,
      output: "html",
      throwOnError: false,
      strict: false,
      trust: true,
    });
    if (rendered.includes('class="katex-error"')) return null;
    return rendered;
  } catch {
    return null;
  }
}

function pickDisplayMode(normalized: string, requested: boolean): boolean {
  if (!requested) return false;
  if (/\\text\{/.test(normalized)) return false;
  return true;
}

function renderFullLatexDocument(
  normalized: string,
  displayMode: boolean
): string | null {
  if (!looksLikeLatex(normalized)) return null;

  const doc = normalizeMathPlaceholders(normalizeExamLatex(normalized));
  const mode = pickDisplayMode(doc, displayMode);

  return renderKatexString(doc, mode);
}

function shouldRenderFullLatexDocument(normalized: string): boolean {
  if (!/\\text\{/.test(normalized)) return false;
  if (!/[\u0980-\u09FF]/.test(normalized)) return false;
  return true;
}

const wrapClassName =
  "katex-wrap flex w-full min-w-0 max-w-full flex-wrap items-baseline gap-x-1 overflow-visible text-base leading-relaxed text-ink [overflow-wrap:break-word] [word-break:normal]";

function DelimitedSegmentContent({
  segments,
  className,
  displayMode,
}: {
  segments: ExamContentSegment[];
  className?: string;
  displayMode?: boolean;
}) {
  return (
    <span
      lang="bn"
      className={cn(wrapClassName, displayMode && "py-1", className)}
    >
      {segments.map((seg, index) => {
        if (seg.kind === "prose") {
          return <Fragment key={`p-${index}`}>{seg.value}</Fragment>;
        }

        const block = seg.display === "block";
        const html = renderKatexString(
          seg.value,
          block || Boolean(displayMode)
        );
        const fallback = repairMathLatex(seg.value);

        if (!html) {
          return <Fragment key={`m-${index}`}>{fallback}</Fragment>;
        }

        return (
          <span
            key={`m-${index}`}
            className={cn(
              block
                ? "my-1 block w-full max-w-full overflow-x-auto overflow-y-visible [&_.katex-display]:my-0"
                : "inline-block max-w-full align-middle whitespace-nowrap overflow-visible",
              "[&_.katex]:overflow-visible [&_.katex]:text-[1em]"
            )}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
}

function MixedFlowContent({
  flow,
  className,
  displayMode,
}: {
  flow: FlowItem[];
  className?: string;
  displayMode?: boolean;
}) {
  return (
    <span
      lang="bn"
      className={cn(wrapClassName, displayMode && "py-1", className)}
    >
      {flow.map((item, index) => {
        if (item.kind === "break") {
          return <br key={`br-${index}`} />;
        }

        if (item.kind === "text") {
          return <Fragment key={`t-${index}`}>{item.value}</Fragment>;
        }

        const useDisplay =
          Boolean(displayMode) &&
          item.value.includes("=") &&
          item.value.length > 12;
        const html = renderKatexString(item.value, useDisplay);
        if (!html) {
          return <Fragment key={`m-${index}`}>{item.value}</Fragment>;
        }

        return (
          <span
            key={`m-${index}`}
            className={cn(
              "overflow-visible [&_.katex]:overflow-visible [&_.katex-display]:my-0 [&_.katex]:text-[1em]",
              useDisplay
                ? "my-1 block w-full"
                : "inline-block max-w-full align-middle whitespace-nowrap"
            )}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
}

const proseClassName =
  "block w-full min-w-0 text-base leading-relaxed text-ink [overflow-wrap:break-word] [word-break:normal]";

function PlainProse({
  lines,
  className,
  displayMode,
}: {
  lines: string[];
  className?: string;
  displayMode?: boolean;
}) {
  return (
    <span
      lang="bn"
      className={cn(proseClassName, displayMode && "py-1", className)}
    >
      {lines.map((line, index) => (
        <Fragment key={index}>
          {index > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </span>
  );
}

type RenderMode =
  | { kind: "empty" }
  | { kind: "delimited"; segments: ExamContentSegment[] }
  | { kind: "full-document"; html: string }
  | { kind: "mixed-flow"; flow: FlowItem[] }
  | { kind: "single-html"; html: string }
  | { kind: "plain"; lines: string[]; fallback: string };

function resolveRenderMode(
  raw: string,
  displayMode: boolean
): RenderMode {
  const trimmed = raw.trim();
  if (!trimmed) return { kind: "empty" };

  const stripped = stripInvisibleChars(trimmed);
  const parsed = parseExamContentSegments(stripped);
  if (parsed.hadDelimiters && parsed.segments.length > 0) {
    return { kind: "delimited", segments: parsed.segments };
  }

  const normalized = normalizeExamLatex(stripped);

  if (shouldRenderFullLatexDocument(normalized)) {
    const html = renderFullLatexDocument(normalized, displayMode);
    if (html) return { kind: "full-document", html };
  }

  if (isImplicitRawEquation(stripped)) {
    const latex = repairMathLatex(stripped);
    const html = renderKatexString(latex, displayMode);
    if (html) return { kind: "single-html", html };
    return {
      kind: "mixed-flow",
      flow: [{ kind: "math", value: latex }],
    };
  }

  if (isEquationOnlyLatex(normalized)) {
    const latex = repairMathLatex(normalized);
    return {
      kind: "mixed-flow",
      flow: [{ kind: "math", value: latex }],
    };
  }

  const equationTail = parseLatexEquationWithTail(normalized);
  if (equationTail) {
    return { kind: "mixed-flow", flow: segmentsToFlowItems(equationTail) };
  }

  if (hasTextAndMathLatex(normalized)) {
    const segments = coalesceMathExpressionSegments(
      parseInlineLatexSegmentsOrdered(normalized)
    ).map((seg) =>
      seg.kind === "math"
        ? { kind: "math" as const, value: repairMathLatex(seg.value) }
        : seg
    );
    if (segments.some((s) => s.kind === "math")) {
      return { kind: "mixed-flow", flow: segmentsToFlowItems(segments) };
    }
  }

  if (looksLikeLatex(normalized) && hasNonTextLatex(normalized)) {
    const latex = repairMathLatex(normalized);
    const pureFrac = /^\\frac\{[^}]+\}\{[^}]+\}$/.test(latex);
    if (pureFrac || hasNonTextLatex(latex)) {
      const html = renderKatexString(
        latex,
        pickDisplayMode(latex, displayMode)
      );
      if (html) return { kind: "single-html", html };
    }
  }

  const lines = plainLines(normalized);
  return {
    kind: "plain",
    lines: lines.length > 0 ? lines : [dedupeRepeatedProse(normalized)],
    fallback: normalized,
  };
}

export function MathContent({
  content,
  displayMode = false,
  className,
}: MathContentProps) {
  const mode = useMemo(
    () => resolveRenderMode(content ?? "", displayMode),
    [content, displayMode]
  );

  if (mode.kind === "empty") return null;

  if (mode.kind === "delimited") {
    return (
      <DelimitedSegmentContent
        segments={mode.segments}
        className={className}
        displayMode={displayMode}
      />
    );
  }

  if (mode.kind === "full-document" || mode.kind === "single-html") {
    return (
      <span
        lang="bn"
        className={cn(
          wrapClassName,
          displayMode && "py-1",
          className,
          "[&_.katex]:text-[1em]"
        )}
        dangerouslySetInnerHTML={{ __html: mode.html }}
      />
    );
  }

  if (mode.kind === "mixed-flow") {
    return (
      <MixedFlowContent
        flow={mode.flow}
        className={className}
        displayMode={displayMode}
      />
    );
  }

  return (
    <PlainProse
      lines={mode.lines}
      className={className}
      displayMode={displayMode}
    />
  );
}
