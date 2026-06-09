import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

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
  if (typeof patch.name === "string") {
    const value = patch.name.trim();
    if (!value) return NextResponse.json({ error: "name cannot be empty" }, { status: 400 });
    data.name = value;
  }
  if (typeof patch.price === "string") {
    const value = patch.price.trim();
    if (!value) return NextResponse.json({ error: "price cannot be empty" }, { status: 400 });
    data.price = value;
  }
  if (typeof patch.description === "string") {
    data.description = patch.description.trim();
  }
  if (typeof patch.badge === "string") {
    data.badge = patch.badge.trim();
  }
  if (typeof patch.popular === "boolean") data.popular = patch.popular;
  if (typeof patch.priceAmount === "number") data.priceAmount = patch.priceAmount;
  if (typeof patch.isActive === "boolean") data.isActive = patch.isActive;
  if (patch.features !== undefined) {
    if (!isStringArray(patch.features)) return NextResponse.json({ error: "features must be string[]" }, { status: 400 });
    data.features = patch.features;
  }

  if (patch.notIncluded !== undefined) {
    if (!isStringArray(patch.notIncluded)) {
      return NextResponse.json({ error: "notIncluded must be string[]" }, { status: 400 });
    }
    data.notIncluded = patch.notIncluded;
  }

  const row = await prisma.adminPricing.update({ where: { id }, data });

  await writeAdminAuditLog({
    actorUserId: guard.me.id,
    action: "pricing.update",
    entity: "pricing",
    entityId: row.id,
    ctx: guard,
  });
  return NextResponse.json({
    ...row,
    features: Array.isArray(row.features) ? row.features : (row.features ?? []),
    notIncluded: Array.isArray(row.notIncluded) ? row.notIncluded : (row.notIncluded ?? []),
  });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(_req, {
    rateLimit: { keyPrefix: "admin:write", limit: 120, windowMs: 60_000 },
  });
  if (guard instanceof Response) return guard;

  const { id } = await ctx.params;
  await prisma.adminPricing.delete({ where: { id } });

  await writeAdminAuditLog({
    actorUserId: guard.me.id,
    action: "pricing.delete",
    entity: "pricing",
    entityId: id,
    ctx: guard,
  });
  return NextResponse.json({ ok: true });
}
