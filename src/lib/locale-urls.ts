/**
 * Pure locale-path helpers shared by the server URL builders (src/lib/urls.ts)
 * and client components (LanguageProvider, LanguageSwitch, Navbar).
 *
 * Every function takes the locale configuration as an argument instead of
 * reading site.config, so the logic stays defaultLocale-agnostic (a zh-default
 * site prefixes /en/ exactly as an en-default site prefixes /zh/) and is
 * directly unit-testable with any locale set. No fs, no Next.js imports —
 * safe in any bundle.
 */

export interface LocalePathConfig {
  /** Locale codes that participate in URL routing; empty when i18n is disabled. */
  locales: string[];
  defaultLocale: string;
}

/** Locale codes that appear as URL prefixes: every configured locale except the default. */
export function nonDefaultLocales(config: LocalePathConfig): string[] {
  return config.locales.filter((locale) => locale !== config.defaultLocale);
}

/**
 * Prefix a site-absolute path with a locale segment:
 * `localizePath('/posts/foo/', 'zh')` → `/zh/posts/foo/`. The default locale
 * owns the unprefixed tree, so it returns the path unchanged. Trailing-slash
 * presence is preserved (`'/'` → `/zh/`).
 */
export function localizePath(path: string, locale: string, config: LocalePathConfig): string {
  if (locale === config.defaultLocale) return path;
  return path === '/' ? `/${locale}/` : `/${locale}${path}`;
}

/**
 * Split a pathname into its locale and unprefixed form:
 * `/zh/posts/foo/` → `{ locale: 'zh', path: '/posts/foo/' }`;
 * `/posts/foo/` → `{ locale: defaultLocale, path: '/posts/foo/' }`.
 * Trailing-slash presence is preserved; `/zh` and `/zh/` both yield path `/`.
 * Only exact segment matches count — `/zhong/foo` is not a `zh` path.
 */
export function splitLocalePath(path: string, config: LocalePathConfig): { locale: string; path: string } {
  const first = path.split('/').find(Boolean);
  if (first && nonDefaultLocales(config).includes(first)) {
    const rest = path.slice(first.length + 1);
    return { locale: first, path: rest === '' ? '/' : rest };
  }
  return { locale: config.defaultLocale, path };
}

/** The unprefixed form of a pathname: `/zh/posts/foo/` → `/posts/foo/`. */
export function delocalizePath(path: string, config: LocalePathConfig): string {
  return splitLocalePath(path, config).path;
}

/**
 * Locale of a pathname. Null/undefined pathnames (renders outside a Next
 * router, e.g. unit tests) fall back to the default locale.
 */
export function localeFromPathname(pathname: string | null | undefined, config: LocalePathConfig): string {
  if (!pathname) return config.defaultLocale;
  return splitLocalePath(pathname, config).locale;
}

/**
 * Locale-sticky href for chrome links (nav, footer): on a non-default-locale
 * page, an internal link stays in that locale when the target exists there
 * (per the twin manifest), otherwise falls back to the unprefixed surface.
 * External URLs, fragments, and non-path hrefs pass through untouched.
 */
export function localeStickyHref(
  url: string,
  currentLocale: string,
  twinnedPaths: Record<string, string[]>,
  config: LocalePathConfig,
): string {
  if (currentLocale === config.defaultLocale) return url;
  if (!url.startsWith('/')) return url;
  // Match the manifest on the pathname only; query/fragment ride along.
  const suffixStart = url.search(/[?#]/);
  const pathPart = suffixStart === -1 ? url : url.slice(0, suffixStart);
  const suffix = suffixStart === -1 ? '' : url.slice(suffixStart);
  const normalized = pathPart.endsWith('/') ? pathPart : `${pathPart}/`;
  return (twinnedPaths[currentLocale] ?? []).includes(normalized)
    ? `${localizePath(pathPart, currentLocale, config)}${suffix}`
    : url;
}

/**
 * The next locale the language switch may cycle to. The default locale is
 * always reachable (its tree always exists); a non-default locale is only
 * switchable when it has manifest entries — cycling into an empty locale
 * would navigate to a home page that was never generated. Returns null when
 * no OTHER locale is switchable (the switch should render nothing).
 */
export function nextSwitchableLocale(
  current: string,
  twinnedPaths: Record<string, string[]>,
  config: LocalePathConfig,
): string | null {
  const { locales, defaultLocale } = config;
  const start = locales.indexOf(current);
  for (let step = 1; step <= locales.length; step++) {
    const candidate = locales[(start + step + locales.length) % locales.length];
    if (candidate === undefined || candidate === current) continue;
    if (candidate === defaultLocale || (twinnedPaths[candidate]?.length ?? 0) > 0) return candidate;
  }
  return null;
}

/**
 * Where the language switch should navigate: the current page's version in
 * the target locale when one exists there, otherwise the target's home.
 * `twinnedPaths` maps each non-default locale to the unprefixed-form paths
 * that EXIST in it, and the default locale to the default-side paths
 * reachable from any locale page. Checking the TARGET's entry uniformly is
 * what makes switching between two non-default locales work without a
 * default-tree twin.
 */
export function resolveSwitchTarget(
  pathname: string | null | undefined,
  currentLocale: string,
  targetLocale: string,
  twinnedPaths: Record<string, string[]>,
  config: LocalePathConfig,
): string {
  const unprefixed = delocalizePath(pathname || '/', config);
  const current = unprefixed.endsWith('/') ? unprefixed : `${unprefixed}/`;
  const exists = (twinnedPaths[targetLocale] ?? []).includes(current);
  return localizePath(exists ? current : '/', targetLocale, config);
}
