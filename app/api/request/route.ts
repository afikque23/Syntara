import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardRequest } from "@/lib/api/guards";

export async function POST(req: Request) {
  const ctx = guardRequest(req, {
    rateLimit: { keyPrefix: "public:request", limit: 5, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, whatsapp, email, service, notes } = (body ?? {}) as Record<string, unknown>;
  if (typeof name !== "string" || !name.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });
  if (typeof whatsapp !== "string" || !whatsapp.trim()) return NextResponse.json({ error: "whatsapp is required" }, { status: 400 });
  if (typeof email !== "string" || !email.trim()) return NextResponse.json({ error: "email is required" }, { status: 400 });
  if (typeof service !== "string" || !service.trim()) return NextResponse.json({ error: "service is required" }, { status: 400 });

  const row = await prisma.adminRequest.create({
    data: {
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      service: service.trim(),
      notes: typeof notes === "string" ? notes : "",
      status: "new",
      source: "public",
    },
  });

  return NextResponse.json({ ok: true, id: row.id });
}
