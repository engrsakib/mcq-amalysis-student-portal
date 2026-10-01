import Link from "next/link";
import { notFound } from "next/navigation";
import { ExamSessionView } from "@/components/exam/exam-session-view";
import { ApiError } from "@/lib/api/client";
import { getExamByNumberServer } from "@/lib/api/exam-server";
import { toExamSessionPayload } from "@/lib/exam/sanitize-questions";

type ExamPageProps = PageProps<"/exam/[id]">;

function isValidExamNumber(id: string): boolean {
  return /^\d+$/.test(id) && id.length > 0;
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { id } = await params;

  if (!isValidExamNumber(id)) {
    notFound();
  }

  try {
    const entry = await getExamByNumberServer(id);
    const payload = toExamSessionPayload(entry);

    if (payload.questions.length === 0) {
      return (
        <div className="mx-auto max-w-lg py-12 text-center">
          <p className="text-sm text-muted-foreground">
            This exam has no questions yet.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            Back to dashboard
          </Link>
        </div>
      );
    }

    return <ExamSessionView {...payload} />;
  } catch (err) {
    if (err instanceof ApiError && (err.statusCode === 404 || err.statusCode === 401)) {
      notFound();
    }
    if (err instanceof ApiError && err.statusCode === 503) {
      return (
        <div className="mx-auto max-w-lg py-12 text-center">
          <p className="text-base font-medium text-ink">Could not load this exam</p>
          <p className="mt-2 text-sm text-muted-foreground">{err.message}</p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
          >
            Back to dashboard
          </Link>
        </div>
      );
    }
    throw err;
  }
}
