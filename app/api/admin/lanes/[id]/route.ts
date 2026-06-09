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
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, description, priceAmount, priceText, isActive } = (body ?? {}) as Record<string, unknown>;

  try {
    const row = await prisma.adminPublicationLane.update({
      where: { id },
      data: {
        ...(typeof name === "string" ? { name: name.trim() } : {}),
        ...(typeof description === "string" ? { description } : {}),
        ...(typeof priceAmount === "number" ? { priceAmount } : {}),
        ...(typeof priceText === "string" ? { priceText } : {}),
        ...(typeof isActive === "boolean" ? { isActive } : {}),
      },
    });

    await writeAdminAuditLog({
      actorUserId: guard.me.id,
      action: "lane.update",
      entity: "lane",
      entityId: row.id,
      meta: { patch: body },
      ctx: guard,
    });

    return NextResponse.json(row);
  } catch {
    return NextResponse.json({ error: "Not found or update failed" }, { status: 404 });
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:write", limit: 60, windowMs: 60_000 },
  });
  if (guard instanceof Response) return guard;

  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const row = await prisma.adminPublicationLane.delete({
      where: { id },
    });

    await writeAdminAuditLog({
      actorUserId: guard.me.id,
      action: "lane.delete",
      entity: "lane",
      entityId: row.id,
      meta: { deletedName: row.name },
      ctx: guard,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found or delete failed" }, { status: 404 });
  }
}
