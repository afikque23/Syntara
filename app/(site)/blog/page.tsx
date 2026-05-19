"use client";

import { motion } from "motion/react";
import { Clock, ArrowRight, BookOpen, Tag } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const blogImage1 =
  "https://images.unsplash.com/photo-1603530657796-cf3b12aa9e5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMHJlc2VhcmNoJTIwam91cm5hbCUyMHB1Ymxpc2hpbmd8ZW58MXx8fHwxNzc1NzAwMDU4fDA&ixlib=rb-4.1.0&q=80&w=400";

const categories = ["Semua", "Tips Publikasi", "Panduan Jurnal", "Kesalahan Umum", "Strategi Submit", "Akademik"];

type PublicPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string; // ISO
  image: string;
  featured: boolean;
  color: string;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function normalizePost(v: unknown): PublicPost | null {
  if (!isRecord(v)) return null;

  const id = typeof v.id === "string" ? v.id : String(v.id ?? "");
  const title = typeof v.title === "string" ? v.title : String(v.title ?? "");
  const excerpt = typeof v.excerpt === "string" ? v.excerpt : String(v.excerpt ?? "");
  const category = typeof v.category === "string" ? v.category : String(v.category ?? "");
  const readTime = typeof v.readTime === "string" ? v.readTime : String(v.readTime ?? "");
  const date = typeof v.date === "string" ? v.date : String(v.date ?? "");
  const image = typeof v.image === "string" ? v.image : String(v.image ?? "");
  const featured = Boolean(v.featured);
  const color = typeof v.color === "string" ? v.color : "from-[#3D35A8] to-[#00BCEF]";

  if (!id || !title) return null;

  return {
    id,
    title,
    excerpt,
    category,
    readTime,
    date,
    image,
    featured,
    color,
  };
}

const waUrl = "/api/wa?text=Halo%2C+saya+ingin+konsultasi+terkait+publikasi+jurnal";

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/blog", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load blog");
        const json = (await res.json()) as unknown;
        if (!Array.isArray(json)) throw new Error("Invalid response");
        const normalized = json.map(normalizePost).filter((p): p is PublicPost => p !== null);
        if (alive) setPosts(normalized);
      } catch {
        if (alive) setPosts([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => (activeCategory === "Semua" ? posts : posts.filter((p) => p.category === activeCategory)), [activeCategory, posts]);

  const featuredPost = useMemo(() => posts.find((p) => p.featured), [posts]);

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#1C2237] via-[#2A1F5C] to-[#1C2237] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#00BCEF]/20 border border-[#00BCEF]/30 rounded-full mb-6">
            <BookOpen size={16} className="text-[#00BCEF]" />
            <span className="text-[#00BCEF] text-sm">Blog & Edukasi</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-white mb-6">
            Wawasan untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BCEF] to-[#8B7EC8]">Publikasi Lebih Baik</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/70 text-lg">
            Tips, panduan, dan strategi terkini untuk membantu Anda sukses publikasi jurnal internasional
          </motion.p>
        </div>
      </section>

      {/* Featured Post */}
      {activeCategory === "Semua" && featuredPost && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gradient-to-br from-[#F8F8FD] to-white rounded-3xl border-2 border-[#3D35A8]/20 overflow-hidden"
            >
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featuredPost.image || blogImage1} alt={featuredPost.title} className="w-full h-[320px] lg:h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent lg:bg-gradient-to-t from-black/20" />
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#3D35A8] text-white text-xs font-bold rounded-full">⭐ Artikel Unggulan</span>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#3D35A8]/10 text-[#3D35A8] text-xs font-semibold rounded-full">{featuredPost.category}</span>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock size={12} />
                    <span>{featuredPost.readTime} baca</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-[#1C2237] mb-4 leading-tight">{featuredPost.title}</h2>
                <p className="text-gray-500 leading-relaxed mb-6 text-sm">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">{formatDate(featuredPost.date)}</span>
                  <Link href={`/blog/${featuredPost.id}`} className="inline-flex items-center gap-2 text-[#3D35A8] font-semibold text-sm hover:gap-3 transition-all">
                    Baca Selengkapnya <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-[#E8E8EE] sticky top-20 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat ? "bg-[#3D35A8] text-white shadow-lg shadow-[#3D35A8]/30" : "bg-[#F8F8FD] text-gray-600 hover:bg-[#3D35A8]/10 hover:text-[#3D35A8] border border-[#E8E8EE]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 md:py-24 bg-[#F8F8FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && <div className="text-center text-gray-400 text-sm py-12">Memuat artikel...</div>}
          {!loading && posts.length === 0 && <div className="text-center text-gray-400 text-sm py-12">Belum ada artikel yang dipublikasikan.</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeCategory === "Semua" ? posts.filter((p) => !p.featured) : filtered).map((post, i) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="block">
                <motion.article
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl border border-[#E8E8EE] overflow-hidden shadow-sm hover:shadow-lg hover:shadow-[#3D35A8]/10 transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.image || blogImage1} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${post.color} opacity-30`} />
                    <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#3D35A8] text-xs font-semibold rounded-full">
                      <Tag size={10} />
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Clock size={11} />
                        <span>{post.readTime}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-400 text-xs">{formatDate(post.date)}</span>
                    </div>
                    <h3 className="font-bold text-[#1C2237] mb-2 leading-snug group-hover:text-[#3D35A8] transition-colors">{post.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] group-hover:w-20 transition-all duration-300" />
                      <span className="flex items-center gap-1 text-[#3D35A8] text-sm font-medium group-hover:gap-2 transition-all">
                        Baca <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-16 bg-gradient-to-br from-[#3D35A8] via-[#5B50C8] to-[#00BCEF]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <BookOpen size={40} className="text-white/60 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Butuh Bantuan Publikasi Langsung?</h2>
            <p className="text-white/80 mb-8">Artikel ini hanya teori — tim kami siap membantu Anda secara langsung!</p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#3D35A8] rounded-2xl font-bold hover:shadow-xl hover:shadow-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              Konsultasi Gratis <ArrowRight size={20} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
