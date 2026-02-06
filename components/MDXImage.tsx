"use client";

import { getImageUrl } from "@/lib/utils";
import Image from "next/image";

interface MDXImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
}

export default function MDXImage({ src, alt, ...props }: MDXImageProps) {
  const imageUrl = getImageUrl(src);
  
  // If it's an external URL (that is not our CDN), use standard img tag
  // But getImageUrl handles our CDN logic.
  // We can just use standard img tag with the resolved URL for simplicity
  // and to avoid Next.js Image component complexity with remote patterns if not needed.
  // However, using standard img tag is safer for Markdown content that might have various sources.
  
  return (
    <img
      src={imageUrl}
      alt={alt || ""}
      {...props}
      className={`rounded-lg max-w-full h-auto ${props.className || ""}`}
    />
  );
}
