export const navigation = [
  { title: "关于", href: "/about" },
  { title: "文章", href: "/articles" },
  { title: "周刊", href: "/weeklies" },
  { title: "归档", href: "/archive" },
  { title: "标签", href: "/tags" },
  { title: "链接", href: "/links" },
  { title: "订阅", href: "/subscription" },
];

export type NavigationItem = (typeof navigation)[number];
