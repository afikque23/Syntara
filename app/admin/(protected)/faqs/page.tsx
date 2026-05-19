"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, Pencil, Plus, Trash2, X } from "lucide-react";
import { adminSeed, ds, subscribeAdminChanges, type AdminFaq } from "@/lib/admin/adminData";

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

function TextAreaField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10 resize-y"
      />
    </div>
  );
}

function toIntOrZero(v: string): number {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
}

export default function AdminFaqsPage() {
  const faqs = useSyncExternalStore(
    subscribeAdminChanges,
    () => ds.faq.all(),
    () => adminSeed.faqs,
  );

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminFaq | null>(null);
  const [form, setForm] = useState({
    category: "general",
    sortOrder: "0",
    published: true,
    question: "",
    answer: "",
  });

  const sorted = useMemo(() => {
    return [...faqs].sort((a, b) => {
      const d = a.sortOrder - b.sortOrder;
      if (d !== 0) return d;
      return String(a.createdAt).localeCompare(String(b.createdAt));
    });
  }, [faqs]);

  const startAdd = () => {
    setEditing(null);
    setForm({ category: "general", sortOrder: "0", published: true, question: "", answer: "" });
    setOpen(true);
  };

  const startEdit = (f: AdminFaq) => {
    setEditing(f);
    setForm({
      category: String(f.category ?? "general"),
      sortOrder: String(typeof f.sortOrder === "number" ? f.sortOrder : 0),
      published: !!f.published,
      question: f.question,
      answer: f.answer,
    });
    setOpen(true);
  };

  const save = () => {
    const question = form.question.trim();
    const answer = form.answer.trim();
    const category = form.category.trim() || "general";
    const sortOrder = toIntOrZero(form.sortOrder);
    const published = !!form.published;

    if (!question || !answer) return;

    if (editing) {
      ds.faq.update(editing.id, { question, answer, category, sortOrder, published });
    } else {
      ds.faq.add({ question, answer, category, sortOrder, published });
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    ds.faq.del(id);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#1C2237]">Manajemen FAQ</h1>
          <p className="text-slate-400 text-sm">Kelola pertanyaan yang tampil di halaman publik</p>
        </div>
        <button onClick={startAdd} className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white font-bold hover:shadow-lg hover:shadow-[#3D35A8]/25 transition-shadow">
          <Plus size={17} />
          Tambah FAQ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sorted.map((f) => (
          <motion.div key={f.id} whileHover={{ y: -2 }} className="bg-white rounded-3xl shadow-sm border border-slate-200/70 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-[#3D35A8]/10 flex items-center justify-center">
                    <HelpCircle size={16} className="text-[#3D35A8]" />
                  </div>
                  <p className="font-black text-[#1C2237] truncate">{f.question}</p>
                </div>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">Kategori: {f.category || "general"}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">Urutan: {String(f.sortOrder ?? 0)}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${f.published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{f.published ? "Aktif" : "Nonaktif"}</span>
                </div>
                <p className="text-slate-500 text-sm mt-3 line-clamp-3">{f.answer}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => startEdit(f)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500" aria-label="Edit">
                  <Pencil size={16} />
                </button>
                <button onClick={() => remove(f.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-500" aria-label="Hapus">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {sorted.length === 0 && <div className="text-slate-400 text-sm">Belum ada FAQ.</div>}
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
              <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                  <p className="font-black text-[#1C2237]">{editing ? "Edit FAQ" : "Tambah FAQ"}</p>
                  <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
                    <X size={16} />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Kategori" value={form.category} onChange={(v) => setForm((p) => ({ ...p, category: v }))} placeholder="general" />
                    <Field label="Urutan" type="number" value={form.sortOrder} onChange={(v) => setForm((p) => ({ ...p, sortOrder: v }))} placeholder="0" />
                    <div className="flex items-end">
                      <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <input type="checkbox" checked={form.published} onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))} className="accent-[#3D35A8]" />
                        Aktif
                      </label>
                    </div>
                  </div>

                  <Field label="Pertanyaan" value={form.question} onChange={(v) => setForm((p) => ({ ...p, question: v }))} placeholder="Contoh: Berapa lama proses layanan?" />
                  <TextAreaField label="Jawaban" value={form.answer} onChange={(v) => setForm((p) => ({ ...p, answer: v }))} placeholder="Tulis jawaban FAQ di sini" />

                  <div className="flex items-center justify-end gap-2 pt-2">
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
