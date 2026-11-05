import { DocsHero } from "@/components/docs/docs-hero";
import { FounderBooksShops } from "@/components/docs/founder-books-shops";
import { docsPageMetadata } from "@/lib/docs/metadata";

export const metadata = docsPageMetadata("Founder books — Gazi Mizanur Rahman", {
  path: "/docs/founder/books",
  description:
    "Buy BCS Preliminary Analysis and other books by Gazi Mizanur Rahman from Rokomari, Wafilife, and trusted Bangladeshi online book shops.",
  keywords: [
    "BCS Preliminary Analysis book",
    "Gazi Mizanur Rahman books",
    "Rokomari BCS books",
  ],
});

export default function DocsFounderBooksPage() {
  return (
    <>
      <DocsHero
        variant="page"
        breadcrumbLabel="Books"
        title="Books & shops"
        subtitle="Catalog and trusted online retailers for Gazi Mizanur Rahman's publications."
      />
      <FounderBooksShops />
    </>
  );
}
