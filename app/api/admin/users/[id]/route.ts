import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { userUpdateSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { session, response } = await requireAdmin();
  if (response) return response;
  if (!session) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = userUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const email = parsed.data.email.toLowerCase();
  if (email !== target.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }
  }

  try {
    // Only rotate the hash when a new password was provided.
    const data =
      parsed.data.password === ""
        ? { email, name: parsed.data.name }
        : {
            email,
            name: parsed.data.name,
            passwordHash: await bcrypt.hash(parsed.data.password, 10),
          };

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, createdAt: true },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { session, response } = await requireAdmin();
  if (response) return response;
  if (!session) return response;

  const { id } = await params;

  // Deleting the signed-in account would immediately break the current session.
  if (session.sub === id) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );
  }

  // Never allow removal of the last remaining admin — that would lock everyone out.
  const [userCount, target] = await Promise.all([
    prisma.user.count(),
    prisma.user.findUnique({ where: { id } }),
  ]);
  if (!target) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (userCount <= 1) {
    return NextResponse.json(
      { error: "Cannot delete the last admin account" },
      { status: 400 }
    );
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
