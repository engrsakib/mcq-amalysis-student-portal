import { LearningMaterialsView } from "@/components/learning-materials/learning-materials-view";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Learning Materials");

export default function LearningMaterialsPage() {
  return <LearningMaterialsView />;
}
