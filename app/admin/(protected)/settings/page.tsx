"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Save, Settings, Phone, Mail, Type, Loader2, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    brand: "",
    whatsapp: "",
    email: "",
    instagram: "",
    tagline: "",
    hoursWeekday: "",
    hoursWeekend: "",
    hoursHoliday: "",
    hoursNote: "",
    location: "",
    reach: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setForm(data);
        } else {
          setError("Gagal mengambil data pengaturan.");
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat memuat data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const save = async () => {
    setIsSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: form.brand.trim(),
          whatsapp: form.whatsapp.trim(),
          email: form.email.trim(),
          instagram: form.instagram.trim(),
          tagline: form.tagline.trim(),
          hoursWeekday: form.hoursWeekday.trim(),
          hoursWeekend: form.hoursWeekend.trim(),
          hoursHoliday: form.hoursHoliday.trim(),
          hoursNote: form.hoursNote.trim(),
          location: form.location.trim(),
          reach: form.reach.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan");
      }

      const data = await res.json();
      setForm(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan pengaturan");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="animate-spin text-[#3D35A8]" size={32} />
        <p className="text-sm font-medium">Memuat pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-xl font-black text-[#1C2237]">Pengaturan</h1>
        <p className="text-slate-400 text-sm">Konfigurasi dasar website & kontak</p>
      </motion.div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/70 overflow-hidden">
        <div className="p-5 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#3D35A8]/10 flex items-center justify-center">
              <Settings size={16} className="text-[#3D35A8]" />
            </div>
            <p className="font-black text-[#1C2237]">General</p>
          </div>
          <button 
            onClick={save} 
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white font-bold hover:shadow-lg hover:shadow-[#3D35A8]/25 transition-all disabled:opacity-70"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : success ? <Check size={16} /> : <Save size={16} />}
            {isSaving ? "Menyimpan..." : success ? "Tersimpan!" : "Simpan"}
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {error && (
            <div className="md:col-span-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Brand</label>
            <input
              value={form.brand}
              onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tagline</label>
            <div className="relative">
              <Type size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={form.tagline}
                onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10"
                placeholder="Platform Publikasi Jurnal #1 Indonesia"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Kontak</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10"
                placeholder="hello@..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Telepon / WhatsApp</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={form.whatsapp}
                onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10"
                placeholder="+62..."
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Instagram</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              <input
                value={form.instagram}
                onChange={(e) => setForm((p) => ({ ...p, instagram: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10"
                placeholder="@syntara.id"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/70 overflow-hidden">
        <div className="p-5 border-b border-slate-200/70 flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-orange-500/10 flex items-center justify-center">
            <Settings size={16} className="text-orange-600" />
          </div>
          <p className="font-black text-[#1C2237]">Jam Operasional & Lokasi</p>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jam Kerja (Senin - Jumat)</label>
            <input
              value={form.hoursWeekday}
              onChange={(e) => setForm((p) => ({ ...p, hoursWeekday: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
              placeholder="08.00 - 17.00 WIB"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jam Kerja (Sabtu)</label>
            <input
              value={form.hoursWeekend}
              onChange={(e) => setForm((p) => ({ ...p, hoursWeekend: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
              placeholder="09.00 - 15.00 WIB"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Minggu & Libur</label>
            <input
              value={form.hoursHoliday}
              onChange={(e) => setForm((p) => ({ ...p, hoursHoliday: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
              placeholder="Tutup (WA 24/7)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Catatan Jam Operasional</label>
            <input
              value={form.hoursNote}
              onChange={(e) => setForm((p) => ({ ...p, hoursNote: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
              placeholder="WhatsApp tersedia 24/7..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lokasi Tim</label>
            <input
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
              placeholder="Indonesia (Remote Service)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jangkauan Layanan</label>
            <input
              value={form.reach}
              onChange={(e) => setForm((p) => ({ ...p, reach: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
              placeholder="Seluruh Indonesia & Internasional"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
