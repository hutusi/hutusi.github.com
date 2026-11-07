import { Metadata } from 'next';
import { isFeatureEnabled } from '@/lib/features';
import { notFound } from 'next/navigation';
import { getTranslator, resolveLocaleValue } from '@/lib/i18n';
import { siteConfig } from '../../../site.config';
import KnowledgeGraph from '@/components/KnowledgeGraphLazy';
import PageHeader from '@/components/PageHeader';

const DEFAULT_LOCALE = siteConfig.i18n.defaultLocale;
const { t } = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: `${t('graph')} | ${resolveLocaleValue(siteConfig.title, DEFAULT_LOCALE)}`,
  description: t('graph_subtitle'),
};

export default function GraphPage() {
  if (!isFeatureEnabled('flow')) notFound();
  return (
    <div className="layout-main">
      <PageHeader titleKey="graph" subtitleKey="graph_subtitle" className="mb-12" />
      <KnowledgeGraph />
    </div>
  );
}
