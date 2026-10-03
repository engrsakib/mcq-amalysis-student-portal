import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { SettingsSubnav } from "@/components/settings/settings-subnav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Change password", {
  path: "/settings/change-password",
  description: "Update your MCQ Analysis account password securely.",
});

export default function ChangePasswordPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Account security</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a strong password to protect your account.
          </p>
        </div>
        <SettingsSubnav />
      </div>
      <Card className="rounded-2xl border-border/60 shadow-sm ring-0">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Change password</CardTitle>
          <CardDescription>
            Enter your current password, then set and confirm a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
