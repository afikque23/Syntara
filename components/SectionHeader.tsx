"use client";

import { motion } from "motion/react";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

export function SectionHeader({ badge, title, subtitle, center = true, light = false }: SectionHeaderProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className={`mb-12 md:mb-16 ${center ? "text-center" : ""}`}>
      {badge && <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 ${light ? "bg-white/20 text-white" : "bg-[#3D35A8]/10 text-[#3D35A8]"}`}>{badge}</span>}
      <h2 className={`text-3xl md:text-4xl font-bold mb-4 leading-tight ${light ? "text-white" : "text-[#1C2237]"}`}>{title}</h2>
      {subtitle && <p className={`text-lg max-w-2xl ${center ? "mx-auto" : ""} ${light ? "text-white/70" : "text-gray-500"}`}>{subtitle}</p>}
    </motion.div>
  );
}
