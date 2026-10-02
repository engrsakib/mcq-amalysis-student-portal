import { apiPostAuth } from "@/lib/api/authorized";
import type {
  ProctoringEventRecorded,
  ProctoringEventRequest,
} from "@/lib/api/types";

export function postProctoringEvent(
  body: ProctoringEventRequest,
  init?: RequestInit
) {
  return apiPostAuth<ProctoringEventRecorded>(
    "/results/proctoring-event",
    body,
    init
  );
}
