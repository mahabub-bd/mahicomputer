import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const enrollments = await prisma.enrollment.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(enrollments);
}
