import { ResultsView } from "@/components/results/results-view";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Results", {
  path: "/results",
  description:
    "View exam results, leaderboard rankings, and track your performance over time with MCQ Analysis.",
});

export default function ResultsPage() {
  return <ResultsView />;
}
