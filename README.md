# Syntara - Platform Publikasi Jurnal & Akademik

Syntara adalah aplikasi web modern yang dirancang untuk platform pendampingan publikasi jurnal ilmiah dan akademik (seperti SINTA, Scopus, WoS, dan Elsevier). Project ini dibangun menggunakan **Next.js (App Router)**, **Prisma ORM**, dan **MySQL** sebagai database utamanya, lengkap dengan **Admin Panel Dashboard (CMS)** dinamis untuk pengelolaan konten situs secara langsung tanpa menyentuh kode.

---

## 🚀 Fitur Utama

### Halaman Publik (Frontend)
- **Beranda (Landing Page)**: Hero section interaktif dengan visualisasi data statistik, list keunggulan layanan, produk, testimoni, dan FAQ.
- **Tentang Kami**: Informasi visi, misi, milestone pencapaian, serta kisah perjalanan tim dengan gambar yang dapat diperbarui secara dinamis.
- **Layanan & Produk**: Daftar layanan pendampingan akademik (Editing, Formatting, Translasi, dll) beserta paket harga yang terhubung langsung ke database.
- **Kontak (Hubungi Kami)**: Integrasi tombol chat WhatsApp, email, instagram, jam operasional, serta peta cakupan layanan dinamis.

### Dashboard Admin (CMS Terproteksi)
- **Manajemen Layanan**: Operasi CRUD (Create, Read, Update, Delete) layanan yang langsung tersinkron dengan halaman publik.
- **Manajemen Tentang Kami**: Pengaturan teks hero, narasi kisah kami, keunggulan, serta uploader gambar lokal terintegrasi.
- **Manajemen Blog & Artikel**: Editor artikel (Markdown style) dengan pengaturan cover banner, kategori, tanggal publikasi, status (Draft/Publish), dan artikel unggulan (featured).
- **Pengaturan Umum (General Settings)**:
  - Informasi Brand & Tagline.
  - Sosial media & kontak utama (WhatsApp & Email).
  - Jam Operasional (Senin - Jumat, Sabtu, Minggu, beserta catatan operasional).
  - Lokasi & jangkauan tim (Remote Service).
- **Sistem Upload Media**: Custom API Upload untuk mengunggah berkas gambar langsung ke server lokal (`/public/uploads/`).
- **Autentikasi & Security**: Keamanan dashboard admin menggunakan session/cookie-based auth, rate-limiting API, dan *Audit Log* untuk melacak setiap aktivitas perubahan data.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Database ORM**: [Prisma ORM](https://www.prisma.io/)
- **Database Engine**: MySQL (Kompatibel dengan Laragon / XAMPP)
- **Styling**: Tailwind CSS & Custom CSS
- **Animation**: [Motion (Framer Motion)](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🔧 Panduan Instalasi Lokal

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer lokal Anda:

### 1. Clone Repository
```bash
git clone https://github.com/USERNAME/syntara.git
cd syntara
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables (`.env`)
Salin file `.env.example` menjadi `.env` lalu sesuaikan koneksi database MySQL Anda:
```env
DATABASE_URL="mysql://username:password@127.0.0.1:3306/nama_database"
```
*Catatan: Jika menggunakan Laragon/XAMPP default, gunakan `mysql://root:password@127.0.0.1:3306/syntara_next`.*

### 4. Sinkronisasi Database (Prisma DB Push)
Jalankan perintah berikut untuk membuat tabel database secara otomatis berdasarkan skema Prisma:
```bash
npx prisma db push
```

### 5. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

---

## 📂 Struktur Folder Utama
- `app/` - Kumpulan rute aplikasi Next.js (halaman publik dan panel admin).
- `app/api/` - Endpoint API backend (Layanan, Blog, Testimoni, Settings, Upload).
- `components/` - Komponen UI React reusable.
- `lib/` - Konfigurasi database Prisma, helper autentikasi, rate-limiting, dan penanganan audit log.
- `prisma/` - Skema database (`schema.prisma`) dan file konfigurasi database.
- `public/` - Media statis dan folder penyimpanan unggahan gambar `/uploads/`.
