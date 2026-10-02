"use client";

import { useSyncExternalStore } from "react";

const LG_MEDIA = "(min-width: 1024px)";

function subscribeLg(cb: () => void) {
  const mq = window.matchMedia(LG_MEDIA);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getLgSnapshot() {
  return window.matchMedia(LG_MEDIA).matches;
}

/** App mobile/desktop split (1024px), aligned with scroll utilities in globals.css. */
export function useIsLgUp() {
  return useSyncExternalStore(subscribeLg, getLgSnapshot, () => false);
}
