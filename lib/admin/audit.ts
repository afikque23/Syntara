import { prisma } from "@/lib/db";
import type { GuardContext } from "@/lib/api/guards";

export type AdminAuditParams = {
  actorUserId: string;
  action: string;
  entity: string;
  entityId?: string | null;
  meta?: unknown;
  ctx: Pick<GuardContext, "ip" | "userAgent">;
};

export async function writeAdminAuditLog(params: AdminAuditParams): Promise<void> {
  const delegate = (prisma as unknown as { adminAuditLog?: { create: (args: unknown) => Promise<unknown> } }).adminAuditLog;
  if (!delegate?.create) return;

  await delegate
    .create({
      data: {
        actorUserId: params.actorUserId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? null,
        ip: params.ctx.ip,
        userAgent: params.ctx.userAgent,
        meta: params.meta === undefined ? undefined : (params.meta as never),
      },
    })
    .catch(() => {});
}
