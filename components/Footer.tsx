import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { prisma } from "@/lib/db";

export async function Footer() {
  let waNumberText = "+62 812-3456-789";
  let instagramText = "@syntara.id";
  let emailText = "info@syntara.id";
  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    if (row) {
      if (row.whatsapp) waNumberText = row.whatsapp;
      if (row.instagram) instagramText = row.instagram;
      if (row.email) emailText = row.email;
    }
  } catch (e) {}

  return (
    <footer className="bg-[#1C2237] text-white">
      <div className="bg-gradient-to-r from-[#3D35A8] via-[#5B50C8] to-[#00BCEF] py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Siap Publikasikan Jurnal Anda?</h2>
          <p className="text-white/80 mb-8 text-lg">Konsultasikan kebutuhan publikasi jurnal Anda bersama tim ahli kami sekarang — gratis!</p>
          <a
            href="/api/wa?text=Halo%2C+saya+ingin+konsultasi+terkait+publikasi+jurnal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#3D35A8] rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-white/20 transition-all duration-300 hover:-translate-y-1"
          >
            Chat via WhatsApp
            <ArrowRight size={20} />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Logo size={36} darkMode={true} />
            <p className="mt-4 text-white/60 text-sm leading-relaxed">Syntara adalah platform profesional yang membantu peneliti dan akademisi mempublikasikan jurnal mereka dengan mudah, cepat, dan terpercaya.</p>
            <div className="flex items-center gap-3 mt-6">
              <a href="https://instagram.com/syntara.id" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#00BCEF]/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] text-white/70" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="mailto:info@syntara.id" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#00BCEF]/20 transition-colors">
                <Mail size={18} className="text-white/70" />
              </a>
              <a href="/api/wa" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#00BCEF]/20 transition-colors">
                <Phone size={18} className="text-white/70" />
              </a>
            </div>

            <a
              href="/admin"
              className="mt-4 inline-flex items-center gap-1.5 text-white/30 text-xs hover:text-[#00BCEF] transition-colors group border border-white/10 hover:border-[#00BCEF]/40 px-2.5 py-1 rounded-lg"
              title="Masuk ke Admin Panel"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Admin
            </a>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5">Layanan</h4>
            <ul className="space-y-3">
              {["Editing & Proofreading", "Formatting Jurnal", "Translasi Akademik", "Konsultasi Jurnal", "Pendampingan Submit"].map((item) => (
                <li key={item}>
                  <Link href="/layanan" className="text-white/60 text-sm hover:text-[#00BCEF] transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#00BCEF] inline-block" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5">Tautan Cepat</h4>
            <ul className="space-y-3">
              {[
                { label: "Beranda", href: "/" },
                { label: "Harga & Paket", href: "/harga" },
                { label: "Testimoni", href: "/testimoni" },
                { label: "Blog & Edukasi", href: "/blog" },
                { label: "Tentang Kami", href: "/tentang" },
                { label: "Kontak", href: "/kontak" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/60 text-sm hover:text-[#00BCEF] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-[#00BCEF] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white/60 text-sm">WhatsApp</p>
                  <a href="/api/wa" target="_blank" rel="noopener noreferrer" className="text-white text-sm hover:text-[#00BCEF] transition-colors">
                    {waNumberText}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-[#00BCEF] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white/60 text-sm">Email</p>
                  <a href={`mailto:${emailText}`} className="text-white text-sm hover:text-[#00BCEF] transition-colors">
                    {emailText}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#00BCEF] mt-1 flex-shrink-0" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <div>
                  <p className="text-white/60 text-sm">Instagram</p>
                  <a href={`https://instagram.com/${instagramText.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-white text-sm hover:text-[#00BCEF] transition-colors">
                    {instagramText}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#00BCEF] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white/60 text-sm">Lokasi</p>
                  <p className="text-white text-sm">Indonesia</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center gap-4">
          <p className="text-white/40 text-sm md:flex-1">© {new Date().getFullYear()} Syntara. All rights reserved.</p>
          <p className="text-white/40 text-sm text-center md:flex-1">Dibuat dengan ❤️ untuk memajukan publikasi ilmiah Indonesia</p>
          <div className="md:flex-1" />
        </div>
      </div>
    </footer>
  );
}
