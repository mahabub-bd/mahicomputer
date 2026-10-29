import { requireAdmin } from "@/lib/auth";
import { auditLabel, logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/lib/validators";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { response, session } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  try {
    const before = await prisma.post.findUnique({ where: { id } });
    const post = await prisma.post.update({
      where: { id },
      data: { ...parsed.data, publishedById: session!.sub },
    });
  await logAudit({
    action: "UPDATE",
    entity: "Blog post",
    entityId: post.id,
    summary: `Updated Blog post — ${auditLabel(post)}`,
    oldValue: before,
    newValue: post,
  });
    revalidateTag("public-data", "max");
    return NextResponse.json(post);
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    throw e;
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    const deleted = await prisma.post.delete({ where: { id } });
    await logAudit({
      action: "DELETE",
      entity: "Blog post",
      entityId: id,
      summary: `Deleted Blog post — ${auditLabel(deleted)}`,
      oldValue: deleted,
    });
    revalidateTag("public-data", "max");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
