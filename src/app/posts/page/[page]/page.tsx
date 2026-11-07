import { getListingPosts } from '@/lib/content/posts';
import PostsListingBody from '@/components/page-bodies/PostsListingBody';
import { siteConfig } from '../../../../../site.config';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createListingMetadata } from '@/lib/metadata';
import { getPostsBasePath } from '@/lib/urls';
import { paginationStaticParams } from '@/lib/pagination';

const DEFAULT_LOCALE = siteConfig.i18n.defaultLocale;

const PAGE_SIZE = siteConfig.pagination.posts;

export function generateStaticParams() {
  // Disabled when posts live under a custom basePath ([slug]/page/[page] handles it)
  return paginationStaticParams(getListingPosts().length, PAGE_SIZE, {
    enabled: getPostsBasePath() === 'posts',
    disabledSentinel: '_',
  });
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  const allPosts = getListingPosts();
  const totalPages = Math.ceil(allPosts.length / PAGE_SIZE);
  return createListingMetadata({ locale: DEFAULT_LOCALE, titleKey: 'posts', page: parseInt(page, 10), totalPages });
}

export default async function PostsPage({ params }: { params: Promise<{ page: string }> }) {
  const { page: pageStr } = await params;
  const page = parseInt(pageStr);
  if (isNaN(page) || page < 2) notFound();
  return <PostsListingBody locale={DEFAULT_LOCALE} page={page} paginationBasePath="/posts" />;
}
