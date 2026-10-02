import { ResultsView } from "@/components/results/results-view";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Results");

export default function ResultsPage() {
  return <ResultsView />;
}
