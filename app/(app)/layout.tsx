import { AppShell } from "@/components/dashboard/app-shell";
import { UserProfileProvider } from "@/components/dashboard/user-profile-provider";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <UserProfileProvider>
      <AppShell>{children}</AppShell>
    </UserProfileProvider>
  );
}
