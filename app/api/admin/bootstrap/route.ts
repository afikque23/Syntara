import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { adminSeed, ADMIN_EMAIL, ADMIN_PASSWORD } from "@/lib/admin/adminData";
import { getAdminIdentity } from "@/lib/admin/serverAuth";
import { guardRequest } from "@/lib/api/guards";
import { writeAdminAuditLog } from "@/lib/admin/audit";

export async function POST(req: Request) {
  const ctx = guardRequest(req, {
    rateLimit: { keyPrefix: "admin:bootstrap", limit: 5, windowMs: 60_000 },
  });
  if (ctx instanceof Response) return ctx;

  const me = await getAdminIdentity().catch(() => null);
  if (process.env.NODE_ENV === "production") {
    if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (me.role !== "owner") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const demoEmail = ADMIN_EMAIL.trim().toLowerCase();

  const existingDemo = await prisma.adminUser.findUnique({ where: { email: demoEmail } });
  if (!existingDemo) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await prisma.adminUser.create({
      data: {
        email: demoEmail,
        passwordHash,
        role: "owner",
      },
    });
  }

  // IMPORTANT: this endpoint is called automatically after login.
  // We only want to seed demo data on a fresh install — not re-create user-deleted content.
  const existingSettings = await prisma.siteSettings.findUnique({ where: { id: "singleton" }, select: { id: true } });
  const isFreshInstall = !existingSettings;

  if (isFreshInstall) {
    await prisma.siteSettings.create({
      data: { id: "singleton", ...adminSeed.settings },
    });

    if ((await prisma.adminService.count()) === 0) {
      await prisma.adminService.createMany({
        data: adminSeed.services.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          icon: s.icon,
          estimasi: s.estimasi,
          color: s.color,
        })),
        skipDuplicates: true,
      });
    }

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
    }


    if ((await prisma.adminTestimonial.count()) === 0) {
      await prisma.adminTestimonial.createMany({
        data: adminSeed.testimonials.map((t) => ({
          id: t.id,
          name: t.name,
          institution: t.institution,
          role: t.role,
          comment: t.comment,
          rating: t.rating,
          journal: t.journal,
        })),
        skipDuplicates: true,
      });
    }

    if ((await prisma.adminTestimonialImage.count()) === 0 && adminSeed.testimonialImages.length > 0) {
      await prisma.adminTestimonialImage.createMany({
        data: adminSeed.testimonialImages.map((t) => ({
          id: t.id,
          imageUrl: t.imageUrl,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        })),
        skipDuplicates: true,
      });
    }

    if ((await prisma.adminBlog.count()) === 0) {
      await prisma.adminBlog.createMany({
        data: adminSeed.blog.map((b) => ({
          id: b.id,
          title: b.title,
          excerpt: b.excerpt,
          category: b.category,
          date: new Date(b.date),
          readTime: b.readTime,
          published: b.published,
        })),
        skipDuplicates: true,
      });
    }

    if ((await prisma.adminFaq.count()) === 0 && adminSeed.faqs.length > 0) {
      await prisma.adminFaq.createMany({
        data: adminSeed.faqs.map((f) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
          category: f.category,
          sortOrder: f.sortOrder,
          published: f.published,
        })),
        skipDuplicates: true,
      });
    }

    if ((await prisma.adminRequest.count()) === 0) {
      await prisma.adminRequest.createMany({
        data: adminSeed.requests.map((r) => ({
          id: r.id,
          name: r.name,
          whatsapp: r.whatsapp,
          email: "",
          service: r.service,
          notes: r.notes,
          status: r.status,
          createdAt: new Date(r.createdAt),
        })),
        skipDuplicates: true,
      });
    }
  }

  if (me) {
    await writeAdminAuditLog({
      actorUserId: me.id,
      action: "admin.bootstrap",
      entity: "bootstrap",
      entityId: null,
      ctx,
    });
  }

  return NextResponse.json({ ok: true, seeded: isFreshInstall });
}
