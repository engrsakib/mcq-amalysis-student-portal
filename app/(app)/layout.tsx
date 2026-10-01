import { AppShell } from "@/components/dashboard/app-shell";
import { dashboardMock } from "@/lib/dashboard/mock";

export default function AppLayout({ children }: LayoutProps<"/">) {
  const { student } = dashboardMock;
  return (
    <AppShell
      studentName={student.name}
      studentEmail={student.email}
      initials={student.initials}
    >
      {children}
    </AppShell>
  );
}
