"use client";

import { useState, useEffect } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector("article");
      if (!article) return;

      const { top, height } = article.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollableHeight = height - viewportHeight;

      if (scrollableHeight <= 0) {
        setProgress(100);
        return;
      }

      const scrolled = Math.max(0, -top);
      const percentage = Math.min(100, Math.max(0, (scrolled / scrollableHeight) * 100));
      setProgress(percentage);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-16 left-0 right-0 h-0.5 bg-[var(--border-light)] z-40">
      <div
        className="h-full bg-gradient-to-r from-[var(--accent)] to-emerald-400 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
