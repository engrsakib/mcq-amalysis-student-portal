import { DashboardView } from "@/components/dashboard/dashboard-view";
import { dashboardMock } from "@/lib/dashboard/mock";
import { homePageMetadata } from "@/lib/site/metadata";

export const metadata = homePageMetadata;

export default function DashboardPage() {
  return <DashboardView data={dashboardMock} />;
}
