import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8FD] pt-20">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#3D35A8] mb-4">404</h1>
        <p className="text-gray-500 mb-6">Halaman tidak ditemukan</p>
        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#3D35A8] to-[#00BCEF] text-white font-semibold">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
