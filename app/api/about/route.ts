import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const row = await prisma.siteAbout.findUnique({ where: { id: "singleton" } });
  if (!row || !row.published) return NextResponse.json(null);

  return NextResponse.json(row.data);
}
