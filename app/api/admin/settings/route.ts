import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

type SettingsBody = {
  brand: string;
  whatsapp: string;
  email: string;
  instagram: string;
  tagline: string;
  hoursWeekday?: string;
  hoursWeekend?: string;
  hoursHoliday?: string;
  hoursNote?: string;
  location?: string;
  reach?: string;
};

function isSettingsBody(value: unknown): value is SettingsBody {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.brand === "string" && typeof v.whatsapp === "string" && typeof v.email === "string" && typeof v.instagram === "string" && typeof v.tagline === "string";
}

export async function GET(req: Request) {
  const ctx = await requireAdmin(req, {
    rateLimit: { keyPrefix: "admin:read", limit: 300, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  const row = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!row) {
    return NextResponse.json(
      {
        brand: "Syntara",
        whatsapp: "",
        email: "",
        instagram: "",
        tagline: "",
        hoursWeekday: "08.00 - 17.00 WIB",
        hoursWeekend: "09.00 - 15.00 WIB",
        hoursHoliday: "Tutup (WA 24/7)",
        hoursNote: "WhatsApp tersedia 24/7. Pesan di luar jam kerja akan direspons pada hari kerja berikutnya.",
        location: "Indonesia (Remote Service)",
        reach: "Seluruh Indonesia & Internasional",
      },
      { status: 200 },
    );
  }

  return NextResponse.json({
    brand: row.brand,
    whatsapp: row.whatsapp,
    email: row.email,
    instagram: row.instagram,
    tagline: row.tagline,
    hoursWeekday: row.hoursWeekday,
    hoursWeekend: row.hoursWeekend,
    hoursHoliday: row.hoursHoliday,
    hoursNote: row.hoursNote,
    location: row.location,
    reach: row.reach,
  });
}

export async function PUT(req: Request) {
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

  if (!isSettingsBody(body)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { brand, whatsapp, email, instagram, tagline, hoursWeekday, hoursWeekend, hoursHoliday, hoursNote, location, reach } = body;

  const row = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      brand,
      whatsapp,
      email,
      instagram,
      tagline,
      ...(hoursWeekday !== undefined && { hoursWeekday }),
      ...(hoursWeekend !== undefined && { hoursWeekend }),
      ...(hoursHoliday !== undefined && { hoursHoliday }),
      ...(hoursNote !== undefined && { hoursNote }),
      ...(location !== undefined && { location }),
      ...(reach !== undefined && { reach }),
    },
    create: {
      id: "singleton",
      brand,
      whatsapp,
      email,
      instagram,
      tagline,
      hoursWeekday: hoursWeekday ?? "08.00 - 17.00 WIB",
      hoursWeekend: hoursWeekend ?? "09.00 - 15.00 WIB",
      hoursHoliday: hoursHoliday ?? "Tutup (WA 24/7)",
      hoursNote: hoursNote ?? "WhatsApp tersedia 24/7. Pesan di luar jam kerja akan direspons pada hari kerja berikutnya.",
      location: location ?? "Indonesia (Remote Service)",
      reach: reach ?? "Seluruh Indonesia & Internasional",
    },
  });

  await writeAdminAuditLog({
    actorUserId: ctx.me.id,
    action: "settings.update",
    entity: "settings",
    entityId: "singleton",
    ctx,
  });

  return NextResponse.json({
    brand: row.brand,
    whatsapp: row.whatsapp,
    email: row.email,
    instagram: row.instagram,
    tagline: row.tagline,
    hoursWeekday: row.hoursWeekday,
    hoursWeekend: row.hoursWeekend,
    hoursHoliday: row.hoursHoliday,
    hoursNote: row.hoursNote,
    location: row.location,
    reach: row.reach,
  });
}
