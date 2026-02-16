import { getAllWeeklies } from "@/lib/content";
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
    title: `周刊 - 第 ${num} 页`,
    description: `周刊列表第 ${num} 页`,
  };
}

export async function generateStaticParams() {
  const weeklies = await getAllWeeklies();
  const postsPerPage = siteConfig.postsPerPage;
  const totalPages = Math.ceil(weeklies.length / postsPerPage);

  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    num: String(i + 2),
  }));
}

export default async function WeekliesPageNum({ params }: Props) {
  const { num } = await params;
  const pageNum = parseInt(num, 10);

  if (isNaN(pageNum) || pageNum < 2) {
    notFound();
  }

  const weeklies = await getAllWeeklies();
  const postsPerPage = siteConfig.postsPerPage;
  const totalPages = Math.ceil(weeklies.length / postsPerPage);

  if (pageNum > totalPages) {
    notFound();
  }

  const start = (pageNum - 1) * postsPerPage;
  const currentPosts = weeklies.slice(start, start + postsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        周刊 <span className="text-gray-500 font-normal">- 第 {pageNum} 页</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPosts.map((weekly) => (
          <PostCard key={weekly.slug} post={weekly} />
        ))}
      </div>
      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        basePath="/weeklies"
      />
    </div>
  );
}
