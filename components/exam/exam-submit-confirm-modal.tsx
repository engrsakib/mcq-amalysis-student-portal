"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AUTO_SUBMIT_SECONDS = 5;

type ExamSubmitConfirmModalProps = {
  open: boolean;
  unansweredCount: number;
  submitting: boolean;
  errorMessage?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ExamSubmitConfirmModal({
  open,
  unansweredCount,
  submitting,
  errorMessage,
  onConfirm,
  onCancel,
}: ExamSubmitConfirmModalProps) {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_SUBMIT_SECONDS);
  const autoConfirmFiredRef = useRef(false);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      setCountdown(AUTO_SUBMIT_SECONDS);
      autoConfirmFiredRef.current = false;
      return;
    }

    setCountdown(AUTO_SUBMIT_SECONDS);
    const show = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });

    return () => cancelAnimationFrame(show);
  }, [open]);

  useEffect(() => {
    if (!open || submitting) return;

    if (countdown <= 0) {
      if (!autoConfirmFiredRef.current) {
        autoConfirmFiredRef.current = true;
        onConfirm();
      }
      return;
    }

    const id = window.setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    return () => window.clearTimeout(id);
  }, [open, submitting, countdown, onConfirm]);

  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("modal-scroll-lock");
    return () => document.documentElement.classList.remove("modal-scroll-lock");
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4",
        !visible && "pointer-events-none"
      )}
      role="alertdialog"
      aria-modal
      aria-labelledby="exam-submit-confirm-title"
    >
      <button
        type="button"
        className={cn(
          "absolute inset-0 bg-ink/50 transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
        aria-label="Cancel"
        tabIndex={visible ? 0 : -1}
        onClick={onCancel}
        disabled={submitting}
      />
      <div
        className={cn(
          "relative w-full max-w-md rounded-t-2xl bg-card p-5 shadow-xl sm:rounded-2xl",
          "transition-all duration-300",
          visible
            ? "translate-y-0 opacity-100 sm:scale-100"
            : "translate-y-6 opacity-0 sm:scale-[0.98]"
        )}
      >
        <h2
          id="exam-submit-confirm-title"
          className="text-lg font-semibold text-ink"
        >
          Submit exam?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {unansweredCount > 0
            ? `You have ${unansweredCount} unanswered question${unansweredCount === 1 ? "" : "s"}. `
            : ""}
          Once submitted, you cannot change your answers.
        </p>
        {!submitting ? (
          <p className="mt-2 text-xs font-medium text-primary">
            Auto-submitting in {countdown}s…
          </p>
        ) : (
          <p className="mt-2 text-xs font-medium text-muted-foreground">
            Submitting your results…
          </p>
        )}
        {errorMessage ? (
          <p className="mt-2 text-sm text-destructive">{errorMessage}</p>
        ) : null}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onCancel}
            disabled={submitting}
          >
            No, continue
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={onConfirm}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Yes, submit now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
