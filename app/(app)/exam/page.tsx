import { ExamsView } from "@/components/dashboard/exams-view";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Exams", {
  path: "/exam",
  description:
    "Browse previous, subjective, and upcoming exams. Join live tests or practice with verified MCQ sets.",
});

export default function ExamsPage() {
  return <ExamsView />;
}
