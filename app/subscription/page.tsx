import { getPageContent } from "@/lib/content";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "订阅",
  description: "订阅胡涂说",
};

export default async function SubscriptionPage() {
  const page = await getPageContent("subscription");

  if (!page) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">订阅</h1>
        <p>内容加载中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{page.title}</h1>
      <div className="prose prose-lg max-w-none">
        <MDXRemote
          source={page.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              format: "md",
            },
          }}
        />
      </div>
    </div>
  );
}
