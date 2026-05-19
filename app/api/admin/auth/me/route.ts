import { NextResponse } from "next/server";
import { getAdminIdentity } from "@/lib/admin/serverAuth";
import { guardRequest } from "@/lib/api/guards";

export async function GET(req: Request) {
  const ctx = guardRequest(req, {
    rateLimit: { keyPrefix: "admin:me", limit: 300, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  const me = await getAdminIdentity();
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, email: me.email });
}
