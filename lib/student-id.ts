import { prisma } from "./prisma";

/**
 * Generates the next human-readable student ID, e.g. "MC-2026-0042".
 * Sequence is per year, derived from how many IDs already exist for that
 * year — fine at training-center scale (single-digit concurrent approvals).
 */
export async function nextStudentId(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `MC-${year}-`;
  const count = await prisma.enrollment.count({
    where: { studentId: { startsWith: prefix } },
  });
  return `${prefix}${String(count + 1).padStart(4, "0")}`;
}
