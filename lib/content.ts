import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, Weekly, PostFrontmatter } from "@/types/post";

const postsDirectory = path.join(process.cwd(), "content/posts");
const weekliesDirectory = path.join(process.cwd(), "content/weeklies");
const pagesDirectory = path.join(process.cwd(), "content/pages");

function getExcerpt(content: string, length = 200): string {
  // Remove markdown syntax and get plain text
  const plainText = content
    .replace(/#{1,6}\s+/g, "") // Remove headers
    .replace(/\*\*|__/g, "") // Remove bold
    .replace(/\*|_/g, "") // Remove italic
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // Remove code
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // Remove links, keep text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "") // Remove images
    .replace(/>\s+/g, "") // Remove blockquotes
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim();

  if (plainText.length <= length) return plainText;
  return plainText.slice(0, length).trim() + "...";
}

export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const slug = file.replace(".mdx", "");
    const fullPath = path.join(postsDirectory, file);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = data as PostFrontmatter;
    const stats = readingTime(content);

    return {
      slug,
      ...frontmatter,
      content,
      excerpt: getExcerpt(content),
      url: `/articles/${slug}/`,
      readingTime: Math.ceil(stats.minutes),
      type: "post" as const,
    };
  });

  // Sort by date descending
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as PostFrontmatter;
  const stats = readingTime(content);

  return {
    slug,
    ...frontmatter,
    content,
    excerpt: getExcerpt(content),
    url: `/articles/${slug}/`,
    readingTime: Math.ceil(stats.minutes),
    type: "post" as const,
  };
}

export async function getAllWeeklies(): Promise<Weekly[]> {
  if (!fs.existsSync(weekliesDirectory)) {
    return [];
  }

  const files = fs
    .readdirSync(weekliesDirectory)
    .filter((f) => f.endsWith(".mdx"));

  const weeklies = files.map((file) => {
    const slug = file.replace(".mdx", "");
    const fullPath = path.join(weekliesDirectory, file);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = data as PostFrontmatter;
    const stats = readingTime(content);

    return {
      slug,
      ...frontmatter,
      content,
      excerpt: getExcerpt(content),
      url: `/weeklies/${slug}/`,
      readingTime: Math.ceil(stats.minutes),
      type: "weekly" as const,
    };
  });

  // Sort by date descending
  return weeklies.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getWeeklyBySlug(slug: string): Promise<Weekly | null> {
  const fullPath = path.join(weekliesDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as PostFrontmatter;
  const stats = readingTime(content);

  return {
    slug,
    ...frontmatter,
    content,
    excerpt: getExcerpt(content),
    url: `/weeklies/${slug}/`,
    readingTime: Math.ceil(stats.minutes),
    type: "weekly" as const,
  };
}

export async function getFeaturedPosts(): Promise<(Post | Weekly)[]> {
  const posts = await getAllPosts();
  const weeklies = await getAllWeeklies();
  const all = [...posts, ...weeklies];
  return all.filter((p) => p.featured);
}

export async function getPostsByCategory(
  category: string
): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.category === category);
}

export async function getPostsByTag(tag: string): Promise<(Post | Weekly)[]> {
  const posts = await getAllPosts();
  const weeklies = await getAllWeeklies();
  const all = [...posts, ...weeklies];
  return all.filter((p) => p.tags.includes(tag));
}

export async function getPostsByYear(year: number): Promise<(Post | Weekly)[]> {
  const posts = await getAllPosts();
  const weeklies = await getAllWeeklies();
  const all = [...posts, ...weeklies];
  return all.filter((p) => new Date(p.date).getFullYear() === year);
}

export async function getAllCategories(): Promise<
  { name: string; count: number }[]
> {
  const posts = await getAllPosts();
  const weeklies = await getAllWeeklies();
  const all = [...posts, ...weeklies];

  const categoryMap = new Map<string, number>();
  for (const post of all) {
    const count = categoryMap.get(post.category) || 0;
    categoryMap.set(post.category, count + 1);
  }

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getAllTags(): Promise<{ name: string; count: number }[]> {
  const posts = await getAllPosts();
  const weeklies = await getAllWeeklies();
  const all = [...posts, ...weeklies];

  const tagMap = new Map<string, number>();
  for (const post of all) {
    for (const tag of post.tags) {
      const count = tagMap.get(tag) || 0;
      tagMap.set(tag, count + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getAllYears(): Promise<number[]> {
  const posts = await getAllPosts();
  const weeklies = await getAllWeeklies();
  const all = [...posts, ...weeklies];

  const years = new Set<number>();
  for (const post of all) {
    years.add(new Date(post.date).getFullYear());
  }

  return Array.from(years).sort((a, b) => b - a);
}

export async function getPageContent(slug: string): Promise<{
  title: string;
  content: string;
  description?: string;
  commentable?: boolean;
} | null> {
  const fullPath = path.join(pagesDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    title: data.title || slug,
    content,
    description: data.description,
    commentable: data.commentable,
  };
}

export async function getAdjacentPosts(
  slug: string,
  type: "post" | "weekly"
): Promise<{
  prev: Post | Weekly | null;
  next: Post | Weekly | null;
}> {
  const items =
    type === "post" ? await getAllPosts() : await getAllWeeklies();
  const index = items.findIndex((item) => item.slug === slug);

  return {
    prev: index > 0 ? items[index - 1] : null,
    next: index < items.length - 1 ? items[index + 1] : null,
  };
}
