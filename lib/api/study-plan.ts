import { apiGetAuth } from "@/lib/api/authorized";
import type { UserStudyPlanPayload } from "@/lib/api/types";

export type GetUserStudyPlansParams = {
  page?: number;
  limit?: number;
};

export function getUserStudyPlans(params: GetUserStudyPlansParams = {}) {
  const { page = 1, limit = 5 } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  return apiGetAuth<UserStudyPlanPayload>(`/study-plan/user?${query.toString()}`);
}
