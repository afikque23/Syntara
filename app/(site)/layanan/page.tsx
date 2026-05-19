"use client";

import { motion } from "motion/react";
import { Edit3, FileText, Globe, MessageSquare, Send, CheckCircle, Clock, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { useEffect, useMemo, useState } from "react";

const waUrl = "/api/wa?text=Halo%2C+saya+ingin+konsultasi+terkait+publikasi+jurnal";

type PublicService = {
  id: string;
  name: string;
  tagline: string;
  highlight: string | null;
  description: string;
  icon: string;
  estimasi: string;
  color: string;
  features: string[];
  previewFeatures: string[];
};

type UiService = {
  id: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  color: string;
  features: string[];
  previewFeatures: string[];
  timeline: string;
  highlight: string | null;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function normalizeService(v: unknown): PublicService | null {
  if (!isRecord(v)) return null;

  const id = typeof v.id === "string" ? v.id : String(v.id ?? "");
  const name = typeof v.name === "string" ? v.name : String(v.name ?? "");
  const tagline = typeof v.tagline === "string" ? v.tagline : String(v.tagline ?? "");
  const highlight = typeof v.highlight === "string" ? v.highlight : null;
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

  const previewFeatures = Array.isArray((v as Record<string, unknown>).previewFeatures)
    ? ((v as Record<string, unknown>).previewFeatures as unknown[])
        .filter((x): x is string => typeof x === "string")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  if (!id || !name) return null;

  return { id, name, tagline, highlight: highlight?.trim() ? highlight.trim() : null, description, icon, estimasi, color, features, previewFeatures };
}

function iconFromName(raw: string): LucideIcon | null {
  const key = raw.trim().toLowerCase();
  if (!key) return null;

  const map: Record<string, LucideIcon> = {
    edit3: Edit3,
    filetext: FileText,
    globe: Globe,
    messagesquare: MessageSquare,
    send: Send,
  };

  return map[key] ?? null;
}

const fallbackServices: UiService[] = [
  {
    id: "editing",
    icon: Edit3,
    title: "Editing & Proofreading",
    tagline: "Sempurnakan Tulisan Akademik Anda",
    description: "Layanan editing dan proofreading profesional yang memastikan naskah jurnal Anda memenuhi standar penulisan akademik internasional tertinggi.",
    color: "from-[#3D35A8] to-[#5B50C8]",
    features: ["Perbaikan grammar & struktur kalimat", "Academic tone improvement", "Clarity & coherence enhancement", "Highlight revisi yang transparan", "Pengecekan konsistensi terminologi", "Proofreading final sebelum submit"],
    previewFeatures: [],
    timeline: "3–5 hari kerja",
    highlight: "Paling Diminati",
  },
  {
    id: "formatting",
    icon: FileText,
    title: "Formatting Jurnal",
    tagline: "Format Tepat, Submit Langsung",
    description: "Penyesuaian format naskah sesuai panduan jurnal target Anda, termasuk template, sitasi, tabel, dan gambar.",
    color: "from-[#5B50C8] to-[#8B7EC8]",
    features: ["Penyesuaian template jurnal target", "Sitasi APA, IEEE, AMA, Vancouver", "Formatting tabel & gambar", "Abstrak & keywords optimization", "Reference list formatting", "Supplementary materials"],
    previewFeatures: [],
    timeline: "2–4 hari kerja",
    highlight: null,
  },
  {
    id: "translasi",
    icon: Globe,
    title: "Translasi Akademik",
    tagline: "Bahasa Bukan Hambatan",
    description: "Layanan terjemahan dua arah Indonesia ↔ English yang mempertahankan makna ilmiah dan gaya penulisan akademik.",
    color: "from-[#00BCEF] to-[#0099CC]",
    features: ["Terjemahan Indonesia ke English", "Terjemahan English ke Indonesia", "Academic rewriting & paraphrasing", "Native-level language quality", "Field-specific terminology", "Quality assurance review"],
    previewFeatures: [],
    timeline: "3–7 hari kerja",
    highlight: null,
  },
  {
    id: "konsultasi",
    icon: MessageSquare,
    title: "Konsultasi Jurnal",
    tagline: "Strategi Tepat, Hasil Maksimal",
    description: "Dapatkan rekomendasi jurnal yang paling sesuai dengan topik penelitian Anda beserta strategi submission yang efektif.",
    color: "from-[#8B7EC8] to-[#3D35A8]",
    features: ["Analisis kesesuaian topik jurnal", "Rekomendasi jurnal Q1/Q2/Q3", "Scopus & WoS indexed journals", "Strategi submission yang efektif", "Analisis scope & aim jurnal", "Author guidelines review"],
    previewFeatures: [],
    timeline: "1–2 hari kerja",
    highlight: null,
  },
  {
    id: "submit",
    icon: Send,
    title: "Pendampingan Submit",
    tagline: "Dari Submit Hingga Accepted",
    description: "Pendampingan penuh dalam proses submission jurnal, mulai dari persiapan dokumen hingga follow-up revisi reviewer.",
    color: "from-[#3D35A8] to-[#00BCEF]",
    features: ["Bantuan upload di sistem jurnal", "Cover letter profesional", "Respon revisi reviewer", "Resubmission assistance", "Follow-up status jurnal", "Pendampingan hingga accepted"],
    previewFeatures: [],
    timeline: "Ongoing (hingga accepted)",
    highlight: "Terlengkap",
  },
];

export default function Services() {
  const [services, setServices] = useState<UiService[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackByTitle = useMemo(() => {
    const m = new Map<string, UiService>();
    for (const s of fallbackServices) m.set(s.title.toLowerCase(), s);
    return m;
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load services");
        const json = (await res.json()) as unknown;
        if (!Array.isArray(json)) throw new Error("Invalid response");

        const normalized = json.map(normalizeService).filter((s): s is PublicService => s !== null);
        const mapped: UiService[] = normalized.map((s) => {
          const fb = fallbackByTitle.get(s.name.toLowerCase());
          const icon = iconFromName(s.icon) ?? fb?.icon ?? FileText;

          return {
            id: s.id,
            icon,
            title: s.name,
            tagline: s.tagline || fb?.tagline || "",
            description: s.description || fb?.description || "",
            color: s.color || fb?.color || "from-[#3D35A8] to-[#00BCEF]",
            features: s.features.length > 0 ? s.features : (fb?.features ?? []),
            previewFeatures: s.previewFeatures.length > 0 ? s.previewFeatures : [],
            timeline: s.estimasi || fb?.timeline || "",
            highlight: s.highlight ?? fb?.highlight ?? null,
          };
        });

        if (alive) setServices(mapped);
      } catch {
        if (alive) setServices(fallbackServices);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [fallbackByTitle]);

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-[#1C2237] via-[#2A1F5C] to-[#1C2237] overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <motion.div
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,188,239,0.2) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#00BCEF]/20 border border-[#00BCEF]/30 rounded-full mb-6">
            <span className="text-[#00BCEF] text-sm font-medium">{services.length > 0 ? `${services.length} Layanan Profesional` : "Layanan Profesional"}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-white mb-6">
            Layanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BCEF] to-[#8B7EC8]">Publikasi Jurnal</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-white/70 text-lg max-w-2xl mx-auto">
            Kami menyediakan solusi lengkap untuk setiap tahap proses publikasi jurnal ilmiah Anda
          </motion.p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && <div className="text-center text-gray-400 text-sm py-8">Memuat layanan...</div>}
          {!loading && services.length === 0 && <div className="text-center text-gray-400 text-sm py-8">Belum ada layanan.</div>}
          <div className="space-y-16">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  {service.highlight && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#00BCEF]/10 text-[#00BCEF] text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                      <span aria-hidden>✦</span>
                      <span>{service.highlight}</span>
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                      <service.icon size={20} className="text-white" />
                    </div>
                    {service.tagline && <span className="text-gray-400 text-sm">{service.tagline}</span>}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#1C2237] mb-4">{service.title}</h2>
                  <p className="text-gray-500 leading-relaxed mb-6">{service.description}</p>

                  {service.features.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {service.features.map((f) => (
                        <div key={f} className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-[#00BCEF] mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{f}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {service.timeline && (
                    <div className="flex items-center gap-3 p-3 bg-[#F8F8FD] rounded-xl mb-6 w-fit">
                      <Clock size={16} className="text-[#3D35A8]" />
                      <span className="text-sm text-[#1C2237] font-medium">Estimasi: {service.timeline}</span>
                    </div>
                  )}

                  <a
                    href={`${waUrl}&text=Halo%2C+saya+tertarik+dengan+layanan+${encodeURIComponent(service.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#3D35A8]/30 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Konsultasi via WhatsApp
                    <ArrowRight size={18} />
                  </a>
                </div>

                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <motion.div whileHover={{ scale: 1.02 }} className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${service.color} p-8 h-[300px] flex flex-col justify-between`}>
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-10 translate-x-10" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-black/10 translate-y-10 -translate-x-10" />

                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                        <service.icon size={32} className="text-white" />
                      </div>
                      <h3 className="text-white font-bold text-2xl">{service.title}</h3>
                    </div>

                    <div className="relative z-10 space-y-2">
                      {(service.previewFeatures.length > 0 ? service.previewFeatures : service.features).slice(0, 3).map((f) => (
                        <div key={f} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                          <span className="text-white/80 text-sm">{f}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-28 bg-[#F8F8FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Proses Kerja" title="Bagaimana Kami Bekerja?" subtitle="Proses transparan dan terstruktur untuk hasil terbaik" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF]" />

            {[
              { step: "01", title: "Konsultasi", desc: "Diskusikan kebutuhan dan jurnal Anda dengan tim kami via WhatsApp" },
              { step: "02", title: "Analisis", desc: "Kami menganalisis naskah dan memberikan estimasi waktu & biaya" },
              { step: "03", title: "Pengerjaan", desc: "Tim ahli kami mengerjakan jurnal sesuai standar yang disepakati" },
              { step: "04", title: "Revisi & Final", desc: "Review bersama dan finalisasi hingga Anda puas dengan hasilnya" },
            ].map((step, i) => (
              <motion.div key={step.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] flex items-center justify-center mx-auto mb-4 relative z-10 text-white font-bold text-xl shadow-lg shadow-[#3D35A8]/30">{step.step}</div>
                <h3 className="font-bold text-[#1C2237] mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-white mb-4">Tidak Yakin Layanan Mana yang Tepat?</h2>
            <p className="text-white/80 mb-8">Konsultasikan kebutuhan Anda dan kami akan merekomendasikan solusi terbaik — gratis!</p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#3D35A8] rounded-2xl font-bold hover:shadow-xl hover:shadow-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              Chat WhatsApp Sekarang <ArrowRight size={20} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
