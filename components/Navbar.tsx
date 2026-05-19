"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/layanan", label: "Layanan" },
  { href: "/harga", label: "Produk" },
  { href: "/testimoni", label: "Testimoni" },
  { href: "/#faq", label: "FAQ", isAnchor: true },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleNavigation = () => setIsOpen(false);
    window.addEventListener("popstate", handleNavigation);
    window.addEventListener("hashchange", handleNavigation);
    return () => {
      window.removeEventListener("popstate", handleNavigation);
      window.removeEventListener("hashchange", handleNavigation);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/#faq") return false;
    return pathname === href;
  };

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    if (href === "/#faq") {
      e.preventDefault();
      if (pathname !== "/") {
        router.push(href);
      } else {
        const el = document.getElementById("faq");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
      setIsOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-[#E8E8EE]" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex-shrink-0">
            <Logo size={36} />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.isAnchor ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className={`relative px-3 py-2 text-sm transition-colors duration-200 rounded-lg ${scrolled ? "text-[#1C2237] hover:text-[#3D35A8] hover:bg-[#3D35A8]/5" : "text-white/85 hover:text-white hover:bg-white/10"}`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm transition-colors duration-200 rounded-lg ${
                    isActive(link.href) ? (scrolled ? "text-[#3D35A8] font-semibold" : "text-white font-semibold") : scrolled ? "text-[#1C2237] hover:text-[#3D35A8] hover:bg-[#3D35A8]/5" : "text-white/85 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && <motion.span layoutId="activeNav" className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${scrolled ? "bg-[#3D35A8]" : "bg-[#00BCEF]"}`} />}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="/api/wa?text=Halo%2C+saya+ingin+konsultasi+terkait+publikasi+jurnal"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#3D35A8]/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Konsultasi Gratis
            </a>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-[#1C2237] hover:bg-[#3D35A8]/10" : "text-white hover:bg-white/10"}`}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="lg:hidden bg-white border-t border-[#E8E8EE] overflow-hidden">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div key={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  {link.isAnchor ? (
                    <a href={link.href} onClick={(e) => handleAnchorClick(e, link.href)} className="block px-4 py-3 rounded-xl text-sm font-medium transition-colors text-[#1C2237] hover:bg-[#3D35A8]/5 hover:text-[#3D35A8]">
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive(link.href) ? "bg-[#3D35A8]/10 text-[#3D35A8]" : "text-[#1C2237] hover:bg-[#3D35A8]/5 hover:text-[#3D35A8]"}`}
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="pt-2">
                <a
                  href="/api/wa?text=Halo%2C+saya+ingin+konsultasi+terkait+publikasi+jurnal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-5 py-3 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white rounded-xl text-sm font-semibold"
                >
                  Konsultasi Gratis
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
