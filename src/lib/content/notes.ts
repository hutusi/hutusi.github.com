import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';
import { siteConfig } from '../../../site.config';
import { byDateDesc } from '../sort';
import { extractContentMetrics } from '../text-metrics';
import type { Heading } from './types';
import { domainDir, treePathFor, getActiveContentLocales, assertKnownLocale, assertNotLegacyLocaleSibling, readUtf8File } from './io';
import { createProdKeyedMemo } from './cache';
import { dateField, draftField, tagsField, invalidFrontmatterError } from './schema';

const DEFAULT_LOCALE = siteConfig.i18n.defaultLocale;

/**
 * Notes: flat knowledge-base entries in content/notes/. Notes support
 * wikilink aliases and backlinks (resolved by the discovery layer).
 */

const NoteSchema = z.object({
  title: z.string(),
  date: dateField.optional(),
  tags: tagsField,
  draft: draftField,
  aliases: z.array(z.string()).optional().default([]),
  toc: z.boolean().optional().default(true),
  backlinks: z.boolean().optional().default(true),
  commentable: z.boolean().optional(),
});

export interface NoteData {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  draft: boolean;
  aliases: string[];
  toc: boolean;
  backlinks: boolean;
  commentable?: boolean;
  content: string;
  excerpt: string;
  headings: Heading[];
  readingMinutes: number;
  wordCount: number;
  /** Locale tree this note was loaded from (siteConfig.i18n.defaultLocale for the content/ root tree). */
  locale: string;
  /** Tree-relative, extension-stripped source identity — the twin key across locale trees (io.treePathFor). */
  treePath: string;
}

function parseNoteFile(fullPath: string, slug: string, locale: string): NoteData {
  const fileContents = readUtf8File(fullPath);
  const { data: rawData, content } = matter(fileContents);

  const parsed = NoteSchema.safeParse(rawData);
  if (!parsed.success) {
    throw invalidFrontmatterError('note frontmatter', fullPath, parsed.error);
  }
  const data = parsed.data;

  const { contentWithoutH1, excerpt, headings, readingMinutes, wordCount } = extractContentMetrics(content);
  const date = data.date || fs.statSync(fullPath).mtime.toISOString().split('T')[0];

  return {
    slug,
    title: data.title,
    date,
    tags: data.tags,
    draft: data.draft,
    aliases: data.aliases,
    toc: data.toc,
    backlinks: data.backlinks,
    commentable: data.commentable,
    content: contentWithoutH1,
    excerpt,
    headings,
    readingMinutes,
    wordCount,
    locale,
    treePath: treePathFor(fullPath, locale),
  };
}

const allNotesMemo = createProdKeyedMemo<string, NoteData[]>();

export function getAllNotes(locale: string = DEFAULT_LOCALE): NoteData[] {
  assertKnownLocale(locale);
  // Prod-only memo: dev re-reads on every call so HMR sees fresh notes.
  return allNotesMemo.get(locale, () => {
    const localeNotesDir = domainDir('notes', locale);
    if (!fs.existsSync(localeNotesDir)) return [];

    const notes: NoteData[] = [];
    const items = fs.readdirSync(localeNotesDir, { withFileTypes: true });

    for (const item of items) {
      if (!item.isFile()) continue;
      if (!item.name.endsWith('.md') && !item.name.endsWith('.mdx')) continue;
      assertNotLegacyLocaleSibling(item.name, localeNotesDir);
      const slug = item.name.replace(/\.mdx?$/, '');
      const fullPath = path.join(localeNotesDir, item.name);
      // Let parse errors propagate — a malformed note must fail the build, not
      // silently vanish (strict-build invariant; matches getAllFlows).
      notes.push(parseNoteFile(fullPath, slug, locale));
    }

    return notes
      .filter(note => process.env.NODE_ENV !== 'production' || !note.draft)
      .sort(byDateDesc);
  });
}

