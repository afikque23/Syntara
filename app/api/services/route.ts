import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function normalizeFeatures(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseLimit(url: URL): number | undefined {
  const raw = url.searchParams.get("limit");
  if (!raw) return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n)) return undefined;
  const clamped = Math.max(1, Math.min(100, Math.floor(n)));
  return clamped;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const take = parseLimit(url);

  const rows = await prisma.adminService.findMany({
    orderBy: { createdAt: "asc" },
    ...(take !== undefined ? { take } : {}),
  });

  const normalized = rows.map((row: any) => ({
    ...row,
    features: normalizeFeatures(row.features),
    previewFeatures: normalizeFeatures((row as unknown as { previewFeatures?: unknown }).previewFeatures),
  }));

  return NextResponse.json(normalized, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
