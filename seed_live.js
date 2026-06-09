const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seedPricing = [
  {
    id: "1",
    name: "Basic",
    price: "Rp 350.000",
    priceAmount: 350000,
    description: "Ideal untuk koreksi dasar & proofreading",
    features: ["Editing grammar & struktur", "Proofreading menyeluruh", "1x revisi gratis", "Feedback umum", "Estimasi 3–5 hari kerja"],
    notIncluded: ["Formatting template jurnal", "Translasi", "Konsultasi jurnal target"],
    badge: "",
    popular: false,
    isActive: true,
  },
  {
    id: "2",
    name: "Standard",
    price: "Rp 750.000",
    priceAmount: 750000,
    description: "Paket editing & formatting siap submit",
    features: ["Full editing & academic tone", "Formatting template jurnal", "Sitasi APA/IEEE/Vancouver", "Formatting tabel & gambar", "2x revisi gratis", "Konsultasi singkat", "Estimasi 5–7 hari kerja"],
    notIncluded: ["Translasi bahasa", "Pendampingan submit"],
    badge: "Paling Populer",
    popular: true,
    isActive: true,
  },
  {
    id: "3",
    name: "Premium",
    price: "Rp 1.500.000",
    priceAmount: 1500000,
    description: "Full service dari editing hingga jurnal diterima",
    features: [
      "Full editing & proofreading",
      "Academic tone & clarity",
      "Revisi unlimited",
      "Formatting lengkap",
      "Translasi jika diperlukan",
      "Konsultasi jurnal target",
      "Cover letter profesional",
      "Pendampingan submit",
      "Respon revisi reviewer",
    ],
    notIncluded: [],
    badge: "Terlengkap",
    popular: false,
    isActive: true,
  },
];

const seedLanes = [
  { id: "1", name: "Biasa", description: "Penyelesaian sesuai antrian normal", priceAmount: 0, priceText: "Rp 0", isActive: true },
  { id: "2", name: "Regular", description: "Prioritas standar", priceAmount: 350000, priceText: "Rp 350.000", isActive: true },
  { id: "3", name: "Fast Track", description: "Penyelesaian lebih cepat", priceAmount: 750000, priceText: "Rp 750.000", isActive: true }
];

async function main() {
  const existingPricing = await prisma.adminPricing.count();
  if (existingPricing === 0) {
    console.log('Seeding pricing...');
    await prisma.adminPricing.createMany({
      data: seedPricing,
      skipDuplicates: true
    });
    console.log('Pricing seeded.');
  } else {
    console.log('Pricing already exists: ' + existingPricing);
  }

  const existingLanes = await prisma.adminPublicationLane.count();
  if (existingLanes === 0) {
    console.log('Seeding lanes...');
    await prisma.adminPublicationLane.createMany({
      data: seedLanes,
      skipDuplicates: true
    });
    console.log('Lanes seeded.');
  } else {
    console.log('Lanes already exist: ' + existingLanes);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
