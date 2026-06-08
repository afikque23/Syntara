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
    prisma.adminRequest.count(),
    prisma.adminRequest.findMany({
      orderBy: { createdAt: "desc" },
      ...(take !== undefined ? { take } : {}),
      ...(skip !== undefined ? { skip } : {}),
    }),
  ]);

  return NextResponse.json(
    rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      whatsapp: r.whatsapp,
      email: r.email,
      service: r.service,
      notes: r.notes,
      adminNotes: r.adminNotes,
      status: r.status,
      source: r.source,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
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

  const { name, whatsapp, email, service, notes, status, adminNotes } = (body ?? {}) as {
    name?: unknown;
    whatsapp?: unknown;
    email?: unknown;
    service?: unknown;
    notes?: unknown;
    status?: unknown;
    adminNotes?: unknown;
  };

  if (typeof name !== "string" || !name.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });
  if (typeof whatsapp !== "string" || !whatsapp.trim()) return NextResponse.json({ error: "whatsapp is required" }, { status: 400 });
  if (typeof service !== "string" || !service.trim()) return NextResponse.json({ error: "service is required" }, { status: 400 });

  const row = await prisma.adminRequest.create({
    data: {
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      email: typeof email === "string" ? email.trim() : "",
      service: service.trim(),
      notes: typeof notes === "string" ? notes : "",
      adminNotes: typeof adminNotes === "string" ? adminNotes : null,
      status: status === "processing" || status === "done" || status === "new" ? status : "new",
      source: "admin",
    },
  });

  await writeAdminAuditLog({
    actorUserId: ctx.me.id,
    action: "request.create",
    entity: "request",
    entityId: row.id,
    meta: { name: row.name, service: row.service, status: row.status },
    ctx,
  });

  return NextResponse.json({
    id: row.id,
    name: row.name,
    whatsapp: row.whatsapp,
    email: row.email,
    service: row.service,
    notes: row.notes,
    adminNotes: row.adminNotes,
    status: row.status,
    source: row.source,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}
