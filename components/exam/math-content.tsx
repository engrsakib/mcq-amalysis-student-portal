"use client";

import katex from "katex";
import { Fragment, useMemo } from "react";
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

/** API often omits the leading backslash (e.g. `frac{11}{12}`). */
function repairBareLatexCommands(value: string): string {
  return value
    .replace(/(?<!\\)frac\{([^}]*)\}\{([^}]*)\}/g, "\\frac{$1}{$2}")
    .replace(/(?<!\\)sqrt\{([^}]*)\}/g, "\\sqrt{$1}")
    .replace(/(?<!\\)text\{([^}]*)\}/g, "\\text{$1}");
}

function hasDollarMath(value: string): boolean {
  return /\$[\s\S]+?\$/.test(value);
}

function readBracedGroup(value: string, contentStart: number): number {
  let depth = 1;
  let j = contentStart;
  while (j < value.length && depth > 0) {
    if (value[j] === "{") depth += 1;
    else if (value[j] === "}") depth -= 1;
    j += 1;
  }
  return j;
}

/** `\text{` … `}` may span lines from the API. */
function foldMultilineTextBlocks(value: string): string {
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

function normalizeExamLatex(value: string): string {
  let s = value.trim();
  s = foldMultilineTextBlocks(s);
  s = s.replace(/^[\u09CD\u200C\u200D\uFEFF\s]+/, "");
  s = s.replace(/^[\u09CD]+(?=\\text)/, "");
  s = repairBareLatexCommands(s);
  s = s.replace(/\\frac(\d)(\d)(?!\d)/g, "\\frac{$1}{$2}");
  s = s.replace(/(\\text\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})(?:\s*\1)+/g, "$1");
  return s;
}

function normalizeMixedContent(value: string): string {
  let s = normalizeExamLatex(value);
  s = s.replace(/(\$[^$]+\$)([\u0980-\u09FF])/g, "$1 $2");
  s = s.replace(/([\u0980-\u09FF])(\$)/g, "$1 $2");
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

function parseDollarSegments(value: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  const re = /\$\s*([\s\S]*?)\s*\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(value)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        kind: "text",
        value: value.slice(lastIndex, match.index),
      });
    }
    segments.push({ kind: "math", value: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < value.length) {
    segments.push({ kind: "text", value: value.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ kind: "text", value }];
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

/** e.g. `\frac{9}{\text{?}}=\frac{?}{81}` + Bengali question (no `\text{}` wrapper). */
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
    { kind: "math", value: mathPart },
    { kind: "text", value: textPart },
  ];
}

