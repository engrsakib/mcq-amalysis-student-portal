import { apiGetAuth } from "@/lib/api/authorized";
import type {
  PersonalGrowthPayload,
  PersonalGrowthRange,
} from "@/lib/api/types";

export type GetPersonalGrowthParams = {
  range?: PersonalGrowthRange;
};

export function getPersonalGrowth(params: GetPersonalGrowthParams = {}) {
  const { range = "last30" } = params;
  const query = new URLSearchParams({ range });
  return apiGetAuth<PersonalGrowthPayload>(
    `/user/personal-growth?${query.toString()}`
  );
}
