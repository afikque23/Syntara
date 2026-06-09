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

export async function GET(req: Request) {
  const url = new URL(req.url);
  const take = parseLimit(url);

  const rows = await prisma.adminPublicationLane.findMany({
    where: { isActive: true },
    orderBy: { priceAmount: "asc" },
    ...(take !== undefined ? { take } : {}),
  });

  return NextResponse.json(rows);
}
