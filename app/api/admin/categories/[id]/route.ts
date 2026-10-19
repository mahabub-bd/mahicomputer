import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validators";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  try {
    const category = await prisma.category.update({ where: { id }, data: parsed.data });
    revalidateTag("public-data", "max");
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await prisma.category.delete({ where: { id } });
    revalidateTag("public-data", "max");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
