"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, CheckCircle, Star, Globe, MessageSquare, Send, Edit3, FileText, Zap, Shield, Clock, Users, TrendingUp, ChevronRight, ChevronDown, BookOpen, Tag, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";

const heroImage =
  "https://images.unsplash.com/photo-1603530657796-cf3b12aa9e5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMHJlc2VhcmNoJTIwam91cm5hbCUyMHB1Ymxpc2hpbmd8ZW58MXx8fHwxNzc1NzAwMDU4fDA&ixlib=rb-4.1.0&q=80&w=1080";
const studyImage =
  "https://images.unsplash.com/photo-1588618319407-948d4424befd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMHN0dWR5aW5nJTIwbGlicmFyeSUyMGJvb2tzfGVufDF8fHx8MTc3NTcwMDA2MXww&ixlib=rb-4.1.0&q=80&w=1080";

const values = [
  { icon: Zap, title: "Proses Cepat", desc: "Penyelesaian dalam 3-7 hari kerja dengan kualitas terjamin" },
  { icon: Shield, title: "Harga Terjangkau", desc: "Paket mulai dari harga yang ramah di kantong mahasiswa" },
  { icon: Users, title: "Pendampingan Intensif", desc: "Tim ahli siap membantu dari awal hingga jurnal diterima" },
  { icon: TrendingUp, title: "Tingkat Keberhasilan Tinggi", desc: "Lebih dari 500+ jurnal berhasil dipublikasikan" },
];

type PublicService = {
  id: string;
  name: string;
  description: string;
  icon: string;
  estimasi: string;
  color: string;
  features: string[];
};

type PublicProduct = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  badge: string;
  popular: boolean;
};

type PublicTestimonial = {
  id: string;
  name: string;
  institution: string;
  role: string;
  comment: string;
  rating: number;
  journal: string;
};

type PublicFaq = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

