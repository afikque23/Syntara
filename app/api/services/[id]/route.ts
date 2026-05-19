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

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const row = await prisma.adminService.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(
    {
      ...row,
      features: normalizeFeatures(row.features),
      previewFeatures: normalizeFeatures((row as unknown as { previewFeatures?: unknown }).previewFeatures),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
