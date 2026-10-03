import Image from "next/image";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthDocumentationLink } from "@/components/auth/auth-documentation-link";

export function AuthSidebar() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center bg-card px-4 py-8 lg:min-h-svh lg:px-6 lg:py-8">
      <div className="mb-5 w-full max-w-md shrink-0">
        <Image
          src="/logo.png"
          alt="MCQ Analysis"
          width={320}
          height={120}
          className="mx-auto h-auto w-full max-w-[180px] object-contain"
          priority
        />
      </div>

      <div className="w-full max-w-md shrink-0">
        <AuthCard />
        <AuthDocumentationLink />
      </div>

      <footer className="mt-6 max-w-md shrink-0 pb-4 text-center text-xs leading-relaxed text-primary">
        <p className="font-medium">
          Developed by{" "}
          <a
            href="https://www.engrsakib.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
          >
            engrsakib
          </a>
        </p>
        <p className="mt-1 text-muted-foreground">
          © {new Date().getFullYear()} MCQ Analysis. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
