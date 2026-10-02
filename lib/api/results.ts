import { apiPostAuth } from "@/lib/api/authorized";
import type {
  SubmitExamResultRequest,
  SubmitExamResultResponse,
} from "@/lib/api/types";

export function submitExamResult(body: SubmitExamResultRequest) {
  return apiPostAuth<SubmitExamResultResponse>("/results/", body);
}
