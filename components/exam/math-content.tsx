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
  return /\\[a-zA-Z]|\\text\{|\^|_|\\frac|\\sqrt/.test(value);
}

function hasDollarMath(value: string): boolean {
  return /\$[\s\S]+?\$/.test(value);
}

function stripTextBlocks(value: string): string {
  return value.replace(/\\text\{[^}]*\}/g, "").trim();
}

function hasNonTextLatex(value: string): boolean {
  const rest = stripTextBlocks(value);
  if (!rest) return false;
  return (
    /\\frac|\\sqrt|\^|_|\\cdot|\\times|\\div|\\pm|\\leq|\\geq|\\neq|\\left|\\right/.test(
      rest
    ) || /\\(?!text\b)[a-zA-Z]/.test(rest)
  );
}

function hasTextAndMathLatex(value: string): boolean {
  return /\\text\{/.test(value) && hasNonTextLatex(value);
}

function normalizeExamLatex(value: string): string {
  let s = value.trim();
  s = s.replace(/^[\u09CD\u200C\u200D\uFEFF\s\\]+/, "");
  s = s.replace(/^[\u09CD]+(?=\\text)/, "");
  s = s.replace(/\\frac(\d)(\d)(?!\d)/g, "\\frac{$1}{$2}");
  s = s.replace(/(\\text\{[^}]*\})(?:\s*\1)+/g, "$1");
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

function segmentsToFlowItems(segments: ContentSegment[]): FlowItem[] {
  const flow: FlowItem[] = [];

  for (const segment of segments) {
    if (segment.kind === "math") {
      flow.push(segment);
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

function renderKatexInline(latex: string): string | null {
  const normalized = normalizeExamLatex(latex);
  if (!normalized) return null;

  try {
    const rendered = katex.renderToString(normalized, {
      displayMode: false,
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

const wrapClassName =
  "katex-wrap block w-full min-w-0 max-w-full text-base leading-relaxed text-ink [overflow-wrap:break-word] [word-break:normal]";

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

        const html = renderKatexInline(item.value);
        if (!html) {
          return <Fragment key={`m-${index}`}>{item.value}</Fragment>;
        }

        return (
          <span
            key={`m-${index}`}
            className="mx-0.5 inline-block align-middle whitespace-nowrap [&_.katex]:text-[1em]"
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

  const mixedFlow = useMemo((): FlowItem[] | null => {
    if (!normalized) return null;

    if (hasDollarMath(normalized)) {
      return segmentsToFlowItems(parseDollarSegments(normalized));
    }

    if (hasTextAndMathLatex(normalized)) {
      const segments = parseInlineLatexSegmentsOrdered(normalized);
      if (segments.some((s) => s.kind === "math")) {
        return segmentsToFlowItems(segments);
      }
    }

    return null;
  }, [normalized]);

  const lines = useMemo(
    () => (normalized && !mixedFlow ? plainLines(normalized) : []),
    [normalized, mixedFlow]
  );

  const html = useMemo(() => {
    if (!normalized || mixedFlow) return null;
    if (!looksLikeLatex(normalized)) return null;
    if (!hasNonTextLatex(normalized)) return null;

    const mode = pickDisplayMode(normalized, displayMode);

    try {
      const rendered = katex.renderToString(normalized, {
        displayMode: mode,
        throwOnError: false,
        strict: false,
        trust: true,
      });
      if (rendered.includes('class="katex-error"')) return null;
      return rendered;
    } catch {
      return null;
    }
  }, [normalized, displayMode, mixedFlow]);

  if (!normalized) {
    return null;
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
