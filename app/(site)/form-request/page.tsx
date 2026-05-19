"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { Send, CheckCircle, Upload, X } from "lucide-react";

const waUrl = "/api/wa";

type PublicService = {
  id: string;
  name: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function normalizeService(v: unknown): PublicService | null {
  if (!isRecord(v)) return null;
  const id = typeof v.id === "string" ? v.id : String(v.id ?? "");
  const name = typeof v.name === "string" ? v.name : String(v.name ?? "");
  if (!id || !name) return null;
  return { id, name };
}

const extraOptions = ["Paket Basic", "Paket Standard", "Paket Premium", "Lainnya"];

const fallbackServiceNames = ["Editing & Proofreading", "Formatting Jurnal", "Translasi Akademik", "Konsultasi Jurnal", "Pendampingan Submit"];

export default function FormRequest() {
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    service: "",
    note: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [serviceNames, setServiceNames] = useState<string[]>(fallbackServiceNames);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as unknown;
        if (!Array.isArray(json)) return;
        const normalized = json.map(normalizeService).filter((s): s is PublicService => s !== null);
        const names = normalized.map((s) => s.name).filter(Boolean);
        if (alive && names.length > 0) setServiceNames(names);
      } catch {
        // keep fallback
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const services = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const v of [...serviceNames, ...extraOptions]) {
      const key = v.trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(key);
    }
    return out;
  }, [serviceNames]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanDigits = (v: string) => v.replace(/\D+/g, "");
    const waDigits = cleanDigits(form.whatsapp);
    const waE164 = waDigits ? `62${waDigits.replace(/^0+/, "")}` : "";

    // Save lead to backend (best-effort; WhatsApp flow should still continue).
    try {
      await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          whatsapp: waE164 || form.whatsapp,
          email: form.email,
          service: form.service,
          notes: form.note,
        }),
      });
    } catch {
      // ignore
    }

    const msg = `Halo Syntara! Saya ingin mengajukan request layanan:%0A%0A*Nama:* ${encodeURIComponent(form.name)}%0A*WhatsApp:* ${encodeURIComponent(form.whatsapp)}%0A*Email:* ${encodeURIComponent(form.email)}%0A*Layanan:* ${encodeURIComponent(form.service)}%0A*Catatan:* ${encodeURIComponent(form.note || "-")}%0A%0ATerima kasih!`;
    setSubmitted(true);
    setTimeout(() => {
      window.open(`${waUrl}?text=${msg}`, "_blank");
    }, 1500);
  };

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
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-6">
            Form <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BCEF] to-[#8B7EC8]">Request Layanan</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/70 text-lg">
            Isi form di bawah ini dan tim kami akan menghubungi Anda dalam 1×24 jam
          </motion.p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 md:py-24 bg-[#F8F8FD]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {!submitted ? (
            <motion.form initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-[#3D35A8]/5 border border-[#E8E8EE] overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] px-8 py-6">
                <h2 className="text-white font-bold text-xl">Data Permintaan Layanan</h2>
                <p className="text-white/70 text-sm mt-1">Semua field bertanda * wajib diisi</p>
              </div>

              <div className="p-8 space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#1C2237] mb-2">Nama Lengkap *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E8EE] bg-[#F8F8FD] text-[#1C2237] placeholder-gray-400 focus:outline-none focus:border-[#3D35A8] transition-colors text-sm"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-semibold text-[#1C2237] mb-2">Nomor WhatsApp *</label>
                  <div className="flex">
                    <span className="flex items-center px-4 bg-[#E8E8EE] border-2 border-r-0 border-[#E8E8EE] rounded-l-xl text-gray-500 text-sm">+62</span>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={form.whatsapp}
                      onChange={handleChange}
                      required
                      placeholder="8123456789"
                      className="flex-1 px-4 py-3 rounded-r-xl border-2 border-[#E8E8EE] bg-[#F8F8FD] text-[#1C2237] placeholder-gray-400 focus:outline-none focus:border-[#3D35A8] transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#1C2237] mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="email@institusi.ac.id"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E8EE] bg-[#F8F8FD] text-[#1C2237] placeholder-gray-400 focus:outline-none focus:border-[#3D35A8] transition-colors text-sm"
                  />
                </div>

                {/* Service */}
                <div>
                  <label className="block text-sm font-semibold text-[#1C2237] mb-2">Jenis Layanan *</label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E8EE] bg-[#F8F8FD] text-[#1C2237] focus:outline-none focus:border-[#3D35A8] transition-colors text-sm"
                  >
                    <option value="">-- Pilih Layanan --</option>
                    {services.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-[#1C2237] mb-2">Upload File Jurnal (Opsional)</label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${dragOver ? "border-[#3D35A8] bg-[#3D35A8]/5" : "border-[#E8E8EE] bg-[#F8F8FD] hover:border-[#3D35A8]/50"}`}
                  >
                    {file ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 bg-[#3D35A8]/10 rounded-lg flex items-center justify-center">
                          <Upload size={18} className="text-[#3D35A8]" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-[#1C2237]">{file.name}</p>
                          <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button type="button" onClick={() => setFile(null)} className="ml-2 text-gray-400 hover:text-red-500 transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload size={28} className="text-[#3D35A8]/40 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 mb-1">Drag & drop file atau</p>
                        <label className="cursor-pointer text-[#3D35A8] text-sm font-semibold hover:underline">
                          Klik untuk memilih file
                          <input type="file" onChange={handleFileChange} accept=".doc,.docx,.pdf,.tex" className="hidden" />
                        </label>
                        <p className="text-xs text-gray-400 mt-2">DOC, DOCX, PDF, LaTeX (Max 20MB)</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-semibold text-[#1C2237] mb-2">Catatan Tambahan</label>
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Ceritakan kebutuhan jurnal Anda secara lebih detail (jurnal target, deadline, dll.)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E8EE] bg-[#F8F8FD] text-[#1C2237] placeholder-gray-400 focus:outline-none focus:border-[#3D35A8] transition-colors text-sm resize-none"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-[#3D35A8]/30 transition-all duration-300"
                >
                  <Send size={20} />
                  Kirim Request & Lanjut ke WhatsApp
                </motion.button>

                <p className="text-xs text-gray-400 text-center">Data Anda aman dan hanya digunakan untuk keperluan layanan Syntara</p>
              </div>
            </motion.form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-xl p-12 text-center border border-[#E8E8EE]">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-500" />
              </motion.div>
              <h2 className="text-2xl font-bold text-[#1C2237] mb-3">Request Terkirim! 🎉</h2>
              <p className="text-gray-500 mb-2">
                Terima kasih, <strong>{form.name}</strong>!
              </p>
              <p className="text-gray-500 text-sm mb-8">Anda akan segera diarahkan ke WhatsApp kami. Tim Syntara akan segera menghubungi Anda.</p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5 }} className="bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] h-1.5 rounded-full" />
              </div>
              <p className="text-xs text-gray-400">Mengarahkan ke WhatsApp...</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
