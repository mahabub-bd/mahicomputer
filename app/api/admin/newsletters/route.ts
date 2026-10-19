import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { newsletterIssueSchema } from "@/lib/validators";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const newsletters = await prisma.newsletter.findMany({
    orderBy: [{ order: "asc" }, { date: "desc" }],
  });
  return NextResponse.json(newsletters);
}

export async function POST(req: Request) {
  const { response, session } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = newsletterIssueSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  const newsletter = await prisma.newsletter.create({
    data: { ...parsed.data, publishedById: session!.sub },
  });
  revalidateTag("public-data", "max");
  return NextResponse.json(newsletter, { status: 201 });
}
