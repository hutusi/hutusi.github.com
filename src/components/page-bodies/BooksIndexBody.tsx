import { getAllBooks } from '@/lib/content/books';
import { getBookUrl, localizeUrl } from '@/lib/urls';
import ContentCard from '@/components/ContentCard';
import PageHeader from '@/components/PageHeader';
import { getTranslator } from '@/lib/i18n';

/** Shared body for the books index (`/books` and its locale-prefixed variants). */
export default function BooksIndexBody({ locale }: { locale: string }) {
  const { t } = getTranslator(locale);
  const books = getAllBooks(locale);

  return (
    <div className="layout-main">
      <PageHeader
        titleKey="books"
        subtitleKey="books_subtitle"
        subtitleOneKey="books_subtitle_one"
        count={books.length}
        subtitleParams={{ count: books.length }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {books.map(book => (
          <ContentCard
            key={book.slug}
            href={localizeUrl(getBookUrl(book.slug), locale)}
            title={book.title}
            slug={book.slug}
            locale={locale}
            coverImage={book.coverImage}
            badge={`${book.chapters.length} ${t('chapters_count')}`}
            authors={book.authors}
            excerpt={book.excerpt}
          />
        ))}
      </div>
    </div>
  );
}
