"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UpcomingExamSlide } from "@/components/dashboard/upcoming-exam-slide";
import { useUpcomingExams } from "@/hooks/use-upcoming-exams";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const AUTO_SLIDE_MS = 2000;

export function UpcomingExamsCard() {
  const { exams, total, loading, error } = useUpcomingExams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

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
    if (exams.length <= 1 || paused || reduceMotion) return;

    const mq = window.matchMedia("(max-width: 1023px)");
    if (!mq.matches) return;

    const id = window.setInterval(() => {
      scrollToIndex(activeIndexRef.current + 1);
    }, AUTO_SLIDE_MS);

    return () => window.clearInterval(id);
  }, [exams.length, paused, reduceMotion, scrollToIndex]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => syncIndexFromScroll());
    ro.observe(el);
    return () => ro.disconnect();
  }, [syncIndexFromScroll]);

  const countLabel = Math.min(total, 10);

  return (
    <Card className="min-w-0 overflow-hidden rounded-2xl border-border/60 bg-card shadow-sm ring-0 lg:min-h-[280px]">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-base font-semibold text-ink">Upcoming</CardTitle>
        {!loading && exams.length > 0 ? (
          <span className="shrink-0 rounded-lg border border-line px-2 py-1 text-xs text-muted-foreground">
            {countLabel} exam{countLabel === 1 ? "" : "s"}
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="min-w-0">
        {loading ? (
          <div className="h-[200px] animate-pulse rounded-xl bg-primary-soft/40 sm:h-[220px]" />
        ) : null}
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        {!loading && !error && exams.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No upcoming exams.
          </p>
        ) : null}

        {!loading && !error && exams.length > 0 ? (
          <>
            <div className="min-w-0 lg:hidden">
              <div
                ref={scrollRef}
                className="flex w-full touch-pan-x snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                    <UpcomingExamSlide exam={exam} layout="slide" />
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
                      className={cn(
                        "size-2 rounded-full transition-colors",
                        i === activeIndex ? "bg-primary" : "bg-primary-soft"
                      )}
                      onClick={() => scrollToIndex(i)}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="hidden max-h-[280px] min-w-0 space-y-2 overflow-y-auto lg:block">
              {exams.map((exam) => (
                <UpcomingExamSlide key={exam._id} exam={exam} layout="row" />
              ))}
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
