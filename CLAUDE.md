# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog (hutusi.com / 胡涂说) built with Next.js 16, migrated from Jekyll. It uses static site generation with `output: "export"` - no server runtime is needed.

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

# Run migration script (if migrating from Jekyll)
bun run scripts/migrate-content.ts
```

## Architecture

### Content System

All content is stored as MDX files in `content/`:
- `content/posts/` - Blog articles (73 posts)
- `content/weeklies/` - Weekly newsletters (23 issues)
- `content/pages/` - Static pages (about, links, subscription)

Content is loaded via `lib/content.ts` which provides functions like `getAllPosts()`, `getPostBySlug()`, `getFeaturedPosts()`, etc. These use `gray-matter` to parse frontmatter and `reading-time` for estimated read time.

### Frontmatter Schema

Posts use this frontmatter structure:
```yaml
title: Article Title
subtitle: Optional subtitle
date: 'YYYY-MM-DDTHH:mm:ss.000Z'
category: essay | tech | weekly
tags:
  - tag1
  - tag2
image: relative/path/to/image.jpg  # or full CDN URL
featured: boolean  # optional, shows on homepage
gh_discussion: number  # optional, GitHub discussion ID for Giscus
```

### Routing

The App Router structure mirrors URL paths:
- `/articles/[slug]/` - Individual posts (`app/articles/[slug]/page.tsx`)
- `/weeklies/[slug]/` - Individual weeklies
- `/tag/[name]/` - Posts by tag
- `/category/[name]/` - Posts by category
- `/[year]/` - Posts by year
- `/archive/` - All posts grouped by year

All dynamic routes use `generateStaticParams()` for static pre-rendering.

### Configuration

- `config/site.ts` - Site metadata, author info, social links, analytics IDs, CDN URL
- `config/navigation.ts` - Header navigation menu items

### Key Patterns

**Image URLs**: Use `getImageUrl()` from `lib/utils.ts` - it resolves relative paths to `cdn.hutusi.com` and handles fallbacks.

**Date Formatting**: Use `formatDate()` for Chinese format ("2023年10月6日") or `formatDateShort()` for "2023/10/06".

**MDX Rendering**: Posts render MDX server-side via `next-mdx-remote` with remark-gfm, rehype-slug, and rehype-autolink-headings plugins.

**Comments**: Dual system with Giscus (GitHub Discussions) and Disqus, switchable via tabs. Client components in `components/comments/`.

**Pagination**: 9 posts per page, configured in `config/site.ts` as `postsPerPage`.

### Static Export Constraints

Since this uses `output: "export"`:
- No server-side rendering at runtime
- Images use `unoptimized: true` (no Next.js image optimization)
- All pages must be pre-rendered via `generateStaticParams()`
