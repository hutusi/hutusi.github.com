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
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title text-2xl font-bold text-gray-900">
          随机精选
          <button
            onClick={handleRefresh}
            className="ml-3 text-sm font-normal text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
            aria-label="换一换"
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            换一换
          </button>
        </h2>
        <a
          href="/archive/?t=featured"
          className="text-sm text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
        >
          全部精选 →
        </a>
      </div>

      {/* Bento grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hero card - spans 2 columns on large screens */}
        {displayedPosts[0] && (
          <div className="lg:col-span-2">
            <FeaturedCard post={displayedPosts[0]} variant="hero" />
          </div>
        )}
        {/* Compact card */}
        {displayedPosts[1] && (
          <div className="lg:col-span-1">
            <FeaturedCard post={displayedPosts[1]} variant="compact" />
          </div>
        )}
      </div>
    </section>
  );
}
