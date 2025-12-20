export function getDateRange(period: "daily" | "weekly" | "monthly") {
  const now = new Date();

  if (period === "daily") {
    return {
      start: new Date(now.setHours(0, 0, 0, 0)),
      end: new Date()
    };
  }

  if (period === "weekly") {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return { start, end: new Date() };
  }

  const start = new Date();
  start.setMonth(start.getMonth() - 1);
  return { start, end: new Date() };
}
