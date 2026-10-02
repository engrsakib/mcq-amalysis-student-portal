import { NotFoundView } from "@/components/not-found-view";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Page not found", {
  description: "The page you requested could not be found on MCQ Analysis.",
  robots: { index: false, follow: false },
});

export default function NotFound() {
  return <NotFoundView />;
}
