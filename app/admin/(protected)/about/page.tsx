"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Save, CheckCircle2, Eye, Target, Heart, BarChart3, AlignLeft, Plus, Trash2, GripVertical, Info, Clock, RotateCcw, ExternalLink } from "lucide-react";
import { ds, type AboutContent, type AboutMilestone, type AboutStat } from "@/lib/admin/adminData";

const TABS = [
  { key: "hero", label: "Hero & Kisah", icon: AlignLeft },
  { key: "stats", label: "Statistik", icon: BarChart3 },
  { key: "visi", label: "Visi Misi Nilai", icon: Eye },
  { key: "timeline", label: "Timeline", icon: Clock },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{children}</label>;
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-[#1C2237] outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10 bg-white"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-[#1C2237] outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10 resize-none bg-white"
    />
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 ${className}`}>{children}</div>;
}

function SectionTitle({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-white" />
      </div>
      <div>
        <p className="font-bold text-[#1C2237] text-sm">{title}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
    </div>
  );
}

function TabHero({ data, onChange }: { data: AboutContent; onChange: (d: AboutContent) => void }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const set = (path: string[], val: string) => {
    const next = JSON.parse(JSON.stringify(data)) as AboutContent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let obj: any = next;
    for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
    obj[path[path.length - 1]] = val;
    onChange(next);
  };

  const setBullet = (idx: number, val: string) => {
    const next = JSON.parse(JSON.stringify(data)) as AboutContent;
    next.story.bullets[idx] = val;
    onChange(next);
  };

  const addBullet = () => {
    const next = JSON.parse(JSON.stringify(data)) as AboutContent;
    next.story.bullets.push("Poin baru...");
    onChange(next);
  };

  const removeBullet = (idx: number) => {
    const next = JSON.parse(JSON.stringify(data)) as AboutContent;
    next.story.bullets.splice(idx, 1);
    onChange(next);
  };

  const uploadImage = async (file: File) => {
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/uploads/about-image", {
        method: "POST",
        body: fd,
      });

      const json: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = typeof json === "object" && json && "error" in json ? String((json as { error?: unknown }).error ?? "") : "";
        throw new Error(msg || "Upload gagal");
      }

      const url = typeof json === "object" && json && "url" in json ? String((json as { url?: unknown }).url ?? "") : "";
      if (!url) throw new Error("Upload gagal");

      set(["story", "image"], url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle icon={AlignLeft} title="Hero Section" desc="Judul dan subtitle yang tampil di bagian paling atas halaman Tentang Kami" />
        <div className="space-y-4">
          <div>
            <Label>Judul Hero</Label>
            <Input value={data.hero.title} onChange={(v) => set(["hero", "title"], v)} placeholder="Tentang Syntara" />
          </div>
          <div>
            <Label>Subtitle Hero</Label>
            <Textarea value={data.hero.subtitle} onChange={(v) => set(["hero", "subtitle"], v)} placeholder="Deskripsi singkat tentang Syntara..." rows={2} />
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle icon={Info} title="Kisah Kami" desc="Bagian narasi cerita asal-usul Syntara" />
        <div className="space-y-4">
          <div>
            <Label>Heading Kisah</Label>
            <Input value={data.story.heading} onChange={(v) => set(["story", "heading"], v)} placeholder="Bermula dari..." />
          </div>
          <div>
            <Label>Paragraf 1</Label>
            <Textarea value={data.story.paragraph1} onChange={(v) => set(["story", "paragraph1"], v)} rows={4} placeholder="Paragraf pertama cerita Syntara..." />
          </div>
          <div>
            <Label>Paragraf 2</Label>
            <Textarea value={data.story.paragraph2} onChange={(v) => set(["story", "paragraph2"], v)} rows={4} placeholder="Paragraf kedua cerita Syntara..." />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Poin Keunggulan</Label>
              <button onClick={addBullet} className="flex items-center gap-1 text-[#3D35A8] text-xs font-semibold hover:underline">
                <Plus size={12} /> Tambah Poin
              </button>
            </div>
            <div className="space-y-2">
              {data.story.bullets.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <GripVertical size={14} className="text-slate-300 flex-shrink-0" />
                  <input value={b} onChange={(e) => setBullet(i, e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10" />
                  <button onClick={() => removeBullet(i)} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors flex-shrink-0" disabled={data.story.bullets.length <= 1}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label>Gambar Kisah Kami</Label>
            {data.story.image && (
              <div className="relative mb-2 rounded-xl overflow-hidden w-full max-w-sm">
                <img
                  src={data.story.image}
                  alt="preview"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                void uploadImage(file);
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-500 outline-none focus:border-[#3D35A8] focus:ring-1 focus:ring-[#3D35A8]/20 transition-all file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-600 hover:file:bg-slate-200 disabled:opacity-60"
            />
            {uploading && <p className="text-[10px] text-slate-400 mt-1">Mengupload gambar...</p>}
            {uploadError && <p className="text-[10px] text-red-500 mt-1">{uploadError}</p>}
          </div>
        </div>
      </Card>
    </div>
  );
}

function TabStats({ data, onChange }: { data: AboutContent; onChange: (d: AboutContent) => void }) {
  const updateStat = (idx: number, field: keyof AboutStat, val: string) => {
    const next = JSON.parse(JSON.stringify(data)) as AboutContent;
    next.stats[idx][field] = val;
    onChange(next);
  };

  const addStat = () => {
    const next = JSON.parse(JSON.stringify(data)) as AboutContent;
    next.stats.push({ val: "0+", label: "Label Baru" });
    onChange(next);
  };

  const removeStat = (idx: number) => {
    const next = JSON.parse(JSON.stringify(data)) as AboutContent;
    next.stats.splice(idx, 1);
    onChange(next);
  };

  return (
    <Card>
      <SectionTitle icon={BarChart3} title="Statistik & Angka" desc="Angka pencapaian yang tampil di kartu statistik halaman Tentang Kami" />

      <div className="mb-6 p-4 bg-slate-50 rounded-xl">
        <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wide">Preview Kartu Statistik</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.stats.map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-100">
              <div className="text-xl font-bold text-[#3D35A8]">{s.val}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {data.stats.map((s, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i + 1}</div>
            <div className="grid grid-cols-2 gap-2 flex-1">
              <div>
                <p className="text-[10px] text-gray-400 mb-1">Nilai</p>
                <input value={s.val} onChange={(e) => updateStat(i, "val", e.target.value)} placeholder="500+" className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#3D35A8] bg-white" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 mb-1">Label</p>
                <input value={s.label} onChange={(e) => updateStat(i, "label", e.target.value)} placeholder="Jurnal" className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#3D35A8] bg-white" />
              </div>
            </div>
            <button onClick={() => removeStat(i)} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors flex-shrink-0" disabled={data.stats.length <= 1}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        <button onClick={addStat} className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-400 hover:border-[#3D35A8] hover:text-[#3D35A8] transition-colors flex items-center justify-center gap-2">
          <Plus size={14} /> Tambah Statistik
        </button>
      </div>
    </Card>
  );
}

function TabVisi({ data, onChange }: { data: AboutContent; onChange: (d: AboutContent) => void }) {
  const set = (field: "vision" | "mission" | "values", val: string) => {
    onChange({ ...data, [field]: val });
  };

  const cards = [
    { key: "vision" as const, label: "Visi", icon: Eye, color: "from-[#3D35A8] to-[#5B50C8]", hint: "Tujuan jangka panjang Syntara" },
    { key: "mission" as const, label: "Misi", icon: Target, color: "from-[#00BCEF] to-[#0099CC]", hint: "Cara Syntara mencapai visinya" },
    { key: "values" as const, label: "Nilai", icon: Heart, color: "from-[#8B7EC8] to-[#3D35A8]", hint: "Prinsip dan budaya kerja Syntara" },
  ];

  return (
    <div className="space-y-4">
      {cards.map((c) => (
        <Card key={c.key}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center flex-shrink-0`}>
              <c.icon size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-[#1C2237]">{c.label}</p>
              <p className="text-xs text-slate-400">{c.hint}</p>
            </div>
          </div>
          <Textarea value={data[c.key]} onChange={(v) => set(c.key, v)} placeholder={`Isi ${c.label.toLowerCase()} Syntara...`} rows={4} />
        </Card>
      ))}
    </div>
  );
}

