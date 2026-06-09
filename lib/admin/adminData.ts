export interface AdminRequest {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  service: string;
  notes: string;
  adminNotes?: string | null;
  status: "new" | "processing" | "done";
  source: "public" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface AdminService {
  id: string;
  name: string;
  description: string;
  tagline?: string | null;
  highlight?: string | null;
  icon: string;
  estimasi: string;
  color: string;
  features: string[];
  previewFeatures?: string[];
}

export interface AdminPricing {
  id: string;
  name: string;
  price: string;
  priceAmount: number;
  description: string;
  features: string[];
  notIncluded?: string[];
  badge: string;
  popular: boolean;
  isActive: boolean;
}

export interface AdminPublicationLane {
  id: string;
  name: string;
  description: string;
  priceAmount: number;
  priceText: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ComparisonValue = boolean | string;

export interface ComparisonRow {
  id: string;
  feature: string;
  values: ComparisonValue[];
  sortOrder: number;
}

export interface AdminTestimonial {
  id: string;
  name: string;
  institution: string;
  role: string;
  comment: string;
  rating: number;
  journal: string;
}

export interface AdminTestimonialImage {
  id: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBlog {
  id: string;
  title: string;
  excerpt: string;
  content?: string | null;
  category: string;
  date: string;
  readTime: string;
  published: boolean;
  featured?: boolean;
  image?: string | null;
  author?: string | null;
  authorRole?: string | null;
  color?: string | null;
}

export interface AdminFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  brand: string;
  whatsapp: string;
  email: string;
  instagram: string;
  tagline: string;
}

export type AboutStat = { val: string; label: string };
export type AboutMilestone = { year: string; event: string };

export type AboutContent = {
  hero: { title: string; subtitle: string };
  story: {
    heading: string;
    paragraph1: string;
    paragraph2: string;
    bullets: string[];
    image: string;
  };
  stats: AboutStat[];
  vision: string;
  mission: string;
  values: string;
  milestones: AboutMilestone[];
};

export const ADMIN_EMAIL = "admin@syntara.id";
export const ADMIN_PASSWORD = "syntara2024";

const seedRequests: AdminRequest[] = [
  {
    id: "1",
    name: "Ahmad Fauzi, M.Si.",
    whatsapp: "6281234567890",
    email: "",
    service: "Full Service Premium",
    notes: "Naskah jurnal kedokteran 8000 kata, target Scopus Q2",
    adminNotes: "",
    status: "new",
    source: "public",
    createdAt: "2026-04-09T08:30:00Z",
    updatedAt: "2026-04-09T08:30:00Z",
  },
  {
    id: "2",
    name: "Rina Wahyuni",
    whatsapp: "6289876543210",
    email: "",
    service: "Editing & Proofreading",
    notes: "Jurnal pendidikan untuk SINTA 2, perlu editing grammar",
    adminNotes: "",
    status: "new",
    source: "public",
    createdAt: "2026-04-08T14:20:00Z",
    updatedAt: "2026-04-08T14:20:00Z",
  },
  {
    id: "3",
    name: "Dr. Hadi Prasetyo",
    whatsapp: "6285551234567",
    email: "",
    service: "Translasi Akademik",
    notes: "Terjemah Indonesia ke Inggris, naskah teknik sipil 6000 kata",
    adminNotes: "",
    status: "processing",
    source: "public",
    createdAt: "2026-04-07T10:15:00Z",
    updatedAt: "2026-04-07T10:15:00Z",
  },
  {
    id: "4",
    name: "Mega Sari, S.T.",
    whatsapp: "6281298765432",
    email: "",
    service: "Formatting Jurnal",
    notes: "Template IEEE, jurnal elektronika dan instrumentasi",
    adminNotes: "",
    status: "processing",
    source: "public",
    createdAt: "2026-04-06T09:00:00Z",
    updatedAt: "2026-04-06T09:00:00Z",
  },
  {
    id: "5",
    name: "Prof. Bambang Surya",
    whatsapp: "6281345678901",
    email: "",
    service: "Full Service Premium",
    notes: "Jurnal agrikultur Q1, butuh pendampingan sampai accepted",
    adminNotes: "",
    status: "done",
    source: "public",
    createdAt: "2026-04-05T16:45:00Z",
    updatedAt: "2026-04-05T16:45:00Z",
  },
  {
    id: "6",
    name: "Laila Nuraini, M.Pd.",
    whatsapp: "6287812345678",
    email: "",
    service: "Konsultasi Jurnal",
    notes: "Baru pertama kali publish, butuh arahan jurnal yang tepat",
    adminNotes: "",
    status: "done",
    source: "public",
    createdAt: "2026-04-04T11:00:00Z",
    updatedAt: "2026-04-04T11:00:00Z",
  },
];

const seedServices: AdminService[] = [
  {
    id: "1",
    name: "Editing & Proofreading",
    tagline: "Sempurnakan Tulisan Akademik Anda",
    highlight: "Paling Diminati",
    description: "Perbaikan grammar, struktur kalimat, dan academic tone yang sempurna",
    icon: "Edit3",
    estimasi: "3–5 hari kerja",
    color: "from-[#3D35A8] to-[#5B50C8]",
    features: ["Perbaikan grammar & struktur kalimat", "Academic tone improvement", "Clarity & coherence enhancement", "Highlight revisi yang transparan", "Pengecekan konsistensi terminologi", "Proofreading final sebelum submit"],
  },
  {
    id: "2",
    name: "Formatting Jurnal",
    tagline: "Format Tepat, Submit Langsung",
    highlight: null,
    description: "Penyesuaian template, sitasi APA/IEEE, tabel & gambar sesuai standar",
    icon: "FileText",
    estimasi: "2–4 hari kerja",
    color: "from-[#5B50C8] to-[#8B7EC8]",
    features: ["Penyesuaian template jurnal target", "Sitasi APA, IEEE, AMA, Vancouver", "Formatting tabel & gambar", "Abstrak & keywords optimization", "Reference list formatting", "Supplementary materials"],
  },
  {
    id: "3",
    name: "Translasi Akademik",
    tagline: "Bahasa Bukan Hambatan",
    highlight: null,
    description: "Terjemahan Indonesia ↔ English dengan academic rewriting berkualitas",
    icon: "Globe",
    estimasi: "3–5 hari kerja",
    color: "from-[#00BCEF] to-[#0099CC]",
    features: ["Terjemahan Indonesia ke English", "Terjemahan English ke Indonesia", "Academic rewriting & paraphrasing", "Native-level language quality", "Field-specific terminology", "Quality assurance review"],
  },
  {
    id: "4",
    name: "Konsultasi Jurnal",
    tagline: "Strategi Tepat, Hasil Maksimal",
    highlight: null,
    description: "Rekomendasi jurnal yang tepat dan strategi submit yang efektif",
    icon: "MessageSquare",
    estimasi: "1 hari kerja",
    color: "from-[#8B7EC8] to-[#3D35A8]",
    features: ["Analisis kesesuaian topik jurnal", "Rekomendasi jurnal Q1/Q2/Q3", "Scopus & WoS indexed journals", "Strategi submission yang efektif", "Analisis scope & aim jurnal", "Author guidelines review"],
  },
  {
    id: "5",
    name: "Pendampingan Submit",
    tagline: "Dari Submit Hingga Accepted",
    highlight: "Terlengkap",
    description: "Bantuan upload jurnal, cover letter, dan follow-up revisi reviewer",
    icon: "Send",
    estimasi: "1–3 hari kerja",
    color: "from-[#3D35A8] to-[#00BCEF]",
    features: ["Bantuan upload di sistem jurnal", "Cover letter profesional", "Respon revisi reviewer", "Resubmission assistance", "Follow-up status jurnal", "Pendampingan hingga accepted"],
  },
];

const seedPricing: AdminPricing[] = [
  {
    id: "1",
    name: "Basic",
    price: "Rp 350.000",
    priceAmount: 350000,
    description: "Ideal untuk koreksi dasar & proofreading",
    features: ["Editing grammar & struktur", "Proofreading menyeluruh", "1x revisi gratis", "Feedback umum", "Estimasi 3–5 hari kerja"],
    notIncluded: ["Formatting template jurnal", "Translasi", "Konsultasi jurnal target"],
    badge: "",
    popular: false,
    isActive: true,
  },
  {
    id: "2",
    name: "Standard",
    price: "Rp 750.000",
    priceAmount: 750000,
    description: "Paket editing & formatting siap submit",
    features: ["Full editing & academic tone", "Formatting template jurnal", "Sitasi APA/IEEE/Vancouver", "Formatting tabel & gambar", "2x revisi gratis", "Konsultasi singkat", "Estimasi 5–7 hari kerja"],
    notIncluded: ["Translasi bahasa", "Pendampingan submit"],
    badge: "Paling Populer",
    popular: true,
    isActive: true,
  },
  {
    id: "3",
    name: "Premium",
    price: "Rp 1.500.000",
    priceAmount: 1500000,
    description: "Full service dari editing hingga jurnal diterima",
    features: [
      "Full editing & proofreading",
      "Academic tone & clarity",
      "Revisi unlimited",
      "Formatting lengkap",
      "Translasi jika diperlukan",
      "Konsultasi jurnal target",
      "Cover letter profesional",
      "Pendampingan submit",
      "Respon revisi reviewer",
    ],
    notIncluded: [],
    badge: "Terlengkap",
    popular: false,
    isActive: true,
  },
];

const seedLanes: AdminPublicationLane[] = [
  { id: "1", name: "Biasa", description: "Penyelesaian sesuai antrian normal", priceAmount: 0, priceText: "Rp 0", isActive: true },
  { id: "2", name: "Regular", description: "Prioritas standar", priceAmount: 350000, priceText: "Rp 350.000", isActive: true },
  { id: "3", name: "Fast Track", description: "Penyelesaian lebih cepat", priceAmount: 750000, priceText: "Rp 750.000", isActive: true }
];

const seedPricingComparison: ComparisonRow[] = [
  { id: "1", feature: "Editing & Proofreading", values: [true, true, true], sortOrder: 10 },
  { id: "2", feature: "Academic Tone", values: ["Dasar", true, true], sortOrder: 20 },
  { id: "3", feature: "Jumlah Revisi", values: ["1x", "2x", "Unlimited"], sortOrder: 30 },
  { id: "4", feature: "Formatting Template", values: [false, true, true], sortOrder: 40 },
  { id: "5", feature: "Sitasi & Referensi", values: ["Dasar", true, true], sortOrder: 50 },
  { id: "6", feature: "Tabel & Gambar", values: [false, true, true], sortOrder: 60 },
  { id: "7", feature: "Translasi", values: [false, false, "Opsional"], sortOrder: 70 },
  { id: "8", feature: "Konsultasi Jurnal Target", values: [false, "Singkat", true], sortOrder: 80 },
  { id: "9", feature: "Cover Letter", values: [false, false, true], sortOrder: 90 },
  { id: "10", feature: "Pendampingan Submit", values: [false, false, true], sortOrder: 100 },
  { id: "11", feature: "Revisi Reviewer", values: [false, false, true], sortOrder: 110 },
];

const seedTestimonials: AdminTestimonial[] = [
  {
    id: "1",
    name: "Dr. Rahmat Hidayat",
    institution: "Universitas Indonesia",
    role: "Dosen Teknik Informatika",
    comment: "Syntara sangat membantu proses publikasi jurnal saya di IEEE Access. Dalam waktu seminggu naskah sudah siap submit!",
    rating: 5,
    journal: "IEEE Access Q2",
  },
  {
    id: "2",
    name: "Siti Aminah, M.Si.",
    institution: "BRIN",
    role: "Peneliti Senior",
    comment: "Tim yang sangat responsif dan profesional. Jurnal saya akhirnya diterima di Scopus Q1!",
    rating: 5,
    journal: "Scopus Q1",
  },
  {
    id: "3",
    name: "Prof. Dr. Budi Santoso",
    institution: "IPB University",
    role: "Guru Besar",
    comment: "Jurnal yang ditolak 2 kali akhirnya diterima setelah direvisi tim Syntara. Luar biasa!",
    rating: 5,
    journal: "Elsevier Q2",
  },
  {
    id: "4",
    name: "Nurhakim, M.Pd.",
    institution: "Universitas Negeri Makassar",
    role: "Dosen Pendidikan",
    comment: "Sebagai dosen muda yang baru mulai publikasi internasional, Syntara sangat membantu!",
    rating: 5,
    journal: "ERIC Database",
  },
];

const seedFaqs: AdminFaq[] = [];

const seedTestimonialImages: AdminTestimonialImage[] = [];

const seedBlog: AdminBlog[] = [
  {
    id: "1",
    title: "Cara Publish Jurnal Internasional: Panduan Lengkap untuk Pemula",
    excerpt: "Memublikasikan jurnal di jurnal internasional bereputasi adalah impian banyak peneliti. Panduan ini membantu Anda memahami setiap langkahnya.",
    content: "",
    category: "Panduan Jurnal",
    date: "2026-04-05",
    readTime: "8 menit",
    published: true,
    featured: false,
    image: "",
    author: "",
    authorRole: "Editor Syntara",
    color: "from-[#3D35A8] to-[#00BCEF]",
  },
  {
    id: "2",
    title: "10 Tips Ampuh Agar Jurnal Anda Lolos Review",
    excerpt: "Penolakan jurnal adalah hal yang umum, namun bisa diminimalkan dengan strategi yang tepat dari peneliti berpengalaman.",
    content: "",
    category: "Tips Publikasi",
    date: "2026-04-02",
    readTime: "6 menit",
    published: true,
    featured: false,
    image: "",
    author: "",
    authorRole: "Editor Syntara",
    color: "from-[#3D35A8] to-[#00BCEF]",
  },
  {
    id: "3",
    title: "7 Kesalahan Umum yang Bikin Jurnal Anda Ditolak",
    excerpt: "Dari format yang salah hingga metodologi yang lemah, ketahui kesalahan-kesalahan fatal dalam proses publikasi.",
    content: "",
    category: "Kesalahan Umum",
    date: "2026-03-28",
    readTime: "5 menit",
    published: true,
    featured: false,
    image: "",
    author: "",
    authorRole: "Editor Syntara",
    color: "from-[#3D35A8] to-[#00BCEF]",
  },
  {
    id: "4",
    title: "Perbedaan Scopus Q1, Q2, Q3, Q4",
    excerpt: "Memilih quartile jurnal yang tepat sangat penting untuk karier akademik Anda. Pelajari perbedaan dan strategi memilih.",
    content: "",
    category: "Strategi Submit",
    date: "2026-03-25",
    readTime: "7 menit",
    published: true,
    featured: false,
    image: "",
    author: "",
    authorRole: "Editor Syntara",
    color: "from-[#3D35A8] to-[#00BCEF]",
  },
  {
    id: "5",
    title: "Panduan Lengkap Sitasi APA, IEEE, dan Vancouver",
    excerpt: "Format sitasi yang benar adalah salah satu syarat mutlak dalam publikasi jurnal internasional bereputasi.",
    content: "",
    category: "Panduan Jurnal",
    date: "2026-03-20",
    readTime: "10 menit",
    published: false,
    featured: false,
    image: "",
    author: "",
    authorRole: "Editor Syntara",
    color: "from-[#3D35A8] to-[#00BCEF]",
  },
];

const seedSettings: SiteSettings = {
  brand: "Syntara",
  whatsapp: "628123456789",
  email: "info@syntara.id",
  instagram: "@syntara.id",
  tagline: "Platform Publikasi Jurnal #1 Indonesia",
};

export const adminSeed = {
  requests: seedRequests,
  services: seedServices,
  pricing: seedPricing,
  lanes: seedLanes,
  pricingComparison: seedPricingComparison,
  testimonials: seedTestimonials,
  faqs: seedFaqs,
  testimonialImages: seedTestimonialImages,
  blog: seedBlog,
  settings: seedSettings,
};

const ADMIN_CHANGE_EVENT = "syn_admin_change";

function isBrowser() {
  return typeof window !== "undefined";
}

type AuthState = { loggedIn: boolean; email: string; checked: boolean };
type State = {
  auth: AuthState;
  requests: AdminRequest[];
  services: AdminService[];
  pricing: AdminPricing[];
  lanes: AdminPublicationLane[];
  pricingComparison: ComparisonRow[];
  testimonials: AdminTestimonial[];
  faqs: AdminFaq[];
  testimonialImages: AdminTestimonialImage[];
  blog: AdminBlog[];
  settings: SiteSettings;
  about: AboutContent;
};

const seedAbout: AboutContent = {
  hero: { title: "Tentang Syntara", subtitle: "" },
  story: {
    heading: "Kisah Kami",
    paragraph1: "",
    paragraph2: "",
    bullets: ["Poin baru..."],
    image: "",
  },
  stats: [
    { val: "0+", label: "Jurnal" },
    { val: "0+", label: "Klien" },
    { val: "0%", label: "Sukses" },
    { val: "0★", label: "Rating" },
  ],
  vision: "",
  mission: "",
  values: "",
  milestones: [{ year: String(new Date().getFullYear()), event: "Pencapaian baru..." }],
};

const state: State = {
  auth: { loggedIn: false, email: "", checked: false },
  requests: seedRequests,
  services: seedServices,
  pricing: seedPricing,
  lanes: seedLanes,
  pricingComparison: seedPricingComparison,
  testimonials: seedTestimonials,
  faqs: seedFaqs,
  testimonialImages: seedTestimonialImages,
  blog: seedBlog,
  settings: seedSettings,
  about: seedAbout,
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function normalizeText(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function normalizeStats(v: unknown): AboutStat[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => {
      if (!isRecord(x)) return null;
      const val = normalizeText(x.val).trim();
      const label = normalizeText(x.label).trim();
      if (!val || !label) return null;
      return { val, label };
    })
    .filter((x): x is AboutStat => x !== null);
}

function normalizeMilestones(v: unknown): AboutMilestone[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => {
      if (!isRecord(x)) return null;
      const year = normalizeText(x.year).trim();
      const event = normalizeText(x.event).trim();
      if (!year || !event) return null;
      return { year, event };
    })
    .filter((x): x is AboutMilestone => x !== null);
}

function normalizeStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeAboutFromSiteData(siteData: unknown, fallback: AboutContent): AboutContent {
  const d = isRecord(siteData) ? siteData : {};

  const heroObj = isRecord(d.hero) ? d.hero : null;
  const storyObj = isRecord(d.story) ? d.story : null;

  const heroTitle = normalizeText(heroObj?.title ?? d.heroTitle).trim() || fallback.hero.title;
  const heroSubtitle = normalizeText(heroObj?.subtitle ?? d.heroSubtitle) || fallback.hero.subtitle;

  const storyHeading = normalizeText(storyObj?.heading ?? d.storyTitle).trim() || fallback.story.heading;
  const storyParagraphs = Array.isArray(d.storyParagraphs) ? d.storyParagraphs : [];
  const p1 = normalizeText(storyObj?.paragraph1 ?? storyParagraphs[0]) || fallback.story.paragraph1;
  const p2 = normalizeText(storyObj?.paragraph2 ?? storyParagraphs[1]) || fallback.story.paragraph2;

  const bullets = normalizeStringArray(storyObj?.bullets ?? d.storyBullets);
  const stats = normalizeStats(d.stats);
  const milestones = normalizeMilestones(d.milestones);

  const vision = normalizeText((d as Record<string, unknown>).vision ?? d.visionDesc) || fallback.vision;
  const mission = normalizeText((d as Record<string, unknown>).mission ?? d.missionDesc) || fallback.mission;
  const values = normalizeText((d as Record<string, unknown>).values ?? d.valuesDesc) || fallback.values;

  return {
    hero: { title: heroTitle, subtitle: heroSubtitle },
    story: {
      heading: storyHeading,
      paragraph1: p1,
      paragraph2: p2,
      bullets: bullets.length > 0 ? bullets : fallback.story.bullets,
      image: normalizeText(storyObj?.image ?? d.storyImage) || fallback.story.image,
    },
    stats: stats.length > 0 ? stats : fallback.stats,
    vision,
    mission,
    values,
    milestones: milestones.length > 0 ? milestones : fallback.milestones,
  };
}

function emit() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(ADMIN_CHANGE_EVENT));
}

