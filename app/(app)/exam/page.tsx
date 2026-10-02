import { ExamsView } from "@/components/dashboard/exams-view";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Exams");

export default function ExamsPage() {
  return <ExamsView />;
}
