import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

function isValuesArray(v: unknown): v is Array<boolean | string> {
  return Array.isArray(v) && v.every((x) => typeof x === "boolean" || typeof x === "string");
}

function normalizeValues(v: unknown): Array<boolean | string> {
  if (!isValuesArray(v)) return [];
  return v.map((x) => (typeof x === "string" ? x.trim() : x)).map((x) => (typeof x === "string" && !x ? false : x));
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

  if (typeof patch.feature === "string") {
    const value = patch.feature.trim();
    if (!value) return NextResponse.json({ error: "feature cannot be empty" }, { status: 400 });
    data.feature = value;
  }

  if (patch.values !== undefined) {
    if (!isValuesArray(patch.values)) {
      return NextResponse.json({ error: "values must be (boolean|string)[]" }, { status: 400 });
    }
    data.values = normalizeValues(patch.values);
  }

  if (patch.sortOrder !== undefined) {
    if (typeof patch.sortOrder !== "number" || !Number.isFinite(patch.sortOrder)) {
      return NextResponse.json({ error: "sortOrder must be number" }, { status: 400 });
    }
    data.sortOrder = Math.floor(patch.sortOrder);
  }

  const row = await prisma.adminPricingComparisonRow.update({ where: { id }, data });

  await writeAdminAuditLog({
    actorUserId: guard.me.id,
    action: "pricingComparison.update",
    entity: "pricingComparison",
    entityId: row.id,
    ctx: guard,
  });

  return NextResponse.json({
    ...row,
    values: normalizeValues(row.values),
  });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:write", limit: 120, windowMs: 60_000 },
  });
  if (guard instanceof Response) return guard;

  const { id } = await ctx.params;
  await prisma.adminPricingComparisonRow.delete({ where: { id } });

  await writeAdminAuditLog({
    actorUserId: guard.me.id,
    action: "pricingComparison.delete",
    entity: "pricingComparison",
    entityId: id,
    ctx: guard,
  });

  return NextResponse.json({ ok: true });
}
