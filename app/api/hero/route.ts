import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const heroRow = await prisma.siteHero.findUnique({ where: { id: "singleton" } });
    const testimonialCount = await prisma.adminTestimonial.count();

    const baseData = heroRow || {
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
    };

    return NextResponse.json({
      ...baseData,
      stat2Value: `${testimonialCount > 0 ? testimonialCount : 300}+`
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data hero" }, { status: 500 });
  }
}
