import { getAllTags } from "@/lib/content";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "标签",
  description: "文章标签",
};

export default async function TagsPage() {
  const tags = await getAllTags();
  const maxCount = Math.max(...tags.map((t) => t.count));

  // Calculate font size based on count
  const getFontSize = (count: number) => {
    const minSize = 0.875; // 14px
    const maxSize = 1.5; // 24px
    const ratio = count / maxCount;
    return minSize + ratio * (maxSize - minSize);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">标签</h1>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            href={`/tag/${encodeURIComponent(tag.name)}/`}
            className="px-4 py-2 bg-gradient-to-br from-[var(--accent-lighter)] to-[var(--accent-light)] text-[var(--accent-hover)] rounded-full hover:bg-[var(--accent)] hover:from-[var(--accent)] hover:to-[var(--accent)] hover:text-white transition-all hover:scale-105"
            style={{ fontSize: `${getFontSize(tag.count)}rem` }}
          >
            {tag.name}
            <span className="ml-1 opacity-60">({tag.count})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
