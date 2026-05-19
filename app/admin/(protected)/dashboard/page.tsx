"use client";

import { useMemo, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { TrendingUp, Users, FileText, Star, ArrowUpRight, Calendar, MessageCircle } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { adminSeed, ds, subscribeAdminChanges } from "@/lib/admin/adminData";

function Card({ title, value, delta, icon: Icon, gradient }: { title: string; value: string; delta: string; icon: React.ComponentType<{ size?: number; className?: string }>; gradient: string }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-semibold">{title}</p>
          <p className="text-2xl font-black text-[#1C2237] mt-1">{value}</p>
          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold mt-2">
            <ArrowUpRight size={13} />
            {delta}
          </div>
        </div>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${gradient}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const requests = useSyncExternalStore(
    subscribeAdminChanges,
    () => ds.requests.all(),
    () => adminSeed.requests,
  );
  const testimonials = useSyncExternalStore(
    subscribeAdminChanges,
    () => ds.testimonials.all(),
    () => adminSeed.testimonials,
  );
  const blog = useSyncExternalStore(
    subscribeAdminChanges,
    () => ds.blog.all(),
    () => adminSeed.blog,
  );

  const publicRequests = useMemo(() => requests.filter((r) => r.source === "public"), [requests]);
  const newCount = useMemo(() => requests.filter((r) => r.status === "new").length, [requests]);

  const stats = useMemo(() => {
    return {
      leads: requests.length,
      newLeads: newCount,
      testimonials: testimonials.length,
      posts: blog.length,
    };
  }, [requests.length, newCount, testimonials.length, blog.length]);

  const areaData = useMemo(() => {
    // Simple synthetic trend based on current data, stable shape.
    const base = Math.max(6, stats.leads);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return months.slice(0, 6).map((m, idx) => ({
      name: m,
      leads: Math.max(1, Math.round(base * (0.6 + idx * 0.12))),
    }));
  }, [stats.leads]);

  const barData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
    const base = Math.max(3, stats.posts);
    return months.map((m, idx) => ({
      name: m,
      posts: Math.max(1, Math.round(base * (0.5 + idx * 0.08))),
    }));
  }, [stats.posts]);

  const recentRequests = useMemo(() => {
    const sorted = [...publicRequests].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return sorted.slice(0, 5);
  }, [publicRequests]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] rounded-3xl p-6 text-white shadow-xl shadow-[#3D35A8]/25">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm font-semibold">Selamat datang kembali</p>
            <h1 className="text-2xl md:text-3xl font-black">Dashboard Admin Syntara</h1>
            <p className="text-white/70 text-sm mt-1">Ringkasan performa & aktivitas terbaru</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/15 rounded-2xl px-4 py-3">
              <p className="text-white/70 text-xs font-semibold">Request Baru</p>
              <p suppressHydrationWarning className="text-xl font-black">
                {newCount}
              </p>
            </div>
            <div className="bg-white/15 rounded-2xl px-4 py-3">
              <p className="text-white/70 text-xs font-semibold">Total Leads</p>
              <p suppressHydrationWarning className="text-xl font-black">
                {stats.leads}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Leads" value={String(stats.leads)} delta="+12% bulan ini" icon={Users} gradient="bg-gradient-to-br from-[#3D35A8] to-[#4B44C4]" />
        <Card title="Request Baru" value={String(stats.newLeads)} delta="+6% minggu ini" icon={MessageCircle} gradient="bg-gradient-to-br from-[#00BCEF] to-[#1EC8F2]" />
        <Card title="Testimoni" value={String(stats.testimonials)} delta="+3% bulan ini" icon={Star} gradient="bg-gradient-to-br from-[#8B7EC8] to-[#6A5FB0]" />
        <Card title="Artikel" value={String(stats.posts)} delta="+9% bulan ini" icon={FileText} gradient="bg-gradient-to-br from-[#10B981] to-[#059669]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/70 p-5 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[#1C2237] font-bold">Trend Leads</p>
              <p className="text-slate-400 text-sm">6 bulan terakhir</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#3D35A8]/10 flex items-center justify-center">
              <TrendingUp size={18} className="text-[#3D35A8]" />
            </div>
          </div>

          <div className="h-[240px] min-h-[240px] w-full min-w-0">
            <ResponsiveContainer width="100%" height={240} minWidth={0}>
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3D35A8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3D35A8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
                  }}
                  labelStyle={{ color: "#1C2237", fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="leads" stroke="#3D35A8" strokeWidth={3} fill="url(#leadFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/70 p-5 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[#1C2237] font-bold">Publikasi Artikel</p>
              <p className="text-slate-400 text-sm">6 bulan terakhir</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#00BCEF]/10 flex items-center justify-center">
              <Calendar size={18} className="text-[#00BCEF]" />
            </div>
          </div>

          <div className="h-[240px] min-h-[240px] w-full min-w-0">
            <ResponsiveContainer width="100%" height={240} minWidth={0}>
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
                  }}
                  labelStyle={{ color: "#1C2237", fontWeight: 700 }}
                />
                <Bar dataKey="posts" fill="#00BCEF" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/70 overflow-hidden">
        <div className="p-5 border-b border-slate-200/70">
          <p className="text-[#1C2237] font-bold">Request Terbaru</p>
          <p className="text-slate-400 text-sm">5 request terbaru dari form publik</p>
        </div>
        <div className="divide-y divide-slate-200/70">
          {recentRequests.map((r) => (
            <div key={r.id} className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-[#1C2237] truncate">{r.name}</p>
                <p className="text-slate-400 text-sm truncate">{r.whatsapp}</p>
                <p className="text-slate-500 text-sm truncate">{r.service}</p>
                {r.notes && <p className="text-slate-500 text-sm mt-1">{r.notes}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.status === "new" ? "bg-emerald-500/10 text-emerald-700" : r.status === "processing" ? "bg-amber-500/10 text-amber-700" : "bg-slate-500/10 text-slate-700"}`}>
                  {r.status === "new" ? "Baru" : r.status === "processing" ? "Diproses" : "Selesai"}
                </span>
                <span className="text-slate-400 text-xs">{new Date(r.createdAt).toLocaleDateString("id-ID")}</span>
              </div>
            </div>
          ))}
          {recentRequests.length === 0 && <div className="p-6 text-slate-400 text-sm">Belum ada request.</div>}
        </div>
      </div>
    </div>
  );
}
