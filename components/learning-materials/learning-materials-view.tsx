"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  PlayCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginatedCatalogPanel } from "@/components/catalog/paginated-catalog-panel";
import { ExamSolutionCatalogCard } from "@/components/learning-materials/exam-solution-catalog-card";
import { ExamSolutionCatalogRow } from "@/components/learning-materials/exam-solution-catalog-row";
import { StudyPlanCatalogCard } from "@/components/learning-materials/study-plan-catalog-card";
import { StudyPlanCatalogRow } from "@/components/learning-materials/study-plan-catalog-row";
import { YoutubeCatalogCard } from "@/components/learning-materials/youtube-catalog-card";
import { YoutubeCatalogRow } from "@/components/learning-materials/youtube-catalog-row";
import { ContentEmptyState } from "@/components/ui/content-empty-state";
import type { FolderTabItem } from "@/components/ui/folder-tabs";
import { TabbedFolderView } from "@/components/ui/tabbed-folder-view";
import { useCatalogViewMode } from "@/hooks/use-catalog-view-mode";
import { usePaginatedExamSolutions } from "@/hooks/use-paginated-exam-solutions";
import { usePaginatedStudyPlans } from "@/hooks/use-paginated-study-plans";
import { usePaginatedYoutube } from "@/hooks/use-paginated-youtube";
import { LEARNING_MATERIALS_VIEW_STORAGE_KEY } from "@/lib/catalog/page-sizes";

export type LearningMaterialsTabId =
  | "study-plan"
  | "youtube"
  | "model-test"
  | "guideline";

const TABS: readonly FolderTabItem<LearningMaterialsTabId>[] = [
  {
    id: "study-plan",
    label: "Study plan",
    shortLabel: "Plans",
    icon: GraduationCap,
  },
  {
    id: "youtube",
    label: "Youtube",
    icon: PlayCircle,
  },
  {
    id: "model-test",
    label: "Model test solution",
    shortLabel: "Model test",
    icon: ClipboardCheck,
  },
  {
    id: "guideline",
    label: "Guideline",
    icon: BookOpen,
  },
];

function tabFromParam(value: string | null): LearningMaterialsTabId {
  if (value === "youtube" || value === "model-test" || value === "guideline") {
    return value;
  }
  return "study-plan";
}

