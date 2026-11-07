'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useLanguage } from './LanguageProvider';
import { localeStickyHref } from '@/lib/locale-urls';
import { siteConfig } from '../../site.config';

const LOCALE_CONFIG = {
  locales: siteConfig.i18n.enabled ? siteConfig.i18n.locales : [],
  defaultLocale: siteConfig.i18n.defaultLocale,
};

/**
 * Locale-sticky internal link for chrome rendered by Server Components
 * (Footer, structural sections): stays in the current locale when the target
 * exists there per the twin manifest, else falls back to the unprefixed
 * surface. A client leaf in the spirit of `T` — the structural component
 * stays on the server; only the href is language-reactive.
 */
export default function LocaleLink({ href, ...props }: Omit<ComponentProps<typeof Link>, 'href'> & { href: string }) {
  const { language, twinnedPaths } = useLanguage();
  return <Link href={localeStickyHref(href, language, twinnedPaths, LOCALE_CONFIG)} {...props} />;
}
