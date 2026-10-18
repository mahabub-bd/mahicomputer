/** Prisma Json columns hold string arrays; be defensive when parsing. */
export function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}
