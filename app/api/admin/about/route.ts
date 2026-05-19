import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

function isJsonObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export async function GET(req: Request) {
  const ctx = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:read", limit: 300, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  const row = await prisma.siteAbout.findUnique({ where: { id: "singleton" } });
  if (!row) return NextResponse.json({ data: null, published: false, updatedAt: null });

  return NextResponse.json({ data: row.data, published: row.published, updatedAt: row.updatedAt });
}

export async function PUT(req: Request) {
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

  if (!isJsonObject(body)) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const data = body.data;
  const published = body.published;

  if (data !== null && data !== undefined && typeof data !== "object") {
    return NextResponse.json({ error: "data must be an object" }, { status: 400 });
  }

  const row = await prisma.siteAbout.upsert({
    where: { id: "singleton" },
    update: {
      ...(data !== undefined ? { data: data as never } : {}),
      ...(typeof published === "boolean" ? { published } : {}),
    },
    create: {
      id: "singleton",
      data: (data ?? {}) as never,
      published: typeof published === "boolean" ? published : true,
    },
  });

  await writeAdminAuditLog({
    actorUserId: ctx.me.id,
    action: "about.update",
    entity: "about",
    entityId: "singleton",
    ctx,
  });

  return NextResponse.json({ data: row.data, published: row.published, updatedAt: row.updatedAt });
}
