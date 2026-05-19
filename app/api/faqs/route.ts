import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function parseLimit(url: URL): number | undefined {
  const raw = url.searchParams.get("limit");
  if (!raw) return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n)) return undefined;
  return Math.max(1, Math.min(100, Math.floor(n)));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category")?.trim() || undefined;
  const take = parseLimit(url);

  const rows = await prisma.adminFaq.findMany({
    where: {
      published: true,
      ...(category ? { category } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    ...(take !== undefined ? { take } : {}),
  });

  return NextResponse.json(rows);
}
