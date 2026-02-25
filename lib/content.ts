import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, Weekly, PostFrontmatter } from "@/types/post";

const postsDirectory = path.join(process.cwd(), "content/posts");
const weekliesDirectory = path.join(process.cwd(), "content/weeklies");
const pagesDirectory = path.join(process.cwd(), "content/pages");

// Normalize non-standard date format from Jekyll: 'YYYY-MM-DD HH:mm:ss +0800' -> 'YYYY-MM-DDTHH:mm:ss+08:00'
// Safari/iOS cannot parse the space-separated format with uncoloned timezone offset
function normalizeDate(date: string | undefined): string | undefined {
  if (!date) return date;
  return date.replace(
    /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) ([+-])(\d{2})(\d{2})$/,
    "$1T$2$3$4:$5"
  );
}

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

  const files = fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const rawSlug = file.replace(/\.mdx?$/, "");
    const cleanSlug = rawSlug.replace(/^\d{4}-\d{2}-\d{2}-/, "");
    const fullPath = path.join(postsDirectory, file);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = data as PostFrontmatter;

    // Extract date from filename if missing
    if (!frontmatter.date) {
      const dateMatch = rawSlug.match(/^(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        frontmatter.date = dateMatch[1];
      }
    }

    // Normalize date to ISO 8601 for cross-browser compatibility (Safari)
    frontmatter.date = normalizeDate(frontmatter.date) ?? frontmatter.date;

    // Normalize tags to array
        if (typeof frontmatter.tags === 'string') {
          frontmatter.tags = (frontmatter.tags as string).split(' ').filter(Boolean);
        } else if (!Array.isArray(frontmatter.tags)) {
          frontmatter.tags = [];
        }

        const stats = readingTime(content);
    return {
      slug: cleanSlug,
      ...frontmatter,
      content,
      excerpt: getExcerpt(content),
      url: `/articles/${cleanSlug}`,
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
  // Find file matching the slug (with or without date prefix)
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
  const foundFile = files.find(file => {
    const name = file.replace(/\.mdx?$/, "");
    const cleanName = name.replace(/^\d{4}-\d{2}-\d{2}-/, "");
    return cleanName === slug;
  });

  if (!foundFile) return null;

  const fullPath = path.join(postsDirectory, foundFile);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as PostFrontmatter;

  // Extract date from filename if missing
  if (!frontmatter.date) {
    const rawSlug = foundFile.replace(/\.mdx?$/, "");
    const dateMatch = rawSlug.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      frontmatter.date = dateMatch[1];
    }
  }

  // Normalize date to ISO 8601 for cross-browser compatibility (Safari)
  frontmatter.date = normalizeDate(frontmatter.date) ?? frontmatter.date;

  // Normalize tags to array
  if (typeof frontmatter.tags === 'string') {
    frontmatter.tags = (frontmatter.tags as string).split(' ').filter(Boolean);
  } else if (!Array.isArray(frontmatter.tags)) {
    frontmatter.tags = [];
  }

  const stats = readingTime(content);

  return {
    slug,
    ...frontmatter,
    content,
    excerpt: getExcerpt(content),
    url: `/articles/${slug}`,
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
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const weeklies = files.map((file) => {
    const rawSlug = file.replace(/\.mdx?$/, "");
    const cleanSlug = rawSlug.replace(/^\d{4}-\d{2}-\d{2}-/, "");
    const fullPath = path.join(weekliesDirectory, file);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = data as PostFrontmatter;

    // Extract date from filename if missing
    if (!frontmatter.date) {
      const dateMatch = rawSlug.match(/^(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        frontmatter.date = dateMatch[1];
      }
    }

    // Normalize date to ISO 8601 for cross-browser compatibility (Safari)
    frontmatter.date = normalizeDate(frontmatter.date) ?? frontmatter.date;

    // Normalize tags to array
    if (typeof frontmatter.tags === 'string') {
      frontmatter.tags = (frontmatter.tags as string).split(' ').filter(Boolean);
    } else if (!Array.isArray(frontmatter.tags)) {
      frontmatter.tags = [];
    }

    const stats = readingTime(content);

    return {
      slug: cleanSlug,
      ...frontmatter,
      content,
      excerpt: getExcerpt(content),
      url: `/weeklies/${cleanSlug}`,
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
  // Find file matching the slug (with or without date prefix)
  const files = fs.readdirSync(weekliesDirectory).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
  const foundFile = files.find(file => {
    const name = file.replace(/\.mdx?$/, "");
    const cleanName = name.replace(/^\d{4}-\d{2}-\d{2}-/, "");
    return cleanName === slug;
  });

  if (!foundFile) return null;

  const fullPath = path.join(weekliesDirectory, foundFile);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as PostFrontmatter;

  // Extract date from filename if missing
  if (!frontmatter.date) {
    const rawSlug = foundFile.replace(/\.mdx?$/, "");
    const dateMatch = rawSlug.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      frontmatter.date = dateMatch[1];
    }
  }

  // Normalize date to ISO 8601 for cross-browser compatibility (Safari)
  frontmatter.date = normalizeDate(frontmatter.date) ?? frontmatter.date;

  // Normalize tags to array
  if (typeof frontmatter.tags === 'string') {
    frontmatter.tags = (frontmatter.tags as string).split(' ').filter(Boolean);
  } else if (!Array.isArray(frontmatter.tags)) {
    frontmatter.tags = [];
  }

  const stats = readingTime(content);

  return {
    slug,
    ...frontmatter,
    content,
    excerpt: getExcerpt(content),
    url: `/weeklies/${slug}`,
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

export async function getRandomFeaturedPosts(count: number = 3): Promise<(Post | Weekly)[]> {
  const allFeatured = await getFeaturedPosts();
  const shuffled = allFeatured.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
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
  let fullPath = path.join(pagesDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(pagesDirectory, `${slug}.md`);
  }
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
