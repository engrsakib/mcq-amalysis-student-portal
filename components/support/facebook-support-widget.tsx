"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { MessengerIcon } from "@/components/support/messenger-icon";
import {
  MESSENGER_SUPPORT_URL,
  SUPPORT_WIDGET_CTA,
  SUPPORT_WIDGET_PROMPT,
  SUPPORT_WIDGET_STATUS,
  SUPPORT_WIDGET_TITLE,
} from "@/lib/site/support";
import { cn } from "@/lib/utils";

export function FacebookSupportWidget() {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((value) => !value), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-30 flex flex-col items-end gap-3 pb-[env(safe-area-inset-bottom,0px)]"
      data-support-widget
    >
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className={cn(
            "pointer-events-auto w-[min(100vw-2rem,20rem)] origin-bottom-right rounded-2xl bg-card p-4 shadow-lg ring-1 ring-line/80",
            "motion-safe:animate-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-200"
          )}
        >
          <div className="flex items-start gap-3 border-b border-line/60 pb-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[#0084FF]">
              <MessengerIcon className="size-6" title="Messenger" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <h2
                id={titleId}
                className="text-sm font-semibold leading-snug text-ink"
              >
                {SUPPORT_WIDGET_TITLE}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-primary">
                <span
                  className="size-2 shrink-0 rounded-full bg-primary"
                  aria-hidden
                />
                {SUPPORT_WIDGET_STATUS}
              </p>
            </div>
            <button
              type="button"
              className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary-soft hover:text-ink"
              aria-label="Close support"
              onClick={close}
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {SUPPORT_WIDGET_PROMPT}
          </p>

          <a
            href={MESSENGER_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pressable mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0084FF] px-4 text-sm font-semibold text-white transition-[opacity,transform] hover:bg-[#0073e6]"
          >
            <MessengerIcon className="size-5 text-white" />
            {SUPPORT_WIDGET_CTA}
          </a>
        </div>
      ) : null}

      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Close support" : "Open support"}
        onClick={toggle}
        className="pressable pointer-events-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md touch-manipulation motion-reduce:active:scale-100"
      >
        {open ? (
          <X className="size-6" aria-hidden />
        ) : (
          <MessageCircle className="size-6" aria-hidden />
        )}
      </button>
    </div>
  );
}
