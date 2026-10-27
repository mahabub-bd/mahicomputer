import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { batchUpdateSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const read = batchUpdateSchema.safeParse(body);
  if (!read.success) {
    return NextResponse.json(
      { error: "Invalid batch detail", issues: read.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }
  const { startDate, ...rest } = read.data;

  try {
    const batch = await prisma.batch.update({
      where: { id },
      data: {
        ...rest,
        // "" clears the date; absent leaves it untouched.
        ...(startDate !== undefined ? { startDate: startDate ? new Date(startDate) : null } : {}),
      },
    });
    return NextResponse.json(batch);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await prisma.batch.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
