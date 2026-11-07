import { getListingPosts } from '@/lib/content/posts';
import PostsListingBody from '@/components/page-bodies/PostsListingBody';
import { siteConfig } from '../../../site.config';
import { Metadata } from 'next';
import { createListingMetadata } from '@/lib/metadata';
import { getPostsBasePath } from '@/lib/urls';
import { notFound } from 'next/navigation';

const DEFAULT_LOCALE = siteConfig.i18n.defaultLocale;

export async function generateMetadata(): Promise<Metadata> {
  const allPosts = getListingPosts();
  return createListingMetadata({ locale: DEFAULT_LOCALE, titleKey: 'posts', descriptionKey: 'posts_subtitle', count: allPosts.length });
}

export default function AllPostsPage() {
  if (getPostsBasePath() !== 'posts') notFound();
  return <PostsListingBody locale={DEFAULT_LOCALE} page={1} paginationBasePath="/posts" />;
}
