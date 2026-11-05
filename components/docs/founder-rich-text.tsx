import type { FounderTextSegment } from "@/lib/docs/founder-profile-data";

export function FounderRichText({ segments }: { segments: FounderTextSegment[] }) {
  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type === "text") {
          return <span key={index}>{segment.value}</span>;
        }
        return (
          <a
            key={index}
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            {segment.label}
          </a>
        );
      })}
    </>
  );
}
