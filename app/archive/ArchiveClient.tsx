"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatDateShort } from "@/lib/utils";

interface ArchiveItem {
  slug: string;
  title: string;
  date: string;
  url: string;
  type: "post" | "weekly";
  featured: boolean;
}

interface ArchiveClientProps {
  posts: ArchiveItem[];
  weeklies: ArchiveItem[];
  years: number[];
}

type ContentFilter = "all" | "featured" | "articles" | "weeklies";

export default function ArchiveClient({
  posts,
  weeklies,
  years,
}: ArchiveClientProps) {
  const [contentFilter, setContentFilter] = useState<ContentFilter>("all");
  const [yearFilter, setYearFilter] = useState<number | "all">("all");

  const allItems = useMemo(() => {
    return [...posts, ...weeklies].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [posts, weeklies]);

  const filteredItems = useMemo(() => {
    let items = allItems;

    // Apply content filter
    switch (contentFilter) {
      case "featured":
        items = items.filter((item) => item.featured);
        break;
      case "articles":
        items = items.filter((item) => item.type === "post");
        break;
      case "weeklies":
        items = items.filter((item) => item.type === "weekly");
        break;
    }

    // Apply year filter
    if (yearFilter !== "all") {
      items = items.filter(
        (item) => new Date(item.date).getFullYear() === yearFilter
      );
    }

    return items;
  }, [allItems, contentFilter, yearFilter]);

  // Group by year for display
  const itemsByYear = useMemo(() => {
    const grouped: { year: number; items: ArchiveItem[] }[] = [];
    const yearsToShow = yearFilter === "all" ? years : [yearFilter];

    yearsToShow.forEach((year) => {
      const yearItems = filteredItems.filter(
        (item) => new Date(item.date).getFullYear() === year
      );
      if (yearItems.length > 0) {
        grouped.push({ year, items: yearItems });
      }
    });

    return grouped;
  }, [filteredItems, years, yearFilter]);

  const contentFilters: { key: ContentFilter; label: string; count: number }[] =
    [
      { key: "all", label: "全部", count: allItems.length },
      {
        key: "featured",
        label: "精选",
        count: allItems.filter((i) => i.featured).length,
      },
      { key: "articles", label: "文章", count: posts.length },
      { key: "weeklies", label: "周刊", count: weeklies.length },
    ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title text-3xl font-bold text-[var(--foreground)] mb-4">
          归档
        </h1>
        <p className="text-[var(--foreground-muted)]">
          共 {allItems.length} 篇内容，{years.length} 年记录
        </p>
      </div>

      {/* First Level Filter: Content Type */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {contentFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setContentFilter(filter.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                contentFilter === filter.key
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--background-elevated)] text-[var(--foreground-secondary)] border border-[var(--border-light)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              {filter.label}
              <span
                className={`ml-1.5 ${
                  contentFilter === filter.key
                    ? "text-white/80"
                    : "text-[var(--foreground-muted)]"
                }`}
              >
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Second Level Filter: Year */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setYearFilter("all")}
            className={`px-3 py-1.5 rounded-md text-sm transition-all ${
              yearFilter === "all"
                ? "bg-[var(--accent-light)] text-[var(--accent-hover)] font-medium"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] hover:bg-[var(--background-elevated)]"
            }`}
          >
            全部年份
          </button>
          {years.map((year) => {
            const yearCount = filteredItems.filter(
              (item) => new Date(item.date).getFullYear() === year
            ).length;
            // Only show years that have content with current content filter
            const hasContent =
              yearFilter === "all"
                ? yearCount > 0 ||
                  allItems.some(
                    (item) => new Date(item.date).getFullYear() === year
                  )
                : true;

            if (!hasContent && contentFilter !== "all") return null;

            return (
              <button
                key={year}
                onClick={() => setYearFilter(year)}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                  yearFilter === year
                    ? "bg-[var(--accent-light)] text-[var(--accent-hover)] font-medium"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] hover:bg-[var(--background-elevated)]"
                }`}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-[var(--foreground-muted)]">
          没有找到符合条件的内容
        </div>
      ) : (
        <div className="space-y-8">
          {itemsByYear.map(({ year, items }) => (
            <section key={year}>
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 pb-2 border-b border-[var(--border-light)] flex items-center justify-between">
                <span>{year}年</span>
                <span className="text-sm font-normal text-[var(--foreground-muted)]">
                  {items.length} 篇
                </span>
              </h2>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={`${item.type}-${item.slug}`}
                    className="flex items-baseline gap-4 group"
                  >
                    <time
                      dateTime={item.date}
                      className="text-sm text-[var(--foreground-muted)] shrink-0 w-24"
                    >
                      {formatDateShort(item.date)}
                    </time>
                    <Link
                      href={item.url}
                      className="text-[var(--foreground-secondary)] group-hover:text-[var(--accent)] transition-colors flex-1"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 shrink-0">
                      {item.featured && (
                        <span className="text-xs px-2 py-0.5 bg-[var(--accent-lighter)] text-[var(--accent)] rounded">
                          精选
                        </span>
                      )}
                      {item.type === "weekly" && (
                        <span className="text-xs px-2 py-0.5 bg-[var(--border-light)] text-[var(--foreground-muted)] rounded">
                          周刊
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {/* Quick Links */}
      <div className="mt-12 pt-8 border-t border-[var(--border-light)]">
        <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-4">
          快速访问
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/categories/"
            className="px-4 py-2 bg-[var(--background-elevated)] border border-[var(--border-light)] rounded-lg text-sm text-[var(--foreground-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
          >
            分类
          </Link>
          <Link
            href="/tags/"
            className="px-4 py-2 bg-[var(--background-elevated)] border border-[var(--border-light)] rounded-lg text-sm text-[var(--foreground-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
          >
            标签
          </Link>
        </div>
      </div>
    </div>
  );
}
