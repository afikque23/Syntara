import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaMariaDb(getMariaDbConfigFromEnv()),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function isFreshEnough(client: PrismaClient): boolean {
  const c = client as unknown as Record<string, unknown>;
  const requiredDelegates = ["adminAuditLog", "adminTestimonialImage", "adminRequest"];
  if (requiredDelegates.some((k) => !(k in c))) return false;

  try {
    const p = client as unknown as {
      _runtimeDataModel?: { models?: Array<{ name: string; fields: Array<{ name: string }> }> };
    };
    const models = p?._runtimeDataModel?.models;
    const adminRequest = models?.find((m) => m.name === "AdminRequest");
    if (!adminRequest) return true;
    return adminRequest.fields.some((f) => f.name === "source");
  } catch {
    return true;
  }
}

function getPrisma(): PrismaClient {
  if (process.env.NODE_ENV === "production") {
    return globalForPrisma.prisma ?? (globalForPrisma.prisma = createPrismaClient());
  }

  const existing = globalForPrisma.prisma;
  if (existing && isFreshEnough(existing)) return existing;

  if (existing) {
    existing.$disconnect().catch(() => {});
    globalForPrisma.prisma = undefined;
  }

  globalForPrisma.prisma = createPrismaClient();
  return globalForPrisma.prisma;
}

export const prisma: PrismaClient =
  process.env.NODE_ENV === "production"
    ? getPrisma()
    : (new Proxy({} as PrismaClient, {
        get(_target, prop) {
          const client = getPrisma() as unknown as Record<string | symbol, unknown>;
          const value = client[prop as keyof typeof client];
          if (typeof value === "function") return (value as (...args: unknown[]) => unknown).bind(client);
          return value;
        },
      }) as PrismaClient);

function getMariaDbConfigFromEnv(): {
  host: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
} {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to initialize Prisma.");
  }

  const url = new URL(databaseUrl);
  const database = url.pathname.replace(/^\//, "") || undefined;
  const port = url.port ? Number(url.port) : undefined;

  return {
    host: url.hostname,
    port: Number.isFinite(port) ? port : undefined,
    user: url.username ? decodeURIComponent(url.username) : undefined,
    password: url.password ? decodeURIComponent(url.password) : undefined,
    database,
  };
}
