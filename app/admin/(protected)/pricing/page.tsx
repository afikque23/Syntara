"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pencil, X, Plus, Trash2, CheckCircle, Star, Table2, CreditCard, GripVertical, AlertTriangle, ArrowRight } from "lucide-react";
import { adminSeed, ds, subscribeAdminChanges, type AdminPricing, type AdminPublicationLane } from "@/lib/admin/adminData";



// ─── Edit Plan Modal ─────────────────────────────────────────────────────
function EditPlanModal({ plan, onSave, onClose }: { plan: AdminPricing | Omit<AdminPricing, "id">; onSave: (d: AdminPricing | Omit<AdminPricing, "id">) => void; onClose: () => void }) {
  const [form, setForm] = useState<AdminPricing | Omit<AdminPricing, "id">>({
    ...plan,
    features: plan.features ?? [],
    notIncluded: plan.notIncluded ?? [],
  });
  const [newFeature, setNewFeature] = useState("");
  const [newNotIncluded, setNewNotIncluded] = useState("");

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setForm({ ...form, features: [...(form.features ?? []), newFeature.trim()] });
    setNewFeature("");
  };
  const removeFeature = (i: number) =>
    setForm({
      ...form,
      features: (form.features ?? []).filter((_, idx) => idx !== i),
    });

  const addNotIncluded = () => {
    if (!newNotIncluded.trim()) return;
    setForm({
      ...form,
      notIncluded: [...(form.notIncluded ?? []), newNotIncluded.trim()],
    });
    setNewNotIncluded("");
  };
  const removeNotIncluded = (i: number) =>
    setForm({
      ...form,
      notIncluded: (form.notIncluded ?? []).filter((_, idx) => idx !== i),
    });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
        <div className="h-1 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] flex-shrink-0" />
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-[#1C2237]">{"id" in plan ? "Edit Paket" : "Tambah Paket Baru"}</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Paket</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Harga Teks Tampilan</label>
                <input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Rp 350.000"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Harga Angka (Int)</label>
                <input
                  type="text"
                  value={form.priceAmount === 0 ? "" : form.priceAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setForm({ ...form, priceAmount: parseInt(val, 10) || 0 });
                  }}
                  placeholder="350000"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Deskripsi Singkat</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Label / Badge</label>
                <input
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="Paling Populer"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8]"
                />
              </div>
              <div className="flex flex-col gap-2 pt-6">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} id="popular" className="w-4 h-4 accent-[#3D35A8]" />
                  <label htmlFor="popular" className="text-sm text-gray-600">Populer</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} id="active" className="w-4 h-4 accent-[#00BCEF]" />
                  <label htmlFor="active" className="text-sm text-gray-600">Aktif</label>
                </div>
              </div>
            </div>

            {/* Features Included */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Fitur Termasuk ✓</label>
              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                {(form.features ?? []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
                    <CheckCircle size={13} className="text-[#00BCEF] flex-shrink-0" />
                    <span className="text-sm text-gray-700 flex-1">{f}</span>
                    <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-600 transition-colors">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addFeature()}
                  placeholder="Tambah fitur termasuk..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8]"
                />
                <button onClick={addFeature} className="w-9 h-9 rounded-xl bg-[#3D35A8]/10 text-[#3D35A8] flex items-center justify-center hover:bg-[#3D35A8]/20 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Not Included */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Fitur Tidak Termasuk ✗</label>
              <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                {(form.notIncluded ?? []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-red-50 rounded-xl">
                    <div className="w-3 h-3 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    <span className="text-sm text-gray-400 flex-1 line-through">{f}</span>
                    <button onClick={() => removeNotIncluded(i)} className="text-red-400 hover:text-red-600 transition-colors">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newNotIncluded}
                  onChange={(e) => setNewNotIncluded(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addNotIncluded()}
                  placeholder="Tambah fitur tidak termasuk..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8]"
                />
                <button onClick={addNotIncluded} className="w-9 h-9 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-gray-600 hover:bg-slate-50 transition-colors">
              Batal
            </button>
            <button
              onClick={() => {
                onSave(form);
                onClose();
              }}
              className="flex-1 py-2.5 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white rounded-xl text-sm font-semibold"
            >
              Simpan
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Edit Lane Modal ──────────────────────────────────────────────────────
function EditLaneModal({ lane, onSave, onClose }: { lane: AdminPublicationLane | Omit<AdminPublicationLane, "id">; onSave: (d: AdminPublicationLane | Omit<AdminPublicationLane, "id">) => void; onClose: () => void }) {
  const [form, setForm] = useState<AdminPublicationLane | Omit<AdminPublicationLane, "id">>({ ...lane });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
        <div className="h-1 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] flex-shrink-0" />
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-[#1C2237]">{"id" in lane ? "Edit Jalur" : "Tambah Jalur Baru"}</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Jalur</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Biaya Teks</label>
                <input
                  value={form.priceText}
                  onChange={(e) => setForm({ ...form, priceText: e.target.value })}
                  placeholder="Rp 350.000"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Biaya Angka (Int)</label>
                <input
                  type="text"
                  value={form.priceAmount === 0 ? "" : form.priceAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setForm({ ...form, priceAmount: parseInt(val, 10) || 0 });
                  }}
                  placeholder="350000"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Deskripsi Singkat</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8]" />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} id="laneActive" className="w-4 h-4 accent-[#00BCEF]" />
              <label htmlFor="laneActive" className="text-sm text-gray-600">Jalur Aktif</label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-gray-600 hover:bg-slate-50 transition-colors">
              Batal
            </button>
            <button
              onClick={() => {
                onSave(form);
                onClose();
              }}
              className="flex-1 py-2.5 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white rounded-xl text-sm font-semibold"
            >
              Simpan
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}



// ─── Main Page ───────────────────────────────────────────────────────────
export default function AdminPricingPage() {
  const [tab, setTab] = useState<"plans" | "lanes">("plans");

  const plans = useSyncExternalStore(
    subscribeAdminChanges,
    () => ds.pricing.all(),
    () => adminSeed.pricing,
  );

  const lanes = useSyncExternalStore(
    subscribeAdminChanges,
    () => ds.lanes.all(),
    () => adminSeed.lanes,
  );

  const [editingPlan, setEditingPlan] = useState<AdminPricing | Omit<AdminPricing, "id"> | null>(null);
  const [editingLane, setEditingLane] = useState<AdminPublicationLane | Omit<AdminPublicationLane, "id"> | null>(null);

  const savePlan = (d: AdminPricing | Omit<AdminPricing, "id">) => {
    if ("id" in d) {
      ds.pricing.update(d.id, d);
    } else {
      ds.pricing.add(d);
    }
  };

  const deletePlan = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
      ds.pricing.del(id);
    }
  };

  const saveLane = (d: AdminPublicationLane | Omit<AdminPublicationLane, "id">) => {
    if ("id" in d) {
      ds.lanes.update(d.id, d);
    } else {
      ds.lanes.add(d);
    }
  };

  const deleteLane = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus jalur ini?")) {
      ds.lanes.del(id);
    }
  };



  const planColors = useMemo(
    () => [
      { border: "border-[#8B7EC8]", header: "bg-slate-50" },
      {
        border: "border-[#3D35A8]",
        header: "bg-gradient-to-br from-[#3D35A8] to-[#5B50C8]",
      },
      {
        border: "border-[#00BCEF]",
        header: "bg-gradient-to-br from-[#1C2237] to-[#2A1F5C]",
      },
    ],
    [],
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1C2237]">Manajemen Pricing & Jalur</h1>
          <p className="text-sm text-gray-400 mt-0.5">Kelola paket harga dan jalur publikasi</p>
        </div>
        {tab === "plans" && (
          <button onClick={() => setEditingPlan({ name: "Paket Baru", price: "Rp 0", priceAmount: 0, description: "Deskripsi paket", features: [], notIncluded: [], badge: "", popular: false, isActive: true })} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white rounded-xl text-sm font-semibold shadow hover:shadow-md transition-shadow">
            <Plus size={16} />
            Tambah Paket
          </button>
        )}
        {tab === "lanes" && (
          <button onClick={() => setEditingLane({ name: "Jalur Baru", description: "Deskripsi", priceAmount: 0, priceText: "Rp 0", isActive: true })} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white rounded-xl text-sm font-semibold shadow hover:shadow-md transition-shadow">
            <Plus size={16} />
            Tambah Jalur
          </button>
        )}

      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        <button onClick={() => setTab("plans")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "plans" ? "bg-white text-[#3D35A8] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          <CreditCard size={15} />
          Paket / Card
        </button>
        <button onClick={() => setTab("lanes")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "lanes" ? "bg-white text-[#3D35A8] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          <ArrowRight size={15} />
          Jalur Publikasi
        </button>

      </div>

      {/* ── TAB: PLANS ───────────────────────────────────────── */}
      {tab === "plans" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const c = planColors[i % planColors.length];
            const isDark = c !== planColors[0];
            return (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`relative rounded-3xl border-2 ${c.border} overflow-hidden shadow-sm flex flex-col ${!plan.isActive && "opacity-60"}`}>
                {plan.popular && (
                  <div className="bg-gradient-to-r from-[#3D35A8] to-[#5B50C8] px-4 py-1.5 text-center">
                    <span className="text-white text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1">
                      <Star size={11} fill="white" />
                      {plan.badge || "Paling Populer"}
                    </span>
                  </div>
                )}
                {!plan.isActive && (
                  <div className="absolute top-3 right-3 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
                    <AlertTriangle size={12} /> Nonaktif
                  </div>
                )}

                <div className={`p-5 ${c.header} flex-1 relative`}>
                  {plan.badge && !plan.popular && <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${isDark ? "bg-white/20 text-white" : "bg-[#3D35A8]/10 text-[#3D35A8]"}`}>{plan.badge}</span>}
                  <div className={`text-2xl font-bold mb-0.5 ${isDark ? "text-white" : "text-[#1C2237]"}`}>{plan.price}</div>
                  <div className={`text-xs mb-1 ${isDark ? "text-white/50" : "text-gray-400"}`}>per naskah</div>
                  <p className={`text-sm font-semibold mb-0.5 ${isDark ? "text-white" : "text-[#1C2237]"}`}>{plan.name}</p>
                  <p className={`text-xs ${isDark ? "text-white/70" : "text-gray-500"}`}>{plan.description}</p>

                  <ul className="mt-4 space-y-1.5">
                    {(plan.features ?? []).slice(0, 5).map((f) => (
                      <li key={f} className={`flex items-start gap-2 text-xs ${isDark ? "text-white/80" : "text-gray-600"}`}>
                        <CheckCircle size={12} className="text-[#00BCEF] mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                    {(plan.features ?? []).length > 5 && <li className={`text-xs ${isDark ? "text-white/50" : "text-gray-400"}`}>+{(plan.features ?? []).length - 5} fitur lainnya...</li>}
                  </ul>

                  {(plan.notIncluded ?? []).length > 0 && (
                    <div className={`mt-2 pt-2 border-t ${isDark ? "border-white/10" : "border-slate-100"}`}>
                      {(plan.notIncluded ?? []).map((f) => (
                        <div key={f} className={`flex items-start gap-2 text-xs opacity-50 mt-1 ${isDark ? "text-white/60" : "text-gray-400"}`}>
                          <div className="w-3 h-3 rounded-full border border-current mt-0.5 flex-shrink-0" />
                          <span className="line-through">{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`px-5 pb-5 pt-3 ${c.header} flex gap-2`}>
                  <button
                    onClick={() => setEditingPlan(plan)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isDark ? "border border-white/20 bg-white/10 text-white hover:bg-white/15" : "border border-slate-200 bg-white text-[#3D35A8] hover:bg-[#3D35A8]/5"}`}
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className={`w-10 flex items-center justify-center rounded-xl transition-colors ${isDark ? "bg-white/10 text-red-300 hover:bg-red-500 hover:text-white" : "bg-red-50 text-red-500 hover:bg-red-100"}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
          {plans.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-500">
              Belum ada paket. Klik "Tambah Paket" untuk membuat baru.
            </div>
          )}
        </div>
      )}

      {/* ── TAB: LANES ───────────────────────────────────────── */}
      {tab === "lanes" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-[#E8E8EE] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8F8FD] border-b border-[#E8E8EE]">
                  <th className="text-left px-5 py-3.5 text-[#1C2237] font-semibold text-sm">Nama Jalur</th>
                  <th className="text-left px-5 py-3.5 text-[#1C2237] font-semibold text-sm">Deskripsi</th>
                  <th className="text-left px-5 py-3.5 text-[#1C2237] font-semibold text-sm">Biaya Tambahan</th>
                  <th className="text-center px-5 py-3.5 text-[#1C2237] font-semibold text-sm">Status</th>
                  <th className="px-5 py-3.5 text-center text-sm text-gray-400 font-medium w-24">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {lanes.map((lane, i) => (
                  <motion.tr key={lane.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className={`group ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"} hover:bg-[#F0EEFF] transition-colors`}>
                    <td className="px-5 py-3 text-gray-700 text-sm font-medium border-t border-[#E8E8EE]">
                      {lane.name}
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-sm border-t border-[#E8E8EE]">
                      {lane.description}
                    </td>
                    <td className="px-5 py-3 text-gray-700 text-sm font-semibold border-t border-[#E8E8EE]">
                      {lane.priceText} <span className="text-xs text-gray-400 font-normal ml-1">({lane.priceAmount})</span>
                    </td>
                    <td className="px-5 py-3 text-center border-t border-[#E8E8EE]">
                      {lane.isActive ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">Aktif</span>
                      ) : (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">Nonaktif</span>
                      )}
                    </td>
                    <td className="px-5 py-3 border-t border-[#E8E8EE]">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => setEditingLane(lane)} className="w-7 h-7 rounded-lg bg-[#3D35A8]/10 text-[#3D35A8] flex items-center justify-center hover:bg-[#3D35A8]/20 transition-colors" title="Edit">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => deleteLane(lane.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors" title="Hapus">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {lanes.length === 0 && (
            <div className="py-16 text-center">
              <Table2 size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Belum ada jalur. Klik "Tambah Jalur" untuk memulai.</p>
            </div>
          )}
        </motion.div>
      )}



      {/* Note */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
        <p className="text-sm text-amber-700">
          <strong>Catatan:</strong> Semua perubahan di sini akan langsung tercermin di halaman Pricing publik Syntara.
        </p>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {editingPlan && <EditPlanModal plan={editingPlan} onSave={savePlan} onClose={() => setEditingPlan(null)} />}
        {editingLane && <EditLaneModal lane={editingLane} onSave={saveLane} onClose={() => setEditingLane(null)} />}

      </AnimatePresence>
    </div>
  );
}
