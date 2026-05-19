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
  for (const key of ["name", "institution", "role", "comment", "journal"]) {
    if (typeof patch[key] === "string") {
      const value = patch[key].trim();
      if (!value) return NextResponse.json({ error: `${key} cannot be empty` }, { status: 400 });
      data[key] = value;
    }
  }
  if (typeof patch.rating === "number" && Number.isFinite(patch.rating)) data.rating = Math.round(patch.rating);

  const row = await prisma.adminTestimonial.update({ where: { id }, data });

  await writeAdminAuditLog({
    actorUserId: guard.me.id,
    action: "testimonial.update",
    entity: "testimonial",
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
  await prisma.adminTestimonial.delete({ where: { id } });

  await writeAdminAuditLog({
    actorUserId: guard.me.id,
    action: "testimonial.delete",
    entity: "testimonial",
    entityId: id,
    ctx: guard,
  });
  return NextResponse.json({ ok: true });
}
