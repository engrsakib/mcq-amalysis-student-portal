import { DashboardView } from "@/components/dashboard/dashboard-view";
import { dashboardMock } from "@/lib/dashboard/mock";

export default function DashboardPage() {
  return <DashboardView data={dashboardMock} />;
}
