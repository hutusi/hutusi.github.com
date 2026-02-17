"use client";

import { siteConfig } from "@/config/site";

interface SocialShareProps {
  title: string;
  url: string;
}

const shareLinks = [
  {
    name: "Twitter",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    getUrl: (title: string, url: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.044 1.613.115v3.146c-.427-.044-.72-.065-.95-.065-1.35 0-1.872.513-1.872 1.846v2.516h3.681l-.736 3.667h-2.945v8.169A12.09 12.09 0 0 0 12 24c-1.014 0-2-.135-2.899-.309z" />
      </svg>
    ),
    getUrl: (_title: string, url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    getUrl: (title: string, url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "微博",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.737 5.439l-.002.004zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.583.631.275.817.977.442 1.574zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.18.573h.014zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.644 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.581-.18-.404-.649.396-1.016.436-1.891.009-2.517-.795-1.17-2.966-1.108-5.465-.034 0 0-.783.344-.583-.279.384-1.209.326-2.22-.273-2.806-1.357-1.327-4.971.047-8.073 3.065C1.356 10.607 0 12.97 0 15.015c0 3.907 5.009 6.285 9.91 6.285 6.425 0 10.698-3.738 10.698-6.706 0-1.793-1.512-2.811-2.545-3.145zm2.135-5.677c-.583-.654-1.449-.982-2.378-.982-.078 0-.153 0-.231.009-.18.018-.317.162-.297.344.018.18.162.315.342.297.06-.006.118-.009.18-.009.747 0 1.44.264 1.908.789.468.527.664 1.217.557 1.947-.027.18.096.346.276.374h.049c.168 0 .311-.12.338-.279.132-.909-.111-1.764-.693-2.49h-.051zm1.482-1.67c-1.033-1.158-2.559-1.737-4.199-1.737-.135 0-.27.006-.399.018a.321.321 0 0 0-.296.345c.018.18.162.312.345.294.112-.009.231-.015.348-.015 1.455 0 2.808.513 3.726 1.542.918 1.023 1.322 2.379 1.107 3.814-.027.18.099.345.279.371h.046c.168 0 .312-.12.338-.279.24-1.617-.213-3.146-1.24-4.353h-.055z" />
      </svg>
    ),
    getUrl: (title: string, url: string) =>
      `https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "豆瓣",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M.643 0H23.37v3.306H.643V0zM2.122 4.702h19.77v1.652H2.122V4.702zm1.23 3.306h17.295l-1.228 7.39H17.28l.86-5.12H5.871l.86 5.12H4.58L3.352 8.008zm-1.23 9.66h19.77v1.654H2.122v-1.654zM4.703 24l3.382-5.39h1.89L6.596 24H4.703zm8.81-5.39h1.89L18.785 24h-1.89l-3.382-5.39z" />
      </svg>
    ),
    getUrl: (title: string, url: string) =>
      `https://www.douban.com/share/service?name=${encodeURIComponent(title)}&href=${encodeURIComponent(url)}`,
  },
  {
    name: "知乎",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M5.721 0C2.251 0 0 2.25 0 5.719V18.28C0 21.751 2.252 24 5.721 24h12.56C21.751 24 24 21.75 24 18.281V5.72C24 2.249 21.75 0 18.281 0zm1.964 4.078h6.789v1.5h-2.73l.236 6.211h2.88l-1.238 7.313h-1.615l1.24-5.876h-1.424l-1.2 5.876H9.075l.658-3.563h1.56l-.418 2.126h1.238l.661-3h-3.36l-.073-1.5h3.32L12.6 7.016H9.921l.072 1.5H8.431l-.072-1.5H7.687v-1.5h.559L8.173 4.7h-.488v-1.5-.122zm8.49 2.555c.09 0 .2.04.223.115l.663 2.15h1.96l-.237.75h-1.544l1.605 4.966c.03.09-.06.172-.15.142l-1.473-.47-.96-3.453-1.2 3.453-1.47.47c-.09.03-.18-.052-.15-.142l1.605-4.966H14.16l-.237-.75h1.61l.69-2.15a.24.24 0 0 1 .152-.115zM7.912 16.47h4.676l-.298 1.5H8.21z" />
      </svg>
    ),
    getUrl: (title: string, url: string) =>
      `https://www.zhihu.com/qrcode?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
];

function ShareButton({ link, title, fullUrl }: { link: typeof shareLinks[number]; title: string; fullUrl: string }) {
  return (
    <a
      href={link.getUrl(title, fullUrl)}
      target="_blank"
      rel="noopener noreferrer"
      title={`分享到 ${link.name}`}
      className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
    >
      {link.icon}
    </a>
  );
}

/**
 * Sticky sidebar version - shown on xl screens, positioned to the left of the article.
 */
export function SocialShareSidebar({ title, url }: SocialShareProps) {
  const fullUrl = `${siteConfig.url}${url}`;

  return (
    <div className="hidden xl:flex fixed top-1/3 flex-col items-center gap-3 z-10" style={{ left: "max(1rem, calc((100vw - 56rem) / 2 - 4rem))" }}>
      <span className="text-xs text-[var(--foreground-muted)] mb-1">分享</span>
      {shareLinks.map((link) => (
        <ShareButton key={link.name} link={link} title={title} fullUrl={fullUrl} />
      ))}
    </div>
  );
}

/**
 * Inline version - shown below article content on smaller screens.
 */
export function SocialShareInline({ title, url }: SocialShareProps) {
  const fullUrl = `${siteConfig.url}${url}`;

  return (
    <div className="flex xl:hidden items-center gap-2 flex-wrap">
      <span className="text-sm text-[var(--foreground-muted)]">分享到</span>
      {shareLinks.map((link) => (
        <ShareButton key={link.name} link={link} title={title} fullUrl={fullUrl} />
      ))}
    </div>
  );
}

export default function SocialShare({ title, url }: SocialShareProps) {
  return (
    <>
      <SocialShareSidebar title={title} url={url} />
      <SocialShareInline title={title} url={url} />
    </>
  );
}
