import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseTakeSkip, requireAdmin } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

const DEFAULT_SERVICE_COLOR = "from-[#3D35A8] to-[#00BCEF]";

function normalizeFeatures(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function GET(req: Request) {
  const ctx = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:read", limit: 300, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  const { take, skip } = parseTakeSkip(ctx.url);
  const [total, rows] = await Promise.all([
    prisma.adminService.count(),
    prisma.adminService.findMany({
      orderBy: { createdAt: "asc" },
      ...(take !== undefined ? { take } : {}),
      ...(skip !== undefined ? { skip } : {}),
    }),
  ]);

  const normalized = rows.map((row: any) => ({
    ...row,
    features: normalizeFeatures(row.features),
    previewFeatures: normalizeFeatures((row as unknown as { previewFeatures?: unknown }).previewFeatures),
  }));

  return NextResponse.json(normalized, {
    headers: {
      "x-total-count": String(total),
    },
  });
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

  const { name, description, tagline, highlight, icon, estimasi, color, features, previewFeatures } = (body ?? {}) as Record<string, unknown>;
  if (typeof name !== "string" || !name.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });
  if (typeof description !== "string") return NextResponse.json({ error: "description is required" }, { status: 400 });
  if (typeof icon !== "string") return NextResponse.json({ error: "icon is required" }, { status: 400 });
  if (typeof estimasi !== "string") return NextResponse.json({ error: "estimasi is required" }, { status: 400 });

  if (tagline !== undefined && typeof tagline !== "string") return NextResponse.json({ error: "tagline must be a string" }, { status: 400 });
  if (highlight !== undefined && typeof highlight !== "string") return NextResponse.json({ error: "highlight must be a string" }, { status: 400 });

  if (features !== undefined && !Array.isArray(features)) {
    return NextResponse.json({ error: "features must be an array" }, { status: 400 });
  }

  if (previewFeatures !== undefined && !Array.isArray(previewFeatures)) {
    return NextResponse.json({ error: "previewFeatures must be an array" }, { status: 400 });
  }

  const finalColor = typeof color === "string" && color.trim() ? color.trim() : DEFAULT_SERVICE_COLOR;
  const finalFeatures = normalizeFeatures(features);
  const finalPreviewFeatures = normalizeFeatures(previewFeatures);
  const finalTagline = typeof tagline === "string" ? tagline.trim() : null;
  const finalHighlight = typeof highlight === "string" ? (highlight.trim() ? highlight.trim() : null) : null;

  const row = await prisma.adminService.create({
    data: {
      name: name.trim(),
      description,
      tagline: finalTagline,
      highlight: finalHighlight,
      icon,
      estimasi,
      color: finalColor,
      features: finalFeatures,
      previewFeatures: finalPreviewFeatures,
    },
  });

  await writeAdminAuditLog({
    actorUserId: ctx.me.id,
    action: "service.create",
    entity: "service",
    entityId: row.id,
    meta: { name: row.name },
    ctx,
  });

  return NextResponse.json(row);
}
