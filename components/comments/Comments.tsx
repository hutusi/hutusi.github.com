"use client";

import { useState } from "react";
import GiscusComments from "./GiscusComments";
import DisqusComments from "./DisqusComments";
import { siteConfig } from "@/config/site";

interface CommentsProps {
  url: string;
  identifier: string;
  title: string;
}

export default function Comments({ url, identifier, title }: CommentsProps) {
  const [activeTab, setActiveTab] = useState<"giscus" | "disqus">("giscus");
  const [disqusLoaded, setDisqusLoaded] = useState(false);

  const handleTabChange = (tab: "giscus" | "disqus") => {
    setActiveTab(tab);
    if (tab === "disqus" && !disqusLoaded) {
      setDisqusLoaded(true);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200" id="comments">
      <h2 className="section-title text-2xl font-bold text-gray-900 mb-6">评论</h2>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => handleTabChange("giscus")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "giscus"
              ? "bg-[var(--accent)] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Giscus
        </button>
        <button
          onClick={() => handleTabChange("disqus")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "disqus"
              ? "bg-[var(--accent)] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Disqus
        </button>
      </div>

      <div className={activeTab === "giscus" ? "block" : "hidden"}>
        <GiscusComments />
      </div>

      <div className={activeTab === "disqus" ? "block" : "hidden"}>
        {disqusLoaded ? (
          <DisqusComments
            url={`${siteConfig.url}${url}`}
            identifier={identifier}
            title={title}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            点击 Disqus 标签加载评论...
          </div>
        )}
      </div>
    </div>
  );
}
