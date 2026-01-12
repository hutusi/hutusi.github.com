import Link from "next/link";
import type { Post, Weekly } from "@/types/post";
import { formatDate, getImageUrl, truncate } from "@/lib/utils";

interface FeaturedCardProps {
  post: Post | Weekly;
}

export default function FeaturedCard({ post }: FeaturedCardProps) {
  return (
    <article className="card overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <Link
          href={post.url}
          className="block w-full md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden"
        >
          <img
            src={getImageUrl(post.image)}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
        <div className="p-5 flex-1 flex flex-col justify-center">
          <div className="text-xs text-[var(--accent)] font-medium uppercase mb-2">
            Featured
          </div>
          <Link href={post.url}>
            <h3 className="text-xl font-bold text-gray-900 hover:text-[var(--accent)] transition-colors">
              {post.title}
            </h3>
          </Link>
          {post.subtitle && (
            <p className="text-gray-500 mt-1">{post.subtitle}</p>
          )}
          <p className="text-gray-600 mt-3 line-clamp-3">
            {truncate(post.excerpt, 150)}
          </p>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {post.tags.slice(0, 4).map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag)}/`}
                  className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded hover:bg-[var(--accent)] hover:text-white transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          <div className="mt-3 flex items-center text-sm text-gray-500">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="mx-2">·</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </div>
    </article>
  );
}
