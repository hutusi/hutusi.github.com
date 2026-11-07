import { getAllNotes } from '@/lib/content/notes';
import { isFeatureEnabled } from '@/lib/features';
import { paginationStaticParams } from '@/lib/pagination';
import { siteConfig } from '../../../../../site.config';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createListingMetadata } from '@/lib/metadata';
import NotesIndexBody from '@/components/page-bodies/NotesIndexBody';

const DEFAULT_LOCALE = siteConfig.i18n.defaultLocale;

const PAGE_SIZE = siteConfig.pagination.notes ?? 20;

export function generateStaticParams() {
  return paginationStaticParams(getAllNotes().length, PAGE_SIZE, {
    enabled: isFeatureEnabled('flow'),
  });
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  const totalPages = Math.ceil(getAllNotes().length / PAGE_SIZE);
  return createListingMetadata({ locale: DEFAULT_LOCALE, titleKey: 'notes', page: parseInt(page, 10), totalPages });
}

export default async function NotesPaginatedPage({ params }: { params: Promise<{ page: string }> }) {
  if (!isFeatureEnabled('flow')) notFound();
  const { page: pageStr } = await params;
  const page = parseInt(pageStr, 10);
  if (isNaN(page) || page < 2) notFound();
  return <NotesIndexBody locale={DEFAULT_LOCALE} page={page} />;
}
