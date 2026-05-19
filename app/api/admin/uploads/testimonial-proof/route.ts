import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { requireAdmin } from "@/lib/api/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

function safeBaseName(name: string) {
  const base = path.basename(name);
  return base.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(req: Request) {
  const ctx = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:upload", limit: 60, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file field 'file'" }, { status: 400 });
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json({ error: "Only JPG, PNG, or WEBP images are allowed" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "testimonials");
    await mkdir(uploadsDir, { recursive: true });

    const original = safeBaseName(file.name || "upload");
    const ext = path.extname(original) || (file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg");

    const filename = `img_${ctx.me.id}_${Date.now()}${ext}`;
    const absolutePath = path.join(uploadsDir, filename);

    await writeFile(absolutePath, buffer);

    return NextResponse.json({ url: `/uploads/testimonials/${filename}` });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Upload failed" }, { status: 500 });
  }
}
