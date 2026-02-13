export function formatToTimezone(date: Date | string, timezone?: string): string {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    hour12: false,
  });
}
