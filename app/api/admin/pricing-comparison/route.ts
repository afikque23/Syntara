import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseTakeSkip, requireAdmin } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

function isValuesArray(v: unknown): v is Array<boolean | string> {
  return Array.isArray(v) && v.every((x) => typeof x === "boolean" || typeof x === "string");
}

function normalizeValues(v: unknown): Array<boolean | string> {
  if (!isValuesArray(v)) return [];
  return v.map((x) => (typeof x === "string" ? x.trim() : x)).map((x) => (typeof x === "string" && !x ? false : x));
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

  const { feature, values, sortOrder } = (body ?? {}) as Record<string, unknown>;

  if (typeof feature !== "string" || !feature.trim()) {
    return NextResponse.json({ error: "feature is required" }, { status: 400 });
  }

  if (!isValuesArray(values)) {
    return NextResponse.json({ error: "values must be (boolean|string)[]" }, { status: 400 });
  }

  const row = await prisma.adminPricingComparisonRow.create({
    data: {
      feature: feature.trim(),
      values: normalizeValues(values),
      sortOrder: typeof sortOrder === "number" && Number.isFinite(sortOrder) ? Math.floor(sortOrder) : 0,
    },
  });

  await writeAdminAuditLog({
    actorUserId: ctx.me.id,
    action: "pricingComparison.create",
    entity: "pricingComparison",
    entityId: row.id,
    meta: { feature: row.feature },
    ctx,
  });

  return NextResponse.json({
    ...row,
    values: normalizeValues(row.values),
  });
}

export async function GET(req: Request) {
  const ctx = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:read", limit: 300, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  const { take, skip } = parseTakeSkip(ctx.url);
  const [total, rows] = await Promise.all([
    prisma.adminPricingComparisonRow.count(),
    prisma.adminPricingComparisonRow.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      ...(take !== undefined ? { take } : {}),
      ...(skip !== undefined ? { skip } : {}),
    }),
  ]);

  return NextResponse.json(
    rows.map((r: any) => ({
      ...r,
      values: normalizeValues(r.values),
    })),
    {
      headers: {
        "x-total-count": String(total),
      },
    },
  );
}
