"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Trash2, Search, Plus, Clock, FileText, Phone, ChevronRight, CheckCircle2, Loader2, Inbox, StickyNote, ArrowRight, AlertCircle, User } from "lucide-react";
import { adminSeed, ds, subscribeAdminChanges, type AdminRequest } from "@/lib/admin/adminData";

// ─── Constants ──────────────────────────────────────────────────────────────
const SERVICES = ["Editing & Proofreading", "Formatting Jurnal", "Translasi Akademik", "Konsultasi Jurnal", "Pendampingan Submit", "Full Service Premium"];

const STATUS_CONFIG = {
  new: {
    label: "Baru",
    badge: "bg-blue-50 text-blue-600 border-blue-200",
    dot: "bg-blue-500",
    icon: Inbox,
    description: "Belum diproses",
  },
  processing: {
    label: "Diproses",
    badge: "bg-amber-50 text-amber-600 border-amber-200",
    dot: "bg-amber-400",
    icon: Loader2,
    description: "Sedang ditangani",
  },
  done: {
    label: "Selesai",
    badge: "bg-green-50 text-green-600 border-green-200",
    dot: "bg-green-500",
    icon: CheckCircle2,
    description: "Telah selesai",
  },
} as const;

function buildWaLink(wa: string, name: string, service: string, status: AdminRequest["status"]) {
  const n = encodeURIComponent(name);
  const s = encodeURIComponent(service);
  let text = "";
  if (status === "new") text = `Halo+${n}%2C+saya+dari+tim+Syntara.+Terima+kasih+telah+menghubungi+kami!+Kami+telah+menerima+permintaan+Anda+untuk+layanan+*${s}*.+Boleh+kami+diskusikan+lebih+lanjut%3F`;
  else if (status === "processing") text = `Halo+${n}%2C+ini+update+dari+tim+Syntara.+Layanan+*${s}*+Anda+sedang+kami+proses.+Ada+yang+ingin+ditanyakan%3F`;
  else text = `Halo+${n}%2C+Syntara+di+sini.+Layanan+*${s}*+Anda+telah+selesai+kami+kerjakan.+Terima+kasih%21`;
  return `https://wa.me/${wa}?text=${text}`;
}

