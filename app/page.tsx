import { getAllPosts, getAllWeeklies, getFeaturedPosts } from "@/lib/content";
import FeaturedSection from "@/components/posts/FeaturedSection";
import PostList from "@/components/posts/PostList";

export default async function HomePage() {
  const [posts, weeklies, featured] = await Promise.all([
    getAllPosts(),
    getAllWeeklies(),
    getFeaturedPosts(),
  ]);

  const recentPosts = posts.slice(0, 6);
  const recentWeeklies = weeklies.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {featured.length >= 2 && <FeaturedSection allFeatured={featured} />}

      <PostList
        posts={recentPosts}
        title="最新文章"
        showMore={{ text: "全部文章", href: "/articles/" }}
      />

      <PostList
        posts={recentWeeklies}
        title="周刊"
        showMore={{ text: "全部周刊", href: "/weeklies/" }}
      />
    </div>
  );
}
