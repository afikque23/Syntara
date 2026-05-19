import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

function isSchemaOutOfDateError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return message.includes("does not exist in the current database") || message.includes("The column") || message.includes("The table");
}

function toDateOnly(dateStr: string): Date {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) throw new Error("Invalid date");
  return d;
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:write", limit: 120, windowMs: 60_000 },
  });
  if (guard instanceof Response) return guard;

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch = (body ?? {}) as Record<string, unknown>;
  const data: Record<string, unknown> = {};

  const requiredNonEmpty = new Set(["title", "excerpt", "category", "readTime", "author"]);
  const optionalNullable = new Set(["image", "authorRole", "color"]);

  for (const key of ["title", "excerpt", "category", "readTime", "author", "image", "authorRole", "color"]) {
    const raw = patch[key];
    if (typeof raw !== "string") continue;

    const value = raw.trim();
    if (requiredNonEmpty.has(key)) {
      if (!value) return NextResponse.json({ error: `${key} cannot be empty` }, { status: 400 });
      data[key] = value;
      continue;
    }

    if (optionalNullable.has(key)) {
      data[key] = value ? value : null;
      continue;
    }

    // default: ignore unknown string keys
  }
  if (patch.content === null) data.content = null;
  if (typeof patch.content === "string") data.content = patch.content;
  if (typeof patch.published === "boolean") data.published = patch.published;
  if (typeof patch.featured === "boolean") data.featured = patch.featured;
  if (typeof patch.date === "string") {
    try {
      data.date = toDateOnly(patch.date);
    } catch {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
  }

  let row;
  try {
    row = await prisma.adminBlog.update({ where: { id }, data });
  } catch (err) {
    if (!isSchemaOutOfDateError(err)) throw err;
    return NextResponse.json({ error: "DB_SCHEMA_OUT_OF_DATE", message: "Database belum mengikuti schema terbaru. Jalankan prisma migrate untuk menambah kolom blog (content/featured/image/author)." }, { status: 409 });
  }

  await writeAdminAuditLog({
    actorUserId: guard.me.id,
    action: "blog.update",
    entity: "blog",
    entityId: row.id,
    meta: { published: row.published },
    ctx: guard,
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

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(_req, {
    rateLimit: { keyPrefix: "admin:write", limit: 120, windowMs: 60_000 },
  });
  if (guard instanceof Response) return guard;

  const { id } = await ctx.params;
  await prisma.adminBlog.delete({ where: { id } });

  await writeAdminAuditLog({
    actorUserId: guard.me.id,
    action: "blog.delete",
    entity: "blog",
    entityId: id,
    ctx: guard,
  });
  return NextResponse.json({ ok: true });
}
