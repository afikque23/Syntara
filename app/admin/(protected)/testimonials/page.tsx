"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, X, Star, Upload } from "lucide-react";
import { adminSeed, ds, subscribeAdminChanges, type AdminTestimonial, type AdminTestimonialImage } from "@/lib/admin/adminData";

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10"
      />
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const testimonials = useSyncExternalStore(
    subscribeAdminChanges,
    () => ds.testimonials.all(),
    () => adminSeed.testimonials,
  );

  const testimonialImages = useSyncExternalStore(
    subscribeAdminChanges,
    () => ds.testimonialImages.all(),
    () => adminSeed.testimonialImages,
  );

  const sorted = useMemo(() => [...testimonials].sort((a, b) => (a.name < b.name ? -1 : 1)), [testimonials]);
  const sortedImages = useMemo(() => {
    return [...testimonialImages].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  }, [testimonialImages]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminTestimonial | null>(null);
  const [form, setForm] = useState({ name: "", institution: "", role: "", journal: "", comment: "", rating: "5" });

  const [imgUploading, setImgUploading] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);

  const uploadAndCreateImage = async (file: File) => {
    setImgUploading(true);
    setImgError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/uploads/testimonial-proof", {
        method: "POST",
        body: fd,
      });

      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok) throw new Error(json.error || "Upload gagal");
      if (!json.url) throw new Error("Upload gagal: tidak ada URL");

      ds.testimonialImages.add(json.url);
    } catch (e) {
      setImgError(e instanceof Error ? e.message : "Upload gagal");
    } finally {
      setImgUploading(false);
    }
  };

  const removeImage = (img: AdminTestimonialImage) => {
    if (img.id.startsWith("tmp_")) return;
    ds.testimonialImages.del(img.id);
  };

  const startAdd = () => {
    setEditing(null);
    setForm({ name: "", institution: "", role: "", journal: "", comment: "", rating: "5" });
    setOpen(true);
  };

  const startEdit = (t: AdminTestimonial) => {
    setEditing(t);
    setForm({
      name: t.name,
      institution: t.institution,
      role: t.role,
      journal: t.journal,
      comment: t.comment,
      rating: String(t.rating),
    });
    setOpen(true);
  };

  const save = () => {
    const name = form.name.trim();
    const institution = form.institution.trim();
    const role = form.role.trim();
    const journal = form.journal.trim();
    const comment = form.comment.trim();
    const rating = Math.max(1, Math.min(5, Number(form.rating) || 5));
    if (!name || !comment) return;

    if (editing) {
      ds.testimonials.update(editing.id, { name, institution, role, journal, comment, rating });
    } else {
      ds.testimonials.add({ name, institution, role, journal, comment, rating });
    }

    setOpen(false);
  };

  const remove = (id: string) => ds.testimonials.del(id);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#1C2237]">Testimoni</h1>
          <p className="text-slate-400 text-sm">Kelola testimoni yang tampil di halaman publik</p>
        </div>
        <button onClick={startAdd} className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white font-bold hover:shadow-lg hover:shadow-[#3D35A8]/25 transition-shadow">
          <Plus size={17} />
          Tambah Testimoni
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sorted.map((t) => (
          <motion.div key={t.id} whileHover={{ y: -2 }} className="bg-white rounded-3xl shadow-sm border border-slate-200/70 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-[#8B7EC8]/15 flex items-center justify-center">
                    <Star size={16} className="text-[#6A5FB0]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-[#1C2237] truncate">{t.name}</p>
                    <p className="text-slate-400 text-sm truncate">
                      {t.role}
                      {t.institution ? ` • ${t.institution}` : ""}
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mt-3">{t.comment}</p>
                {t.journal && <p className="text-slate-400 text-xs mt-2">{t.journal}</p>}

                <div className="flex items-center gap-1 mt-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button onClick={() => startEdit(t)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
                  <Pencil size={16} />
                </button>
                <button onClick={() => remove(t.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {sorted.length === 0 && <div className="text-slate-400 text-sm">Belum ada testimoni.</div>}
      </div>

      <div className="pt-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-[#1C2237]">Testimoni Gambar</h2>
            <p className="text-slate-400 text-sm">Upload screenshot bukti/testimoni (hanya gambar)</p>
          </div>

          <label
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-bold transition-shadow ${
              imgUploading ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white hover:shadow-lg hover:shadow-[#3D35A8]/25 cursor-pointer"
            }`}
          >
            <Upload size={17} />
            {imgUploading ? "Mengupload..." : "Upload Gambar"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={imgUploading}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadAndCreateImage(file);
                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>

        {imgError && <div className="mt-3 text-sm text-red-600">{imgError}</div>}

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedImages.map((img) => (
            <motion.div key={img.id} whileHover={{ y: -2 }} className="bg-white rounded-3xl shadow-sm border border-slate-200/70 overflow-hidden">
              <div className="aspect-[4/3] bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.imageUrl} alt="Testimoni gambar" className="w-full h-full object-cover" />
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <p className="text-xs text-slate-400 truncate">{img.imageUrl}</p>
                <button onClick={() => removeImage(img)} className="p-2 rounded-xl hover:bg-red-50 text-red-500" aria-label="Hapus">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
          {sortedImages.length === 0 && <div className="text-slate-400 text-sm">Belum ada gambar.</div>}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 inset-0 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                  <p className="font-black text-[#1C2237]">{editing ? "Edit Testimoni" : "Tambah Testimoni"}</p>
                  <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Nama" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
                  <Field label="Institusi" value={form.institution} onChange={(v) => setForm((p) => ({ ...p, institution: v }))} placeholder="Contoh: Universitas Indonesia" />
                  <Field label="Role" value={form.role} onChange={(v) => setForm((p) => ({ ...p, role: v }))} />
                  <Field label="Jurnal" value={form.journal} onChange={(v) => setForm((p) => ({ ...p, journal: v }))} placeholder="Contoh: Scopus Q1" />

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Konten</label>
                    <textarea
                      value={form.comment}
                      onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
                      className="w-full min-h-28 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10"
                    />
                  </div>
                  <Field label="Rating (1-5)" value={form.rating} onChange={(v) => setForm((p) => ({ ...p, rating: v }))} type="number" />

                  <div className="md:col-span-2 flex items-center justify-end gap-2 pt-1">
                    <button onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors">
                      Batal
                    </button>
                    <button onClick={save} className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white font-bold hover:shadow-lg hover:shadow-[#3D35A8]/25 transition-shadow">
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
