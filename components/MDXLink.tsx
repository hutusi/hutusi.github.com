"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";

interface MDXLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

export default function MDXLink({ href, children, ...props }: MDXLinkProps) {
  if (!href) {
    return <a {...props}>{children}</a>;
  }

  const isInternalLink = href.startsWith("/") || href.startsWith("#");
  const isExternalLink = href.startsWith("http");
  const isSameSite = href.startsWith(siteConfig.url);

  if (isInternalLink) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  if (isExternalLink && !isSameSite) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
