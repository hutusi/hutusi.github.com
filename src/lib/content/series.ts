import fs from 'fs';
import { siteConfig } from '../../../site.config';
import { byDateAsc, byDateDesc } from '../sort';
import type { PostData, CollectionContext, PostNavItem } from './types';
import { domainDir } from './io';
import { createKeyedMemo } from './cache';
import { resolveSeriesIndexInfo, getSeriesAuthors } from './series-metadata';
import { parseMarkdownFile, parseRstFile } from './parse';
import { getAllPosts, getAllPostsIncludingUnpublished, getPostBySlug } from './posts';

/**
 * Series and collection queries. Collections live here, not in their own
 * module, because they ARE series folders (`type: collection` in the
 * series index): getAllSeries expands collections via getCollectionPosts,
 * and getCollectionPosts resolves its items via getSeriesPosts/getSeriesData —
 * splitting the two would create an import cycle.
 */

const DEFAULT_LOCALE = siteConfig.i18n.defaultLocale;

/** Composite memo key: locale trees are parallel content sets, so every per-slug memo is per-locale too. */
function localeKey(locale: string, slug: string): string {
  return `${locale} ${slug}`;
}

const seriesDataMemo = createKeyedMemo<string, PostData | null>();

export function getSeriesData(slug: string, locale: string = DEFAULT_LOCALE): PostData | null {
  return seriesDataMemo.get(localeKey(locale, slug), () => {
    const indexInfo = resolveSeriesIndexInfo(slug, locale);
    if (!indexInfo) return null;

    return indexInfo.format === 'rst'
      ? parseRstFile(indexInfo.fullPath, slug, undefined, slug, undefined, locale)
      : parseMarkdownFile(indexInfo.fullPath, slug, undefined, slug, locale);
  });
}

const seriesPostsMemo = createKeyedMemo<string, PostData[]>();

export function getSeriesPosts(seriesName: string, locale: string = DEFAULT_LOCALE): PostData[] {
  return seriesPostsMemo.get(localeKey(locale, seriesName), () => {
    const seriesData = getSeriesData(seriesName, locale);

    if (seriesData?.posts && seriesData.posts.length > 0) {
      // Manual Selection: fetch by slug. A slug that matches nothing in the
      // content tree is a build error (strict-build invariant — books throw
      // on missing chapters the same way); a post that exists but is
      // unpublished here (draft in production, future-dated) is skipped
      // silently like everywhere else.
      //
      // Prefer a post that already belongs to this series before the global
      // bare-slug lookup: duplicate slugs are legal across series, so a global
      // first-match would pull in another series' same-slug child. The global
      // fallback is what lets collections (type: collection) reference posts
      // that live outside the folder.
      return seriesData.posts.flatMap(slug => {
        const post =
          getAllPosts(locale).find(p => p.series === seriesName && p.slug === slug) ??
          getPostBySlug(slug, locale);
        if (post) return [post];
        if (getAllPostsIncludingUnpublished(locale).some(p => p.slug === slug)) return [];
        throw new Error(
          `[amytis] Series "${seriesName}" lists post "${slug}" in its manual order, ` +
          `but no post with that slug exists. Fix or remove the slug in the series index frontmatter.`
        );
      });
    }

    // Automatic: posts with series field matching this series
    const posts = getAllPosts(locale).filter(p => p.series === seriesName);

    // Default Sort: date-desc (Newest first)
    const sortOrder = seriesData?.sort || 'date-desc';
    if (sortOrder === 'date-asc') {
      posts.sort(byDateAsc);
    } else {
      posts.sort(byDateDesc);
    }
    return posts;
  });
}

const allSeriesMemo = createKeyedMemo<string, Record<string, PostData[]>>();

export function getAllSeries(locale: string = DEFAULT_LOCALE): Record<string, PostData[]> {
  return allSeriesMemo.get(locale, () => {
    const allPosts = getAllPosts(locale);
    const series: Record<string, PostData[]> = {};
    const seriesSet = new Set<string>();

    // 1. Collect series from posts
    allPosts.forEach((post) => {
      if (post.series) {
        seriesSet.add(post.series);
      }
    });

    // 2. Collect series from folders (in case no posts are yet tagged but folder exists)
    const localeSeriesDir = domainDir('series', locale);
    if (fs.existsSync(localeSeriesDir)) {
      const seriesFolders = fs.readdirSync(localeSeriesDir, { withFileTypes: true });
      seriesFolders.forEach(folder => {
        if (folder.isDirectory()) {
          seriesSet.add(folder.name);
        }
      });
    }

    // 3. Fetch posts for each series, filtering out draft series in production
    seriesSet.forEach(slug => {
      const seriesData = getSeriesData(slug, locale);
      if (process.env.NODE_ENV === 'production' && seriesData?.draft) {
        return; // Skip draft series in production
      }
      series[slug] = seriesData?.type === 'collection'
        ? getCollectionPosts(slug, locale).slice().sort(byDateDesc)
        : getSeriesPosts(slug, locale);
    });

    return series;
  });
}

const featuredSeriesMemo = createKeyedMemo<string, Record<string, PostData[]>>();

