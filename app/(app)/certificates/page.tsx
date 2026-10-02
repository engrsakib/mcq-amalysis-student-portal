import { CertificatesView } from "@/components/certificates/certificates-view";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Certificates");

export default function CertificatesPage() {
  return <CertificatesView />;
}
