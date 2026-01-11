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
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readingTime} min read</span>
        </div>
      </div>
    </article>
  );
}
