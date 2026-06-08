import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function parseLimit(url: URL): number | undefined {
  const raw = url.searchParams.get("limit");
  if (!raw) return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n)) return undefined;
  const clamped = Math.max(1, Math.min(100, Math.floor(n)));
  return clamped;
}

function normalizeFeatures(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
}

function normalizeNotIncluded(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const take = parseLimit(url);

  const rows = await prisma.adminPricing.findMany({
    orderBy: { createdAt: "asc" },
    ...(take !== undefined ? { take } : {}),
  });

  return NextResponse.json(
    rows.map((p: any) => ({
      ...p,
      features: normalizeFeatures(p.features),
      notIncluded: normalizeNotIncluded(p.notIncluded),
    })),
  );
}
