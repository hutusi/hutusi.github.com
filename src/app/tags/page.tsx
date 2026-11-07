import { getAllTags } from '@/lib/content/discovery';
import { siteConfig } from '../../../site.config';
import { Metadata } from 'next';
import { getTranslator, resolveLocaleValue } from '@/lib/i18n';
import PageHeader from '@/components/PageHeader';
import TagsIndexClient from '@/components/TagsIndexClient';

const DEFAULT_LOCALE = siteConfig.i18n.defaultLocale;
const { t } = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: `${t('tags')} | ${resolveLocaleValue(siteConfig.title, DEFAULT_LOCALE)}`,
  description: t('tags_description'),
};

export default function TagsPage() {
  const tags = getAllTags();
  const totalTags = Object.keys(tags).length;

  return (
    <div className="layout-main">
      <PageHeader
        titleKey="tags"
        subtitleKey="tags_subtitle"
        subtitleOneKey="tags_subtitle_one"
        count={totalTags}
        subtitleParams={{ count: totalTags }}
      />

      <main>
        <TagsIndexClient tags={tags} />
      </main>
    </div>
  );
}