// ─── Helper ─────────────────────────────────────────────────────────────────
function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  return `${d} hari lalu`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: AdminRequest["status"] }) {
  const c = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ─── Flow Indicator ──────────────────────────────────────────────────────────
function FlowStep({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${done ? "text-green-600" : active ? "text-[#3D35A8]" : "text-slate-300"}`}>
      <span
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          done ? "bg-green-500 border-green-500 text-white" : active ? "bg-[#3D35A8] border-[#3D35A8] text-white" : "border-slate-200"
        }`}
      >
        {done ? <CheckCircle2 size={12} className="fill-white" /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      </span>
      {label}
    </div>
  );
}

// ─── Add Manual Modal ────────────────────────────────────────────────────────
function AddManualModal({ onClose, onSave }: { onClose: () => void; onSave: (d: Omit<AdminRequest, "id" | "createdAt" | "updatedAt" | "source">) => void }) {
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    service: SERVICES[0],
    notes: "",
    adminNotes: "",
  });
  const [err, setErr] = useState("");
  const set = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));

  const handle = () => {
    if (!form.name.trim()) {
      setErr("Nama wajib diisi");
      return;
    }
    if (!form.whatsapp.trim()) {
      setErr("Nomor WhatsApp wajib diisi");
      return;
    }

    const waDigits = form.whatsapp.replace(/\D/g, "");
    const wa = waDigits.startsWith("62") ? waDigits : `62${waDigits}`;

    onSave({
      name: form.name.trim(),
      whatsapp: wa,
      email: "",
      service: form.service,
      notes: form.notes,
      adminNotes: form.adminNotes,
      status: "new",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF]" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#1C2237]">Tambah Lead Manual</h3>
              <p className="text-xs text-slate-400 mt-0.5">Untuk klien yang menghubungi via WhatsApp</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
              <X size={15} />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nama Klien *</label>
              <input
                value={form.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="Dr. Ahmad Fauzi"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nomor WhatsApp *</label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500">+62</span>
                <input
                  value={form.whatsapp}
                  onChange={(e) => set({ whatsapp: e.target.value.replace(/\D/g, "") })}
                  placeholder="81234567890"
                  className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Layanan yang Diminati</label>
              <select value={form.service} onChange={(e) => set({ service: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8] bg-white">
                {SERVICES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Kebutuhan Klien</label>
              <textarea
                value={form.notes}
                onChange={(e) => set({ notes: e.target.value })}
                rows={2}
                placeholder="Deskripsi singkat kebutuhan klien..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Catatan Internal Admin</label>
              <textarea
                value={form.adminNotes}
                onChange={(e) => set({ adminNotes: e.target.value })}
                rows={2}
                placeholder="Catatan untuk tim (tidak terlihat oleh klien)..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8] resize-none"
              />
            </div>
          </div>

          {err && (
            <div className="flex items-center gap-2 mt-3 text-red-500 text-xs">
              <AlertCircle size={13} /> {err}
            </div>
          )}

          <div className="flex gap-3 mt-5">
            <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-gray-500 hover:bg-slate-50 transition-colors">
              Batal
            </button>
            <button onClick={handle} className="flex-1 py-2.5 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white rounded-xl text-sm font-semibold">
              Tambah Lead
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Detail Modal ────────────────────────────────────────────────────────────
function DetailModal({
  req,
  onClose,
  onStatusChange,
  onDelete,
  onNoteChange,
}: {
  req: AdminRequest;
  onClose: () => void;
  onStatusChange: (id: string, s: AdminRequest["status"]) => void;
  onDelete: (id: string) => void;
  onNoteChange: (id: string, note: string) => void;
}) {
  const [note, setNote] = useState(req.adminNotes ?? "");
  const [noteSaved, setNoteSaved] = useState(false);

  const saveNote = () => {
    onNoteChange(req.id, note);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const waLink = buildWaLink(req.whatsapp, req.name, req.service, req.status);

  const nextStatus: Record<AdminRequest["status"], AdminRequest["status"] | null> = {
    new: "processing",
    processing: "done",
    done: null,
  };
  const next = nextStatus[req.status];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="h-1 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] flex-shrink-0" />

        <div className="overflow-y-auto flex-1">
          <div className="p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] flex items-center justify-center text-white font-bold shadow-lg shadow-[#3D35A8]/25 flex-shrink-0">
                  {req.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-[#1C2237] leading-tight">{req.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors flex-shrink-0">
                <X size={15} />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-6 px-3 py-3 bg-slate-50 rounded-xl">
              <FlowStep label="Baru" active={req.status === "new"} done={req.status !== "new"} />
              <ChevronRight size={12} className="text-slate-300 flex-shrink-0" />
              <FlowStep label="Diproses" active={req.status === "processing"} done={req.status === "done"} />
              <ChevronRight size={12} className="text-slate-300 flex-shrink-0" />
              <FlowStep label="Selesai" active={false} done={req.status === "done"} />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: "WhatsApp", val: req.whatsapp, icon: Phone },
                { label: "Layanan", val: req.service, icon: FileText },
                { label: "Masuk", val: formatDate(req.createdAt), icon: Clock },
                { label: "Diperbarui", val: relativeTime(req.updatedAt), icon: Clock },
              ].map((f) => (
                <div key={f.label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <f.icon size={10} /> {f.label}
                  </p>
                  <p className="text-sm font-semibold text-[#1C2237] truncate">{f.val}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-xl p-3 mb-4">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Kebutuhan Klien</p>
              <p className="text-sm text-gray-700 leading-relaxed">{req.notes || "—"}</p>
            </div>

            <div className="mb-5">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <StickyNote size={10} /> Catatan Internal Admin
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Tambahkan catatan internal (tidak terlihat oleh klien)..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-[#1C2237] outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10 resize-none placeholder-slate-300"
              />
              <button
                onClick={saveNote}
                className={`mt-2 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${noteSaved ? "bg-green-50 text-green-600 border border-green-200" : "bg-[#3D35A8]/10 text-[#3D35A8] hover:bg-[#3D35A8]/20"}`}
              >
                {noteSaved ? "✓ Tersimpan" : "Simpan Catatan"}
              </button>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">Aksi Status</p>
              <div className="space-y-2">
                {next && (
                  <button
                    onClick={() => {
                      onStatusChange(req.id, next);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                      next === "processing" ? "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/30" : "bg-green-500 text-white hover:bg-green-600 shadow-green-500/30"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {next === "processing" ? <Loader2 size={15} /> : <CheckCircle2 size={15} />}
                      {next === "processing" ? "Tandai: Sedang Diproses" : "Tandai: Selesai"}
                    </span>
                    <ArrowRight size={15} />
                  </button>
                )}

                {req.status === "done" && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-semibold">
                    <CheckCircle2 size={16} className="text-green-500" />
                    Request ini sudah selesai
                  </div>
                )}

                {req.status === "processing" && (
                  <button
                    onClick={() => {
                      onStatusChange(req.id, "new");
                      onClose();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs text-slate-400 border border-slate-200 hover:border-slate-300 hover:text-slate-600 transition-all"
                  >
                    ← Kembalikan ke &quot;Baru&quot;
                  </button>
                )}

                {req.status === "done" && (
                  <button
                    onClick={() => {
                      onStatusChange(req.id, "processing");
                      onClose();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs text-slate-400 border border-slate-200 hover:border-slate-300 hover:text-slate-600 transition-all"
                  >
                    ← Kembalikan ke &quot;Diproses&quot;
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0 bg-white">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white rounded-xl text-sm font-semibold hover:bg-[#1dba58] transition-colors shadow-sm shadow-green-500/20"
          >
            <MessageCircle size={16} />
            Hubungi via WhatsApp
          </a>
          <button
            onClick={() => {
              onDelete(req.id);
              onClose();
            }}
            className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
            title="Hapus request"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Request Card ────────────────────────────────────────────────────────────
function RequestCard({ req, onOpen, onStatusChange }: { req: AdminRequest; onOpen: (r: AdminRequest) => void; onStatusChange: (id: string, s: AdminRequest["status"]) => void }) {
  const nextStatus: Record<AdminRequest["status"], AdminRequest["status"] | null> = {
    new: "processing",
    processing: "done",
    done: null,
  };
  const next = nextStatus[req.status];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group">
      <div className={`h-0.5 rounded-t-2xl bg-gradient-to-r ${req.status === "new" ? "from-blue-400 to-blue-300" : req.status === "processing" ? "from-amber-400 to-amber-300" : "from-green-400 to-green-300"}`} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md shadow-[#3D35A8]/20">
              {req.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#1C2237] truncate">{req.name}</p>
              <span className="text-[10px] text-slate-400">{relativeTime(req.createdAt)}</span>
            </div>
          </div>
          <StatusBadge status={req.status} />
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          <FileText size={11} className="text-slate-400 flex-shrink-0" />
          <span className="text-xs text-slate-600 font-medium truncate">{req.service}</span>
        </div>

        {req.notes && <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">{req.notes}</p>}

        {!!req.adminNotes && (
          <div className="flex items-start gap-1.5 px-2.5 py-1.5 bg-amber-50 rounded-lg mb-3">
            <StickyNote size={10} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-amber-700 line-clamp-1">{req.adminNotes}</p>
          </div>
        )}

        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          {next && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(req.id, next);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                next === "processing" ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {next === "processing" ? <Loader2 size={11} /> : <CheckCircle2 size={11} />}
              {next === "processing" ? "Proses" : "Selesai"}
            </button>
          )}

          {req.status === "done" && (
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-600 bg-green-50">
              <CheckCircle2 size={11} /> Selesai
            </span>
          )}

          <div className="flex-1" />

          <a
            href={buildWaLink(req.whatsapp, req.name, req.service, req.status)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors"
            title="Hubungi via WhatsApp"
          >
            <MessageCircle size={13} />
          </a>

          <button onClick={() => onOpen(req)} className="w-7 h-7 rounded-lg bg-[#3D35A8]/10 flex items-center justify-center text-[#3D35A8] hover:bg-[#3D35A8]/20 transition-colors" title="Lihat detail">
            <User size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function AdminRequestsPage() {
  const requests = useSyncExternalStore(
    subscribeAdminChanges,
    () => ds.requests.all(),
    () => adminSeed.requests,
  );

  const [filter, setFilter] = useState<"all" | AdminRequest["status"]>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminRequest | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleStatusChange = (id: string, status: AdminRequest["status"]) => {
    ds.requests.update(id, { status });
  };

  const handleDelete = (id: string) => {
    ds.requests.del(id);
  };

  const handleAddManual = (d: Omit<AdminRequest, "id" | "createdAt" | "updatedAt" | "source">) => {
    ds.requests.add(d);
  };

  const handleNoteChange = (id: string, adminNotes: string) => {
    ds.requests.update(id, { adminNotes });
  };

  const counts = useMemo(
    () => ({
      all: requests.length,
      new: requests.filter((r) => r.status === "new").length,
      processing: requests.filter((r) => r.status === "processing").length,
      done: requests.filter((r) => r.status === "done").length,
    }),
    [requests],
  );

  const filtered = useMemo(
    () =>
      requests
        .filter((r) => filter === "all" || r.status === filter)
        .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.service.toLowerCase().includes(search.toLowerCase()) || r.whatsapp.includes(search))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [requests, filter, search],
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1C2237]">Request & Leads</h1>
          <p className="text-sm text-gray-400 mt-0.5">Kelola semua permintaan klien · Admin ubah status secara manual</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#3D35A8] to-[#5B50C8] text-white text-sm font-semibold rounded-xl shadow-md shadow-[#3D35A8]/25 hover:shadow-[#3D35A8]/40 hover:-translate-y-0.5 transition-all flex-shrink-0"
        >
          <Plus size={15} /> Tambah Lead Manual
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: "all" as const, label: "Total Request", count: counts.all, color: "from-[#3D35A8] to-[#5B50C8]", icon: Inbox },
          { key: "new" as const, label: "Perlu Ditangani", count: counts.new, color: "from-blue-500 to-blue-600", icon: AlertCircle },
          { key: "processing" as const, label: "Sedang Diproses", count: counts.processing, color: "from-amber-400 to-amber-500", icon: Loader2 },
          { key: "done" as const, label: "Selesai", count: counts.done, color: "from-green-500 to-green-600", icon: CheckCircle2 },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`bg-white rounded-2xl p-4 border text-left transition-all hover:shadow-md ${filter === s.key ? "border-[#3D35A8]/30 shadow-md shadow-[#3D35A8]/10" : "border-slate-100 shadow-sm"}`}
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon size={15} className="text-white" />
            </div>
            <div className={`text-xl font-bold ${filter === s.key ? "text-[#3D35A8]" : "text-[#1C2237]"}`}>{s.count}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            {s.key === "new" && s.count > 0 && (
              <div className="mt-1.5 w-full h-1 bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: "100%" }} />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, layanan, atau nomor WA..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10 bg-white"
          />
        </div>
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
          {[
            { key: "all" as const, label: `Semua (${counts.all})` },
            { key: "new" as const, label: `Baru (${counts.new})` },
            { key: "processing" as const, label: `Diproses (${counts.processing})` },
            { key: "done" as const, label: `Selesai (${counts.done})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${filter === t.key ? "bg-white text-[#3D35A8] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center">
          <Inbox size={36} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Tidak ada request yang ditemukan</p>
          <button onClick={() => setShowAddModal(true)} className="mt-4 text-[#3D35A8] text-sm font-medium hover:underline">
            + Tambah lead manual
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((req) => (
            <RequestCard key={req.id} req={req} onOpen={setSelected} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && <DetailModal req={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} onDelete={handleDelete} onNoteChange={handleNoteChange} />}
        {showAddModal && <AddManualModal onClose={() => setShowAddModal(false)} onSave={handleAddManual} />}
      </AnimatePresence>
    </div>
  );
}
