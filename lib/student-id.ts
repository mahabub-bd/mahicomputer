import { prisma } from "./prisma";


export async function nextStudentId(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `MC-${year}-`;
  const count = await prisma.enrollment.count({
    where: { studentId: { startsWith: prefix } },
  });
  return `${prefix}${String(count + 1).padStart(4, "0")}`;
}
