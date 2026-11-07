import fs from 'fs';
import path from 'path';
import { siteConfig } from '../../../site.config';

/**
 * Content-tree filesystem access and filename conventions.
 *
 * `readUtf8File` is the ONLY place in `src/lib/content/` allowed to call
 * `fs.readFileSync` — the path expression must carry the
 * `turbopackIgnore` annotation or Turbopack mis-bundles the read
 * (see CLAUDE.md). A guard test enforces the funnel.
 */

export const contentDirectory = path.join(process.cwd(), 'content', 'posts');
export const pagesDirectory = path.join(process.cwd(), 'content');
export const seriesDirectory = path.join(process.cwd(), 'content', 'series');
export const booksDirectory = path.join(process.cwd(), 'content', 'books');
export const flowsDirectory = path.join(process.cwd(), 'content', 'flows');
export const notesDirectory = path.join(process.cwd(), 'content', 'notes');

// ─── locale content trees ────────────────────────────────────────────────────
//
// content/ root = the default-locale tree; content/<locale>/ mirrors it for
// each configured non-default locale (content/zh/posts/…, content/zh/about.mdx).
// Language is determined by tree membership alone — no frontmatter signal.

const LOCALE_DIR_SHAPE = /^[a-z]{2}(-[A-Z]{2})?$/;
const CONTENT_TYPE_DIRS = new Set(['posts', 'series', 'books', 'flows', 'notes']);

export type ContentDomain = 'posts' | 'series' | 'books' | 'flows' | 'notes' | 'pages';

/** Root of a locale's content tree: content/ for the default locale, content/<locale>/ otherwise. */
export function contentRoot(locale: string): string {
  return locale === siteConfig.i18n.defaultLocale
    ? pagesDirectory
    : path.join(pagesDirectory, locale);
}

/** A content-type directory inside a locale tree ('pages' = the tree root itself). */
export function domainDir(domain: ContentDomain, locale: string): string {
  const root = contentRoot(locale);
  return domain === 'pages' ? root : path.join(root, domain);
}

/**
 * Tree-relative, extension-stripped identity of a content file — the twin key
 * across locale trees (content/posts/foo.mdx ↔ content/zh/posts/foo.md both
 * yield "posts/foo"). `/index` and `/README` basenames collapse onto their
 * folder so a flat translation can twin a folder-based original.
 */
export function treePathFor(fullPath: string, locale: string): string {
  const rel = path.relative(contentRoot(locale), fullPath).split(path.sep).join('/');
  return rel.replace(/\.(mdx?|rst)$/, '').replace(/\/(index|README)$/, '');
}

/**
 * The retired sibling-file convention (about.zh.mdx next to about.mdx) must
 * not silently coexist with locale trees — a leftover sibling would become an
 * unreachable shadow translation. Returns the offending locale suffix when a
 * filename still uses it, null otherwise. Pure; exported for tests.
 */
export function legacyLocaleSuffix(fileName: string, locales: string[]): string | null {
  const base = fileName.replace(/\.(mdx?|rst)$/, '');
  if (base === fileName) return null; // not a content file
  const parts = base.split('.');
  if (parts.length < 2) return null;
  const suffix = parts[parts.length - 1];
  return locales.includes(suffix) ? suffix : null;
}

/** Build-time throw for legacy locale sibling files, with the migration hint. */
export function assertNotLegacyLocaleSibling(fileName: string, parentDir: string): void {
  const suffix = legacyLocaleSuffix(fileName, siteConfig.i18n.locales);
  if (!suffix) return;
  const relDir = path.relative(process.cwd(), parentDir).split(path.sep).join('/');
  const hint = suffix === siteConfig.i18n.defaultLocale
    ? `Default-locale content belongs in the base file — drop the ".${suffix}" suffix.`
    : `Move it into the content/${suffix}/ tree at the same relative path ` +
      `(e.g. git mv content/about.${suffix}.mdx content/${suffix}/about.mdx).`;
  throw new Error(
    `[amytis] Locale sibling files are no longer supported: ${relDir}/${fileName}. ${hint}`
  );
}

/** Throws unless `locale` is the default or a configured (i18n-enabled) locale. */
export function assertKnownLocale(locale: string): void {
  if (locale === siteConfig.i18n.defaultLocale) return;
  if (siteConfig.i18n.enabled && siteConfig.i18n.locales.includes(locale)) return;
  throw new Error(
    `[amytis] Unknown content locale "${locale}" — it is not the default locale and not in i18n.locales (or i18n is disabled).`
  );
}

