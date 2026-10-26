import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { AdmissionFormPdf } from "@/lib/pdf/documents";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

/** GET — printable admission form PDF for one admission. */
export async function GET(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const [enrollment, settings] = await Promise.all([
    prisma.enrollment.findUnique({ where: { id } }),
    prisma.siteSetting.findUnique({
      where: { id: 1 },
      select: { businessName: true, address: true },
    }),
  ]);
  if (!enrollment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = await renderToBuffer(
    <AdmissionFormPdf
      enrollment={enrollment}
      businessName={settings?.businessName ?? ""}
      address={settings?.address ?? ""}
    />,
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="admission-form-${enrollment.studentId || enrollment.id}.pdf"`,
    },
  });
}
