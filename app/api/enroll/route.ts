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

  const { phone, course, ...rest } = parsed.data;

  // If a course was chosen, make sure it exists and is published
  // (free-text titles from the modal never create orphan requests).
  if (course) {
    const exists = await prisma.course.findFirst({
      where: { title: course, published: true },
      select: { id: true },
    });
    if (!exists) {
      return NextResponse.json(
        { error: "Course not available", issues: ["Selected course is not available."] },
        { status: 400 },
      );
    }
  }

  // One active request per phone+course: don't let the same person spam
  // duplicate rows. Still open requests (pending/approved) block a repeat.
  const duplicate = await prisma.enrollment.findFirst({
    where: {
      phone,
      course,
      status: { in: ["PENDING", "APPROVED"] },
    },
    select: { id: true },
  });
  if (duplicate) {
    return NextResponse.json(
      {
        error: "Already submitted",
        issues: ["You already have a pending request for this course."],
      },
      { status: 409 },
    );
  }

  await prisma.enrollment.create({ data: { phone, course, ...rest } });
  return NextResponse.json({ ok: true });
}
