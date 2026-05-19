import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const row = await prisma.adminFaq.findUnique({ where: { id } });
  if (!row || !row.published) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(row);
}
