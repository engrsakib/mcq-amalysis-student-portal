import { DashboardView } from "@/components/dashboard/dashboard-view";
import { dashboardMock } from "@/lib/dashboard/mock";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Dashboard");

export default function DashboardPage() {
  return <DashboardView data={dashboardMock} />;
}
