import { getAllWeeklies, getWeeklyBySlug, getAdjacentPosts } from "@/lib/content";
import { formatDate, getImageUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import Comments from "@/components/comments/Comments";
import MDXImage from "@/components/MDXImage";
import MDXLink from "@/components/MDXLink";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const weekly = await getWeeklyBySlug(slug);

  if (!weekly) {
    return { title: "Not Found" };
  }

  return {
    title: weekly.title,
    description: weekly.description || weekly.excerpt,
    openGraph: {
      title: weekly.title,
      description: weekly.description || weekly.excerpt,
      type: "article",
      publishedTime: weekly.date,
      authors: [siteConfig.author.name],
      images: weekly.image ? [getImageUrl(weekly.image)] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const weeklies = await getAllWeeklies();
  return weeklies.map((weekly) => ({ slug: weekly.slug }));
}

export default async function WeeklyPage({ params }: Props) {
  const { slug } = await params;
  const weekly = await getWeeklyBySlug(slug);

  if (!weekly) {
    notFound();
  }

  const { prev, next } = await getAdjacentPosts(slug, "weekly");

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <div className="text-sm text-[var(--accent)] font-medium mb-2">
          <Link href="/weeklies/" className="hover:underline">
            周刊
          </Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {weekly.title}
        </h1>
        {weekly.subtitle && (
          <p className="text-xl text-gray-600 mb-4">{weekly.subtitle}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <time dateTime={weekly.date}>{formatDate(weekly.date)}</time>
          <span>·</span>
          <span>{weekly.readingTime} min read</span>
        </div>
        {weekly.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {weekly.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="tag"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <MDXRemote
          source={weekly.content}
          components={{
            img: MDXImage,
            a: MDXLink,
          }}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                [
                  rehypePrettyCode,
                  {
                    theme: {
                      dark: "github-dark",
                      light: "github-light",
                    },
                    keepBackground: false,
                  },
                ],
              ],
              format: "md",
            },
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-between gap-4">
          {prev ? (
            <Link
              href={prev.url}
              className="flex-1 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-sm text-gray-500 mb-1">← 上一期</div>
              <div className="font-medium text-gray-900 line-clamp-2">
                {prev.title}
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              href={next.url}
              className="flex-1 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-right"
            >
              <div className="text-sm text-gray-500 mb-1">下一期 →</div>
              <div className="font-medium text-gray-900 line-clamp-2">
                {next.title}
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </nav>

      {/* Comments */}
      <Comments url={weekly.url} identifier={weekly.slug} title={weekly.title} />

      {/* Author */}
      <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-4">
          <img
            src={siteConfig.author.avatar}
            alt={siteConfig.author.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <div className="font-medium text-[var(--foreground)]">
              {siteConfig.author.fullName}
            </div>
            <div className="text-sm text-[var(--foreground-muted)]">{siteConfig.author.bio}</div>
          </div>
        </div>

        {siteConfig.social.wechat && (
          <div className="flex flex-col items-center gap-2">
            <img
              src={siteConfig.social.wechat}
              alt="WeChat QR Code"
              className="w-24 h-24 rounded-lg border border-[var(--border-light)] shadow-sm"
            />
            <span className="text-xs text-[var(--foreground-muted)]">关注公众号：胡涂说</span>
          </div>
        )}
      </div>
    </article>
  );
}
