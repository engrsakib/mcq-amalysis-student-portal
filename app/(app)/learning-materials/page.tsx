import { LearningMaterialsView } from "@/components/learning-materials/learning-materials-view";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Learning Materials", {
  path: "/learning-materials",
  description:
    "Access books, YouTube lessons, study plans, guidelines, and exam solutions in one place.",
});

export default function LearningMaterialsPage() {
  return <LearningMaterialsView />;
}
