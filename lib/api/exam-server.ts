import "server-only";

import { apiGetAuthServer } from "@/lib/api/authorized-server";
import type { ExamEntry } from "@/lib/api/types";

export function getExamByNumberServer(examNumber: string | number) {
  return apiGetAuthServer<ExamEntry>(`/exam/user/${examNumber}`);
}
