import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/guards";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

function extFromFile(file: File): string {
  const type = (file.type || "").toLowerCase();
  if (type === "image/jpeg" || type === "image/jpg") return ".jpg";
  if (type === "image/png") return ".png";
  if (type === "image/webp") return ".webp";
  if (type === "image/gif") return ".gif";

  const name = (file.name || "").toLowerCase();
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return ".jpg";
  if (name.endsWith(".png")) return ".png";
  if (name.endsWith(".webp")) return ".webp";
  if (name.endsWith(".gif")) return ".gif";

  return "";
}

export async function POST(req: Request) {
  const ctx = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:upload", limit: 60, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  const form = await req.formData();
  const file = form.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  if (!file.type?.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 415 });
  }

  if (file.size <= 0) {
    return NextResponse.json({ error: "Empty file" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 413 });
  }

  const ext = extFromFile(file);
  if (!ext) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 415 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "about");
  await fs.mkdir(uploadsDir, { recursive: true });

  const fileName = `${Date.now()}_${randomUUID()}${ext}`;
  const outPath = path.join(uploadsDir, fileName);
  await fs.writeFile(outPath, bytes);

  return NextResponse.json({
    url: `/uploads/about/${fileName}`,
    size: file.size,
    type: file.type,
  });
}
