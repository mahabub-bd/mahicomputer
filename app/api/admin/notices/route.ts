import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { noticeSchema } from "@/lib/validators";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const notices = await prisma.notice.findMany({
    orderBy: [{ order: "asc" }, { date: "desc" }],
  });
  return NextResponse.json(notices);
}

export async function POST(req: Request) {
  const { response, session } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = noticeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  const notice = await prisma.notice.create({
    data: { ...parsed.data, publishedById: session!.sub },
  });
  revalidateTag("public-data", "max");
  return NextResponse.json(notice, { status: 201 });
}
