import Link from 'next/link';
import Hero from '@/components/Hero';
import PostList from '@/components/PostList';
import { getListingPosts } from '@/lib/content/posts';
import { getTranslator } from '@/lib/i18n';
import { getPostsBasePath, localizeUrl } from '@/lib/urls';
import { siteConfig } from '../../../site.config';

interface LocaleHomeBodyProps {
  locale: string;
}

/**
 * Home page of a locale tree (/zh/). Deliberately leaner than the default
 * home: hero plus the tree's recent posts — the sparse mirror carries no
 * homepage-section configuration of its own. The hero strings resolve per
 * locale via the TLocale leaves inside Hero.
 */
export default function LocaleHomeBody({ locale }: LocaleHomeBodyProps) {
  const { t } = getTranslator(locale);
  const posts = getListingPosts(locale);
  const recent = posts.slice(0, siteConfig.pagination.posts);

  return (
    <div className="layout-main">
      <Hero
        tagline={siteConfig.hero.tagline}
        title={siteConfig.hero.title}
        subtitle={siteConfig.hero.subtitle}
      />
      {recent.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-heading">{t('latest_writing')}</h2>
            <Link
              href={localizeUrl(`/${getPostsBasePath()}`, locale)}
              className="text-sm font-sans text-muted hover:text-accent transition-colors no-underline"
            >
              {t('view_all')} →
            </Link>
          </div>
          <PostList posts={recent} locale={locale} />
        </section>
      )}
    </div>
  );
}
