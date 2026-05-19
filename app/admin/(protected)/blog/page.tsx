"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  Save,
  Star,
  Clock,
  Calendar,
  User,
  ImageIcon,
  Tag,
  ExternalLink,
  CheckCircle,
  BookOpen,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  Bold,
  Heading2,
  Heading3,
  List,
  Quote,
  AlignLeft,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { adminSeed, ds, subscribeAdminChanges, type AdminBlog } from "@/lib/admin/adminData";

// ── constants ──────────────────────────────────────────────────────────────
const CATEGORIES = ["Panduan Jurnal", "Tips Publikasi", "Kesalahan Umum", "Strategi Submit", "Akademik"];

const CAT_COLORS: Record<string, string> = {
  "Panduan Jurnal": "bg-blue-50 text-blue-600 border-blue-200",
  "Tips Publikasi": "bg-green-50 text-green-600 border-green-200",
  "Kesalahan Umum": "bg-red-50 text-red-600 border-red-200",
  "Strategi Submit": "bg-purple-50 text-purple-600 border-purple-200",
  Akademik: "bg-amber-50 text-amber-600 border-amber-200",
};

const COLOR_OPTIONS = [
  { label: "Indigo → Cyan", value: "from-[#3D35A8] to-[#00BCEF]" },
  { label: "Cyan → Blue", value: "from-[#00BCEF] to-[#0099CC]" },
  { label: "Purple → Indigo", value: "from-[#8B7EC8] to-[#3D35A8]" },
  { label: "Indigo → Purple", value: "from-[#3D35A8] to-[#5B50C8]" },
  { label: "Cyan → Indigo", value: "from-[#00BCEF] to-[#3D35A8]" },
  { label: "Purple → Cyan", value: "from-[#5B50C8] to-[#00BCEF]" },
];

const emptyForm = (): Omit<AdminBlog, "id"> => ({
  title: "",
  excerpt: "",
  content: "",
  category: "Panduan Jurnal",
  date: new Date().toISOString().slice(0, 10),
  readTime: "5 menit",
  published: false,
  featured: false,
  image: "",
  author: "",
  authorRole: "Editor Syntara",
  color: "from-[#3D35A8] to-[#00BCEF]",
});

// ── helpers ─────────────────────────────────────────────────────────────────
function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return d;
  }
}

function wordCount(text: string) {
  return (text || "").trim().split(/\s+/).filter(Boolean).length;
}

