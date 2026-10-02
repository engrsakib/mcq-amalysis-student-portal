"use client";

import { useEffect, useState } from "react";
import { ExamLeaderboardSelect } from "@/components/results/exam-leaderboard-select";
import {
  LeaderboardPodium,
  LeaderboardPodiumSkeleton,
} from "@/components/results/leaderboard-podium";
import { LeaderboardListSkeleton } from "@/components/results/leaderboard-list-skeleton";
import { LeaderboardParticipantRow } from "@/components/results/leaderboard-participant-row";
import { LeaderboardYourRank } from "@/components/results/leaderboard-your-rank";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { useExamLeaderboard } from "@/hooks/use-exam-leaderboard";
import { useResultsExamOptions } from "@/hooks/use-results-exam-options";

export function ResultsView() {
  const {
    options,
    loading: examsLoading,
    error: examsError,
    retry: retryExams,
  } = useResultsExamOptions();

  const [selectedExam, setSelectedExam] = useState<number | null>(null);

  useEffect(() => {
    if (examsLoading || options.length === 0) return;
    setSelectedExam((prev) => {
      if (prev != null && options.some((o) => o.examNumber === prev)) {
        return prev;
      }
      return options[0]!.examNumber;
    });
  }, [examsLoading, options]);

  const {
    entries,
    topThree,
    currentUser,
    meta,
    page,
    setPage,
    loading: leaderboardLoading,
    error: leaderboardError,
    retry: retryLeaderboard,
  } = useExamLeaderboard(selectedExam);

  const showLeaderboard = selectedExam != null;
  const hasPodium = topThree.length > 0;
  const hasList = entries.length > 0;
  const emptyLeaderboard =
    showLeaderboard &&
    !leaderboardLoading &&
    !leaderboardError &&
    !hasPodium &&
    !hasList &&
    !currentUser;

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Results</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Compare scores on the leaderboard for each exam you have taken.
        </p>
      </div>

      {examsError ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load exams</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>{examsError}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void retryExams()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <Card className="ring-line/70">
        <CardHeader className="border-b border-line/70">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>
                Top performers and your rank for the selected exam.
              </CardDescription>
            </div>
            <ExamLeaderboardSelect
              className="w-full sm:max-w-md"
              options={options}
              value={selectedExam}
              onChange={setSelectedExam}
              loading={examsLoading}
              disabled={!!examsError}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {!showLeaderboard && !examsLoading ? (
            <div className="rounded-xl border border-dashed border-line bg-card/50 px-4 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Select an exam to view the leaderboard.
              </p>
            </div>
          ) : null}

          {leaderboardError ? (
            <Alert variant="destructive">
              <AlertTitle>Could not load leaderboard</AlertTitle>
              <AlertDescription className="flex flex-wrap items-center gap-3">
                <span>{leaderboardError}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void retryLeaderboard()}
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : null}

          {showLeaderboard && leaderboardLoading ? (
            <>
              <LeaderboardPodiumSkeleton />
              <LeaderboardListSkeleton />
            </>
          ) : null}

          {showLeaderboard && !leaderboardLoading && !leaderboardError ? (
            <>
              {hasPodium ? <LeaderboardPodium topThree={topThree} /> : null}

              {currentUser ? (
                <LeaderboardYourRank
                  currentUser={currentUser}
                  topThree={topThree}
                />
              ) : null}

              {hasList ? (
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    All participants
                  </p>
                  <ul className="flex flex-col gap-0.5">
                    {entries.map((entry) => (
                      <li key={`${entry.rank}-${entry.student_name}`}>
                        <LeaderboardParticipantRow entry={entry} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {emptyLeaderboard ? (
                <div className="rounded-xl border border-dashed border-line bg-card/50 px-4 py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    No leaderboard data for this exam yet.
                  </p>
                </div>
              ) : null}

              {meta.totalPage > 1 ? (
                <PaginationBar
                  page={page}
                  totalPages={meta.totalPage}
                  onPageChange={setPage}
                  summaryLabel={`${meta.total} participant${meta.total === 1 ? "" : "s"}`}
                />
              ) : null}
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
