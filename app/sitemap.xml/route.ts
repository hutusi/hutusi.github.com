import { getAllPosts, getAllWeeklies, getAllCategories, getAllTags, getAllYears } from "@/lib/content";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export async function GET() {
  const [posts, weeklies, categories, tags, years] = await Promise.all([
    getAllPosts(),
    getAllWeeklies(),
    getAllCategories(),
    getAllTags(),
    getAllYears(),
  ]);

  const staticPages = [
    { url: "/", priority: 1.0 },
    { url: "/about/", priority: 0.8 },
    { url: "/articles/", priority: 0.9 },
    { url: "/weeklies/", priority: 0.9 },
    { url: "/archive/", priority: 0.7 },
    { url: "/links/", priority: 0.6 },
    { url: "/subscription/", priority: 0.6 },
    { url: "/categories/", priority: 0.6 },
    { url: "/tags/", priority: 0.6 },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${siteConfig.url}${page.url}</loc>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("")}
  ${posts
    .map(
      (post) => `
  <url>
    <loc>${siteConfig.url}${post.url}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>`
    )
    .join("")}
  ${weeklies
    .map(
      (weekly) => `
  <url>
    <loc>${siteConfig.url}${weekly.url}</loc>
    <lastmod>${new Date(weekly.date).toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>`
    )
    .join("")}
  ${categories
    .map(
      (cat) => `
  <url>
    <loc>${siteConfig.url}/category/${cat.name}/</loc>
    <priority>0.5</priority>
  </url>`
    )
    .join("")}
  ${tags
    .map(
      (tag) => `
  <url>
    <loc>${siteConfig.url}/tag/${encodeURIComponent(tag.name)}/</loc>
    <priority>0.4</priority>
  </url>`
    )
    .join("")}
  ${years
    .map(
      (year) => `
  <url>
    <loc>${siteConfig.url}/${year}/</loc>
    <priority>0.5</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
