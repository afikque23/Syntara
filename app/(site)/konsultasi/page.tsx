"use client";

import { motion } from "motion/react";
import { MessageCircle, Clock, CheckCircle, HelpCircle, ArrowRight, Mail } from "lucide-react";
import { useEffect, useState } from "react";

const waUrl = "/api/wa?text=Halo%2C+saya+ingin+konsultasi+terkait+publikasi+jurnal";

const benefits = [
  { icon: Clock, title: "Respons Cepat", desc: "Tim kami merespons dalam 1–2 jam pada jam kerja" },
  { icon: CheckCircle, title: "Konsultasi Gratis", desc: "Sesi konsultasi awal tanpa biaya dan tanpa komitmen" },
  { icon: MessageCircle, title: "Diskusi Mendalam", desc: "Kami memahami kebutuhan jurnal Anda secara detail" },
  { icon: HelpCircle, title: "Solusi Custom", desc: "Rekomendasi solusi yang disesuaikan dengan kebutuhan Anda" },
];

type PublicFaq = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
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

const fallbackFaqs = [
  {
    q: "Apa yang perlu saya siapkan sebelum konsultasi?",
    a: "Cukup siapkan draft naskah jurnal Anda (dalam format apapun) dan informasi jurnal target jika ada. Tim kami akan memandu proses selanjutnya.",
  },
  {
    q: "Apakah konsultasi benar-benar gratis?",
    a: "Ya! Konsultasi awal sepenuhnya gratis. Anda bisa mendiskusikan kebutuhan, mendapatkan rekomendasi layanan, dan estimasi biaya tanpa kewajiban apapun.",
  },
  {
    q: "Berapa lama durasi konsultasi?",
    a: "Sesi konsultasi via WhatsApp biasanya berlangsung 15–30 menit. Tidak ada batasan pertanyaan yang bisa Anda ajukan.",
  },
  {
    q: "Apakah bisa konsultasi di luar jam kerja?",
    a: "Konsultasi via WhatsApp tersedia 24/7. Namun respons paling cepat pada jam kerja (08.00–17.00 WIB, Senin–Sabtu).",
  },
  {
    q: "Apakah data naskah saya aman?",
    a: "Kami menjaga kerahasiaan penuh setiap naskah yang dikirimkan. Semua data klien dijaga dengan ketat dan tidak disebarluaskan.",
  },
  {
    q: "Bagaimana jika jurnal saya sangat kompleks?",
    a: "Tidak masalah! Tim kami terdiri dari pakar berbagai bidang ilmu. Semakin kompleks naskah Anda, semakin kami senang membantu.",
  },
];

export default function Consultation() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [faqs, setFaqs] = useState(fallbackFaqs);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/faqs?category=consultation", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as unknown;
        if (!Array.isArray(json)) return;

        const normalized = json.map(normalizeFaq).filter((f): f is PublicFaq => f !== null);
        const mapped = normalized.map((f) => ({ q: f.question, a: f.answer }));
        if (alive && mapped.length > 0) setFaqs(mapped);
      } catch {
        // keep fallback
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

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
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,188,239,0.2) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center justify-center w-20 h-20 bg-[#00BCEF]/20 border border-[#00BCEF]/30 rounded-2xl mb-8 mx-auto">
            <MessageCircle size={36} className="text-[#00BCEF]" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-white mb-6">
            Konsultasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BCEF] to-[#8B7EC8]">Gratis</span> Sekarang
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Bicara langsung dengan tim ahli kami tentang kebutuhan publikasi jurnal Anda. Gratis, cepat, dan tanpa komitmen!
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#25D366] text-white rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-[#25D366]/40 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat WhatsApp Sekarang
          </motion.a>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C2237] mb-4">Kenapa Konsultasi dengan Kami?</h2>
            <p className="text-gray-500">Dapatkan panduan expert secara langsung, tanpa biaya</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-[#F8F8FD] rounded-2xl border border-[#E8E8EE] hover:border-[#3D35A8]/30 transition-colors group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <b.icon size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-[#1C2237] mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Pesan */}
      <section className="py-16 bg-gradient-to-br from-[#F8F8FD] to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1C2237] mb-4">Format Pesan Konsultasi</h2>
            <p className="text-gray-500">Gunakan template pesan berikut untuk konsultasi yang lebih efektif</p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl border-2 border-[#3D35A8]/20 overflow-hidden shadow-lg">
            <div className="bg-[#3D35A8] px-6 py-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <span className="text-white font-semibold text-sm">Template Pesan WhatsApp</span>
            </div>
            <div className="p-6 bg-[#E8F5E9]">
              <div className="bg-white rounded-2xl rounded-tl-none p-5 shadow-sm max-w-sm">
                <p className="text-[#1C2237] text-sm leading-relaxed">
                  Halo Syntara, saya ingin konsultasi terkait publikasi jurnal 🙏
                  <br />
                  <br />
                  <strong>Nama:</strong> [Nama Anda]
                  <br />
                  <strong>Institusi:</strong> [Universitas/Lembaga]
                  <br />
                  <strong>Bidang:</strong> [Bidang Penelitian]
                  <br />
                  <strong>Kebutuhan:</strong> [Editing/Formatting/Submit/dll]
                  <br />
                  <strong>Jurnal Target:</strong> [Nama jurnal jika ada]
                  <br />
                  <strong>Deadline:</strong> [Target waktu]
                </p>
              </div>
            </div>
            <div className="px-6 py-5 border-t border-[#E8E8EE] flex items-center justify-between">
              <p className="text-gray-500 text-sm">Atau klik tombol untuk auto-fill pesan</p>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-xl text-sm font-semibold hover:bg-[#1eba57] transition-colors">
                Chat Sekarang <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1C2237] mb-4">FAQ Konsultasi</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-[#F8F8FD] rounded-2xl border border-[#E8E8EE] overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
                  <span className="font-semibold text-[#1C2237] text-sm">{faq.q}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} className="text-[#3D35A8] font-bold text-xl flex-shrink-0">
                    +
                  </motion.span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact options */}
      <section className="py-16 bg-[#F8F8FD]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#1C2237] mb-4">Pilih Cara Konsultasi Anda</h2>
          <p className="text-gray-500 mb-10">Tersedia berbagai saluran komunikasi untuk kenyamanan Anda</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "whatsapp",
                title: "WhatsApp",
                desc: "Cara tercepat & termudah untuk konsultasi",
                action: "Chat Sekarang",
                href: waUrl,
                color: "bg-[#25D366]",
              },
              {
                icon: "email",
                title: "Email",
                desc: "Untuk pertanyaan detail atau lampiran file besar",
                action: "Kirim Email",
                href: "mailto:info@syntara.id",
                color: "bg-[#3D35A8]",
              },
              {
                icon: "instagram",
                title: "Instagram DM",
                desc: "Follow & DM kami di Instagram @syntara.id",
                action: "Buka Instagram",
                href: "https://instagram.com/syntara.id",
                color: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
              },
            ].map((c) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-white rounded-2xl p-6 border border-[#E8E8EE] shadow-sm text-center"
              >
                <div className={`w-14 h-14 ${c.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  {c.icon === "whatsapp" && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  )}
                  {c.icon === "email" && <Mail size={26} className="text-white" />}
                  {c.icon === "instagram" && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  )}
                </div>
                <h3 className="font-bold text-[#1C2237] mb-2">{c.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{c.desc}</p>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#3D35A8] text-sm font-semibold hover:gap-2 transition-all">
                  {c.action} <ArrowRight size={14} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
