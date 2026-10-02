import { ActivityView } from "@/components/activity/activity-view";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Activity");

export default function ActivityPage() {
  return <ActivityView />;
}
