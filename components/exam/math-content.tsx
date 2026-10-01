"use client";

import katex from "katex";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

type MathContentProps = {
  content: string;
  displayMode?: boolean;
  className?: string;
};

function looksLikeLatex(value: string): boolean {
  return /\\[a-zA-Z]|\\text\{|\^|_|\\frac|\\sqrt/.test(value);
}

/** Fix common API LaTeX quirks before KaTeX. */
function normalizeExamLatex(value: string): string {
  let s = value.trim();
  s = s.replace(/^[\u09CD\u200C\u200D\s]+(?=\\)/, "");
  s = s.replace(/\\frac(\d)(\d)(?!\d)/g, "\\frac{$1}{$2}");
  return s;
}

/** Readable text when KaTeX cannot render (strip \\text{}, fractions, etc.). */
function latexToPlainText(value: string): string {
  let s = normalizeExamLatex(value);
  s = s.replace(/\\text\{([^}]*)\}/g, "$1");
  s = s.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "$1/$2");
  s = s.replace(/\\[a-zA-Z]+\*?(\{[^}]*\})?/g, "");
  s = s.replace(/[{}\\]/g, "");
  return s.replace(/\s+/g, " ").trim();
}

function pickDisplayMode(normalized: string, requested: boolean): boolean {
  if (!requested) return false;
  if (/\\text\{/.test(normalized)) return false;
  return true;
}

export function MathContent({
  content,
  displayMode = false,
  className,
}: MathContentProps) {
  const normalized = useMemo(
    () => normalizeExamLatex(content?.trim() ?? ""),
    [content]
  );

  const html = useMemo(() => {
    if (!normalized) return null;
    if (!looksLikeLatex(normalized)) return null;

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
  }, [normalized, displayMode]);

  const plainTextClass = cn(
    "block w-full min-w-0 text-sm leading-relaxed break-words text-ink [overflow-wrap:anywhere]",
    displayMode && "py-1",
    className
  );

  if (!normalized) {
    return null;
  }

  if (!html) {
    const readable = looksLikeLatex(normalized)
      ? latexToPlainText(normalized)
      : normalized;
    return <span className={plainTextClass}>{readable || normalized}</span>;
  }

  return (
    <span
      className={cn(
        "katex-wrap text-ink [&_.katex]:text-[1em]",
        displayMode && "block w-full min-w-0 max-w-full py-1",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
