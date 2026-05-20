import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

function isHeroBody(body: any): body is Record<string, unknown> {
  return typeof body === "object" && body !== null;
}

export async function GET(req: Request) {
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;

  try {
    const row = await prisma.siteHero.findUnique({ where: { id: "singleton" } });
    if (!row) {
      return NextResponse.json({
        badge: "Platform Publikasi Jurnal #1 Indonesia",
        heading: "Permudah",
        headingHighlight: "Publikasi",
        headingSuffix: "Jurnal Anda",
        description: "Syntara hadir sebagai mitra terpercaya dalam perjalanan publikasi jurnal ilmiah Anda. Dari editing hingga pendampingan submit — kami siap membantu dengan profesional.",
        ctaText: "Konsultasi Sekarang",
        ctaLink: "/api/wa?text=Halo%2C+saya+ingin+konsultasi",
        secondaryCtaText: "Lihat Layanan",
        secondaryCtaLink: "/layanan",
        image: "",
        stat1Value: "500+",
        stat1Label: "Jurnal Dipublikasikan",
        stat2Label: "Klien Puas",
        stat3Value: "98%",
        stat3Label: "Tingkat Keberhasilan",
        stat4Value: "24/7",
        stat4Label: "Dukungan Tim",
        featuresBadge: "Mengapa Syntara?",
        featuresTitle: "Solusi Terbaik untuk Publikasi Jurnal Anda",
        featuresSubtitle: "Kami menggabungkan keahlian akademik dengan teknologi modern untuk hasil publikasi yang maksimal",
        featuresItems: JSON.parse('[{"icon":"Zap","title":"Proses Cepat","desc":"Penyelesaian dalam 3-7 hari kerja dengan kualitas terjamin"},{"icon":"Shield","title":"Harga Terjangkau","desc":"Paket mulai dari harga yang ramah di kantong mahasiswa"},{"icon":"Users","title":"Pendampingan Intensif","desc":"Tim ahli siap membantu dari awal hingga jurnal diterima"},{"icon":"TrendingUp","title":"Tingkat Keberhasilan Tinggi","desc":"Lebih dari 500+ jurnal berhasil dipublikasikan"}]')
      });
    }
    return NextResponse.json(row);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil pengaturan hero" }, { status: 500 });
  }
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

  if (!isHeroBody(body)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const {
    badge, heading, headingHighlight, headingSuffix, description,
    image,
    stat1Value, stat1Label, stat2Label, stat3Value, stat3Label, stat4Value, stat4Label,
    featuresBadge, featuresTitle, featuresSubtitle, featuresItems
  } = body;

  const data = {
    badge: typeof badge === "string" ? badge : undefined,
    heading: typeof heading === "string" ? heading : undefined,
    headingHighlight: typeof headingHighlight === "string" ? headingHighlight : undefined,
    headingSuffix: typeof headingSuffix === "string" ? headingSuffix : undefined,
    description: typeof description === "string" ? description : undefined,
    image: typeof image === "string" ? image : undefined,
    stat1Value: typeof stat1Value === "string" ? stat1Value : undefined,
    stat1Label: typeof stat1Label === "string" ? stat1Label : undefined,
    stat2Label: typeof stat2Label === "string" ? stat2Label : undefined,
    stat3Value: typeof stat3Value === "string" ? stat3Value : undefined,
    stat3Label: typeof stat3Label === "string" ? stat3Label : undefined,
    stat4Value: typeof stat4Value === "string" ? stat4Value : undefined,
    stat4Label: typeof stat4Label === "string" ? stat4Label : undefined,
    featuresBadge: typeof featuresBadge === "string" ? featuresBadge : undefined,
    featuresTitle: typeof featuresTitle === "string" ? featuresTitle : undefined,
    featuresSubtitle: typeof featuresSubtitle === "string" ? featuresSubtitle : undefined,
    featuresItems: Array.isArray(featuresItems) ? featuresItems : undefined,
  };

  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));

  const row = await prisma.siteHero.upsert({
    where: { id: "singleton" },
    update: cleanData,
    create: {
      id: "singleton",
      badge: data.badge ?? "Platform Publikasi Jurnal #1 Indonesia",
      heading: data.heading ?? "Permudah",
      headingHighlight: data.headingHighlight ?? "Publikasi",
      headingSuffix: data.headingSuffix ?? "Jurnal Anda",
      description: data.description ?? "Syntara hadir sebagai mitra terpercaya dalam perjalanan publikasi jurnal ilmiah Anda. Dari editing hingga pendampingan submit — kami siap membantu dengan profesional.",
      ctaText: "Konsultasi Sekarang",
      ctaLink: "/api/wa?text=Halo%2C+saya+ingin+konsultasi",
      secondaryCtaText: "Lihat Layanan",
      secondaryCtaLink: "/layanan",
      image: data.image ?? "",
      stat1Value: data.stat1Value ?? "500+",
      stat1Label: data.stat1Label ?? "Jurnal Dipublikasikan",
      stat2Label: data.stat2Label ?? "Klien Puas",
      stat3Value: data.stat3Value ?? "98%",
      stat3Label: data.stat3Label ?? "Tingkat Keberhasilan",
      stat4Value: data.stat4Value ?? "24/7",
      stat4Label: data.stat4Label ?? "Dukungan Tim",
      featuresBadge: data.featuresBadge ?? "Mengapa Syntara?",
      featuresTitle: data.featuresTitle ?? "Solusi Terbaik untuk Publikasi Jurnal Anda",
      featuresSubtitle: data.featuresSubtitle ?? "Kami menggabungkan keahlian akademik dengan teknologi modern untuk hasil publikasi yang maksimal",
      featuresItems: data.featuresItems ?? JSON.parse('[{"icon":"Zap","title":"Proses Cepat","desc":"Penyelesaian dalam 3-7 hari kerja dengan kualitas terjamin"},{"icon":"Shield","title":"Harga Terjangkau","desc":"Paket mulai dari harga yang ramah di kantong mahasiswa"},{"icon":"Users","title":"Pendampingan Intensif","desc":"Tim ahli siap membantu dari awal hingga jurnal diterima"},{"icon":"TrendingUp","title":"Tingkat Keberhasilan Tinggi","desc":"Lebih dari 500+ jurnal berhasil dipublikasikan"}]'),
    },
  });

  await writeAdminAuditLog({
    actorUserId: ctx.me.id,
    action: "hero.update",
    entity: "hero",
    entityId: "singleton",
    ctx,
  });

  return NextResponse.json(row);
}
