import { PublicDocsShell } from "@/components/docs/public-docs-shell";

export default function PublicDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PublicDocsShell>{children}</PublicDocsShell>
    </div>
  );
}
