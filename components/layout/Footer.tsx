import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Branding */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 group mb-3">
              {siteConfig.logo?.image ? (
                <img 
                  src={siteConfig.logo.image} 
                  alt={siteConfig.logo.text || siteConfig.title} 
                  className="w-8 h-8 rounded-lg"
                />
              ) : siteConfig.logo?.icon ? (
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  {siteConfig.logo.icon}
                </span>
              ) : null}
              <span className="text-xl font-bold text-gray-900 group-hover:text-[var(--accent)] transition-colors">
                {siteConfig.logo?.text || siteConfig.title}
              </span>
            </Link>
            <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed max-w-sm mb-4">
              {siteConfig.author.bio}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {siteConfig.social.github && (
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--background-elevated)] border border-[var(--border-light)] text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                  aria-label="GitHub"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}
              {siteConfig.social.twitter && (
                <a
                  href={siteConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--background-elevated)] border border-[var(--border-light)] text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              <Link
                href="/feed.xml"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--background-elevated)] border border-[var(--border-light)] text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                aria-label="RSS Feed"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* 探索 Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">探索</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/articles/" className="text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors">
                  文章
                </Link>
              </li>
              <li>
                <Link href="/weeklies/" className="text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors">
                  周刊
                </Link>
              </li>
              <li>
                <Link href="/archive/" className="text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors">
                  归档
                </Link>
              </li>
              <li>
                <Link href="/tags/" className="text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors">
                  标签
                </Link>
              </li>
            </ul>
          </div>

          {/* 关于 Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">关于</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about/" className="text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors">
                  关于我
                </Link>
              </li>
              <li>
                <Link href="/links/" className="text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors">
                  友情链接
                </Link>
              </li>
              <li>
                <Link href="/subscription/" className="text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors">
                  订阅
                </Link>
              </li>
              <li>
                <Link href="/feed.xml" className="text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors">
                  RSS
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[var(--border)] text-center text-sm text-[var(--foreground-muted)]">
          <p>
            &copy; {currentYear} {siteConfig.copyright}
          </p>
          <p className="mt-1 text-xs">
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              {siteConfig.icpInfo}
            </a>
            <span className="mx-2">·</span>
            Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              Next.js
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
