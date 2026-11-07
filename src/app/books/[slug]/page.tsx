import { getBookData, getAllBooks } from '@/lib/content/books';
import { isFeatureEnabled } from '@/lib/features';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { siteConfig } from '../../../../site.config';
import BookLandingBody from '@/components/page-bodies/BookLandingBody';
import { resolveImageUrl } from '@/lib/json-ld';
import { buildArticleMetadata } from '@/lib/metadata';
import { getBookUrl } from '@/lib/urls';
import { bookContentLocales, contentSeoUrls } from '@/lib/locale-routes';
import { safeDecodeParam } from '@/lib/route-params';

const DEFAULT_LOCALE = siteConfig.i18n.defaultLocale;

export async function generateStaticParams() {
  if (!isFeatureEnabled('books')) return [{ slug: '_' }];
  const books = getAllBooks();
  if (books.length === 0) return [{ slug: '_' }];
  return books.map(book => ({ slug: book.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookData(safeDecodeParam(slug));

  if (!book) {
    return { title: 'Book Not Found' };
  }

  const siteUrl = siteConfig.baseUrl.replace(/\/+$/, '');
  const ogImage = resolveImageUrl(book.coverImage, siteConfig.ogImage, siteUrl);
  const defaultOgImage = resolveImageUrl(undefined, siteConfig.ogImage, siteUrl);

  // Twinned books advertise the reciprocal hreflang set; the canonical stays
  // this unprefixed URL either way (byte-identical for single-locale books).
  const seo = contentSeoUrls(getBookUrl(book.slug), bookContentLocales(book.slug));
  return buildArticleMetadata({
    locale: DEFAULT_LOCALE,
    title: book.title,
    description: book.excerpt,
    type: 'website',
    url: seo.canonicalUrl,
    canonicalUrl: seo.canonicalUrl,
    languageAlternates: seo.languageAlternates,
    ogImage,
    twitterCard: ogImage !== defaultOgImage ? 'summary_large_image' : 'summary',
  });
}

export default async function BookLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!isFeatureEnabled('books')) notFound();
  const { slug: rawSlug } = await params;
  const slug = safeDecodeParam(rawSlug);
  return <BookLandingBody locale={DEFAULT_LOCALE} bookSlug={slug} />;
}
