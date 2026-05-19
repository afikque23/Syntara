import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/db";
import { BlogDetailClient } from "./BlogDetailClient";

export const dynamic = "force-dynamic";

type PublicBlog = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  published: boolean;
  featured: boolean;
  image: string;
  author: string;
  authorRole: string;
  color: string;
};

function NotFoundView() {
  return (
    <div className="min-h-[70vh] bg-[#F8FAFC] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-[#3D35A8]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <AlertCircle size={32} className="text-[#3D35A8]" />
      </div>
      <h1 className="text-3xl font-black text-[#0F172A] mb-3">Artikel Tidak Ditemukan</h1>
      <p className="text-slate-500 mb-8 max-w-sm">Artikel yang Anda cari mungkin telah dihapus atau belum dipublikasikan.</p>
      <div className="flex gap-3">
        <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-[#3D35A8] text-white rounded-xl font-semibold hover:bg-[#3230A0] transition-colors">
          <ArrowLeft size={16} /> Kembali ke Blog
        </Link>
      </div>
    </div>
  );
}

function isSchemaOutOfDateError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return message.includes("does not exist in the current database") || message.includes("The column") || message.includes("The table");
}

function toPublicBlog(row: {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: Date;
  readTime: string;
  published: boolean;
  content?: string | null;
  featured?: boolean;
  image?: string | null;
  author?: string | null;
  authorRole?: string | null;
  color?: string | null;
}): PublicBlog {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content ?? "",
    category: row.category,
    date: row.date.toISOString().slice(0, 10),
    readTime: row.readTime,
    published: row.published,
    featured: row.featured ?? false,
    image: row.image ?? "",
    author: row.author ?? "",
    authorRole: row.authorRole ?? "",
    color: row.color ?? "",
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let postRow:
    | {
        id: string;
        title: string;
        excerpt: string;
        content: string | null;
        category: string;
        date: Date;
        readTime: string;
        published: boolean;
        featured: boolean;
        image: string | null;
        author: string | null;
        authorRole: string | null;
        color: string | null;
      }
    | {
        id: string;
        title: string;
        excerpt: string;
        category: string;
        date: Date;
        readTime: string;
        published: boolean;
      }
    | null = null;

  try {
    postRow = await prisma.adminBlog.findFirst({
      where: { id, published: true },
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        category: true,
        date: true,
        readTime: true,
        published: true,
        featured: true,
        image: true,
        author: true,
        authorRole: true,
        color: true,
      },
    });
  } catch (err) {
    if (!isSchemaOutOfDateError(err)) throw err;
    postRow = await prisma.adminBlog.findFirst({
      where: { id, published: true },
      select: {
        id: true,
        title: true,
        excerpt: true,
        category: true,
        date: true,
        readTime: true,
        published: true,
      },
    });
  }

  if (!postRow) {
    // Keep the UX from the provided snippet instead of Next's default 404.
    return <NotFoundView />;
  }

  let relatedSameCat:
    | {
        id: string;
        title: string;
        excerpt: string;
        content: string | null;
        category: string;
        date: Date;
        readTime: string;
        published: boolean;
        featured: boolean;
        image: string | null;
        author: string | null;
        authorRole: string | null;
        color: string | null;
      }[]
    | {
        id: string;
        title: string;
        excerpt: string;
        category: string;
        date: Date;
        readTime: string;
        published: boolean;
      }[] = [];

  try {
    relatedSameCat = await prisma.adminBlog.findMany({
      where: { published: true, category: postRow.category, NOT: { id: postRow.id } },
      orderBy: [{ date: "desc" }],
      take: 3,
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        category: true,
        date: true,
        readTime: true,
        published: true,
        featured: true,
        image: true,
        author: true,
        authorRole: true,
        color: true,
      },
    });
  } catch (err) {
    if (!isSchemaOutOfDateError(err)) throw err;
    relatedSameCat = await prisma.adminBlog.findMany({
      where: { published: true, category: postRow.category, NOT: { id: postRow.id } },
      orderBy: [{ date: "desc" }],
      take: 3,
      select: {
        id: true,
        title: true,
        excerpt: true,
        category: true,
        date: true,
        readTime: true,
        published: true,
      },
    });
  }

  let related = relatedSameCat;
  if (related.length < 3) {
    let fill:
      | {
          id: string;
          title: string;
          excerpt: string;
          content: string | null;
          category: string;
          date: Date;
          readTime: string;
          published: boolean;
          featured: boolean;
          image: string | null;
          author: string | null;
          authorRole: string | null;
          color: string | null;
        }[]
      | {
          id: string;
          title: string;
          excerpt: string;
          category: string;
          date: Date;
          readTime: string;
          published: boolean;
        }[] = [];

    try {
      fill = await prisma.adminBlog.findMany({
        where: {
          published: true,
          AND: [{ id: { not: postRow.id } }, { category: { not: postRow.category } }],
        },
        orderBy: [{ date: "desc" }],
        take: 3 - related.length,
        select: {
          id: true,
          title: true,
          excerpt: true,
          content: true,
          category: true,
          date: true,
          readTime: true,
          published: true,
          featured: true,
          image: true,
          author: true,
          authorRole: true,
          color: true,
        },
      });
    } catch (err) {
      if (!isSchemaOutOfDateError(err)) throw err;
      fill = await prisma.adminBlog.findMany({
        where: {
          published: true,
          AND: [{ id: { not: postRow.id } }, { category: { not: postRow.category } }],
        },
        orderBy: [{ date: "desc" }],
        take: 3 - related.length,
        select: {
          id: true,
          title: true,
          excerpt: true,
          category: true,
          date: true,
          readTime: true,
          published: true,
        },
      });
    }
    related = [...related, ...fill];
  }

  const post = toPublicBlog(postRow);
  const relatedPublic = related.map(toPublicBlog);

  return <BlogDetailClient post={post} related={relatedPublic} />;
}
