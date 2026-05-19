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
    prisma.adminTestimonialImage.count(),
    prisma.adminTestimonialImage.findMany({
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

  const { imageUrl } = (body ?? {}) as Record<string, unknown>;
  if (typeof imageUrl !== "string" || !imageUrl.trim()) {
    return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
  }

  const row = await prisma.adminTestimonialImage.create({
    data: { imageUrl: imageUrl.trim() },
  });

  await writeAdminAuditLog({
    actorUserId: ctx.me.id,
    action: "testimonialImage.create",
    entity: "testimonialImage",
    entityId: row.id,
    ctx,
  });

  return NextResponse.json(row);
}