function normalizeMathPlaceholders(value: string): string {
  return value
    .replace(/\\frac\{\?\}\{/g, "\\frac{\\text{?}}{")
    .replace(/\\frac\{\?\}/g, "\\frac{\\text{?}}");
}

function segmentsToFlowItems(segments: ContentSegment[]): FlowItem[] {
  const flow: FlowItem[] = [];

  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    if (segment.kind === "math") {
      flow.push(segment);
      const next = segments[i + 1];
      if (next?.kind === "text") flow.push({ kind: "break" });
      continue;
    }

    const lines = splitAtSentenceBoundaries(segment.value);
    for (let i = 0; i < lines.length; i += 1) {
      if (i > 0) flow.push({ kind: "break" });
      flow.push({ kind: "text", value: lines[i] });
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

function renderKatexInline(
  latex: string,
  displayMode = false
): string | null {
  const normalized = normalizeMathPlaceholders(normalizeExamLatex(latex));
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

  const doc = normalizeMathPlaceholders(normalized);
  const mode = pickDisplayMode(doc, displayMode);

  try {
    const rendered = katex.renderToString(doc, {
      displayMode: mode,
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

function shouldRenderFullLatexDocument(normalized: string): boolean {
  if (!/\\text\{/.test(normalized)) return false;
  if (!/[\u0980-\u09FF]/.test(normalized)) return false;
  return true;
}

const wrapClassName =
  "katex-wrap block w-full min-w-0 max-w-full overflow-visible text-base leading-loose text-ink [overflow-wrap:break-word] [word-break:normal]";

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

        const block =
          item.value.includes("=") && item.value.length > 12;
        const html = renderKatexInline(item.value, block);
        if (!html) {
          return <Fragment key={`m-${index}`}>{item.value}</Fragment>;
        }

        return (
          <span
            key={`m-${index}`}
            className={cn(
              "overflow-visible [&_.katex]:overflow-visible [&_.katex]:text-[1em]",
              block
                ? "my-1 block w-full"
                : "mx-0.5 inline-block align-middle whitespace-nowrap"
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

export function MathContent({
  content,
  displayMode = false,
  className,
}: MathContentProps) {
  const normalized = useMemo(() => {
    const trimmed = content?.trim() ?? "";
    if (hasDollarMath(trimmed)) return normalizeMixedContent(trimmed);
    return normalizeExamLatex(trimmed);
  }, [content]);

  const fullDocumentHtml = useMemo(() => {
    if (!normalized || hasDollarMath(normalized)) return null;
    if (!shouldRenderFullLatexDocument(normalized)) return null;
    return renderFullLatexDocument(normalized, displayMode);
  }, [normalized, displayMode]);

  const mixedFlow = useMemo((): FlowItem[] | null => {
    if (!normalized || fullDocumentHtml) return null;

    if (hasDollarMath(normalized)) {
      return segmentsToFlowItems(parseDollarSegments(normalized));
    }

    const equationTail = parseLatexEquationWithTail(normalized);
    if (equationTail) {
      return segmentsToFlowItems(equationTail);
    }

    if (hasTextAndMathLatex(normalized)) {
      const segments = parseInlineLatexSegmentsOrdered(normalized);
      if (segments.some((s) => s.kind === "math")) {
        return segmentsToFlowItems(segments);
      }
    }

    return null;
  }, [normalized, fullDocumentHtml]);

  const lines = useMemo(
    () => (normalized && !mixedFlow && !fullDocumentHtml ? plainLines(normalized) : []),
    [normalized, mixedFlow, fullDocumentHtml]
  );

  const html = useMemo(() => {
    if (!normalized || mixedFlow || fullDocumentHtml) return null;
    if (!looksLikeLatex(normalized)) return null;
    const pureFrac = /^\\frac\{[^}]+\}\{[^}]+\}$/.test(normalized);
    if (!hasNonTextLatex(normalized) && !pureFrac) return null;

    const mode = pickDisplayMode(normalized, displayMode);

    try {
      const rendered = katex.renderToString(
        normalizeMathPlaceholders(normalized),
        {
          displayMode: mode,
          output: "html",
          throwOnError: false,
          strict: false,
          trust: true,
        }
      );
      if (rendered.includes('class="katex-error"')) return null;
      return rendered;
    } catch {
      return null;
    }
  }, [normalized, displayMode, mixedFlow]);

  if (!normalized) {
    return null;
  }

  if (fullDocumentHtml) {
    return (
      <span
        lang="bn"
        className={cn(
          wrapClassName,
          displayMode && "py-1",
          className,
          "[&_.katex]:text-[1em]"
        )}
        dangerouslySetInnerHTML={{ __html: fullDocumentHtml }}
      />
    );
  }

  if (mixedFlow) {
    return (
      <MixedFlowContent
        flow={mixedFlow}
        className={className}
        displayMode={displayMode}
      />
    );
  }

  if (!html) {
    return (
      <PlainProse
        lines={lines.length > 0 ? lines : [dedupeRepeatedProse(normalized)]}
        className={className}
        displayMode={displayMode}
      />
    );
  }

  return (
    <span
      lang="bn"
      className={cn(
        wrapClassName,
        displayMode && "py-1",
        className,
        "[&_.katex]:text-[1em]"
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
