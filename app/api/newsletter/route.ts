import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validators";

/** Public newsletter signup; re-subscribing an existing email is a no-op. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email.toLowerCase() },
    create: { email: parsed.data.email.toLowerCase() },
    update: {},
  });
  return NextResponse.json({ ok: true });
}
