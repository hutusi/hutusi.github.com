import { getAllPosts, getAllWeeklies, getAllTags } from "@/lib/content";
import PostCard from "@/components/posts/PostCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  return {
    title: `${decodedName} 标签`,
    description: `带有 ${decodedName} 标签的文章`,
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ name: encodeURIComponent(tag.name) }));
}

export default async function TagPage({ params }: Props) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const [posts, weeklies] = await Promise.all([
    getAllPosts(),
    getAllWeeklies(),
  ]);

  const allItems = [...posts, ...weeklies].filter((item) =>
    item.tags.includes(decodedName)
  );

  if (allItems.length === 0) {
    notFound();
  }

  // Sort by date
  allItems.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        标签: {decodedName}
      </h1>
      <p className="text-gray-500 mb-8">{allItems.length} 篇文章</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allItems.map((item) => (
          <PostCard key={item.slug} post={item} />
        ))}
      </div>
    </div>
  );
}
