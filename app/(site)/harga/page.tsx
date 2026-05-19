"use client";

import { motion } from "motion/react";
import { CheckCircle, ArrowRight, Star, Zap } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { useEffect, useMemo, useState } from "react";

const waUrl = "/api/wa?text=Halo%2C+saya+tertarik+dengan+paket+";

type PublicProduct = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  notIncluded?: string[];
  badge: string;
  popular: boolean;
};

type UiPlan = {
  id: string;
  name: string;
  badge: string | null;
  popular: boolean;
  color: string;
  headerColor: string;
  textColor: string;
  buttonClass: string;
  price: string;
  priceNote: string;
  description: string;
  features: string[];
  notIncluded: string[];
};

type PublicFaq = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

type PublicComparisonRow = {
  id: string;
  feature: string;
  values: Array<boolean | string>;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
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
  const notIncluded = Array.isArray(v.notIncluded) ? v.notIncluded.filter((x): x is string => typeof x === "string" && x.trim().length > 0) : [];

  if (!id || !name) return null;
  return { id, name, price, description, features, notIncluded, badge, popular };
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

function normalizeComparisonRow(v: unknown): PublicComparisonRow | null {
  if (!isRecord(v)) return null;

  const id = typeof v.id === "string" ? v.id : String(v.id ?? "");
  const feature = typeof v.feature === "string" ? v.feature : String(v.feature ?? "");
  const values = Array.isArray(v.values)
    ? v.values
        .filter((x): x is boolean | string => typeof x === "boolean" || typeof x === "string")
        .map((x) => (typeof x === "string" ? x.trim() : x))
        .map((x) => (typeof x === "string" && !x ? false : x))
    : [];

  if (!id || !feature.trim()) return null;
  return { id, feature: feature.trim(), values };
}

const fallbackPlans: UiPlan[] = [
  {
    id: "basic",
    name: "Basic",
    badge: null,
    popular: false,
    color: "border-[#8B7EC8]",
    headerColor: "bg-[#F8F8FD]",
    textColor: "text-[#3D35A8]",
    buttonClass: "border-2 border-[#3D35A8] text-[#3D35A8] hover:bg-[#3D35A8] hover:text-white",
    price: "Rp 350.000",
    priceNote: "per naskah",
    description: "Ideal untuk jurnal yang sudah siap dengan koreksi dasar",
    features: ["Editing grammar & struktur dasar", "Proofreading menyeluruh", "1x revisi gratis", "Format referensi dasar", "Feedback umum", "Estimasi 3–5 hari kerja"],
    notIncluded: ["Formatting template jurnal", "Translasi", "Konsultasi jurnal target"],
  },
  {
    id: "standard",
    name: "Standard",
    badge: "Paling Populer",
    popular: true,
    color: "border-[#3D35A8]",
    headerColor: "bg-gradient-to-br from-[#3D35A8] to-[#5B50C8]",
    textColor: "text-white",
    buttonClass: "bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white hover:shadow-lg hover:shadow-[#3D35A8]/40",
    price: "Rp 750.000",
    priceNote: "per naskah",
    description: "Paket lengkap editing dan formatting siap submit",
    features: [
      "Editing mendalam & grammar",
      "Academic tone improvement",
      "2x revisi gratis",
      "Formatting template jurnal",
      "Sitasi APA/IEEE/Vancouver",
      "Formatting tabel & gambar",
      "Konsultasi singkat jurnal target",
      "Estimasi 5–7 hari kerja",
    ],
    notIncluded: ["Translasi bahasa", "Pendampingan submit"],
  },
  {
    id: "premium",
    name: "Premium",
    badge: "Terlengkap",
    popular: false,
    color: "border-[#00BCEF]",
    headerColor: "bg-gradient-to-br from-[#1C2237] to-[#2A1F5C]",
    textColor: "text-white",
    buttonClass: "bg-gradient-to-r from-[#00BCEF] to-[#3D35A8] text-white hover:shadow-lg hover:shadow-[#00BCEF]/40",
    price: "Rp 1.500.000",
    priceNote: "per naskah",
    description: "Full service dari editing hingga jurnal diterima",
    features: [
      "Full editing & proofreading",
      "Academic tone & clarity",
      "Revisi intensif (unlimited)",
      "Formatting lengkap",
      "Translasi jika diperlukan",
      "Konsultasi jurnal target",
      "Cover letter profesional",
      "Pendampingan upload & submit",
      "Respon revisi reviewer",
      "Follow-up hingga accepted",
    ],
    notIncluded: [],
  },
];

const fallbackFaqs = [
  {
    q: "Apakah harga bisa disesuaikan dengan kebutuhan?",
    a: "Ya, kami juga menyediakan paket custom sesuai kebutuhan spesifik Anda. Hubungi kami via WhatsApp untuk diskusi lebih lanjut.",
  },
  {
    q: "Bagaimana metode pembayaran?",
    a: "Kami menerima transfer bank, e-wallet (GoPay, OVO, Dana), dan virtual account. DP 50% di awal, pelunasan setelah selesai.",
  },
  {
    q: "Apakah ada garansi jika jurnal ditolak?",
    a: "Untuk paket Premium, kami menyediakan pendampingan revisi setelah penolakan tanpa biaya tambahan.",
  },
  {
    q: "Berapa lama estimasi penyelesaian?",
    a: "Basic: 3–5 hari, Standard: 5–7 hari, Premium: 7–14 hari tergantung panjang naskah dan kompleksitas.",
  },
];

const fallbackComparisonRows: Array<Omit<PublicComparisonRow, "id"> & { id: string }> = [
  { id: "1", feature: "Editing & Proofreading", values: [true, true, true] },
  { id: "2", feature: "Academic Tone", values: ["Dasar", true, true] },
  { id: "3", feature: "Jumlah Revisi", values: ["1x", "2x", "Unlimited"] },
  { id: "4", feature: "Formatting Template", values: [false, true, true] },
  { id: "5", feature: "Sitasi & Referensi", values: ["Dasar", true, true] },
  { id: "6", feature: "Tabel & Gambar", values: [false, true, true] },
  { id: "7", feature: "Translasi", values: [false, false, "Opsional"] },
  { id: "8", feature: "Konsultasi Jurnal Target", values: [false, "Singkat", true] },
  { id: "9", feature: "Cover Letter", values: [false, false, true] },
  { id: "10", feature: "Pendampingan Submit", values: [false, false, true] },
  { id: "11", feature: "Revisi Reviewer", values: [false, false, true] },
];

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const [faqs, setFaqs] = useState(fallbackFaqs);

  const fallbackByName = useMemo(() => {
    const m = new Map<string, UiPlan>();
    for (const p of fallbackPlans) m.set(p.name.toLowerCase(), p);
    return m;
  }, []);

  const [plans, setPlans] = useState<UiPlan[]>(fallbackPlans);
  const [comparisonRows, setComparisonRows] = useState<PublicComparisonRow[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load products");
        const json = (await res.json()) as unknown;
        if (!Array.isArray(json)) throw new Error("Invalid response");

        const normalized = json.map(normalizeProduct).filter((p): p is PublicProduct => p !== null);
        const mapped: UiPlan[] = normalized.map((p) => {
          const fb = fallbackByName.get(p.name.toLowerCase());
          const badge = p.badge?.trim() ? p.badge.trim() : p.popular ? "Paling Populer" : (fb?.badge ?? null);

          return {
            id: p.id,
            name: p.name,
            badge,
            popular: p.popular,
            color: fb?.color ?? "border-[#3D35A8]",
            headerColor: fb?.headerColor ?? "bg-[#F8F8FD]",
            textColor: fb?.textColor ?? "text-[#1C2237]",
            buttonClass: fb?.buttonClass ?? "border-2 border-[#3D35A8] text-[#3D35A8] hover:bg-[#3D35A8] hover:text-white",
            price: p.price || fb?.price || "",
            priceNote: fb?.priceNote ?? "per naskah",
            description: p.description || fb?.description || "",
            features: p.features.length > 0 ? p.features : (fb?.features ?? []),
            notIncluded: (p.notIncluded?.length ?? 0) > 0 ? (p.notIncluded as string[]) : (fb?.notIncluded ?? []),
          };
        });

        if (alive && mapped.length > 0) setPlans(mapped);
      } catch {
        // keep fallback
      } finally {
        if (alive) setLoadingPlans(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [fallbackByName]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/pricing-comparison", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load comparison rows");
        const json = (await res.json()) as unknown;
        if (!Array.isArray(json)) throw new Error("Invalid response");

        const normalized = json.map(normalizeComparisonRow).filter((r): r is PublicComparisonRow => r !== null);

        if (alive) setComparisonRows(normalized);
      } catch {
        if (alive) setComparisonRows(fallbackComparisonRows);
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
        const res = await fetch("/api/faqs?category=pricing", { cache: "no-store" });
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
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#1C2237] via-[#2A1F5C] to-[#1C2237] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(61,53,168,0.3) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-6">
            Harga <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BCEF] to-[#8B7EC8]">Transparan</span> & Terjangkau
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/70 text-lg">
            Pilih paket yang sesuai kebutuhan Anda. Semua paket sudah termasuk garansi kepuasan.
          </motion.p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#F8F8FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loadingPlans && <div className="text-center text-gray-400 text-sm pb-8">Memuat paket...</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`relative rounded-3xl border-2 ${plan.color} overflow-hidden shadow-lg ${plan.popular ? `${plan.headerColor} scale-105 shadow-2xl shadow-[#3D35A8]/20` : "bg-white"} flex flex-col`}
              >
                {plan.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${plan.popular ? "bg-[#00BCEF] text-white" : "bg-[#F59E0B] text-white"}`}>
                      {plan.popular && <Star size={10} fill="white" />}
                      {plan.badge === "Terlengkap" && <Zap size={10} />}
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className={`${plan.headerColor} p-8`}>
                  <h3 className={`font-bold text-2xl mb-2 ${plan.textColor}`}>{plan.name}</h3>
                  <p className={`text-sm mb-6 ${plan.textColor === "text-white" ? "text-white/70" : "text-gray-500"}`}>{plan.description}</p>
                  <div className={plan.textColor}>
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className={`text-sm ml-2 ${plan.textColor === "text-white" ? "text-white/60" : "text-gray-400"}`}>{plan.priceNote}</span>
                  </div>
                </div>

                <div className={`p-8 flex-1 flex flex-col ${plan.popular ? "text-white" : ""}`}>
                  <div className="space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <CheckCircle size={16} className="text-[#00BCEF] mt-0.5 flex-shrink-0" />
                        <span className={`${plan.popular ? "text-white/85" : "text-gray-700"} text-sm`}>{f}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((f) => (
                      <div key={f} className="flex items-start gap-3 opacity-40">
                        <div className={`w-4 h-4 rounded-full border-2 ${plan.popular ? "border-white/30" : "border-gray-300"} mt-0.5 flex-shrink-0`} />
                        <span className={`${plan.popular ? "text-white/50" : "text-gray-400"} text-sm line-through`}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <a
                      href={`${waUrl}${encodeURIComponent(plan.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold transition-all duration-300 hover:-translate-y-0.5 ${plan.buttonClass}`}
                    >
                      Pesan via WhatsApp
                      <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-10 text-center">
            <p className="text-gray-500 text-sm">
              💡 Butuh paket custom?{" "}
              <a href={waUrl + "Custom"} target="_blank" rel="noopener noreferrer" className="text-[#3D35A8] font-semibold hover:underline">
                Hubungi kami untuk penawaran khusus
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Perbandingan" title="Apa yang Termasuk di Setiap Paket?" />

          {comparisonRows.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">Belum ada data perbandingan.</div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#E8E8EE] shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8F8FD]">
                    <th className="text-left px-6 py-4 text-[#1C2237] font-semibold text-sm">Fitur</th>
                    {plans.map((p) => (
                      <th key={p.id} className="px-6 py-4 text-center text-sm">
                        <span className={`font-bold ${p.badge === "Paling Populer" ? "text-[#3D35A8]" : "text-[#1C2237]"}`}>{p.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}>
                      <td className="px-6 py-3.5 text-gray-700 text-sm font-medium border-t border-[#E8E8EE]">{row.feature}</td>
                      {plans.map((_, j) => {
                        const val = row.values[j] ?? false;
                        return (
                          <td key={j} className="px-6 py-3.5 text-center border-t border-[#E8E8EE]">
                            {val === true ? (
                              <CheckCircle size={18} className="text-[#00BCEF] mx-auto" />
                            ) : val === false ? (
                              <div className="w-4 h-0.5 bg-gray-200 mx-auto" />
                            ) : (
                              <span className="text-xs text-[#3D35A8] font-medium bg-[#3D35A8]/10 px-2 py-0.5 rounded-full">{val}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#F8F8FD]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="FAQ" title="Pertanyaan yang Sering Ditanyakan" />

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl border border-[#E8E8EE] overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left px-6 py-5 flex items-center justify-between">
                  <span className="font-semibold text-[#1C2237] text-sm pr-4">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }}>
                    <div className="w-6 h-6 rounded-full bg-[#3D35A8]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#3D35A8] font-bold text-sm">+</span>
                    </div>
                  </motion.div>
                </button>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-5">
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
