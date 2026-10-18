import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const ENROLLMENT_STATUSES = ["PENDING", "APPROVED", "DECLINED"] as const;

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const read = typeof body?.read === "boolean" ? body.read : undefined;
  const rawStatus = typeof body?.status === "string" ? body.status.toUpperCase() : undefined;
  const status =
    rawStatus !== undefined && (ENROLLMENT_STATUSES as readonly string[]).includes(rawStatus)
      ? rawStatus
      : undefined;

  if (read === undefined && status === undefined) {
    return NextResponse.json(
      { error: "`read` boolean or `status` (PENDING | APPROVED | DECLINED) is required" },
      { status: 400 },
    );
  }

  try {
    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: {
        ...(read === undefined ? {} : { read }),
        ...(status === undefined ? {} : { status }),
      },
    });
    return NextResponse.json(enrollment);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await prisma.enrollment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
