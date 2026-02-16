import { getAllPosts } from "@/lib/content";
import { siteConfig } from "@/config/site";
import PostCard from "@/components/posts/PostCard";
import Pagination from "@/components/posts/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "文章",
  description: "所有文章列表",
};

export default async function ArticlesPage() {
  const posts = await getAllPosts();
  const postsPerPage = siteConfig.postsPerPage;
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice(0, postsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">文章</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination currentPage={1} totalPages={totalPages} basePath="/articles" />
    </div>
  );
}
