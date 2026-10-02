import { AppShell } from "@/components/dashboard/app-shell";
import { UserProfileProvider } from "@/components/dashboard/user-profile-provider";
import { UpcomingExamsProvider } from "@/hooks/use-upcoming-exams";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <UserProfileProvider>
      <UpcomingExamsProvider>
        <AppShell>{children}</AppShell>
      </UpcomingExamsProvider>
    </UserProfileProvider>
  );
}
