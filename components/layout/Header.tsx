"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { navigation } from "@/config/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[var(--background-elevated)]/80 backdrop-blur-md border-b border-[var(--border-light)] z-50">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          {/* Logo icon */}
          {siteConfig.logo?.image ? (
            <img 
              src={siteConfig.logo.image} 
              alt={siteConfig.logo.text || siteConfig.title} 
              className="w-8 h-8 rounded-lg"
            />
          ) : siteConfig.logo?.icon ? (
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {siteConfig.logo.icon}
            </span>
          ) : null}
          <span className="text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
            {siteConfig.logo?.text || siteConfig.title}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(item.href)
                  ? "text-[var(--accent)] bg-[var(--accent-lighter)]"
                  : "text-[var(--foreground-secondary)] hover:text-[var(--accent)] hover:bg-[var(--border-light)]"
              }`}
            >
              {item.title}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button and Theme Toggle */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 text-[var(--foreground-secondary)] hover:text-[var(--accent)] hover:bg-[var(--border-light)] rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[var(--background-elevated)]/95 backdrop-blur-md border-t border-[var(--border-light)]">
          <div className="max-w-6xl mx-auto px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? "text-[var(--accent)] bg-[var(--accent-lighter)]"
                    : "text-[var(--foreground-secondary)] hover:text-[var(--accent)] hover:bg-[var(--border-light)]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
