import Link from "next/link";
import type { Post, Weekly } from "@/types/post";
import { formatDate, getImageUrl, truncate } from "@/lib/utils";

interface PostCardProps {
  post: Post | Weekly;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="card overflow-hidden flex flex-col h-full">
      <Link href={post.url} className="block aspect-[16/10] overflow-hidden">
        <img
          src={getImageUrl(post.image)}
          alt={post.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        <Link href={post.url}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-[var(--accent)] transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        {post.subtitle && (
          <p className="text-sm text-gray-500 mt-1">{post.subtitle}</p>
        )}
        <p className="text-sm text-gray-600 mt-2 flex-1 line-clamp-3">
          {truncate(post.excerpt, 100)}
        </p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}/`}
                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded hover:bg-[var(--accent)] hover:text-white transition-colors"
              >
                {tag}
              </Link>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs text-gray-400">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readingTime} min read</span>
        </div>
      </div>
    </article>
  );
}
