import type { Post, Weekly } from "@/types/post";
import PostCard from "./PostCard";

interface PostListProps {
  posts: (Post | Weekly)[];
  title?: string;
  showMore?: {
    text: string;
    href: string;
  };
}

export default function PostList({ posts, title, showMore }: PostListProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mb-12">
      {(title || showMore) && (
        <div className="flex items-center justify-between mb-6">
          {title && <h2 className="section-title text-2xl font-bold text-gray-900">{title}</h2>}
          {showMore && (
            <a
              href={showMore.href}
              className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors"
            >
              {showMore.text} →
            </a>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
