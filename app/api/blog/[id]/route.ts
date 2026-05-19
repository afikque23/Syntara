import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function isSchemaOutOfDateError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return message.includes("does not exist in the current database") || message.includes("The column") || message.includes("The table");
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  let row:
    | {
        id: string;
        title: string;
        excerpt: string;
        content: string | null;
        category: string;
        date: Date;
        readTime: string;
        published: boolean;
        featured: boolean;
        image: string | null;
        author: string | null;
        authorRole: string | null;
        color: string | null;
      }
    | {
        id: string;
        title: string;
        excerpt: string;
        category: string;
        date: Date;
        readTime: string;
        published: boolean;
      }
    | null = null;

  try {
    row = await prisma.adminBlog.findFirst({
      where: { id, published: true },
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        category: true,
        date: true,
        readTime: true,
        published: true,
        featured: true,
        image: true,
        author: true,
        authorRole: true,
        color: true,
      },
    });
  } catch (err) {
    if (!isSchemaOutOfDateError(err)) throw err;
    row = await prisma.adminBlog.findFirst({
      where: { id, published: true },
      select: {
        id: true,
        title: true,
        excerpt: true,
        category: true,
        date: true,
        readTime: true,
        published: true,
      },
    });
  }

  if (!row) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: "content" in row ? (row.content ?? "") : "",
    category: row.category,
    date: row.date.toISOString(),
    readTime: row.readTime,
    published: row.published,
    featured: "featured" in row ? row.featured : false,
    image: "image" in row ? (row.image ?? "") : "",
    author: "author" in row ? (row.author ?? "") : "",
    authorRole: "authorRole" in row ? (row.authorRole ?? "") : "",
    color: "color" in row ? (row.color ?? "from-[#3D35A8] to-[#00BCEF]") : "from-[#3D35A8] to-[#00BCEF]",
  });
}
