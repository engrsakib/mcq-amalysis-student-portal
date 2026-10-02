"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ExamResultDownloadButtonProps = {
  onClick: () => void;
  busy?: boolean;
  className?: string;
};

export function ExamResultDownloadButton({
  onClick,
  busy = false,
  className,
}: ExamResultDownloadButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("shrink-0 gap-1.5", className)}
      onClick={onClick}
      disabled={busy}
      aria-busy={busy}
      data-pdf-export-ignore
    >
      <Download className="size-3.5" aria-hidden />
      {busy ? "Preparing…" : "Download PDF"}
    </Button>
  );
}
