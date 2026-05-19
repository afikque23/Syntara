"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, X, ChevronDown, ChevronUp, GripVertical, Star, Clock, Zap, Eye, Loader2 } from "lucide-react";
import { type AdminService } from "@/lib/admin/adminData";

const DEFAULT_SERVICE_COLOR = "from-[#3D35A8] to-[#00BCEF]";

const ICONS = [
  { key: "Edit3", label: "Edit" },
  { key: "FileText", label: "Dokumen" },
  { key: "Globe", label: "Global" },
  { key: "MessageSquare", label: "Konsultasi" },
  { key: "Send", label: "Submit" },
  { key: "BookOpen", label: "Buku" },
  { key: "Award", label: "Award" },
  { key: "CheckCircle", label: "Check" },
];

const emptyForm: Omit<AdminService, "id"> = {
  name: "",
  tagline: "",
  description: "",
  icon: "FileText",
  estimasi: "",
  color: DEFAULT_SERVICE_COLOR,
  features: [""],
  previewFeatures: [""],
  highlight: "",
};

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{children}</label>;
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10 bg-white"
    />
  );
}

function ServiceModal({ initial, onSave, onClose }: { initial?: AdminService; onSave: (d: Omit<AdminService, "id">) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<AdminService, "id">>(() => {
    if (initial) {
      const features = Array.isArray(initial.features) && initial.features.length > 0 ? [...initial.features] : [""];
      const previewFeatures = Array.isArray(initial.previewFeatures) && initial.previewFeatures.length > 0 ? [...initial.previewFeatures] : [""];
      return {
        name: initial.name ?? "",
        tagline: (initial.tagline ?? "") as string,
        description: initial.description ?? "",
        icon: initial.icon ?? "FileText",
        estimasi: initial.estimasi ?? "",
        color: initial.color ?? DEFAULT_SERVICE_COLOR,
        features,
        previewFeatures,
        highlight: (initial.highlight ?? "") as string,
      };
    }
    return { ...emptyForm, features: [""], previewFeatures: [""] };
  });

  const [err, setErr] = useState<string>("");

  const setField = <K extends keyof Omit<AdminService, "id">>(k: K, v: Omit<AdminService, "id">[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
  };

  const setFeature = (i: number, v: string) => {
    const next = [...(form.features ?? [])];
    next[i] = v;
    setField("features", next);
  };

  const setPreviewFeature = (i: number, v: string) => {
    const next = [...(form.previewFeatures ?? [])];
    next[i] = v;
    setField("previewFeatures", next);
  };

  const addFeature = () => setField("features", [...(form.features ?? []), ""]);
  const removeFeature = (i: number) => {
    const current = form.features ?? [];
    if (current.length <= 1) return;
    setField(
      "features",
      current.filter((_, idx) => idx !== i),
    );
  };

  const addPreviewFeature = () => setField("previewFeatures", [...(form.previewFeatures ?? []), ""]);
  const removePreviewFeature = (i: number) => {
    const current = form.previewFeatures ?? [];
    if (current.length <= 1) return;
    setField(
      "previewFeatures",
      current.filter((_, idx) => idx !== i),
    );
  };

  const handleSave = () => {
    const name = String(form.name ?? "").trim();
    const description = String(form.description ?? "").trim();

    if (!name) {
      setErr("Nama layanan wajib diisi");
      return;
    }
    if (!description) {
      setErr("Deskripsi wajib diisi");
      return;
    }

    const clean: Omit<AdminService, "id"> = {
      ...form,
      name,
      tagline: String(form.tagline ?? ""),
      description,
      icon: String(form.icon ?? ""),
      estimasi: String(form.estimasi ?? ""),
      highlight: String(form.highlight ?? ""),
      color: String(form.color ?? DEFAULT_SERVICE_COLOR),
      features: Array.isArray(form.features) ? form.features.map((f) => f.trim()).filter(Boolean) : [],
      previewFeatures: Array.isArray(form.previewFeatures) ? form.previewFeatures.map((f) => f.trim()).filter(Boolean) : [],
    };

    onSave(clean);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
        <div className="h-1 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] rounded-t-2xl" />

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-[#1C2237]">{initial ? "Edit Layanan" : "Tambah Layanan Baru"}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Perubahan langsung tampil di halaman Layanan publik</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div>
            <Label>Nama Layanan *</Label>
            <Input value={String(form.name ?? "")} onChange={(v) => setField("name", v)} placeholder="Editing & Proofreading" />
          </div>

          <div>
            <Label>Tagline / Slogan</Label>
            <Input value={String(form.tagline ?? "")} onChange={(v) => setField("tagline", v)} placeholder="Sempurnakan Tulisan Akademik Anda" />
            <p className="text-[10px] text-slate-400 mt-1">Muncul di bawah ikon layanan di halaman publik</p>
          </div>

          <div>
            <Label>Deskripsi *</Label>
            <textarea
              value={String(form.description ?? "")}
              onChange={(e) => setField("description", e.target.value)}
              rows={3}
              placeholder="Deskripsi layanan yang ditampilkan di website..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Estimasi Waktu</Label>
              <Input value={String(form.estimasi ?? "")} onChange={(v) => setField("estimasi", v)} placeholder="3–5 hari kerja" />
            </div>
            <div>
              <Label>Badge Highlight</Label>
              <Input value={String(form.highlight ?? "")} onChange={(v) => setField("highlight", v)} placeholder="Paling Diminati" />
              <p className="text-[10px] text-slate-400 mt-1">Kosongkan jika tidak ada badge</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Fitur (Centang)</Label>
              <button onClick={addFeature} className="flex items-center gap-1 text-[#3D35A8] text-xs font-semibold hover:underline">
                <Plus size={12} /> Tambah
              </button>
            </div>
            <div className="space-y-2">
              {(form.features ?? [""]).map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <GripVertical size={14} className="text-slate-300 shrink-0" />
                  <input
                    value={f}
                    onChange={(e) => setFeature(i, e.target.value)}
                    placeholder={`Fitur ${i + 1}...`}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10"
                  />
                  <button
                    onClick={() => removeFeature(i)}
                    disabled={(form.features ?? []).length <= 1}
                    className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors shrink-0 disabled:opacity-30"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">{(form.features ?? []).filter((f) => f.trim()).length} fitur akan ditampilkan di website</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Fitur (Bulat / Preview Kartu)</Label>
              <button onClick={addPreviewFeature} className="flex items-center gap-1 text-[#3D35A8] text-xs font-semibold hover:underline">
                <Plus size={12} /> Tambah
              </button>
            </div>
            <div className="space-y-2">
              {(form.previewFeatures ?? [""]).map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <GripVertical size={14} className="text-slate-300 shrink-0" />
                  <input
                    value={f}
                    onChange={(e) => setPreviewFeature(i, e.target.value)}
                    placeholder={`Preview ${i + 1}...`}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10"
                  />
                  <button
                    onClick={() => removePreviewFeature(i)}
                    disabled={(form.previewFeatures ?? []).length <= 1}
                    className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors shrink-0 disabled:opacity-30"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">{(form.previewFeatures ?? []).filter((f) => f.trim()).length} item akan ditampilkan di kartu (bulat)</p>
          </div>

          <div>
            <Label>Ikon Layanan</Label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic.key}
                  onClick={() => setField("icon", ic.key)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    form.icon === ic.key ? "bg-[#3D35A8] text-white border-[#3D35A8]" : "border-slate-200 text-slate-500 hover:border-[#3D35A8] hover:text-[#3D35A8]"
                  }`}
                >
                  {ic.label}
                </button>
              ))}
            </div>
          </div>

          {err && <p className="text-red-500 text-xs -mt-2">{err}</p>}
        </div>

        <div className="flex gap-3 p-6 pt-4 border-t border-slate-100">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-gray-600 hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white rounded-xl text-sm font-semibold hover:shadow-md transition-all">
            {initial ? "Simpan Perubahan" : "Tambah Layanan"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ServiceCard({ s, onEdit, onDelete }: { s: AdminService; onEdit: () => void; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const features = Array.isArray(s.features) ? s.features : [];
  const color = (s.color ?? "").trim() ? s.color : DEFAULT_SERVICE_COLOR;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group">
      <div className={`h-1.5 bg-gradient-to-r ${color}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
              <span className="text-white text-base font-bold">{String(s.name ?? "").slice(0, 1)}</span>
            </div>
            <div>
              <h3 className="font-bold text-[#1C2237] text-sm leading-tight">{s.name}</h3>
              {s.tagline && <p className="text-[#3D35A8] text-xs mt-0.5">{s.tagline}</p>}
            </div>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="w-8 h-8 rounded-lg bg-[#3D35A8]/10 flex items-center justify-center text-[#3D35A8] hover:bg-[#3D35A8]/20 transition-colors" aria-label="Edit">
              <Pencil size={13} />
            </button>
            <button onClick={onDelete} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors" aria-label="Hapus">
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {s.highlight && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#00BCEF]/10 text-[#00BCEF] text-[10px] font-bold rounded-full uppercase tracking-wide">
              <Star size={9} /> {s.highlight}
            </span>
          )}
          {s.estimasi && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full font-medium">
              <Clock size={9} /> {s.estimasi}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full font-medium">
            <Zap size={9} /> {features.length} fitur
          </span>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{s.description}</p>

        {features.length > 0 && (
          <>
            <button onClick={() => setExpanded((e) => !e)} className="flex items-center gap-1 text-[#3D35A8] text-xs font-medium hover:underline">
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {expanded ? "Sembunyikan" : "Lihat"} fitur ({features.length})
            </button>

            {expanded && (
              <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00BCEF] mt-1.5 shrink-0" />
                    <span className="text-xs text-gray-600">{f}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; item?: AdminService }>({ open: false });

  useEffect(() => {
    fetch("/api/admin/services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setServices(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const sorted = useMemo(() => [...services].sort((a, b) => (a.name || "").localeCompare(b.name || "")), [services]);

  const handleSave = async (data: Omit<AdminService, "id">) => {
    const name = data.name.trim();
    const tagline = String(data.tagline ?? "").trim();
    const description = data.description.trim();
    const icon = String(data.icon ?? "").trim();
    const estimasi = String(data.estimasi ?? "").trim();
    const highlightRaw = String(data.highlight ?? "").trim();
    const highlight = highlightRaw ? highlightRaw : null;
    const features = Array.isArray(data.features) ? data.features.map((f) => f.trim()).filter(Boolean) : [];
    const previewFeatures = Array.isArray(data.previewFeatures) ? data.previewFeatures.map((f) => f.trim()).filter(Boolean) : [];

    const payload = { name, tagline, highlight, description, icon, estimasi, color: data.color || DEFAULT_SERVICE_COLOR, features, previewFeatures };

    try {
      if (modal.item) {
        const res = await fetch(`/api/admin/services/${modal.item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        } else {
          alert("Gagal menyimpan perubahan layanan");
        }
      } else {
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setServices((prev) => [...prev, created]);
        } else {
          alert("Gagal menambah layanan baru");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus layanan ini? Tindakan ini tidak bisa dibatalkan.")) {
      try {
        const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
        if (res.ok) {
          setServices((prev) => prev.filter((s) => s.id !== id));
        } else {
          alert("Gagal menghapus layanan");
        }
      } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat menghapus");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="animate-spin text-[#3D35A8]" size={32} />
        <p className="text-sm font-medium">Memuat data layanan...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#1C2237]">Manajemen Layanan</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {services.length} layanan aktif · data langsung tampil di halaman{" "}
            <a href="/layanan" target="_blank" rel="noopener noreferrer" className="text-[#3D35A8] hover:underline inline-flex items-center gap-1">
              /layanan <Eye size={11} />
            </a>
          </p>
        </div>
        <button
          onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white rounded-xl text-sm font-semibold hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <Plus size={16} />
          Tambah Layanan
        </button>
      </div>

      <div className="mb-5 flex items-start gap-3 p-3.5 bg-[#3D35A8]/5 border border-[#3D35A8]/15 rounded-xl">
        <Eye size={15} className="text-[#3D35A8] mt-0.5 shrink-0" />
        <p className="text-xs text-[#3D35A8]/80 leading-relaxed">
          Setiap layanan mencakup: <strong>nama</strong>, <strong>tagline</strong>, <strong>deskripsi</strong>, <strong>estimasi waktu</strong>, <strong>badge highlight</strong>, dan <strong>daftar fitur</strong> yang akan ditampilkan di
          halaman Layanan publik.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <ServiceCard s={s} onEdit={() => setModal({ open: true, item: s })} onDelete={() => handleDelete(s.id)} />
          </motion.div>
        ))}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: services.length * 0.06 }}
          onClick={() => setModal({ open: true })}
          className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-[#3D35A8] hover:text-[#3D35A8] transition-all duration-200 min-h-[180px] group"
        >
          <div className="w-10 h-10 rounded-xl border-2 border-dashed border-current flex items-center justify-center group-hover:bg-[#3D35A8]/5">
            <Plus size={20} />
          </div>
          <span className="text-sm font-medium">Tambah Layanan Baru</span>
        </motion.button>
      </div>

      <AnimatePresence>{modal.open && <ServiceModal initial={modal.item} onSave={handleSave} onClose={() => setModal({ open: false })} />}</AnimatePresence>
    </div>
  );
}
