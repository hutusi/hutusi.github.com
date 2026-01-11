# hutusi.com Next.js Migration Roadmap

This document tracks the migration progress from Jekyll to Next.js.

## Completed

### Phase 1: Project Setup
- [x] Initialize Next.js 15 with App Router
- [x] Configure Bun as package manager
- [x] Set up TypeScript
- [x] Configure Tailwind CSS v4
- [x] Set up MDX with next-mdx-remote
- [x] Configure static export (`output: 'export'`)

### Phase 2: Content Migration
- [x] Create migration script (`scripts/migrate-content.ts`)
- [x] Migrate 73 posts from `_posts/` to `content/posts/`
- [x] Migrate 23 weeklies from `_weeklies/` to `content/weeklies/`
- [x] Migrate static pages (about, links, subscription)
- [x] Transform frontmatter (tags from space-separated to array)
- [x] Convert Jekyll image syntax to CDN URLs

### Phase 3: Core Components
- [x] Create site configuration (`config/site.ts`)
- [x] Create navigation configuration (`config/navigation.ts`)
- [x] Build Header component with responsive navigation
- [x] Build Footer component with social links
- [x] Create content loading library (`lib/content.ts`)
- [x] Create utility functions (`lib/utils.ts`)

### Phase 4: Post Components
- [x] PostCard component
- [x] FeaturedCard component
- [x] FeaturedSection with rotation
- [x] PostList component
- [x] Pagination component

### Phase 5: Page Routes
- [x] Homepage with featured posts and recent content
- [x] Articles list page with pagination
- [x] Individual article pages
- [x] Weeklies list page with pagination
- [x] Individual weekly pages
- [x] Archive page with year grouping
- [x] Category pages (essay, tech, weekly, life)
- [x] Tag pages (97 tags)
- [x] Year archive pages (2007-2026)
- [x] Static pages (about, links, subscription)
- [x] 404 Not Found page

### Phase 6: Interactive Features
- [x] Giscus comments integration
- [x] Disqus comments integration (lazy-loaded)
- [x] Dual comment system with tab switching

### Phase 7: SEO & Analytics
- [x] Google Analytics integration
- [x] Umami Analytics integration
- [x] RSS feed (`/feed.xml`)
- [x] Sitemap (`/sitemap.xml`)
- [x] OpenGraph meta tags
- [x] Twitter Card meta tags

## In Progress

### Styling Refinements
- [ ] Fine-tune Mediumish theme colors and spacing
- [ ] Optimize typography for Chinese content
- [ ] Add syntax highlighting for code blocks (rehype-pretty-code)

## Pending

### Performance Optimizations
- [ ] Add image lazy loading with blur placeholders
- [ ] Optimize font loading
- [ ] Run Lighthouse audit and fix issues
- [ ] Add preconnect hints for CDN

### Additional Features
- [ ] Social sharing buttons (Twitter, Facebook, LinkedIn, Weibo, Douban, Zhihu)
- [ ] Table of Contents (TOC) component for long articles
- [ ] Reading progress indicator
- [ ] Dark mode toggle
- [ ] Search functionality (consider Pagefind or Algolia)

### Content Enhancements
- [ ] Add star rating display for book reviews
- [ ] Add `beforetoc` content support
- [ ] Handle `redirect_from` with static redirect files

### Deployment
- [ ] Set up GitHub Actions for automatic deployment
- [ ] Configure custom domain (hutusi.com)
- [ ] Set up CDN caching rules
- [ ] Add robots.txt customization

### Testing
- [ ] Verify all 73 posts render correctly
- [ ] Verify all 23 weeklies render correctly
- [ ] Test all redirects from old URLs
- [ ] Test RSS feed validation
- [ ] Test mobile responsiveness
- [ ] Cross-browser testing

## File Structure

```
hutusi-nextjs/
├── app/                    # Next.js App Router pages
│   ├── [year]/            # Year archive pages
│   ├── articles/          # Articles list and individual pages
│   ├── weeklies/          # Weeklies list and individual pages
│   ├── category/          # Category archive pages
│   ├── tag/               # Tag archive pages
│   ├── archive/           # Full archive page
│   ├── about/             # About page
│   ├── links/             # Links page
│   ├── subscription/      # Subscription page
│   ├── feed.xml/          # RSS feed route
│   └── sitemap.xml/       # Sitemap route
├── components/            # React components
│   ├── analytics/         # GA, Umami
│   ├── comments/          # Giscus, Disqus
│   ├── layout/            # Header, Footer
│   └── posts/             # PostCard, FeaturedCard, etc.
├── config/                # Site and navigation config
├── content/               # MDX content files
│   ├── posts/             # Blog posts
│   ├── weeklies/          # Weekly newsletters
│   └── pages/             # Static pages
├── lib/                   # Utility functions
├── scripts/               # Migration scripts
└── types/                 # TypeScript types
```

## Commands

```bash
# Development
bun run dev

# Build static site
bun run build

# Preview static build
bunx serve out

# Run migration script
bun run scripts/migrate-content.ts
```

## Notes

- All images are served from `cdn.hutusi.com/images`
- Static export generates files in `out/` directory
- Comments require JavaScript (client-side rendering)
- Analytics scripts load after page interaction
