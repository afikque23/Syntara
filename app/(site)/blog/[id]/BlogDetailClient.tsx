"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Clock, Calendar, ArrowLeft, Share2, BookOpen, ChevronRight, MessageCircle, X, Link2, ArrowRight, Tag } from "lucide-react";
import { useMemo } from "react";

type PublicBlog = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  published: boolean;
  featured: boolean;
  image: string;
  author: string;
  authorRole: string;
  color: string;
};

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-black text-[#0F172A] mt-10 mb-4 tracking-tight">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-xl font-bold text-[#0F172A] mt-8 mb-3">
          {line.slice(4)}
        </h3>,
      );
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="relative rounded-2xl bg-gradient-to-br from-[#3D35A8]/5 to-[#8B7EC8]/5 border-l-4 border-[#3D35A8] pl-6 pr-5 py-5 my-6 italic">
          <div className="absolute -top-3 left-5 text-6xl text-[#3D35A8]/10 font-serif leading-none select-none">&quot;</div>
          <p className="text-slate-700 text-[17px] leading-relaxed relative z-10">{line.slice(2)}</p>
        </blockquote>,
      );
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`list-${i}`} className="space-y-2 my-4">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-slate-600 text-[16px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D35A8] mt-2.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>,
      );
      continue;
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      elements.push(
        <p key={i} className="text-[#1E293B] text-[17px] leading-[1.85] my-2">
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="font-semibold text-[#0F172A]">
                {part}
              </strong>
            ) : (
              part
            ),
          )}
        </p>,
      );
    }

    i++;
  }

  return elements;
}

function RelatedCard({ post }: { post: PublicBlog }) {
  return (
    <Link href={`/blog/${post.id}`} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/80 hover:-translate-y-1 transition-all duration-300">
      <div className="relative overflow-hidden h-44">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${post.color || "from-[#3D35A8] to-[#00BCEF]"} flex items-center justify-center`}>
            <BookOpen size={32} className="text-white/40" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#3D35A8] text-xs font-semibold">{post.category}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-[#0F172A] text-sm leading-snug mb-2 group-hover:text-[#3D35A8] transition-colors line-clamp-2">{post.title}</h3>
        <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-slate-400 text-xs">
            <Clock size={12} />
            {post.readTime}
          </span>
          <span className="text-[#3D35A8] text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Baca <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function BlogDetailClient({ post, related }: { post: PublicBlog; related: PublicBlog[] }) {
  const shareUrl = `https://syntara.id/blog/${post.id}`;

  const currentUrl = useMemo(() => encodeURIComponent(shareUrl), [shareUrl]);
  const articleTitle = useMemo(() => encodeURIComponent(post.title), [post.title]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-[#3D35A8] transition-colors">
            Beranda
          </Link>
          <ChevronRight size={14} />
          <Link href="/blog" className="hover:text-[#3D35A8] transition-colors">
            Blog
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-600 truncate max-w-[200px]">{post.title}</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3D35A8]/10 text-[#3D35A8] text-xs font-semibold border border-[#3D35A8]/20">
            <Tag size={11} />
            {post.category}
          </span>
        </div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] leading-tight mb-5 tracking-tight">
          {post.title}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-slate-500 text-lg leading-relaxed mb-8 max-w-3xl">
          {post.excerpt}
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-wrap items-center gap-5 pb-8 border-b border-slate-100">
          {post.author && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] flex items-center justify-center text-white text-sm font-bold shadow-md">{post.author.slice(0, 2).toUpperCase()}</div>
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">{post.author}</p>
                <p className="text-xs text-slate-400">{post.authorRole || "Editor Syntara"}</p>
              </div>
            </div>
          )}

          {post.author && <div className="h-5 w-px bg-slate-200 hidden sm:block" />}

          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <Calendar size={15} />
            <span>{formatDate(post.date)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <Clock size={15} />
            <span>{post.readTime} baca</span>
          </div>
        </motion.div>

        {post.image && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="my-10">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={post.title} className="w-full h-[320px] sm:h-[420px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/25 via-transparent to-transparent" />
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="prose-content space-y-1">
          {post.content ? renderContent(post.content) : <p className="text-slate-400 italic">Konten artikel belum tersedia.</p>}
        </motion.div>

        <div className="mt-14 pt-8 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
                <Share2 size={14} /> Bagikan artikel ini
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={`https://wa.me/?text=${articleTitle}%20${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20b558] transition-colors shadow-sm"
                >
                  <MessageCircle size={15} /> WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${articleTitle}&url=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F172A] text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <X size={15} /> X / Twitter
                </a>
                <a
                  href={`https://linkedin.com/sharing/share-offsite/?url=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A66C2] text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Link2 size={15} /> LinkedIn
                </a>
              </div>
            </div>

            <Link href="/blog" className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#3D35A8] transition-colors">
              <ArrowLeft size={15} /> Kembali ke Blog
            </Link>
          </div>
        </div>

        <div className="mt-14 mb-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] p-8 sm:p-10 text-center shadow-2xl shadow-[#3D35A8]/30">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white/90 text-xs font-semibold mb-5 border border-white/20">
                <MessageCircle size={13} /> Konsultasi Gratis
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">Butuh Bantuan Publikasi Jurnal?</h2>
              <p className="text-white/70 text-base max-w-xl mx-auto mb-8 leading-relaxed">
                Tim ahli kami siap membantu Anda dari penulisan hingga akseptasi — mulai dari editing, formatting, hingga pendampingan submission ke jurnal internasional.
              </p>
              <a
                href={`/api/wa?text=Halo%20Syntara%2C%20saya%20baca%20artikel%20tentang%20${articleTitle}%20dan%20ingin%20konsultasi`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white text-[#3D35A8] font-bold text-base shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <MessageCircle size={18} className="text-[#25D366]" />
                Konsultasi via WhatsApp
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-16 mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-[#3D35A8] to-[#00BCEF]" />
            <h2 className="text-xl font-black text-[#0F172A] tracking-tight">Artikel Terkait</h2>
          </div>
          <div className={`grid grid-cols-1 gap-5 ${related.length >= 3 ? "sm:grid-cols-3" : related.length === 2 ? "sm:grid-cols-2" : ""}`}>
            {related.map((article) => (
              <RelatedCard key={article.id} post={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
