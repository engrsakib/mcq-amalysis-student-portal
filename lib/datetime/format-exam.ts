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