/** Pure validation core for a directory name found directly under content/. Exported for tests. */
export function classifyContentRootDir(
  name: string,
  config: { locales: string[]; defaultLocale: string; enabled: boolean },
): 'content-type' | 'locale' | 'ignored' {
  if (CONTENT_TYPE_DIRS.has(name)) return 'content-type';
  if (!LOCALE_DIR_SHAPE.test(name)) return 'ignored'; // non-locale-shaped dirs stay ignored (back-compat)
  if (name === config.defaultLocale) {
    throw new Error(
      `[amytis] content/${name}/ is the default locale — default-locale content lives at the content/ root. ` +
      `Move its contents up one level and delete the directory.`
    );
  }
  if (!config.enabled || !config.locales.includes(name)) {
    throw new Error(
      `[amytis] Unknown locale directory content/${name}/ — add "${name}" to i18n.locales (with i18n enabled) or rename the directory.`
    );
  }
  return 'locale';
}

/** Pure validation core for the entries inside a locale tree root. Exported for tests. */
export function validateLocaleTreeEntry(locale: string, entryName: string): void {
  if (entryName === 'flows') {
    throw new Error(
      `[amytis] content/${locale}/flows/ is not supported yet — flow locale trees are deferred. Remove the directory.`
    );
  }
  if (!CONTENT_TYPE_DIRS.has(entryName) && LOCALE_DIR_SHAPE.test(entryName)) {
    throw new Error(
      `[amytis] Nested locale directory content/${locale}/${entryName}/ is invalid — locale trees cannot nest.`
    );
  }
}

let activeLocalesCache: string[] | null = null;

/**
 * The default locale plus every locale whose content/<locale>/ tree exists on
 * disk, running the strict-build tree validations on the way (unknown or
 * default-locale-named dirs, nested locale dirs, unsupported flows trees all
 * throw). Prod-memoized; dev recomputes so a freshly added tree is seen.
 */
export function getActiveContentLocales(): string[] {
  if (process.env.NODE_ENV === 'production' && activeLocalesCache) return activeLocalesCache;

  const { defaultLocale, locales, enabled } = siteConfig.i18n;
  const active = [defaultLocale];
  if (fs.existsSync(pagesDirectory)) {
    const entries = fs.readdirSync(pagesDirectory, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (classifyContentRootDir(entry.name, { locales, defaultLocale, enabled }) !== 'locale') continue;
      const treeEntries = fs.readdirSync(path.join(pagesDirectory, entry.name), { withFileTypes: true });
      for (const treeEntry of treeEntries) {
        if (treeEntry.isDirectory()) validateLocaleTreeEntry(entry.name, treeEntry.name);
      }
      active.push(entry.name);
    }
  }

  if (process.env.NODE_ENV === 'production') activeLocalesCache = active;
  return active;
}

export function readUtf8File(filePath: string): string {
  return fs.readFileSync(/* turbopackIgnore: true */ filePath, 'utf8');
}

export function isMarkdownFilename(name: string): boolean {
  return name.endsWith('.md') || name.endsWith('.mdx');
}

export function isRstFilename(name: string): boolean {
  return name.endsWith('.rst');
}

/** Split a `YYYY-MM-DD-slug` file name into slug + date (honoring `posts.includeDateInUrl`). */
export function parseSlugAndDate(rawName: string): { slug: string; dateFromFileName?: string } {
  const dateRegex = /^(\d{4}-\d{2}-\d{2})-(.*)$/;
  const match = rawName.match(dateRegex);

  if (match) {
    return {
      dateFromFileName: match[1],
      slug: siteConfig.posts?.includeDateInUrl ? rawName : match[2],
    };
  }

  return { slug: rawName };
}

/** Reject series slugs that could escape the series directory (absolute, `..`, multi-segment). */
export function assertSafeSeriesSlug(seriesSlug: string): void {
  if (!seriesSlug || path.isAbsolute(seriesSlug)) {
    throw new Error(`[amytis] Invalid series slug "${seriesSlug}".`);
  }

  const segments = seriesSlug.split(/[\\/]/);
  if (segments.length !== 1 || segments[0] === '.' || segments[0] === '..') {
    throw new Error(`[amytis] Invalid series slug "${seriesSlug}".`);
  }
}
