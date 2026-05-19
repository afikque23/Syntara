import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import type { AdminRole } from "@prisma/client";

const COOKIE_NAME = "syntara_admin_session";

export type AdminIdentity = {
  id: string;
  email: string;
  role: AdminRole;
};

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.adminSession.delete({ where: { token } }).catch(() => {});
    return null;
  }

  return { id: session.user.id, email: session.user.email, role: session.user.role };
}

export async function clearAdminSessionCookie() {
  (await cookies()).set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function setAdminSessionCookie(token: string, maxAgeSeconds: number) {
  (await cookies()).set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}
