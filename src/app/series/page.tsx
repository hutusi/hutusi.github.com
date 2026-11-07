import { getAllSeries } from '@/lib/content/series';
import { isFeatureEnabled } from '@/lib/features';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import SeriesIndexBody from '@/components/page-bodies/SeriesIndexBody';
import { siteConfig } from '../../../site.config';
import { createListingMetadata } from '@/lib/metadata';

const DEFAULT_LOCALE = siteConfig.i18n.defaultLocale;

export async function generateMetadata(): Promise<Metadata> {
  const count = Object.keys(getAllSeries()).length;
  return createListingMetadata({ locale: DEFAULT_LOCALE, titleKey: 'series', descriptionKey: 'series_subtitle', count });
}

export default function SeriesIndexPage() {
  if (!isFeatureEnabled('series')) notFound();
  return <SeriesIndexBody locale={DEFAULT_LOCALE} />;
}
