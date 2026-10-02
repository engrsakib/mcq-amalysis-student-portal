import { AuthPageShell } from "@/components/auth/auth-page-shell";
import {
  DEFAULT_OG_DESCRIPTION,
  pageMetadata,
  PORTAL_BRAND_TITLE,
} from "@/lib/site/metadata";

export const metadata = pageMetadata("Log in", {
  ogTitle: PORTAL_BRAND_TITLE,
  description: DEFAULT_OG_DESCRIPTION,
});

export default function LoginPage() {
  return <AuthPageShell />;
}