// ── Toolbar button ───────────────────────────────────────────────────────────
function ToolBtn({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} title={label} className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:bg-[#3D35A8]/10 hover:text-[#3D35A8] transition-colors text-xs flex items-center gap-1">
      <Icon size={13} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// ── Content renderer (list view preview) ────────────────────────────────────
function ContentPreview({ content }: { content: string }) {
  if (!content) return <span className="text-slate-300 italic">Belum ada konten</span>;
  const words = wordCount(content);
  return (
    <span className="text-slate-400">
      {words} kata · {Math.ceil(words / 200)} menit baca
    </span>
  );
}

// ── Blog Editor ─────────────────────────────────────────────────────────────
function BlogEditor({ initial, onSave, onCancel }: { initial?: AdminBlog; onSave: (d: Omit<AdminBlog, "id">) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Omit<AdminBlog, "id">>(
    initial
      ? {
          title: initial.title,
          excerpt: initial.excerpt,
          content: initial.content ?? "",
          category: initial.category,
          date: initial.date,
          readTime: initial.readTime,
          published: initial.published,
          featured: !!initial.featured,
          image: initial.image ?? "",
          author: initial.author ?? "",
          authorRole: initial.authorRole ?? "Editor Syntara",
          color: initial.color ?? "from-[#3D35A8] to-[#00BCEF]",
        }
      : emptyForm(),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const insertSyntax = (before: string, after = "") => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = String(form.content ?? "").slice(start, end);
    const content = String(form.content ?? "");
    const newContent = content.slice(0, start) + before + selected + after + content.slice(end);
    set({ content: newContent });
    setTimeout(() => {
      el.focus();
      el.selectionStart = start + before.length;
      el.selectionEnd = start + before.length + selected.length;
    }, 0);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Judul wajib diisi";
    if (!form.excerpt.trim()) e.excerpt = "Ringkasan wajib diisi";
    if (!String(form.content ?? "").trim()) e.content = "Konten artikel wajib diisi";
    if (!String(form.author ?? "").trim()) e.author = "Nama penulis wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: String(form.content ?? ""),
      author: String(form.author ?? "").trim(),
      authorRole: String(form.authorRole ?? "Editor Syntara").trim(),
      image: String(form.image ?? "").trim(),
      color: String(form.color ?? "from-[#3D35A8] to-[#00BCEF]"),
    });
  };

  const uploadCoverImage = async (file: File) => {
    setCoverUploadError(null);
    setCoverUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/uploads/blog-cover", {
        method: "POST",
        body: fd,
      });

      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = typeof data === "object" && data && "error" in data ? String((data as { error?: unknown }).error ?? "") : "";
        throw new Error(msg || "Upload gagal");
      }

      const url = typeof data === "object" && data && "url" in data ? String((data as { url?: unknown }).url ?? "") : "";
      if (!url) throw new Error("Upload gagal");

      set({ image: url });
    } catch (err) {
      setCoverUploadError(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setCoverUploading(false);
    }
  };

  const renderPreview = (content: string) => {
    const lines = content.split("\n");
    const elements: ReactNode[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="text-xl font-black text-[#1C2237] mt-8 mb-3">
            {line.slice(3)}
          </h2>,
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="text-base font-bold text-[#1C2237] mt-6 mb-2">
            {line.slice(4)}
          </h3>,
        );
      } else if (line.startsWith("- ")) {
        elements.push(
          <div key={i} className="flex items-start gap-2 text-sm text-slate-600 my-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3D35A8] mt-2 flex-shrink-0" />
            {line.slice(2)}
          </div>,
        );
      } else if (line.startsWith("> ")) {
        elements.push(
          <blockquote key={i} className="border-l-4 border-[#3D35A8] pl-4 my-4 text-slate-600 italic text-sm">
            {line.slice(2)}
          </blockquote>,
        );
      } else if (line.trim() === "") {
        elements.push(<div key={i} className="h-3" />);
      } else {
        elements.push(
          <p key={i} className="text-sm text-slate-600 leading-relaxed">
            {line}
          </p>,
        );
      }
    }
    return elements;
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F8FD]">
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#3D35A8] transition-colors">
            <ArrowLeft size={15} /> Kembali
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-semibold text-[#1C2237]">{initial ? "Edit Artikel" : "Tulis Artikel Baru"}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => set({ published: !form.published })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${form.published ? "bg-green-50 text-green-600 border-green-200" : "bg-slate-50 text-slate-500 border-slate-200"}`}
          >
            {form.published ? <Eye size={13} /> : <EyeOff size={13} />}
            {form.published ? "Published" : "Draft"}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3D35A8] to-[#5B50C8] text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-[#3D35A8]/25 transition-all"
          >
            <Save size={14} />
            Simpan
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-5">
            <div>
              <input
                value={form.title}
                onChange={(e) => set({ title: e.target.value })}
                placeholder="Judul artikel yang menarik..."
                className={`w-full px-0 py-2 text-2xl font-black text-[#1C2237] bg-transparent border-b-2 outline-none transition-colors placeholder-slate-200 ${errors.title ? "border-red-300" : "border-slate-200 focus:border-[#3D35A8]"}`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Ringkasan / Excerpt *</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set({ excerpt: e.target.value })}
                rows={2}
                placeholder="Ringkasan singkat artikel yang akan tampil di halaman daftar blog..."
                className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1C2237] placeholder-slate-300 outline-none focus:ring-2 focus:ring-[#3D35A8]/30 transition-all resize-none ${
                  errors.excerpt ? "border-red-300" : "border-slate-200 focus:border-[#3D35A8]"
                }`}
              />
              {errors.excerpt && <p className="text-red-500 text-xs mt-1">{errors.excerpt}</p>}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center border-b border-slate-100">
                <div className="flex">
                  {(["write", "preview"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`px-4 py-2.5 text-xs font-semibold transition-colors capitalize ${tab === t ? "text-[#3D35A8] border-b-2 border-[#3D35A8] bg-[#3D35A8]/5" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      {t === "write" ? "✏️ Tulis" : "👁️ Preview"}
                    </button>
                  ))}
                </div>
                <div className="flex-1" />
                <span className="text-xs text-slate-300 pr-4">{wordCount(String(form.content ?? ""))} kata</span>
              </div>

              {tab === "write" && (
                <>
                  <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-100 bg-slate-50 flex-wrap">
                    <ToolBtn icon={Heading2} label="H2" onClick={() => insertSyntax("\n## ", "")} />
                    <ToolBtn icon={Heading3} label="H3" onClick={() => insertSyntax("\n### ", "")} />
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <ToolBtn icon={Bold} label="Bold" onClick={() => insertSyntax("**", "**")} />
                    <ToolBtn icon={List} label="List" onClick={() => insertSyntax("\n- ", "")} />
                    <ToolBtn icon={Quote} label="Kutipan" onClick={() => insertSyntax("\n> ", "")} />
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <div className="text-xs text-slate-400 px-2">
                      Tip: <code className="bg-slate-100 px-1 rounded">## H2</code> · <code className="bg-slate-100 px-1 rounded">### H3</code> · <code className="bg-slate-100 px-1 rounded">- item</code> ·{" "}
                      <code className="bg-slate-100 px-1 rounded">&gt; kutipan</code>
                    </div>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={String(form.content ?? "")}
                    onChange={(e) => set({ content: e.target.value })}
                    rows={24}
                    placeholder={`Tulis konten artikel di sini...\n\n## Gunakan heading level 2 untuk bagian utama\n\n### Gunakan heading level 3 untuk sub-bagian\n\nTulis paragraf normal seperti biasa.\n\n- Gunakan dash (-) untuk membuat poin-poin\n\n> Gunakan tanda lebih besar (>) untuk kutipan`}
                    className={`w-full px-5 py-4 text-sm text-[#1C2237] placeholder-slate-200 outline-none resize-none font-mono leading-relaxed ${errors.content ? "border border-red-300" : ""}`}
                  />
                  {errors.content && <p className="text-red-500 text-xs px-5 pb-3">{errors.content}</p>}
                </>
              )}

              {tab === "preview" && (
                <div className="px-8 py-6 min-h-[400px]">
                  {String(form.content ?? "") ? (
                    <div className="space-y-1">{renderPreview(String(form.content ?? ""))}</div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-300">
                      <AlignLeft size={32} className="mb-3" />
                      <p className="text-sm">Belum ada konten untuk dipreview</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="w-72 flex-shrink-0 bg-white border-l border-slate-200 overflow-y-auto">
          <div className="p-5 space-y-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Metadata Artikel</p>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                <ImageIcon size={12} /> Gambar Sampul
              </label>
              {String(form.image ?? "") && (
                <div className="relative mb-2 rounded-xl overflow-hidden">
                  <img
                    src={String(form.image ?? "")}
                    alt="preview"
                    className="w-full h-28 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={coverUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  void uploadCoverImage(file);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-500 outline-none focus:border-[#3D35A8] focus:ring-1 focus:ring-[#3D35A8]/20 transition-all file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-600 hover:file:bg-slate-200 disabled:opacity-60"
              />
              {coverUploading && <p className="text-[10px] text-slate-400 mt-1">Mengupload gambar...</p>}
              {coverUploadError && <p className="text-[10px] text-red-500 mt-1">{coverUploadError}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                <Tag size={12} /> Kategori
              </label>
              <select value={form.category} onChange={(e) => set({ category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-[#1C2237] outline-none focus:border-[#3D35A8] bg-white">
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                  <Calendar size={11} /> Tanggal
                </label>
                <input type="date" value={form.date} onChange={(e) => set({ date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#3D35A8]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                  <Clock size={11} /> Lama Baca
                </label>
                <input value={form.readTime} onChange={(e) => set({ readTime: e.target.value })} placeholder="5 menit" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#3D35A8]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                <User size={12} /> Penulis *
              </label>
              <input
                value={String(form.author ?? "")}
                onChange={(e) => set({ author: e.target.value })}
                placeholder="Dr. Ahmad Fauzi"
                className={`w-full px-3 py-2 rounded-lg border text-xs text-[#1C2237] placeholder-slate-300 outline-none focus:border-[#3D35A8] transition-all ${errors.author ? "border-red-300" : "border-slate-200"}`}
              />
              {errors.author && <p className="text-red-400 text-[10px] mt-1">{errors.author}</p>}
              <input
                value={String(form.authorRole ?? "")}
                onChange={(e) => set({ authorRole: e.target.value })}
                placeholder="Editor Syntara"
                className="w-full mt-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs text-[#1C2237] placeholder-slate-300 outline-none focus:border-[#3D35A8] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">Warna Kartu Blog</label>
              <button onClick={() => setShowColorPicker(!showColorPicker)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-[#3D35A8]/40 transition-all">
                <div className={`w-6 h-4 rounded bg-gradient-to-r ${String(form.color ?? "from-[#3D35A8] to-[#00BCEF]")} flex-shrink-0`} />
                <span className="text-xs text-slate-500 flex-1 text-left">{COLOR_OPTIONS.find((c) => c.value === form.color)?.label ?? "Pilih warna"}</span>
                <ChevronDown size={12} className={`text-slate-400 transition-transform ${showColorPicker ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showColorPicker && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="mt-2 space-y-1">
                      {COLOR_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            set({ color: opt.value });
                            setShowColorPicker(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs ${
                            form.color === opt.value ? "border-[#3D35A8] bg-[#3D35A8]/5 text-[#3D35A8]" : "border-slate-100 hover:border-slate-200 text-slate-500"
                          }`}
                        >
                          <div className={`w-5 h-3 rounded bg-gradient-to-r ${opt.value}`} />
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => set({ published: !form.published })}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${form.published ? "bg-green-50 border-green-200 text-green-700" : "bg-slate-50 border-slate-200 text-slate-500"}`}
              >
                {form.published ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                <div className="text-left flex-1">
                  <p className="text-xs font-semibold">{form.published ? "Dipublikasikan" : "Draft"}</p>
                  <p className="text-[10px] opacity-70">{form.published ? "Terlihat di website" : "Disembunyikan dari publik"}</p>
                </div>
              </button>

              <button
                onClick={() => set({ featured: !form.featured })}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${form.featured ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-slate-50 border-slate-200 text-slate-500"}`}
              >
                <Star size={16} className={form.featured ? "fill-amber-400 text-amber-400" : ""} />
                <div className="text-left flex-1">
                  <p className="text-xs font-semibold">{form.featured ? "Artikel Unggulan" : "Bukan Unggulan"}</p>
                  <p className="text-[10px] opacity-70">Tampil sebagai featured di halaman blog</p>
                </div>
              </button>
            </div>

            {initial && (
              <Link href={`/blog/${initial.id}`} target="_blank" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#3D35A8]/5 text-[#3D35A8] text-xs font-medium hover:bg-[#3D35A8]/10 transition-colors">
                <ExternalLink size={12} /> Lihat di Website Publik
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function AdminBlogPage() {
  const posts = useSyncExternalStore(
    subscribeAdminChanges,
    () => ds.blog.all(),
    () => adminSeed.blog,
  );

  const [view, setView] = useState<"list" | "editor">("list");
  const [editTarget, setEditTarget] = useState<AdminBlog | undefined>();
  const [filterCat, setFilterCat] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState<"semua" | "published" | "draft">("semua");
  const STATUS_FILTERS = [
    { key: "semua", label: "Semua Status" },
    { key: "published", label: "Published" },
    { key: "draft", label: "Draft" },
  ] as const;
  const [toast, setToast] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openNew = () => {
    setEditTarget(undefined);
    setView("editor");
  };

  const openEdit = (post: AdminBlog) => {
    setEditTarget(post);
    setView("editor");
  };

  const handleSave = (d: Omit<AdminBlog, "id">) => {
    if (editTarget) {
      ds.blog.update(editTarget.id, d);
      showToast("Artikel berhasil diperbarui");
    } else {
      ds.blog.add(d);
      showToast("Artikel berhasil ditambahkan");
    }
    setView("list");
  };

  const handleDelete = (id: string) => {
    ds.blog.del(id);
    showToast("Artikel berhasil dihapus");
    setDeleteId(null);
  };

  const handleTogglePublish = (post: AdminBlog) => {
    ds.blog.update(post.id, { published: !post.published });
    showToast(post.published ? "Artikel dijadikan draft" : "Artikel dipublikasikan");
  };

  const handleToggleFeatured = (post: AdminBlog) => {
    if (!post.featured) {
      ds.blog
        .all()
        .filter((b) => b.featured && b.id !== post.id)
        .forEach((b) => {
          ds.blog.update(b.id, { featured: false });
        });
    }
    ds.blog.update(post.id, { featured: !post.featured });
    showToast(post.featured ? "Dihapus dari unggulan" : "Dijadikan artikel unggulan");
  };

  const filteredPosts = useMemo(
    () =>
      posts.filter((p) => {
        const catOk = filterCat === "Semua" || p.category === filterCat;
        const statusOk = filterStatus === "semua" || (filterStatus === "published" && p.published) || (filterStatus === "draft" && !p.published);
        return catOk && statusOk;
      }),
    [posts, filterCat, filterStatus],
  );

  const publishedCount = useMemo(() => posts.filter((p) => p.published).length, [posts]);
  const draftCount = useMemo(() => posts.filter((p) => !p.published).length, [posts]);

  if (view === "editor") {
    return (
      <div className="h-full flex flex-col">
        <BlogEditor initial={editTarget} onSave={handleSave} onCancel={() => setView("list")} />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-[200] flex items-center gap-2 px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-xl shadow-lg"
          >
            <CheckCircle size={15} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1C2237]">Blog & Artikel</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {posts.length} total · <span className="text-green-600">{publishedCount} published</span> · <span className="text-slate-400">{draftCount} draft</span>
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#3D35A8] to-[#5B50C8] text-white text-sm font-semibold rounded-xl shadow-md shadow-[#3D35A8]/25 hover:shadow-[#3D35A8]/40 hover:-translate-y-0.5 transition-all"
        >
          <Plus size={16} /> Tulis Artikel
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Artikel", val: posts.length, icon: BookOpen, color: "from-[#3D35A8] to-[#5B50C8]" },
          { label: "Published", val: publishedCount, icon: Eye, color: "from-green-500 to-green-600" },
          { label: "Draft", val: draftCount, icon: EyeOff, color: "from-slate-400 to-slate-500" },
          { label: "Unggulan", val: posts.filter((p) => p.featured).length, icon: Star, color: "from-amber-400 to-amber-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon size={15} className="text-white" />
            </div>
            <div className="text-xl font-bold text-[#1C2237]">{s.val}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1.5 flex-wrap">
          {["Semua", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filterCat === c ? "bg-[#3D35A8] text-white border-[#3D35A8]" : "bg-white border-slate-200 text-slate-500 hover:border-[#3D35A8]/40"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="w-px bg-slate-200 mx-1 self-stretch hidden sm:block" />
        <div className="flex gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.key}
              onClick={() => setFilterStatus(s.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filterStatus === s.key ? "bg-[#1C2237] text-white border-[#1C2237]" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen size={36} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-sm">Tidak ada artikel yang sesuai filter</p>
            <button onClick={openNew} className="mt-4 text-[#3D35A8] text-sm font-medium hover:underline">
              + Tulis artikel pertama
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPosts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors group">
                <div className="w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${post.color ?? "from-[#3D35A8] to-[#00BCEF]"} flex items-center justify-center`}>
                      <BookOpen size={18} className="text-white/70" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap mb-1">
                    {post.featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-[10px] font-bold">
                        <Star size={9} className="fill-amber-400" /> Unggulan
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${CAT_COLORS[post.category] ?? "bg-slate-50 text-slate-500 border-slate-200"}`}>{post.category}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1C2237] leading-snug line-clamp-1">{post.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{post.excerpt}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User size={10} />
                      {post.author || "–"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {post.readTime}
                    </span>
                    <span className="text-slate-300">·</span>
                    <ContentPreview content={String(post.content ?? "")} />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleToggleFeatured(post)}
                    className={`p-1.5 rounded-lg transition-colors ${post.featured ? "text-amber-400 hover:bg-amber-50" : "text-slate-300 hover:bg-slate-100 hover:text-amber-400"}`}
                    title={post.featured ? "Hapus dari unggulan" : "Jadikan unggulan"}
                  >
                    <Star size={14} className={post.featured ? "fill-amber-400" : ""} />
                  </button>

                  <button
                    onClick={() => handleTogglePublish(post)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                      post.published ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100" : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {post.published ? <Eye size={11} /> : <EyeOff size={11} />}
                    {post.published ? "Published" : "Draft"}
                  </button>

                  <button onClick={() => openEdit(post)} className="p-1.5 rounded-lg text-[#3D35A8] hover:bg-[#3D35A8]/10 transition-colors" title="Edit">
                    <Pencil size={14} />
                  </button>

                  <Link href={`/blog/${post.id}`} target="_blank" className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" title="Lihat di website">
                    <ExternalLink size={14} />
                  </Link>

                  <button onClick={() => setDeleteId(post.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors" title="Hapus">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="sm:hidden flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${post.published ? "bg-green-50 text-green-600 border-green-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10 text-center">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="font-bold text-[#1C2237] mb-2">Hapus Artikel?</h3>
              <p className="text-sm text-gray-400 mb-6">Artikel ini akan dihapus permanen dan tidak bisa dikembalikan.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
                  Batal
                </button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors">
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
