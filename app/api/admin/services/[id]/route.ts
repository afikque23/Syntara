import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

function normalizeFeatures(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim())
    .filter(Boolean);
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

  for (const key of ["name", "description"]) {
    if (typeof patch[key] !== "string") continue;
    const value = patch[key].trim();
    if (!value) return NextResponse.json({ error: `${key} cannot be empty` }, { status: 400 });
    data[key] = value;
  }

  for (const key of ["icon", "estimasi"]) {
    if (typeof patch[key] !== "string") continue;
    data[key] = patch[key].trim();
  }

  if (patch.tagline !== undefined) {
    if (typeof patch.tagline !== "string") return NextResponse.json({ error: "tagline must be a string" }, { status: 400 });
    data.tagline = patch.tagline.trim() || null;
  }

  if (patch.highlight !== undefined) {
    if (typeof patch.highlight !== "string") return NextResponse.json({ error: "highlight must be a string" }, { status: 400 });
    data.highlight = patch.highlight.trim() || null;
  }

  if (patch.features !== undefined) {
    if (!Array.isArray(patch.features)) {
      return NextResponse.json({ error: "features must be an array" }, { status: 400 });
    }
    data.features = normalizeFeatures(patch.features);
  }

  if ((patch as Record<string, unknown>).previewFeatures !== undefined) {
    const pv = (patch as Record<string, unknown>).previewFeatures;
    if (!Array.isArray(pv)) {
      return NextResponse.json({ error: "previewFeatures must be an array" }, { status: 400 });
    }
    data.previewFeatures = normalizeFeatures(pv);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const row = await prisma.adminService.update({ where: { id }, data });

  await writeAdminAuditLog({
    actorUserId: guard.me.id,
    action: "service.update",
    entity: "service",
    entityId: row.id,
    ctx: guard,
  });

  return NextResponse.json(row);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  // No request body, but keep same-origin + rate limiting and require auth.
  const guard = await requireAdmin(_req, {
    rateLimit: { keyPrefix: "admin:write", limit: 120, windowMs: 60_000 },
  });
  if (guard instanceof Response) return guard;

  const { id } = await ctx.params;
  await prisma.adminService.delete({ where: { id } });

  await writeAdminAuditLog({
    actorUserId: guard.me.id,
    action: "service.delete",
    entity: "service",
    entityId: id,
    ctx: guard,
  });
  return NextResponse.json({ ok: true });
}
