import Link from "next/link";
import type { Post, Weekly } from "@/types/post";
import { formatDate, getImageUrl, truncate } from "@/lib/utils";

interface FeaturedCardProps {
  post: Post | Weekly;
  variant?: "default" | "hero" | "compact";
}

export default function FeaturedCard({ post, variant = "default" }: FeaturedCardProps) {
  if (variant === "hero") {
    return (
      <article className="card overflow-hidden group h-full">
        <Link href={post.url} className="block relative aspect-[16/9] overflow-hidden">
          <img
            src={getImageUrl(post.image)}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="text-xs font-medium uppercase mb-2 text-[var(--accent-light)]">
              精选
            </div>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--accent-light)] transition-colors">
              {post.title}
            </h3>
            {post.subtitle && (
              <p className="text-white/80 mb-3">{post.subtitle}</p>
            )}
            <p className="text-white/70 line-clamp-2 mb-3">
              {truncate(post.excerpt, 120)}
            </p>
            <div className="flex items-center text-sm text-white/60">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="mx-2">·</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="card overflow-hidden group h-full flex flex-col">
        <Link href={post.url} className="block relative aspect-[16/10] overflow-hidden">
          <img
            src={getImageUrl(post.image)}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
        <div className="p-4 flex-1 flex flex-col">
          <div className="text-xs text-[var(--accent)] font-medium uppercase mb-2">
            精选
          </div>
          <Link href={post.url}>
            <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>
          <p className="text-[var(--foreground-secondary)] mt-2 line-clamp-2 flex-1 text-sm">
            {truncate(post.excerpt, 80)}
          </p>
          <div className="mt-3 flex items-center text-xs text-[var(--foreground-muted)]">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="mx-2">·</span>
            <span>{post.readingTime} min</span>
          </div>
        </div>
      </article>
    );
  }

  // Default variant (original layout)
  return (
    <article className="card overflow-hidden group">
      <div className="flex flex-col md:flex-row">
        <Link
          href={post.url}
          className="block relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden"
        >
          <img
            src={getImageUrl(post.image)}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
        <div className="p-5 flex-1 flex flex-col justify-center">
          <div className="text-xs text-[var(--accent)] font-medium uppercase mb-2">
            精选
          </div>
          <Link href={post.url}>
            <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
              {post.title}
            </h3>
          </Link>
          {post.subtitle && (
            <p className="text-[var(--foreground-secondary)] mt-1">{post.subtitle}</p>
          )}
          <p className="text-[var(--foreground-secondary)] mt-3 line-clamp-3">
            {truncate(post.excerpt, 150)}
          </p>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.slice(0, 4).map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="tag"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          <div className="mt-3 flex items-center text-sm text-[var(--foreground-muted)]">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="mx-2">·</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </div>
    </article>
  );
}
