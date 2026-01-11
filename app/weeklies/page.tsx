import { getAllWeeklies } from "@/lib/content";
import { siteConfig } from "@/config/site";
import PostCard from "@/components/posts/PostCard";
import Pagination from "@/components/posts/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "周刊",
  description: "好奇心周刊系列",
};

export default async function WeekliesPage() {
  const weeklies = await getAllWeeklies();
  const postsPerPage = siteConfig.postsPerPage;
  const totalPages = Math.ceil(weeklies.length / postsPerPage);
  const currentPosts = weeklies.slice(0, postsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">周刊</h1>
      <p className="text-gray-600 mb-8">
        好奇心周刊是我分享学习心得、阅读笔记和有趣发现的系列内容。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPosts.map((weekly) => (
          <PostCard key={weekly.slug} post={weekly} />
        ))}
      </div>
      <Pagination currentPage={1} totalPages={totalPages} basePath="/weeklies" />
    </div>
  );
}
