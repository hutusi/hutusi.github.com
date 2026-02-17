import { getAllPosts, getAllWeeklies, getAllYears } from "@/lib/content";
import { formatDateShort } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `${year}年归档`,
    description: `${year}年发布的文章`,
  };
}

export async function generateStaticParams() {
  const years = await getAllYears();
  return years.map((year) => ({ year: String(year) }));
}

export default async function YearArchivePage({ params }: Props) {
  const { year } = await params;
  const yearNum = parseInt(year, 10);

  if (isNaN(yearNum)) {
    notFound();
  }

  const [posts, weeklies] = await Promise.all([
    getAllPosts(),
    getAllWeeklies(),
  ]);

  const allItems = [...posts, ...weeklies]
    .filter((item) => new Date(item.date).getFullYear() === yearNum)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (allItems.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{yearNum}年</h1>
      <p className="text-gray-500 mb-8">{allItems.length} 篇文章</p>

      <ul className="space-y-4">
        {allItems.map((item) => (
          <li
            key={item.slug}
            className="flex items-baseline gap-4 pb-4 border-b border-gray-100"
          >
            <time
              dateTime={item.date}
              className="text-sm text-gray-500 shrink-0 w-24"
            >
              {formatDateShort(item.date)}
            </time>
            <div className="flex-1">
              <Link
                href={item.url}
                className="text-gray-900 font-medium hover:text-[var(--accent)] transition-colors"
              >
                {item.title}
              </Link>
              {item.type === "weekly" && (
                <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
                  周刊
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Link
          href="/archive/"
          className="text-[var(--accent)] hover:underline"
        >
          ← 返回全部归档
        </Link>
      </div>
    </div>
  );
}
