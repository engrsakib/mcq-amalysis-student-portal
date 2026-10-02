import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Forgot password");

export default function ForgotPasswordPage() {
  redirect("/login");
}
