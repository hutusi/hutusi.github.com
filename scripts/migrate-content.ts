import fs from "fs";
import path from "path";
import matter from "gray-matter";

const JEKYLL_DIR = path.join(__dirname, "../../hutusi.github.com");
const CONTENT_DIR = path.join(__dirname, "../content");
const IMAGES_CDN = "https://cdn.hutusi.com/images";

interface JekyllFrontmatter {
  layout: string;
  category: string;
  tags?: string;
  title: string;
  subtitle?: string;
  date?: string;
  image?: string;
  featured?: boolean;
  description?: string;
  gh_issue?: number;
  gh_discussion?: number;
  redirect_from?: string | string[];
  rating?: number;
  toc?: boolean;
  beforetoc?: string;
  last_modified_at?: string;
  backgrounds?: string[];
  thumb?: string;
  commentable?: boolean;
}

function normalizeDate(dateStr: string | undefined): string {
  if (!dateStr) return new Date().toISOString();
  // Remove quotes and parse
  const cleanDate = dateStr.replace(/^["']|["']$/g, "");
  try {
    return new Date(cleanDate).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function normalizeTags(tags: string | string[] | undefined): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  // Split space-separated tags
  return tags.split(/\s+/).filter(Boolean);
}

function normalizeRedirects(
  redirects: string | string[] | undefined
): string[] {
  if (!redirects) return [];
  if (typeof redirects === "string") return [redirects];
  return redirects;
}

function transformContent(content: string): string {
  return (
    content
      // Convert Jekyll image syntax: {{site.images_baseurl}} -> CDN URL
      .replace(/\{\{site\.images_baseurl\}\}/g, IMAGES_CDN)
      // Remove kramdown width attributes: {:width="800px"}
      .replace(/\{:\s*width="[^"]*"\s*\}/g, "")
      // Remove other kramdown attributes like {:target="_blank" rel="nofollow"}
      .replace(/\{:\s*target="[^"]*"(?:\s*rel="[^"]*")?\s*\}/g, "")
      // Remove {:class="..."} attributes
      .replace(/\{:\s*class="[^"]*"\s*\}/g, "")
      // Remove standalone {:} markers
      .replace(/\{:\s*\}/g, "")
  );
}

function migratePost(
  filePath: string,
  outputDir: string,
  type: "post" | "weekly"
): void {
  const content = fs.readFileSync(filePath, "utf-8");
  const { data, content: body } = matter(content);
  const jekyllFm = data as JekyllFrontmatter;

  // Extract slug from filename: 2024-03-17-the-history-of-neural-networks.md -> the-history-of-neural-networks
  const filename = path.basename(filePath, ".md");
  const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, "");

  // Transform frontmatter
  const newFrontmatter: Record<string, unknown> = {
    title: jekyllFm.title,
    date: normalizeDate(jekyllFm.date),
    category: jekyllFm.category || type,
    tags: normalizeTags(jekyllFm.tags),
  };

  // Add optional fields only if they exist
  if (jekyllFm.subtitle) newFrontmatter.subtitle = jekyllFm.subtitle;
  if (jekyllFm.image) newFrontmatter.image = jekyllFm.image;
  if (jekyllFm.featured) newFrontmatter.featured = jekyllFm.featured;
  if (jekyllFm.description) newFrontmatter.description = jekyllFm.description;
  if (jekyllFm.gh_discussion || jekyllFm.gh_issue) {
    newFrontmatter.gh_discussion =
      jekyllFm.gh_discussion || jekyllFm.gh_issue;
  }
  const redirects = normalizeRedirects(jekyllFm.redirect_from);
  if (redirects.length > 0) newFrontmatter.redirect_from = redirects;
  if (jekyllFm.rating) newFrontmatter.rating = jekyllFm.rating;
  if (jekyllFm.toc !== undefined) newFrontmatter.toc = jekyllFm.toc;
  if (jekyllFm.beforetoc) newFrontmatter.beforetoc = jekyllFm.beforetoc;
  if (jekyllFm.last_modified_at)
    newFrontmatter.last_modified_at = jekyllFm.last_modified_at;
  if (jekyllFm.commentable !== undefined)
    newFrontmatter.commentable = jekyllFm.commentable;

  // Transform content
  const transformedBody = transformContent(body);

  // Write new MDX file
  const newContent = matter.stringify(transformedBody, newFrontmatter);
  const outputPath = path.join(outputDir, `${slug}.mdx`);

  fs.writeFileSync(outputPath, newContent);
  console.log(`Migrated: ${filename} -> ${slug}.mdx`);
}

function migrateDirectory(
  sourceDir: string,
  outputDir: string,
  type: "post" | "weekly"
): void {
  if (!fs.existsSync(sourceDir)) {
    console.error(`Source directory not found: ${sourceDir}`);
    return;
  }

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".md"));
  console.log(`Found ${files.length} ${type}s to migrate`);

  for (const file of files) {
    const filePath = path.join(sourceDir, file);
    try {
      migratePost(filePath, outputDir, type);
    } catch (error) {
      console.error(`Error migrating ${file}:`, error);
    }
  }
}

function migratePage(filePath: string, outputDir: string): void {
  const content = fs.readFileSync(filePath, "utf-8");
  const { data, content: body } = matter(content);

  const filename = path.basename(filePath, ".md");
  const slug = filename;

  const newFrontmatter: Record<string, unknown> = {
    title: data.title || slug,
  };

  if (data.description) newFrontmatter.description = data.description;
  if (data.commentable !== undefined)
    newFrontmatter.commentable = data.commentable;

  const transformedBody = transformContent(body);
  const newContent = matter.stringify(transformedBody, newFrontmatter);
  const outputPath = path.join(outputDir, `${slug}.mdx`);

  fs.writeFileSync(outputPath, newContent);
  console.log(`Migrated page: ${filename} -> ${slug}.mdx`);
}

function migratePages(sourceDir: string, outputDir: string): void {
  if (!fs.existsSync(sourceDir)) {
    console.error(`Source directory not found: ${sourceDir}`);
    return;
  }

  fs.mkdirSync(outputDir, { recursive: true });

  // Only migrate specific markdown pages (not HTML)
  const pagesToMigrate = ["about.md", "links.md", "subscription.md"];

  for (const page of pagesToMigrate) {
    const filePath = path.join(sourceDir, page);
    if (fs.existsSync(filePath)) {
      try {
        migratePage(filePath, outputDir);
      } catch (error) {
        console.error(`Error migrating ${page}:`, error);
      }
    } else {
      console.log(`Page not found, skipping: ${page}`);
    }
  }
}

function main(): void {
  console.log("Starting content migration...\n");

  // Migrate posts
  console.log("--- Migrating Posts ---");
  migrateDirectory(
    path.join(JEKYLL_DIR, "_posts"),
    path.join(CONTENT_DIR, "posts"),
    "post"
  );

  console.log("\n--- Migrating Weeklies ---");
  migrateDirectory(
    path.join(JEKYLL_DIR, "_weeklies"),
    path.join(CONTENT_DIR, "weeklies"),
    "weekly"
  );

  console.log("\n--- Migrating Pages ---");
  migratePages(
    path.join(JEKYLL_DIR, "_pages"),
    path.join(CONTENT_DIR, "pages")
  );

  console.log("\nMigration complete!");
}

main();
