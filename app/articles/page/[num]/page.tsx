import { getAllPosts } from "@/lib/content";
import { siteConfig } from "@/config/site";
import PostCard from "@/components/posts/PostCard";
import Pagination from "@/components/posts/Pagination";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ num: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { num } = await params;
  return {
    title: `文章 - 第 ${num} 页`,
    description: `文章列表第 ${num} 页`,
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const postsPerPage = siteConfig.postsPerPage;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    num: String(i + 2),
  }));
}

export default async function ArticlesPageNum({ params }: Props) {
  const { num } = await params;
  const pageNum = parseInt(num, 10);

  if (isNaN(pageNum) || pageNum < 2) {
    notFound();
  }

  const posts = await getAllPosts();
  const postsPerPage = siteConfig.postsPerPage;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  if (pageNum > totalPages) {
    notFound();
  }

  const start = (pageNum - 1) * postsPerPage;
  const currentPosts = posts.slice(start, start + postsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        文章 <span className="text-gray-500 font-normal">- 第 {pageNum} 页</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        basePath="/articles"
      />
    </div>
  );
}
