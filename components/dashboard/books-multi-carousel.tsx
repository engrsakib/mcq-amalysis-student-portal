"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ITEM_GAP_PX = 16;

function useVisibleSlideCount() {
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setVisible(3);
      } else if (window.matchMedia("(min-width: 640px)").matches) {
        setVisible(2);
      } else {
        setVisible(1);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return visible;
}

type BooksMultiCarouselProps<T extends { _id: string }> = {
  title: string;
  countLabel?: number;
  loading: boolean;
  error: string | null;
  items: T[];
  emptyMessage: string;
  renderItem: (item: T) => React.ReactNode;
  autoSlideMs?: number;
};

export function BooksMultiCarousel<T extends { _id: string }>({
  title,
  countLabel,
  loading,
  error,
  items,
  emptyMessage,
  renderItem,
  autoSlideMs = 3000,
}: BooksMultiCarouselProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const visibleCount = useVisibleSlideCount();

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    setActiveIndex(0);
    scrollRef.current?.scrollTo({ left: 0 });
  }, [items]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const getScrollStep = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 0;
    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return 0;
    return first.offsetWidth + ITEM_GAP_PX;
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = scrollRef.current;
      if (!el || items.length === 0) return;
      const next = ((index % items.length) + items.length) % items.length;
      const step = getScrollStep();
      if (step <= 0) return;
      el.scrollTo({ left: next * step, behavior: "smooth" });
      activeIndexRef.current = next;
      setActiveIndex(next);
    },
    [items.length, getScrollStep]
  );

  const syncIndexFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const step = getScrollStep();
    if (step <= 0) return;
    const index = Math.round(el.scrollLeft / step);
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    activeIndexRef.current = clamped;
    setActiveIndex(clamped);
  }, [items.length, getScrollStep]);

  useEffect(() => {
    if (
      items.length <= visibleCount ||
      paused ||
      reduceMotion ||
      items.length <= 1
    ) {
      return;
    }

    const id = window.setInterval(() => {
      scrollToIndex(activeIndexRef.current + 1);
    }, autoSlideMs);

    return () => window.clearInterval(id);
  }, [
    items.length,
    visibleCount,
    paused,
    reduceMotion,
    scrollToIndex,
    autoSlideMs,
  ]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => syncIndexFromScroll());
    ro.observe(el);
    return () => ro.disconnect();
  }, [syncIndexFromScroll]);

  return (
    <Card className="min-w-0 overflow-hidden rounded-2xl border-border/60 bg-card shadow-sm ring-0 lg:min-h-0">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-base font-semibold text-ink">{title}</CardTitle>
        {!loading && items.length > 0 && countLabel != null ? (
          <span className="shrink-0 rounded-lg border border-line px-2 py-1 text-xs text-muted-foreground">
            {countLabel} book{countLabel === 1 ? "" : "s"}
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="min-w-0">
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "aspect-[2/3] w-full min-w-full shrink-0 animate-pulse rounded-lg bg-primary-soft/40 sm:w-[calc(50%-0.5rem)] sm:min-w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] lg:min-w-[calc(33.333%-0.67rem)]",
                  i === 1 && "hidden sm:block",
                  i === 2 && "hidden lg:block"
                )}
              />
            ))}
          </div>
        ) : null}

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {!loading && !error && items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        ) : null}

        {!loading && !error && items.length > 0 ? (
          <div className="min-w-0">
            <div
              ref={scrollRef}
              className="flex gap-4 touch-pan-x snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onPointerDown={() => setPaused(true)}
              onPointerUp={() => setPaused(false)}
              onPointerCancel={() => setPaused(false)}
              onPointerLeave={() => setPaused(false)}
              onScroll={syncIndexFromScroll}
            >
              {items.map((item) => (
                <div
                  key={item._id}
                  className="w-[calc(100%)] min-w-[calc(100%)] shrink-0 snap-start sm:w-[calc(50%-0.5rem)] sm:min-w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] lg:min-w-[calc(33.333%-0.67rem)]"
                >
                  {renderItem(item)}
                </div>
              ))}
            </div>
            {items.length > 1 ? (
              <div className="mt-3 flex justify-center gap-1.5">
                {items.map((item, i) => (
                  <button
                    key={item._id}
                    type="button"
                    aria-label={`Go to book ${i + 1}`}
                    aria-current={i === activeIndex ? "true" : undefined}
                    className={cn(
                      "rounded-full transition-colors",
                      i === activeIndex
                        ? "size-2.5 bg-primary"
                        : "size-2 bg-primary-soft"
                    )}
                    onClick={() => scrollToIndex(i)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