function TabTimeline({ data, onChange }: { data: AboutContent; onChange: (d: AboutContent) => void }) {
  const updateMilestone = (idx: number, field: keyof AboutMilestone, val: string) => {
    const next = JSON.parse(JSON.stringify(data)) as AboutContent;
    next.milestones[idx][field] = val;
    onChange(next);
  };

  const addMilestone = () => {
    const next = JSON.parse(JSON.stringify(data)) as AboutContent;
    const currentYear = new Date().getFullYear().toString();
    next.milestones.push({ year: currentYear, event: "Pencapaian baru..." });
    onChange(next);
  };

  const removeMilestone = (idx: number) => {
    const next = JSON.parse(JSON.stringify(data)) as AboutContent;
    next.milestones.splice(idx, 1);
    onChange(next);
  };

  return (
    <Card>
      <SectionTitle icon={Clock} title="Timeline Perjalanan" desc="Milestone dan pencapaian penting Syntara dari tahun ke tahun" />

      <div className="mb-6 p-4 bg-slate-50 rounded-xl max-h-64 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wide">Preview Timeline</p>
        <div className="relative pl-10">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#3D35A8] to-[#00BCEF] rounded-full" />
          <div className="space-y-4">
            {data.milestones.map((m, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] border-2 border-white shadow flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <span className="text-[10px] font-bold text-[#00BCEF] bg-[#00BCEF]/10 px-2 py-0.5 rounded-full">{m.year}</span>
                <p className="text-xs text-[#1C2237] font-medium mt-1">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {data.milestones.map((m, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <GripVertical size={14} className="text-slate-300 flex-shrink-0" />
            <input
              value={m.year}
              onChange={(e) => updateMilestone(i, "year", e.target.value)}
              placeholder="2024"
              className="w-20 px-2.5 py-2 border border-slate-200 rounded-lg text-sm text-center font-bold text-[#3D35A8] outline-none focus:border-[#3D35A8] bg-white flex-shrink-0"
            />
            <input
              value={m.event}
              onChange={(e) => updateMilestone(i, "event", e.target.value)}
              placeholder="Deskripsi pencapaian..."
              className="flex-1 px-2.5 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#3D35A8] bg-white"
            />
            <button onClick={() => removeMilestone(i)} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors flex-shrink-0" disabled={data.milestones.length <= 1}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        <button onClick={addMilestone} className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-400 hover:border-[#3D35A8] hover:text-[#3D35A8] transition-colors flex items-center justify-center gap-2">
          <Plus size={14} /> Tambah Milestone
        </button>
      </div>
    </Card>
  );
}

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutContent>(() => ds.about.get());
  const [savedData, setSavedData] = useState<AboutContent>(() => ds.about.get());
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const [saved, setSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (d: AboutContent) => {
    setData(d);
    setIsDirty(true);
  };

  const handleSave = async () => {
    await ds.about.save(data);
    setSavedData(JSON.parse(JSON.stringify(data)) as AboutContent);
    setSaved(true);
    setIsDirty(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setData(JSON.parse(JSON.stringify(savedData)) as AboutContent);
    setIsDirty(false);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      await ds.about.refresh();
      if (!alive) return;
      const fresh = ds.about.get();
      setData(JSON.parse(JSON.stringify(fresh)) as AboutContent);
      setSavedData(JSON.parse(JSON.stringify(fresh)) as AboutContent);
      setIsDirty(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-[200] flex items-center gap-2 px-4 py-3 bg-[#1C2237] text-white text-sm font-medium rounded-xl shadow-xl"
          >
            <CheckCircle2 size={15} className="text-green-400" /> Halaman Tentang Kami berhasil disimpan!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1C2237]">Manajemen Tentang Kami</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Edit konten halaman <span className="font-medium text-[#3D35A8]">/tentang</span> · Perubahan langsung tampil di website
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isDirty && (
            <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-2.5 border border-slate-200 text-slate-500 text-sm rounded-xl hover:bg-slate-50 transition-colors">
              <RotateCcw size={14} /> Reset
            </button>
          )}
          <a href="/tentang" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2.5 border border-slate-200 text-slate-500 text-sm rounded-xl hover:bg-slate-50 transition-colors">
            <ExternalLink size={14} /> Preview
          </a>
          <button
            onClick={() => void handleSave()}
            disabled={!isDirty}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md ${
              isDirty ? "bg-gradient-to-r from-[#3D35A8] to-[#5B50C8] text-white hover:shadow-[#3D35A8]/30 hover:-translate-y-0.5" : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Save size={15} />
            {saved ? "Tersimpan!" : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      {isDirty && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Ada perubahan yang belum disimpan
        </div>
      )}

      <div className="flex gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === t.key ? "bg-white text-[#3D35A8] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "hero" && <TabHero data={data} onChange={handleChange} />}
        {activeTab === "stats" && <TabStats data={data} onChange={handleChange} />}
        {activeTab === "visi" && <TabVisi data={data} onChange={handleChange} />}
        {activeTab === "timeline" && <TabTimeline data={data} onChange={handleChange} />}
      </div>

      {isDirty && (
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-6 flex items-center justify-between shadow-lg rounded-t-2xl">
          <p className="text-sm text-slate-500">Perubahan belum disimpan</p>
          <div className="flex gap-2">
            <button onClick={handleReset} className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50">
              Batal
            </button>
            <button onClick={() => void handleSave()} className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#3D35A8] to-[#5B50C8] text-white rounded-xl text-sm font-semibold shadow-md">
              <Save size={14} /> Simpan Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
