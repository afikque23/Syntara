"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Quote, ArrowRight, Send, CheckCircle, User } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";

const waUrl = "/api/wa?text=Halo%2C+saya+ingin+konsultasi+terkait+publikasi+jurnal";

type Testimonial = {
  id: string | number;
  name: string;
  role: string;
  institution: string;
  text: string;
  rating: number;
  service: string;
  journal: string;
  avatar: string;
  color?: string;
  isUser: boolean;
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

type PublicTestimonialImage = {
  id: string;
  imageUrl: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function normalizePublicTestimonial(v: unknown): PublicTestimonial | null {
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

function normalizePublicTestimonialImage(v: unknown): PublicTestimonialImage | null {
  if (!isRecord(v)) return null;
  const id = typeof v.id === "string" ? v.id : String(v.id ?? "");
  const imageUrl = typeof v.imageUrl === "string" ? v.imageUrl : String(v.imageUrl ?? "");
  if (!id || !imageUrl) return null;
  return { id, imageUrl };
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

const initialTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Rahmat Hidayat, S.T., M.T.",
    role: "Dosen Teknik Informatika",
    institution: "Universitas Indonesia",
    text: "Syntara sangat membantu proses publikasi jurnal saya di IEEE Access. Dalam waktu kurang dari seminggu, naskah saya sudah siap submit dengan kualitas editing yang sangat profesional. Sangat direkomendasikan!",
    rating: 5,
    service: "Editing & Formatting",
    journal: "IEEE Access (Q2)",
    avatar: "RH",
    color: "from-[#3D35A8] to-[#5B50C8]",
    isUser: false,
  },
  {
    id: 2,
    name: "Siti Aminah, S.Si., M.Si.",
    role: "Peneliti Senior",
    institution: "BRIN",
    text: "Saya sangat puas dengan layanan Syntara. Tim mereka sangat responsif dan profesional. Proses editing dan formatting berjalan lancar, dan jurnal saya akhirnya diterima di Scopus Q1!",
    rating: 5,
    service: "Full Service Premium",
    journal: "Scopus Q1",
    avatar: "SA",
    color: "from-[#00BCEF] to-[#0099CC]",
    isUser: false,
  },
  {
    id: 3,
    name: "Prof. Dr. Budi Santoso",
    role: "Guru Besar Ilmu Pertanian",
    institution: "Institut Pertanian Bogor",
    text: "Highly recommended! Tim Syntara sangat memahami kebutuhan akademisi. Jurnal saya yang sudah ditolak 2 kali akhirnya diterima setelah direvisi oleh tim Syntara. Luar biasa!",
    rating: 5,
    service: "Editing & Konsultasi",
    journal: "Elsevier (Q2)",
    avatar: "BS",
    color: "from-[#8B7EC8] to-[#3D35A8]",
    isUser: false,
  },
  {
    id: 4,
    name: "Nurhakim, S.Pd., M.Pd.",
    role: "Dosen Pendidikan",
    institution: "Universitas Negeri Makassar",
    text: "Sebagai dosen muda yang baru mulai publikasi internasional, Syntara benar-benar membantu saya memahami proses dan persyaratan publikasi. Konsultasinya gratis dan sangat informatif!",
    rating: 5,
    service: "Konsultasi & Formatting",
    journal: "ERIC Database",
    avatar: "NH",
    color: "from-[#3D35A8] to-[#00BCEF]",
    isUser: false,
  },
  {
    id: 5,
    name: "Dr. Maya Pertiwi, M.Kes.",
    role: "Peneliti Kesehatan",
    institution: "RS Cipto Mangunkusumo",
    text: "Translasi akademik yang dilakukan Syntara sangat berkualitas. Tidak hanya menerjemahkan, mereka juga melakukan academic rewriting yang membuat jurnal saya terasa lebih natural.",
    rating: 5,
    service: "Translasi & Editing",
    journal: "PubMed (Q2)",
    avatar: "MP",
    color: "from-[#5B50C8] to-[#8B7EC8]",
    isUser: false,
  },
  {
    id: 6,
    name: "Faisal Rahman, M.Eng.",
    role: "Research Engineer",
    institution: "PT Pertamina",
    text: "Proses yang cepat dan hasilnya memuaskan! Jurnal teknik saya yang kompleks berhasil diformat sesuai standar IEEE dalam waktu 3 hari. Tim Syntara benar-benar ahli di bidangnya.",
    rating: 5,
    service: "Formatting IEEE",
    journal: "IEEE Transaction",
    avatar: "FR",
    color: "from-[#00BCEF] to-[#3D35A8]",
    isUser: false,
  },
];

const stats = [
  { value: "500+", label: "Jurnal Berhasil" },
  { value: "300+", label: "Klien Puas" },
  { value: "4.9/5", label: "Rating Rata-rata" },
  { value: "98%", label: "Tingkat Keberhasilan" },
];

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((i) => {
        const active = i <= value;
        return (
          <button key={i} type="button" onClick={() => onChange(i)} className="w-10 h-10 rounded-xl border border-[#E8E8EE] bg-white flex items-center justify-center hover:border-[#3D35A8] transition-colors" aria-label={`Rating ${i}`}>
            <Star size={18} className={active ? "text-amber-500 fill-amber-500" : "text-slate-300"} />
          </button>
        );
      })}
    </div>
  );
}

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  const avatarColor = t.color ?? "from-[#3D35A8] to-[#00BCEF]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.03 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl border border-[#E8E8EE] overflow-hidden shadow-xl shadow-[#3D35A8]/5"
    >
      <div className={`h-2 bg-gradient-to-r ${avatarColor}`} />

      <div className="p-6">
        {t.isUser && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#00BCEF]/10 text-[#00BCEF] text-[10px] rounded-full font-semibold mb-4">
            <User size={10} /> Ulasan Baru
          </div>
        )}

        <div className="flex gap-0.5 mb-4">
          {Array.from({ length: t.rating }).map((_, j) => (
            <Star key={j} size={14} fill="#F59E0B" className="text-amber-500" />
          ))}
        </div>

        <Quote size={24} className="text-[#3D35A8]/20 mb-3" />
        <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">“{t.text}”</p>

        {!t.isUser && (
          <div className="flex flex-wrap gap-2 mb-5">
            {t.service && <span className="px-2.5 py-1 bg-[#3D35A8]/10 text-[#3D35A8] text-xs rounded-full font-medium">{t.service}</span>}
            {t.journal && <span className="px-2.5 py-1 bg-[#00BCEF]/10 text-[#00BCEF] text-xs rounded-full font-medium">{t.journal}</span>}
          </div>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-[#E8E8EE]">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-sm`}>{t.avatar || t.name.slice(0, 2).toUpperCase()}</div>
          <div>
            <p className="font-bold text-[#1C2237] text-sm">{t.name}</p>
            <p className="text-gray-400 text-xs">{t.role}</p>
            <p className="text-[#3D35A8] text-xs">{t.institution}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [testimonialImages, setTestimonialImages] = useState<PublicTestimonialImage[]>([]);
  const [form, setForm] = useState({ name: "", role: "", institution: "", rating: 0, text: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const palette = useMemo(() => ["from-[#3D35A8] to-[#5B50C8]", "from-[#00BCEF] to-[#0099CC]", "from-[#8B7EC8] to-[#3D35A8]", "from-[#3D35A8] to-[#00BCEF]", "from-[#5B50C8] to-[#8B7EC8]", "from-[#00BCEF] to-[#3D35A8]"], []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/testimonials", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as unknown;
        if (!Array.isArray(json)) return;

        const normalized = json.map(normalizePublicTestimonial).filter((t): t is PublicTestimonial => t !== null);
        const mapped: Testimonial[] = normalized.map((t, i) => ({
          id: t.id,
          name: t.name,
          role: t.role || "Klien Syntara",
          institution: t.institution || "",
          text: t.comment,
          rating: t.rating,
          service: "",
          journal: t.journal || "",
          avatar: avatarFromName(t.name),
          color: palette[i % palette.length],
          isUser: false,
        }));

        if (!alive || mapped.length === 0) return;
        setTestimonials((prev) => {
          const userOnes = prev.filter((x) => x.isUser);
          return [...userOnes, ...mapped];
        });
      } catch {
        // keep fallback
      }
    })();

    return () => {
      alive = false;
    };
  }, [palette]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/testimonial-images", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as unknown;
        if (!Array.isArray(json)) return;

        const normalized = json.map(normalizePublicTestimonialImage).filter((x): x is PublicTestimonialImage => x !== null);
        if (!alive) return;
        setTestimonialImages(normalized);
      } catch {
        // keep empty
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nama wajib diisi";
    if (!form.text.trim() || form.text.length < 20) e.text = "Ulasan minimal 20 karakter";
    if (form.rating === 0) e.rating = "Berikan rating bintang terlebih dahulu";
    return e;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const newT: Testimonial = {
      id: Date.now(),
      name: form.name,
      role: form.role || "Klien Syntara",
      institution: form.institution || "",
      text: form.text,
      rating: form.rating,
      service: "",
      journal: "",
      avatar: form.name.slice(0, 2).toUpperCase(),
      color: "from-[#00BCEF] to-[#8B7EC8]",
      isUser: true,
    };

    setTestimonials((prev) => [newT, ...prev]);
    setSubmitted(true);
    setForm({ name: "", role: "", institution: "", rating: 0, text: "" });
    setErrors({});
    setTimeout(() => setSubmitted(false), 4000);
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,188,239,0.15) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#00BCEF]/20 border border-[#00BCEF]/30 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00BCEF] animate-pulse" />
            <span className="text-[#00BCEF] text-sm font-medium">300+ Klien Puas</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-white mb-6">
            Kata <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BCEF] to-[#8B7EC8]">Klien Kami</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/70 text-lg max-w-2xl mx-auto mb-12">
            Lebih dari 300 peneliti dan akademisi telah mempercayakan publikasi jurnal mereka kepada Syntara
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-[#00BCEF]">{s.value}</div>
                <div className="text-white/60 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-10 bg-white border-b border-[#E8E8EE]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={28} fill="#F59E0B" className="text-amber-500" />
            ))}
          </div>
          <p className="text-4xl font-bold text-[#1C2237] mb-1">4.9 / 5.0</p>
          <p className="text-gray-500 text-sm">Berdasarkan {testimonials.length}+ ulasan klien nyata</p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#F8F8FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Testimoni Gambar" title="Bukti Nyata dari Klien" subtitle="Kumpulan screenshot testimoni dari klien — hanya gambar" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonialImages.map((img) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl border border-[#E8E8EE] overflow-hidden shadow-xl shadow-[#3D35A8]/5"
              >
                <div className="aspect-[4/3] bg-[#F8F8FD]">
                  <img src={img.imageUrl} alt="Testimoni gambar" className="w-full h-full object-cover" />
                </div>
              </motion.div>
            ))}
            {testimonialImages.length === 0 && <div className="text-gray-400 text-sm">Belum ada testimoni gambar.</div>}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Ulasan Klien" title="Apa yang Mereka Rasakan" subtitle="Pengalaman nyata dari para akademisi dan peneliti yang telah menggunakan layanan Syntara" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.id} t={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#F8F8FD]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Bagikan Pengalaman Anda" title="Tulis Ulasan Anda" subtitle="Sudah pernah menggunakan layanan Syntara? Bantu peneliti lain dengan berbagi pengalaman Anda" />

          <AnimatePresence>
            {submitted && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl mb-6">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-700">Terima kasih! Ulasan Anda berhasil ditambahkan.</p>
                  <p className="text-green-600 text-xs">Ulasan Anda muncul di bagian atas daftar testimoni.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-[#E8E8EE] shadow-xl shadow-[#3D35A8]/5 overflow-hidden"
          >
            <div className="h-1.5 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF]" />
            <div className="p-8">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1C2237] mb-2">
                  Rating Anda <span className="text-red-500">*</span>
                </label>
                <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
                {form.rating > 0 && <span className="text-xs text-gray-400 mt-1 block">{["", "Sangat Buruk", "Buruk", "Cukup", "Bagus", "Sangat Memuaskan"][form.rating]}</span>}
                {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1C2237] mb-1.5">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Dr. Ahmad Fauzi"
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 ${errors.name ? "border-red-400 bg-red-50 focus:border-red-500" : "border-[#E8E8EE] focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10"}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1C2237] mb-1.5">Jabatan / Profesi</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Dosen / Peneliti / Mahasiswa"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E8EE] text-sm outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#1C2237] mb-1.5">Institusi / Universitas</label>
                <input
                  type="text"
                  value={form.institution}
                  onChange={(e) => setForm({ ...form, institution: e.target.value })}
                  placeholder="Universitas Indonesia / BRIN / dll."
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E8EE] text-sm outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10 transition-all duration-200"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1C2237] mb-1.5">
                  Ulasan Anda <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  placeholder="Ceritakan pengalaman Anda menggunakan layanan Syntara — layanan apa yang digunakan, hasilnya, dan kesan Anda secara keseluruhan..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all duration-200 ${errors.text ? "border-red-400 bg-red-50 focus:border-red-500" : "border-[#E8E8EE] focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10"}`}
                />
                <div className="flex justify-between mt-1">
                  {errors.text ? <p className="text-red-500 text-xs">{errors.text}</p> : <span />}
                  <span className={`text-xs ${form.text.length < 20 ? "text-gray-300" : "text-gray-400"}`}>{form.text.length} / 20 karakter min.</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-[#F8F8FD] rounded-xl mb-6">
                <CheckCircle size={15} className="text-[#3D35A8] mt-0.5 flex-shrink-0" />
                <p className="text-gray-500 text-xs">Ulasan Anda akan ditampilkan secara publik di halaman ini. Kami tidak menerima ulasan palsu atau spam. Dengan mengirim, Anda menyetujui tampilan ulasan ini.</p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#3D35A8]/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Send size={16} />
                Kirim Ulasan Saya
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] relative overflow-hidden">
        <motion.div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%)" }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-white mb-4">Jadilah Bagian dari {testimonials.length}+ Klien Puas Syntara</h2>
            <p className="text-white/80 mb-8 text-lg">Mulai perjalanan publikasi jurnal Anda bersama kami hari ini</p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#3D35A8] rounded-2xl font-bold hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:-translate-y-1"
            >
              Konsultasi Gratis Sekarang <ArrowRight size={20} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
