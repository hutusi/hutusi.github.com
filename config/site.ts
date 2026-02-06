export const siteConfig = {
  title: "胡涂说",
  name: "胡涂说",
  description: "hutusi.com",
  url: "https://hutusi.com",
  logo: {
    text: "胡涂说",
    // image: undefined as string | undefined,
    image: "https://cdn.hutusi.com/images/site/logo-256x256.jpg",
    icon: "胡",
  },
  author: {
    name: "hutusi",
    fullName: "胡智勇",
    email: "huziyong@gmail.com",
    url: "https://hutusi.com",
    bio: "前软件工程师，现 Vibe Coding Engineer，读书/写作爱好者",
    avatar: "https://cdn.hutusi.com/images/site/avatar.jpg",
  },
  social: {
    twitter: "https://twitter.com/user/hutusi",
    github: "https://github.com/hutusi",
    instagram: "https://instagram.com/hutusi",
    facebook: "https://facebook.com/hutusi",
    wechat: "https://cdn.hutusi.com/images/site/qrcode_for_hututalk_8cm.jpg",
  },
  imagesBaseUrl: "https://cdn.hutusi.com/images",
  defaultImage: "/assets/images/4.jpg",
  featuredImage: "/site/logo-256x256.jpg",
  copyright: "胡涂说 hutusi.com",
  icpInfo: "沪ICP备19043788号-1",
  postsPerPage: 9,
  analytics: {
    googleAnalytics: "G-MCBGNJDDPS",
    umami: {
      src: "https://umami-pied-delta-28.vercel.app/script.js",
      websiteId: "b1ffb0b8-732a-4655-a850-ec5e0b5c2b1b",
    },
  },
  comments: {
    giscus: {
      repo: "hutusi/hutusi.github.com" as `${string}/${string}`,
      repoId: "MDEwOlJlcG9zaXRvcnkzNjc5MDgy",
      category: "Comments",
      categoryId: "DIC_kwDOADgjas4COYln",
    },
    disqus: {
      shortname: "hutusi",
    },
  },
};

export type SiteConfig = typeof siteConfig;
