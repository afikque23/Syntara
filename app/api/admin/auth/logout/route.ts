import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { clearAdminSessionCookie } from "@/lib/admin/serverAuth";
import { guardRequest } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

const COOKIE_NAME = "syntara_admin_session";

export async function POST(req: Request) {
  const ctx = guardRequest(req, {
    rateLimit: { keyPrefix: "admin:logout", limit: 60, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  const token = (await cookies()).get(COOKIE_NAME)?.value;

  let actorUserId: string | null = null;
  if (token) {
    const session = await prisma.adminSession.findUnique({ where: { token } }).catch(() => null);
    actorUserId = session?.userId ?? null;
    await prisma.adminSession.delete({ where: { token } }).catch(() => {});
  }

  await clearAdminSessionCookie();

  if (actorUserId) {
    await writeAdminAuditLog({
      actorUserId,
      action: "auth.logout",
      entity: "auth",
      entityId: null,
      ctx,
    });
  }

  return NextResponse.json({ ok: true });
}
