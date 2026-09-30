export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-page px-4">
      <main className="flex w-full max-w-lg flex-col gap-4 rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">MCQ Analysis Student</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Light theme is active. Auth screens will be added under{" "}
          <code className="rounded-md bg-primary-soft px-1.5 py-0.5 font-mono text-xs text-ink">
            app/(auth)
          </code>
          .
        </p>
      </main>
    </div>
  );
}
