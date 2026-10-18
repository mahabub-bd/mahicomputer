import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enrollmentSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = enrollmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  await prisma.enrollment.create({ data: parsed.data });
  return NextResponse.json({ ok: true });
}
