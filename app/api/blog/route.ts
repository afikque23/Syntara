import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function isSchemaOutOfDateError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return message.includes("does not exist in the current database") || message.includes("The column") || message.includes("The table");
}

function parseLimit(v: string | null): number {
  const n = v ? Number(v) : NaN;
  if (!Number.isFinite(n)) return 50;
  return Math.max(1, Math.min(200, Math.floor(n)));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = (searchParams.get("category") || "").trim();
  const limit = parseLimit(searchParams.get("limit"));

  let rows:
    | {
        id: string;
        title: string;
        excerpt: string;
        category: string;
        date: Date;
        readTime: string;
        featured: boolean;
        image: string | null;
        author: string | null;
        authorRole: string | null;
        color: string | null;
      }[]
    | {
        id: string;
        title: string;
        excerpt: string;
        category: string;
        date: Date;
        readTime: string;
      }[] = [];

  try {
    rows = await prisma.adminBlog.findMany({
      where: {
        published: true,
        ...(category ? { category } : {}),
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: limit,
      select: {
        id: true,
        title: true,
        excerpt: true,
        category: true,
        date: true,
        readTime: true,
        featured: true,
        image: true,
        author: true,
        authorRole: true,
        color: true,
      },
    });
  } catch (err) {
    if (!isSchemaOutOfDateError(err)) throw err;
    rows = await prisma.adminBlog.findMany({
      where: {
        published: true,
        ...(category ? { category } : {}),
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: limit,
      select: {
        id: true,
        title: true,
        excerpt: true,
        category: true,
        date: true,
        readTime: true,
      },
    });
  }

  return NextResponse.json(
    rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      excerpt: r.excerpt,
      category: r.category,
      date: r.date.toISOString(),
      readTime: r.readTime,
      featured: "featured" in r ? r.featured : false,
      image: "image" in r ? (r.image ?? "") : "",
      author: "author" in r ? (r.author ?? "") : "",
      authorRole: "authorRole" in r ? (r.authorRole ?? "") : "",
      color: "color" in r ? (r.color ?? "from-[#3D35A8] to-[#00BCEF]") : "from-[#3D35A8] to-[#00BCEF]",
    })),
  );
}
