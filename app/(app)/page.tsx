import { DashboardView } from "@/components/dashboard/dashboard-view";
import { FacebookSupportWidget } from "@/components/support/facebook-support-widget";
import { dashboardMock } from "@/lib/dashboard/mock";
import { homePageMetadata } from "@/lib/site/metadata";

export const metadata = homePageMetadata;

export default function DashboardPage() {
  return (
    <>
      <DashboardView data={dashboardMock} />
      <FacebookSupportWidget />
    </>
  );
}
