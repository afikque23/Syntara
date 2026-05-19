import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseTakeSkip, requireAdmin } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

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

  const { name, price, description, features, notIncluded, badge, popular } = (body ?? {}) as Record<string, unknown>;
  if (typeof name !== "string" || !name.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });
  if (typeof price !== "string") return NextResponse.json({ error: "price is required" }, { status: 400 });
  if (typeof description !== "string") return NextResponse.json({ error: "description is required" }, { status: 400 });
  if (!isStringArray(features)) return NextResponse.json({ error: "features must be string[]" }, { status: 400 });
  if (notIncluded !== undefined && !isStringArray(notIncluded)) {
    return NextResponse.json({ error: "notIncluded must be string[]" }, { status: 400 });
  }

  const row = await prisma.adminPricing.create({
    data: {
      name: name.trim(),
      price,
      description,
      features,
      notIncluded: isStringArray(notIncluded) ? notIncluded : [],
      badge: typeof badge === "string" ? badge : "",
      popular: typeof popular === "boolean" ? popular : false,
    },
  });

  await writeAdminAuditLog({
    actorUserId: ctx.me.id,
    action: "pricing.create",
    entity: "pricing",
    entityId: row.id,
    meta: { name: row.name },
    ctx,
  });

  return NextResponse.json({
    ...row,
    features: Array.isArray(row.features) ? row.features : (row.features ?? []),
    notIncluded: Array.isArray(row.notIncluded) ? row.notIncluded : (row.notIncluded ?? []),
  });
}

export async function GET(req: Request) {
  const ctx = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:read", limit: 300, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  const { take, skip } = parseTakeSkip(ctx.url);
  const [total, rows] = await Promise.all([
    prisma.adminPricing.count(),
    prisma.adminPricing.findMany({
      orderBy: { createdAt: "asc" },
      ...(take !== undefined ? { take } : {}),
      ...(skip !== undefined ? { skip } : {}),
    }),
  ]);

  return NextResponse.json(
    rows.map((p) => ({
      ...p,
      features: Array.isArray(p.features) ? p.features : (p.features ?? []),
      notIncluded: Array.isArray(p.notIncluded) ? p.notIncluded : (p.notIncluded ?? []),
    })),
    {
      headers: {
        "x-total-count": String(total),
      },
    },
  );
}
