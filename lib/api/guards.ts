import { NextResponse } from "next/server";
import { getAdminIdentity, type AdminIdentity } from "@/lib/admin/serverAuth";

export type RateLimitOptions = {
  keyPrefix: string;
  limit: number;
  windowMs: number;
};

export type GuardOptions = {
  requireSameOrigin?: boolean;
  rateLimit?: RateLimitOptions;
};

export type GuardContext = {
  url: URL;
  ip: string;
  userAgent: string;
};

type Bucket = { count: number; resetAt: number };

const globalForRateLimit = globalThis as unknown as {
  __syntaraRateLimitBuckets?: Map<string, Bucket>;
};

const buckets = globalForRateLimit.__syntaraRateLimitBuckets ?? new Map<string, Bucket>();
if (!globalForRateLimit.__syntaraRateLimitBuckets) globalForRateLimit.__syntaraRateLimitBuckets = buckets;

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  return "unknown";
}

export function getUserAgent(req: Request): string {
  return (req.headers.get("user-agent") ?? "").slice(0, 500);
}

function getExpectedOrigin(req: Request): string | null {
  try {
    return new URL(req.url).origin;
  } catch {
    return null;
  }
}

function getRequestOrigin(req: Request): string | null {
  const origin = req.headers.get("origin");
  if (origin) return origin;

  const referer = req.headers.get("referer");
  if (!referer) return null;

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

export function enforceSameOrigin(req: Request): Response | null {
  const method = (req.method || "GET").toUpperCase();
  if (SAFE_METHODS.has(method)) return null;

  const expected = getExpectedOrigin(req);
  const got = getRequestOrigin(req);

  if (!expected) return null;

  // If the browser didn't send Origin/Referer, be strict in prod.
  if (!got) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return null;
  }

  if (got !== expected) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}

export function rateLimit(req: Request, options: RateLimitOptions): Response | null {
  const now = Date.now();
  const url = new URL(req.url);
  const ip = getClientIp(req);
  const key = `${options.keyPrefix}:${url.pathname}:${ip}`;

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + options.windowMs };
    buckets.set(key, bucket);
  }

  bucket.count += 1;
  if (bucket.count <= options.limit) return null;

  const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  return NextResponse.json(
    { error: "Too many requests" },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
    },
  );
}

export function guardRequest(req: Request, options: GuardOptions = {}): GuardContext | Response {
  const url = new URL(req.url);
  const requireSameOrigin = options.requireSameOrigin !== false;

  if (requireSameOrigin) {
    const sameOriginFail = enforceSameOrigin(req);
    if (sameOriginFail) return sameOriginFail;
  }

  if (options.rateLimit) {
    const rlFail = rateLimit(req, options.rateLimit);
    if (rlFail) return rlFail;
  }

  return {
    url,
    ip: getClientIp(req),
    userAgent: getUserAgent(req),
  };
}

export async function requireAdmin(req: Request, options: GuardOptions = {}): Promise<(GuardContext & { me: AdminIdentity }) | Response> {
  const ctx = guardRequest(req, options);
  if (ctx instanceof Response) return ctx;

  const me = await getAdminIdentity();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return { ...ctx, me };
}

export function parseTakeSkip(url: URL): { take?: number; skip?: number } {
  const takeRaw = url.searchParams.get("take");
  const skipRaw = url.searchParams.get("skip");

  const take = takeRaw ? Number(takeRaw) : NaN;
  const skip = skipRaw ? Number(skipRaw) : NaN;

  const out: { take?: number; skip?: number } = {};
  if (Number.isFinite(take) && take > 0) out.take = Math.min(100, Math.floor(take));
  if (Number.isFinite(skip) && skip >= 0) out.skip = Math.floor(skip);

  return out;
}
