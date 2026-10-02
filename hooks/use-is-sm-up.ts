"use client";

import { useSyncExternalStore } from "react";

const SM_MEDIA = "(min-width: 640px)";

function subscribeSm(cb: () => void) {
  const mq = window.matchMedia(SM_MEDIA);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getSmSnapshot() {
  return window.matchMedia(SM_MEDIA).matches;
}

/** Tailwind `sm` breakpoint (640px). SSR/default: false (mobile-first). */
export function useIsSmUp() {
  return useSyncExternalStore(subscribeSm, getSmSnapshot, () => false);
}
