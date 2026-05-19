import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseTakeSkip, requireAdmin } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

function isSchemaOutOfDateError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return message.includes("does not exist in the current database") || message.includes("The column") || message.includes("The table");
}

function toDateOnly(dateStr: string): Date {
  // Expecting YYYY-MM-DD
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) throw new Error("Invalid date");
  return d;
}

export async function GET(req: Request) {
  const ctx = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:read", limit: 300, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  const { take, skip } = parseTakeSkip(ctx.url);

  const total = await prisma.adminBlog.count();

  let rows:
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
      }[]
    | {
        id: string;
        title: string;
        excerpt: string;
        category: string;
        date: Date;
        readTime: string;
        published: boolean;
      }[] = [];

  try {
    rows = await prisma.adminBlog.findMany({
      orderBy: { date: "desc" },
      ...(take !== undefined ? { take } : {}),
      ...(skip !== undefined ? { skip } : {}),
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
    rows = await prisma.adminBlog.findMany({
      orderBy: { date: "desc" },
      ...(take !== undefined ? { take } : {}),
      ...(skip !== undefined ? { skip } : {}),
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

  return NextResponse.json(
    rows.map((b) => ({
      id: b.id,
      title: b.title,
      excerpt: b.excerpt,
      content: "content" in b ? b.content : null,
      category: b.category,
      date: b.date.toISOString().slice(0, 10),
      readTime: b.readTime,
      published: b.published,
      featured: "featured" in b ? b.featured : false,
      image: "image" in b ? b.image : null,
      author: "author" in b ? b.author : null,
      authorRole: "authorRole" in b ? b.authorRole : null,
      color: "color" in b ? b.color : null,
    })),
    {
      headers: {
        "x-total-count": String(total),
      },
    },
  );
}

export async function POST(req: Request) {
  const ctx = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:write", limit: 120, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, excerpt, category, date, readTime, published, content, featured, image, author, authorRole, color } = (body ?? {}) as Record<string, unknown>;
  if (typeof title !== "string" || !title.trim()) return NextResponse.json({ error: "title is required" }, { status: 400 });
  if (typeof excerpt !== "string") return NextResponse.json({ error: "excerpt is required" }, { status: 400 });
  if (typeof category !== "string") return NextResponse.json({ error: "category is required" }, { status: 400 });
  if (typeof date !== "string") return NextResponse.json({ error: "date is required" }, { status: 400 });
  if (typeof readTime !== "string") return NextResponse.json({ error: "readTime is required" }, { status: 400 });

  let parsed: Date;
  try {
    parsed = toDateOnly(date);
  } catch {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  let row;
  try {
    row = await prisma.adminBlog.create({
      data: {
        title: title.trim(),
        excerpt,
        content: typeof content === "string" ? content : null,
        category,
        date: parsed,
        readTime,
        published: typeof published === "boolean" ? published : true,
        featured: typeof featured === "boolean" ? featured : false,
        image: typeof image === "string" ? image : null,
        author: typeof author === "string" ? author : null,
        authorRole: typeof authorRole === "string" ? authorRole : null,
        color: typeof color === "string" ? color : null,
      },
    });
  } catch (err) {
    if (!isSchemaOutOfDateError(err)) throw err;
    return NextResponse.json({ error: "DB_SCHEMA_OUT_OF_DATE", message: "Database belum mengikuti schema terbaru. Jalankan prisma migrate untuk menambah kolom blog (content/featured/image/author)." }, { status: 409 });
  }

  await writeAdminAuditLog({
    actorUserId: ctx.me.id,
    action: "blog.create",
    entity: "blog",
    entityId: row.id,
    meta: { title: row.title, published: row.published },
    ctx,
  });

  return NextResponse.json({
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    date: row.date.toISOString().slice(0, 10),
    readTime: row.readTime,
    published: row.published,
    featured: row.featured,
    image: row.image,
    author: row.author,
    authorRole: row.authorRole,
    color: row.color,
  });
}
