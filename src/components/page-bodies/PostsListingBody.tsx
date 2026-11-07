import { getListingPosts } from '@/lib/content/posts';
import PostList from '@/components/PostList';
import Pagination from '@/components/Pagination';
import PageHeader from '@/components/PageHeader';
import { notFound } from 'next/navigation';
import { firstPage, paginate } from '@/lib/pagination';
import { siteConfig } from '../../../site.config';

const PAGE_SIZE = siteConfig.pagination.posts;

interface PostsListingBodyProps {
  locale: string;
  page: number;
  /** Already-localized pagination base (e.g. `/posts`, `/articles`, `/zh/posts`). */
  paginationBasePath: string;
}

/**
 * Shared body for the posts listing (page 1 and page N). Rendered by
 * `/posts`, `/posts/page/[page]`, the custom-basePath branches of
 * `/[slug]` + `/[slug]/page/[page]`, and the locale-prefixed trees.
 */
export default function PostsListingBody({ locale, page, paginationBasePath }: PostsListingBodyProps) {
  const allPosts = getListingPosts(locale);
  const slice = page === 1 ? firstPage(allPosts, PAGE_SIZE) : paginate(allPosts, page, PAGE_SIZE);
  if (!slice) notFound();
  const { items: posts, totalPages } = slice;

  return (
    <div className="layout-main">
      {page === 1 ? (
        <PageHeader
          titleKey="posts"
          subtitleKey="posts_subtitle"
          subtitleParams={{ count: allPosts.length }}
          className="mb-12"
        />
      ) : (
        <PageHeader
          titleKey="posts"
          subtitleKey="page_of_total"
          subtitleParams={{ page, total: totalPages }}
          className="mb-12"
        />
      )}

      <PostList posts={posts} locale={locale} />

      {(page > 1 || totalPages > 1) && (
        <div className="mt-12">
          <Pagination currentPage={page} totalPages={totalPages} basePath={paginationBasePath} />
        </div>
      )}
    </div>
  );
}
