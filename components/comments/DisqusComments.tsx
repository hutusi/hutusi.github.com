"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";

interface DisqusCommentsProps {
  url: string;
  identifier: string;
  title: string;
}

export default function DisqusComments({
  url,
  identifier,
  title,
}: DisqusCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const disqusConfig = function (this: {
      page: { url: string; identifier: string; title: string };
    }) {
      this.page.url = url;
      this.page.identifier = identifier;
      this.page.title = title;
    };

    // @ts-expect-error - Disqus global
    if (window.DISQUS) {
      // @ts-expect-error - Disqus global
      window.DISQUS.reset({
        reload: true,
        config: disqusConfig,
      });
    } else {
      // @ts-expect-error - Disqus global
      window.disqus_config = disqusConfig;

      const script = document.createElement("script");
      script.src = `https://${siteConfig.comments.disqus.shortname}.disqus.com/embed.js`;
      script.setAttribute("data-timestamp", String(+new Date()));
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      // Cleanup if needed
    };
  }, [url, identifier, title]);

  return <div id="disqus_thread" ref={containerRef} className="min-h-[200px]" />;
}
