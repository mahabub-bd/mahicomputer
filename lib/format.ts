/** Compact date/time helpers shared by admin detail pages and lists. */

/** "18 Oct 2026, 14:30" — timestamp for summaries and record cards. */
export function formatDateTime(value: Date | string): string {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "18 Oct 2026" — date only. */
export function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
