import { CertificatesView } from "@/components/certificates/certificates-view";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Certificates", {
  path: "/certificates",
  description:
    "View and download your MCQ Analysis certificates and achievement records.",
});

export default function CertificatesPage() {
  return <CertificatesView />;
}
