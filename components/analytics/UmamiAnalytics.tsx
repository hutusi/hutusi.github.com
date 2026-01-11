"use client";

import Script from "next/script";
import { siteConfig } from "@/config/site";

export default function UmamiAnalytics() {
  const { src, websiteId } = siteConfig.analytics.umami;

  if (!src || !websiteId) return null;

  return (
    <Script
      defer
      src={src}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
