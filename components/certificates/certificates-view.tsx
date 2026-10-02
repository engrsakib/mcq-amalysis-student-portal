import { Award } from "lucide-react";
import { ContentEmptyState } from "@/components/ui/content-empty-state";

export function CertificatesView() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Certificates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Download and share certificates for exams you have completed.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-line bg-card/50">
        <ContentEmptyState
          icon={Award}
          title="Coming soon"
          description="Certificate downloads and sharing will be available here soon."
        />
      </div>
    </div>
  );
}