type PublicHero = {
  badge: string;
  heading: string;
  headingHighlight: string;
  headingSuffix: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;
  featuresBadge: string;
  featuresTitle: string;
  featuresSubtitle: string;
  featuresItems: { icon: string; title: string; desc: string }[];
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function normalizeService(v: unknown): PublicService | null {
  if (!isRecord(v)) return null;

  const id = typeof v.id === "string" ? v.id : String(v.id ?? "");
  const name = typeof v.name === "string" ? v.name : String(v.name ?? "");
  const description = typeof v.description === "string" ? v.description : String(v.description ?? "");
  const icon = typeof v.icon === "string" ? v.icon : String(v.icon ?? "");
  const estimasi = typeof v.estimasi === "string" ? v.estimasi : String(v.estimasi ?? "");
  const color = typeof v.color === "string" ? v.color : "";
  const features = Array.isArray(v.features)
    ? v.features
        .filter((x): x is string => typeof x === "string")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  if (!id || !name) return null;
  return { id, name, description, icon, estimasi, color, features };
}

function normalizeProduct(v: unknown): PublicProduct | null {
  if (!isRecord(v)) return null;

  const id = typeof v.id === "string" ? v.id : String(v.id ?? "");
  const name = typeof v.name === "string" ? v.name : String(v.name ?? "");
  const price = typeof v.price === "string" ? v.price : String(v.price ?? "");
  const description = typeof v.description === "string" ? v.description : String(v.description ?? "");
  const badge = typeof v.badge === "string" ? v.badge : String(v.badge ?? "");
  const popular = Boolean(v.popular);
  const features = Array.isArray(v.features) ? v.features.filter((x): x is string => typeof x === "string" && x.trim().length > 0) : [];

  if (!id || !name) return null;
  return { id, name, price, description, features, badge, popular };
}

function normalizeTestimonial(v: unknown): PublicTestimonial | null {
  if (!isRecord(v)) return null;
  const id = typeof v.id === "string" ? v.id : String(v.id ?? "");
  const name = typeof v.name === "string" ? v.name : String(v.name ?? "");
  const institution = typeof v.institution === "string" ? v.institution : String(v.institution ?? "");
  const role = typeof v.role === "string" ? v.role : String(v.role ?? "");
  const comment = typeof v.comment === "string" ? v.comment : String(v.comment ?? "");
  const journal = typeof v.journal === "string" ? v.journal : String(v.journal ?? "");
  const rating = typeof v.rating === "number" && Number.isFinite(v.rating) ? Math.max(1, Math.min(5, Math.round(v.rating))) : 0;
  if (!id || !name || !comment || rating === 0) return null;
  return { id, name, institution, role, comment, rating, journal };
}

function normalizeFaq(v: unknown): PublicFaq | null {
  if (!isRecord(v)) return null;

  const id = typeof v.id === "string" ? v.id : String(v.id ?? "");
  const question = typeof v.question === "string" ? v.question : String(v.question ?? "");
  const answer = typeof v.answer === "string" ? v.answer : String(v.answer ?? "");
  const category = typeof v.category === "string" ? v.category : String(v.category ?? "");

  if (!id || !question.trim() || !answer.trim()) return null;
  return { id, question: question.trim(), answer: answer.trim(), category };
}

function avatarFromName(name: string): string {
  const parts = name
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : (parts[0]?.[1] ?? "");
  const out = `${a}${b}`.toUpperCase();
  return out || name.slice(0, 2).toUpperCase();
}

function iconFromName(raw: string): LucideIcon | null {
  if (!raw || typeof raw !== "string") return null;
  const key = raw.trim().toLowerCase();
  if (!key) return null;

  const map: Record<string, LucideIcon> = {
    edit3: Edit3,
    filetext: FileText,
    globe: Globe,
    messagesquare: MessageSquare,
    send: Send,
    zap: Zap,
    shield: Shield,
    users: Users,
    trendingup: TrendingUp,
    checkcircle: CheckCircle,
    package: Package,
  };
  return map[key] ?? null;
}

const fallbackServices = [
  {
    icon: Edit3,
    title: "Editing & Proofreading",
    desc: "Perbaikan grammar, struktur kalimat, dan academic tone yang sempurna",
    color: "from-[#3D35A8] to-[#5B50C8]",
    href: "/layanan",
  },
  {
    icon: FileText,
    title: "Formatting Jurnal",
    desc: "Penyesuaian template, sitasi APA/IEEE, tabel & gambar sesuai standar",
    color: "from-[#5B50C8] to-[#8B7EC8]",
    href: "/layanan",
  },
  {
    icon: Globe,
    title: "Translasi Akademik",
    desc: "Terjemahan Indonesia ↔ English dengan academic rewriting berkualitas",
    color: "from-[#00BCEF] to-[#0099CC]",
    href: "/layanan",
  },
  {
    icon: MessageSquare,
    title: "Konsultasi Jurnal",
    desc: "Rekomendasi jurnal yang tepat dan strategi submit yang efektif",
    color: "from-[#8B7EC8] to-[#3D35A8]",
    href: "/layanan",
  },
  {
    icon: Send,
    title: "Pendampingan Submit",
    desc: "Bantuan upload jurnal, cover letter, dan follow-up revisi reviewer",
    color: "from-[#3D35A8] to-[#00BCEF]",
    href: "/layanan",
  },
];

const fallbackTestimonials = [
  {
    name: "Dr. Rahmat Hidayat",
    role: "Dosen Universitas Indonesia",
    text: "Syntara sangat membantu proses publikasi saya. Dalam waktu seminggu, jurnal saya sudah siap submit ke Scopus!",
    rating: 5,
    avatar: "RH",
  },
  {
    name: "Siti Aminah, M.Si",
    role: "Peneliti LIPI",
    text: "Editing yang dilakukan sangat profesional dan sesuai standar internasional. Harganya pun sangat terjangkau.",
    rating: 5,
    avatar: "SA",
  },
  {
    name: "Prof. Budi Santoso",
    role: "Guru Besar IPB",
    text: "Highly recommended! Tim Syntara sangat responsif dan hasil kerjanya memuaskan. Jurnal saya diterima Q2!",
    rating: 5,
    avatar: "BS",
  },
];

const fallbackStats = [
  { value: "500+", label: "Jurnal Dipublikasikan" },
  { value: "300+", label: "Klien Puas" },
  { value: "98%", label: "Tingkat Keberhasilan" },
  { value: "24/7", label: "Dukungan Tim" },
];

const waUrl = "/api/wa?text=Halo%2C+saya+ingin+konsultasi+terkait+publikasi+jurnal";

type HomePricingPlan = {
  name: string;
  price: string;
  desc: string;
  badge?: string;
  color: string;
  accent: string;
  featured?: boolean;
  features: string[];
  cta: string;
};

const fallbackPricingPlans: HomePricingPlan[] = [
  {
    name: "Basic",
    price: "Rp 350.000",
    desc: "Ideal untuk koreksi dasar & proofreading",
    color: "border-[#8B7EC8]",
    accent: "text-[#3D35A8]",
    features: ["Editing grammar & struktur", "Proofreading menyeluruh", "1x revisi gratis", "Estimasi 3–5 hari kerja"],
    cta: "bg-white border-2 border-[#3D35A8] text-[#3D35A8] hover:bg-[#3D35A8] hover:text-white",
  },
  {
    name: "Standard",
    price: "Rp 750.000",
    desc: "Paket editing & formatting siap submit",
    badge: "Paling Populer",
    color: "border-[#3D35A8]",
    accent: "text-white",
    featured: true,
    features: ["Full editing & academic tone", "Formatting template jurnal", "Sitasi APA/IEEE/Vancouver", "2x revisi gratis", "Estimasi 5–7 hari kerja"],
    cta: "bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white hover:shadow-lg hover:shadow-[#3D35A8]/40",
  },
  {
    name: "Premium",
    price: "Rp 1.500.000",
    desc: "Full service dari editing hingga diterima",
    color: "border-[#00BCEF]",
    accent: "text-white",
    features: ["Full editing & proofreading", "Translasi akademik", "Revisi unlimited", "Pendampingan submit", "Cover letter profesional"],
    cta: "bg-gradient-to-r from-[#00BCEF] to-[#3D35A8] text-white hover:shadow-lg hover:shadow-[#00BCEF]/40",
  },
];

const fallbackFaqItems = [
  {
    q: "Berapa lama proses editing dan publikasi jurnal?",
    a: "Tergantung paket yang dipilih: Basic 3–5 hari kerja, Standard 5–7 hari kerja, dan Premium hingga jurnal diterima. Kami selalu mengutamakan kualitas tanpa mengorbankan kecepatan.",
  },
  {
    q: "Apakah Syntara bisa membantu memilih jurnal yang tepat?",
    a: "Ya! Tim kami akan menganalisis topik penelitian Anda dan merekomendasikan jurnal yang paling sesuai berdasarkan scope, impact factor, dan peluang diterima.",
  },
  {
    q: "Bagaimana jika jurnal saya ditolak reviewer?",
    a: "Kami memberikan pendampingan revisi sesuai komentar reviewer. Untuk paket Premium, kami membantu hingga jurnal diterima tanpa biaya tambahan.",
  },
  {
    q: "Apakah ada garansi uang kembali?",
    a: "Kami memberikan garansi kepuasan. Jika hasil editing tidak sesuai kesepakatan awal, kami akan revisi ulang secara gratis hingga Anda puas.",
  },
  {
    q: "Bagaimana cara pembayaran?",
    a: "Kami menerima transfer bank (BCA, Mandiri, BNI, BRI), QRIS, dan e-wallet. Pembayaran dilakukan setelah konsultasi awal dan sebelum pengerjaan dimulai.",
  },
  {
    q: "Apakah layanan Syntara juga untuk jurnal nasional?",
    a: "Tentu! Kami melayani publikasi jurnal nasional (SINTA 1–6) maupun internasional (Scopus, WoS, dll.) dengan paket dan harga yang menyesuaikan.",
  },
];

const blogPosts = [
  {
    id: 1,
    title: "Cara Publish Jurnal Internasional: Panduan Lengkap untuk Pemula",
    excerpt: "Memublikasikan jurnal di jurnal internasional bereputasi adalah impian banyak peneliti. Panduan ini membantu Anda memahami setiap langkahnya.",
    category: "Panduan Jurnal",
    readTime: "8 menit",
    date: "5 April 2026",
    color: "from-[#3D35A8] to-[#00BCEF]",
  },
  {
    id: 2,
    title: "10 Tips Ampuh Agar Jurnal Anda Lolos Review",
    excerpt: "Penolakan jurnal adalah hal yang umum, namun bisa diminimalkan dengan strategi yang tepat. Pelajari 10 tips yang digunakan peneliti berpengalaman.",
    category: "Tips Publikasi",
    readTime: "6 menit",
    date: "2 April 2026",
    color: "from-[#00BCEF] to-[#0099CC]",
  },
  {
    id: 3,
    title: "7 Kesalahan Umum yang Bikin Jurnal Anda Ditolak",
    excerpt: "Dari format yang salah hingga metodologi yang lemah, ketahui kesalahan-kesalahan fatal yang sering dilakukan peneliti dalam proses publikasi.",
    category: "Kesalahan Umum",
    readTime: "5 menit",
    date: "28 Maret 2026",
    color: "from-[#8B7EC8] to-[#3D35A8]",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.07 }} className="border border-[#E8E8EE] rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-[#F8F8FD] transition-colors duration-200 group">
        <span className="font-semibold text-[#1C2237] pr-4 group-hover:text-[#3D35A8] transition-colors">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-shrink-0 text-[#3D35A8]">
          <ChevronDown size={20} />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="px-6 pb-5 pt-2 text-gray-500 text-sm leading-relaxed border-t border-[#E8E8EE] bg-[#F8F8FD]">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FloatingParticle({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <motion.div className="absolute w-2 h-2 rounded-full bg-[#00BCEF]/30" style={{ left: x, top: y }} animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut", delay }} />
  );
}

export default function Home() {
  const fallbackByTitle = useMemo(() => {
    const m = new Map<string, (typeof fallbackServices)[number]>();
    for (const s of fallbackServices) m.set(s.title.toLowerCase(), s);
    return m;
  }, []);

  const [services, setServices] = useState(fallbackServices);

  const fallbackPricingByName = useMemo(() => {
    const m = new Map<string, HomePricingPlan>();
    for (const p of fallbackPricingPlans) m.set(p.name.toLowerCase(), p);
    return m;
  }, []);

  const [pricingPlans, setPricingPlans] = useState<HomePricingPlan[]>(fallbackPricingPlans);

  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  const [faqItems, setFaqItems] = useState(fallbackFaqItems);

  const [heroData, setHeroData] = useState<PublicHero | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/hero", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as PublicHero;
        if (alive && json && typeof json === "object") setHeroData(json);
      } catch {
        // keep fallback
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as unknown;
        if (!Array.isArray(json)) return;

        const normalized = json.map(normalizeService).filter((s): s is PublicService => s !== null);
        const mapped = normalized.map((s) => {
          const fb = fallbackByTitle.get(s.name.toLowerCase());
          return {
            icon: iconFromName(s.icon) ?? fb?.icon ?? Package,
            title: s.name,
            desc: s.description || fb?.desc || "",
            color: s.color || fb?.color || "from-[#3D35A8] to-[#00BCEF]",
            href: "/layanan",
          };
        });

        if (alive && mapped.length > 0) setServices(mapped);
      } catch {
        // keep fallback
      }
    })();
    return () => {
      alive = false;
    };
  }, [fallbackByTitle]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as unknown;
        if (!Array.isArray(json)) return;

        const normalized = json.map(normalizeProduct).filter((p): p is PublicProduct => p !== null);
        const mapped: HomePricingPlan[] = normalized.map((p) => {
          const fb = fallbackPricingByName.get(p.name.toLowerCase());
          const badge = p.badge?.trim() ? p.badge.trim() : p.popular ? "Paling Populer" : fb?.badge;
          return {
            name: p.name,
            price: p.price || fb?.price || "",
            desc: p.description || fb?.desc || "",
            color: fb?.color ?? "border-[#3D35A8]",
            accent: fb?.accent ?? "text-[#3D35A8]",
            features: p.features.length > 0 ? p.features : (fb?.features ?? []),
            cta: fb?.cta ?? "bg-white border-2 border-[#3D35A8] text-[#3D35A8] hover:bg-[#3D35A8] hover:text-white",
            badge: badge || undefined,
            featured: fb?.featured || p.popular ? true : undefined,
          };
        });

        if (alive && mapped.length > 0) setPricingPlans(mapped);
      } catch {
        // keep fallback
      }
    })();
    return () => {
      alive = false;
    };
  }, [fallbackPricingByName]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/testimonials?limit=3", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as unknown;
        if (!Array.isArray(json)) return;

        const normalized = json.map(normalizeTestimonial).filter((t): t is PublicTestimonial => t !== null);
        const mapped = normalized.map((t) => ({
          name: t.name,
          role: t.role || t.institution || "Klien Syntara",
          text: t.comment,
          rating: t.rating,
          avatar: avatarFromName(t.name),
        }));

        if (alive && mapped.length > 0) setTestimonials(mapped);
      } catch {
        // keep fallback
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/faqs?category=home", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as unknown;
        if (!Array.isArray(json)) return;

        const normalized = json.map(normalizeFaq).filter((f): f is PublicFaq => f !== null);
        const mapped = normalized.map((f) => ({ q: f.question, a: f.answer }));

        if (alive && mapped.length > 0) setFaqItems(mapped);
      } catch {
        // keep fallback
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const currentStats = heroData ? [
    { value: heroData.stat1Value, label: heroData.stat1Label },
    { value: heroData.stat2Value, label: heroData.stat2Label },
    { value: heroData.stat3Value, label: heroData.stat3Label },
    { value: heroData.stat4Value, label: heroData.stat4Label },
  ] : fallbackStats;

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#0D1B2A] via-[#1C2237] to-[#2A1F5C] overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(61,53,168,0.4) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,188,239,0.3) 0%, transparent 70%)" }}
            animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {[
            { x: "10%", y: "20%", delay: 0 },
            { x: "20%", y: "60%", delay: 1 },
            { x: "80%", y: "30%", delay: 0.5 },
            { x: "70%", y: "70%", delay: 1.5 },
            { x: "50%", y: "15%", delay: 2 },
            { x: "90%", y: "80%", delay: 0.8 },
          ].map((p, i) => (
            <FloatingParticle key={i} {...p} />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#00BCEF]/20 border border-[#00BCEF]/30 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-[#00BCEF] animate-pulse" />
                <span className="text-[#00BCEF] text-sm font-medium">{heroData?.badge || "Platform Publikasi Jurnal #1 Indonesia"}</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {heroData?.heading || "Permudah"}{" "}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BCEF] to-[#8B7EC8]">{heroData?.headingHighlight || "Publikasi"}</span>
                  <motion.span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#00BCEF] to-[#8B7EC8]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.5 }} />
                </span>{" "}
                {heroData?.headingSuffix || "Jurnal Anda"}
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-white/70 text-lg md:text-xl leading-relaxed mb-8">
                {heroData?.description || "Syntara hadir sebagai mitra terpercaya dalam perjalanan publikasi jurnal ilmiah Anda. Dari editing hingga pendampingan submit — kami siap membantu dengan profesional."}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-wrap gap-4 mb-10">
                <a
                  href={heroData?.ctaLink || waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-4 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#3D35A8]/40 transition-all duration-300 hover:-translate-y-1"
                >
                  {heroData?.ctaText || "Konsultasi Sekarang"}
                  <ArrowRight size={20} />
                </a>
                <Link href={heroData?.secondaryCtaLink || "/layanan"} className="inline-flex items-center gap-2 px-7 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                  {heroData?.secondaryCtaText || "Lihat Layanan"}
                  <ChevronRight size={20} />
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {currentStats.map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }} className="text-center p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                    <div className="text-2xl font-bold text-[#00BCEF]">{stat.value}</div>
                    <div className="text-white/50 text-xs mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3D35A8]/30 to-[#00BCEF]/30 rounded-3xl blur-2xl" />
                <img src={heroImage} alt="Academic Research" className="relative z-10 w-full h-[450px] object-cover rounded-3xl border border-white/10" />

                <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -left-8 top-16 bg-white rounded-2xl shadow-2xl p-4 z-20 max-w-[180px]">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-xs font-semibold text-[#1C2237]">Jurnal Diterima!</span>
                  </div>
                  <p className="text-[10px] text-gray-500">Scopus Q2 — 3 hari proses</p>
                </motion.div>

                <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -right-6 bottom-16 bg-[#1C2237] rounded-2xl shadow-2xl p-4 z-20 max-w-[160px]">
                  <div className="text-2xl font-bold text-[#00BCEF] mb-1">98%</div>
                  <p className="text-[10px] text-white/70">Tingkat keberhasilan publikasi</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <span className="text-white/40 text-xs">Scroll ke bawah</span>
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1.5">
            <motion.div className="w-1 h-2 bg-white/60 rounded-full" animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          </div>
        </motion.div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge={heroData?.featuresBadge || "Mengapa Syntara?"}
            title={heroData?.featuresTitle || "Solusi Terbaik untuk Publikasi Jurnal Anda"}
            subtitle={heroData?.featuresSubtitle || "Kami menggabungkan keahlian akademik dengan teknologi modern untuk hasil publikasi yang maksimal"}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(heroData?.featuresItems || values).map((v, i) => {
              const Icon = typeof v.icon === "string" ? (iconFromName(v.icon) || Zap) : (v.icon || Zap);
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -8, boxShadow: "0 25px 50px rgba(61,53,168,0.15)" }}
                  className="group p-6 bg-[#F8F8FD] rounded-2xl border border-[#E8E8EE] cursor-pointer transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-bold text-[#1C2237] mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-b from-[#F8F8FD] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Layanan Kami" title="Semua yang Anda Butuhkan untuk Publikasi" subtitle="Dari editing hingga submit — kami tangani semuanya dengan profesional" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="group relative overflow-hidden bg-white rounded-2xl border border-[#E8E8EE] shadow-sm hover:shadow-xl hover:shadow-[#3D35A8]/10 transition-all duration-300"
              >
                <div className={`h-1.5 bg-gradient-to-r ${s.color}`} />
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4`}>
                    <s.icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-bold text-[#1C2237] mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{s.desc}</p>
                  <Link href={s.href} className="inline-flex items-center gap-1 text-[#3D35A8] text-sm font-medium hover:gap-2 transition-all">
                    Selengkapnya <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative overflow-hidden bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-white text-xl mb-2">Siap Mulai?</h3>
                <p className="text-white/70 text-sm">Konsultasikan kebutuhan jurnal Anda secara gratis sekarang</p>
              </div>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-white text-[#3D35A8] rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300 w-fit">
                Chat WhatsApp <ArrowRight size={16} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Produk & Harga" title="Paket Transparan, Kualitas Terjamin" subtitle="Pilih paket yang sesuai kebutuhan dan anggaran Anda — tanpa biaya tersembunyi" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className={`relative rounded-3xl border-2 ${plan.color} overflow-hidden transition-all duration-300 flex flex-col ${plan.featured ? "shadow-2xl shadow-[#3D35A8]/20" : "shadow-sm hover:shadow-xl hover:shadow-[#3D35A8]/10"}`}
              >
                {plan.featured && (
                  <div className="bg-gradient-to-r from-[#3D35A8] to-[#5B50C8] px-6 py-2 text-center">
                    <span className="text-white text-xs font-bold tracking-wide uppercase">{plan.badge}</span>
                  </div>
                )}
                <div className={`p-6 ${plan.featured ? "bg-gradient-to-br from-[#3D35A8] to-[#5B50C8]" : "bg-white"} flex-1 flex flex-col`}>
                  <div className={`flex items-center gap-2 mb-4 ${plan.featured ? "text-white/80" : "text-[#8B7EC8]"}`}>
                    <Package size={16} />
                    <span className="text-sm font-medium">{plan.name}</span>
                  </div>
                  <div className={`text-3xl font-bold mb-1 ${plan.featured ? "text-white" : "text-[#1C2237]"}`}>{plan.price}</div>
                  <div className={`text-xs mb-4 ${plan.featured ? "text-white/60" : "text-gray-400"}`}>per naskah</div>
                  <p className={`text-sm mb-6 ${plan.featured ? "text-white/70" : "text-gray-500"}`}>{plan.desc}</p>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className={`flex items-start gap-2 text-sm ${plan.featured ? "text-white/85" : "text-gray-600"}`}>
                        <CheckCircle size={15} className="text-[#00BCEF] mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`/api/wa?text=Halo%2C+saya+tertarik+dengan+paket+${encodeURIComponent(plan.name)}+Syntara`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 mt-auto ${plan.cta}`}
                  >
                    Pilih Paket {plan.name}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center">
            <Link href="/harga" className="inline-flex items-center gap-2 text-[#3D35A8] font-semibold hover:gap-3 transition-all">
              Lihat Detail Paket Lengkap <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Remaining sections unchanged from Figma version */}
      {/* Note: This page intentionally mirrors the original Figma-exported markup and styling. */}

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
              <div className="relative rounded-3xl overflow-hidden">
                <img src={studyImage} alt="Study" className="w-full h-[420px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#3D35A8]/40 to-transparent" />
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#00BCEF]/20 rounded-2xl -z-10" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#8B7EC8]/20 rounded-2xl -z-10" />
              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }} className="absolute bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1C2237]">300+ Klien Puas</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={10} fill="#F59E0B" className="text-amber-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <span className="inline-block px-4 py-1.5 bg-[#3D35A8]/10 text-[#3D35A8] rounded-full text-sm font-semibold mb-4">Tentang Syntara</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1C2237] mb-6 leading-tight">Mitra Terpercaya dalam Perjalanan Publikasi Ilmiah Anda</h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Syntara didirikan oleh para akademisi dan praktisi berpengalaman dengan misi mempermudah proses publikasi jurnal ilmiah bagi seluruh peneliti Indonesia. Kami memahami betapa kompleksnya persyaratan publikasi jurnal
                internasional.
              </p>
              <ul className="space-y-3 mb-8">
                {["Tim editor berpengalaman dengan latar belakang akademik", "Jaringan luas dengan penerbit jurnal internasional", "Track record 500+ jurnal berhasil dipublikasikan", "Dukungan purna jual hingga jurnal diterima"].map(
                  (item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-[#00BCEF] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{item}</span>
                    </li>
                  ),
                )}
              </ul>
              <Link href="/tentang" className="inline-flex items-center gap-2 px-6 py-3 bg-[#3D35A8] text-white rounded-xl font-semibold hover:bg-[#3230A0] transition-colors">
                Pelajari Lebih Lanjut <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#F8F8FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Testimoni" title="Apa Kata Klien Kami?" subtitle="Lebih dari 300 peneliti dan akademisi telah mempercayai Syntara" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-[#E8E8EE] shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={16} fill="#F59E0B" className="text-amber-500" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">“{t.text}”</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] flex items-center justify-center text-white text-sm font-bold">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-[#1C2237] text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
            <Link href="/testimoni" className="inline-flex items-center gap-2 text-[#3D35A8] font-semibold hover:gap-3 transition-all">
              Lihat Semua Testimoni <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Blog & Tips" title="Artikel Terbaru untuk Peneliti" subtitle="Temukan panduan, tips, dan strategi terkini seputar publikasi jurnal ilmiah" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {blogPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group bg-white rounded-2xl border border-[#E8E8EE] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#3D35A8]/10 transition-all duration-300 cursor-pointer"
              >
                <div className={`h-2 bg-gradient-to-r ${post.color}`} />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${post.color} text-white`}>
                      <Tag size={10} />
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={10} />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#1C2237] mb-3 leading-snug group-hover:text-[#3D35A8] transition-colors">{post.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{post.date}</span>
                    <span className="inline-flex items-center gap-1 text-[#3D35A8] text-sm font-medium group-hover:gap-2 transition-all">
                      Baca <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[#3D35A8] font-semibold hover:gap-3 transition-all">
              Lihat Semua Artikel <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section id="faq" className="py-20 md:py-28 bg-[#F8F8FD]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="FAQ" title="Pertanyaan yang Sering Ditanyakan" subtitle="Temukan jawaban atas pertanyaan umum seputar layanan publikasi jurnal Syntara" />

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} index={i} />
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-10 text-center p-8 bg-gradient-to-r from-[#3D35A8]/10 to-[#00BCEF]/10 rounded-3xl border border-[#3D35A8]/20">
            <BookOpen size={32} className="text-[#3D35A8] mx-auto mb-4" />
            <h3 className="font-bold text-[#1C2237] mb-2">Masih ada pertanyaan?</h3>
            <p className="text-gray-500 text-sm mb-6">Tim kami siap membantu Anda. Hubungi kami langsung via WhatsApp untuk konsultasi gratis!</p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#3D35A8]/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Tanya via WhatsApp <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-br from-[#1C2237] via-[#2A1F5C] to-[#1C2237] relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,188,239,0.15) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Mulai Perjalanan Publikasi Anda <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BCEF] to-[#8B7EC8]">Hari Ini</span>
            </h2>
            <p className="text-white/70 text-lg mb-10">Jangan biarkan kesulitan teknis menghambat penelitian berharga Anda. Konsultasi gratis, tanpa komitmen.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-[#00BCEF]/30 transition-all duration-300 hover:-translate-y-1"
              >
                Chat WhatsApp Sekarang
                <ArrowRight size={20} />
              </a>
              <Link href="/form-request" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300">
                Isi Form Request
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
