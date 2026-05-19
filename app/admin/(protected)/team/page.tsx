"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, X, Users } from "lucide-react";

const DEFAULT_TEAM_GRADIENT_STYLE = {
  backgroundImage: "linear-gradient(135deg, #3D35A8, #00BCEF)",
} as const;

const DEFAULT_TEAM_COLOR = "hex:#3D35A8,#00BCEF";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  expertise: string;
  avatar: string;
  color: string;
  bio: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function makeId(): string {
  return `tm_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function guessAvatar(name: string): string {
  const parts = name
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return (first + second).toUpperCase() || "TM";
}

function normalizeTeamMember(v: unknown): TeamMember | null {
  if (!isRecord(v)) return null;
  const name = asString(v.name).trim();
  const role = asString(v.role).trim();
  if (!name || !role) return null;

  const expertise = asString(v.expertise).trim();
  const avatar = asString(v.avatar).trim() || guessAvatar(name);
  const color = DEFAULT_TEAM_COLOR;
  const bio = asString(v.bio).trim();
  const id = asString(v.id).trim() || makeId();

  return { id, name, role, expertise, avatar, color, bio };
}

async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let msg = `Request failed: ${res.status}`;
    try {
      const j: unknown = await res.json();
      if (isRecord(j) && "error" in j) msg = String(j.error ?? msg);
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  return (await res.json()) as T;
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10 resize-none"
      />
    </div>
  );
}

export default function AdminTeamPage() {
  const [aboutData, setAboutData] = useState<Record<string, unknown>>({});
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState({ name: "", role: "", expertise: "", avatar: "", bio: "" });

  const sorted = useMemo(() => [...team], [team]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiJson<{ data: unknown; published: boolean; updatedAt: string | null }>("/api/admin/about", { method: "GET" });
        const data = isRecord(res.data) ? res.data : {};
        const teamRaw = Array.isArray((data as Record<string, unknown>).team) ? ((data as Record<string, unknown>).team as unknown[]) : [];
        const normalized = teamRaw.map(normalizeTeamMember).filter((x): x is TeamMember => x !== null);
        if (alive) {
          setAboutData(data);
          setTeam(normalized);
        }
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Gagal memuat data.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const persistTeam = async (nextTeam: TeamMember[]) => {
    setSaving(true);
    setError("");

    const nextAbout = {
      ...aboutData,
      team: nextTeam.map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        expertise: m.expertise,
        avatar: m.avatar,
        color: m.color,
        bio: m.bio,
      })),
    };

    setAboutData(nextAbout);
    setTeam(nextTeam);

    try {
      await apiJson<{ data: unknown }>("/api/admin/about", {
        method: "PUT",
        body: JSON.stringify({ data: nextAbout }),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  const startAdd = () => {
    setEditing(null);
    setForm({ name: "", role: "", expertise: "", avatar: "", bio: "" });
    setOpen(true);
  };

  const startEdit = (m: TeamMember) => {
    setEditing(m);
    setForm({ name: m.name, role: m.role, expertise: m.expertise, avatar: m.avatar, bio: m.bio });
    setOpen(true);
  };

  const save = async () => {
    const name = form.name.trim();
    const role = form.role.trim();
    const expertise = form.expertise.trim();
    const avatar = (form.avatar.trim() || guessAvatar(name)).slice(0, 3);
    const color = DEFAULT_TEAM_COLOR;
    const bio = form.bio.trim();

    if (!name || !role) return;

    if (editing) {
      const next = team.map((m) => (m.id === editing.id ? { ...m, name, role, expertise, avatar, color, bio } : m));
      await persistTeam(next);
    } else {
      const next: TeamMember[] = [{ id: makeId(), name, role, expertise, avatar, color, bio }, ...team];
      await persistTeam(next);
    }

    setOpen(false);
  };

  const remove = async (id: string) => {
    const m = team.find((x) => x.id === id);
    if (!m) return;
    if (!confirm(`Hapus anggota tim: ${m.name}?`)) return;
    const next = team.filter((x) => x.id !== id);
    await persistTeam(next);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#1C2237]">Manajemen Tim</h1>
          <p className="text-slate-400 text-sm">Kelola anggota tim yang tampil di halaman Tentang</p>
        </div>
        <button onClick={startAdd} className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white font-bold hover:shadow-lg hover:shadow-[#3D35A8]/25 transition-shadow">
          <Plus size={17} />
          Tambah Anggota
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sorted.map((m) => (
          <motion.div key={m.id} whileHover={{ y: -2 }} className="bg-white rounded-3xl shadow-sm border border-slate-200/70 overflow-hidden">
            <div className="h-20 flex items-end justify-center pb-2 relative" style={DEFAULT_TEAM_GRADIENT_STYLE}>
              <div className="absolute -bottom-7 w-14 h-14 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm" style={DEFAULT_TEAM_GRADIENT_STYLE}>
                  {m.avatar}
                </div>
              </div>
            </div>
            <div className="pt-9 pb-5 px-5 text-center">
              <h3 className="font-black text-[#1C2237] text-sm truncate">{m.name}</h3>
              <p className="text-[#3D35A8] text-xs font-medium mt-1">{m.role}</p>
              {m.expertise && <span className="inline-block mt-2 px-2.5 py-1 bg-[#3D35A8]/10 text-[#3D35A8] text-xs rounded-full">{m.expertise}</span>}
              {m.bio && <p className="text-slate-400 text-xs mt-3 leading-relaxed">{m.bio}</p>}

              <div className="flex items-center justify-center gap-1 mt-4">
                <button onClick={() => startEdit(m)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500" aria-label="Edit">
                  <Pencil size={16} />
                </button>
                <button onClick={() => void remove(m.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-500" aria-label="Hapus">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {!loading && sorted.length === 0 && <div className="text-slate-400 text-sm">Belum ada anggota tim.</div>}
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
              <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-2xl bg-[#3D35A8]/10 flex items-center justify-center">
                      <Users size={16} className="text-[#3D35A8]" />
                    </div>
                    <p className="font-black text-[#1C2237]">{editing ? "Edit Anggota" : "Tambah Anggota"}</p>
                  </div>
                  <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-5 space-y-4 overflow-y-auto">
                  <Field label="Nama" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} placeholder="Contoh: Dr. Ahmad Fauzi" />
                  <Field label="Role" value={form.role} onChange={(v) => setForm((p) => ({ ...p, role: v }))} placeholder="Contoh: Founder & Chief Editor" />
                  <Field label="Keahlian" value={form.expertise} onChange={(v) => setForm((p) => ({ ...p, expertise: v }))} placeholder="Contoh: Linguistik & Academic Writing" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Avatar (inisial)" value={form.avatar} onChange={(v) => setForm((p) => ({ ...p, avatar: v }))} placeholder="Contoh: AF" />
                  </div>

                  <TextArea label="Bio" value={form.bio} onChange={(v) => setForm((p) => ({ ...p, bio: v }))} placeholder="Deskripsi singkat" />
                </div>

                <div className="p-5 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0 bg-white">
                  <button onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors" disabled={saving}>
                    Batal
                  </button>
                  <button
                    onClick={() => void save()}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white font-bold hover:shadow-lg hover:shadow-[#3D35A8]/25 transition-shadow disabled:opacity-60"
                    disabled={saving}
                  >
                    {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
