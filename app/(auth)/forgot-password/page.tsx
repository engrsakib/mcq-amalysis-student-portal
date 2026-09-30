import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-page px-4">
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-primary">Forgot password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Password reset will be available in the next update.</p>
          <Link href="/login" className="font-medium text-primary hover:underline">
            Return to login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
