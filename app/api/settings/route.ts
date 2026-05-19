import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    if (!row) {
      return NextResponse.json(
        {
          brand: "Syntara",
          whatsapp: "628123456789",
          email: "info@syntara.id",
          instagram: "@syntara.id",
          tagline: "Platform Publikasi Jurnal #1 Indonesia",
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
    
    // Clean up whatsapp number to format 62...
    let cleanWa = row.whatsapp.replace(/\D/g, "");
    if (cleanWa.startsWith("0")) {
        cleanWa = "62" + cleanWa.slice(1);
    }

    return NextResponse.json({
      brand: row.brand,
      whatsapp: cleanWa,
      whatsappOriginal: row.whatsapp,
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
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil pengaturan" }, { status: 500 });
  }
}
