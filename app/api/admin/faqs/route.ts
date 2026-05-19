import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseTakeSkip, requireAdmin } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

export async function GET(req: Request) {
  const ctx = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:read", limit: 300, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  const { take, skip } = parseTakeSkip(ctx.url);
  const [total, rows] = await Promise.all([
    prisma.adminFaq.count(),
    prisma.adminFaq.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      ...(take !== undefined ? { take } : {}),
      ...(skip !== undefined ? { skip } : {}),
    }),
  ]);

  return NextResponse.json(rows, {
    headers: {
      "x-total-count": String(total),
    },
  });
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

  const { question, answer, category, sortOrder, published } = (body ?? {}) as Record<string, unknown>;
  if (typeof question !== "string" || !question.trim()) return NextResponse.json({ error: "question is required" }, { status: 400 });
  if (typeof answer !== "string" || !answer.trim()) return NextResponse.json({ error: "answer is required" }, { status: 400 });

  const row = await prisma.adminFaq.create({
    data: {
      question: question.trim(),
      answer: answer.trim(),
      category: typeof category === "string" && category.trim() ? category.trim() : "general",
      sortOrder: typeof sortOrder === "number" && Number.isFinite(sortOrder) ? Math.floor(sortOrder) : 0,
      published: typeof published === "boolean" ? published : true,
    },
  });

  await writeAdminAuditLog({
    actorUserId: ctx.me.id,
    action: "faq.create",
    entity: "faq",
    entityId: row.id,
    meta: { category: row.category },
    ctx,
  });

  return NextResponse.json(row);
}
