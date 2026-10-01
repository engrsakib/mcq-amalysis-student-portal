const BD_TZ = "Asia/Dhaka";

const dateTimeFormatter = new Intl.DateTimeFormat("en-BD", {
  timeZone: BD_TZ,
  dateStyle: "medium",
  timeStyle: "short",
  hour12: true,
});

const dateOnlyFormatter = new Intl.DateTimeFormat("en-BD", {
  timeZone: BD_TZ,
  dateStyle: "medium",
});

const dateShortFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: BD_TZ,
  day: "2-digit",
  month: "short",
});

export function formatExamDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return dateTimeFormatter.format(date);
}

export function formatExamDateOnly(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return dateOnlyFormatter.format(date);
}

export function formatExamDateShort(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return dateShortFormatter.format(date);
}
