import { getAllCategories } from "@/lib/content";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "分类",
  description: "文章分类",
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">分类</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/category/${category.name}`}
            className="p-6 bg-white rounded-lg border border-gray-200 hover:border-[var(--accent)] hover:shadow-md transition-all"
          >
            <div className="text-lg font-medium text-gray-900">
              {category.name}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {category.count} 篇文章
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
