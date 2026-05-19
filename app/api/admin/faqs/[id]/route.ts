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

  if (typeof patch.question === "string") {
    const v = patch.question.trim();
    if (!v) return NextResponse.json({ error: "question cannot be empty" }, { status: 400 });
    data.question = v;
  }
  if (typeof patch.answer === "string") {
    const v = patch.answer.trim();
    if (!v) return NextResponse.json({ error: "answer cannot be empty" }, { status: 400 });
    data.answer = v;
  }
  if (typeof patch.category === "string") {
    const v = patch.category.trim();
    if (!v) return NextResponse.json({ error: "category cannot be empty" }, { status: 400 });
    data.category = v;
  }
  if (typeof patch.sortOrder === "number" && Number.isFinite(patch.sortOrder)) {
    data.sortOrder = Math.floor(patch.sortOrder);
  }
  if (typeof patch.published === "boolean") {
    data.published = patch.published;
  }

  const row = await prisma.adminFaq.update({ where: { id }, data });

  await writeAdminAuditLog({
    actorUserId: guard.me.id,
    action: "faq.update",
    entity: "faq",
    entityId: row.id,
    ctx: guard,
  });

  return NextResponse.json(row);
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:write", limit: 120, windowMs: 60_000 },
  });
  if (guard instanceof Response) return guard;

  const { id } = await ctx.params;
  await prisma.adminFaq.delete({ where: { id } });

  await writeAdminAuditLog({
    actorUserId: guard.me.id,
    action: "faq.delete",
    entity: "faq",
    entityId: id,
    ctx: guard,
  });

  return NextResponse.json({ ok: true });
}
