import { DashboardView } from "@/components/dashboard/dashboard-view";
import { dashboardMock } from "@/lib/dashboard/mock";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Dashboard", {
  path: "/",
  description:
    "Your MCQ Analysis student dashboard—upcoming exams, live tests, performance stats, and quick access to practice.",
});

export default function DashboardPage() {
  return <DashboardView data={dashboardMock} />;
}
