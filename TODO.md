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

### Visual Design Improvements

#### Phase 1: Foundation ✓
- [x] Update color palette and CSS variables in globals.css
  - Add surface colors (--background-elevated)
  - Add semantic foreground colors (--foreground-secondary, --foreground-muted)
  - Add accent variations (--accent-light, --accent-lighter)
  - Add shadow variables (--shadow-sm, --shadow-md, --shadow-lg)
- [x] Optimize typography for Chinese content
  - Add Chinese fonts (Noto Sans SC, PingFang SC, Microsoft YaHei)
  - Increase letter-spacing for Chinese text (0.02em)
  - Add text-align: justify for prose paragraphs
- [x] Add section title accent styling
  - Use ::before pseudo-element for accent bar

#### Phase 2: Core Styling ✓
- [x] Improve card styling with better shadows and transitions
  - Add subtle border (1px solid var(--border-light))
  - Add translateY(-2px) lift effect on hover
  - Use cubic-bezier transition timing
- [x] Redesign Header with frosted glass effect
  - Add backdrop-blur-md and bg-white/80
  - Create logo icon with gradient background
  - Improve navigation link hover states
  - Add active state indicator for current page
- [x] Redesign Footer with multi-column layout
  - Add gradient background
  - Create link sections (探索, 关于)
  - Improve social icon styling with circular buttons
- [x] Update tag and category pill styling
  - Add gradient backgrounds using accent colors
  - Add scale(1.05) transform on hover

#### Phase 3: Component Enhancements ✓
- [x] Enhance PostCard with image effects and badges
  - Add image scale effect on hover (group-hover:scale-105)
  - Add gradient overlay on image hover
  - Add category badge in top-left corner
- [x] Add page transition animations
  - Create fadeIn keyframe animation
  - Add .animated-underline for links
  - Add stagger animation for lists
- [x] Enhance FeaturedSection with bento grid layout
  - Create hero + secondary card layout (hero spans 2 cols)
  - Add gradient overlay for text readability
  - Add FeaturedCard variants (hero, compact, default)

#### Phase 4: Advanced Features
- [ ] Implement dark mode support
  - Add @media (prefers-color-scheme: dark) CSS variables
  - Create ThemeProvider component
  - Add theme toggle button in Header
- [ ] Add reading progress indicator
  - Fixed position below header
  - Track scroll progress through article
- [ ] Create Table of Contents component for articles
  - Parse headings from MDX content
  - Create sticky sidebar on desktop
  - Highlight current section on scroll

### Other Styling
- [ ] Add syntax highlighting for code blocks (rehype-pretty-code)

## Pending

### Performance Optimizations
- [ ] Add image lazy loading with blur placeholders
- [ ] Optimize font loading
- [ ] Run Lighthouse audit and fix issues
- [ ] Add preconnect hints for CDN

### Additional Features
- [ ] Social sharing buttons (Twitter, Facebook, LinkedIn, Weibo, Douban, Zhihu)
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
