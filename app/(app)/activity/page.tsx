import { ActivityView } from "@/components/activity/activity-view";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Activity", {
  path: "/activity",
  description:
    "See your recent activity, exam submissions, and updates from MCQ Analysis.",
});

export default function ActivityPage() {
  return <ActivityView />;
}
