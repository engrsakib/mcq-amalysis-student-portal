import type { Metadata } from "next";

/** Uses root layout `title.template` (`%s — MCQ Analysis`). */
export function pageMetadata(title: string, description?: string): Metadata {
  return description ? { title, description } : { title };
}
