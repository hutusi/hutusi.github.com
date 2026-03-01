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
    defaultLocale: 'zh',
    locales: ['en', 'zh'],
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  nav: [
    { name: "Flow", url: "/flows", weight: 1 },
    { name: "Posts", url: "/articles", weight: 2 },
    { name: "Series", url: "/series", weight: 3, dropdown: ["digital-garden", "markdown-showcase", "ai-nexus-weekly"] },
    { name: "Books", url: "/books", weight: 4, dropdown: [] },
    { name: "About", url: "/about", weight: 5 },
    { name: "More", url: "", weight: 6, children: [
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
      { name: "Twitter", url: social.twitter, weight: 2 },
      { name: "RSS Feed", url: "/feed.xml", weight: 3 },
      { name: "Subscribe", url: "/subscribe", weight: 4 },
    ],
    builtWith: {
      show: true,
      url: "https://github.com/hutusi/amytis",
      text: { en: "Built with Amytis", zh: "基于 Amytis 构建" },
    },
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
      name: { en: "Series", zh: "辑录" },
    },
    books: {
      enabled: false,
      name: { en: "Books", zh: "书籍" },
    },
    flow: {
      enabled: true,
      name: { en: "Flow", zh: "语丝" },
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
      { id: 'hero',            enabled: true, weight: 1 },
      { id: 'featured-posts',  enabled: true, weight: 2, maxItems: 4 },
      { id: 'latest-posts',    enabled: true, weight: 3, maxItems: 3 },
      { id: 'recent-flows',    enabled: true, weight: 4, maxItems: 8 },
      { id: 'featured-series', enabled: true, weight: 5, maxItems: 6, scrollThreshold: 2 },
      { id: 'featured-books',  enabled: true, weight: 6, maxItems: 4 },
    ],
  },

  // ── Content ───────────────────────────────────────────────────────────────
  pagination: {
    posts: 10,
    series: 5,
    flows: 20,
    notes: 20,
  },
  posts: {
    basePath: 'articles', // Change to e.g. 'articles' to serve all posts at /articles/[slug]
    toc: true,
    showFuturePosts: false,
    includeDateInUrl: false,
    // trailingSlash is configured in next.config.ts (Next.js handles URL normalization)
    archive: {
      showAuthors: true,
    },
  },
  series: {
    // Per-series custom URL prefix for posts within that series
    // e.g., { 'weeklies': 'weeklies' } → posts served at /weeklies/[slug]
    customPaths: {
      weeklies: 'weeklies',
    } as Record<string, string>,
  },
  flows: {
    recentCount: 5,
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
    provider: 'umami', // 'umami' | 'plausible' | 'google' | null
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
    // Map display name (as used in post frontmatter) to author profile
    // "Author Name": { bio: "Short bio shown in author card below each post." },
  } as Record<string, { bio?: string }>,

};
