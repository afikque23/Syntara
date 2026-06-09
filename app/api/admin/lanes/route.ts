import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseTakeSkip, requireAdmin } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

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

  const { name, description, priceAmount, priceText, isActive } = (body ?? {}) as Record<string, unknown>;
  if (typeof name !== "string" || !name.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });
  if (typeof description !== "string") return NextResponse.json({ error: "description is required" }, { status: 400 });
  if (typeof priceAmount !== "number") return NextResponse.json({ error: "priceAmount is required" }, { status: 400 });
  if (typeof priceText !== "string") return NextResponse.json({ error: "priceText is required" }, { status: 400 });

  const row = await prisma.adminPublicationLane.create({
    data: {
      name: name.trim(),
      description,
      priceAmount,
      priceText,
      isActive: typeof isActive === "boolean" ? isActive : true,
    },
  });

  await writeAdminAuditLog({
    actorUserId: ctx.me.id,
    action: "lane.create",
    entity: "lane",
    entityId: row.id,
    meta: { name: row.name },
    ctx,
  });

  return NextResponse.json(row);
}

export async function GET(req: Request) {
  const ctx = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:read", limit: 300, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  const { take, skip } = parseTakeSkip(ctx.url);
  const [total, rows] = await Promise.all([
    prisma.adminPublicationLane.count(),
    prisma.adminPublicationLane.findMany({
      orderBy: { createdAt: "asc" },
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
