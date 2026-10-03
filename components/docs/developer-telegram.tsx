"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DEVELOPER_PROFILE } from "@/lib/docs/developer-profile-data";
import { DeveloperSection } from "@/components/docs/developer-section";
import { cn } from "@/lib/utils";

export function DeveloperTelegram() {
  const [copied, setCopied] = useState(false);

  async function copyUsername() {
    try {
      await navigator.clipboard.writeText(DEVELOPER_PROFILE.telegramUsername);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <DeveloperSection
      id="contact"
      title="Direct message on Telegram"
      description="Scan the QR code or open Telegram to connect for collaboration or support."
    >
      <div className="grid gap-6 rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
        <div className="mx-auto w-full max-w-[220px] sm:mx-0">
          <Image
            src="/telegram-qr.jpg"
            alt={`Telegram QR code for ${DEVELOPER_PROFILE.telegramUsername}`}
            width={220}
            height={220}
            className="w-full rounded-xl border border-line bg-white"
          />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-ink">
            Message{" "}
            <span className="font-semibold text-primary">
              {DEVELOPER_PROFILE.telegramUsername}
            </span>{" "}
            for project inquiries, MCQ Analysis engineering questions, or
            partnership ideas.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <a
              href={DEVELOPER_PROFILE.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-11 gap-2 bg-primary px-4 hover:bg-primary-hover"
              )}
            >
              <MessageCircle className="size-4" aria-hidden />
              Open Telegram
            </a>
            <button
              type="button"
              onClick={copyUsername}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 gap-2 px-4 text-ink"
              )}
            >
              {copied ? (
                <Check className="size-4 text-primary" aria-hidden />
              ) : (
                <Copy className="size-4" aria-hidden />
              )}
              {copied ? "Copied" : "Copy username"}
            </button>
          </div>
          <p className="text-xs text-ink" role="status" aria-live="polite">
            {copied ? `${DEVELOPER_PROFILE.telegramUsername} copied to clipboard.` : null}
          </p>
        </div>
      </div>
    </DeveloperSection>
  );
}
