import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "@/lib/admin/adminData";
import { setAdminSessionCookie } from "@/lib/admin/serverAuth";
import { guardRequest } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

export async function POST(req: Request) {
  const ctx = guardRequest(req, {
    rateLimit: { keyPrefix: "admin:login", limit: 10, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, password } = (body ?? {}) as { email?: unknown; password?: unknown };
  const emailStr = typeof email === "string" ? email.trim().toLowerCase() : "";
  const passwordStr = typeof password === "string" ? password : "";

  if (!emailStr || !passwordStr) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  // Ensure there is at least one admin user (demo credentials).
  const demoEmail = ADMIN_EMAIL.trim().toLowerCase();
  const existingDemo = await prisma.adminUser.findUnique({ where: { email: demoEmail } });
  if (!existingDemo) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await prisma.adminUser.create({
      data: {
        email: demoEmail,
        passwordHash,
        role: "owner",
      },
    });
  }

  const user = await prisma.adminUser.findUnique({ where: { email: emailStr } });
  if (!user) {
    return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
  }

  const ok = await bcrypt.compare(passwordStr, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
  }

  const token = crypto.randomUUID();
  const maxAgeSeconds = 60 * 60 * 24 * 30; // 30 days
  const expiresAt = new Date(Date.now() + maxAgeSeconds * 1000);

  await prisma.adminSession.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  await setAdminSessionCookie(token, maxAgeSeconds);

  await writeAdminAuditLog({
    actorUserId: user.id,
    action: "auth.login",
    entity: "auth",
    entityId: null,
    meta: { email: user.email },
    ctx,
  });

  return NextResponse.json({ ok: true, email: user.email });
}
