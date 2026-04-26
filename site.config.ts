export interface NavChildItem {
  name: string;
  url: string;
  external?: boolean;
  dividerBefore?: boolean; // render a separator line before this item
}

export interface NavItem {
  name: string;
  url: string;
  weight: number;
  external?: boolean;
  dropdown?: string[];
  children?: NavChildItem[]; // static sub-links rendered as a dropdown
}

// Defined up-front so footer.connect can reference these URLs without duplication
const social = {
  github: "https://github.com/hutusi/amytis",
  twitter: "https://twitter.com/hutusi",
  email: "mailto:huziyong@gmail.com",
};

export const siteConfig = {

  // ── Site identity ─────────────────────────────────────────────────────────
  title: { en: "hutusi.com", zh: "胡涂说" },
  logo: {
    // Path to navbar logo image served from public/ (leave empty for the default built-in icon)
    // Accepts SVG, PNG, etc. — e.g. "/logo.svg" or "/images/my-logo.png"
    src: "/logo-256x256.jpg",
    // Path to favicon served from public/ (defaults to /icon.svg)
    favicon: "/favicon.ico",
  },
  description: { en: "hutusi.com — a personal digital garden.", zh: "胡涂说博客/好奇心周刊" },
  baseUrl: "https://hutusi.com", // Replace with your actual domain
  ogImage: "/og-image.png", // Default OG/social preview image — place a 1200×630 PNG at public/og-image.png
  footerText: { en: `© ${new Date().getFullYear()} hutusi.com All rights reserved.`, zh: `© ${new Date().getFullYear()} hutusi.com 保留所有权利。` },

  // ── i18n ──────────────────────────────────────────────────────────────────
  i18n: {
    // Set enabled: false to disable multi-language support entirely.
    // The language switcher will be hidden and the defaultLocale is always used.
    // When disabled, all locale-aware fields (title, description, hero, etc.)
    // accept plain strings instead of { en: '...', zh: '...' } objects.
    enabled: false,
    defaultLocale: 'zh',
    locales: ['zh'],
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  nav: [
    { name: "Flow", url: "/flows", weight: 1 },
    { name: "Posts", url: "/articles", weight: 2 },
    { name: "Series", url: "/series", weight: 4, dropdown: ["weeklies"] },
    { name: "Books", url: "/books", weight: 6, dropdown: [] },
    { name: "About", url: "/about", weight: 7 },
    { name: "More", url: "", weight: 8, children: [
      { name: "Archive", url: "/archive" },
      { name: "Tags", url: "/tags" },
      { name: "Links", url: "/links" },
      { name: "Subscribe", url: "/subscribe", dividerBefore: true },
    ]},
  ] as NavItem[],

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    explore: [
      { name: "Archive", url: "/archive", weight: 1 },
      { name: "Tags", url: "/tags", weight: 2 },
      { name: "Links", url: "/links", weight: 3 },
      { name: "About", url: "/about", weight: 4 },
    ],
    connect: [
      { name: "GitHub", url: social.github, weight: 1 },
      { name: "X (Twitter)", url: social.twitter, weight: 2 },
      { name: "RSS Feed", url: "/feed.xml", weight: 3, external: true },
      { name: "Subscribe", url: "/subscribe", weight: 4 },
    ],
    builtWith: {
      show: true,
      url: "https://github.com/hutusi/amytis",
      text: { en: "Built with Amytis", zh: "基于 Amytis 构建" },
    },
    // Optional custom links shown in the footer bottom bar.
    // Common uses: ICP registration (China), PSB registration, cookie policy, sitemap, etc.
    // Example:
    // bottomLinks: [
    //   { text: '京ICP备12345678号', url: 'https://beian.miit.gov.cn/' },
    //   { text: 'Cookie Policy' },     // url is optional — renders as plain text
    // ],
    bottomLinks: [] as { text: string | Record<string, string>; url?: string }[],
  },

  // ── Social & sharing ──────────────────────────────────────────────────────
  social,
  share: {
    enabled: true,
    // Supported: twitter, facebook, linkedin, weibo, reddit, hackernews,
    //            telegram, bluesky, mastodon, douban, zhihu, copy
    platforms: ['twitter', 'facebook', 'linkedin', 'weibo', 'copy'],
  },
  subscribe: {
    substack: '',       // Substack publication URL, e.g., 'https://yourname.substack.com'
    telegram: '',       // Telegram channel URL, e.g., 'https://t.me/yourchannel'
    wechat: {
      qrCode: '',       // Path to QR image in public/, e.g., '/images/wechat-qr.png'
      account: '',      // WeChat official account ID/name shown below QR
    },
    email: '',          // Newsletter/mailing list URL (distinct from social.email contact address)
  },

  // ── Features ──────────────────────────────────────────────────────────────
  features: {
    posts: {
      enabled: true,
      name: { en: "Articles", zh: "文章" },
    },
    series: {
      enabled: true,
      name: { en: "Series", zh: "合辑" },
    },
    books: {
      enabled: false,
      name: { en: "Books", zh: "书籍" },
    },
    flow: {
      enabled: true,
      name: { en: "Flow", zh: "心流" },
    },
  },

  // ── Homepage ──────────────────────────────────────────────────────────────
  hero: {
    tagline: { en: "hutusi.com", zh: "胡涂说" },
    title: { en: "A home for ideas to grow, link, and evolve.", zh: "胡涂说博客/好奇心周刊" },
    subtitle: { en: "任抛星汉归园圃，留取乾坤盛酒囊", zh: "任抛星汉归园圃，留取乾坤盛酒囊" },
  },
  homepage: {
    sections: [
      { id: 'hero',            enabled: false, weight: 1 },
      { id: 'featured-posts',  enabled: true, weight: 2, maxItems: 4 },
      { id: 'latest-posts',    enabled: true, weight: 3, maxItems: 4 },
      { id: 'recent-flows',    enabled: true, weight: 4, maxItems: 8 },
      { id: 'featured-series', enabled: true, weight: 5, maxItems: 6 },
      { id: 'featured-books',  enabled: true, weight: 6, maxItems: 4 },
    ],
  },

  // ── Content ───────────────────────────────────────────────────────────────
  pagination: {
    posts: 10,
    series: 10,
    flows: 20,
    notes: 20,
  },
  posts: {
    basePath: 'articles', // Change to e.g. 'articles' to serve all posts at /articles/[slug]
    toc: true,
    showFuturePosts: false,
    includeDateInUrl: false,
    // trailingSlash is configured in next.config.ts (Next.js handles URL normalization)
    authors: {
      // Default author names applied when a post has no author in its frontmatter.
      // Falls back to series authors first, then to this list.
      default: ["胡涂说"] as string[],
      showInHeader: false,   // Show author byline below the post title
      showAuthorCard: true, // Show author bio card at the end of the post
    },
    // Series slugs whose posts are hidden from the main posts listing.
    // Posts remain accessible via their series page and direct URLs.
    excludeFromListing: [ "weeklies" ] as string[],
    archive: {
      showAuthors: false,
    },
  },
  series: {
    // When true, posts in a series are served at /[series-slug]/[post-slug]
    // instead of the default posts basePath. Defaults to true.
    // customPaths entries always take precedence over autoPaths.
    autoPaths: false,
    // Per-series custom URL prefix for posts within that series.
    // Overrides autoPaths for the specified series.
    // e.g., { 'weeklies': 'weeklies' } → posts served at /weeklies/[slug]
    customPaths: {
      weeklies: 'weeklies',
    } as Record<string, string>,
  },
  flows: {
    recentCount: 5,
  },
  feed: {
    maxItems: 20,                                           // Max items per feed (0 = no limit)
    format: 'rss' as 'rss' | 'atom' | 'both',              // Format(s) to serve and advertise
    content: 'full' as 'excerpt' | 'full',                  // Full post content or excerpt only
    includeFlows: false,                                    // Include flow notes alongside posts
  },

  // ── Images ────────────────────────────────────────────────────────────────
  images: {
    // CDN base URL for serving images (leave empty to serve locally)
    // e.g., "https://cdn.example.com" or "https://your-bucket.r2.dev"
    // When set, local image paths like /posts/slug/images/cover.jpg are rewritten
    // to https://cdn.example.com/posts/slug/images/cover.jpg at render time.
    cdnBaseUrl: "https://cdn.hutusi.com/images",
  },

  // ── Appearance ────────────────────────────────────────────────────────────
  themeColor: 'default', // 'default' | 'blue' | 'rose' | 'amber'

  // ── Browser compatibility warning ─────────────────────────────────────────
  browserCheck: {
    // URL shown in the outdated-browser banner. Set to '' to hide the link
    // (useful for corporate/intranet deployments where IT manages upgrades).
    updateUrl: 'https://browsehappy.com/',
  },

  // ── Analytics ─────────────────────────────────────────────────────────────
  analytics: {
    providers: ['umami', 'google'] as ('umami' | 'plausible' | 'google')[], // enable one or many; [] disables analytics
    umami: {
      websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || 'b1ffb0b8-732a-4655-a850-ec5e0b5c2b1b', // Your Umami Website ID
      src: process.env.NEXT_PUBLIC_UMAMI_URL || 'https://umami-pied-delta-28.vercel.app/script.js', // Default or self-hosted URL
    },
    plausible: {
      domain: '', // Your domain
      src: 'https://plausible.io/js/script.js',
    },
    google: {
      measurementId: 'G-MCBGNJDDPS', // G-XXXXXXXXXX
    },
  },

  // ── Comments ──────────────────────────────────────────────────────────────
  comments: {
    provider: 'giscus', // 'giscus' | 'disqus' | null
    // Per-category defaults. Set false to disable comments for an entire content type.
    // Individual pages can override with `commentable: true/false` in their frontmatter.
    commentable: {
      posts: true,
      flows: true,
      notes: true,
      bookChapters: true,
      staticPages: true,
    },
    giscus: {
      repo: 'hutusi/hutusi.github.com', // username/repo
      repoId: 'MDEwOlJlcG9zaXRvcnkzNjc5MDgy',
      category: 'Comments',
      categoryId: 'DIC_kwDOADgjas4COYln',
    },
    disqus: {
      shortname: 'hutusi',
    },
  },

  // ── Authors ───────────────────────────────────────────────────────────────
  authors: {
    // Map display name (as used in post frontmatter) to author profile.
    // Example:
    // "Author Name": {
    //   bio: "Short bio shown in author card below each post.",
    //   avatar: "/images/authors/author-name.jpg", // path under public/
    //   social: [
    //     { image: "/images/authors/wechat-qr.jpg", description: "WeChat Official Account" },
    //   ],
    // },
    "胡涂说": {
      bio: "前软件工程师，现 Vibe Coder，读书/写作爱好者",
      avatar: "/logo-256x256.jpg",
      social: [
        { image: "/images/qrcode-hututalk-8cm.jpg", description: "文章在微信公众号同步发布" },
      ],
    },
  } as Record<string, {
    bio?: string;
    avatar?: string;  // Avatar image path served from public/
    social?: Array<{
      image: string;       // Social image (e.g. QR code) path served from public/
      description: string; // Label shown below the image
    }>;
  }>,

};
