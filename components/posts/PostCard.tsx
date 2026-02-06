import Link from "next/link";
import type { Post, Weekly } from "@/types/post";
import { formatDate, getImageUrl, truncate } from "@/lib/utils";

interface PostCardProps {
  post: Post | Weekly;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="card overflow-hidden flex flex-col h-full group">
      <Link href={post.url} className="block relative aspect-[16/10] overflow-hidden">
        <img
          src={getImageUrl(post.image)}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Category badge */}
        {post.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm rounded-full text-gray-700 shadow-sm">
            {post.category}
          </span>
        )}
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        <Link href={post.url}>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        {post.subtitle && (
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">{post.subtitle}</p>
        )}
        <p className="text-sm text-[var(--foreground-secondary)] mt-2 flex-1 line-clamp-3">
          {truncate(post.excerpt, 100)}
        </p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="tag"
              >
                {tag}
              </Link>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs text-[var(--foreground-muted)]">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between text-xs text-[var(--foreground-muted)]">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readingTime} min read</span>
        </div>
      </div>
    </article>
  );
}
