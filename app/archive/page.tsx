import { getAllPosts, getAllWeeklies, getAllYears } from "@/lib/content";
import { formatDateShort } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "归档",
  description: "文章归档",
};

export default async function ArchivePage() {
  const [posts, weeklies, years] = await Promise.all([
    getAllPosts(),
    getAllWeeklies(),
    getAllYears(),
  ]);

  const allItems = [...posts, ...weeklies].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group by year
  const itemsByYear = years.map((year) => ({
    year,
    items: allItems.filter(
      (item) => new Date(item.date).getFullYear() === year
    ),
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">归档</h1>

      <div className="mb-8 flex flex-wrap gap-4">
        <Link
          href="/articles/"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-[var(--accent)] hover:text-white transition-colors"
        >
          文章 ({posts.length})
        </Link>
        <Link
          href="/weeklies/"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-[var(--accent)] hover:text-white transition-colors"
        >
          周刊 ({weeklies.length})
        </Link>
        <Link
          href="/categories/"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-[var(--accent)] hover:text-white transition-colors"
        >
          分类
        </Link>
        <Link
          href="/tags/"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-[var(--accent)] hover:text-white transition-colors"
        >
          标签
        </Link>
      </div>

      {itemsByYear.map(({ year, items }) => (
        <section key={year} className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            <Link
              href={`/${year}/`}
              className="hover:text-[var(--accent)] transition-colors"
            >
              {year}年
            </Link>
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({items.length})
            </span>
          </h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.slug} className="flex items-baseline gap-4">
                <time
                  dateTime={item.date}
                  className="text-sm text-gray-500 shrink-0 w-24"
                >
                  {formatDateShort(item.date)}
                </time>
                <Link
                  href={item.url}
                  className="text-gray-700 hover:text-[var(--accent)] transition-colors"
                >
                  {item.title}
                </Link>
                {item.type === "weekly" && (
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
                    周刊
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
