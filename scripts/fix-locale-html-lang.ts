import fs from 'fs';
import path from 'path';
import { siteConfig } from '../site.config';

/**
 * Post-export pass: stamp the correct `lang` on the <html> tag of every page
 * under out/<locale>/**. Static export has ONE root layout, so every page is
 * emitted with the default locale's lang attribute; the client corrects it
 * after hydration, but crawlers and no-JS readers see the exported markup.
 *
 * Running BEFORE Pagefind is load-bearing: Pagefind splits its index by
 * <html lang>, so this pass gives locale pages their own index with correct
 * word segmentation (CJK) and keeps translations from appearing as duplicate
 * results in the default-locale search.
 *
 * Idempotent — rewriting an already-correct tree is a no-op.
 */

/** Replace the lang attribute on the root <html …> tag only. Exported for tests. */
export function rewriteHtmlLangAttribute(html: string, locale: string): string {
  return html.replace(/(<html\b[^>]*\blang=")[^"]*(")/, `$1${locale}$2`);
}

function rewriteTree(dir: string, locale: string): number {
  let changed = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      changed += rewriteTree(fullPath, locale);
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;
    const html = fs.readFileSync(fullPath, 'utf8');
    const rewritten = rewriteHtmlLangAttribute(html, locale);
    if (rewritten !== html) {
      fs.writeFileSync(fullPath, rewritten);
      changed++;
    }
  }
  return changed;
}

function main(): void {
  const outDir = path.join(process.cwd(), 'out');
  const { enabled, defaultLocale, locales } = siteConfig.i18n;
  const nonDefault = enabled ? locales.filter((l) => l !== defaultLocale) : [];

  for (const locale of nonDefault) {
    const localeDir = path.join(outDir, locale);
    if (!fs.existsSync(localeDir)) continue; // sparse mirror — nothing exported for this locale
    const changed = rewriteTree(localeDir, locale);
    console.log(`[fix-locale-html-lang] ${locale}: ${changed} page(s) stamped lang="${locale}"`);
  }
}

if (import.meta.main) {
  main();
}
