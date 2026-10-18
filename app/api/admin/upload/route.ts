import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
};
const MAX_SIZE = 4 * 1024 * 1024; // 4 MB

// Swap this function out for Vercel Blob/S3 later — everything else stays the same.
async function saveFile(buffer: Buffer, filename: string) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "`file` is required" }, { status: 400 });
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Allowed types: png, jpg, webp, svg" },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Max size is 4 MB" }, { status: 400 });
  }

  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}${ext}`;
  const url = await saveFile(Buffer.from(await file.arrayBuffer()), filename);
  return NextResponse.json({ url });
}
