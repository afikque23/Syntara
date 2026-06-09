import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminSeed } from "@/lib/admin/adminData";

export async function GET() {
  let seededPricing = false;
  let seededLanes = false;

  if ((await prisma.adminPricing.count()) === 0) {
    await prisma.adminPricing.createMany({
      data: adminSeed.pricing.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        priceAmount: p.priceAmount ?? 0,
        description: p.description,
        features: p.features,
        notIncluded: p.notIncluded ?? [],
        badge: p.badge,
        popular: p.popular,
        isActive: p.isActive ?? true,
      })),
      skipDuplicates: true,
    });
    seededPricing = true;
  }

  if ((await prisma.adminPublicationLane.count()) === 0 && adminSeed.lanes?.length > 0) {
    await prisma.adminPublicationLane.createMany({
      data: adminSeed.lanes.map((l) => ({
        id: l.id,
        name: l.name,
        description: l.description,
        priceAmount: l.priceAmount,
        priceText: l.priceText,
        isActive: l.isActive,
      })),
      skipDuplicates: true,
    });
    seededLanes = true;
  }

  return NextResponse.json({ ok: true, seededPricing, seededLanes });
}
