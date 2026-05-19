import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Request",
};

export default function FormRequestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
