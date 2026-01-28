import { getAllPosts, getAllWeeklies, getAllYears } from "@/lib/content";
import type { Metadata } from "next";
import ArchiveClient from "./ArchiveClient";

export const metadata: Metadata = {
  title: "归档",
  description: "文章归档",
};

export default async function ArchivePage() {
  const [posts, weeklies, years] = await Promise.all([
    getAllPosts(),
    getAllWeeklies(),
    getAllYears(),
  ]);

  // Serialize data for client component
  const serializedPosts = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    url: p.url,
    type: p.type,
    featured: p.featured || false,
  }));

  const serializedWeeklies = weeklies.map((w) => ({
    slug: w.slug,
    title: w.title,
    date: w.date,
    url: w.url,
    type: w.type,
    featured: w.featured || false,
  }));

  return (
    <ArchiveClient
      posts={serializedPosts}
      weeklies={serializedWeeklies}
      years={years}
    />
  );
}
