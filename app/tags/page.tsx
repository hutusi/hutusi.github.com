import { getAllTags } from "@/lib/content";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "标签",
  description: "文章标签",
};

export default async function TagsPage() {
  const tags = await getAllTags();
  const totalPosts = tags.reduce((sum, t) => sum + t.count, 0);

  // Sort by count for popular tags
  const sortedByCount = [...tags].sort((a, b) => b.count - a.count);
  const popularTags = sortedByCount.slice(0, 12);

  // Sort alphabetically for all tags
  const sortedAlphabetically = [...tags].sort((a, b) =>
    a.name.localeCompare(b.name, 'zh-CN')
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="section-title text-3xl font-bold text-[var(--foreground)] mb-4">
          标签
        </h1>
        <p className="text-[var(--foreground-muted)]">
          共 {tags.length} 个标签，{totalPosts} 篇文章
        </p>
      </div>

      {/* Popular Tags */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
          热门标签
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {popularTags.map((tag, index) => (
            <Link
              key={tag.name}
                              href={`/tag/${encodeURIComponent(tag.name)}`}              className="group relative p-4 bg-[var(--background-elevated)] rounded-xl border border-[var(--border-light)] hover:border-[var(--accent)] hover:shadow-md transition-all"
            >
              <span className="font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors truncate">
                {tag.name}
              </span>
              <div className="mt-1 text-sm text-[var(--foreground-muted)]">
                {tag.count} 篇文章
              </div>
              {/* Progress bar */}
              <div className="mt-2 h-1 bg-[var(--border-light)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--accent)] to-emerald-400 rounded-full transition-all"
                  style={{ width: `${(tag.count / sortedByCount[0].count) * 100}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Tags */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
          全部标签
        </h2>
        <div className="flex flex-wrap gap-2">
          {sortedAlphabetically.map((tag) => (
            <Link
              key={tag.name}
                              href={`/tag/${encodeURIComponent(tag.name)}`}              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--background-elevated)] border border-[var(--border-light)] rounded-lg text-sm text-[var(--foreground-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
            >
              <span>{tag.name}</span>
              <span className="text-xs text-[var(--foreground-muted)]">
                {tag.count}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
