"use client";

import { useEffect, useRef, type RefObject } from "react";

type UseLenisScrollOptions = {
  wrapperRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  enabled: boolean;
};

export function useLenisScroll({
  wrapperRef,
  contentRef,
  enabled,
}: UseLenisScrollOptions) {
  const lenisRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    if (!enabled) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    let cancelled = false;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      lenisRef.current?.destroy();

      const lenis = new Lenis({
        wrapper,
        content,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: true,
      });

      lenisRef.current = lenis;
    });

    return () => {
      cancelled = true;
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [enabled, wrapperRef, contentRef]);
}
