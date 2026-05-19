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

  const patch = (body ?? {}) as {
    name?: unknown;
    whatsapp?: unknown;
    email?: unknown;
    service?: unknown;
    notes?: unknown;
    adminNotes?: unknown;
    status?: unknown;
  };

  const data: Record<string, unknown> = {};
  if (typeof patch.name === "string") {
    const v = patch.name.trim();
    if (!v) return NextResponse.json({ error: "name cannot be empty" }, { status: 400 });
    data.name = v;
  }
  if (typeof patch.whatsapp === "string") {
    const v = patch.whatsapp.trim();
    if (!v) return NextResponse.json({ error: "whatsapp cannot be empty" }, { status: 400 });
    data.whatsapp = v;
  }
  if (typeof patch.email === "string") data.email = patch.email.trim();
  if (typeof patch.service === "string") {
    const v = patch.service.trim();
    if (!v) return NextResponse.json({ error: "service cannot be empty" }, { status: 400 });
    data.service = v;
  }
  if (typeof patch.notes === "string") data.notes = patch.notes;
  if (patch.adminNotes === null) data.adminNotes = null;
  if (typeof patch.adminNotes === "string") data.adminNotes = patch.adminNotes;
  if (patch.status === "new" || patch.status === "processing" || patch.status === "done") data.status = patch.status;

  const row = await prisma.adminRequest.update({
    where: { id },
    data,
  });

  await writeAdminAuditLog({
    actorUserId: guard.me.id,
    action: "request.update",
    entity: "request",
    entityId: row.id,
    meta: { status: row.status },
    ctx: guard,
  });

  return NextResponse.json({
    id: row.id,
    name: row.name,
    whatsapp: row.whatsapp,
    email: row.email,
    service: row.service,
    notes: row.notes,
    adminNotes: row.adminNotes,
    status: row.status,
    source: row.source,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(_req, {
    rateLimit: { keyPrefix: "admin:write", limit: 120, windowMs: 60_000 },
  });
  if (guard instanceof Response) return guard;

  const { id } = await ctx.params;
  await prisma.adminRequest.delete({ where: { id } });

  await writeAdminAuditLog({
    actorUserId: guard.me.id,
    action: "request.delete",
    entity: "request",
    entityId: id,
    ctx: guard,
  });
  return NextResponse.json({ ok: true });
}
