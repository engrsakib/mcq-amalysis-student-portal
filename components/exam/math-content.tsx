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

export function MathContent({
  content,
  displayMode = false,
  className,
}: MathContentProps) {
  const html = useMemo(() => {
    const trimmed = content?.trim();
    if (!trimmed) return null;

    if (!looksLikeLatex(trimmed)) {
      return null;
    }

    try {
      return katex.renderToString(trimmed, {
        displayMode,
        throwOnError: false,
        strict: false,
        trust: true,
      });
    } catch {
      return null;
    }
  }, [content, displayMode]);

  if (!content?.trim()) {
    return null;
  }

  if (!html) {
    return (
      <span className={cn("text-sm leading-relaxed text-ink", className)}>
        {content}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "katex-wrap text-ink [&_.katex]:text-[1em]",
        displayMode && "block w-full overflow-x-auto py-1",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
