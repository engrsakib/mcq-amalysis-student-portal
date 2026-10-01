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
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el || exams.length === 0) return;
    const next = ((index % exams.length) + exams.length) % exams.length;
    const slide = el.children[next] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setActiveIndex(next);
  }, [exams.length]);

  useEffect(() => {
    if (exams.length <= 1 || paused || reduceMotion) return;
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (!isMobile) return;

    const id = window.setInterval(() => {
      scrollToIndex(activeIndex + 1);
    }, AUTO_SLIDE_MS);

    return () => window.clearInterval(id);
  }, [activeIndex, exams.length, paused, reduceMotion, scrollToIndex]);

  const countLabel = Math.min(total, 10);

  return (
    <Card className="min-h-[280px] rounded-2xl border-border/60 bg-card shadow-sm ring-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-ink">
          Upcoming
        </CardTitle>
        {!loading && exams.length > 0 ? (
          <span className="rounded-lg border border-line px-2 py-1 text-xs text-muted-foreground">
            {countLabel} exam{countLabel === 1 ? "" : "s"}
          </span>
        ) : null}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[220px] animate-pulse rounded-xl bg-primary-soft/40" />
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
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onPointerDown={() => setPaused(true)}
              onPointerUp={() => setPaused(false)}
              onPointerLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
              onScroll={() => {
                const el = scrollRef.current;
                if (!el) return;
                const width = el.clientWidth;
                if (width <= 0) return;
                setActiveIndex(Math.round(el.scrollLeft / width));
              }}
            >
              {exams.map((exam) => (
                <div key={exam._id} className="w-full min-w-full shrink-0">
                  <UpcomingExamSlide exam={exam} layout="slide" />
                </div>
              ))}
            </div>
            {exams.length > 1 ? (
              <div className="mt-2 flex justify-center gap-1.5 lg:hidden">
                {exams.map((exam, i) => (
                  <button
                    key={exam._id}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    className={cn(
                      "size-2 rounded-full transition-colors",
                      i === activeIndex ? "bg-primary" : "bg-primary-soft"
                    )}
                    onClick={() => scrollToIndex(i)}
                  />
                ))}
              </div>
            ) : null}

            <div className="hidden max-h-[280px] space-y-2 overflow-y-auto lg:block">
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
