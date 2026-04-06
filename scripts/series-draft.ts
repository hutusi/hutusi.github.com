import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const args = process.argv.slice(2);
const seriesSlug = args.find(arg => !arg.startsWith('--'));
const undraft = args.includes('--undraft');

if (!seriesSlug) {
  console.error('Please provide a series slug.');
  console.error('Usage: bun run series-draft <series-slug> [--undraft]');
  console.error('');
  console.error('Options:');
  console.error('  --undraft   Remove draft status instead of setting it');
  process.exit(1);
}

const contentDir = path.join(process.cwd(), 'content', 'posts');
const seriesDir = path.join(process.cwd(), 'content', 'series', seriesSlug);

// Check if series exists
if (!fs.existsSync(seriesDir)) {
  console.error(`Error: Series "${seriesSlug}" not found at ${seriesDir}`);
  process.exit(1);
}

// Read series metadata to get manual posts list
let manualPosts: string[] = [];
const seriesIndexMdx = path.join(seriesDir, 'index.mdx');
const seriesIndexMd = path.join(seriesDir, 'index.md');
let seriesIndexPath = '';

if (fs.existsSync(seriesIndexMdx)) {
  seriesIndexPath = seriesIndexMdx;
} else if (fs.existsSync(seriesIndexMd)) {
  seriesIndexPath = seriesIndexMd;
}

if (seriesIndexPath) {
  const seriesContent = fs.readFileSync(seriesIndexPath, 'utf8');
  const { data } = matter(seriesContent);
  if (data.posts && Array.isArray(data.posts)) {
    manualPosts = data.posts;
  }
}

// Find all post files that belong to this series
const postFiles: { path: string; slug: string }[] = [];

// 1. Check posts in series folder
if (fs.existsSync(seriesDir)) {
  const items = fs.readdirSync(seriesDir, { withFileTypes: true });
  for (const item of items) {
    if (item.name === 'index.mdx' || item.name === 'index.md') continue;

    if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
      const slug = item.name.replace(/\.mdx?$/, '');
      postFiles.push({ path: path.join(seriesDir, item.name), slug });
    } else if (item.isDirectory()) {
      const indexMdx = path.join(seriesDir, item.name, 'index.mdx');
      const indexMd = path.join(seriesDir, item.name, 'index.md');
      if (fs.existsSync(indexMdx)) {
        postFiles.push({ path: indexMdx, slug: item.name });
      } else if (fs.existsSync(indexMd)) {
        postFiles.push({ path: indexMd, slug: item.name });
      }
    }
  }
}

// 2. Check posts in content/posts with series frontmatter or in manual list
if (fs.existsSync(contentDir)) {
  const items = fs.readdirSync(contentDir, { withFileTypes: true });
  for (const item of items) {
    let filePath = '';
    let slug = '';

    if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
      filePath = path.join(contentDir, item.name);
      slug = item.name.replace(/\.mdx?$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
    } else if (item.isDirectory()) {
      const indexMdx = path.join(contentDir, item.name, 'index.mdx');
      const indexMd = path.join(contentDir, item.name, 'index.md');
      if (fs.existsSync(indexMdx)) {
        filePath = indexMdx;
      } else if (fs.existsSync(indexMd)) {
        filePath = indexMd;
      }
      slug = item.name.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    }

    if (!filePath) continue;

    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);

    // Include if series matches or slug is in manual posts list
    if (data.series === seriesSlug || manualPosts.includes(slug)) {
      // Avoid duplicates
      if (!postFiles.find(p => p.path === filePath)) {
        postFiles.push({ path: filePath, slug });
      }
    }
  }
}

if (postFiles.length === 0) {
  console.log(`No posts found in series "${seriesSlug}".`);
  process.exit(0);
}

console.log(`Found ${postFiles.length} post(s) in series "${seriesSlug}":`);

let updated = 0;
for (const { path: filePath, slug } of postFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, content: body } = matter(content);

  const currentDraft = data.draft === true;
  const targetDraft = !undraft;

  if (currentDraft === targetDraft) {
    console.log(`  [skip] ${slug} - already ${targetDraft ? 'draft' : 'published'}`);
    continue;
  }

  data.draft = targetDraft;

  const newContent = matter.stringify(body, data);
  fs.writeFileSync(filePath, newContent);

  console.log(`  [${targetDraft ? 'draft' : 'publish'}] ${slug}`);
  updated++;
}

console.log(`\nUpdated ${updated} post(s).`);
