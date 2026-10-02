"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ITEM_GAP_PX = 16;

export type BooksCarouselLayout = "full" | "column";
export type CatalogCarouselMediaAspect = "portrait" | "landscape";
export type CatalogCountSuffix = "book" | "routine";

function useVisibleSlideCount(layout: BooksCarouselLayout) {
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    const update = () => {
      if (layout === "column") {
        setVisible(window.matchMedia("(min-width: 1024px)").matches ? 2 : 1);
        return;
      }
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
  }, [layout]);

  return visible;
}

const ITEM_WIDTH_FULL =
  "w-[calc(100%)] min-w-[calc(100%)] sm:w-[calc(50%-0.5rem)] sm:min-w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] lg:min-w-[calc(33.333%-0.67rem)]";

const ITEM_WIDTH_COLUMN =
  "w-[calc(100%)] min-w-[calc(100%)] lg:w-[calc(50%-0.5rem)] lg:min-w-[calc(50%-0.5rem)]";

function skeletonWidthClass(
  layout: BooksCarouselLayout,
  mediaAspect: CatalogCarouselMediaAspect
) {
  const aspect =
    mediaAspect === "landscape" ? "aspect-video" : "aspect-[2/3]";
  const base = `${aspect} w-full min-w-full shrink-0 animate-pulse rounded-lg bg-primary-soft/40`;
  if (layout === "column") {
    return `${base} lg:w-[calc(50%-0.5rem)] lg:min-w-[calc(50%-0.5rem)]`;
  }
  return `${base} sm:w-[calc(50%-0.5rem)] sm:min-w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] lg:min-w-[calc(33.333%-0.67rem)]`;
}

function countSuffixLabel(suffix: CatalogCountSuffix, count: number) {
  const plural = count === 1 ? "" : "s";
  if (suffix === "routine") return `routine${plural}`;
  return `book${plural}`;
}

function sparseGridClass(layout: BooksCarouselLayout) {
  return layout === "column"
    ? "grid grid-cols-1 gap-4 lg:grid-cols-2"
    : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";
}

/** Show empty slot only on breakpoints where it fills the row (same size as cards). */
function placeholderSlotClass(
  padIndex: number,
  itemsLength: number,
  layout: BooksCarouselLayout
) {
  const slotIndex = itemsLength + padIndex;
  if (layout === "column") {
    if (slotIndex >= 2) return "hidden";
    return slotIndex === 1 ? "hidden lg:block" : "";
  }
  if (slotIndex >= 3) return "hidden";
  if (slotIndex === 1) return "hidden sm:block";
  if (slotIndex === 2) return "hidden lg:block";
  return "";
}

function maxSlotsForLayout(layout: BooksCarouselLayout) {
  return layout === "column" ? 2 : 3;
}

function CatalogEmptySlot({
  mediaAspect,
  message,
  className,
}: {
  mediaAspect: CatalogCarouselMediaAspect;
  message: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex h-full min-w-0 flex-col gap-3 rounded-xl border border-dashed border-line/70 bg-muted/10 p-3",
        className
      )}
      aria-hidden
    >
      <div
        className={cn(
          "w-full rounded-lg bg-primary-soft/20",
          mediaAspect === "landscape" ? "aspect-video" : "aspect-[2/3]"
        )}
      />
      <p className="flex flex-1 items-center justify-center text-center text-xs text-muted-foreground">
        {message}
      </p>
    </article>
  );
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
  layout?: BooksCarouselLayout;
  mediaAspect?: CatalogCarouselMediaAspect;
  countSuffix?: CatalogCountSuffix;
  dotItemLabel?: string;
  fillEmptySlots?: boolean;
  emptySlotMessage?: string;
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
  layout = "full",
  mediaAspect = "portrait",
  countSuffix = "book",
  dotItemLabel = "item",
  fillEmptySlots = false,
  emptySlotMessage = "Coming soon",
}: BooksMultiCarouselProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const visibleCount = useVisibleSlideCount(layout);
  const itemWidthClass = layout === "column" ? ITEM_WIDTH_COLUMN : ITEM_WIDTH_FULL;
  const skeletonClass = skeletonWidthClass(layout, mediaAspect);
  const useSparseGrid =
    fillEmptySlots && items.length > 0 && items.length <= visibleCount;
  const padCount = useSparseGrid
    ? Math.max(0, maxSlotsForLayout(layout) - items.length)
    : 0;

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
      useSparseGrid ||
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
    useSparseGrid,
  ]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || useSparseGrid) return;
    const ro = new ResizeObserver(() => syncIndexFromScroll());
    ro.observe(el);
    return () => ro.disconnect();
  }, [syncIndexFromScroll, useSparseGrid]);

  return (
    <Card className="min-w-0 overflow-hidden rounded-2xl border-border/60 bg-card shadow-sm ring-0 lg:min-h-0">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-base font-semibold text-ink">{title}</CardTitle>
        {!loading && items.length > 0 && countLabel != null ? (
          <span className="shrink-0 rounded-lg border border-line px-2 py-1 text-xs text-muted-foreground">
            {countLabel} {countSuffixLabel(countSuffix, countLabel)}
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="min-w-0">
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: layout === "column" ? 2 : 3 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  skeletonClass,
                  layout === "full" && i === 1 && "hidden sm:block",
                  layout === "full" && i === 2 && "hidden lg:block",
                  layout === "column" && i === 1 && "hidden lg:block"
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
            {useSparseGrid ? (
              <div className={sparseGridClass(layout)}>
                {items.map((item) => (
                  <div key={item._id} className="min-w-0">
                    {renderItem(item)}
                  </div>
                ))}
                {Array.from({ length: padCount }, (_, padIndex) => (
                  <CatalogEmptySlot
                    key={`empty-${padIndex}`}
                    mediaAspect={mediaAspect}
                    message={emptySlotMessage}
                    className={placeholderSlotClass(
                      padIndex,
                      items.length,
                      layout
                    )}
                  />
                ))}
              </div>
            ) : (
              <>
                <div
                  ref={scrollRef}
                  className="scroll-pane-x scroll-fade-x flex gap-4 touch-[pan-x_pan-y] snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  onPointerDown={() => setPaused(true)}
                  onPointerUp={() => setPaused(false)}
                  onPointerCancel={() => setPaused(false)}
                  onPointerLeave={() => setPaused(false)}
                  onScroll={syncIndexFromScroll}
                >
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className={cn("shrink-0 snap-start", itemWidthClass)}
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
                        aria-label={`Go to ${dotItemLabel} ${i + 1}`}
                        aria-current={i === activeIndex ? "true" : undefined}
                        className="flex min-h-11 min-w-11 items-center justify-center rounded-full"
                        onClick={() => scrollToIndex(i)}
                      >
                        <span
                          className={cn(
                            "rounded-full transition-colors",
                            i === activeIndex
                              ? "size-2.5 bg-primary"
                              : "size-2 bg-primary-soft"
                          )}
                          aria-hidden
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
