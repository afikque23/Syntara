import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function isValuesArray(v: unknown): v is Array<boolean | string> {
  return Array.isArray(v) && v.every((x) => typeof x === "boolean" || typeof x === "string");
}

function normalizeValues(v: unknown): Array<boolean | string> {
  if (!isValuesArray(v)) return [];
  return v.map((x) => (typeof x === "string" ? x.trim() : x)).map((x) => (typeof x === "string" && !x ? false : x));
}

export async function GET() {
  const rows = await prisma.adminPricingComparisonRow.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json(
    rows.map((r) => ({
      ...r,
      values: normalizeValues(r.values),
    })),
  );
}
