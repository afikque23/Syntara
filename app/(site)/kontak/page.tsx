"use client";

import { motion } from "motion/react";
import { Phone, Mail, MapPin, Clock, ArrowRight, MessageCircle, Globe } from "lucide-react";
import { useState, useEffect } from "react";

function InstagramIcon({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

const waUrl = "/api/wa?text=Halo%2C+saya+ingin+konsultasi+terkait+publikasi+jurnal";

const contacts = [
  {
    icon: Phone,
    title: "WhatsApp",
    subtitle: "Cara tercepat menghubungi kami",
    value: "+62 812-3456-789",
    action: "Chat Sekarang",
    href: waUrl,
    color: "bg-[#25D366]",
    textColor: "text-[#25D366]",
    badge: null,
  },
  {
    icon: Mail,
    title: "Email",
    subtitle: "Untuk pertanyaan formal",
    value: "info@syntara.id",
    action: "Kirim Email",
    href: "mailto:info@syntara.id",
    color: "bg-[#3D35A8]",
    textColor: "text-[#3D35A8]",
    badge: null,
  },
  {
    icon: InstagramIcon,
    title: "Instagram",
    subtitle: "Follow untuk update terbaru",
    value: "@syntara.id",
    action: "Buka Instagram",
    href: "https://instagram.com/syntara.id",
    color: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
    textColor: "text-[#833AB4]",
    badge: null,
  },
];

const hours = [
  { day: "Senin – Jumat", time: "08.00 – 17.00 WIB" },
  { day: "Sabtu", time: "09.00 – 15.00 WIB" },
  { day: "Minggu & Libur", time: "Tutup (WA 24/7)" },
];

export default function Contact() {
  const [dynamicContacts, setDynamicContacts] = useState(contacts);
  const [dynamicHours, setDynamicHours] = useState(hours);
  const [dynamicNote, setDynamicNote] = useState("WhatsApp tersedia 24/7. Pesan di luar jam kerja akan direspons pada hari kerja berikutnya.");
  const [dynamicLocation, setDynamicLocation] = useState("Indonesia (Remote Service)");
  const [dynamicReach, setDynamicReach] = useState("Seluruh Indonesia & Internasional");

  useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(d => {
      setDynamicContacts(prev => prev.map(c => {
        if (c.title === "WhatsApp" && d.whatsappOriginal) return { ...c, value: d.whatsappOriginal };
        if (c.title === "Email" && d.email) return { ...c, value: d.email, href: `mailto:${d.email}` };
        if (c.title === "Instagram" && d.instagram) return { ...c, value: d.instagram, href: `https://instagram.com/${d.instagram.replace("@", "")}` };
        return c;
      }));

      if (d.hoursWeekday || d.hoursWeekend || d.hoursHoliday) {
        setDynamicHours([
          { day: "Senin – Jumat", time: d.hoursWeekday || "08.00 – 17.00 WIB" },
          { day: "Sabtu", time: d.hoursWeekend || "09.00 – 15.00 WIB" },
          { day: "Minggu & Libur", time: d.hoursHoliday || "Tutup (WA 24/7)" },
        ]);
      }
      
      if (d.hoursNote) setDynamicNote(d.hoursNote);
      if (d.location) setDynamicLocation(d.location);
      if (d.reach) setDynamicReach(d.reach);
    }).catch(() => {});
  }, []);
  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#1C2237] via-[#2A1F5C] to-[#1C2237] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hubungi <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BCEF] to-[#8B7EC8]">Kami</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/70 text-lg">
            Tim kami siap membantu Anda 7 hari seminggu. Pilih cara komunikasi yang paling nyaman untuk Anda.
          </motion.p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 md:py-24 bg-[#F8F8FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {dynamicContacts.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, boxShadow: "0 25px 50px rgba(61,53,168,0.15)" }}
                className="bg-white rounded-2xl border border-[#E8E8EE] overflow-hidden text-center p-8 transition-all duration-300 cursor-pointer group"
              >
                {c.badge && <span className="inline-block px-3 py-1 bg-[#25D366]/10 text-[#25D366] text-xs font-bold rounded-full mb-4">⚡ {c.badge}</span>}
                <div className={`w-16 h-16 ${c.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <c.icon size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-[#1C2237] text-xl mb-1">{c.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{c.subtitle}</p>
                <p className={`font-semibold ${c.textColor} mb-6`}>{c.value}</p>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#3D35A8] text-white rounded-xl font-semibold text-sm hover:bg-[#3230A0] transition-colors">
                  {c.action} <ArrowRight size={16} />
                </a>
              </motion.div>
            ))}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Operating Hours */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl border border-[#E8E8EE] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#3D35A8]/10 rounded-xl flex items-center justify-center">
                  <Clock size={20} className="text-[#3D35A8]" />
                </div>
                <h3 className="font-bold text-[#1C2237]">Jam Operasional</h3>
              </div>
              <div className="space-y-4">
                {dynamicHours.map((h) => (
                  <div key={h.day} className="flex items-center justify-between py-3 border-b border-[#E8E8EE] last:border-0">
                    <span className="text-gray-600 text-sm">{h.day}</span>
                    <span className="font-medium text-[#1C2237] text-sm">{h.time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-[#F8F8FD] rounded-xl flex items-start gap-2">
                <MessageCircle size={16} className="text-[#25D366] mt-0.5 flex-shrink-0" />
                <p className="text-gray-500 text-xs">{dynamicNote}</p>
              </div>
            </motion.div>

            {/* Location & Quick CTA */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-[#E8E8EE] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#3D35A8]/10 rounded-xl flex items-center justify-center">
                  <MapPin size={20} className="text-[#3D35A8]" />
                </div>
                <h3 className="font-bold text-[#1C2237]">Lokasi & Jangkauan</h3>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#00BCEF] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#1C2237] text-sm">Lokasi Tim</p>
                    <p className="text-gray-400 text-sm">{dynamicLocation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe size={16} className="text-[#00BCEF] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#1C2237] text-sm">Jangkauan Layanan</p>
                    <p className="text-gray-400 text-sm">{dynamicReach}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#3D35A8] to-[#00BCEF] rounded-xl p-5">
                <p className="text-white font-semibold mb-2">Butuh bantuan segera?</p>
                <p className="text-white/70 text-sm mb-4">Chat dengan tim kami sekarang via WhatsApp</p>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#3D35A8] rounded-xl font-semibold text-sm hover:shadow-lg transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#25D366]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Quick */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#1C2237] mb-4">Ada Pertanyaan Lain?</h2>
          <p className="text-gray-500 mb-8">Kunjungi halaman FAQ kami atau langsung tanyakan kepada tim Syntara via WhatsApp</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-[#3D35A8]/30 transition-all duration-300 hover:-translate-y-1"
            >
              Tanya via WhatsApp <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
