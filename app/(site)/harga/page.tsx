"use client";

import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, ArrowRight, Star, Zap, X } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { useEffect, useMemo, useState } from "react";

const waUrl = "/api/wa?text=";

type PublicProduct = {
  id: string;
  name: string;
  price: string;
  priceAmount: number;
  description: string;
  features: string[];
  notIncluded?: string[];
  badge: string;
  popular: boolean;
};

type PublicLane = {
  id: string;
  name: string;
  description: string;
  priceText: string;
  priceAmount: number;
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
  priceAmount: number;
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
  const priceAmount = typeof v.priceAmount === "number" ? v.priceAmount : 0;
  const description = typeof v.description === "string" ? v.description : String(v.description ?? "");
  const badge = typeof v.badge === "string" ? v.badge : String(v.badge ?? "");
  const popular = Boolean(v.popular);
  const features = Array.isArray(v.features) ? v.features.filter((x): x is string => typeof x === "string" && x.trim().length > 0) : [];
  const notIncluded = Array.isArray(v.notIncluded) ? v.notIncluded.filter((x): x is string => typeof x === "string" && x.trim().length > 0) : [];

  if (!id || !name) return null;
  return { id, name, price, priceAmount, description, features, notIncluded, badge, popular };
}

function normalizeLane(v: unknown): PublicLane | null {
  if (!isRecord(v)) return null;
  const id = typeof v.id === "string" ? v.id : String(v.id ?? "");
  const name = typeof v.name === "string" ? v.name : String(v.name ?? "");
  const description = typeof v.description === "string" ? v.description : String(v.description ?? "");
  const priceText = typeof v.priceText === "string" ? v.priceText : String(v.priceText ?? "");
  const priceAmount = typeof v.priceAmount === "number" ? v.priceAmount : 0;
  if (!id || !name) return null;
  return { id, name, description, priceText, priceAmount };
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

const planColors = [
  { border: "border-[#8B7EC8]", headerColor: "bg-[#F8F8FD]", textColor: "text-[#3D35A8]", buttonClass: "border-2 border-[#3D35A8] text-[#3D35A8] hover:bg-[#3D35A8] hover:text-white" },
  { border: "border-[#3D35A8]", headerColor: "bg-gradient-to-br from-[#3D35A8] to-[#5B50C8]", textColor: "text-white", buttonClass: "bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white hover:shadow-lg hover:shadow-[#3D35A8]/40" },
  { border: "border-[#00BCEF]", headerColor: "bg-gradient-to-br from-[#1C2237] to-[#2A1F5C]", textColor: "text-white", buttonClass: "bg-gradient-to-r from-[#00BCEF] to-[#3D35A8] text-white hover:shadow-lg hover:shadow-[#00BCEF]/40" },
  { border: "border-[#F59E0B]", headerColor: "bg-gradient-to-br from-[#F59E0B] to-[#D97706]", textColor: "text-white", buttonClass: "bg-gradient-to-r from-[#F59E0B] to-[#B45309] text-white hover:shadow-lg hover:shadow-[#F59E0B]/40" },
];

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);
  const [plans, setPlans] = useState<UiPlan[]>([]);
  const [lanes, setLanes] = useState<PublicLane[]>([]);

  // Order Modal State
  const [selectedPlan, setSelectedPlan] = useState<UiPlan | null>(null);
  const [selectedLaneId, setSelectedLaneId] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load products");
        const json = (await res.json()) as unknown;
        if (!Array.isArray(json)) throw new Error("Invalid response");

        const normalized = json.map(normalizeProduct).filter((p): p is PublicProduct => p !== null);
        const mapped: UiPlan[] = normalized.map((p, index) => {
          const badge = p.badge?.trim() ? p.badge.trim() : p.popular ? "Paling Populer" : null;
          const colorObj = planColors[index % planColors.length];

          return {
            id: p.id,
            name: p.name,
            badge,
            popular: p.popular,
            color: colorObj.border,
            headerColor: p.popular ? "bg-gradient-to-br from-[#3D35A8] to-[#5B50C8]" : colorObj.headerColor,
            textColor: p.popular ? "text-white" : colorObj.textColor,
            buttonClass: p.popular ? "bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white hover:shadow-lg" : colorObj.buttonClass,
            price: p.price,
            priceAmount: p.priceAmount,
            priceNote: "per naskah",
            description: p.description,
            features: p.features,
            notIncluded: p.notIncluded ?? [],
          };
        });

        if (alive && mapped.length > 0) setPlans(mapped);
      } catch {
        // empty
      } finally {
        if (alive) setLoadingPlans(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/lanes", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as unknown;
        if (!Array.isArray(json)) return;

        const normalized = json.map(normalizeLane).filter((p): p is PublicLane => p !== null);
        if (alive && normalized.length > 0) {
          setLanes(normalized);
          setSelectedLaneId(normalized[0].id); // default select first lane
        }
      } catch {
        // empty
      }
    })();
    return () => { alive = false; };
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
      } catch { }
    })();
    return () => { alive = false; };
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  };

  const getWaLink = () => {
    if (!selectedPlan) return waUrl;
    const lane = lanes.find(l => l.id === selectedLaneId);
    const laneName = lane ? lane.name : "";
    const total = selectedPlan.priceAmount + (lane ? lane.priceAmount : 0);
    const text = `Halo, saya tertarik dengan paket ${selectedPlan.name}${laneName ? ` dengan jalur ${laneName}` : ""}. Estimasi Total: ${formatRupiah(total)}.`;
    return `/api/wa?text=${encodeURIComponent(text)}`;
  };

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
                    <button
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold transition-all duration-300 hover:-translate-y-0.5 ${plan.buttonClass}`}
                    >
                      Pilih Paket Ini
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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

      {/* Order Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-xl text-[#1C2237]">Pilih Jalur Publikasi</h3>
                <button onClick={() => setSelectedPlan(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-gray-500 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-[#F8F8FD] to-[#F0EEFF] border border-[#3D35A8]/10">
                  <p className="text-xs text-gray-500 font-medium mb-1">Paket Terpilih</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#3D35A8] text-lg">{selectedPlan.name}</span>
                    <span className="font-semibold text-gray-700">{formatRupiah(selectedPlan.priceAmount)}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Tersedia {lanes.length} Jalur:</p>
                  {lanes.map((lane) => (
                    <label key={lane.id} className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedLaneId === lane.id ? "border-[#00BCEF] bg-[#00BCEF]/5" : "border-[#E8E8EE] hover:border-[#3D35A8]/30"}`}>
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedLaneId === lane.id ? "border-[#00BCEF]" : "border-gray-300"}`}>
                          {selectedLaneId === lane.id && <div className="w-2.5 h-2.5 rounded-full bg-[#00BCEF]" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-[#1C2237]">{lane.name}</span>
                            <span className={`font-semibold text-sm ${lane.priceAmount > 0 ? "text-[#3D35A8]" : "text-green-600"}`}>{lane.priceText}</span>
                          </div>
                          <p className="text-xs text-gray-500">{lane.description}</p>
                        </div>
                      </div>
                      <input type="radio" name="lane" value={lane.id} checked={selectedLaneId === lane.id} onChange={() => setSelectedLaneId(lane.id)} className="hidden" />
                    </label>
                  ))}
                </div>

                <div className="bg-[#1C2237] rounded-2xl p-5 text-white">
                  <p className="text-sm text-white/70 mb-1">Total Estimasi Harga</p>
                  <div className="text-3xl font-bold text-[#00BCEF] mb-4">
                    {formatRupiah(selectedPlan.priceAmount + (lanes.find(l => l.id === selectedLaneId)?.priceAmount || 0))}
                  </div>
                  <a href={getWaLink()} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3.5 bg-gradient-to-r from-[#00BCEF] to-[#3D35A8] rounded-xl font-bold shadow-lg hover:shadow-[#00BCEF]/40 transition-shadow">
                    Lanjutkan ke WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
