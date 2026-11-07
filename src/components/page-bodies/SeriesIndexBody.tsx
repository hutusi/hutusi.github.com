import { getAllSeries, getSeriesData, getSeriesLatestPostDate, resolveSeriesAuthors } from '@/lib/content/series';
import { getSeriesUrl, localizeUrl } from '@/lib/urls';
import ContentCard from '@/components/ContentCard';
import PageHeader from '@/components/PageHeader';
import { getTranslator } from '@/lib/i18n';

/** Shared body for the series index (`/series` and its locale-prefixed variants). */
export default function SeriesIndexBody({ locale }: { locale: string }) {
  const { t } = getTranslator(locale);
  const allSeries = getAllSeries(locale);

  // Sort by most recent post date (active series first)
  const seriesSlugs = Object.keys(allSeries).sort((a, b) => {
    const latestA = getSeriesLatestPostDate(a, locale);
    const latestB = getSeriesLatestPostDate(b, locale);
    return latestB.localeCompare(latestA);
  });

  const totalSeries = seriesSlugs.length;

  return (
    <div className="layout-main">
      <PageHeader
        titleKey="series"
        subtitleKey="series_subtitle"
        subtitleOneKey="series_subtitle_one"
        count={totalSeries}
        subtitleParams={{ count: totalSeries }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {seriesSlugs.map(slug => {
          const posts = allSeries[slug];
          const seriesData = getSeriesData(slug, locale);
          const title = seriesData?.title || slug.charAt(0).toUpperCase() + slug.slice(1);
          const description = seriesData?.excerpt || t('series_default_excerpt');
          const authors = resolveSeriesAuthors(slug, posts, locale);

          return (
            <ContentCard
              key={slug}
              href={localizeUrl(getSeriesUrl(slug), locale)}
              title={title}
              slug={slug}
              locale={locale}
              coverImage={seriesData?.coverImage}
              badge={`${posts.length} ${t('parts')}`}
              authors={authors}
              excerpt={description}
            />
          );
        })}
      </div>
    </div>
  );
}
