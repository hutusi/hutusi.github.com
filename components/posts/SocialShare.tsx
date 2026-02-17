"use client";

import { siteConfig } from "@/config/site";
import { SiX, SiFacebook, SiLinkedin, SiSinaweibo, SiDouban, SiZhihu } from "react-icons/si";
import { TbMessageCircle } from "react-icons/tb";
import type { ReactNode } from "react";

interface SocialShareProps {
  title: string;
  url: string;
  commentCount?: number;
}

interface ShareLink {
  name: string;
  icon: ReactNode;
  getUrl: (title: string, url: string) => string;
}

const shareLinks: ShareLink[] = [
  {
    name: "X",
    icon: <SiX className="w-4 h-4" />,
    getUrl: (title, url) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "Facebook",
    icon: <SiFacebook className="w-4 h-4" />,
    getUrl: (_, url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "LinkedIn",
    icon: <SiLinkedin className="w-4 h-4" />,
    getUrl: (_, url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "微博",
    icon: <SiSinaweibo className="w-4 h-4" />,
    getUrl: (title, url) =>
      `https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "豆瓣",
    icon: <SiDouban className="w-4 h-4" />,
    getUrl: (title, url) =>
      `https://www.douban.com/share/service?name=${encodeURIComponent(title)}&href=${encodeURIComponent(url)}`,
  },
  {
    name: "知乎",
    icon: <SiZhihu className="w-4 h-4" />,
    getUrl: (title, url) =>
      `https://www.zhihu.com/qrcode?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
];

function ShareButton({ link, title, fullUrl }: { link: ShareLink; title: string; fullUrl: string }) {
  return (
    <a
      href={link.getUrl(title, fullUrl)}
      target="_blank"
      rel="noopener noreferrer"
      title={`分享到 ${link.name}`}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
    >
      {link.icon}
    </a>
  );
}

function CommentButton({ count }: { count?: number }) {
  const scrollToComments = () => {
    const el = document.getElementById("comments");
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={scrollToComments}
      title="跳转到评论"
      className="inline-flex items-center justify-center gap-1 w-9 h-9 rounded-full border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors relative"
    >
      <TbMessageCircle className="w-5 h-5" />
      {count != null && count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[var(--accent)] text-white text-[10px] font-medium leading-none">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

/**
 * Sticky sidebar version - shown on xl screens, positioned to the left of the article.
 */
export function SocialShareSidebar({ title, url, commentCount }: SocialShareProps) {
  const fullUrl = `${siteConfig.url}${url}`;

  return (
    <div className="hidden xl:flex fixed top-1/3 flex-col items-center gap-3 z-10" style={{ left: "max(1rem, calc((100vw - 56rem) / 2 - 4rem))" }}>
      <span className="text-xs text-[var(--foreground-muted)] mb-1">分享</span>
      {shareLinks.map((link) => (
        <ShareButton key={link.name} link={link} title={title} fullUrl={fullUrl} />
      ))}
      <div className="w-5 border-t border-[var(--border)]" />
      <CommentButton count={commentCount} />
    </div>
  );
}

/**
 * Inline version - shown below article content on smaller screens.
 */
export function SocialShareInline({ title, url, commentCount }: SocialShareProps) {
  const fullUrl = `${siteConfig.url}${url}`;

  return (
    <div className="flex xl:hidden items-center gap-2 flex-wrap">
      <span className="text-sm text-[var(--foreground-muted)]">分享到</span>
      {shareLinks.map((link) => (
        <ShareButton key={link.name} link={link} title={title} fullUrl={fullUrl} />
      ))}
      <div className="w-px h-6 bg-[var(--border)] mx-1" />
      <CommentButton count={commentCount} />
    </div>
  );
}

export default function SocialShare({ title, url, commentCount }: SocialShareProps) {
  return (
    <>
      <SocialShareSidebar title={title} url={url} commentCount={commentCount} />
      <SocialShareInline title={title} url={url} commentCount={commentCount} />
    </>
  );
}
