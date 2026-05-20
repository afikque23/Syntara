"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, Inbox, Settings, BookOpen, Star, Package, Wrench, Users, LogOut, Menu, ExternalLink, Info, HelpCircle, LayoutTemplate } from "lucide-react";
import { auth, bootstrapAdminData, ds, subscribeAdminChanges } from "@/lib/admin/adminData";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: false },
  { path: "/admin/hero", label: "Manajemen Hero", icon: LayoutTemplate, badge: false },
  { path: "/admin/requests", label: "Request & Leads", icon: Inbox, badge: false },
  { path: "/admin/services", label: "Manajemen Layanan", icon: Wrench, badge: false },
  { path: "/admin/pricing", label: "Manajemen Pricing", icon: Package, badge: false },
  { path: "/admin/testimonials", label: "Testimoni", icon: Star, badge: false },
  { path: "/admin/blog", label: "Blog & Artikel", icon: BookOpen, badge: false },
  { path: "/admin/faqs", label: "Manajemen FAQ", icon: HelpCircle, badge: false },
  { path: "/admin/about", label: "Manajemen Tentang", icon: Info, badge: false },
  { path: "/admin/team", label: "Manajemen Tim", icon: Users, badge: false },
  { path: "/admin/settings", label: "Pengaturan", icon: Settings, badge: false },
];

function SidebarContent({ onNav }: { onNav: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.logout();
    router.replace("/admin");
  };

  return (
    <div className="flex flex-col h-full bg-[#0F172A]">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] flex items-center justify-center">
            <span className="text-white font-black text-sm">S</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">Syntara CMS</p>
            <p className="text-white/30 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3">Menu Utama</p>
        {navItems.map((item) => {
          const active = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onNav}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                active ? "bg-gradient-to-r from-[#3D35A8] to-[#4B44C4] text-white shadow-lg shadow-[#3D35A8]/30" : "text-white/50 hover:text-white hover:bg-white/6"
              }`}
            >
              <item.icon size={17} className={active ? "text-white" : "text-white/40 group-hover:text-white/70"} />
              <span className="text-sm font-medium flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-2">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2.5 text-white/30 hover:text-white/60 text-sm rounded-xl hover:bg-white/5 transition-all">
          <ExternalLink size={15} />
          Lihat Website Publik
        </a>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] flex items-center justify-center text-white text-xs font-bold shrink-0">AD</div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium">Admin Syntara</p>
            <p className="text-white/30 text-xs truncate">admin@syntara.id</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm">
          <LogOut size={15} />
          Keluar
        </button>
      </div>
    </div>
  );
}

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  const isAuthed = useSyncExternalStore(
    subscribeAdminChanges,
    () => auth.isLoggedIn(),
    () => false,
  );

  useEffect(() => {
    auth.refresh().finally(() => setChecking(false));
  }, [router]);

  useEffect(() => {
    if (checking) return;
    if (!isAuthed) router.replace("/admin");
  }, [checking, isAuthed, router]);

  useEffect(() => {
    if (!isAuthed) return;
    void (async () => {
      await bootstrapAdminData();
      await ds.refreshAll();
    })();
  }, [isAuthed]);

  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener("popstate", close);
    window.addEventListener("hashchange", close);
    return () => {
      window.removeEventListener("popstate", close);
      window.removeEventListener("hashchange", close);
    };
  }, []);

  if (checking || !isAuthed) return null;

  const pageTitle = navItems.find((n) => n.path === pathname)?.label ?? "Admin";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-slate-200/60 shadow-xl">
        <SidebarContent onNav={() => {}} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }} transition={{ type: "spring", damping: 28, stiffness: 220 }} className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden shadow-2xl">
              <SidebarContent onNav={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 h-14 px-4 lg:px-6 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <Menu size={19} />
            </button>
            <div>
              <p className="font-semibold text-[#1C2237] text-sm">{pageTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] flex items-center justify-center text-white text-xs font-bold">AD</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
