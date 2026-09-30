import { LogoutButton } from "@/components/home/logout-button";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-page px-4 py-12">
      <main className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-primary">
          MCQ Analysis Student
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          You are signed in. This is your private home. More features will appear
          here soon.
        </p>
        <div className="mt-6 flex justify-center">
          <LogoutButton />
        </div>
      </main>
    </div>
  );
}
