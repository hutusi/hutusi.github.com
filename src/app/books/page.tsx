import { getAllBooks } from '@/lib/content/books';
import { isFeatureEnabled } from '@/lib/features';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import BooksIndexBody from '@/components/page-bodies/BooksIndexBody';
import { siteConfig } from '../../../site.config';
import { createListingMetadata } from '@/lib/metadata';

const DEFAULT_LOCALE = siteConfig.i18n.defaultLocale;

export async function generateMetadata(): Promise<Metadata> {
  const books = getAllBooks();
  return createListingMetadata({
    locale: DEFAULT_LOCALE,
    titleKey: 'books',
    descriptionKey: 'books_subtitle',
    descriptionOneKey: 'books_subtitle_one',
    count: books.length,
  });
}

export default function BooksPage() {
  if (!isFeatureEnabled('books')) notFound();
  return <BooksIndexBody locale={DEFAULT_LOCALE} />;
}
