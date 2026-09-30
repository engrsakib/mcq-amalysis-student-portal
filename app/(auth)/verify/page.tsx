import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { VerifyForm } from "@/components/auth/verify-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center bg-page px-4 py-10">
      <Image
        src="/logo.png"
        alt="MCQ Analysis"
        width={240}
        height={80}
        className="mb-8 h-auto w-full max-w-[220px] object-contain"
      />
      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-primary">Verify your account</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="h-40 animate-pulse rounded-lg bg-primary-soft/40" />
            }
          >
            <VerifyForm />
          </Suspense>
        </CardContent>
      </Card>
      <p className="mt-6 text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
