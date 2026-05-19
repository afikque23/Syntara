"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle, Target, Eye, Heart, ArrowRight, Users, Award, Globe } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const teamImage =
  "https://images.unsplash.com/photo-1710000758934-297ed00b31ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFtJTIwYWNhZGVtaWMlMjBvZmZpY2V8ZW58MXx8fHwxNzc1NzAwMDU4fDA&ixlib=rb-4.1.0&q=80&w=1080";

const waUrl = "/api/wa?text=Halo%2C+saya+ingin+konsultasi+terkait+publikasi+jurnal";

type AboutTeamMember = {
  name: string;
  role: string;
  expertise: string;
  avatar: string;
  color: string;
  bio: string;
};

const DEFAULT_TEAM_COLOR = "from-[#3D35A8] to-[#00BCEF]";

type AboutMilestone = {
  year: string;
  event: string;
};

type AboutStatsItem = { val: string; label: string };

type AboutData = {
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  storyBadge: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyBullets: string[];
  storyImage: string;
  stats: AboutStatsItem[];
  team: AboutTeamMember[];
  milestones: AboutMilestone[];
  visionDesc: string;
  missionDesc: string;
  valuesDesc: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function normalizeTeamMember(v: unknown): AboutTeamMember | null {
  if (!isRecord(v)) return null;
  const name = typeof v.name === "string" ? v.name : "";
  const role = typeof v.role === "string" ? v.role : "";
  const expertise = typeof v.expertise === "string" ? v.expertise : "";
  const avatar = typeof v.avatar === "string" ? v.avatar : "";
  const color = typeof v.color === "string" ? v.color : "";
  const bio = typeof v.bio === "string" ? v.bio : "";
  if (!name.trim() || !role.trim()) return null;
  return { name, role, expertise, avatar, color, bio };
}

function normalizeMilestone(v: unknown): AboutMilestone | null {
  if (!isRecord(v)) return null;
  const year = typeof v.year === "string" ? v.year : "";
  const event = typeof v.event === "string" ? v.event : "";
  if (!year.trim() || !event.trim()) return null;
  return { year, event };
}

function normalizeStatsItem(v: unknown): AboutStatsItem | null {
  if (!isRecord(v)) return null;
  const val = typeof v.val === "string" ? v.val : "";
  const label = typeof v.label === "string" ? v.label : "";
  if (!val.trim() || !label.trim()) return null;
  return { val, label };
}

function normalizeAboutData(v: unknown): Partial<AboutData> | null {
  if (!isRecord(v)) return null;
  const out: Partial<AboutData> = {};

  if (typeof v.heroTitle === "string") out.heroTitle = v.heroTitle;
  if (typeof v.heroHighlight === "string") out.heroHighlight = v.heroHighlight;
  if (typeof v.heroSubtitle === "string") out.heroSubtitle = v.heroSubtitle;

  if (typeof v.storyBadge === "string") out.storyBadge = v.storyBadge;
  if (typeof v.storyTitle === "string") out.storyTitle = v.storyTitle;

  if (Array.isArray(v.storyParagraphs)) {
    const storyParagraphs = v.storyParagraphs.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
    if (storyParagraphs.length > 0) out.storyParagraphs = storyParagraphs;
  }
  if (Array.isArray(v.storyBullets)) {
    const storyBullets = v.storyBullets.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
    if (storyBullets.length > 0) out.storyBullets = storyBullets;
  }

  if (typeof v.storyImage === "string") out.storyImage = v.storyImage;

  if (Array.isArray(v.stats)) {
    const stats = v.stats.map(normalizeStatsItem).filter((x): x is AboutStatsItem => x !== null);
    if (stats.length > 0) out.stats = stats;
  }
  if (Array.isArray(v.team)) {
    const team = v.team.map(normalizeTeamMember).filter((x): x is AboutTeamMember => x !== null);
    // If API provides an empty array, it means "no team" (override fallback).
    out.team = team;
  }
  if (Array.isArray(v.milestones)) {
    const milestones = v.milestones.map(normalizeMilestone).filter((x): x is AboutMilestone => x !== null);
    if (milestones.length > 0) out.milestones = milestones;
  }

  if (typeof v.visionDesc === "string") out.visionDesc = v.visionDesc;
  if (typeof v.missionDesc === "string") out.missionDesc = v.missionDesc;
  if (typeof v.valuesDesc === "string") out.valuesDesc = v.valuesDesc;

  return Object.keys(out).length > 0 ? out : null;
}

const fallbackMilestones: AboutMilestone[] = [
  { year: "2020", event: "Syntara didirikan dengan fokus editing jurnal" },
  { year: "2021", event: "100 jurnal pertama berhasil dipublikasikan di Scopus" },
  { year: "2022", event: "Ekspansi layanan: translasi dan pendampingan submit" },
  { year: "2023", event: "Mencapai 300+ klien dengan tingkat kepuasan 98%" },
  { year: "2024", event: "Peluncuran platform digital Syntara" },
  { year: "2026", event: "500+ jurnal, melayani seluruh Indonesia" },
];

const fallbackAboutData: AboutData = {
  heroTitle: "Tentang",
  heroHighlight: "Syntara",
  heroSubtitle: "Platform terpercaya yang membantu peneliti dan akademisi Indonesia mempublikasikan karya ilmiah mereka ke jurnal internasional bereputasi",
  storyBadge: "Kisah Kami",
  storyTitle: "Bermula dari Keprihatinan terhadap Peneliti Indonesia",
  storyParagraphs: [
    "Syntara lahir dari keprihatinan mendalam terhadap banyaknya peneliti Indonesia yang memiliki hasil penelitian berkualitas, namun kesulitan mempublikasikannya di jurnal internasional bereputasi karena hambatan teknis seperti bahasa, format, dan prosedur submission.",
    "Didirikan pada 2020 oleh tim akademisi berpengalaman, Syntara hadir sebagai jembatan antara peneliti Indonesia dengan panggung publikasi ilmiah dunia. Kami percaya bahwa karya penelitian yang baik seharusnya bisa diakses dan diakui secara global.",
  ],
  storyBullets: [
    "Tim dengan latar belakang doktoral di berbagai bidang",
    "Pengalaman langsung sebagai penulis & reviewer jurnal internasional",
    "Jaringan dengan penerbit Scopus, WoS, dan Elsevier",
    "Pendekatan personal dan konsultatif untuk setiap klien",
  ],
  storyImage: teamImage,
  stats: [
    { val: "500+", label: "Jurnal" },
    { val: "300+", label: "Klien" },
    { val: "98%", label: "Sukses" },
    { val: "4.9★", label: "Rating" },
  ],
  team: [],
  milestones: fallbackMilestones,
  visionDesc: "Menjadi platform publikasi jurnal ilmiah terdepan di Indonesia yang membantu peneliti menembus batas geografis dan menghadirkan karya terbaik mereka ke panggung ilmu pengetahuan dunia.",
  missionDesc: "Menyediakan layanan profesional, terjangkau, dan inklusif yang memudahkan setiap peneliti Indonesia — dari mahasiswa hingga profesor — untuk mempublikasikan karya ilmiah berkualitas tinggi.",
  valuesDesc: "Integritas, profesionalisme, dan dedikasi penuh terhadap keberhasilan klien. Kami tidak sekadar mengerjakan — kami peduli pada setiap naskah seperti karya kami sendiri.",
};

export default function About() {
  const [data, setData] = useState<AboutData>(fallbackAboutData);

  const visionMissionValues = useMemo(
    () => [
      {
        icon: Eye,
        title: "Visi",
        color: "from-[#3D35A8] to-[#5B50C8]",
        desc: data.visionDesc,
      },
      {
        icon: Target,
        title: "Misi",
        color: "from-[#00BCEF] to-[#0099CC]",
        desc: data.missionDesc,
      },
      {
        icon: Heart,
        title: "Nilai",
        color: "from-[#8B7EC8] to-[#3D35A8]",
        desc: data.valuesDesc,
      },
    ],
    [data.missionDesc, data.valuesDesc, data.visionDesc],
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/about", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as unknown;
        const normalized = normalizeAboutData(json);
        if (!normalized) return;

        if (alive) {
          setData((prev) => ({
            ...prev,
            ...normalized,
            team: normalized.team ?? prev.team,
            milestones: normalized.milestones ?? prev.milestones,
            stats: normalized.stats ?? prev.stats,
            storyParagraphs: normalized.storyParagraphs ?? prev.storyParagraphs,
            storyBullets: normalized.storyBullets ?? prev.storyBullets,
            storyImage: normalized.storyImage ?? prev.storyImage,
          }));
        }
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
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,188,239,0.15) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-6">
            {data.heroTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BCEF] to-[#8B7EC8]">{data.heroHighlight}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/70 text-lg max-w-2xl mx-auto">
            {data.heroSubtitle}
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-block px-4 py-1.5 bg-[#3D35A8]/10 text-[#3D35A8] rounded-full text-sm font-semibold mb-4">{data.storyBadge}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1C2237] mb-6 leading-tight">{data.storyTitle}</h2>
              {data.storyParagraphs[0] && <p className="text-gray-500 leading-relaxed mb-4">{data.storyParagraphs[0]}</p>}
              {data.storyParagraphs[1] && <p className="text-gray-500 leading-relaxed mb-6">{data.storyParagraphs[1]}</p>}
              <ul className="space-y-3">
                {data.storyBullets.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-[#00BCEF] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="rounded-3xl overflow-hidden">
                <img src={data.storyImage || teamImage} alt="Syntara Team" className="w-full h-[420px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#3D35A8]/30 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 max-w-[200px]">
                <div className="grid grid-cols-2 gap-3">
                  {data.stats.map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="text-lg font-bold text-[#3D35A8]">{s.val}</div>
                      <div className="text-gray-400 text-xs">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 md:py-24 bg-[#F8F8FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visionMissionValues.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-2xl border border-[#E8E8EE] overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className={`bg-gradient-to-br ${item.color} p-6 flex items-center gap-3`}>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <item.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl">{item.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {data.team.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-[#3D35A8]/10 text-[#3D35A8] rounded-full text-sm font-semibold mb-4">Tim Kami</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1C2237] mb-4">Para Ahli di Balik Syntara</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Tim multidisiplin yang berdedikasi untuk kesuksesan publikasi jurnal Anda</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-[#F8F8FD] rounded-2xl border border-[#E8E8EE] overflow-hidden text-center group transition-all duration-300 hover:shadow-lg hover:shadow-[#3D35A8]/10"
                >
                  <div className={`bg-gradient-to-br ${DEFAULT_TEAM_COLOR} h-24 flex items-end justify-center pb-2 relative`}>
                    <div className="absolute -bottom-8 w-16 h-16 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${DEFAULT_TEAM_COLOR} flex items-center justify-center text-white font-bold`}>{member.avatar}</div>
                    </div>
                  </div>
                  <div className="pt-10 pb-6 px-4">
                    <h3 className="font-bold text-[#1C2237] text-sm">{member.name}</h3>
                    <p className="text-[#3D35A8] text-xs font-medium mt-1">{member.role}</p>
                    <span className="inline-block mt-2 px-2.5 py-1 bg-[#3D35A8]/10 text-[#3D35A8] text-xs rounded-full">{member.expertise}</span>
                    <p className="text-gray-400 text-xs mt-3 leading-relaxed">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-[#F8F8FD]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1C2237] mb-4">Perjalanan Syntara</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#3D35A8] to-[#00BCEF]" />
            <div className="space-y-8">
              {data.milestones.map((m, i) => (
                <motion.div key={m.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-6 pl-16 relative">
                  <div className="absolute left-3 top-1.5 w-6 h-6 rounded-full bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] border-2 border-white shadow-md flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#00BCEF] bg-[#00BCEF]/10 px-2.5 py-1 rounded-full">{m.year}</span>
                    <p className="text-[#1C2237] font-medium mt-2 text-sm">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Bergabunglah dengan Komunitas Syntara</h2>
          <p className="text-white/80 mb-8">Mari bersama-sama memajukan riset dan publikasi ilmiah Indonesia</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#3D35A8] rounded-2xl font-bold hover:shadow-xl transition-all hover:-translate-y-1">
              Mulai Konsultasi <ArrowRight size={20} />
            </a>
            <Link href="/kontak" className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 border border-white/30 text-white rounded-2xl font-bold hover:bg-white/30 transition-all">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
