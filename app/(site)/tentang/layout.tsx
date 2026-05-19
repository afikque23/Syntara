import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami",
};

export default function TentangLayout({ children }: { children: React.ReactNode }) {
  return children;
}
