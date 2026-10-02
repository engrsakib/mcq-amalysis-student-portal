"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DEFAULT_AUTO_SLIDE_MS = 2000;

type ExamCarouselCardProps<T extends { _id: string }> = {
  title: string;
  titleExtra?: React.ReactNode;
  countLabel?: number;
  loading: boolean;
  error: string | null;
  exams: T[];
  emptyMessage: string;
  emptyContent?: React.ReactNode;
  renderSlide: (exam: T) => React.ReactNode;
  autoSlideMs?: number;
  enableAutoSlide?: boolean;
  autoPaused?: boolean;
  onActiveIndexChange?: (index: number) => void;
  countSuffix?: "exam" | "video" | "plan" | "routine";
  loadingSkeletonClassName?: string;
  cardClassName?: string;
  /** Hide card title row (e.g. tabbed Learning Materials panels) */
  hideHeader?: boolean;
};

export function ExamCarouselCard<T extends { _id: string }>({
  title,
  titleExtra,
  countLabel,
  loading,
  error,
  exams,
  emptyMessage,
  emptyContent,
  renderSlide,
  autoSlideMs = DEFAULT_AUTO_SLIDE_MS,
  enableAutoSlide = true,
  autoPaused = false,
  onActiveIndexChange,
  countSuffix = "exam",
  loadingSkeletonClassName = "h-[220px]",
  cardClassName,
  hideHeader = false,
}: ExamCarouselCardProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    onActiveIndexChange?.(activeIndex);
  }, [activeIndex, onActiveIndexChange]);

  useEffect(() => {
    setActiveIndex(0);
    scrollRef.current?.scrollTo({ left: 0 });
  }, [exams]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const getSlideWidth = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 0;
    return el.clientWidth;
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = scrollRef.current;
      if (!el || exams.length === 0) return;
      const next = ((index % exams.length) + exams.length) % exams.length;
      const width = getSlideWidth();
      if (width <= 0) return;
      el.scrollTo({ left: next * width, behavior: "smooth" });
      activeIndexRef.current = next;
      setActiveIndex(next);
    },
    [exams.length, getSlideWidth]
  );

  const syncIndexFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const width = getSlideWidth();
    if (width <= 0) return;
    const index = Math.round(el.scrollLeft / width);
    const clamped = Math.max(0, Math.min(index, exams.length - 1));
    activeIndexRef.current = clamped;
    setActiveIndex(clamped);
  }, [exams.length, getSlideWidth]);

  useEffect(() => {
    if (
      !enableAutoSlide ||
      exams.length <= 1 ||
      paused ||
      autoPaused ||
      reduceMotion
    ) {
      return;
    }

    const id = window.setInterval(() => {
      scrollToIndex(activeIndexRef.current + 1);
    }, autoSlideMs);

    return () => window.clearInterval(id);
  }, [
    enableAutoSlide,
    exams.length,
    paused,
    autoPaused,
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
    <Card
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl border-border/60 bg-card shadow-sm ring-0 lg:min-h-[280px]",
        cardClassName
      )}
    >
      {hideHeader ? (
        <CardTitle className="sr-only">{title}</CardTitle>
      ) : (
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <CardTitle className="text-base font-semibold text-ink">{title}</CardTitle>
            {titleExtra}
          </div>
          {!loading && exams.length > 0 && countLabel != null ? (
            <span className="shrink-0 rounded-lg border border-line px-2 py-1 text-xs text-muted-foreground">
              {countLabel}{" "}
              {countSuffix === "video"
                ? `video${countLabel === 1 ? "" : "s"}`
                : countSuffix === "plan"
                  ? `plan${countLabel === 1 ? "" : "s"}`
                  : countSuffix === "routine"
                    ? `routine${countLabel === 1 ? "" : "s"}`
                    : `exam${countLabel === 1 ? "" : "s"}`}
            </span>
          ) : null}
        </CardHeader>
      )}
      <CardContent className={cn("min-w-0", hideHeader && "pt-(--card-spacing)")}>
        {loading ? (
          <div
            className={cn(
              "animate-pulse rounded-xl bg-primary-soft/40",
              loadingSkeletonClassName
            )}
          />
        ) : null}
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        {!loading && !error && exams.length === 0 ? (
          emptyContent ?? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          )
        ) : null}

        {!loading && !error && exams.length > 0 ? (
          <div className="min-w-0">
            <div
              ref={scrollRef}
              className="scroll-pane-x scroll-fade-x flex w-full touch-[pan-x_pan-y] snap-x snap-mandatory overflow-x-auto scroll-smooth px-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onPointerDown={() => setPaused(true)}
              onPointerUp={() => setPaused(false)}
              onPointerCancel={() => setPaused(false)}
              onPointerLeave={() => setPaused(false)}
              onScroll={syncIndexFromScroll}
            >
              {exams.map((exam) => (
                <div
                  key={exam._id}
                  className="w-full min-w-full max-w-full shrink-0 grow-0 basis-full snap-start snap-always"
                >
                  {renderSlide(exam)}
                </div>
              ))}
            </div>
            {exams.length > 1 ? (
              <div className="mt-3 flex justify-center gap-1.5">
                {exams.map((exam, i) => (
                  <button
                    key={exam._id}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
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
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
