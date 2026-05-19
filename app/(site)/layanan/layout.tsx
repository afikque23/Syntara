import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Layanan",
};

export default function LayananLayout({ children }: { children: React.ReactNode }) {
  return children;
}
