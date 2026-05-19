import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function normalizeFeatures(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const row = await prisma.adminPricing.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...row,
    features: normalizeFeatures(row.features),
  });
}
