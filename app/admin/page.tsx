"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Eye, EyeOff, LogIn, Lock, Mail, AlertCircle } from "lucide-react";
import { auth } from "@/lib/admin/adminData";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    auth
      .refresh()
      .then((ok) => {
        if (ok) router.replace("/admin/dashboard");
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const ok = await auth.login(form.email.trim(), form.password);
    if (ok) {
      router.replace("/admin/dashboard");
    } else {
      setError("Email atau password salah. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1C2237] to-[#2A1F5C] flex items-center justify-center px-4 relative overflow-hidden">
      <motion.div
        className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(61,53,168,0.35) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,188,239,0.25) 0%, transparent 70%)" }}
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 9, repeat: Infinity }}
      />

      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-[#3D35A8] via-[#8B7EC8] to-[#00BCEF]" />

          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#3D35A8]/40"
              >
                <Lock size={26} className="text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-[#1C2237]">Admin Syntara</h1>
              <p className="text-gray-400 text-sm mt-1">Masuk ke panel manajemen website</p>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 bg-[#3D35A8]/6 rounded-xl border border-[#3D35A8]/15 mb-6">
              <AlertCircle size={15} className="text-[#3D35A8] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-[#3D35A8] font-semibold mb-0.5">Demo Credentials</p>
                <p className="text-xs text-gray-500">Email: admin@syntara.id</p>
                <p className="text-xs text-gray-500">Password: syntara2024</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1C2237] mb-1.5">Email Admin</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="admin@syntara.id"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10 transition-all bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1C2237] mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3D35A8] focus:ring-2 focus:ring-[#3D35A8]/10 transition-all bg-slate-50"
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle size={15} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm font-semibold text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#3D35A8]/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  <>
                    <LogIn size={18} />
                    Masuk
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">Area terbatas — hanya untuk administrator Syntara</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-white/40 text-sm hover:text-white/70 transition-colors">
            ← Kembali ke website
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
