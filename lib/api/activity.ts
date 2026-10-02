import { apiGetAuth } from "@/lib/api/authorized";
import type {
  ActivityLogsMetaRaw,
  ActivityLogsPayload,
  PaginatedMeta,
} from "@/lib/api/types";

export type GetMyActivityLogsParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
  action?: string;
};

function normalizeActivityMeta(raw: ActivityLogsMetaRaw): PaginatedMeta {
  return {
    page: raw.page,
    limit: raw.limit,
    total: raw.total,
    totalPage: raw.totalPage ?? raw.totalPages ?? 1,
  };
}

type ActivityLogsApiPayload = {
  data: ActivityLogsPayload["data"];
  meta: ActivityLogsMetaRaw;
};

export async function getMyActivityLogs(
  params: GetMyActivityLogsParams = {}
): Promise<ActivityLogsPayload> {
  const {
    page = 1,
    limit = 20,
    searchTerm = "",
    dateFrom,
    dateTo,
    action,
  } = params;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    searchTerm: searchTerm.trim(),
  });

  if (dateFrom?.trim()) {
    query.set("dateFrom", dateFrom.trim());
  }
  if (dateTo?.trim()) {
    query.set("dateTo", dateTo.trim());
  }
  if (action?.trim()) {
    query.set("action", action.trim());
  }

  const payload = await apiGetAuth<ActivityLogsApiPayload>(
    `/activity/me?${query.toString()}`
  );

  return {
    data: payload.data,
    meta: normalizeActivityMeta(payload.meta),
  };
}
