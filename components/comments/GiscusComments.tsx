"use client";

import Giscus from "@giscus/react";
import { siteConfig } from "@/config/site";

export default function GiscusComments() {
  return (
    <Giscus
      repo={siteConfig.comments.giscus.repo}
      repoId={siteConfig.comments.giscus.repoId}
      category={siteConfig.comments.giscus.category}
      categoryId={siteConfig.comments.giscus.categoryId}
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="light"
      lang="zh-CN"
      loading="lazy"
    />
  );
}