export function getFeaturedSeries(locale: string = DEFAULT_LOCALE): Record<string, PostData[]> {
  return featuredSeriesMemo.get(locale, () => {
    const allSeries = getAllSeries(locale);
    const featuredSeries: Record<string, PostData[]> = {};

    Object.keys(allSeries).forEach(slug => {
      const seriesData = getSeriesData(slug, locale);
      if (seriesData?.featured) {
        featuredSeries[slug] = allSeries[slug];
      }
    });

    return featuredSeries;
  });
}

const seriesLatestDateMemo = createKeyedMemo<string, string>();

export function getSeriesLatestPostDate(slug: string, locale: string = DEFAULT_LOCALE): string {
  return seriesLatestDateMemo.get(localeKey(locale, slug), () => {
    const seriesData = getSeriesData(slug, locale);
    const posts = seriesData?.type === 'collection' ? getCollectionPosts(slug, locale) : getSeriesPosts(slug, locale);
    const latestPostDate = posts.reduce((latest, post) => (post.date > latest ? post.date : latest), '');
    return latestPostDate || seriesData?.date || '';
  });
}

/**
 * Resolve display authors for a series: explicit series authors first,
 * then top contributors aggregated from the series' posts.
 */
export function resolveSeriesAuthors(slug: string, posts: PostData[], locale: string = DEFAULT_LOCALE): string[] {
  const explicit = getSeriesAuthors(slug, locale);
  if (explicit) return explicit;
  if (posts.length === 0) return [];
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const author of post.authors) {
      counts.set(author, (counts.get(author) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
}

const collectionPostsMemo = createKeyedMemo<string, PostData[]>();

/**
 * Series-qualified identity for collection membership. Bare slugs are
 * ambiguous — duplicate post slugs across series are legal (autoPaths gives
 * them distinct URLs) — so both the collection-item resolver and
 * `getCollectionsForPost` must match on this key, never on `post.slug` alone.
 */
function getCollectionKey(post: Pick<PostData, 'slug' | 'series'>): string {
  return post.series ? `${post.series}/${post.slug}` : `posts/${post.slug}`;
}

export function getCollectionPosts(collectionSlug: string, locale: string = DEFAULT_LOCALE): PostData[] {
  return collectionPostsMemo.get(localeKey(locale, collectionSlug), () => {
    const data = getSeriesData(collectionSlug, locale);
    if (data?.type !== 'collection' || !data.items) {
      return [];
    }

    const allPosts = getAllPosts(locale);
    const postIndex = new Map(allPosts.map((post) => [getCollectionKey(post), post]));
    const seen = new Set<string>();

    return data.items
      .flatMap(item => {
        if ('series' in item) {
          const posts = getSeriesPosts(item.series, locale);
          return item.exclude ? posts.filter(p => !item.exclude!.includes(p.slug)) : posts;
        }

        const post = item.post.includes('/')
          ? postIndex.get(item.post)
          : getPostBySlug(item.post, locale);
        if (post) return [post];

        // Same contract as manual series order above: unknown reference →
        // build error; existing-but-unpublished → silent skip.
        const existsUnpublished = getAllPostsIncludingUnpublished(locale).some(p =>
          item.post.includes('/') ? getCollectionKey(p) === item.post : p.slug === item.post
        );
        if (existsUnpublished) return [];
        throw new Error(
          `[amytis] Collection "${collectionSlug}" lists item "${item.post}", ` +
          `but no post matches it. Fix or remove the item in the collection index frontmatter.`
        );
      })
      .filter(post => {
        const key = getCollectionKey(post);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  });
}

/**
 * Project posts to the minimal fields the series/collection navigation needs,
 * so sibling article bodies never cross the server→client boundary. Mirrors
 * toFlowIndexItems for the flow archive.
 */
export function toPostNavItems(posts: PostData[]): PostNavItem[] {
  return posts.map(p => ({ slug: p.slug, title: p.title, date: p.date, series: p.series, locale: p.locale }));
}

const collectionsForPostMemo = createKeyedMemo<string, CollectionContext[]>();

export function getCollectionsForPost(post: Pick<PostData, 'slug' | 'series'> & { locale?: string }): CollectionContext[] {
  const locale = post.locale ?? DEFAULT_LOCALE;
  const postKey = getCollectionKey(post);
  return collectionsForPostMemo.get(localeKey(locale, postKey), () => {
    const localeSeriesDir = domainDir('series', locale);
    if (!fs.existsSync(localeSeriesDir)) return [];
    const seriesFolders = fs.readdirSync(localeSeriesDir, { withFileTypes: true });
    const results: CollectionContext[] = [];

    for (const folder of seriesFolders) {
      if (!folder.isDirectory()) continue;
      const data = getSeriesData(folder.name, locale);
      if (data?.type !== 'collection') continue;
      if (process.env.NODE_ENV === 'production' && data.draft) continue;
      const posts = getCollectionPosts(folder.name, locale);
      if (posts.some(p => getCollectionKey(p) === postKey)) {
        results.push({ slug: folder.name, title: data.title, posts: toPostNavItems(posts) });
      }
    }

    return results;
  });
}
