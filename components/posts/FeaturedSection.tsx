"use client";

import { useState, useCallback } from "react";
import type { Post, Weekly } from "@/types/post";
import FeaturedCard from "./FeaturedCard";

interface FeaturedSectionProps {
  allFeatured: (Post | Weekly)[];
  initialPosts: (Post | Weekly)[];
}

function getRandomItems<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function FeaturedSection({
  allFeatured,
  initialPosts,
}: FeaturedSectionProps) {
  const [displayedPosts, setDisplayedPosts] = useState(initialPosts);

  const handleRefresh = useCallback(() => {
    setDisplayedPosts(getRandomItems(allFeatured, 2));
  }, [allFeatured]);

  if (allFeatured.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title text-2xl font-bold text-gray-900">
          精选推荐
          <button
            onClick={handleRefresh}
            className="ml-3 text-sm font-normal text-gray-500 hover:text-[var(--accent)] transition-colors"
          >
            换一换
          </button>
        </h2>
        <a
          href="/archive/?t=featured"
          className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors"
        >
          全部精选 →
        </a>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayedPosts.map((post) => (
          <FeaturedCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