function setAuth(next: Partial<AuthState>) {
  state.auth = { ...state.auth, ...next };
  emit();
}

function set<K extends keyof Omit<State, "auth">>(key: K, value: State[K]) {
  state[key] = value;
  emit();
}

async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let msg = `Request failed: ${res.status}`;
    try {
      const j: unknown = await res.json();
      if (j && typeof j === "object" && "error" in j) {
        const err = (j as Record<string, unknown>).error;
        msg = err ? String(err) : msg;
      }
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  return (await res.json()) as T;
}

let bootstrapPromise: Promise<void> | null = null;
export function bootstrapAdminData(): Promise<void> {
  if (!isBrowser()) return Promise.resolve();
  if (bootstrapPromise) return bootstrapPromise;
  bootstrapPromise = fetch("/api/admin/bootstrap", { method: "POST", credentials: "include" })
    .then(() => {})
    .catch(() => {});
  return bootstrapPromise;
}

export function emitAdminChange() {
  emit();
}

export function subscribeAdminChanges(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(ADMIN_CHANGE_EVENT, callback);
  return () => window.removeEventListener(ADMIN_CHANGE_EVENT, callback);
}

export const auth = {
  isLoggedIn(): boolean {
    return state.auth.loggedIn;
  },
  getEmail(): string {
    return state.auth.email;
  },
  isChecked(): boolean {
    return state.auth.checked;
  },
  async refresh(): Promise<boolean> {
    if (!isBrowser()) return false;
    try {
      const me = await apiJson<{ ok: boolean; email?: string }>("/api/admin/auth/me", { method: "GET" });
      if (me.ok) {
        setAuth({ loggedIn: true, email: me.email ?? "", checked: true });
        return true;
      }
    } catch {
      // ignore
    }
    setAuth({ loggedIn: false, email: "", checked: true });
    return false;
  },
  async login(email: string, password: string): Promise<boolean> {
    if (!isBrowser()) return false;
    try {
      const res = await apiJson<{ ok: boolean; email?: string }>("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setAuth({ loggedIn: true, email: res.email ?? email, checked: true });
        return true;
      }
    } catch {
      // ignore
    }
    setAuth({ loggedIn: false, email: "", checked: true });
    return false;
  },
  async logout() {
    if (!isBrowser()) return;
    try {
      await fetch("/api/admin/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // ignore
    }
    setAuth({ loggedIn: false, email: "", checked: true });
  },
};

export const ds = {
  refreshAll: async () => {
    await Promise.all([
      ds.requests.refresh(),
      ds.services.refresh(),
      ds.pricing.refresh(),
      ds.lanes.refresh(),
      ds.comparison.refresh(),
      ds.testimonials.refresh(),
      ds.faq.refresh(),
      ds.testimonialImages.refresh(),
      ds.blog.refresh(),
      ds.settings.refresh(),
      ds.about.refresh(),
    ]).catch(() => {});
  },
  about: {
    get: () => state.about,
    refresh: async () => {
      if (!isBrowser()) return;
      try {
        const res = await apiJson<{ data: unknown; published: boolean; updatedAt: string | null }>("/api/admin/about", { method: "GET" });
        const next = normalizeAboutFromSiteData(res.data, state.about);
        set("about", next);
      } catch {
        // ignore
      }
    },
    save: async (content: AboutContent) => {
      if (!isBrowser()) return;

      let currentData: Record<string, unknown> = {};
      let published: boolean | undefined = undefined;
      try {
        const res = await apiJson<{ data: unknown; published: boolean; updatedAt: string | null }>("/api/admin/about", { method: "GET" });
        currentData = isRecord(res.data) ? (res.data as Record<string, unknown>) : {};
        published = res.published;
      } catch {
        currentData = {};
      }

      const nextData: Record<string, unknown> = { ...currentData };
      if (typeof nextData.heroHighlight !== "string" || !(nextData.heroHighlight as string).trim()) nextData.heroHighlight = "Syntara";
      if (typeof nextData.storyBadge !== "string" || !(nextData.storyBadge as string).trim()) nextData.storyBadge = "Kisah Kami";

      nextData.heroTitle = content.hero.title.trim();
      nextData.heroSubtitle = content.hero.subtitle;
      nextData.storyTitle = content.story.heading.trim();

      const storyParagraphs = [content.story.paragraph1, content.story.paragraph2].map((s) => s.trim()).filter(Boolean);
      nextData.storyParagraphs = storyParagraphs;

      nextData.storyBullets = content.story.bullets.map((s) => s.trim()).filter(Boolean);
      nextData.storyImage = typeof content.story.image === "string" ? content.story.image.trim() : "";
      nextData.stats = content.stats.map((s) => ({ val: String(s.val ?? "").trim(), label: String(s.label ?? "").trim() })).filter((s) => s.val && s.label);

      nextData.visionDesc = content.vision;
      nextData.missionDesc = content.mission;
      nextData.valuesDesc = content.values;

      nextData.milestones = content.milestones.map((m) => ({ year: String(m.year ?? "").trim(), event: String(m.event ?? "").trim() })).filter((m) => m.year && m.event);

      await apiJson<{ data: unknown }>("/api/admin/about", {
        method: "PUT",
        body: JSON.stringify({ data: nextData, ...(typeof published === "boolean" ? { published } : {}) }),
      });

      set("about", JSON.parse(JSON.stringify(content)) as AboutContent);
    },
  },
  requests: {
    all: () => state.requests,
    refresh: async () => {
      if (!isBrowser()) return;
      try {
        const rows = await apiJson<unknown[]>("/api/admin/requests", { method: "GET" });
        set(
          "requests",
          rows.map((row) => {
            const r = (row ?? {}) as Record<string, unknown>;
            const status = r.status;
            const adminNotes = r.adminNotes;
            const source = r.source;
            return {
              id: String(r.id),
              name: String(r.name ?? ""),
              whatsapp: String(r.whatsapp ?? ""),
              email: String(r.email ?? ""),
              service: String(r.service ?? ""),
              notes: String(r.notes ?? ""),
              adminNotes: typeof adminNotes === "string" ? adminNotes : adminNotes === null ? null : undefined,
              status: (status === "processing" || status === "done" || status === "new" ? status : "new") as AdminRequest["status"],
              source: (source === "admin" || source === "public" ? source : "public") as AdminRequest["source"],
              createdAt: typeof r.createdAt === "string" ? r.createdAt : new Date().toISOString(),
              updatedAt: typeof r.updatedAt === "string" ? r.updatedAt : typeof r.createdAt === "string" ? r.createdAt : new Date().toISOString(),
            };
          }),
        );
      } catch {
        // ignore
      }
    },
    update: (id: string, patch: Partial<AdminRequest>) => {
      const now = new Date().toISOString();
      set(
        "requests",
        state.requests.map((r) => (r.id === id ? { ...r, ...patch, updatedAt: patch.updatedAt ?? now } : r)),
      );
      void apiJson(`/api/admin/requests/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      })
        .then(() => ds.requests.refresh())
        .catch(() => ds.requests.refresh());
    },
    add: (d: Omit<AdminRequest, "id" | "createdAt" | "updatedAt" | "source">) => {
      const now = new Date().toISOString();
      const optimistic: AdminRequest = {
        ...d,
        source: "admin",
        id: `tmp_${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      set("requests", [optimistic, ...state.requests]);
      void apiJson("/api/admin/requests", {
        method: "POST",
        body: JSON.stringify({ ...d }),
      })
        .then(() => ds.requests.refresh())
        .catch(() => ds.requests.refresh());
    },
    del: (id: string) => {
      set(
        "requests",
        state.requests.filter((r) => r.id !== id),
      );
      void apiJson(`/api/admin/requests/${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
        .then(() => ds.requests.refresh())
        .catch(() => ds.requests.refresh());
    },
  },
  services: {
    all: () => state.services,
    refresh: async () => {
      if (!isBrowser()) return;
      try {
        const rows = await apiJson<AdminService[]>("/api/admin/services", { method: "GET" });
        set(
          "services",
          rows.map((row) => ({
            ...row,
            features: Array.isArray((row as unknown as { features?: unknown }).features)
              ? (row as unknown as { features: unknown[] }).features
                  .filter((x): x is string => typeof x === "string")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [],
            previewFeatures: Array.isArray((row as unknown as { previewFeatures?: unknown }).previewFeatures)
              ? (row as unknown as { previewFeatures: unknown[] }).previewFeatures
                  .filter((x): x is string => typeof x === "string")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [],
          })),
        );
      } catch {
        // ignore
      }
    },
    add: (d: Omit<AdminService, "id">) => {
      const optimistic: AdminService = { ...d, id: `tmp_${Date.now()}` };
      set("services", [...state.services, optimistic]);
      void apiJson<AdminService>("/api/admin/services", {
        method: "POST",
        body: JSON.stringify(d),
      })
        .then(() => ds.services.refresh())
        .catch(() => ds.services.refresh());
    },
    update: (id: string, patch: Partial<AdminService>) => {
      set(
        "services",
        state.services.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      );
      void apiJson(`/api/admin/services/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      })
        .then(() => ds.services.refresh())
        .catch(() => ds.services.refresh());
    },
    del: (id: string) => {
      set(
        "services",
        state.services.filter((s) => s.id !== id),
      );
      void apiJson(`/api/admin/services/${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
        .then(() => ds.services.refresh())
        .catch(() => ds.services.refresh());
    },
  },
  pricing: {
    all: () => state.pricing,
    refresh: async () => {
      if (!isBrowser()) return;
      try {
        const rows = await apiJson<unknown[]>("/api/admin/pricing", { method: "GET" });
        set(
          "pricing",
          rows.map((row) => {
            const p = (row ?? {}) as Record<string, unknown>;
            return {
              id: String(p.id),
              name: String(p.name ?? ""),
              price: String(p.price ?? ""),
              priceAmount: typeof p.priceAmount === "number" ? p.priceAmount : 0,
              description: String(p.description ?? ""),
              features: Array.isArray(p.features) ? (p.features as unknown[]).map(String) : [],
              notIncluded: Array.isArray(p.notIncluded) ? (p.notIncluded as unknown[]).map(String) : [],
              badge: String(p.badge ?? ""),
              popular: !!p.popular,
              isActive: typeof p.isActive === "boolean" ? p.isActive : true,
            };
          }).sort((a, b) => a.priceAmount - b.priceAmount),
        );
      } catch {
        // ignore
      }
    },
    add: (d: Omit<AdminPricing, "id">) => {
      const optimistic: AdminPricing = { ...d, id: `tmp_${Date.now()}` };
      set("pricing", [...state.pricing, optimistic].sort((a, b) => a.priceAmount - b.priceAmount));
      void apiJson("/api/admin/pricing", {
        method: "POST",
        body: JSON.stringify(d),
      })
        .then(() => ds.pricing.refresh())
        .catch(() => ds.pricing.refresh());
    },
    update: (id: string, patch: Partial<AdminPricing>) => {
      set(
        "pricing",
        state.pricing.map((p) => (p.id === id ? { ...p, ...patch } : p)).sort((a, b) => a.priceAmount - b.priceAmount),
      );
      void apiJson(`/api/admin/pricing/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      })
        .then(() => ds.pricing.refresh())
        .catch(() => ds.pricing.refresh());
    },
    del: (id: string) => {
      set(
        "pricing",
        state.pricing.filter((p) => p.id !== id),
      );
      void apiJson(`/api/admin/pricing/${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
        .then(() => ds.pricing.refresh())
        .catch(() => ds.pricing.refresh());
    },
  },
  lanes: {
    all: () => state.lanes,
    refresh: async () => {
      if (!isBrowser()) return;
      try {
        const rows = await apiJson<unknown[]>("/api/admin/lanes", { method: "GET" });
        set(
          "lanes",
          rows.map((row) => {
            const p = (row ?? {}) as Record<string, unknown>;
            return {
              id: String(p.id),
              name: String(p.name ?? ""),
              description: String(p.description ?? ""),
              priceAmount: typeof p.priceAmount === "number" ? p.priceAmount : 0,
              priceText: String(p.priceText ?? ""),
              isActive: typeof p.isActive === "boolean" ? p.isActive : true,
            };
          }).sort((a, b) => a.priceAmount - b.priceAmount),
        );
      } catch {
        // ignore
      }
    },
    add: (d: Omit<AdminPublicationLane, "id" | "createdAt" | "updatedAt">) => {
      const optimistic: AdminPublicationLane = { ...d, id: `tmp_${Date.now()}` };
      set("lanes", [...state.lanes, optimistic].sort((a, b) => a.priceAmount - b.priceAmount));
      void apiJson("/api/admin/lanes", {
        method: "POST",
        body: JSON.stringify(d),
      })
        .then(() => ds.lanes.refresh())
        .catch(() => ds.lanes.refresh());
    },
    update: (id: string, patch: Partial<AdminPublicationLane>) => {
      set(
        "lanes",
        state.lanes.map((p) => (p.id === id ? { ...p, ...patch } : p)).sort((a, b) => a.priceAmount - b.priceAmount),
      );
      void apiJson(`/api/admin/lanes/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      })
        .then(() => ds.lanes.refresh())
        .catch(() => ds.lanes.refresh());
    },
    del: (id: string) => {
      set(
        "lanes",
        state.lanes.filter((p) => p.id !== id),
      );
      void apiJson(`/api/admin/lanes/${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
        .then(() => ds.lanes.refresh())
        .catch(() => ds.lanes.refresh());
    },
  },

  comparison: {
    all: () => state.pricingComparison,
    refresh: async () => {
      if (!isBrowser()) return;
      try {
        const rows = await apiJson<unknown[]>("/api/admin/pricing-comparison", { method: "GET" });
        set(
          "pricingComparison",
          rows
            .map((row) => {
              const r = (row ?? {}) as Record<string, unknown>;
              const id = String(r.id ?? "");
              const feature = String(r.feature ?? "").trim();
              const valuesRaw = r.values;
              const values = Array.isArray(valuesRaw)
                ? valuesRaw
                    .filter((x): x is boolean | string => typeof x === "boolean" || typeof x === "string")
                    .map((x) => (typeof x === "string" ? x.trim() : x))
                    .map((x) => (typeof x === "string" && !x ? false : x))
                : [];
              const sortOrder = typeof r.sortOrder === "number" && Number.isFinite(r.sortOrder) ? Math.floor(r.sortOrder) : 0;

              if (!id || !feature) return null;
              return { id, feature, values, sortOrder } satisfies ComparisonRow;
            })
            .filter((x): x is ComparisonRow => x !== null)
            .sort((a, b) => a.sortOrder - b.sortOrder),
        );
      } catch {
        // ignore
      }
    },
    add: (d: Omit<ComparisonRow, "id">) => {
      const optimistic: ComparisonRow = { ...d, id: `tmp_${Date.now()}` };
      set(
        "pricingComparison",
        [...state.pricingComparison, optimistic].sort((a, b) => a.sortOrder - b.sortOrder),
      );

      void apiJson<ComparisonRow>("/api/admin/pricing-comparison", {
        method: "POST",
        body: JSON.stringify(d),
      })
        .then(() => ds.comparison.refresh())
        .catch(() => ds.comparison.refresh());
    },
    update: (id: string, patch: Partial<ComparisonRow>) => {
      set(
        "pricingComparison",
        state.pricingComparison.map((r) => (r.id === id ? { ...r, ...patch } : r)).sort((a, b) => a.sortOrder - b.sortOrder),
      );
      void apiJson(`/api/admin/pricing-comparison/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      })
        .then(() => ds.comparison.refresh())
        .catch(() => ds.comparison.refresh());
    },
    del: (id: string) => {
      set(
        "pricingComparison",
        state.pricingComparison.filter((r) => r.id !== id),
      );
      void apiJson(`/api/admin/pricing-comparison/${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
        .then(() => ds.comparison.refresh())
        .catch(() => ds.comparison.refresh());
    },
  },
  testimonials: {
    all: () => state.testimonials,
    refresh: async () => {
      if (!isBrowser()) return;
      try {
        const rows = await apiJson<AdminTestimonial[]>("/api/admin/testimonials", { method: "GET" });
        set("testimonials", rows);
      } catch {
        // ignore
      }
    },
    add: (d: Omit<AdminTestimonial, "id">) => {
      const optimistic: AdminTestimonial = { ...d, id: `tmp_${Date.now()}` };
      set("testimonials", [...state.testimonials, optimistic]);
      void apiJson("/api/admin/testimonials", {
        method: "POST",
        body: JSON.stringify(d),
      })
        .then(() => ds.testimonials.refresh())
        .catch(() => ds.testimonials.refresh());
    },
    update: (id: string, patch: Partial<AdminTestimonial>) => {
      set(
        "testimonials",
        state.testimonials.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      );
      void apiJson(`/api/admin/testimonials/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      })
        .then(() => ds.testimonials.refresh())
        .catch(() => ds.testimonials.refresh());
    },
    del: (id: string) => {
      set(
        "testimonials",
        state.testimonials.filter((t) => t.id !== id),
      );
      void apiJson(`/api/admin/testimonials/${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
        .then(() => ds.testimonials.refresh())
        .catch(() => ds.testimonials.refresh());
    },
  },
  faq: {
    all: () => state.faqs,
    refresh: async () => {
      if (!isBrowser()) return;
      try {
        const rows = await apiJson<unknown[]>("/api/admin/faqs", { method: "GET" });
        set(
          "faqs",
          rows.map((row) => {
            const r = (row ?? {}) as Record<string, unknown>;
            return {
              id: String(r.id),
              question: String(r.question ?? ""),
              answer: String(r.answer ?? ""),
              category: String(r.category ?? "general"),
              sortOrder: typeof r.sortOrder === "number" && Number.isFinite(r.sortOrder) ? Math.floor(r.sortOrder) : 0,
              published: typeof r.published === "boolean" ? r.published : true,
              createdAt: typeof r.createdAt === "string" ? r.createdAt : new Date().toISOString(),
              updatedAt: typeof r.updatedAt === "string" ? r.updatedAt : typeof r.createdAt === "string" ? r.createdAt : new Date().toISOString(),
            } satisfies AdminFaq;
          }),
        );
      } catch {
        // ignore
      }
    },
    add: (d: Omit<AdminFaq, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const optimistic: AdminFaq = {
        ...d,
        id: `tmp_${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      set("faqs", [optimistic, ...state.faqs]);
      void apiJson("/api/admin/faqs", {
        method: "POST",
        body: JSON.stringify({
          question: d.question,
          answer: d.answer,
          category: d.category,
          sortOrder: d.sortOrder,
          published: d.published,
        }),
      })
        .then(() => ds.faq.refresh())
        .catch(() => ds.faq.refresh());
    },
    update: (id: string, patch: Partial<AdminFaq>) => {
      const now = new Date().toISOString();
      set(
        "faqs",
        state.faqs.map((f) => (f.id === id ? { ...f, ...patch, updatedAt: patch.updatedAt ?? now } : f)),
      );
      void apiJson(`/api/admin/faqs/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      })
        .then(() => ds.faq.refresh())
        .catch(() => ds.faq.refresh());
    },
    del: (id: string) => {
      set(
        "faqs",
        state.faqs.filter((f) => f.id !== id),
      );
      void apiJson(`/api/admin/faqs/${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
        .then(() => ds.faq.refresh())
        .catch(() => ds.faq.refresh());
    },
  },
  testimonialImages: {
    all: () => state.testimonialImages,
    refresh: async () => {
      if (!isBrowser()) return;
      try {
        const rows = await apiJson<AdminTestimonialImage[]>("/api/admin/testimonial-images", { method: "GET" });
        set("testimonialImages", rows);
      } catch {
        // ignore
      }
    },
    add: (imageUrl: string) => {
      const optimistic: AdminTestimonialImage = {
        id: `tmp_${Date.now()}`,
        imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set("testimonialImages", [optimistic, ...state.testimonialImages]);
      void apiJson("/api/admin/testimonial-images", {
        method: "POST",
        body: JSON.stringify({ imageUrl }),
      })
        .then(() => ds.testimonialImages.refresh())
        .catch(() => ds.testimonialImages.refresh());
    },
    del: (id: string) => {
      set(
        "testimonialImages",
        state.testimonialImages.filter((x) => x.id !== id),
      );
      void apiJson(`/api/admin/testimonial-images/${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
        .then(() => ds.testimonialImages.refresh())
        .catch(() => ds.testimonialImages.refresh());
    },
  },
  blog: {
    all: () => state.blog,
    refresh: async () => {
      if (!isBrowser()) return;
      try {
        const rows = await apiJson<unknown[]>("/api/admin/blog", { method: "GET" });
        set(
          "blog",
          rows.map((row) => {
            const r = (row ?? {}) as Record<string, unknown>;
            return {
              id: String(r.id),
              title: String(r.title ?? ""),
              excerpt: String(r.excerpt ?? ""),
              content: typeof r.content === "string" ? r.content : r.content === null ? null : "",
              category: String(r.category ?? ""),
              date: typeof r.date === "string" ? r.date : new Date().toISOString().slice(0, 10),
              readTime: String(r.readTime ?? ""),
              published: typeof r.published === "boolean" ? r.published : true,
              featured: typeof r.featured === "boolean" ? r.featured : false,
              image: typeof r.image === "string" ? r.image : r.image === null ? null : "",
              author: typeof r.author === "string" ? r.author : r.author === null ? null : "",
              authorRole: typeof r.authorRole === "string" ? r.authorRole : r.authorRole === null ? null : "Editor Syntara",
              color: typeof r.color === "string" ? r.color : r.color === null ? null : "from-[#3D35A8] to-[#00BCEF]",
            } satisfies AdminBlog;
          }),
        );
      } catch {
        // ignore
      }
    },
    add: (d: Omit<AdminBlog, "id">) => {
      const optimistic: AdminBlog = { ...d, id: `tmp_${Date.now()}` };
      set("blog", [optimistic, ...state.blog]);
      void apiJson("/api/admin/blog", {
        method: "POST",
        body: JSON.stringify(d),
      })
        .then(() => ds.blog.refresh())
        .catch(() => ds.blog.refresh());
    },
    update: (id: string, patch: Partial<AdminBlog>) => {
      set(
        "blog",
        state.blog.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      );
      void apiJson(`/api/admin/blog/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      })
        .then(() => ds.blog.refresh())
        .catch(() => ds.blog.refresh());
    },
    del: (id: string) => {
      set(
        "blog",
        state.blog.filter((b) => b.id !== id),
      );
      void apiJson(`/api/admin/blog/${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
        .then(() => ds.blog.refresh())
        .catch(() => ds.blog.refresh());
    },
  },
  settings: {
    get: () => state.settings,
    refresh: async () => {
      if (!isBrowser()) return;
      try {
        const row = await apiJson<SiteSettings>("/api/admin/settings", { method: "GET" });
        set("settings", row);
      } catch {
        // ignore
      }
    },
    save: (d: SiteSettings) => {
      set("settings", d);
      void apiJson<SiteSettings>("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(d),
      })
        .then((row) => set("settings", row))
        .catch(() => ds.settings.refresh());
    },
  },
};