export function getNoteBySlug(slug: string, locale: string = DEFAULT_LOCALE): NoteData | null {
  assertKnownLocale(locale);
  const localeNotesDir = domainDir('notes', locale);
  if (!fs.existsSync(localeNotesDir)) return null;

  const mdxPath = path.join(localeNotesDir, `${slug}.mdx`);
  const mdPath = path.join(localeNotesDir, `${slug}.md`);

  let fullPath = '';
  if (fs.existsSync(mdxPath)) fullPath = mdxPath;
  else if (fs.existsSync(mdPath)) fullPath = mdPath;
  else return null;

  // null only when the note doesn't exist; a malformed note throws (strict-build,
  // matches getFlowBySlug).
  const note = parseNoteFile(fullPath, slug, locale);
  if (process.env.NODE_ENV === 'production' && note.draft) return null;
  return note;
}

export function getAdjacentNotes(slug: string, locale: string = DEFAULT_LOCALE): { prev: NoteData | null; next: NoteData | null } {
  const allNotes = getAllNotes(locale); // sorted newest-first
  const index = allNotes.findIndex(n => n.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index < allNotes.length - 1 ? allNotes[index + 1] : null, // older
    next: index > 0 ? allNotes[index - 1] : null, // newer
  };
}

export function getRecentNotes(limit: number = 5, locale: string = DEFAULT_LOCALE): NoteData[] {
  return getAllNotes(locale).slice(0, limit);
}

export function getNoteTags(locale: string = DEFAULT_LOCALE): Record<string, number> {
  const tags: Record<string, number> = {};
  getAllNotes(locale).forEach(note => {
    note.tags.forEach(tag => {
      const normalized = tag.toLowerCase();
      tags[normalized] = (tags[normalized] || 0) + 1;
    });
  });
  return tags;
}

export function getNotesByTag(tag: string, locale: string = DEFAULT_LOCALE): NoteData[] {
  return getAllNotes(locale).filter(n =>
    n.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

// ─── cross-tree aggregation ──────────────────────────────────────────────────

const aggregatedNotesMemo = createProdKeyedMemo<string, NoteData[]>();

/**
 * The default tree plus every locale tree's ORIGINAL notes, deduplicated by
 * treePath in [default, …locales] order so a twin (in any pair of trees)
 * counts once. Mirrors posts.getPostsWithLocaleOriginals — the shared domain
 * for the global taxonomy surfaces.
 */
export function getNotesWithLocaleOriginals(): NoteData[] {
  return aggregatedNotesMemo.get('all', () => {
    const nonDefault = siteConfig.i18n.enabled
      ? siteConfig.i18n.locales.filter(locale => locale !== DEFAULT_LOCALE)
      : [];
    const seen = new Set(getAllNotes().map(note => note.treePath));
    const result = [...getAllNotes()];
    for (const locale of nonDefault) {
      for (const note of getAllNotes(locale)) {
        if (seen.has(note.treePath)) continue;
        seen.add(note.treePath);
        result.push(note);
      }
    }
    return result.sort(byDateDesc);
  });
}

/** Tag lookup over the aggregated (default ∪ originals) note domain — for the global /tags pages. */
export function getAggregatedNotesByTag(tag: string): NoteData[] {
  return getNotesWithLocaleOriginals().filter(note =>
    note.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

// ─── twin lookups across locale trees ────────────────────────────────────────

/** Locales (including the note's own) whose tree contains a note with the same treePath. */
export function getNoteContentLocales(note: Pick<NoteData, 'treePath' | 'locale'>): string[] {
  return getActiveContentLocales().filter(
    locale => locale === note.locale || getAllNotes(locale).some(n => n.treePath === note.treePath)
  );
}

/** The same note in another locale tree (matched by treePath), or null. */
export function getTwinNote(note: Pick<NoteData, 'treePath'>, locale: string): NoteData | null {
  return getAllNotes(locale).find(n => n.treePath === note.treePath) ?? null;
}
