import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseTakeSkip, requireAdmin } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

export async function GET(req: Request) {
  const ctx = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:read", limit: 300, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  const { take, skip } = parseTakeSkip(ctx.url);
  const [total, rows] = await Promise.all([
    prisma.adminTestimonial.count(),
    prisma.adminTestimonial.findMany({
      orderBy: { createdAt: "desc" },
      ...(take !== undefined ? { take } : {}),
      ...(skip !== undefined ? { skip } : {}),
    }),
  ]);

  return NextResponse.json(rows, {
    headers: {
      "x-total-count": String(total),
    },
  });
}

export async function POST(req: Request) {
  const ctx = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:write", limit: 120, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, institution, role, comment, rating, journal } = (body ?? {}) as Record<string, unknown>;
  if (typeof name !== "string" || !name.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });
  if (typeof institution !== "string") return NextResponse.json({ error: "institution is required" }, { status: 400 });
  if (typeof role !== "string") return NextResponse.json({ error: "role is required" }, { status: 400 });
  if (typeof comment !== "string") return NextResponse.json({ error: "comment is required" }, { status: 400 });
  if (typeof rating !== "number" || !Number.isFinite(rating)) return NextResponse.json({ error: "rating is required" }, { status: 400 });
  if (typeof journal !== "string") return NextResponse.json({ error: "journal is required" }, { status: 400 });

  const row = await prisma.adminTestimonial.create({
    data: {
      name: name.trim(),
      institution,
      role,
      comment,
      rating: Math.round(rating),
      journal,
    },
  });

  await writeAdminAuditLog({
    actorUserId: ctx.me.id,
    action: "testimonial.create",
    entity: "testimonial",
    entityId: row.id,
    meta: { name: row.name, rating: row.rating },
    ctx,
  });

  return NextResponse.json(row);
}
