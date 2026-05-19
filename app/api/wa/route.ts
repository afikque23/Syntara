import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const text = url.searchParams.get("text") || "";
  
  let waNumber = "628123456789";
  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    if (row && row.whatsapp) {
      let cleanWa = row.whatsapp.replace(/\D/g, "");
      if (cleanWa.startsWith("0")) cleanWa = "62" + cleanWa.slice(1);
      if (cleanWa) {
          waNumber = cleanWa;
      }
    }
  } catch(e) {
      console.error(e);
  }
  
  const target = text 
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${waNumber}`;
    
  return NextResponse.redirect(target);
}
