import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { getAllPosts, getAllFlows } from './markdown';
import { siteConfig } from '../../site.config';
import { getPostUrl, getFlowUrl } from './urls';

export interface FeedItem {
  title: string;
  url: string;
  date: Date;
  excerpt: string;
  /** Rendered HTML content for use in content:encoded / Atom <content> */
  content: string;
  tags: string[];
  authors?: string[];
}

function markdownToHtml(markdown: string): string {
  const result = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .processSync(markdown);
  return String(result);
}

/**
 * Returns feed items for RSS/Atom generation.
 * Includes all published posts (converted to HTML) and optionally flow notes
 * when `siteConfig.feed.includeFlows` is enabled. Results are sorted by date
 * descending and capped at `siteConfig.feed.maxItems` (0 = unlimited).
 */
export function getFeedItems(): FeedItem[] {
  const { maxItems, includeFlows } = siteConfig.feed;
  const baseUrl = siteConfig.baseUrl.replace(/\/+$/, '');

  const postItems: FeedItem[] = getAllPosts().map((post) => ({
    title: post.title,
    url: `${baseUrl}${getPostUrl(post)}`,
    date: new Date(post.date),
    excerpt: post.excerpt,
    content: markdownToHtml(post.content),
    tags: post.tags || [],
    authors: post.authors,
  }));

  let items: FeedItem[] = postItems;

  if (includeFlows) {
    const flowItems: FeedItem[] = getAllFlows().map((flow) => ({
      title: flow.title,
      url: `${baseUrl}${getFlowUrl(flow.slug)}`,
      date: new Date(flow.date),
      excerpt: flow.excerpt,
      content: markdownToHtml(flow.content),
      tags: flow.tags || [],
    }));
    items = [...postItems, ...flowItems].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  return maxItems > 0 ? items.slice(0, maxItems) : items;
}
