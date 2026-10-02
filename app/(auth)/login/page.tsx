import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Log in");

export default function LoginPage() {
  return <AuthPageShell />;
}
