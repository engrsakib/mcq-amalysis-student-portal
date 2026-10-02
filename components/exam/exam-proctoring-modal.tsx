"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProctoringModalState } from "@/hooks/use-exam-proctoring";
import { cn } from "@/lib/utils";

type ExamProctoringModalProps = {
  modal: ProctoringModalState;
  visible: boolean;
  awayThresholdMs: number;
  onStay: () => void;
  onConfirmLeave: () => void;
  onDismissReturn: () => void;
};

export function ExamProctoringModal({
  modal,
  visible,
  awayThresholdMs,
  onStay,
  onConfirmLeave,
  onDismissReturn,
}: ExamProctoringModalProps) {
  if (!modal) return null;

  const isLongAway =
    modal.kind === "returnWarning" && modal.awayMs >= awayThresholdMs;

  const title =
    modal.kind === "leaveConfirm"
      ? "Leave this exam?"
      : isLongAway
        ? "Proctoring violation recorded"
        : "You left the exam screen";

  const description =
    modal.kind === "leaveConfirm"
      ? "Going back or leaving now will send a proctoring event to the server. Stay on this page if you want to continue your attempt."
      : isLongAway
        ? "You were away for more than 15 seconds. The server may mark this as a proctoring violation. You can continue the exam, but your attempt may be flagged."
        : "Switching tabs or minimizing the window is monitored. A proctoring event was recorded. Please stay on this screen until you submit.";

  const primaryAction =
    modal.kind === "leaveConfirm"
      ? { label: "Stay on exam", onClick: onStay }
      : { label: "I understand", onClick: onDismissReturn };

  const secondaryAction =
    modal.kind === "leaveConfirm"
      ? { label: "Leave exam", onClick: onConfirmLeave, variant: "outline" as const }
      : null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4",
        !visible && "pointer-events-none"
      )}
      role="alertdialog"
      aria-modal
      aria-labelledby="exam-proctoring-title"
      aria-describedby="exam-proctoring-desc"
      aria-hidden={!visible}
    >
      <button
        type="button"
        className={cn(
          "absolute inset-0 bg-ink/50 transition-opacity duration-300 ease-out motion-reduce:transition-none",
          visible ? "opacity-100" : "opacity-0"
        )}
        aria-label="Dismiss"
        tabIndex={visible ? 0 : -1}
        onClick={modal.kind === "returnWarning" ? onDismissReturn : onStay}
      />
      <div
        className={cn(
          "relative w-full max-w-md rounded-t-2xl bg-card p-5 shadow-xl sm:rounded-2xl",
          "transition-all duration-300 ease-out motion-reduce:transition-none",
          visible
            ? "translate-y-0 opacity-100 sm:scale-100"
            : "translate-y-6 opacity-0 sm:translate-y-0 sm:scale-[0.98]"
        )}
      >
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              isLongAway ? "bg-destructive/15 text-destructive" : "bg-primary-soft text-primary"
            )}
          >
            <AlertTriangle className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h2
                id="exam-proctoring-title"
                className="text-base font-semibold text-ink sm:text-lg"
              >
                {title}
              </h2>
              <button
                type="button"
                className="rounded-lg p-1 text-muted-foreground hover:bg-primary-soft hover:text-ink"
                aria-label="Close"
                onClick={modal.kind === "returnWarning" ? onDismissReturn : onStay}
              >
                <X className="size-5" />
              </button>
            </div>
            <p
              id="exam-proctoring-desc"
              className="mt-2 text-sm leading-relaxed text-muted-foreground"
            >
              {description}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {secondaryAction ? (
            <Button
              type="button"
              variant={secondaryAction.variant}
              className="w-full sm:w-auto"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          ) : null}
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={primaryAction.onClick}
          >
            {primaryAction.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
