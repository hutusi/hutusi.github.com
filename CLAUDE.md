# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog (hutusi.com / 胡涂说) built with Next.js 16.1.1 + React 19, migrated from Jekyll. It uses static site generation with `output: "export"` - no server runtime is needed. Package manager is **bun**.

## Commands

```bash
# Development server
bun run dev

# Build static site (outputs to /out)
bun run build

# Preview static build
bunx serve out

# Lint
bun run lint

# Deploy to server
bun run deploy
```

## Architecture

### Project Structure

```
app/                  # Next.js App Router pages
components/           # React components (18 files)
  layout/             # Header.tsx, Footer.tsx
  posts/              # PostCard, PostList, FeaturedSection, Pagination, etc.
  comments/           # Comments, GiscusComments, DisqusComments
  analytics/          # GoogleAnalytics, UmamiAnalytics
  theme/              # ThemeToggle, ThemeProvider
  MDXImage.tsx        # Custom image with CDN resolution
  MDXLink.tsx         # Smart internal/external link handling
config/               # Site config (site.ts) and navigation (navigation.ts)
content/              # MDX content files
  posts/              # 74 blog articles
  weeklies/           # 24 weekly newsletters
  pages/              # 3 static pages (about, links, subscription)
lib/                  # Core utilities
  content.ts          # Content loading (getAllPosts, getPostBySlug, etc.)
  utils.ts            # Helpers (formatDate, getImageUrl, cn, slugify)
types/                # TypeScript type definitions (post.ts)
public/               # Static assets (favicons, SVGs)
deployment/           # deploy.sh, nginx config
scripts/              # migrate-content.ts
```

### Content System

Content files in `content/` use `YYYY-MM-DD-slug.md` naming. The date prefix is stripped automatically to form the slug. Content is loaded via `lib/content.ts` using `gray-matter` for frontmatter and `reading-time` for read time estimates.

Key content functions in `lib/content.ts`:
- `getAllPosts()` / `getPostBySlug(slug)` - Blog posts
- `getAllWeeklies()` / `getWeeklyBySlug(slug)` - Newsletters
- `getFeaturedPosts()` / `getRandomFeaturedPosts(count)` - Featured content
- `getPostsByCategory(cat)` / `getPostsByTag(tag)` / `getPostsByYear(year)` - Filtering
- `getAllCategories()` / `getAllTags()` / `getAllYears()` - Aggregation
- `getAdjacentPosts(slug, type)` - Previous/next navigation
- `getPageContent(slug)` - Static page loader

### Frontmatter Schema

```yaml
title: Article Title
subtitle: Optional subtitle
date: 'YYYY-MM-DDTHH:mm:ss.000Z'
category: essay | tech | weekly
tags:
  - tag1
  - tag2
image: relative/path/to/image.jpg  # or full CDN URL
featured: boolean       # optional, shows on homepage carousel
description: string     # optional
gh_discussion: number   # optional, GitHub discussion ID for Giscus
redirect_from: string[] # optional, legacy URL redirects
rating: number          # optional
toc: boolean            # optional
last_modified_at: string # optional
commentable: boolean    # optional
```

### Routing

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Homepage with featured posts |
| `/articles` | `app/articles/page.tsx` | All articles list |
| `/articles/[slug]` | `app/articles/[slug]/page.tsx` | Individual article |
| `/articles/page/[num]` | `app/articles/page/[num]/page.tsx` | Paginated articles |
| `/weeklies` | `app/weeklies/page.tsx` | All newsletters |
| `/weeklies/[slug]` | `app/weeklies/[slug]/page.tsx` | Individual newsletter |
| `/weeklies/page/[num]` | `app/weeklies/page/[num]/page.tsx` | Paginated newsletters |
| `/tag/[name]` | `app/tag/[name]/page.tsx` | Posts by tag |
| `/tags` | `app/tags/page.tsx` | All tags |
| `/category/[name]` | `app/category/[name]/page.tsx` | Posts by category |
| `/categories` | `app/categories/page.tsx` | All categories |
| `/[year]` | `app/[year]/page.tsx` | Posts by year |
| `/archive` | `app/archive/page.tsx` | Full archive timeline |
| `/about` | `app/about/page.tsx` | About page |
| `/links` | `app/links/page.tsx` | Friendly links |
| `/subscription` | `app/subscription/page.tsx` | Newsletter subscription |
| `/feed.xml` | `app/feed.xml/route.ts` | RSS feed |
| `/sitemap.xml` | `app/sitemap.xml/route.ts` | XML sitemap |

All dynamic routes use `generateStaticParams()` for static pre-rendering.

### Configuration

- `config/site.ts` - Site metadata, author info, social links, analytics IDs, CDN base URL (`https://cdn.hutusi.com/images`), `postsPerPage: 9`
- `config/navigation.ts` - 7 header navigation items (关于, 文章, 周刊, 归档, 标签, 链接, 订阅)
- `next.config.ts` - Static export, `trailingSlash: false`, `reactCompiler: true`, unoptimized images

### Key Patterns

**Server vs Client Components**: Most pages are server components. Client components (marked `"use client"`) include: Header, Footer, ThemeToggle, Comments, FeaturedSection, ReadingProgress, TableOfContents, archive page.

**Image URLs**: Use `getImageUrl()` from `lib/utils.ts` - resolves relative paths to `cdn.hutusi.com`, preserves absolute URLs, falls back to default image.

**Date Formatting**: Use `formatDate()` for Chinese format ("2023年10月6日") or `formatDateShort()` for "2023/10/06". Dates use UTC methods internally.

**MDX Rendering**: Server-side via `next-mdx-remote/rsc` with plugins:
- `remark-gfm` - GitHub Flavored Markdown
- `rehype-slug` - Heading IDs
- `rehype-pretty-code` + `shiki` - Syntax highlighting (GitHub light/dark themes)
- Custom components: `MDXImage` (CDN + lazy loading), `MDXLink` (smart routing)

**Comments**: Dual system - Giscus (primary, GitHub Discussions) and Disqus (fallback, lazy-loaded on tab click). Client components in `components/comments/`.

**Pagination**: 9 posts per page, configured in `config/site.ts` as `postsPerPage`.

**Theme**: Dark/light mode via `.dark` class on `<html>`. System preference detection + localStorage persistence. Anti-flash script in `<head>`. CSS variables defined in `app/globals.css`.

**Analytics**: Google Analytics 4 + Umami (privacy-focused). Both loaded as separate components.

**Styling**: Tailwind CSS v4 with `@tailwindcss/typography` for prose. Chinese-optimized font stack (Inter, Noto Sans SC, PingFang SC). Accent color: emerald green. Custom classes: `.card`, `.section-title`, `.tag`, animation utilities.

### Static Export Constraints

Since this uses `output: "export"`:
- No server-side rendering at runtime
- Images use `unoptimized: true` (no Next.js image optimization)
- All pages must be pre-rendered via `generateStaticParams()`
- RSS feed and sitemap are generated as static route handlers

### Key Dependencies

- `next` 16.1.1, `react` 19.2.3
- `next-mdx-remote` ^5.0.0, `gray-matter`, `reading-time`
- `rehype-pretty-code` + `shiki` for code highlighting
- `@giscus/react` for comments
- `tailwindcss` ^4, `@tailwindcss/typography`
- `babel-plugin-react-compiler` (React Compiler enabled)
