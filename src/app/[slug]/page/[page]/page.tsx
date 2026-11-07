import { getSeriesData } from '@/lib/content/series';
import PostsListingBody from '@/components/page-bodies/PostsListingBody';
import SeriesPrefixListingBody from '@/components/page-bodies/SeriesPrefixListingBody';
import { siteConfig } from '../../../../../site.config';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslator, resolveLocaleValue } from '@/lib/i18n';
import { getPostsBasePath } from '@/lib/urls';
import { prefixedPageParams, resolveSeriesListingPrefix } from '@/lib/route-aliases';

const DEFAULT_LOCALE = siteConfig.i18n.defaultLocale;
const { t } = getTranslator(DEFAULT_LOCALE);

export async function generateStaticParams() {
  return prefixedPageParams();
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; page: string }>;
}): Promise<Metadata> {
  const { slug: prefix, page } = await params;
  const basePath = getPostsBasePath();
  const matchedSeriesSlug = resolveSeriesListingPrefix(prefix);

  if (prefix === basePath && basePath !== 'posts') {
    return {
      title: `${t('posts')} - ${page} | ${resolveLocaleValue(siteConfig.title, DEFAULT_LOCALE)}`,
    };
  }

  if (matchedSeriesSlug) {
    const seriesData = getSeriesData(matchedSeriesSlug);
    const title = seriesData?.title || matchedSeriesSlug;
    return {
      title: `${title} - ${page} | ${resolveLocaleValue(siteConfig.title, DEFAULT_LOCALE)}`,
    };
  }

  return { title: 'Not Found' };
}

export default async function PrefixPageRoute({
  params,
}: {
  params: Promise<{ slug: string; page: string }>;
}) {
  const { slug: prefix, page: pageStr } = await params;
  const page = parseInt(pageStr, 10);

  if (isNaN(page) || page < 2) notFound();

  const basePath = getPostsBasePath();
  const matchedSeriesSlug = resolveSeriesListingPrefix(prefix);

  // Custom posts basePath listing
  if (prefix === basePath && basePath !== 'posts') {
    return <PostsListingBody locale={DEFAULT_LOCALE} page={page} paginationBasePath={`/${basePath}`} />;
  }

  // Series custom path listing
  if (matchedSeriesSlug) {
    return (
      <SeriesPrefixListingBody
        locale={DEFAULT_LOCALE}
        seriesSlug={matchedSeriesSlug}
        prefix={prefix}
        page={page}
      />
    );
  }

  notFound();
}
