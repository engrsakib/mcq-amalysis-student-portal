import { ProfileForm } from "@/components/settings/profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Settings");

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Profile settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your name, contact details, and profile image.
        </p>
      </div>
      <Card className="rounded-2xl border-border/60 shadow-sm ring-0">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Your profile</CardTitle>
          <CardDescription>
            Changes apply across the dashboard and sidebar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
