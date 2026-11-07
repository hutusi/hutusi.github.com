import { getAllNotes, getNoteTags } from '@/lib/content/notes';
import { notFound } from 'next/navigation';
import { firstPage, paginate } from '@/lib/pagination';
import { localizeUrl } from '@/lib/urls';
import NoteContent from '@/components/NoteContent';
import PageHeader from '@/components/PageHeader';
import { siteConfig } from '../../../site.config';

const PAGE_SIZE = siteConfig.pagination.notes ?? 20;

interface NotesIndexBodyProps {
  locale: string;
  page: number;
}

/** Shared body for the notes listing (`/notes` + `/notes/page/[page]` and locale-prefixed variants). */
export default function NotesIndexBody({ locale, page }: NotesIndexBodyProps) {
  const allNotes = getAllNotes(locale);
  const slice = page === 1 ? firstPage(allNotes, PAGE_SIZE) : paginate(allNotes, page, PAGE_SIZE);
  if (!slice) notFound();
  const { items: notes, totalPages } = slice;
  const tags = getNoteTags(locale);
  const paginationBasePath = localizeUrl('/notes', locale);

  return (
    <div className="layout-main">
      {page === 1 ? (
        <PageHeader
          titleKey="notes"
          subtitleKey="notes_subtitle"
          subtitleParams={{ count: allNotes.length }}
          className="mb-12"
        />
      ) : (
        <PageHeader
          titleKey="notes"
          subtitleKey="page_of_total"
          subtitleParams={{ page, total: totalPages }}
          className="mb-12"
        />
      )}
      <NoteContent
        notes={notes}
        tags={tags}
        pagination={
          page > 1 || totalPages > 1
            ? { currentPage: page, totalPages, basePath: paginationBasePath }
            : undefined
        }
      />
    </div>
  );
}
