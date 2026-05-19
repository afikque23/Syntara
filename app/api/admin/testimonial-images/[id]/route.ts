import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:write", limit: 120, windowMs: 60_000 },
  });
  if (guard instanceof Response) return guard;

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch = (body ?? {}) as Record<string, unknown>;
  const data: Record<string, unknown> = {};

  if (typeof patch.imageUrl === "string") {
    const v = patch.imageUrl.trim();
    if (!v) return NextResponse.json({ error: "imageUrl cannot be empty" }, { status: 400 });
    data.imageUrl = v;
  }

  const row = await prisma.adminTestimonialImage.update({ where: { id }, data });

  await writeAdminAuditLog({
    actorUserId: guard.me.id,
    action: "testimonialImage.update",
    entity: "testimonialImage",
    entityId: row.id,
    ctx: guard,
  });

  return NextResponse.json(row);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(_req, {
    rateLimit: { keyPrefix: "admin:write", limit: 120, windowMs: 60_000 },
  });
  if (guard instanceof Response) return guard;

  const { id } = await ctx.params;
  await prisma.adminTestimonialImage.delete({ where: { id } });

  await writeAdminAuditLog({
    actorUserId: guard.me.id,
    action: "testimonialImage.delete",
    entity: "testimonialImage",
    entityId: id,
    ctx: guard,
  });

  return NextResponse.json({ ok: true });
}
