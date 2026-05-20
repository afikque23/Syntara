"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Save, LayoutTemplate, Loader2, Check, Plus, Trash2 } from "lucide-react";

export default function AdminHeroPage() {
  const [form, setForm] = useState({
    badge: "",
    heading: "",
    headingHighlight: "",
    headingSuffix: "",
    description: "",
    stat1Value: "",
    stat1Label: "",
    stat2Label: "",
    stat3Value: "",
    stat3Label: "",
    stat4Value: "",
    stat4Label: "",
    featuresBadge: "",
    featuresTitle: "",
    featuresSubtitle: "",
  });

  const [featuresItems, setFeaturesItems] = useState<{ icon: string; title: string; desc: string }[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch("/api/admin/hero");
        if (res.ok) {
          const data = await res.json();
          setForm({
            badge: data.badge || "",
            heading: data.heading || "",
            headingHighlight: data.headingHighlight || "",
            headingSuffix: data.headingSuffix || "",
            description: data.description || "",
            stat1Value: data.stat1Value || "",
            stat1Label: data.stat1Label || "",
            stat2Label: data.stat2Label || "",
            stat3Value: data.stat3Value || "",
            stat3Label: data.stat3Label || "",
            stat4Value: data.stat4Value || "",
            stat4Label: data.stat4Label || "",
            featuresBadge: data.featuresBadge || "",
            featuresTitle: data.featuresTitle || "",
            featuresSubtitle: data.featuresSubtitle || "",
          });
          setFeaturesItems(Array.isArray(data.featuresItems) ? data.featuresItems : []);
        } else {
          setError("Gagal mengambil data hero.");
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat memuat data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHero();
  }, []);

  const save = async () => {
    setIsSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, featuresItems }),
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan data hero");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addFeature = () => {
    setFeaturesItems([...featuresItems, { icon: "CheckCircle", title: "Fitur Baru", desc: "Deskripsi singkat mengenai fitur ini." }]);
  };

  const updateFeature = (index: number, key: string, value: string) => {
    const next = [...featuresItems];
    next[index] = { ...next[index], [key]: value };
    setFeaturesItems(next);
  };

  const removeFeature = (index: number) => {
    setFeaturesItems(featuresItems.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="animate-spin text-[#3D35A8]" size={32} />
        <p className="text-sm font-medium">Memuat data hero...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-xl font-black text-[#1C2237]">Manajemen Hero & Fitur</h1>
        <p className="text-slate-400 text-sm">Konfigurasi konten beranda (Hero Section) dan Seksi Solusi</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#3D35A8]/10 flex items-center justify-center text-[#3D35A8]">
                <LayoutTemplate size={18} />
              </div>
              <h2 className="font-semibold text-[#1C2237]">Teks Utama Hero</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">Badge Label</label>
                <input
                  type="text"
                  name="badge"
                  value={form.badge}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D35A8]/30 focus:border-[#3D35A8] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Heading Awal</label>
                  <input
                    type="text"
                    name="heading"
                    value={form.heading}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D35A8]/30 focus:border-[#3D35A8] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#3D35A8] uppercase">Heading Highlight</label>
                  <input
                    type="text"
                    name="headingHighlight"
                    value={form.headingHighlight}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D35A8]/30 focus:border-[#3D35A8] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Heading Akhir</label>
                  <input
                    type="text"
                    name="headingSuffix"
                    value={form.headingSuffix}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D35A8]/30 focus:border-[#3D35A8] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">Deskripsi Paragraf</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D35A8]/30 focus:border-[#3D35A8] transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#3D35A8]/10 flex items-center justify-center text-[#3D35A8]">
                  <LayoutTemplate size={18} />
                </div>
                <h2 className="font-semibold text-[#1C2237]">Seksi Solusi (Mengapa Syntara)</h2>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">Badge Seksi</label>
                <input
                  type="text"
                  name="featuresBadge"
                  value={form.featuresBadge}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D35A8]/30 focus:border-[#3D35A8]"
                  placeholder="Mengapa Syntara?"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">Judul Utama</label>
                <input
                  type="text"
                  name="featuresTitle"
                  value={form.featuresTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D35A8]/30 focus:border-[#3D35A8]"
                  placeholder="Solusi Terbaik untuk Publikasi Jurnal Anda"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">Sub Judul</label>
                <textarea
                  name="featuresSubtitle"
                  value={form.featuresSubtitle}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D35A8]/30 focus:border-[#3D35A8] resize-none"
                  placeholder="Kami menggabungkan keahlian akademik..."
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm text-[#1C2237]">Daftar Poin Solusi</h3>
                  <button onClick={addFeature} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F8FD] text-[#3D35A8] hover:bg-[#3D35A8] hover:text-white rounded-lg text-xs font-medium transition-colors">
                    <Plus size={14} /> Tambah
                  </button>
                </div>
                
                <div className="space-y-3">
                  {featuresItems.map((item, i) => (
                    <div key={i} className="flex gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl relative group">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateFeature(i, "title", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#3D35A8]"
                            placeholder="Judul Poin (e.g. Proses Cepat)"
                          />
                          <input
                            type="text"
                            value={item.icon}
                            onChange={(e) => updateFeature(i, "icon", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#3D35A8]"
                            placeholder="Nama Ikon Lucide (e.g. Zap, Shield)"
                          />
                        </div>
                        <input
                          type="text"
                          value={item.desc}
                          onChange={(e) => updateFeature(i, "desc", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#3D35A8]"
                          placeholder="Deskripsi Poin Singkat"
                        />
                      </div>
                      <button onClick={() => removeFeature(i)} className="text-red-400 hover:bg-red-50 hover:text-red-600 p-2 rounded-lg self-start transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {featuresItems.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-slate-200 border-dashed">Belum ada poin solusi. Klik tombol Tambah untuk membuat.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#3D35A8]/10 flex items-center justify-center text-[#3D35A8]">
                <LayoutTemplate size={18} />
              </div>
              <h2 className="font-semibold text-[#1C2237]">Statistik & Angka</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Stat 1 (Nilai)</label>
                  <input
                    type="text"
                    name="stat1Value"
                    value={form.stat1Value}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D35A8]/30 focus:border-[#3D35A8]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Stat 1 (Label)</label>
                  <input
                    type="text"
                    name="stat1Label"
                    value={form.stat1Label}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D35A8]/30 focus:border-[#3D35A8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Stat 2 (Nilai)</label>
                  <div className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-400 select-none cursor-not-allowed">
                    Otomatis dari Testimoni
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Stat 2 (Label)</label>
                  <input
                    type="text"
                    name="stat2Label"
                    value={form.stat2Label}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D35A8]/30 focus:border-[#3D35A8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Stat 3 (Nilai)</label>
                  <input
                    type="text"
                    name="stat3Value"
                    value={form.stat3Value}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D35A8]/30 focus:border-[#3D35A8]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Stat 3 (Label)</label>
                  <input
                    type="text"
                    name="stat3Label"
                    value={form.stat3Label}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D35A8]/30 focus:border-[#3D35A8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Stat 4 (Nilai)</label>
                  <input
                    type="text"
                    name="stat4Value"
                    value={form.stat4Value}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D35A8]/30 focus:border-[#3D35A8]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Stat 4 (Label)</label>
                  <input
                    type="text"
                    name="stat4Label"
                    value={form.stat4Label}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D35A8]/30 focus:border-[#3D35A8]"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="sticky top-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-[#1C2237] mb-2">Simpan Perubahan</h3>
            {error && <p className="text-red-500 text-xs bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>}
            {success && (
              <div className="flex items-center gap-2 text-emerald-600 text-xs bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                <Check size={14} /> Berhasil disimpan!
              </div>
            )}
            <button
              onClick={save}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3D35A8] hover:bg-[#3230A0] text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
            <p className="text-[11px] text-slate-400 text-center">Perubahan akan langsung terlihat di beranda utama website.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