function LearningMaterialsTabPanels({ tab }: { tab: LearningMaterialsTabId }) {
  const { viewMode, setViewMode } = useCatalogViewMode(
    LEARNING_MATERIALS_VIEW_STORAGE_KEY
  );
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const studyEnabled = tab === "study-plan";
  const youtubeEnabled = tab === "youtube";
  const modelTestEnabled = tab === "model-test";

  const studyPlans = usePaginatedStudyPlans(studyEnabled);
  const youtube = usePaginatedYoutube(youtubeEnabled);
  const examSolutions = usePaginatedExamSolutions(modelTestEnabled);

  useEffect(() => {
    setPlayingVideoId(null);
  }, [tab]);

  if (tab === "study-plan") {
    return (
      <PaginatedCatalogPanel
        items={studyPlans.items}
        meta={studyPlans.meta}
        page={studyPlans.page}
        onPageChange={studyPlans.setPage}
        searchTerm={studyPlans.searchTerm}
        onSearchTermChange={studyPlans.setSearchTerm}
        searchPlaceholder="Search study plans…"
        searchAriaLabel="Search study plans"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        loading={studyPlans.loading}
        error={studyPlans.error}
        onRetry={() => void studyPlans.refresh()}
        errorTitle="Could not load study plans"
        emptyMessage="No study plans match your search."
        renderCard={(plan) => <StudyPlanCatalogCard plan={plan} />}
        renderListRow={(plan) => <StudyPlanCatalogRow plan={plan} />}
      />
    );
  }

  if (tab === "youtube") {
    return (
      <PaginatedCatalogPanel
        items={youtube.items}
        meta={youtube.meta}
        page={youtube.page}
        onPageChange={youtube.setPage}
        searchTerm={youtube.searchTerm}
        onSearchTermChange={youtube.setSearchTerm}
        searchPlaceholder="Search videos…"
        searchAriaLabel="Search videos"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        loading={youtube.loading}
        error={youtube.error}
        onRetry={() => void youtube.refresh()}
        errorTitle="Could not load videos"
        emptyMessage="No videos match your search."
        renderCard={(video) => (
          <YoutubeCatalogCard
            video={video}
            playing={playingVideoId === video._id}
            onPlay={() => setPlayingVideoId(video._id)}
            onClose={() => setPlayingVideoId(null)}
          />
        )}
        renderListRow={(video) => (
          <YoutubeCatalogRow
            video={video}
            playing={playingVideoId === video._id}
            onPlay={() => setPlayingVideoId(video._id)}
            onClose={() => setPlayingVideoId(null)}
          />
        )}
      />
    );
  }

  if (tab === "model-test") {
    return (
      <PaginatedCatalogPanel
        items={examSolutions.items}
        meta={examSolutions.meta}
        page={examSolutions.page}
        onPageChange={examSolutions.setPage}
        searchTerm={examSolutions.searchTerm}
        onSearchTermChange={examSolutions.setSearchTerm}
        searchPlaceholder="Search model test solutions…"
        searchAriaLabel="Search model test solutions"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        loading={examSolutions.loading}
        error={examSolutions.error}
        onRetry={() => void examSolutions.refresh()}
        errorTitle="Could not load model test solutions"
        emptyMessage="No model test solutions match your search."
        renderCard={(solution) => (
          <ExamSolutionCatalogCard solution={solution} />
        )}
        renderListRow={(solution) => (
          <ExamSolutionCatalogRow solution={solution} />
        )}
      />
    );
  }

  return (
    <ContentEmptyState
      icon={BookOpen}
      title="No guidelines available yet."
      description="Guidelines will appear here when they are published for your account."
    />
  );
}

function LearningMaterialsFallback() {
  return (
    <div className="w-full min-w-0 space-y-6" aria-busy="true" aria-label="Loading learning materials">
      <div>
        <div className="h-8 w-56 max-w-full animate-pulse rounded-md bg-primary-soft/50" />
        <div className="mt-2 h-4 w-full max-w-xl animate-pulse rounded-md bg-primary-soft/40" />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="h-10 animate-pulse rounded-lg bg-primary-soft/40 sm:min-w-[7rem]"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="min-h-[220px] animate-pulse rounded-xl border border-line/60 bg-card"
          />
        ))}
      </div>
    </div>
  );
}

function LearningMaterialsViewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<LearningMaterialsTabId>(() =>
    tabFromParam(searchParams.get("tab"))
  );

  useEffect(() => {
    setTab(tabFromParam(searchParams.get("tab")));
  }, [searchParams]);

  const selectTab = useCallback(
    (next: LearningMaterialsTabId) => {
      setTab(next);
      const params = new URLSearchParams(searchParams.toString());
      if (next === "study-plan") {
        params.delete("tab");
      } else {
        params.set("tab", next);
      }
      const qs = params.toString();
      router.replace(
        qs ? `/learning-materials?${qs}` : "/learning-materials",
        { scroll: false }
      );
    },
    [router, searchParams]
  );

  return (
    <div className="w-full min-w-0 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Learning Materials</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse study plans, videos, and model test solutions. Search and
          switch between card or list view on each tab.
        </p>
      </div>

      <TabbedFolderView
        items={TABS}
        value={tab}
        onValueChange={selectTab}
        aria-label="Learning materials"
        scrollableOnMobile
      >
        <LearningMaterialsTabPanels tab={tab} />
      </TabbedFolderView>
    </div>
  );
}

export function LearningMaterialsView() {
  return (
    <Suspense fallback={<LearningMaterialsFallback />}>
      <LearningMaterialsViewContent />
    </Suspense>
  );
}
